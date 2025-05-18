import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { 
  PlusIcon, 
  TrashIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import SidebarAdmin from '../components/SidebarAdmin';

const API_BASE_URL = 'http://localhost:5000/api';

// Arabic number mapping
const arabicToNumber = {
  'الأول': 1,
  'الثاني': 2,
  'الثالث': 3,
  'الرابع': 4,
  'الخامس': 5,
  'السادس': 6,
  'السابع': 7,
  'الثامن': 8,
  'التاسع': 9,
  'العاشر': 10,
  'الحادي عشر': 11,
  'الثاني عشر': 12
};

// Number to Arabic text mapping
const numberToArabic = {
  1: "الأول",
  2: "الثاني",
  3: "الثالث",
  4: "الرابع",
  5: "الخامس",
  6: "السادس",
  7: "السابع",
  8: "الثامن",
  9: "التاسع",
  10: "العاشر",
  11: "الحادي عشر",
  12: "الثاني عشر"
};

// Level-specific grade numbers
const levelGrades = {
  'ابتدائي': ["الأول", "الثاني","الثالث", "الرابع", "الخامس", "السادس"],
  'اعدادي': ["السابع", "الثامن", "التاسع"],
  'ثانوي': ["العاشر", "الأول ثانوي", "الثاني ثانوي"]
};

const Courses = () => {
  // Define COLORS object inside the component
  const COLORS = {
    bg: "#FAF7F0",
    border: "#D8D2C2",
    accent: "#B17457",
    text: "#4A4947",
  };

  const [classes, setClasses] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [teachers, setTeachers] = useState([]);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [newClass, setNewClass] = useState({
    level: '',
    number: '',
    teacher: '',
    subjects: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAssignStudentsModal, setShowAssignStudentsModal] = useState(false);
  const [selectedClassToAssign, setSelectedClassToAssign] = useState(null);
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const levels = [
    { value: 'ابتدائي', label: 'ابتدائي' },
    { value: 'اعدادي', label: 'اعدادي' },
    { value: 'ثانوي', label: 'ثانوي' },
  ];

  // Get available numbers based on selected level
  const getAvailableNumbers = (level) => {
    return level ? levelGrades[level] : [];
  };

  // Get available teachers (not assigned to any class)
  const getAvailableTeachers = () => {
    const assignedTeachers = new Set(classes.map(c => c.teacher));
    return teachers.filter(teacher => !assignedTeachers.has(teacher._id));
  };

  // Handle level change
  const handleLevelChange = (e) => {
    const selectedLevel = e.target.value;
    setNewClass({
      ...newClass,
      level: selectedLevel,
      number: '' // Reset number when level changes
    });
  };

  // Steps for the form
  const steps = ['معلومات الفصل', 'تعيين معلم الصف (المربي)', 'جدول الحصص اليومي'];

  // Function to get class name in Arabic
  const getClassName = (level, grade, isNewClass = false) => {
    const arabicLetters = ['أ', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ي', 'ك', 'ل', 'م', 'ن', 'س', 'ع', 'ف', 'ص'];
    
    // Filter classes by both grade and level
    const existingClassesCount = classes.filter(c => 
      c.grade === arabicToNumber[grade] && 
      c.level === level
    ).length;

    // For new class, use the next letter. For existing classes, use their current letter
    const letterIndex = isNewClass ? existingClassesCount : existingClassesCount - 1;
    const arabicLetter = arabicLetters[letterIndex];

    return `ابتدائي ${grade}${arabicLetter}`;
  };

  const generateTimeSlots = () => {
    const slots = [];
    let currentTime = new Date();
    currentTime.setHours(8, 0, 0); // Start at 8:00 AM

    for (let i = 1; i <= 7; i++) {
      const startTime = new Date(currentTime);
      const endTime = new Date(currentTime);
      endTime.setMinutes(endTime.getMinutes() + 40); // 40 minutes class

      slots.push({
        period: i,
        startTime: startTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        endTime: endTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        teacher: '',
        subject: ''
      });

      // Add break time
      if (i === 3) {
        currentTime.setMinutes(currentTime.getMinutes() + 80); // 40 min class + 40 min break
      } else {
        currentTime.setMinutes(currentTime.getMinutes() + 45); // 40 min class + 5 min break
      }
    }
    return slots;
  };

  // New function to fetch classes
  const fetchClasses = async () => {
    try {
      // setLoading(true); // Optional: set a loading state for classes fetch
      const classesResponse = await axios.get(`${API_BASE_URL}/classes`, { withCredentials: true });
      console.log('Classes fetched:', classesResponse.data);
      setClasses(classesResponse.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      console.error('Error response:', error.response?.data);
      toast.error('فشل في تحميل قائمة الفصول');
    } // finally { setLoading(false); } // Optional: unset loading state
  };

  // New function to fetch unassigned students
  const fetchUnassignedStudents = async (level) => {
    try {
      setLoadingStudents(true);
      console.log('Fetching unassigned students for level:', level);
      const response = await axios.get(`${API_BASE_URL}/students/unassigned/${level}`, { withCredentials: true });
      console.log('Unassigned students response:', response.data);
      setUnassignedStudents(response.data);
    } catch (error) {
      console.error('Error fetching unassigned students:', error);
      console.error('Error response:', error.response?.data);
      toast.error('فشل في تحميل قائمة الطلاب');
    } finally {
      setLoadingStudents(false);
    }
  };

  // New function to handle student selection
  const handleStudentSelection = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  // New function to handle student assignment
  const handleAssignStudents = async () => {
    if (selectedStudents.length === 0) {
      toast.warning('الرجاء اختيار طالب واحد على الأقل');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/classes/${selectedClassToAssign._id}/students`,
        { studentIds: selectedStudents },
        { withCredentials: true }
      );
      
      toast.success('تم تعيين الطلاب بنجاح');
      setShowAssignStudentsModal(false);
      setSelectedStudents([]);
      // Refresh the classes list to show updated student count
      fetchClasses();
    } catch (error) {
      console.error('Error assigning students:', error);
      toast.error(error.response?.data?.message || 'فشل في تعيين الطلاب');
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        // First fetch teachers
        const teachersResponse = await axios.get(`${API_BASE_URL}/teachers`, { withCredentials: true });
        console.log('Teachers fetched:', teachersResponse.data);
        if (teachersResponse.data && Array.isArray(teachersResponse.data)) {
          setTeachers(teachersResponse.data);
          setAvailableTeachers(teachersResponse.data);
        }

        // Then fetch classes
        await fetchClasses();

      } catch (error) {
        console.error('Error initializing data:', error);
        console.error('Error response:', error.response?.data);
        toast.error('فشل في تحميل البيانات');
      }
    };

    initializeData();
    setSchedule(generateTimeSlots());
  }, []);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleAddSubject = () => {
    if (newClass.subjects.length >= 7) {
      toast.warning('يمكن إضافة 7 مواد دراسية كحد أقصى');
      return;
    }

    setNewClass({
      ...newClass,
      subjects: [
        ...newClass.subjects,
        { name: '', teacher: '' }
      ]
    });
  };

  const handleRemoveSubject = (index) => {
    const updatedSubjects = [...newClass.subjects];
    updatedSubjects.splice(index, 1);
    setNewClass({
      ...newClass,
      subjects: updatedSubjects
    });
  };

  const handleSubjectChange = (index, field, value) => {
    if (field === 'teacher') {
      const selectedTeacher = teachers.find(t => t._id === value);
      const updatedSubjects = [...newClass.subjects];
      updatedSubjects[index] = {
        name: selectedTeacher.specialization,
        teacher: value
      };
      setNewClass({
        ...newClass,
        subjects: updatedSubjects
      });
    }
  };

  const handleTeacherSelect = (teacherId) => {
    const teacher = teachers.find(t => t._id === teacherId);
    setSelectedTeacher(teacher);
    setNewClass(prev => ({
      ...prev,
      teacher: teacherId
    }));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">معلومات الفصل الأساسية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المستوى</label>
                <select
                  value={newClass.level}
                  onChange={handleLevelChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                >
                  <option value="">اختر المستوى</option>
                  {levels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الفصل</label>
                <select
                  value={newClass.number}
                  onChange={(e) => setNewClass({ ...newClass, number: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                  disabled={!newClass.level}
                >
                  <option value="">اختر الرقم</option>
                  {getAvailableNumbers(newClass.level).map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">تعيين معلم الصف (المربي)</h2>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">معلم الصف</label>
              <select
                value={newClass.teacher}
                onChange={(e) => handleTeacherSelect(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              >
                <option value="">اختر معلم الصف</option>
                {getAvailableTeachers().map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.fullName} - {teacher.specialization}
                  </option>
                ))}
              </select>
              {getAvailableTeachers().length === 0 && (
                <p className="mt-2 text-sm text-red-600">
                  لا يوجد معلمين متاحين للإشراف على الفصل
                </p>
              )}
            </div>

            {selectedTeacher && (
              <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{selectedTeacher.fullName}</h3>
                    <p className="text-sm text-gray-500">التخصص: {selectedTeacher.specialization}</p>
                    <p className="text-sm text-gray-500">البريد الإلكتروني: {selectedTeacher.email}</p>
                  </div>
                  {selectedTeacher.photo && (
                    <div className="flex justify-center">
                      <img 
                        src={`${API_BASE_URL}/uploads/${selectedTeacher.photo}`} 
                        alt={selectedTeacher.fullName}
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">جدول الحصص اليومي</h2>
              <span className="text-sm text-gray-500">مدة الحصة: 40 دقيقة</span>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحصة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التوقيت</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المعلم</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المادة</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schedule.map((slot, index) => (
                    <React.Fragment key={slot.period}>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {slot.period}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {slot.startTime} - {slot.endTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <select
                            className="w-full px-2 py-1 border border-gray-300 rounded-md text-right"
                            value={slot.teacher || ''}
                            onChange={(e) => {
                              const newSchedule = [...schedule];
                              const selectedTeacher = teachers.find(t => t._id === e.target.value);
                              newSchedule[index] = {
                                ...newSchedule[index],
                                teacher: e.target.value,
                                subject: selectedTeacher?.specialization || ''
                              };
                              setSchedule(newSchedule);
                              console.log('Updated schedule:', newSchedule);
                            }}
                          >
                            <option value="">اختر المعلم</option>
                            {teachers.map((teacher) => (
                              <option key={teacher._id} value={teacher._id}>
                                {teacher.fullName} - {teacher.specialization}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {slot.subject || 'لم يتم التحديد'}
                        </td>
                      </tr>
                      {slot.period === 3 && (
                        <tr className="bg-white">
                          <td colSpan="4" className="px-6 py-3 text-center text-sm text-[#B17457] font-medium">
                            استراحة طويلة (40 دقيقة)
                          </td>
                        </tr>
                      )}
                      {slot.period !== 3 && slot.period !== 7 && (
                        <tr className="bg-gray-50">
                          <td colSpan="4" className="px-6 py-1 text-center text-xs text-gray-500">
                            استراحة قصيرة (5 دقائق)
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCreateClass}
                disabled={schedule.some(slot => !slot.teacher)}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
              >
                <span>إنشاء الفصل</span>
              </button>
            </div>

            {schedule.some(slot => !slot.teacher) && (
              <p className="text-sm text-red-600 mt-2">
                * يجب تعيين معلم لكل حصة قبل إنشاء الفصل
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const handleCreateClass = async () => {
    if (!newClass.level || !newClass.number || !newClass.teacher) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (schedule.some(slot => !slot.teacher)) {
      toast.error('يرجى تعيين معلم لكل حصة');
      return;
    }

    try {
      // Convert Arabic grade text to number
      const numericGrade = arabicToNumber[newClass.number];
      if (!numericGrade) {
        toast.error('رقم الفصل غير صالح');
        return;
      }

      const classData = {
        level: newClass.level.trim(),
        grade: numericGrade,
        teacher: newClass.teacher,
        name: getClassName(newClass.level.trim(), newClass.number, true),
        schedule: schedule.map(slot => ({
          period: slot.period,
          startTime: slot.startTime,
          endTime: slot.endTime,
          teacher: slot.teacher,
          subject: slot.subject
        }))
      };

      console.log('Sending class data to server:', JSON.stringify(classData, null, 2));

      const response = await axios.post(`${API_BASE_URL}/classes`, classData);
      console.log('Server response:', response.data);
      
      toast.success('تم إنشاء الفصل بنجاح');
      setNewClass({ level: '', number: '', teacher: '' });
      setSchedule(generateTimeSlots());
      setActiveStep(0);
      
      // Refresh classes list
      fetchClasses();
    } catch (error) {
      console.error('Error creating class:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      if (error.response?.data?.message === 'هذا المعلم مسؤول بالفعل عن فصل آخر') {
        toast.error(`هذا المعلم مسؤول بالفعل عن فصل: ${error.response.data.existingClass}`);
      } else {
        toast.error(error.response?.data?.message || 'فشل في إنشاء الفصل');
      }
    }
  };

  const handleDeleteClass = async (id) => {
    // Replace window.confirm with SweetAlert
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "لن تستطيع التراجع عن هذا الإجراء!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#B17457', // Use your accent color
      cancelButtonColor: '#D8D2C2', // Use your border color
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء',
      reverseButtons: true // Keep confirm on the right for RTL
    });

    if (result.isConfirmed) {
      try {
        console.log('Attempting to delete class with ID:', id);
        const response = await axios.delete(`${API_BASE_URL}/classes/${id}`, { withCredentials: true });
        console.log('Delete response:', response.data);
        
        // Update the classes list by removing the deleted class
        setClasses(prevClasses => prevClasses.filter(c => c._id !== id));
        
        // Show a success toast after successful deletion
        toast.success('تم حذف الفصل بنجاح');

      } catch (error) {
        console.error('Error deleting class:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        // Show an error toast if deletion fails
        toast.error(error.response?.data?.message || 'فشل في حذف الفصل');
      }
    }
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-8">
            <div className="flex-1 min-w-0 mb-4 sm:mb-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#4A4947]">
                إدارة الفصول الدراسية
              </h2>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm border border-[#D8D2C2] overflow-hidden">
            {/* Stepper */}
            <div className="border-b border-[#D8D2C2]">
              <div className="px-2 sm:px-4 md:px-6 py-3 sm:py-4">
                <nav className="flex justify-center" aria-label="Progress">
                  <ol className="flex items-center w-full max-w-4xl">
                    {steps.map((step, index) => (
                      <li key={step} className="relative flex-1">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center
                            ${activeStep >= index ? 'bg-[#B17457] text-white' : 'bg-[#D8D2C2] text-[#4A4947]'}`}>
                            {index === 0 && <AcademicCapIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
                            {index === 1 && <UserGroupIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
                            {index === 2 && <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
                          </div>
                          <div className={`mr-1 sm:mr-2 md:mr-4 flex-1 ${index !== steps.length - 1 ? 'border-t-2' : ''} 
                            ${activeStep > index ? 'border-[#B17457]' : 'border-[#D8D2C2]'}`} />
                        </div>
                        <div className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-[#4A4947] text-center">
                          {step}
                        </div>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            </div>

            {/* Step Content */}
            <div className="px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
              {activeStep === 0 && (
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#4A4947] mb-3 sm:mb-4 md:mb-6">معلومات الفصل الأساسية</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#4A4947] mb-1 sm:mb-2">المستوى</label>
                      <select
                        value={newClass.level}
                        onChange={handleLevelChange}
                        className="w-full px-2 sm:px-4 py-2 sm:py-3 rounded-lg border border-[#D8D2C2] focus:ring-2 focus:ring-[#B17457] focus:border-[#B17457] text-right bg-[#FAF7F0] text-sm sm:text-base"
                      >
                        <option value="">اختر المستوى</option>
                        {levels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4A4947] mb-1 sm:mb-2">رقم الفصل</label>
                      <select
                        value={newClass.number}
                        onChange={(e) => setNewClass({ ...newClass, number: e.target.value })}
                        className="w-full px-2 sm:px-4 py-2 sm:py-3 rounded-lg border border-[#D8D2C2] focus:ring-2 focus:ring-[#B17457] focus:border-[#B17457] text-right bg-[#FAF7F0] text-sm sm:text-base disabled:bg-[#D8D2C2] disabled:opacity-50"
                        disabled={!newClass.level}
                      >
                        <option value="">اختر الرقم</option>
                        {getAvailableNumbers(newClass.level).map((num) => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#4A4947] mb-3 sm:mb-4 md:mb-6">تعيين معلم الصف (المربي)</h3>
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[#4A4947] mb-2">معلم الصف</label>
                      <select
                        value={newClass.teacher}
                        onChange={(e) => handleTeacherSelect(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-[#D8D2C2] focus:ring-2 focus:ring-[#B17457] focus:border-[#B17457] text-right bg-[#FAF7F0]"
                      >
                        <option value="">اختر معلم الصف</option>
                        {getAvailableTeachers().map((teacher) => (
                          <option key={teacher._id} value={teacher._id}>
                            {teacher.fullName} - {teacher.specialization}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedTeacher && (
                      <div className="bg-[#FAF7F0] rounded-lg p-6 border border-[#D8D2C2]">
                        <div className="flex items-center space-x-6 space-x-reverse">
                          {selectedTeacher.photo && (
                            <img 
                              src={`${API_BASE_URL}/uploads/${selectedTeacher.photo}`} 
                              alt={selectedTeacher.fullName}
                              className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                          )}
                          <div>
                            <h4 className="text-lg font-medium text-[#4A4947]">{selectedTeacher.fullName}</h4>
                            <p className="text-sm text-[#B17457]">التخصص: {selectedTeacher.specialization}</p>
                            <p className="text-sm text-[#4A4947]">البريد الإلكتروني: {selectedTeacher.email}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="max-w-5xl mx-auto">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 md:mb-6">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#4A4947] mb-2 sm:mb-0">جدول الحصص اليومي</h3>
                    <span className="text-xs sm:text-sm text-[#4A4947] bg-[#FAF7F0] px-2 sm:px-3 py-1 rounded-full border border-[#D8D2C2]">
                      مدة الحصة: 40 دقيقة
                    </span>
                  </div>

                  <div className="overflow-x-auto -mx-2 sm:mx-0">
                    <div className="min-w-full bg-white rounded-lg border border-[#D8D2C2] overflow-hidden shadow-sm">
                      <table className="min-w-full divide-y divide-[#D8D2C2]">
                        <thead className="bg-[#FAF7F0]">
                          <tr>
                            <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-right text-xs font-medium text-[#4A4947] uppercase tracking-wider">الحصة</th>
                            <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-right text-xs font-medium text-[#4A4947] uppercase tracking-wider">التوقيت</th>
                            <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-right text-xs font-medium text-[#4A4947] uppercase tracking-wider">المعلم</th>
                            <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-right text-xs font-medium text-[#4A4947] uppercase tracking-wider">المادة</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#D8D2C2]">
                          {schedule.map((slot, index) => (
                            <React.Fragment key={slot.period}>
                              <tr className={index % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F0]'}>
                                <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-[#4A4947]">
                                  {slot.period}
                                </td>
                                <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-[#4A4947]">
                                  {slot.startTime} - {slot.endTime}
                                </td>
                                <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 whitespace-nowrap">
                                  <select
                                    className="w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-[#D8D2C2] rounded-lg focus:ring-2 focus:ring-[#B17457] focus:border-[#B17457] text-right bg-white"
                                    value={slot.teacher || ''}
                                    onChange={(e) => {
                                      const newSchedule = [...schedule];
                                      const selectedTeacher = teachers.find(t => t._id === e.target.value);
                                      newSchedule[index] = {
                                        ...newSchedule[index],
                                        teacher: e.target.value,
                                        subject: selectedTeacher?.specialization || ''
                                      };
                                      setSchedule(newSchedule);
                                    }}
                                  >
                                    <option value="">اختر المعلم</option>
                                    {teachers.map((teacher) => (
                                      <option key={teacher._id} value={teacher._id}>
                                        {teacher.fullName} - {teacher.specialization}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-[#4A4947]">
                                  {slot.subject || 'لم يتم التحديد'}
                                </td>
                              </tr>
                              {slot.period === 3 && (
                                <tr className="bg-white">
                                  <td colSpan="4" className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-center text-xs sm:text-sm text-[#B17457] font-medium">
                                    استراحة طويلة (40 دقيقة)
                                  </td>
                                </tr>
                              )}
                              {slot.period !== 3 && slot.period !== 7 && (
                                <tr className="bg-[#FAF7F0]">
                                  <td colSpan="4" className="px-2 sm:px-4 md:px-6 py-1 sm:py-2 text-center text-xs text-[#4A4947]">
                                    استراحة قصيرة (5 دقائق)
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 bg-[#FAF7F0] border-t border-[#D8D2C2]">
              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  className="inline-flex items-center px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[#4A4947] bg-white border border-[#D8D2C2] rounded-md hover:bg-[#D8D2C2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B17457] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronLeftIcon className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  السابق
                </button>
                
                {activeStep === steps.length - 1 ? (
                  <button
                    onClick={handleCreateClass}
                    disabled={schedule.some(slot => !slot.teacher)}
                    className="inline-flex items-center px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-[#B17457] rounded-md hover:bg-[#965c44] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B17457] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    إنشاء الفصل
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={
                      (activeStep === 0 && (!newClass.level || !newClass.number)) ||
                      (activeStep === 1 && !newClass.teacher)
                    }
                    className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-[#B17457] rounded-md hover:bg-[#965c44] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B17457] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    التالي
                    <ChevronRightIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Existing Classes */}
          <div className="mt-6 sm:mt-8 md:mt-12">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#4A4947] mb-3 sm:mb-4 md:mb-6">الفصول الموجودة</h3>
            
            {classes.length === 0 ? (
              <div className="text-center py-6 sm:py-8 md:py-12">
                <div className="rounded-lg bg-white p-4 sm:p-6 md:p-12 shadow-sm border border-[#D8D2C2]">
                  <UserGroupIcon className="mx-auto h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-[#B17457]" />
                  <h3 className="mt-2 text-sm sm:text-base md:text-lg font-medium text-[#4A4947]">لا توجد فصول دراسية</h3>
                  <p className="mt-1 text-xs sm:text-sm text-[#4A4947]">قم بإنشاء فصل جديد للبدء</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {classes.map((classItem) => (
                  <div key={classItem._id} className="bg-white rounded-lg shadow-sm border border-[#D8D2C2] hover:shadow-md transition-shadow duration-200">
                    <div className="p-3 sm:p-4 md:p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm sm:text-base md:text-lg font-medium text-[#4A4947]">
                            {classItem.name || getClassName(classItem.level, classItem.grade)}
                          </h4>
                          {classItem.teacher && (
                            <p className="mt-1 text-xs sm:text-sm text-[#B17457]">
                              المعلم المسؤول: {teachers.find(t => t._id === classItem.teacher)?.fullName || 'غير محدد'}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteClass(classItem._id)}
                          className="text-[#D8D2C2] hover:text-[#B17457] focus:outline-none transition-colors duration-200"
                        >
                          <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                        </button>
                      </div>
                      {/* New Assign Students Button */}
                      <div className="px-3 sm:px-4 md:px-6 py-2 bg-[#FAF7F0] border-t border-[#D8D2C2]">
                        <button
                          onClick={() => {
                            setSelectedClassToAssign(classItem);
                            setShowAssignStudentsModal(true);
                            fetchUnassignedStudents(classItem.level);
                          }}
                          className="w-full text-center text-xs sm:text-sm font-medium text-[#B17457] hover:text-[#965c44] focus:outline-none transition-colors duration-200"
                        >
                          تعيين طلاب للفصل
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assign Students Modal */}
      {showAssignStudentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center px-4">
          <div className="relative p-6 border rounded-lg shadow-xl w-full max-w-md bg-white" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
            <div className="text-center">
              <h3 className="text-lg leading-6 font-bold mb-4" style={{ color: COLORS.text }}>
                تعيين طلاب للفصل {selectedClassToAssign?.name}
              </h3>

              {loadingStudents ? (
                <div className="flex justify-center items-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: COLORS.accent }}></div>
                </div>
              ) : (
                <>
                  <div className="mt-4 px-2 py-3 max-h-60 overflow-y-auto space-y-3">
                    {unassignedStudents.length === 0 ? (
                      <p className="text-sm" style={{ color: COLORS.text }}>لا يوجد طلاب متاحين للتعيين</p>
                    ) : (
                      <div className="space-y-3">
                        {unassignedStudents.map((student) => (
                          <label
                            key={student._id}
                            className="flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors duration-200"
                            style={{ borderColor: COLORS.border, backgroundColor: selectedStudents.includes(student._id) ? `${COLORS.accent}20` : 'transparent' }}
                          >
                            <div className="flex items-center space-x-3 space-x-reverse w-full">
                              <input
                                type="checkbox"
                                checked={selectedStudents.includes(student._id)}
                                onChange={() => handleStudentSelection(student._id)}
                                className="h-4 w-4 form-checkbox rounded"
                                style={{ color: COLORS.accent, borderColor: COLORS.border, '--tw-ring-color': COLORS.accent }}
                              />
                              <div className="text-right flex-1">
                                <p className="text-sm font-medium" style={{ color: COLORS.text }}>{student.fullName}</p>
                                {/* <p className="text-xs" style={{ color: COLORS.text }}>الرقم الأكاديمي: {student.academicNumber}</p> {/* Assuming academicNumber exists */}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: COLORS.border }}>
                    <button
                      onClick={() => {
                        setShowAssignStudentsModal(false);
                        setSelectedStudents([]);
                      }}
                      className="px-4 py-2 bg-white text-base font-medium rounded-md shadow-sm border transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2" style={{ borderColor: COLORS.border, color: COLORS.text, '--tw-ring-color': COLORS.accent }}
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleAssignStudents}
                      disabled={selectedStudents.length === 0}
                      className="px-4 py-2 text-white text-base font-medium rounded-md shadow-sm transition-colors duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: COLORS.accent, '--tw-ring-color': COLORS.accent }}
                    >
                      تعيين الطلاب المحددين
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
