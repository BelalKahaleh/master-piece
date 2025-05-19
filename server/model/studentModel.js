// server/models/studentModel.js
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const studentSchema = new mongoose.Schema({
  fullName:         { type: String, required: true },
  email:            { type: String, required: true, unique: true },
  password:         { type: String, required: true },           // new
  gender:           { type: String, enum: ["ذكر", "أنثى"], required: true },
  stage:            { type: String, required: true },
  role:           { type: String, default: 'student' },
  transcriptPath:   String,
  birthCertPath:    String,
  studentPhotoPath: String,
  class:            { type: mongoose.Schema.Types.ObjectId, ref: 'Class' } // Reference to the class
}, { timestamps: true });

// Hash password before saving
studentSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Student", studentSchema);
