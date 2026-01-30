import { Router } from "express";
import Bundle from "../models/Bundle.js";

const router = Router();

router.get("/", async (req, res) => {
  const q = req.query.q || "";
  const filter = { isPublished: true };
  if (q)
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { subjects: { $elemMatch: { $regex: q, $options: "i" } } }
    ];
  const bundles = await Bundle.find(filter).limit(50);
  res.render("search/index", { title: "Search", bundles, q });
});

export default router;
