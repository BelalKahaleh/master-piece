const express = require('express');
const router = express.Router();
const classController = require('../controller/classController');

// Get all classes
router.get('/', classController.getAllClasses);

// Create a new class
router.post('/', classController.createClass);

// Get a single class by ID
router.get('/:id', classController.getClassById);

// Update a class
router.put('/:id', classController.updateClass);

// Delete a class
router.delete('/:id', classController.deleteClass);

// Assign students to a class
router.post('/:id/students', classController.assignStudents);

module.exports = router; 