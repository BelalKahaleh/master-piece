// server/middlewares/uploadMiddleware.js
const multer = require("multer");
const path   = require("path");
const fs = require("fs");

// Define upload directories
const UPLOAD_BASE_DIR = path.join(__dirname, "../uploads");
const NEWS_UPLOAD_DIR = path.join(UPLOAD_BASE_DIR, "news");
const STUDENTS_UPLOAD_DIR = path.join(UPLOAD_BASE_DIR, "students");

// Create the directories if they don't exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDirectoryExists(NEWS_UPLOAD_DIR);
ensureDirectoryExists(STUDENTS_UPLOAD_DIR);

// إعداد التخزين
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine destination based on fieldname
    let destinationDir;
    if (['transcript', 'birthCert', 'photo'].includes(file.fieldname)) {
      destinationDir = STUDENTS_UPLOAD_DIR;
    } else if (file.fieldname === 'images') { // Assuming news images field is 'images'
      destinationDir = NEWS_UPLOAD_DIR;
    } else {
      // Default destination or handle other file types
      destinationDir = UPLOAD_BASE_DIR;
    }
    cb(null, destinationDir);
  },
  filename:    (_, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "_" + uniqueSuffix + ext);
  },
});

// فلتر الصيغ المسموح بها
const fileFilter = (_, file, cb) => {
  if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Allowed: PDF or images only"), false);
  }
};

const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB

// هنا نصدر المثيل نفسه من multer
module.exports = multer({ storage, fileFilter, limits });
