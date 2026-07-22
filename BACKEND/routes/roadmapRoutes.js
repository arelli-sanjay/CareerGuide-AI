import express from "express";
import {
  generateRoadmap,
  getWeekPlan,
  getLatestRoadmap ,
  toggleDay 
} from "../controllers/roadmapController.js";

const router = express.Router();

router.post("/generate", generateRoadmap);
router.get("/week/:weekId", getWeekPlan);
router.get("/latest", getLatestRoadmap);
router.patch("/day/:weekId/:dayId", toggleDay);

export default router;