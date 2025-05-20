// src/pages/AdminDashboard.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentNavbar from "./components/StudentNavbar";
import StudentHome from "./pages/student/StudentHome";
import StudentProfile from "./pages/student/StudentProfile";
import StudentCourses from "./pages/student/StudentCourses";
import StudentGuide from "./pages/student/StudentGuide";
import StudentExam from "./pages/student/StudentExam";
import TakeQuiz from "./pages/student/TakeQuiz";

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-[#FAF7F0]">
      <StudentNavbar /> {/* Sidebar for Admin Dashboard */}
      <div className="pt-16">
        {/* Define admin routes */}
        <Routes>
          <Route path="/" element={<StudentHome />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="guide" element={<StudentGuide />} />
          <Route path="exam" element={<StudentExam />} />
          <Route path="exam/:quizId" element={<TakeQuiz />} />
           {/* <Route path="/studentcourses" element={<CoursesStudent />} />
           <Route path="/exam" element={<StudentExam />} />
           <Route path="/marks" element={<StudentMark />} />
           <Route path="/studentGuide" element={<StudentGuide />} />  */}
        </Routes>
      </div>
    </div>
  );
}
