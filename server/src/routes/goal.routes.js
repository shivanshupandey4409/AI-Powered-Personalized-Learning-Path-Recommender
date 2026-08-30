import { Router } from "express";
import Goal from "../models/Goal.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const goal = await Goal.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ goal });
  } catch (e) { next(e); }
});

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ goals });
  } catch (e) { next(e); }
});

export default router;
