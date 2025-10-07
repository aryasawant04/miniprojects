import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import methodOverride from "method-override";
import csrf from "csurf";
import mongoose from "mongoose";
import passport from "passport";
import { fileURLToPath } from "url";
import { configurePassport } from "./utils/passport.js";
import routes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/studyhub";
await mongoose.connect(MONGODB_URI);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use(session({
  secret: process.env.SESSION_SECRET || "changeme",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  cookie: { secure: false, httpOnly: true, sameSite: "lax" }
}));

configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

const csrfProtection = csrf();
app.use((req, res, next) => {
  if (req.path.startsWith("/api/ai")) return next();
  return csrfProtection(req, res, next);
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : null;
  next();
});

app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`StudyHub server running on http://localhost:${PORT}`);
});
