import express from "express";
import { uploadZip } from "../middlewares/uploadMiddleware.js";
import { uploadAndReview } from "../controllers/reviewController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  (req, res, next) => {
    uploadZip.single("file")(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "File too large. Max allowed size is 50MB",
          });
        }
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  uploadAndReview
);

export default router;