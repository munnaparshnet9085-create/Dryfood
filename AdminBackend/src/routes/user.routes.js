const express = require("express");
const router = express.Router();
const passport = require("passport");


const {
  signup,
  login,
  forgotPassword,
  verifyOTP,
  resetPasswordAfterOTP,
  googleLoginSuccess,
  authController,
  googleCallback
} = require("../controllers/user.controller");

router.get("/test", (req, res) => {
  res.send("Auth route is working");
});
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPasswordAfterOTP);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);


module.exports = router;
