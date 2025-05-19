const express = require('express')
const multer  = require('multer')
const ctrl    = require('../controller/teacherController')
const router  = express.Router()
const jwt     = require('jsonwebtoken')

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.teacherToken;
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// simple disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/teachers'),
  filename:    (req, file, cb) => {
    const name = Date.now() + '-' + file.originalname
    cb(null, name)
  }
})
const upload = multer({ storage })

router.get('/', ctrl.getTeachers)
router.post(
  '/',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'photo',  maxCount: 1 }
  ]),
  ctrl.createTeacher
)

// Teacher login
router.post('/login', ctrl.loginTeacher)

// Get current teacher info (protected route)
router.get('/me', auth, ctrl.getCurrentTeacher)

// Get single teacher by ID
router.get('/:id', ctrl.getTeacherById);

// Add route for updating teacher password
router.put('/:id/password', ctrl.updateTeacherPassword);

module.exports = router
