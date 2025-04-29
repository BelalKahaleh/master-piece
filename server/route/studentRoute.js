// server/routes/studentRoute.js
const router = require("express").Router();
const upload = require("../middleware/uploadMiddleware");
const { createStudent, getStudents } = require("../controller/studentController");

router.post(
  "/",
  upload.fields([
    { name: "transcript", maxCount: 1 },
    { name: "birthCert",  maxCount: 1 },
    { name: "photo",      maxCount: 1 },
  ]),
  createStudent
);

router.get("/", getStudents);

module.exports = router;
