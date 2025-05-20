// server/controllers/studentController.js
const Student = require("../model/studentModel");
const bcrypt = require("bcrypt");

// Map new stage names from frontend to potential old stage names in DB
const stageNameMap = {
  'ابتدائي': 'الابتدائية',
  'اعدادي': 'الإعدادية',
  'ثانوي': 'الثانوية',
};

const createStudent = async (req, res) => {
  try {
    const { fullName, email, password, gender, stage } = req.body;

    // Save only the filename from Multer
    const transcriptFilename   = req.files?.transcript?.[0]?.filename   || "";
    const birthCertFilename    = req.files?.birthCert?.[0]?.filename    || "";
    const studentPhotoFilename = req.files?.photo?.[0]?.filename        || "";

    const student = await Student.create({
      fullName,
      email,
      password,                  // now storing hashed in pre-save
      gender,
      stage,
      transcriptPath:   transcriptFilename, // Store filename
      birthCertPath:    birthCertFilename,  // Store filename
      studentPhotoPath: studentPhotoFilename, // Store filename
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
      .select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (err) {
    console.error("getStudent error:", err);
    console.error("Error details for getStudent:", { message: err.message, stack: err.stack });
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

// Controller function to update student password
const updateStudentPassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    // Update the password
    student.password = newPassword; // Assign the plain new password
    await student.save(); // The pre-save hook will hash it

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating student password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, gender, stage } = req.body;

    // Get the filenames from uploaded files if they exist
    const transcriptFilename = req.files?.transcript?.[0]?.filename;
    const birthCertFilename = req.files?.birthCert?.[0]?.filename;
    const studentPhotoFilename = req.files?.photo?.[0]?.filename;

    // Find the student first
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update the student fields
    const updateData = {
      fullName,
      email,
      gender,
      stage,
    };

    // Only update file paths if new files were uploaded
    if (transcriptFilename) updateData.transcriptPath = transcriptFilename;
    if (birthCertFilename) updateData.birthCertPath = birthCertFilename;
    if (studentPhotoFilename) updateData.studentPhotoPath = studentPhotoFilename;

    // Update the student
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ message: "Student updated successfully", student: updatedStudent });
  } catch (err) {
    console.error("updateStudent error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "البريد الإلكتروني مستخدم مسبقاً" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createStudent, getStudents, getStudent, getUnassignedStudents, updateStudentPassword, updateStudent };
