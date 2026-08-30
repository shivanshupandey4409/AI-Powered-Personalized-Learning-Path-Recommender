import { Router } from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.put("/", requireAuth, async (req, res, next) => {
  try {
    const allowed = ["interests", "experienceLevel", "currentSkills", "completedCourses", "objectives", "preferredLearningStyle"];
    const update = {};
    for (const key of allowed) if (req.body[key] !== undefined) update[`profile.${key}`] = req.body[key];
    const user = await User.findByIdAndUpdate(req.user.id, { $set: update }, { new: true }).select("-passwordHash");
    res.json({ user });
  } catch (e) { next(e); }
});

export default router;
