// backend/controllers/contact.controller.js

const Contact = require('../model/contactModel'); // Import the Contact model

// Controller to create a new contact message
const createContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Ensure that all fields are provided
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // Create a new contact message entry in the database
    const newContactMessage = new Contact({ name, email, message });

    // Save the message in the database
    await newContactMessage.save();

    // Send success response
    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createContactMessage };
