// File: src/pages/Admin/Admins.jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-hot-toast'
import SidebarAdmin from '../components/SidebarAdmin'

const COLORS = {
  bg: '#FAF7F0',
  border: '#D8D2C2',
  accent: '#B17457',
  text: '#4A4947',
}

// Base URL for API
const API_URL = 'http://localhost:5000/api/admin'

const Admins = () => {
  const [admins, setAdmins] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(API_URL, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      toast.error('فشل في تحميل بيانات المشرفين');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(API_URL, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      toast.success('تم إضافة المشرف بنجاح');
      setFormData({
        fullName: '',
        email: '',
        password: ''
      });
      setShowModal(false);
      fetchAdmins();
    } catch (error) {
      console.error('Error creating admin:', error);
      if (error.response) {
        setError(error.response.data.message || 'فشل في إضافة المشرف');
        toast.error(error.response.data.message || 'فشل في إضافة المشرف');
      } else {
        setError('فشل في إضافة المشرف');
        toast.error('فشل في إضافة المشرف');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'هل أنت متأكد؟',
        text: 'لا يمكن التراجع عن حذف المشرف!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#B17457',
        cancelButtonColor: '#D8D2C2',
        confirmButtonText: 'نعم، احذف المشرف',
        cancelButtonText: 'إلغاء',
        reverseButtons: true
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`${API_URL}/${id}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        setAdmins(prevAdmins => prevAdmins.filter(admin => admin._id !== id));
        
        Swal.fire({
          title: 'تم الحذف!',
          text: 'تم حذف المشرف بنجاح',
          icon: 'success',
          confirmButtonColor: '#B17457'
        });
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      
      Swal.fire({
        title: 'خطأ!',
        text: error.response?.data?.message || 'فشل في حذف المشرف',
        icon: 'error',
        confirmButtonColor: '#B17457'
      });
    }
  };

  const Field = ({ label, children }) => (
    <div className="mb-4">
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: COLORS.text }}
      >
        {label}
      </label>
      {children}
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#FAF7F0]" dir="rtl">
      {/* Hamburger button for mobile */}
      <button
        className="fixed top-4 right-4 z-50 p-2 bg-[#B17457] text-white rounded lg:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Sidebar */}
      <SidebarAdmin sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Main Content */}
      <div className="flex-1 p-2 sm:p-4 md:p-6">
        {/* Enhanced Header */}
        <div className="px-6 py-8 rounded-lg shadow-sm mb-8" style={{ backgroundColor: COLORS.bg, borderBottom: `2px solid ${COLORS.accent}` }}>
          <h1 className="text-3xl font-bold mb-3" style={{ color: COLORS.text }}>
            المسؤولون
          </h1>
          <p className="text-sm opacity-75" style={{ color: COLORS.text }}>
            إدارة بيانات المسؤولين
          </p>
        </div>

        <div className="py-6">
          {/* Enhanced Stats Card */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 border" style={{ borderColor: COLORS.border }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <span className="text-lg font-medium" style={{ color: COLORS.text }}>
                  عدد المسؤولين: 
                </span>
                <span className="text-2xl font-bold mr-2" style={{ color: COLORS.accent }}>
                  {admins.length}
                </span>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="py-2.5 px-6 rounded-lg text-white font-medium transition-all hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
                style={{ backgroundColor: COLORS.accent }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                إضافة مسؤول
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              {error}
            </div>
          )}

          {Array.isArray(admins) && admins.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border" style={{ borderColor: COLORS.border }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill={COLORS.accent} className="mx-auto mb-4 opacity-50" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
              </svg>
              <p className="text-xl font-medium mb-2" style={{ color: COLORS.text }}>
                لا يوجد مسؤولين حالياً
              </p>
              <p className="text-sm opacity-70" style={{ color: COLORS.text }}>
                قم بإضافة مسؤول جديد للبدء
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admins.map(admin => (
                <div
                  key={admin._id}
                  className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-all duration-300"
                  style={{ borderColor: COLORS.border }}
                >
                  <div className="h-2 rounded-t-lg" style={{ backgroundColor: COLORS.accent }}></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-xl" style={{ color: COLORS.text }}>
                        {admin.fullName}
                      </h3>
                      <button
                        onClick={() => handleDeleteAdmin(admin._id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                        title="حذف المسؤول"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                          <path
                            fillRule="evenodd"
                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill={COLORS.accent}
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                        </svg>
                        <span className="text-sm" style={{ color: COLORS.text }}>
                          {admin.fullName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill={COLORS.accent}
                          viewBox="0 0 16 16"
                        >
                          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                        </svg>
                        <span className="text-sm" style={{ color: COLORS.text }}>
                          {admin.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <div 
              className="bg-white p-8 rounded-lg w-full max-w-md shadow-xl border" 
              style={{ borderTop: `4px solid ${COLORS.accent}` }} 
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.text }}>
                إضافة مسؤول جديد
              </h2>
              <NewAdminForm 
                onSuccess={() => {
                  setShowModal(false);
                  fetchAdmins();
                }}
                onCancel={() => setShowModal(false)}
                accentColor={COLORS.accent}
                borderColor={COLORS.border}
                bgColor={COLORS.bg}
                textColor={COLORS.text}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function NewAdminForm({ onSuccess, onCancel, accentColor, borderColor, bgColor, textColor }) {
  const [fields, setFields] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/admin', fields, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      toast.success('تم إضافة المشرف بنجاح');
      setFields({ fullName: '', email: '', password: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في إضافة المشرف');
      toast.error(err.response?.data?.message || 'فشل في إضافة المشرف');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" style={{ color: textColor }}>اسم المسؤول الكامل</label>
        <input
          type="text"
          name="fullName"
          value={fields.fullName}
          onChange={handleChange}
          required
          placeholder="أدخل الاسم الكامل"
          className="w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all"
          style={{ borderColor, backgroundColor: bgColor }}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" style={{ color: textColor }}>البريد الالكتروني</label>
        <input
          type="email"
          name="email"
          value={fields.email}
          onChange={handleChange}
          required
          placeholder="example@domain.com"
          className="w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all"
          style={{ borderColor, backgroundColor: bgColor }}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" style={{ color: textColor }}>كلمة السر</label>
        <input
          type="password"
          name="password"
          value={fields.password}
          onChange={handleChange}
          required
          placeholder="********"
          className="w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all"
          style={{ borderColor, backgroundColor: bgColor }}
        />
      </div>
      {error && (
        <div className="mb-2 p-2 rounded bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
      )}
      <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor }}>
        <button
          type="button"
          onClick={onCancel}
          className="py-2.5 px-6 rounded-lg border font-medium transition-all hover:bg-gray-50"
          style={{ borderColor, color: textColor }}
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={loading}
          className="py-2.5 px-6 rounded-lg text-white font-medium transition-all hover:opacity-90 flex items-center gap-2"
          style={{ backgroundColor: accentColor }}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري الحفظ...
            </>
          ) : 'حفظ'}
        </button>
      </div>
    </form>
  );
}

export default Admins
