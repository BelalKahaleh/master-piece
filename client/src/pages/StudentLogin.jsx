import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';
import HomeLinkButton from '../components/HomeLinkButton';

const COLORS = {
  bg: '#FAF7F0', // Lightest
  border: '#D8D2C2', // Light-Medium
  accent: '#B17457', // Accent
  text: '#4A4947', // Darkest
  inputBg: '#F0EDE5', // A color slightly lighter than main background for input fields
};

// Simple user icon component
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#B17457]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StudentLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/students/login`, formData, {
        withCredentials: true
      });

      if (response.data.message === 'success') {
        // Save student data to localStorage
        localStorage.setItem('student', JSON.stringify(response.data.student));
        toast.success('تم تسجيل الدخول بنجاح');
        navigate('/student-dashboard/profile');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-8 relative" style={{ backgroundColor: COLORS.bg }} dir="rtl">
      <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 10 }}>
        <HomeLinkButton onClick={() => navigate('/')} />
      </div>
      <div className="w-full max-w-sm p-8 space-y-6 rounded-lg shadow-xl" style={{ backgroundColor: '#FFFFFF', borderColor: COLORS.border, borderWidth: '1px' }}>
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="rounded-full p-3" style={{ backgroundColor: COLORS.bg }}>
             <UserIcon />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: COLORS.text }}>تسجيل دخول الطالب</h2>
        {error && <div className="text-center p-3 rounded mb-4" style={{ color: COLORS.accent, backgroundColor: COLORS.border + '40', border: `1px solid ${COLORS.accent}` }}>{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1 text-right" style={{ color: COLORS.text }}>البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 transition duration-200 text-right placeholder-right" style={{ borderColor: COLORS.border, borderWidth: '1px', color: COLORS.text, backgroundColor: COLORS.inputBg, focusBorderColor: COLORS.accent, focusRingColor: COLORS.accent + '60' }}
              placeholder="example@school.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-right" style={{ color: COLORS.text }}>كلمة المرور</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 transition duration-200 text-right placeholder-right" style={{ borderColor: COLORS.border, borderWidth: '1px', color: COLORS.text, backgroundColor: COLORS.inputBg, focusBorderColor: COLORS.accent, focusRingColor: COLORS.accent + '60' }}
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 text-lg font-semibold rounded-md hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200" style={{ backgroundColor: COLORS.accent, color: COLORS.bg, borderColor: COLORS.accent, borderWidth: '1px', focusRingColor: COLORS.accent }}
          >
            {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin; 