import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import accessRoutes from "./routes/accessRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/user", userRoutes);
app.use("/api/access", accessRoutes);


app.get("/", (req, res) => {
  res.send("CareerGuide AI API Running");
});

export default app;