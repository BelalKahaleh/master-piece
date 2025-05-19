const Teacher = require('../model/teacherModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

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
  console.log('Request body:', req.body);

  try {
    // Find the teacher by email
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      console.log('Teacher not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Teacher found:', {
      id: teacher._id,
      email: teacher.email,
      hasPassword: !!teacher.password,
      passwordLength: teacher.password?.length
    });

    // Compare the provided password with the stored hashed password using bcrypt
    console.log('Attempting password comparison...');
    const isMatch = await bcrypt.compare(password, teacher.password);
    console.log('Password comparison result:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch (bcrypt compare failed)');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful for teacher:', teacher.email);

    // Generate JWT token
    const token = jwt.sign(
      { id: teacher._id, role: teacher.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Set the token in an HTTP-only cookie
    res.cookie('teacherToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });

    // Send response with teacher data (excluding password)
    const teacherData = teacher.toObject();
    delete teacherData.password;

    res.status(200).json({
      message: 'Login successful',
      token,
      teacher: teacherData
    });
  } catch (err) {
    console.error('Error in loginTeacher:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack
    });
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

  console.log('Password update attempt for teacher ID:', id);
  console.log('Request body:', { currentPassword: '***', newPassword: '***' });

  try {
    const teacher = await Teacher.findById(id);

    if (!teacher) {
      console.log('Teacher not found for ID:', id);
      return res.status(404).json({ message: 'Teacher not found' });
    }

    console.log('Teacher found:', {
      id: teacher._id,
      email: teacher.email,
      hasPassword: !!teacher.password,
      passwordLength: teacher.password?.length
    });

    // Verify current password
    console.log('Verifying current password...');
    const isMatch = await bcrypt.compare(currentPassword, teacher.password);
    console.log('Current password verification result:', isMatch);

    if (!isMatch) {
      console.log('Current password verification failed');
      return res.status(401).json({ message: 'Invalid current password' });
    }

    // Hash the new password
    console.log('Hashing new password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    console.log('New password hashed successfully');

    // Update the password
    teacher.password = hashedPassword;
    console.log('Password updated in teacher object');

    // Save the teacher document
    await teacher.save();
    console.log('Teacher document saved with new password');

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
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
