const mongoose = require('mongoose');

const quizSubmissionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  answers: {
    type: Object,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent multiple submissions from the same student for the same quiz
quizSubmissionSchema.index({ quiz: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('QuizSubmission', quizSubmissionSchema); 