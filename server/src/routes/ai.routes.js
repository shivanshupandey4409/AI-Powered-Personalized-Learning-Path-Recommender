import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";
import Goal from "../models/Goal.js";
import Roadmap from "../models/Roadmap.js";
import { generateLearningPath, chatWithLearner, analyzeProgress, reschedulePath } from "../services/openrouter.service.js";

const router = Router();

router.post("/generate-path", requireAuth, async (req, res, next) => {
  try {
    const { goalId } = req.body;
    const [goal, user] = await Promise.all([
      Goal.findOne({ _id: goalId, userId: req.user.id }),
      User.findById(req.user.id).select("-passwordHash")
    ]);
    if (!goal) return res.status(404).json({ message: "Goal not found." });

    const data = await generateLearningPath({ goal, profile: user.profile });
    const roadmap = await Roadmap.create({ ...data, userId: req.user.id, goalId: goal._id });
    res.status(201).json({ roadmap });
  } catch (e) { next(e); }
});

router.post("/chat", requireAuth, async (req, res, next) => {
  try {
    const { message, roadmapId } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required." });
    const [roadmap, user] = await Promise.all([
      roadmapId ? Roadmap.findOne({ _id: roadmapId, userId: req.user.id }) : null,
      User.findById(req.user.id).select("-passwordHash")
    ]);
    const reply = await chatWithLearner({ message, roadmap, profile: user.profile });
    res.json({ reply });
  } catch (e) { next(e); }
});

router.post("/analyze-progress", requireAuth, async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findOne({ _id: req.body.roadmapId, userId: req.user.id });
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found." });
    const user = await User.findById(req.user.id).select("-passwordHash");
    const analysis = await analyzeProgress({ roadmap, profile: user.profile });
    res.json({ analysis });
  } catch (e) { next(e); }
});

router.post("/reschedule", requireAuth, async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findOne({ _id: req.body.roadmapId, userId: req.user.id });
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found." });
    const user = await User.findById(req.user.id).select("-passwordHash");
    const proposal = await reschedulePath({
      roadmap,
      profile: user.profile,
      missedDays: Number(req.body.missedDays || 1)
    });
    res.json({ proposal });
  } catch (e) { next(e); }
});

export default router;
