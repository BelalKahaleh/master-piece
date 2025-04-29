// server/controllers/studentController.js
const Student = require("../model/studentModel");

const createStudent = async (req, res) => {
  try {
    const { fullName, email, password, gender, stage } = req.body;
    const transcriptPath   = req.files?.transcript?.[0]?.path   || "";
    const birthCertPath    = req.files?.birthCert?.[0]?.path    || "";
    const studentPhotoPath = req.files?.photo?.[0]?.path        || "";

    const student = await Student.create({
      fullName,
      email,
      password,                  // now storing hashed in pre-save
      gender,
      stage,
      transcriptPath,
      birthCertPath,
      studentPhotoPath,
    });

    res.status(201).json({ message: "Student added", student });
  } catch (err) {
    console.error("createStudent error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "البريد الإلكتروني مستخدم مسبقاً" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const getStudents = async (_, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error("getStudents error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createStudent, getStudents };
