import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "User",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    roadmapCompleted: {
      type: Boolean,
      default: false,
    },
    projectCompleted: {
      type: Boolean,
      default: false,
    },
    codeReviewScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);