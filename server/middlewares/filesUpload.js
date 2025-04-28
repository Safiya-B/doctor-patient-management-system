const multer = require("multer");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 3MB

// File validation (type and size)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only PDF, JPEG, and PNG files are allowed"));
  }
  cb(null, true);
};

// Multer storage
const storage = multer.memoryStorage(); // Store files in memory for direct upload to S3

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

module.exports = upload;
