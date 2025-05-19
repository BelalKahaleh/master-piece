const Teacher = require('../model/teacherModel')
const bcrypt = require('bcrypt')

// GET /api/teachers
const getTeachers = async (req, res) => {
  try {
    console.log('Fetching teachers from database...');
    const teachers = await Teacher.find().select('-password').sort({ createdAt: -1 });
    console.log(`Found ${teachers.length} teachers`);
    res.json(teachers);
  } catch (err) {
    console.error('Error fetching teachers:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/teachers
const createTeacher = async (req, res) => {
  try {
    const { fullName, email, password, specialization } = req.body
    if (!fullName || !email || !password || !specialization) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    const resumeFile = req.files?.resume?.[0]?.filename
    const photoFile  = req.files?.photo?.[0]?.filename

    const teacher = new Teacher({
      fullName,
      email,
      password,
      specialization,
      resume: resumeFile,
      photo:  photoFile
    })
    await teacher.save()
    const out = teacher.toObject()
    delete out.password
    res.status(201).json(out)
  } catch (err) {
    console.error('Error creating teacher:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const loginTeacher = async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt with email:', email);

  try {
    // Find the teacher by email
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      console.log('Teacher not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Teacher found:', teacher.email);

    // Compare the provided password with the stored hashed password using bcrypt
    console.log('Provided password:', password);
    console.log('Comparing with stored hashed password...');
    const isMatch = await bcrypt.compare(password, teacher.password);

    if (!isMatch) {
      console.log('Password mismatch (bcrypt compare failed)');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful for teacher:', teacher.email);

    // Generate a token (using a library like jsonwebtoken)
    // NOTE: You should use a secure method for token generation and management
    const token = 'dummy_token'; // Replace with actual token generation

    res.status(200).json({ message: 'Login successful', token, teacher });
  } catch (err) {
    console.error('Error in loginTeacher:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/teachers/:id
const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select('-password');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (err) {
    console.error('Error fetching teacher by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller function to update teacher password
const updateTeacherPassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(newPassword, salt);

    await teacher.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export existing and new functions
module.exports = {
  getTeachers,
  createTeacher,
  loginTeacher,
  getTeacherById,
  updateTeacherPassword
};
