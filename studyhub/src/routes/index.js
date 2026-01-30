import { Router } from "express";
import authRoutes from "./auth.js";
import adminRoutes from "./admin.js";
import bundleRoutes from "./bundles.js";
import notesRoutes from "./notes.js";
import aiRoutes from "./ai.js";
import dashboardRoutes from "./dashboard.js";
import searchRoutes from "./search.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("home", { title: "StudyHub" });
});

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/bundles", bundleRoutes);
router.use("/notes", notesRoutes);
router.use("/api/ai", aiRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/search", searchRoutes);

export default router;
