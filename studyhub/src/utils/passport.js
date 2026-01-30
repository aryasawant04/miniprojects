import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const LocalStrategy = passportLocal.Strategy;

export function configurePassport(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() }).lean(false);
        if (!user) return done(null, false, { message: "Invalid credentials" });
        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return done(null, false, { message: "Invalid credentials" });
        return done(null, { id: user.id, role: user.role, name: user.name, email: user.email });
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
}
