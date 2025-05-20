const express = require('express');
const router = express.Router();
const classController = require('../controller/classController');

// Make sure each route maps to a function, not the whole object
router.get('/classes', classController.getAllClasses);
router.post('/classes', classController.createClass);
router.get('/classes/:id', classController.getClassById);
router.put('/classes/:id', classController.updateClass);
router.delete('/classes/:id', classController.deleteClass);
router.post('/classes/:id/assign-students', classController.assignStudents);
router.get('/classes/:id/students', classController.getClassStudents);
router.get('/', classController.getAllClasses);
module.exports = router;
