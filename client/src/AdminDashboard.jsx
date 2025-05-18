// src/pages/AdminDashboard.jsx
import React, { useEffect, useRef } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Courses from "./pages/Courses";
import Messages from "./pages/Messages";
import News from "./pages/News";
import Admins from "./pages/Admins" 

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (!hasNavigated.current && (!user || user.role !== "admin")) {
      hasNavigated.current = true;
      navigate("/admin/login");
    }
  }, [user, navigate]);

  // If not admin, don't render anything
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex-1 bg-gray-100 p-4">
      {/* Define admin routes */}
      <Routes>
        {/* Default route for admin dashboard */}
        <Route path="/" element={<Navigate to="/admin/students" />} />
        <Route path="/students" element={<Students />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/classes" element={<Courses />} />
        <Route path="/news" element={<News />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/allAdmins" element={<Admins />} />
        {/* Catch-all route to redirect if an invalid route is accessed */}
        <Route path="*" element={<Navigate to="/admin/students" />} />
      </Routes>
    </div>
  );
}
