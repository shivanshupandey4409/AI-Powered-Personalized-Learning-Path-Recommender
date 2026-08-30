import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  estimatedHours: Number,
  priority: { type: String, default: "Medium" },
  status: { type: String, default: "Not Started" },
  dueDay: Number,
  prerequisites: [String],
  resourceType: String,
  resourceUrl: String
}, { _id: true });

const topicSchema = new mongoose.Schema({
  title: String,
  description: String,
  estimatedHours: Number,
  priority: String,
  prerequisites: [String],
  tasks: [taskSchema]
}, { _id: true });

const phaseSchema = new mongoose.Schema({
  title: String,
  description: String,
  durationDays: Number,
  order: Number,
  topics: [topicSchema]
}, { _id: true });

const roadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: "Goal", required: true },
  title: String,
  description: String,
  totalDays: Number,
  skillGaps: [{
    skill: String,
    currentLevel: String,
    targetLevel: String,
    reason: String
  }],
  phases: [phaseSchema],
  recommendations: [{
    title: String,
    type: String,
    reason: String,
    url: String,
    priority: String
  }],
  milestones: [{
    title: String,
    day: Number,
    description: String
  }]
}, { timestamps: true });

export default mongoose.model("Roadmap", roadmapSchema);
