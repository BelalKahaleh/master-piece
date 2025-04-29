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
// const teacherRoutes = require('./route/teacherRoute');
// const classRoutes = require('./route/classRoute');


dotenv.config();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
// Middleware
app.use(
  cors({
    origin: CLIENT_URL, // Allow all origins, modify for specific domains if needed
    methods: ['GET','POST','PATCH','DELETE','PUT'],
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());

app.use("/api/admins", adminRoute);
app.use('/api', contactRoutes)
app.use("/api/students", studentRoute);
app.use('/api/admin', authRoutes);
app.use('/api/news', newsRoutes);
// app.use('/api/teachers', teacherRoutes);
// app.use('/api/classes', classRoutes);



app.use(
  '/uploads',                           
  express.static(path.join(__dirname, 'uploads'))
)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE')
  next()
})

// Call the function to connect to MongoDB
connectDB();

const PORT = process.env.PORT || 8000;

// Test route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

