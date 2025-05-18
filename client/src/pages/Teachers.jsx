import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../components/SidebarAdmin';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  UserIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const COLORS = {
  bg:     '#FAF7F0',
  border: '#D8D2C2',
  accent: '#B17457',
  text:   '#4A4947'
};

const API = 'http://localhost:5000/api/teachers';

const Teachers = () => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [spec, setSpec] = useState('');
  const [showModal, setShow] = useState(false);
  const [showDetailsModal, setShowDetails] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    specialization: '',
    resume: null,
    photo: null
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const specs = [
    'عربي','انجليزي','رياضيات','علوم','رياضة',
    'كيمياء','فيزياء','علوم ارض','احياء',
    'تربية اسلامية','اجتماعيات','تاريخ الاردن','جغرافيا'
  ];

  useEffect(() => { fetchList() }, [search, spec]);

  const fetchList = async () => {
    try {
      const res = await fetch(`${API}?search=${search}&specialization=${spec}`, {
        credentials: 'include'
      });
      const data = await res.json();
      setList(data);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    }
  };

  const handleInput = e => {
    const { name, value, files } = e.target;
    if (files) setForm(f => ({ ...f, [name]: files[0] }));
    else setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k,v]) => v != null && data.append(k,v));
    
    try {
      await fetch(API, {
        method: 'POST',
        body: data,
        credentials: 'include'
      });
      
      setShow(false);
      setForm({
        fullName: '', email: '', password: '', specialization: '',
        resume: null, photo: null
      });
      fetchList();
    } catch (error) {
      console.error("Failed to add teacher:", error);
    }
  };

  const handleDeleteTeacher = async (id) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "لن تستطيع التراجع عن هذا الإجراء!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: COLORS.accent,
      cancelButtonColor: COLORS.border,
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await fetch(`${API}/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        setList(prevList => prevList.filter(teacher => teacher._id !== id));
        toast.success('تم حذف المعلم بنجاح');
      } catch (error) {
        console.error('Error deleting teacher:', error);
        toast.error('فشل في حذف المعلم');
      }
    }
  };

  const handleViewDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDetails(true);
  };

  const handleEditTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setForm({
      fullName: teacher.fullName,
      email: teacher.email,
      specialization: teacher.specialization,
      resume: null,
      photo: null
    });
    setShow(true);
  };

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
        {/* Header */}
        <div className="px-4 py-6 shadow-sm" style={{ backgroundColor: COLORS.bg, borderBottom: `1px solid ${COLORS.border}` }}>
          <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
            الأساتذة
          </h1>
          <p className="text-sm opacity-75" style={{ color: COLORS.text }}>
            إدارة بيانات المعلمين والتخصصات
          </p>
        </div>

        <div className="py-6">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row md:items-center md:justify-between border" style={{ borderColor: COLORS.border }}>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto mb-4 md:mb-0">
              <input
                type="text"
                placeholder="ابحث بالاسم أو البريد"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="py-2 px-4 rounded-lg border focus:ring-2 focus:ring-opacity-50"
                style={{ borderColor: COLORS.border, width: '100%', maxWidth: '250px', backgroundColor: COLORS.bg, color: COLORS.text }}
              />
              <select
                value={spec}
                onChange={e => setSpec(e.target.value)}
                className="py-2 px-4 rounded-lg border focus:ring-2 focus:ring-opacity-50"
                style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg, color: COLORS.text }}
              >
                <option value="">جميع التخصصات</option>
                {specs.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShow(true)}
              className="py-2 px-5 rounded-lg text-white font-medium transition-transform hover:scale-105 shadow-md hover:shadow-lg"
              style={{ backgroundColor: COLORS.accent }}
            >
              اضافة استاذ
            </button>
          </div>

          {/* Teacher List */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map(t => (
              <div
                key={t._id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all"
                style={{ borderColor: COLORS.border }}
              >
                <div className="h-2" style={{ backgroundColor: COLORS.accent }}></div>
                <div className="p-5">
                  <div className="flex items-center space-x-4 space-x-reverse mb-4">
                    {t.photo ? (
                      <img
                        src={`${API}/uploads/${t.photo}`}
                        alt={t.fullName}
                        className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-[#D8D2C2] flex items-center justify-center">
                        <UserIcon className="h-8 w-8 text-[#4A4947]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold mb-1 truncate" style={{ color: COLORS.text }}>
                        {t.fullName}
                      </h2>
                      <p className="mb-1 font-medium" style={{ color: COLORS.accent }}>{t.specialization}</p>
                      <p className="text-sm truncate" style={{ color: COLORS.text }}>{t.email}</p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 space-x-reverse">
                    <button
                      onClick={() => handleViewDetails(t)}
                      className="p-2 rounded-md transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{ color: COLORS.accent, '--tw-ring-color': COLORS.accent }}
                      aria-label="عرض التفاصيل"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEditTeacher(t)}
                      className="p-2 rounded-md transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{ color: COLORS.accent, '--tw-ring-color': COLORS.accent }}
                      aria-label="تعديل المعلم"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTeacher(t._id)}
                      className="p-2 rounded-md transition-colors duration-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{ color: COLORS.accent, '--tw-ring-color': COLORS.accent }}
                      aria-label="حذف المعلم"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {list.length === 0 && (
              <div className="col-span-full py-16 text-center text-lg" style={{ color: COLORS.text }}>
                لا توجد نتائج
              </div>
            )}
          </div>
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedTeacher && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDetails(false)}
          >
            <div
              className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl border"
              style={{ borderColor: COLORS.border }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold" style={{ color: COLORS.text }}>
                  تفاصيل المعلم
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">الاسم الكامل</h3>
                    <p className="mt-1" style={{ color: COLORS.text }}>{selectedTeacher.fullName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">البريد الإلكتروني</h3>
                    <p className="mt-1" style={{ color: COLORS.text }}>{selectedTeacher.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">التخصص</h3>
                    <p className="mt-1" style={{ color: COLORS.text }}>{selectedTeacher.specialization}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">رقم الهاتف</h3>
                    <p className="mt-1" style={{ color: COLORS.text }}>{selectedTeacher.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">العنوان</h3>
                    <p className="mt-1" style={{ color: COLORS.text }}>{selectedTeacher.address}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">المرحلة التدريسية</h3>
                    <p className="mt-1" style={{ color: COLORS.text }}>{selectedTeacher.stage}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedTeacher.photo && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">الصورة الشخصية</h3>
                      {console.log('Teacher Photo URL:', `${API}/uploads/${selectedTeacher.photo}`)}
                      <img
                        src={`${API}/uploads/${selectedTeacher.photo}`}
                        alt={selectedTeacher.fullName}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  {selectedTeacher.resume && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">السيرة الذاتية</h3>
                      {console.log('Teacher Resume URL:', `${API}/uploads/${selectedTeacher.resume}`)}
                      <a
                        href={`${API}/uploads/${selectedTeacher.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white"
                        style={{ backgroundColor: COLORS.accent }}
                      >
                        <PhotoIcon className="h-5 w-5 ml-2" />
                        عرض السيرة الذاتية
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShow(false)}
          >
            <div
              className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl border"
              style={{ borderColor: COLORS.border }}
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl mb-6 font-bold" style={{ color: COLORS.text }}>
                إضافة أستاذ جديد
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium" style={{ color: COLORS.text }}>
                    اسم الاستاذ الكامل
                  </label>
                  <input
                    name="fullName"
                    required
                    value={form.fullName}
                    onChange={handleInput}
                    className="w-full py-2 px-3 border rounded focus:ring-2 focus:outline-none"
                    style={{ borderColor: COLORS.border, color: COLORS.text, backgroundColor: COLORS.bg }}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium" style={{ color: COLORS.text }}>
                    كلمة السر
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={handleInput}
                    className="w-full py-2 px-3 border rounded focus:ring-2 focus:outline-none"
                    style={{ borderColor: COLORS.border, color: COLORS.text, backgroundColor: COLORS.bg }}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium" style={{ color: COLORS.text }}>
                    البريد الإلكتروني
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleInput}
                    className="w-full py-2 px-3 border rounded focus:ring-2 focus:outline-none"
                    style={{ borderColor: COLORS.border, color: COLORS.text, backgroundColor: COLORS.bg }}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium" style={{ color: COLORS.text }}>
                    التخصص
                  </label>
                  <select
                    name="specialization"
                    required
                    value={form.specialization}
                    onChange={handleInput}
                    className="w-full py-2 px-3 border rounded focus:ring-2 focus:outline-none"
                    style={{ borderColor: COLORS.border, color: COLORS.text, backgroundColor: COLORS.bg }}
                  >
                    <option value="">-- اختر التخصص --</option>
                    {specs.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium" style={{ color: COLORS.text }}>
                    السيرة الذاتية (PDF)
                  </label>
                  <input
                    name="resume"
                    type="file"
                    accept=".pdf"
                    onChange={handleInput}
                    className="w-full py-2 px-3 border rounded focus:ring-2 focus:outline-none"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium" style={{ color: COLORS.text }}>
                    صورة شخصية (صورة فقط)
                  </label>
                  <input
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleInput}
                    className="w-full py-2 px-3 border rounded focus:ring-2 focus:outline-none"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                  />
                </div>

                <div className="flex justify-between pt-4 border-t" style={{ borderColor: COLORS.border }}>
                  <button
                    type="button"
                    onClick={() => setShow(false)}
                    className="py-2 px-5 rounded-lg border font-medium transition-colors hover:bg-gray-50"
                    style={{ borderColor: COLORS.border, color: COLORS.text }}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-6 rounded-lg font-medium text-white transition-colors"
                    style={{ backgroundColor: COLORS.accent }}
                  >
                    تأكيد
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teachers; 