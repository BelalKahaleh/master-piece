// File: server/models/News.js
const mongoose = require('mongoose')

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  details: { type: String, required: true },
  tags: [{ type: String }],
  images: [{ type: String }],
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('News', NewsSchema)
