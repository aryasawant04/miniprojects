import { Router } from "express";
import { ensureAuth } from "../middlewares/auth.js";
import Bundle from "../models/Bundle.js";
import User from "../models/User.js";

const router = Router();

router.get("/", async (req, res) => {
  const q = req.query.q || "";
  const filter = { isPublished: true };
  if (q) filter.$or = [
    { title: { $regex: q, $options: "i" } },
    { description: { $regex: q, $options: "i" } },
    { subjects: { $elemMatch: { $regex: q, $options: "i" } } }
  ];
  const bundles = await Bundle.find(filter).sort({ createdAt: -1 });
  res.render("bundles/index", { title: "Bundles", bundles, q });
});

router.get("/:id", ensureAuth, async (req, res) => {
  const bundle = await Bundle.findById(req.params.id);
  const hasAccess = req.user && (await User.exists({ _id: req.user.id, purchases: bundle._id }));
  res.render("bundles/show", { title: bundle.title, bundle, hasAccess });
});

router.post("/:id/bookmark", ensureAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { $addToSet: { bookmarks: req.params.id } });
  res.redirect("back");
});

router.post("/:id/purchase", ensureAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { $addToSet: { purchases: req.params.id } });
  res.redirect(`/bundles/${req.params.id}`);
});

export default router;
