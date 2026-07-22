import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getMe,
  markRoadmapComplete,
  updateProfile,
  resetUserProgress 
} from "../controllers/usercontroller.js";

const router = express.Router();

router.get("/me",protect, getMe);
router.put("/update", protect, updateProfile);
router.post("/roadmap/complete", protect, markRoadmapComplete);
router.post("/reset", protect, resetUserProgress);

export default router;