const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const teacherSchema = new mongoose.Schema({
  fullName:       { type: String, required: true },
  email:          { type: String, required: true, unique: true },
  password:       { type: String, required: true },
  specialization: { type: String, required: true },
  resume:         { type: String }, // filename
  photo:          { type: String }, // filename
  role:           { type: String, default: 'teacher' },
  createdAt:      { type: Date, default: Date.now }
})

// hash password before save
teacherSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

module.exports = mongoose.model('Teacher', teacherSchema)
