// backend/models/studentModel.js

const mongoose = require('mongoose');

// Define the schema for the Student model
const studentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  educationLevel: { type: String, required: true },
  marks: { type: Number, required: true },
  birthCertificate: { type: String, required: true },
  studentPicture: { type: String, required: true },
  marksCertificate: { type: String, required: true },
  orderStatus: { type: String, default: 'pending' }, // Default status is "pending"
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Create the Student model
const Student = mongoose.model('student', studentSchema);

module.exports = Student;
