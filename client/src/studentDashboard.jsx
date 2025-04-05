// src/pages/AdminDashboard.jsx
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import News from "./pages/News";

export default function studentDashboard() {
  return (
    <div className="flex">
        
      <SidebarStudent /> {/* Sidebar for Admin Dashboard */}
      <div className="flex-1 bg-gray-100 p-4">
        {/* Define admin routes */}
        <Routes>
          {/* Default route for admin dashboard */}
          <Route path="/studentGate" element={<Navigate to="/student/studentProfile" />} />
          
          <Route path="/studentProfile" element={<StudentProfile />} />
          <Route path="/studentcourses" element={<CoursesStudent />} />
          <Route path="/exam" element={<StudentExam />} />
          <Route path="/marks" element={<StudentMark />} />
          <Route path="/studentGuide" element={<StudentGuide />} />
          
          {/* Catch-all route to redirect if an invalid route is accessed */}
          <Route path="studentGate" element={<Navigate to="/student/profile" />} />
        </Routes>
      </div>
    </div>
  );
}
