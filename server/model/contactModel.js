// backend/models/contact.model.js

const mongoose = require('mongoose');

// Define the schema for the Contact model
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create the Contact model based on the schema
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
