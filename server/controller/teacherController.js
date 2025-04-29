const Teacher = require('../model/teacherModel')

// GET /api/teachers?search=&specialization=
exports.getTeachers = async (req, res) => {
  try {
    const { search = '', specialization = '' } = req.query
    const filter = {}
    if (specialization) filter.specialization = specialization
    if (search.trim()) {
      const q = search.trim()
      filter.$or = [
        { fullName: new RegExp(q, 'i') },
        { email:    new RegExp(q, 'i') }
      ]
    }
    const list = await Teacher
      .find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
    res.json(list)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// POST /api/teachers
exports.createTeacher = async (req, res) => {
  try {
    const { fullName, email, password, specialization } = req.body
    if (!fullName || !email || !password || !specialization) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    const resumeFile = req.files.resume?.[0]?.filename
    const photoFile  = req.files.photo?.[0]?.filename

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
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
}
