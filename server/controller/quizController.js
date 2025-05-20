const Quiz = require('../model/quizModel');
const Class = require('../model/classModel');
const Student = require('../model/studentModel');
const QuizSubmission = require('../model/quizSubmissionModel');

exports.getMyClasses = async (req, res) => {
  try {
    const teacherId = req.user.id;
    // Find classes where teacher is main or in schedule
    const classes = await Class.find({
      $or: [
        { teacher: teacherId },
        { 'schedule.teacher': teacherId }
      ]
    }).populate('teacher');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStudentQuizzes = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Find the student's class
    const student = await Student.findById(studentId);
    if (!student || !student.class) {
      return res.status(404).json({ message: 'Student class not found' });
    }

    // Get all quizzes for the student's class
    const quizzes = await Quiz.find({ class: student.class })
      .populate('teacher', 'fullName')
      .sort({ scheduledDate: 1 }); // Sort by scheduled date

    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const { classId, title, questions, scheduledDate, duration } = req.body;
    
    // Validate required fields
    if (!classId || !title || !questions || !scheduledDate || !duration) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: { classId, title, questions, scheduledDate, duration }
      });
    }

    // Validate questions array
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Questions must be a non-empty array' });
    }

    // Validate each question
    for (const question of questions) {
      if (!question.question || !Array.isArray(question.options) || !question.answer) {
        return res.status(400).json({ 
          message: 'Invalid question format',
          details: question
        });
      }
    }

    const quiz = new Quiz({
      class: classId,
      teacher: req.user.id,
      title,
      questions,
      scheduledDate,
      duration
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    console.error('Quiz creation error:', err);
    res.status(500).json({ 
      message: 'Server error',
      error: err.message
    });
  }
};

exports.getQuizByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const quizzes = await Quiz.find({ class: classId });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    await Quiz.findByIdAndDelete(quizId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { title, questions, scheduledDate, duration } = req.body;
    const quiz = await Quiz.findByIdAndUpdate(
      quizId,
      { title, questions, scheduledDate, duration },
      { new: true }
    );
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;
    const studentId = req.user.id;

    // Find the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'الاختبار غير موجود' });
    }

    // Check if student is in the correct class
    const student = await Student.findById(studentId);
    if (!student || student.class.toString() !== quiz.class.toString()) {
      return res.status(403).json({ message: 'غير مصرح لك بأداء هذا الاختبار' });
    }

    // Check if quiz time has arrived and not expired
    const now = new Date();
    const quizTime = new Date(quiz.scheduledDate);
    const endTime = new Date(quizTime.getTime() + quiz.duration * 60000);

    if (now < quizTime) {
      return res.status(400).json({ message: 'لم يحن وقت الاختبار بعد' });
    }

    if (now > endTime) {
      return res.status(400).json({ message: 'انتهى وقت الاختبار' });
    }

    // Calculate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        score++;
      }
    });

    // Save the submission
    const submission = new QuizSubmission({
      quiz: quizId,
      student: studentId,
      answers,
      score,
      submittedAt: new Date()
    });

    await submission.save();

    res.json({
      message: 'تم تسليم الاختبار بنجاح',
      score,
      totalQuestions: quiz.questions.length
    });
  } catch (err) {
    console.error('Quiz submission error:', err);
    res.status(500).json({ message: 'حدث خطأ أثناء تسليم الاختبار' });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user.id;

    // Find the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'الاختبار غير موجود' });
    }

    // Check if student is in the correct class
    const student = await Student.findById(studentId);
    if (!student || student.class.toString() !== quiz.class.toString()) {
      return res.status(403).json({ message: 'غير مصرح لك بأداء هذا الاختبار' });
    }

    // Check if student has already submitted this quiz
    const existingSubmission = await QuizSubmission.findOne({
      quiz: quizId,
      student: studentId
    });

    if (existingSubmission) {
      return res.status(400).json({ message: 'لقد قمت بتسليم هذا الاختبار مسبقاً' });
    }

    res.json(quiz);
  } catch (err) {
    console.error('Get quiz error:', err);
    res.status(500).json({ message: 'حدث خطأ أثناء تحميل الاختبار' });
  }
};

exports.getStudentScores = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Find all submissions for the student
    const submissions = await QuizSubmission.find({ student: studentId })
      .populate({
        path: 'quiz',
        select: 'title questions' // Include questions to get total count
      })
      .sort({ submittedAt: -1 });

    // Map submissions to include required information
    const scores = submissions.map(submission => ({
      _id: submission._id,
      quiz: {
        _id: submission.quiz._id,
        title: submission.quiz.title
      },
      score: submission.score,
      totalQuestions: submission.quiz.questions.length,
      submittedAt: submission.submittedAt
    }));

    res.json(scores);
  } catch (err) {
    console.error('Get scores error:', err);
    res.status(500).json({ 
      message: 'حدث خطأ أثناء تحميل النتائج',
      error: err.message 
    });
  }
};

exports.getQuizResults = async (req, res) => {
  try {
    const { quizId } = req.params;
    const teacherId = req.user.id;

    // Find the quiz and verify teacher ownership
    const quiz = await Quiz.findOne({ _id: quizId, teacher: teacherId });
    if (!quiz) {
      return res.status(404).json({ message: 'الاختبار غير موجود أو غير مصرح لك بالوصول إليه' });
    }

    // Get all submissions for this quiz
    const submissions = await QuizSubmission.find({ quiz: quizId })
      .populate('student', 'fullName')
      .sort({ submittedAt: -1 });

    // Format the results
    const results = submissions.map(submission => ({
      student: {
        fullName: submission.student.fullName
      },
      score: submission.score,
      totalQuestions: quiz.questions.length,
      submittedAt: submission.submittedAt
    }));

    res.json(results);
  } catch (err) {
    console.error('Get quiz results error:', err);
    res.status(500).json({ 
      message: 'حدث خطأ أثناء تحميل النتائج',
      error: err.message 
    });
  }
}; 