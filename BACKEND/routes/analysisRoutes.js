import express from "express";
import { analyzeFull } from "../controllers/analysisController.js";
import { uploadResume } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/analyze", uploadResume.single("resume"), analyzeFull);

export default router;