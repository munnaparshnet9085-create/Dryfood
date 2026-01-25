const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model")
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

