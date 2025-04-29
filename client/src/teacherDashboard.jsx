// src/pages/AdminDashboard.jsx
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import News from "./pages/News";
import TeacherNavbar from "./components/TeacherNavbar";

export default function teacherDashboard() {
  return (
    <div className="flex">
        
      <TeacherNavbar /> {/* Sidebar for Admin Dashboard */}
      <div className="flex-1 bg-gray-100 p-4">
        {/* Define admin routes */}
        <Routes>
          {/* Default route for admin dashboard
          <Route path="/teacherGate" element={<Navigate to="/teacher/teacherProfile" />} />
          
          <Route path="/teacherProfile" element={<TeacherProfile />} />
          <Route path="/coursesTeacher" element={<CoursesTeacher />} />
          <Route path="/examTeacher" element={<TeacherExam />} />
          <Route path="/marksTeacher" element={<TeacherMark />} />
          <Route path="/teacherGuide" element={<TeacherGuide />} />
          
          
          <Route path="teacherGate" element={<Navigate to="/teacher/teacherProfile" />} /> */}
          
        </Routes>
      </div>
    </div>
  );
}
