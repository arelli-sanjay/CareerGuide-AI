import express from "express";
import {
  generateProjects,
  generateProjectPlan,
  projectChat
} from "../controllers/projectController.js";


const router = express.Router();

router.post("/suggestions", generateProjects);
router.post("/plan", generateProjectPlan);
router.post("/chat", projectChat);

export default router;