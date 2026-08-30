import { Router } from "express";
import Roadmap from "../models/Roadmap.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const roadmaps = await Roadmap.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ roadmaps });
  } catch (e) { next(e); }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findOne({ _id: req.params.id, userId: req.user.id });
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found." });
    res.json({ roadmap });
  } catch (e) { next(e); }
});

export default router;
