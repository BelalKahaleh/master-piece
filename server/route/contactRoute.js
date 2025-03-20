// backend/routes/contactRoute.js
const express = require('express');
const { createContactMessage } = require('../controller/contactController'); // Import controller function
const router = express.Router();

// Define the POST route for submitting contact messages
router.post('/contact', createContactMessage);  // Use the function in the route

module.exports = router;
