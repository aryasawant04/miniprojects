import { Router } from "express";
import { ensureAdmin } from "../middlewares/auth.js";
import Bundle from "../models/Bundle.js";
import Contribution from "../models/Contribution.js";

const router = Router();

router.use(ensureAdmin);

router.get("/", async (req, res) => {
  const bundles = await Bundle.find().sort({ createdAt: -1 });
  const pending = await Contribution.find({ status: "pending" }).sort({ createdAt: -1 });
  res.render("admin/index", { title: "Admin", bundles, pending });
});

router.post("/bundles", async (req, res) => {
  const { title, description, priceCents, subjects } = req.body;
  await Bundle.create({
    title,
    description,
    priceCents,
    subjects: subjects?.split(",").map((s) => s.trim()) || []
  });
  res.redirect("/admin");
});

router.post("/bundles/:id/publish", async (req, res) => {
  await Bundle.findByIdAndUpdate(req.params.id, { isPublished: true });
  res.redirect("/admin");
});

router.post("/contributions/:id/:action", async (req, res) => {
  const { id, action } = req.params;
  if (action === "approve") await Contribution.findByIdAndUpdate(id, { status: "approved" });
  else if (action === "reject") await Contribution.findByIdAndUpdate(id, { status: "rejected" });
  res.redirect("/admin");
});

export default router;
