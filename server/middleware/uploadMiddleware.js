// server/middlewares/uploadMiddleware.js
const multer = require("multer");
const path   = require("path");
const fs = require("fs");

// تأكد من أن هذا المسار صحيح وينتهي بوجود مجلّد uploads/news
const UPLOAD_DIR = path.join(__dirname, "../uploads/news");

// Create the directory if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// إعداد التخزين
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
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
