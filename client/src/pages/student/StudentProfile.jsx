import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { UserCircleIcon, EnvelopeIcon, AcademicCapIcon, DocumentTextIcon, PhotoIcon, CameraIcon } from '@heroicons/react/24/outline';

const COLORS = {
  bg: '#FAF7F0',
  border: '#D8D2C2',
  accent: '#B17457',
  text: '#4A4947',
  lightAccent: 'rgba(177, 116, 87, 0.1)',
};

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler for password input changes
  const handlePasswordInputChange = (e) => {
    const { id, value } = e.target;
    setPasswordForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
    setPasswordError(''); // Clear previous errors on input change
  };

  // Handler for password change form submission
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقين.');
      setIsSubmitting(false);
      return;
    }

    if (!student || !student._id) {
      setPasswordError('خطأ في بيانات الطالب.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/students/${student._id}/password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Close modal and reset form on success
        setShowPasswordModal(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        // Optionally show a success message (e.g., using react-hot-toast)
        // toast.success('تم تغيير كلمة المرور بنجاح');
      } else {
        // Handle backend errors (e.g., incorrect current password)
        setPasswordError(response.data.message || 'حدث خطأ أثناء تغيير كلمة المرور.');
      }
    } catch (error) {
      console.error('Change password error:', error);
      setPasswordError(error.response?.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('الرجاء اختيار ملف صورة صالح');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);

    setIsUploading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/students/${student._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        }
      );

      if (response.data.student) {
        setStudent(response.data.student);
        // Optionally show success message
        alert('تم تحديث الصورة الشخصية بنجاح');
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
      alert('حدث خطأ أثناء رفع الصورة');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetchStudent = async () => {
      const storedStudent = localStorage.getItem('student');
      if (!storedStudent) {
        setError('لا توجد بيانات للطالب. يرجى تسجيل الدخول.');
        setLoading(false);
        return;
      }

      try {
        const studentData = JSON.parse(storedStudent);
        if (!studentData._id) {
          setError('لا يوجد رقم تعريف للطالب.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/students/${studentData._id}`, {
          withCredentials: true
        });
        setStudent(response.data);
      } catch (err) {
        setError('حدث خطأ أثناء جلب بيانات الطالب.');
        console.error('Error fetching student data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  if (loading) {
    return (
      <div>
        <h1>DEBUG: StudentProfile Rendered (Loading)</h1>
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.bg }}>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: COLORS.accent }}></div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div>
        <h1>DEBUG: StudentProfile Rendered (Error)</h1>
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.bg }}>
          <div className="text-center p-6 rounded-lg" style={{ backgroundColor: COLORS.border + '40', border: `1px solid ${COLORS.border}`, color: COLORS.text }}>
            {error || 'لا توجد بيانات.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>DEBUG: StudentProfile Rendered (Success)</h1>
      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: COLORS.bg }} dir="rtl">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6 md:p-8" style={{ borderColor: COLORS.border, borderWidth: '1px' }}>
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start border-b pb-6 mb-6" style={{ borderColor: COLORS.border }}>
            {/* Photo */}
            <div className="flex-shrink-0 mb-6 md:mb-0 md:ml-8 relative group">
              {student.studentPhotoPath ? (
                <div className="relative">
                  <img
                    src={`http://localhost:5000/uploads/students/${student.studentPhotoPath.split(/[\\/]/).pop()}`}
                    alt="Student Photo"
                    className="w-32 h-32 rounded-full object-cover border-2"
                    style={{ borderColor: COLORS.border }}
                    onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-user.png'; }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <CameraIcon className="w-8 h-8 text-white" />
                  </button>
                </div>
              ) : (
                <div 
                  className="w-32 h-32 rounded-full flex items-center justify-center border-2 cursor-pointer relative group"
                  style={{ borderColor: COLORS.border, backgroundColor: COLORS.lightAccent }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UserCircleIcon className="w-20 h-20" style={{ color: COLORS.accent }} />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <CameraIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
                disabled={isUploading}
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-grow text-center md:text-right">
              <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>{student.fullName}</h2>
              <div className="text-sm space-y-2" style={{ color: COLORS.text }}>
                <p className="flex items-center justify-center md:justify-end">
                  <EnvelopeIcon className="w-5 h-5 ml-2" />
                  {student.email}
                </p>
                <p className="flex items-center justify-center md:justify-end">
                  <AcademicCapIcon className="w-5 h-5 ml-2" />
                  {student.stage}
                </p>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.text }}>المستندات</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {student.transcriptPath && (
                <div className="border rounded-lg p-4 flex flex-col items-center text-center transition-all hover:shadow-md" style={{ borderColor: COLORS.border }}>
                  <DocumentTextIcon className="w-12 h-12 mb-2" style={{ color: COLORS.accent }} />
                  <p className="text-base font-semibold mb-4" style={{ color: COLORS.text }}>كشف العلامات</p>
                  <a
                    href={`http://localhost:5000/uploads/students/${student.transcriptPath.split(/[\\/]/).pop()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 px-4 rounded-lg text-white font-medium transition-colors mt-auto"
                    style={{ backgroundColor: COLORS.accent }}
                  >
                    عرض المستند
                  </a>
                </div>
              )}

              {student.birthCertPath && (
                <div className="border rounded-lg p-4 flex flex-col items-center text-center transition-all hover:shadow-md" style={{ borderColor: COLORS.border }}>
                  <DocumentTextIcon className="w-12 h-12 mb-2" style={{ color: COLORS.accent }} />
                  <p className="text-base font-semibold mb-4" style={{ color: COLORS.text }}>شهادة الميلاد</p>
                  <a
                    href={`http://localhost:5000/uploads/students/${student.birthCertPath.split(/[\\/]/).pop()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 px-4 rounded-lg text-white font-medium transition-colors mt-auto"
                    style={{ backgroundColor: COLORS.accent }}
                  >
                    عرض المستند
                  </a>
                </div>
              )}

              {student.studentPhotoPath && (
                <div className="border rounded-lg p-4 flex flex-col items-center text-center transition-all hover:shadow-md" style={{ borderColor: COLORS.border }}>
                  <PhotoIcon className="w-12 h-12 mb-2" style={{ color: COLORS.accent }} />
                  <p className="text-base font-semibold mb-4" style={{ color: COLORS.text }}>الصورة الشخصية</p>
                  <a
                    href={`http://localhost:5000/uploads/students/${student.studentPhotoPath.split(/[\\/]/).pop()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 px-4 rounded-lg text-white font-medium transition-colors mt-auto"
                    style={{ backgroundColor: COLORS.accent }}
                  >
                    عرض الصورة
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Change Password Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-6 py-2 rounded-lg text-white font-medium transition-colors"
              style={{ backgroundColor: COLORS.accent, hover: { backgroundColor: COLORS.darkAccent } }}
            >
              تغيير كلمة المرور
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4" dir="rtl">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" style={{ borderColor: COLORS.border, borderWidth: '1px' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.text }}>تغيير كلمة المرور</h2>
            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }} htmlFor="currentPassword">كلمة المرور الحالية</label>
                <input
                  type="password"
                  id="currentPassword"
                  className="w-full px-3 py-2 border rounded-lg" style={{ borderColor: COLORS.border, color: COLORS.text, backgroundColor: COLORS.bg }}
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }} htmlFor="newPassword">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full px-3 py-2 border rounded-lg" style={{ borderColor: COLORS.border, color: COLORS.text, backgroundColor: COLORS.bg }}
                  value={passwordForm.newPassword}
                  onChange={handlePasswordInputChange}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }} htmlFor="confirmNewPassword">تأكيد كلمة المرور الجديدة</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  className="w-full px-3 py-2 border rounded-lg" style={{ borderColor: COLORS.border, color: COLORS.text, backgroundColor: COLORS.bg }}
                  value={passwordForm.confirmNewPassword}
                  onChange={handlePasswordInputChange}
                  required
                />
              </div>

              {passwordError && (
                <p className="text-red-500 text-sm mb-4 text-center">{passwordError}</p>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-lg border mr-2" style={{ borderColor: COLORS.border, color: COLORS.text, backgroundColor: COLORS.bg }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-white font-medium" style={{ backgroundColor: COLORS.accent }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'جاري التغيير...' : 'تغيير'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile; 