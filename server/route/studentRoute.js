// server/routes/studentRoute.js
const router = require("express").Router();
const upload = require("../middleware/uploadMiddleware");
const { createStudent, getStudents  , getStudent, getUnassignedStudents } = require("../controller/studentController");

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

// Add the route for fetching unassigned students by level
router.get("/unassigned/:level", getUnassignedStudents);

router.get("/:id", getStudent);
module.exports = router;
