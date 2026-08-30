import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  profile: {
    interests: [String],
    experienceLevel: { type: String, default: "Beginner" },
    currentSkills: [String],
    completedCourses: [String],
    objectives: [String],
    preferredLearningStyle: { type: String, default: "Mixed" }
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
