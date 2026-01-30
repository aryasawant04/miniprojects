import { Router } from "express";
import multer from "multer";
import path from "path";
import Contribution from "../models/Contribution.js";
import { ensureAuth } from "../middlewares/auth.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "uploads"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  }
});
const upload = multer({ storage });

const router = Router();

router.get("/contribute", ensureAuth, (req, res) => {
  res.render("notes/contribute", { title: "Contribute Notes" });
});

router.post("/contribute", ensureAuth, upload.single("file"), async (req, res) => {
  const { title, description, subjects } = req.body;
  await Contribution.create({
    title,
    description,
    fileUrl: req.file ? `/uploads/${req.file.filename}` : "",
    subjects: subjects?.split(",").map((s) => s.trim()) || [],
    author: req.user.id
  });
  res.redirect("/dashboard");
});

export default router;
