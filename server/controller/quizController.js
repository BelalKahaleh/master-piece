const Quiz = require('../model/quizModel');
const Class = require('../model/classModel');

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

exports.createQuiz = async (req, res) => {
  try {
    const { classId, title, questions, scheduledDate, duration } = req.body;
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
    res.status(500).json({ message: 'Server error' });
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