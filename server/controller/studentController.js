// server/controllers/studentController.js
const Student = require("../model/studentModel");

// Map new stage names from frontend to potential old stage names in DB
const stageNameMap = {
  'ابتدائي': 'الابتدائية',
  'اعدادي': 'الإعدادية',
  'ثانوي': 'الثانوية',
};

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


 const getStudent = async (req, res) => {
  try {
    const student = await Student
      .findById(req.params.id)
      .select("-password createdAt updatedAt");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (err) {
    console.error("getStudent error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// Add the getUnassignedStudents function definition
const getUnassignedStudents = async (req, res) => {
  try {
    const level = req.params.level;
    console.log('Received level for unassigned students:', level);

    // Determine possible stage names to search for
    const possibleStages = [level];
    if (stageNameMap[level]) {
      possibleStages.push(stageNameMap[level]);
    }
    console.log('Searching for stages:', possibleStages);

    const students = await Student.find({
      $or: [
        { class: { $exists: false } },
        { class: null }
      ],
      // Use $in to query for either the new or old stage name
      stage: { $in: possibleStages }
    });

    console.log('Unassigned students query result:', students);
    res.json(students);
  } catch (err) {
    console.error('getUnassignedStudents error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { createStudent, getStudents , getStudent, getUnassignedStudents };
