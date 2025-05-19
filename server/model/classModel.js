const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  level: {
    type: String,
    required: true,
    enum: ['ابتدائي', 'اعدادي', 'ثانوي']
  },
  grade: {
    type: Number,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  schedule: [{
    day: { type: String, required: true },
    period: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    subject: { type: String, required: true }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index for level and grade to ensure proper sorting
classSchema.index({ level: 1, grade: 1, section: 1 });

module.exports = mongoose.model('Class', classSchema); 