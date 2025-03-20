// src/pages/AdminDashboard.jsx
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SidebarAdmin from "./components/SidebarAdmin";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Parents from "./pages/Parents";
import Courses from "./pages/Courses";
import Messages from "./pages/Messages";
import News from "./pages/News";

export default function AdminDashboard() {
  return (
    <div className="flex">
        
      <SidebarAdmin /> {/* Sidebar for Admin Dashboard */}
      <div className="flex-1 bg-gray-100 p-4">
        {/* Define admin routes */}
        <Routes>
          {/* Default route for admin dashboard */}
          <Route path="/" element={<Navigate to="/admin/students" />} />
          
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/parents" element={<Parents />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/news" element={<News />} />
          <Route path="/messages" element={<Messages />} />
          
          {/* Catch-all route to redirect if an invalid route is accessed */}
          <Route path="*" element={<Navigate to="/admin/students" />} />
        </Routes>
      </div>
    </div>
  );
}
