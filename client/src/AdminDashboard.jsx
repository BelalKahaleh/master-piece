// src/pages/AdminDashboard.jsx
import React, { useEffect, useRef, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Courses from "./pages/Courses";
import Messages from "./pages/Messages";
import News from "./pages/News";
import Admins from "./pages/Admins";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verify token with backend
        const response = await fetch("http://localhost:5000/api/admin/verify", {
          credentials: "include",
        });

        if (!response.ok) {
          setIsAuthorized(false);
          if (!hasNavigated.current) {
            hasNavigated.current = true;
            navigate("/adminLogin", { replace: true });
          }
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthorized(false);
        if (!hasNavigated.current) {
          hasNavigated.current = true;
          navigate("/adminLogin", { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/adminLogin", { replace: true });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not authorized, don't render anything
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex-1 bg-gray-100 p-4">
      {/* Removed the top right logout button. The only logout button is now in the sidebar. */}
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
