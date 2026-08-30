import { Router } from "express";
import Roadmap from "../models/Roadmap.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.patch("/:id", requireAuth, async (req, res, next) => {
  try {
    const { status } = req.body;
    const roadmap = await Roadmap.findOne({ userId: req.user.id, "phases.topics.tasks._id": req.params.id });
    if (!roadmap) return res.status(404).json({ message: "Task not found." });

    let updated = false;
    for (const phase of roadmap.phases) {
      for (const topic of phase.topics) {
        for (const task of topic.tasks) {
          if (task._id.toString() === req.params.id) {
            task.status = status;
            updated = true;
          }
        }
      }
    }
    if (!updated) return res.status(404).json({ message: "Task not found." });
    await roadmap.save();
    res.json({ roadmap });
  } catch (e) { next(e); }
});

export default router;
