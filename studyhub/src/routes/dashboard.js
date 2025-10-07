import { Router } from "express";
import { ensureAuth } from "../middlewares/auth.js";
import User from "../models/User.js";
import Bundle from "../models/Bundle.js";

const router = Router();

router.get("/", ensureAuth, async (req, res) => {
  const user = await User.findById(req.user.id).populate("bookmarks").populate("purchases");
  const recommended = await Bundle.find({ isPublished: true }).sort({ createdAt: -1 }).limit(6);
  res.render("dashboard/index", { title: "Dashboard", user, recommended });
});

export default router;
