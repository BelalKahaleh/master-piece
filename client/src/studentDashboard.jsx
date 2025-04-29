// src/pages/AdminDashboard.jsx
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import News from "./pages/News";
import StudentNavbar from "./components/StudentNavbar";

export default function studentDashboard() {
  return (
    <div className="flex">
        
      <StudentNavbar /> {/* Sidebar for Admin Dashboard */}
      <div className="flex-1 bg-gray-100 p-4">
        {/* Define admin routes */}
        <Routes>
          {/* Default route for admin dashboard */}
          {/* <Route path="/" element={<StudentProfile />} />
          <Route path="/studentcourses" element={<CoursesStudent />} />
          <Route path="/exam" element={<StudentExam />} />
          <Route path="/marks" element={<StudentMark />} />
          <Route path="/studentGuide" element={<StudentGuide />} /> */}
          
          {/* Catch-all route to redirect if an invalid route is accessed */}
      
        </Routes>
      </div>
    </div>
  );
}
