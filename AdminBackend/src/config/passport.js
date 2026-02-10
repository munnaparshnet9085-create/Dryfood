const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user.model")
const jwt = require("jsonwebtoken"); // ✅ REQUIRED

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1️⃣ Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        // 2️⃣ If not, create a new user
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.photos[0].value,
          });
        }

        // 3️⃣ Pass user to callback
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);


passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:5000/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails", "photos"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Facebook may NOT return email
        const email =
          profile.emails?.[0]?.value || null;

        let user = await User.findOne({ facebookId: profile.id });

        // If not found by facebookId, try email (Google user case)
        if (!user && email) {
          user = await User.findOne({ email });
        }

        if (!user) {
          user = await User.create({
            facebookId: profile.id,
            name: profile.displayName,
            email, // can be null
            picture: profile.photos?.[0]?.value || null,
            provider: "facebook",
            isOTPVerified: true,
            isProfileComplete: !!email, // false if email missing
          });
        } else if (!user.facebookId) {
          user.facebookId = profile.id;
          user.provider = "facebook";
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

