const User = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const { generateToken, generateResetToken } = require("../utils/generateTocken");
const { sendEmail } = require("../services/email.service");

// ============ SIGNUP ============
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashed
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Signup successful",
      token,
      user
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ============ LOGIN ============
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============ FORGOT PASSWORD ============
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const html = `
      <h2>Hello ${user.name},</h2>
      <p>Your password reset OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
    `;

    await sendEmail(user.email, "Password Reset OTP", html);

    res.status(200).json({ message: "OTP sent to your email" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ============ RESET PASSWORD ============
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({
      email,
      resetOTP: otp,
      resetOTPExpiry: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.isOTPVerified = true;   // temporary flag
    await user.save();

    res.json({ message: "OTP verified successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.resetPasswordAfterOTP = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email });

    if (!user || !user.isOTPVerified)
      return res.status(400).json({ message: "OTP not verified" });

    const hashed = await hashPassword(newPassword);

    user.password = hashed;
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    user.isOTPVerified = false;

    await user.save();

    res.json({ message: "Password changed successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;
    const token = generateToken(user._id);

    res.json({
      message: "Google login successful",
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


