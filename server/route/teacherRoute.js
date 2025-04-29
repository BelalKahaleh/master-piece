const express = require('express')
const multer  = require('multer')
const ctrl    = require('../controller/teacherController')
const router  = express.Router()

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

module.exports = router
