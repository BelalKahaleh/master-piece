// src/pages/Admin/Students.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarAdmin from '../components/SidebarAdmin';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import {
  TrashIcon,
  PencilIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const COLORS = {
  bg: "#FAF7F0",
  border: "#D8D2C2",
  accent: "#B17457",
  text: "#4A4947",
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 6;

  // New state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/students", { withCredentials: true })
      .then((res) => {
        console.log("Students data:", res.data);
        setStudents(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("لا يمكن الوصول إلى الخادم. تأكد من تشغيل الخادم على http://localhost:5000");
      });
  }, []);

  useEffect(() => {
    let result = students;
    if (stageFilter) {
      result = result.filter((s) => s.stage === stageFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [students, search, stageFilter]);

  // Calculate pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filtered.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filtered.length / studentsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Reset to first page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, stageFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const formData = new FormData(e.target);

    // Determine if we are adding or editing
    const url = isEditing 
      ? `http://localhost:5000/api/students/${studentToEdit._id}` 
      : "http://localhost:5000/api/students";
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await axios({ // Use axios config object for dynamic method and URL
        method: method,
        url: url,
        data: formData,
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201 || res.status === 200) { // Handle both created (201) and updated (200)
        const message = isEditing ? "تم تعديل بيانات الطالب بنجاح" : "تم إضافة الطالب بنجاح";
        setSuccess(message);
        e.target.reset();
        setShowModal(false);
        setIsEditing(false); // Reset editing state
        setStudentToEdit(null); // Clear student to edit
        // Refresh the students list
        axios.get("http://localhost:5000/api/students", { withCredentials: true }).then(res => setStudents(res.data));
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "فشل الاتصال بالخادم. الرجاء المحاولة لاحقًا");
    }
  };

  const handleViewDetails = (student) => {
    console.log("Selected student data:", student);
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const handleDeleteStudent = async (id) => {
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
        console.log('Attempting to delete student with ID:', id);
        await axios.delete(`http://localhost:5000/api/students/${id}`, { withCredentials: true });

        // Remove the deleted student from the state
        setStudents(prevStudents => prevStudents.filter(student => student._id !== id));
        toast.success('تم حذف الطالب بنجاح');
        setShowDetailsModal(false); // Close modal after successful deletion

      } catch (error) {
        console.error('Error deleting student:', error);
        toast.error(error.response?.data?.message || 'فشل في حذف الطالب');
      }
    }
  };

  const handleEditDetails = (student) => {
    console.log('Edit student:', student);
    setIsEditing(true); // Set mode to editing
    setStudentToEdit(student); // Set the student data to edit
    setShowDetailsModal(false); // Close details modal
    setShowModal(true); // Open the main modal
  };

  const Field = ({ label, children }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium" style={{ color: COLORS.text }}>
        {label}
      </label>
      {children}
    </div>
  );

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
        <div
          className="px-4 py-6 shadow-sm"
          style={{ backgroundColor: COLORS.bg, borderBottom: `1px solid ${COLORS.border}` }}
        >
          <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
            صفحة الطلاب
          </h1>
          <p className="text-sm opacity-75" style={{ color: COLORS.text }}>
            إدارة سجلات الطلاب والبيانات المسجلة
          </p>
        </div>

        <div className="py-6">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto mb-4 md:mb-0">
              <input
                type="text"
                placeholder="ابحث بالاسم أو البريد"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="py-2 px-4 rounded-lg border focus:ring-2 focus:ring-opacity-50"
                style={{ borderColor: COLORS.border, width: "100%", maxWidth: "250px" }}
              />
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="py-2 px-4 rounded-lg border focus:ring-2 focus:ring-opacity-50"
                style={{ borderColor: COLORS.border }}
              >
                <option value="">كل المراحل</option>
                <option value="ابتدائي">ابتدائي</option>
                <option value="اعدادي">اعدادي</option>
                <option value="ثانوي">ثانوي</option>
              </select>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="py-2 px-5 rounded-lg text-white font-medium transition-transform hover:scale-105"
              style={{ backgroundColor: COLORS.accent }}
            >
              + إضافة طالب جديد
            </button>
          </div>

          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600">
              {error}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {currentStudents.map((s) => (
              <div key={s._id} className="bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="h-2" style={{ backgroundColor: COLORS.accent }}></div>
                <div className="p-5">
                  <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
                    {s.fullName}
                  </h2>
                  <div className="space-y-2 text-sm">
                    <p style={{ color: COLORS.text }}>
                      <span className="inline-block w-20 font-medium">البريد:</span> {s.email}
                    </p>
                    <p style={{ color: COLORS.text }}>
                      <span className="inline-block w-20 font-medium">المرحلة:</span>
                      <span
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ backgroundColor: `${COLORS.accent}20`, color: COLORS.accent }}
                      >
                        {s.stage}
                      </span>
                    </p>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleViewDetails(s)}
                        className="p-2 rounded-md transition-colors duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2" style={{ color: COLORS.text, '--tw-ring-color': COLORS.accent }}
                        aria-label="عرض التفاصيل"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(s._id)}
                        className="p-2 rounded-md transition-colors duration-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2" style={{ color: COLORS.accent, '--tw-ring-color': COLORS.accent }}
                        aria-label="حذف الطالب"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-16 text-center">
                <p className="text-gray-500 mb-2">لا توجد نتائج للبحث</p>
                <p className="text-sm text-gray-400">جرب تغيير معايير البحث أو الفلترة</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {filtered.length > 0 && (
            <div className="mt-8 flex justify-center items-center space-x-2 space-x-reverse">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  currentPage === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-50'
                }`}
                style={{ 
                  borderColor: COLORS.border,
                  color: COLORS.text,
                  backgroundColor: COLORS.bg
                }}
              >
                السابق
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    currentPage === index + 1
                      ? 'text-white'
                      : 'hover:bg-gray-50'
                  }`}
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: currentPage === index + 1 ? COLORS.accent : COLORS.bg,
                    color: currentPage === index + 1 ? 'white' : COLORS.text
                  }}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  currentPage === totalPages
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-50'
                }`}
                style={{ 
                  borderColor: COLORS.border,
                  color: COLORS.text,
                  backgroundColor: COLORS.bg
                }}
              >
                التالي
              </button>
            </div>
          )}
        </div>

        {/* Modals */}
        <>
          {showDetailsModal && selectedStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setShowDetailsModal(false)}>
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl bg-white"
              >
                <div className="h-2 w-full" style={{ backgroundColor: COLORS.accent }}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold" style={{ color: COLORS.text }}>
                      تفاصيل الطالب
                    </h2>
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      style={{ color: COLORS.text }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-lg" style={{ backgroundColor: `${COLORS.accent}10` }}>
                        <p className="text-sm font-medium mb-1" style={{ color: COLORS.accent }}>الاسم الكامل</p>
                        <p className="text-lg" style={{ color: COLORS.text }}>{selectedStudent.fullName}</p>
                      </div>
                      <div className="p-4 rounded-lg" style={{ backgroundColor: `${COLORS.accent}10` }}>
                        <p className="text-sm font-medium mb-1" style={{ color: COLORS.accent }}>البريد الإلكتروني</p>
                        <p className="text-lg" style={{ color: COLORS.text }}>{selectedStudent.email}</p>
                      </div>
                      <div className="p-4 rounded-lg" style={{ backgroundColor: `${COLORS.accent}10` }}>
                        <p className="text-sm font-medium mb-1" style={{ color: COLORS.accent }}>المرحلة الدراسية</p>
                        <p className="text-lg" style={{ color: COLORS.text }}>{selectedStudent.stage}</p>
                      </div>
                      <div className="p-4 rounded-lg" style={{ backgroundColor: `${COLORS.accent}10` }}>
                        <p className="text-sm font-medium mb-1" style={{ color: COLORS.accent }}>الجنس</p>
                        <p className="text-lg" style={{ color: COLORS.text }}>{selectedStudent.gender}</p>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.text }}>المستندات</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedStudent.transcriptPath && (
                          <div className="border rounded-lg p-4 transition-all hover:shadow-md flex flex-col items-center text-center" style={{ borderColor: COLORS.border }}>
                            <div className="flex items-center justify-center mb-4 w-full h-32">
                               <svg className="w-20 h-20 opacity-80" style={{ color: COLORS.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                               </svg>
                            </div>
                            <p className="text-base font-semibold mb-4" style={{ color: COLORS.text }}>كشف العلامات</p>
                            <a
                              href={`http://localhost:5000/uploads/${selectedStudent.transcriptPath.split('\\').pop()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full py-2.5 px-4 rounded-lg text-white font-medium transition-colors mt-auto"
                              style={{ backgroundColor: COLORS.accent }}
                            >
                              عرض المستند
                            </a>
                          </div>
                        )}
                        {selectedStudent.birthCertPath && (
                          <div className="border rounded-lg p-4 transition-all hover:shadow-md flex flex-col items-center text-center" style={{ borderColor: COLORS.border }}>
                            <div className="flex items-center justify-center mb-4 w-full h-32">
                              <svg className="w-20 h-20 opacity-80" style={{ color: COLORS.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <p className="text-base font-semibold mb-4" style={{ color: COLORS.text }}>شهادة الميلاد</p>
                            <a
                              href={`http://localhost:5000/uploads/${selectedStudent.birthCertPath.split('\\').pop()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full py-2.5 px-4 rounded-lg text-white font-medium transition-colors mt-auto"
                              style={{ backgroundColor: COLORS.accent }}
                            >
                              عرض المستند
                            </a>
                          </div>
                        )}
                        {selectedStudent.studentPhotoPath && (
                          <div className="border rounded-lg p-4 transition-all hover:shadow-md flex flex-col items-center text-center" style={{ borderColor: COLORS.border }}>
                            <div className="flex items-center justify-center mb-4 w-full h-32">
                              {/* Photo Icon */}
                              <svg className="w-20 h-20 opacity-80" style={{ color: COLORS.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L20 20m-2-6l-4-4m0 0L9 10m9-6h2a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                              </svg>
                            </div>
                            <p className="text-base font-semibold mb-4" style={{ color: COLORS.text }}>الصورة الشخصية</p>
                            <a
                              href={`http://localhost:5000/uploads/${selectedStudent.studentPhotoPath.split(/[\\/]/).pop()}`}
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
                    {/* Action Buttons within Details Modal */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: COLORS.border }}>
                      <button
                         onClick={() => handleEditDetails(selectedStudent)}
                         className="p-2 rounded-md transition-colors duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2" style={{ color: COLORS.text, '--tw-ring-color': COLORS.accent }}
                         aria-label="تعديل الطالب"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(selectedStudent._id)}
                        className="p-2 rounded-md transition-colors duration-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2" style={{ color: COLORS.accent, '--tw-ring-color': COLORS.accent }}
                        aria-label="حذف الطالب"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setShowModal(false)}>
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl bg-white"
              >
                <div className="h-1 w-full" style={{ backgroundColor: COLORS.accent }}></div>
                <form
                  onSubmit={handleSubmit}
                  className="p-6 space-y-5"
                  encType="multipart/form-data"
                >
                  <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.text }}>
                    {isEditing ? 'تعديل بيانات الطالب' : 'إضافة بيانات الطالب'}
                  </h2>

                  <Field label="الاسم الكامل">
                    <input
                      name="fullName"
                      type="text"
                      required
                      defaultValue={studentToEdit?.fullName || ''} // Pre-fill for editing
                      className="w-full py-3 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                      placeholder="أدخل الاسم الكامل"
                    />
                  </Field>

                  <Field label="البريد الإلكتروني">
                    <input
                      name="email"
                      type="email"
                      required
                      defaultValue={studentToEdit?.email || ''} // Pre-fill for editing
                      className="w-full py-3 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                      placeholder="example@school.com"
                    />
                  </Field>

                  {/* Password field only required for adding, optional for editing */}
                  {!isEditing && (
                    <Field label="كلمة المرور">
                      <input
                        name="password"
                        type="password"
                        required={!isEditing} // Required only if not editing
                        className="w-full py-3 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                        style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                        placeholder="••••••••"
                      />
                    </Field>
                  )}

                  <Field label="الجنس">
                    <div className="flex items-center space-x-6 space-x-reverse">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="ذكر"
                          defaultChecked={isEditing ? studentToEdit?.gender === 'ذكر' : true} // Check for editing, default to male for adding
                          className="form-radio"
                          style={{ color: COLORS.accent }}
                        />
                        <span className="mr-2">ذكر</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="أنثى"
                          defaultChecked={isEditing ? studentToEdit?.gender === 'أنثى' : false} // Check for editing, default to male for adding
                          className="form-radio"
                          style={{ color: COLORS.accent }}
                        />
                        <span className="mr-2">أنثى</span>
                      </label>
                    </div>
                  </Field>

                  <Field label="المرحلة الدراسية">
                    <select
                      name="stage"
                      required
                      defaultValue={studentToEdit?.stage || ''} // Pre-fill for editing
                      className="w-full py-3 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                    >
                      <option value="">-- اختر المرحلة --</option>
                      <option value="ابتدائي">ابتدائي</option>
                      <option value="اعدادي">اعدادي</option>
                      <option value="ثانوي">ثانوي</option>
                    </select>
                  </Field>

                  {/* File inputs: Required for adding, optional for editing */}
                  <Field label="كشف العلامات (PDF أو صورة)">
                    <div className="border border-dashed rounded-lg p-4" style={{ borderColor: COLORS.border }}>
                      <input name="transcript" type="file" accept=".pdf,image/*" required={!isEditing} />
                      {isEditing && selectedStudent?.transcriptPath && (
                         <p className="text-sm mt-2" style={{ color: COLORS.text }}>Current: {selectedStudent.transcriptPath.split(/[\\/]/).pop()}</p>
                      )}
                    </div>
                  </Field>

                  <Field label="شهادة الميلاد (PDF أو صورة)">
                    <div className="border border-dashed rounded-lg p-4" style={{ borderColor: COLORS.border }}>
                      <input name="birthCert" type="file" accept=".pdf,image/*" required={!isEditing} />
                       {isEditing && selectedStudent?.birthCertPath && (
                         <p className="text-sm mt-2" style={{ color: COLORS.text }}>Current: {selectedStudent.birthCertPath.split(/[\\/]/).pop()}</p>
                       )}
                    </div>
                  </Field>

                  <Field label="صورة شخصية (PDF أو صورة)">
                    <div className="border border-dashed rounded-lg p-4" style={{ borderColor: COLORS.border }}>
                      <input name="photo" type="file" accept=".pdf,image/*" required={!isEditing} />
                      {isEditing && selectedStudent?.studentPhotoPath && (
                         <p className="text-sm mt-2" style={{ color: COLORS.text }}>Current: {selectedStudent.studentPhotoPath.split(/[\\/]/).pop()}</p>
                      )}
                    </div>
                  </Field>

                  <div className="flex justify-between pt-4 border-t" style={{ borderColor: COLORS.border }}>
                    <button
                      type="button"
                      onClick={() => { // Close and reset modal
                        setShowModal(false);
                        setIsEditing(false);
                        setStudentToEdit(null);
                      }}
                      className="py-2 px-5 rounded-lg border font-medium transition-colors hover:bg-gray-50" style={{ borderColor: COLORS.border, color: COLORS.text }}
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-6 rounded-lg font-medium text-white transition-colors" style={{ backgroundColor: COLORS.accent }}
                    >
                      {isEditing ? 'تأكيد التعديل' : 'تأكيد'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default Students;
