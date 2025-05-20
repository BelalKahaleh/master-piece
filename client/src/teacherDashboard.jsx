// src/teacherDashboard.jsx
import React from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import TeacherNavbar from "./components/TeacherNavbar";
import TeacherProfile from "./pages/teacher/teacherProfile";
import CoursesTeacher from "./pages/teacher/CoursesTeacher";
import QuizManager from "./pages/teacher/QuizManager";
import TeacherGuide from "./pages/teacher/TeacherGuide";


export default function TeacherDashboard() {
  return (
    <div className="flex">

      {/* Teacher Navbar (Sidebar/Header) */}
      <TeacherNavbar />

      {/* Main Content Area for Nested Routes - Added pt-20 for space below navbar */}
      <div className="flex-1 bg-[#FAF7F0] p-4 pt-24 lg:pt-4"> {/* Removed mt-16 lg:mt-0, added pt-24 */}
        <Routes>
          {/* Define nested teacher routes here */}

          {/* Route for /teacher/teacherProfile */}
          <Route path="teacherProfile" element={<TeacherProfile />} />

          {/* Add routes for other teacher pages, e.g., */}
          <Route path="coursesTeacher" element={<CoursesTeacher />} />
          <Route path="QuizManager" element={<QuizManager />} />
          
          <Route path="teacherGuide" element={<TeacherGuide />} />


        </Routes>
     

      </div>
    </div>
  );
}
