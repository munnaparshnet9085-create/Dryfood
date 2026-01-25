const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};
const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
module.exports = { generateResetToken, generateToken };

