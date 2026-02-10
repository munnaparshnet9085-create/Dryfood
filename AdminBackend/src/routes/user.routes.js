const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken"); 
const {signup,login,forgotPassword,verifyOTP,resetPasswordAfterOTP,googleCallback} = require("../controllers/user.controller");

router.get("/test", (req, res) => {res.send("Auth route is working");});
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPasswordAfterOTP);
router.get("/google",passport.authenticate("google", {scope: ["profile", "email"]}));
router.get("/google/callback",passport.authenticate("google", { session: false }),googleCallback);
router.get("/facebook",passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback",passport.authenticate("facebook", { session: false }),
(req, res) => {const user = req.user;const token = jwt.sign({ id: user._id },process.env.JWT_SECRET,{ expiresIn: "7d" });
return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user,
    });
  }
);
module.exports = router;
