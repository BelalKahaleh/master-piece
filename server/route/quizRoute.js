const express = require('express');
const router = express.Router();
const quizController = require('../controller/quizController');
const jwt = require('jsonwebtoken');

// Auth middleware for teachers
const teacherAuth = async (req, res, next) => {
  try {
    const token = req.cookies.teacherToken;
    if (!token) return res.status(401).json({ message: 'No authentication token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Auth middleware for students
const studentAuth = async (req, res, next) => {
  try {
    const token = req.cookies.studentToken;
    if (!token) return res.status(401).json({ message: 'No authentication token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Teacher routes
router.get('/my-classes', teacherAuth, quizController.getMyClasses);
router.post('/', teacherAuth, quizController.createQuiz);
router.get('/by-class/:classId', teacherAuth, quizController.getQuizByClass);
router.get('/:quizId/results', teacherAuth, quizController.getQuizResults);
router.delete('/:quizId', teacherAuth, quizController.deleteQuiz);
router.put('/:quizId', teacherAuth, quizController.updateQuiz);

// Student routes
router.get('/student', studentAuth, quizController.getStudentQuizzes);
router.get('/scores', studentAuth, quizController.getStudentScores);
router.get('/:quizId', studentAuth, quizController.getQuizById);
router.post('/:quizId/submit', studentAuth, quizController.submitQuiz);

module.exports = router; 