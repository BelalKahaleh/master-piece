const express = require('express');
const router = express.Router();
const quizController = require('../controller/quizController');
const jwt = require('jsonwebtoken');

// Auth middleware (copy from your teacherRoute.js)
const auth = async (req, res, next) => {
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

router.get('/my-classes', auth, quizController.getMyClasses);
router.post('/', auth, quizController.createQuiz);
router.get('/by-class/:classId', auth, quizController.getQuizByClass);
router.delete('/:quizId', auth, quizController.deleteQuiz);
router.put('/:quizId', auth, quizController.updateQuiz);

module.exports = router; 