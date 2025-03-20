const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const contactRoutes = require('./route/contactRoute'); // Correct path to routes
const app = express();
const connectDB = require("./DBConfig/Mongo");

// Load environment variables
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// API routes for the contact form
app.use('/api', contactRoutes);

// CORS configuration (make sure only one is used)
app.use(
  cors({
    origin: "*", // Allow all origins, modify for specific domains if needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Call the function to connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;

// Test route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
