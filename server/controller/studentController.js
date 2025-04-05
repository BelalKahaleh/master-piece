const multer = require('multer');
const path = require('path');
const Student = require('../model/studentModel'); // Import your Student model

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the file upload destination directory
    cb(null, './uploads/');  // Ensure you have a directory called 'uploads' for storing files
  },
  filename: (req, file, cb) => {
    // Set the file naming convention to avoid duplicates
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp for unique filenames
  }
});

// Multer filter to accept only specific file types (e.g., PDF and images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // Accept the file
  } else {
    cb(new Error('Invalid file type. Only PDF and image files are allowed'), false);  // Reject the file
  }
};

// Create a Multer instance with the defined storage and file filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size 10MB
  fileFilter: fileFilter
}).fields([
  { name: 'birthCertificate', maxCount: 1 },
  { name: 'studentPicture', maxCount: 1 },
  { name: 'marksCertificate', maxCount: 1 }
]);

const registerStudent = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
  
      const { studentName, email, gender, educationLevel, marks } = req.body;
      const birthCertificate = req.files['birthCertificate'] ? req.files['birthCertificate'][0].path : null;
      const studentPicture = req.files['studentPicture'] ? req.files['studentPicture'][0].path : null;
      const marksCertificate = req.files['marksCertificate'] ? req.files['marksCertificate'][0].path : null;
  
      if (!studentName || !email || !gender || !educationLevel || !marks || !birthCertificate || !studentPicture || !marksCertificate) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const newStudent = new Student({
        studentName,
        email,
        gender,
        educationLevel,
        marks,
        birthCertificate,
        studentPicture,
        marksCertificate,
      });
  
      try {
        await newStudent.save();
        res.status(201).json({ message: 'Student registered successfully', student: newStudent });
      } catch (error) {
        console.error('Error registering student:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });
  };
  

module.exports = { registerStudent };
