import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { UserCircleIcon, EnvelopeIcon, AcademicCapIcon, BriefcaseIcon, DocumentTextIcon, PhotoIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const COLORS = {
  bg: '#FAF7F0', // Lightest
  border: '#D8D2C2', // Light-Medium
  accent: '#B17457', // Accent
  text: '#4A4947', // Darkest
  lightAccent: 'rgba(177, 116, 87, 0.1)', // Light accent for backgrounds
  darkAccent: '#9A6249', // Darker accent
  inputBg: '#F0F0F0', // Added input background color
};

const API_URL = 'http://localhost:5000/api/teachers'; // Base URL for teacher API

export default function TeacherProfile() {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherData = async () => {
      const storedTeacher = localStorage.getItem('teacher');
      if (!storedTeacher) {
        setError('Teacher data not found. Please log in.');
        setLoading(false);
        // Optionally redirect to login if no teacher data
         navigate('/teacher/login');
        return;
      }

      try {
        const teacherData = JSON.parse(storedTeacher);
        // Assuming the stored teacher object has an _id field
        const teacherId = teacherData._id;

        if (!teacherId) {
             setError('Teacher ID not found in stored data.');
             setLoading(false);
             navigate('/teacher/login');
             return;
        }

        const res = await axios.get(`${API_URL}/${teacherId}`, { withCredentials: true });
        setTeacher(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teacher profile:', err);
        setError('Failed to load teacher profile.');
        setLoading(false);
        // Redirect to login if API call fails (e.g., token expired)
         if (err.response && (err.response.status === 401 || err.response.status === 403)) {
             navigate('/teacher/login');
         }
      }
    };

    fetchTeacherData();
  }, [navigate]);

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 6) { // Basic validation
         setPasswordError('New password must be at least 6 characters long.');
         return;
    }

    const storedTeacher = localStorage.getItem('teacher');
    if (!storedTeacher) {
        setPasswordError('Teacher data not found. Please log in again.');
        return;
    }
    const teacherData = JSON.parse(storedTeacher);
    const teacherId = teacherData._id;

    try {
      // Assuming a PUT endpoint for password change exists like /api/teachers/:id/password
      // NOTE: This endpoint still needs to be implemented on the backend
      const res = await axios.put(`${API_URL}/${teacherId}/password`, { 
        currentPassword: passwordForm.currentPassword, 
        newPassword: passwordForm.newPassword 
      }, { withCredentials: true });

      if (res.data.success) {
        Swal.fire({
          title: 'نجاح!',
          text: 'تم تغيير كلمة المرور بنجاح.',
          icon: 'success',
          confirmButtonColor: COLORS.accent,
        });
        setShowPasswordModal(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
           // Handle backend specific errors like invalid current password
           setPasswordError(res.data.message || 'Failed to change password.');
      }

    } catch (err) {
      console.error('Error changing password:', err);
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
        // Redirect to login if API call fails (e.g., token expired)
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            navigate('/teacher/login');
        }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.bg }} dir="rtl">
        <p style={{ color: COLORS.text }}>جاري تحميل ملف المعلم...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.bg }} dir="rtl">
        <div className="text-center p-6 rounded-lg" style={{ backgroundColor: COLORS.border + '40', border: `1px solid ${COLORS.border}`, color: COLORS.text }}>
           <p className="text-lg">حدث خطأ في تحميل البيانات.</p>
           <p className="text-sm opacity-80 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!teacher) {
       return (
         <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.bg }} dir="rtl">
            <div className="text-center p-6 rounded-lg" style={{ backgroundColor: COLORS.border + '40', border: `1px solid ${COLORS.border}`, color: COLORS.text }}>
               <p className="text-lg">لا تتوفر بيانات لهذا المعلم.</p>
            </div>
         </div>
       );
  }

  return (
    <div className="min-h-screen py-8 px-4 pt-24" style={{ backgroundColor: COLORS.bg }} dir="rtl">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6 md:p-8 pt-8" style={{ borderColor: COLORS.border, borderWidth: '1px' }} dir="rtl">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start border-b pb-6 mb-6" style={{ borderColor: COLORS.border }}>
          {/* Photo */}
          <div className="flex-shrink-0 mb-6 md:mb-0 md:ml-8">
            {teacher.photo ? (
              <img
                src={`http://localhost:5000/uploads/teachers/${teacher.photo}`}
                alt="Teacher Photo"
                className="w-32 h-32 rounded-full object-cover border-2" style={{ borderColor: COLORS.border }}
                onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-user.png'; }}
              />
            ) : (
              <div className="w-32 h-32 rounded-full flex items-center justify-center border-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.lightAccent }}>
                <UserCircleIcon className="w-20 h-20" style={{ color: COLORS.accent }} />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-grow text-center md:text-right">
            <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>{teacher.fullName}</h2>
            <p className="text-lg mb-4" style={{ color: COLORS.accent }}>{teacher.specialization}</p>
            
            <div className="text-sm space-y-2" style={{ color: COLORS.text }}>
              <p className="flex items-center justify-center md:justify-end text-right"><EnvelopeIcon className="w-5 h-5 ml-2" />{teacher.email}</p>
              {/* Add other relevant teacher info here */}
              {/* Example: <p className="flex items-center justify-center md:justify-end text-right"><AcademicCapIcon className="w-5 h-5 ml-2" />Degree: {teacher.degree}</p> */}
            </div>
          </div>
        </div>

        {/* Details Section (example for resume)*/}
        {teacher.resume && (
            <div className="mb-6 border-b pb-6" style={{ borderColor: COLORS.border }}>
                <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.text }}>السيرة الذاتية</h3>
                 <div className="flex justify-center md:justify-end">
                    <a
                        href={`http://localhost:5000/uploads/teachers/${teacher.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-2 rounded-full text-base font-medium transition duration-200 hover:opacity-90 shadow-md"
                        style={{ backgroundColor: COLORS.accent, color: COLORS.bg }}
                    >
                        <DocumentTextIcon className="w-5 h-5 ml-2" />
                        عرض السيرة الذاتية
                    </a>
                 </div>
            </div>
        )}

        {/* Password Change Section */}
        <div>
           <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.text }}>تغيير كلمة المرور</h3>
           <div className="flex justify-center md:justify-end">
               <button
                   onClick={() => setShowPasswordModal(true)}
                   className="inline-flex items-center px-6 py-2 rounded-full text-base font-medium text-white transition duration-200 hover:opacity-90 shadow-md"
                   style={{ backgroundColor: COLORS.accent }}
               >
                   <LockClosedIcon className="w-5 h-5 ml-2" />تغيير كلمة المرور
               </button>
           </div>
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl" style={{ borderColor: COLORS.border, borderWidth: '1px' }} onClick={e => e.stopPropagation()}>
                    <h4 className="text-lg font-bold mb-4" style={{ color: COLORS.text }}>تغيير كلمة المرور</h4>
                    {passwordError && <div className="text-red-600 mb-4 text-sm p-2 border rounded" style={{ borderColor: COLORS.border }}>{passwordError}</div>}
                    <form onSubmit={handleSubmitPasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>كلمة المرور الحالية</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                required
                                className="w-full px-3 py-2 rounded-md border" style={{ borderColor: COLORS.border, color: COLORS.text, backgroundColor: COLORS.inputBg }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>كلمة المرور الجديدة</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                required
                                className="w-full px-3 py-2 rounded-md border" style={{ borderColor: COLORS.border, color: COLORS.text, backgroundColor: COLORS.inputBg }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>تأكيد كلمة المرور الجديدة</label>
                            <input
                                type="password"
                                name="confirmNewPassword"
                                value={passwordForm.confirmNewPassword}
                                onChange={handlePasswordChange}
                                required
                                className="w-full px-3 py-2 rounded-md border" style={{ borderColor: COLORS.border, color: COLORS.text, backgroundColor: COLORS.inputBg }}
                            />
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setShowPasswordModal(false)}
                                className="px-4 py-2 rounded-md border transition duration-200 hover:bg-gray-100" style={{ borderColor: COLORS.border, color: COLORS.text }}
                            >
                                إلغاء
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-md text-white transition duration-200 hover:opacity-90" style={{ backgroundColor: COLORS.accent }}
                            >
                                حفظ التغيير
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
