import { Router } from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";

const router = Router();

router.get("/login", (req, res) => res.render("auth/login", { title: "Login" }));
router.get("/register", (req, res) => res.render("auth/register", { title: "Register" }));

router.post(
  "/register",
  body("name").isLength({ min: 2 }).trim(),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("auth/register", { title: "Register", errors: errors.array() });
    }
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res
        .status(400)
        .render("auth/register", { title: "Register", errors: [{ msg: "Email already used" }] });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), passwordHash });
    req.login({ id: user.id, role: user.role, name: user.name, email: user.email }, (err) => {
      if (err) return res.status(500).send("Login failed");
      return res.redirect("/dashboard");
    });
  }
);

router.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("auth/login", { title: "Login", errors: errors.array() });
    }
    next();
  },
  passport.authenticate("local", { failureRedirect: "/auth/login" }),
  (req, res) => res.redirect("/dashboard")
);

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

export default router;
