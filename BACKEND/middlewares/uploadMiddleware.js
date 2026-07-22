import multer from "multer";

const storage = multer.memoryStorage();
const resumeFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOCX or TXT files are allowed"), false);
  }
};

const zipFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/zip" ||
    file.mimetype === "application/x-zip-compressed" ||
    file.originalname.endsWith(".zip")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only ZIP files are allowed"), false);
  }
};

export const uploadResume = multer({
  storage,
  fileFilter: resumeFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

export const uploadZip = multer({
  storage,
  fileFilter: zipFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});