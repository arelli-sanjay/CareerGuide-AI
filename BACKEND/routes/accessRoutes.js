import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/project", protect, (req, res) => {
  if (!req.user.roadmapCompleted) {
    return res.status(403).json({
      access: false,
      message: "Complete roadmap first",
    });
  }

  res.json({
    access: true,
    message: "Project planner unlocked",
  });
});

router.get("/jobs", protect, (req, res) => {
  if (!req.user.projectCompleted || req.user.codeReviewScore <= 7) {
    return res.status(403).json({
      access: false,
      message: "Score above 7 required",
    });
  }

  res.json({
    access: true,
    message: "Job recommendations unlocked",
  });
});

export default router;