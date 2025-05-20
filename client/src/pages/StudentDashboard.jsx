import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Home, BookOpen, Calendar, User, LogOut } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { toast } from 'react-toastify';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/students/logout`, {}, { withCredentials: true });
      toast.success('تم تسجيل الخروج بنجاح');
      navigate('/student-login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-[#B17457] mb-8 text-center">لوحة الطالب</h2>
          <nav className="space-y-2">
            <Link
              to="/student-dashboard"
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#FAF7F0] text-[#4A4947]"
            >
              <Home size={20} />
              <span>الرئيسية</span>
            </Link>
            <Link
              to="/student-dashboard/courses"
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#FAF7F0] text-[#4A4947]"
            >
              <BookOpen size={20} />
              <span>الدورات</span>
            </Link>
            <Link
              to="/student-dashboard/schedule"
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#FAF7F0] text-[#4A4947]"
            >
              <Calendar size={20} />
              <span>الجدول</span>
            </Link>
            <Link
              to="/student-dashboard/profile"
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#FAF7F0] text-[#4A4947]"
            >
              <User size={20} />
              <span>الملف الشخصي</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-red-50 text-red-600"
            >
              <LogOut size={20} />
              <span>تسجيل الخروج</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 