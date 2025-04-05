const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const contactRoutes = require('./route/contactRoute'); // Correct path to routes
const app = express();
const connectDB = require("./DBConfig/Mongo");
const studentRoutes = require('./route/studentRoute'); // Import student routes

dotenv.config();

// Middleware
app.use(
  cors({
    origin: "*", // Allow all origins, modify for specific domains if needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());


// API routes for the contact form
app.use('/api', contactRoutes);
app.use('/api', studentRoutes);


// Call the function to connect to MongoDB
connectDB();

const PORT = process.env.PORT || 8000;

// Test route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// const PORT = 5000;
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});