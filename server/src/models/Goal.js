import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  currentLevel: String,
  targetLevel: String,
  durationDays: Number,
  dailyHours: Number,
  preferredLearningStyle: String,
  deadline: Date,
  objective: String,
  status: { type: String, default: "active" }
}, { timestamps: true });

export default mongoose.model("Goal", goalSchema);
