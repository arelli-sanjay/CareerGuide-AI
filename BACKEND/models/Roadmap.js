import mongoose from "mongoose";

const daySchema = new mongoose.Schema({
  day: Number,
  task: String,
  duration: String,
  completed: { type: Boolean, default: false },
});

const resourceSchema = new mongoose.Schema({
  title: String,
  link: String,
});

const weekSchema = new mongoose.Schema({
  weekNumber: Number,
  title: String,
  topics: [String],
  goal: String,
  estimatedTime: String,
  days: [daySchema],
  resources: [],
  projectTask: String,
  completed: { type: Boolean, default: false }, 
});

const roadmapSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    role: String,
    weeks: [weekSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Roadmap", roadmapSchema);