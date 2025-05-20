// server/routes/studentRoute.js
const router = require("express").Router();
const upload = require("../middleware/uploadMiddleware");
const { createStudent, getStudents  , getStudent, getUnassignedStudents, updateStudentPassword, updateStudent } = require("../controller/studentController");
const { loginStudent } = require("../controller/studentAuthController");

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

router.post("/login", loginStudent);

// Add logout route
router.post("/logout", (req, res) => {
  res.clearCookie("studentToken");
  res.json({ message: "Logged out successfully" });
});

// Route to update student password
router.patch("/:id/password", updateStudentPassword);

// Route to update student
router.put(
  "/:id",
  upload.fields([
    { name: "transcript", maxCount: 1 },
    { name: "birthCert", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  updateStudent
);

module.exports = router;
