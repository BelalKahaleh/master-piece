const Teacher = require('../model/teacherModel')

// GET /api/teachers
exports.getTeachers = async (req, res) => {
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
exports.createTeacher = async (req, res) => {
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
