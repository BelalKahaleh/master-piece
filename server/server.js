const express = require('express');
const cors = require('cors');
const path = require('path') 
const dotenv = require('dotenv');
const contactRoutes = require('./route/contactRoute')
const app = express();
const connectDB = require("./DBConfig/Mongo");
const cookieParser = require("cookie-parser");
const studentRoute = require("./route/studentRoute");
const adminRoute = require("./route/adminRoute");
const authRoutes = require('./route/adminAuthRoute');
const newsRoutes = require('./route/newsRoute');
const classRoutes = require('./route/classRoute');
const teacherRoutes = require('./route/teacherRoute');
const quizRoutes = require('./route/quizRoute');

dotenv.config();

// Connect to MongoDB
connectDB();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/students', studentRoute);
app.use('/api/admin', adminRoute);
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/quizzes', quizRoutes);

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDirs = ['uploads', 'uploads/teachers', 'uploads/students'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

