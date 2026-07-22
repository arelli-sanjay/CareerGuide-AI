import { analyzeZip } from "../services/codeAnalyzer.service.js";
import User from "../models/User.js";

export const uploadAndReview = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await analyzeZip(req.file.buffer);
    const safeResult = {
      score: result?.score || 0,
      issues: Array.isArray(result?.issues) ? result.issues : [],
      suggestions: Array.isArray(result?.suggestions) ? result.suggestions : [],
      strengths: Array.isArray(result?.strengths) ? result.strengths : [],
    };

    if (req.user) {
      const user = await User.findById(req.user.id);

      if (user) {
        user.codeReviewScore = safeResult.score;

        if (safeResult.score >= 7) {
          user.projectCompleted = true;
        }

        await user.save();
      }
    }

    res.json({
      ...safeResult,
      unlocked: safeResult.score >= 7,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Code review failed" });
  }
};