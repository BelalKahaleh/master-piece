const express = require('express');
const { registerStudent } = require('../controller/studentController');  // Correct import
const router = express.Router();

// POST route to register a new student
router.post('/register-student', registerStudent);  // Using the imported registerStudent function

module.exports = router;