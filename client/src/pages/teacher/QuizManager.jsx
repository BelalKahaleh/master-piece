import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://localhost:5000/api';
const optionLabels = ['أ', 'ب', 'ج', 'د'];

export default function QuizManager() {
  const [classes, setClasses] = useState([]);
  const [quizzes, setQuizzes] = useState({}); // { classId: [quiz, ...] }
  const [showModal, setShowModal] = useState(false);
  const [showQuizDetails, setShowQuizDetails] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedQuizList, setSelectedQuizList] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: '' }]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [message, setMessage] = useState('');
  const [editQuizId, setEditQuizId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 6;
  const totalPages = Math.ceil(classes.length / classesPerPage);
  const paginatedClasses = classes.slice((currentPage - 1) * classesPerPage, currentPage * classesPerPage);
  const [quizResults, setQuizResults] = useState({}); // { quizId: [results] }

  useEffect(() => {
    axios.get(`${API_BASE_URL}/quizzes/my-classes`, { withCredentials: true })
      .then(async res => {
        setClasses(res.data);
        // Fetch quizzes for all classes
        const quizMap = {};
        await Promise.all(res.data.map(async (cls) => {
          try {
            const quizRes = await axios.get(`${API_BASE_URL}/quizzes/by-class/${cls._id}`, { withCredentials: true });
            quizMap[cls._id] = quizRes.data; // now an array
          } catch (err) {
            quizMap[cls._id] = [];
          }
        }));
        setQuizzes(quizMap);
      })
      .catch(() => setClasses([]));
  }, [message]); // refetch on message (after add)

  const openModal = (cls) => {
    setSelectedClass(cls);
    setShowModal(true);
    setQuizTitle('');
    setQuestions([{ question: '', options: ['', '', '', ''], answer: '' }]);
    setScheduledDate('');
    setScheduledTime('');
    setDuration(30);
    setMessage('');
  };

  const openQuizDetails = async (cls) => {
    setSelectedClass(cls);
    setSelectedQuizList(quizzes[cls._id] || []);
    setShowQuizDetails(true);
    
    // Fetch results for all quizzes in this class
    const results = {};
    for (const quiz of quizzes[cls._id] || []) {
      try {
        const response = await axios.get(`${API_BASE_URL}/quizzes/${quiz._id}/results`, { withCredentials: true });
        results[quiz._id] = response.data;
      } catch (error) {
        console.error('Error fetching quiz results:', error);
        results[quiz._id] = [];
      }
    }
    setQuizResults(results);
  };

  const closeQuizDetails = () => {
    setShowQuizDetails(false);
    setSelectedQuizList([]);
    setSelectedClass(null);
  };

  const handleQuestionChange = (idx, field, value) => {
    const updated = [...questions];
    if (field === 'question') {
      updated[idx].question = value;
    } else if (field === 'answer') {
      updated[idx].answer = value;
    } else {
      updated[idx].options[field] = value;
    }
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
  };

  const deleteQuestion = (idx) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const openEditQuiz = (quiz, cls) => {
    setSelectedClass(cls);
    setEditQuizId(quiz._id);
    setQuizTitle(quiz.title);
    setQuestions(quiz.questions.map(q => ({ ...q }))); // deep copy
    setScheduledDate(quiz.scheduledDate ? quiz.scheduledDate.split('T')[0] : '');
    setScheduledTime(quiz.scheduledDate ? new Date(quiz.scheduledDate).toISOString().split('T')[1].slice(0,5) : '');
    setDuration(quiz.duration);
    setShowModal(true);
  };

  const deleteQuiz = async (quizId) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن يمكنك التراجع عن هذا الإجراء!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#B17457',
      cancelButtonColor: '#D8D2C2',
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;
    await axios.delete(`${API_BASE_URL}/quizzes/${quizId}`, { withCredentials: true });
    await Swal.fire({
      title: 'تم الحذف!',
      text: 'تم حذف الاختبار بنجاح.',
      icon: 'success',
      confirmButtonColor: '#B17457',
    });
    setMessage('تم حذف الاختبار بنجاح!');
    setShowQuizDetails(false);
    setEditQuizId(null);
  };

  const submitQuiz = async () => {
    try {
      // Validate required fields
      if (!quizTitle.trim()) {
        await Swal.fire({
          title: 'خطأ!',
          text: 'يرجى إدخال عنوان الاختبار',
          icon: 'error',
          confirmButtonColor: '#B17457',
        });
        return;
      }

      if (!scheduledDate || !scheduledTime) {
        await Swal.fire({
          title: 'خطأ!',
          text: 'يرجى تحديد تاريخ ووقت الاختبار',
          icon: 'error',
          confirmButtonColor: '#B17457',
        });
        return;
      }

      // Validate questions
      const invalidQuestions = questions.filter(q => 
        !q.question.trim() || 
        q.options.some(opt => !opt.trim()) || 
        !q.answer
      );

      if (invalidQuestions.length > 0) {
        await Swal.fire({
          title: 'خطأ!',
          text: 'يرجى التأكد من إدخال جميع الأسئلة والخيارات والإجابات الصحيحة',
          icon: 'error',
          confirmButtonColor: '#B17457',
        });
        return;
      }

      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();

      if (editQuizId) {
        // Update existing quiz
        await axios.put(`${API_BASE_URL}/quizzes/${editQuizId}`, {
          title: quizTitle,
          questions,
          scheduledDate: scheduledDateTime,
          duration: Number(duration)
        }, { withCredentials: true });
        await Swal.fire({
          title: 'تم التحديث!',
          text: 'تم تحديث الاختبار بنجاح.',
          icon: 'success',
          confirmButtonColor: '#B17457',
        });
        setMessage('تم تحديث الاختبار بنجاح!');
      } else {
        // Create new quiz
        const response = await axios.post(`${API_BASE_URL}/quizzes`, {
          classId: selectedClass._id,
          title: quizTitle,
          questions,
          scheduledDate: scheduledDateTime,
          duration: Number(duration)
        }, { withCredentials: true });

        if (response.data) {
          await Swal.fire({
            title: 'تمت الإضافة!',
            text: 'تم إضافة الاختبار بنجاح.',
            icon: 'success',
            confirmButtonColor: '#B17457',
          });
          setMessage('تم إضافة الاختبار بنجاح!');
        }
      }
      setShowModal(false);
      setEditQuizId(null);
    } catch (error) {
      console.error('Quiz submission error:', error.response?.data || error);
      await Swal.fire({
        title: 'خطأ!',
        text: error.response?.data?.message || 'حدث خطأ أثناء حفظ الاختبار',
        icon: 'error',
        confirmButtonColor: '#B17457',
      });
      setMessage('حدث خطأ أثناء حفظ الاختبار');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-2 rounded-full bg-[#B17457] bg-opacity-20 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#B17457]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#4A4947] mb-2">صفحة الامتحانات</h1>
          <p className="text-[#B17457] text-lg">هنا يمكنك إدارة الامتحانات الخاصة بك.</p>
          <div className="mt-4 w-24 h-1 bg-[#B17457] mx-auto rounded-full"></div>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-8 py-3 px-4 bg-green-100 border-r-4 border-green-500 rounded-lg shadow-sm">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-700 font-medium">{message}</p>
            </div>
          </div>
        )}

        {/* Classes Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedClasses.map(cls => (
            <div key={cls._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-2 bg-[#B17457]"></div>
              <div className="p-6 flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-[#FAF7F0] flex items-center justify-center mb-4 border-2 border-[#D8D2C2]">
                  <span className="text-2xl font-bold text-[#B17457]">{cls.name.charAt(0)}</span>
                </div>
                <div className="font-bold text-xl mb-4 text-[#4A4947]">{cls.name}</div>
                <button
                  className="bg-[#B17457] hover:bg-[#9A6249] text-white font-medium px-6 py-2 rounded-full transition-colors duration-300 flex items-center mb-2"
                  onClick={() => openModal(cls)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  إضافة اختبار
                </button>
                {(quizzes[cls._id] && quizzes[cls._id].length > 0) && (
                  <button
                    className="bg-[#D8D2C2] hover:bg-[#B17457] hover:text-white text-[#4A4947] font-medium px-6 py-2 rounded-full transition-colors duration-300 flex items-center"
                    onClick={() => openQuizDetails(cls)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    عرض تفاصيل الاختبارات
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              className="px-3 py-1 rounded bg-[#D8D2C2] text-[#4A4947] font-bold hover:bg-[#B17457] hover:text-white transition"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              السابق
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded font-bold transition ${currentPage === i + 1 ? 'bg-[#B17457] text-white' : 'bg-[#FAF7F0] text-[#4A4947] hover:bg-[#D8D2C2]'}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded bg-[#D8D2C2] text-[#4A4947] font-bold hover:bg-[#B17457] hover:text-white transition"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              التالي
            </button>
          </div>
        )}
      </div>

      {/* Modal for Add Quiz */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-[#FAF7F0] rounded-2xl shadow-2xl overflow-hidden animate-fadeIn" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-[#B17457] px-6 py-5 text-center relative">
              <button 
                className="absolute left-4 top-4 text-white hover:text-[#FAF7F0] transition-colors"
                onClick={() => setShowModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-white mb-2">إضافة اختبار</h2>
              <div className="bg-white/20 h-px w-32 mx-auto mb-3"></div>
              <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-[#FAF7F0] text-[#B17457] shadow-sm">
                لـ {selectedClass.name}
              </span>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
              {/* Quiz Title & Time Settings */}
              <div className="mb-6">
                <label className="block text-[#4A4947] text-sm font-medium mb-2">عنوان الاختبار</label>
                <input
                  className="w-full p-3 border border-[#D8D2C2] rounded-lg text-right bg-white focus:outline-none focus:ring-2 focus:ring-[#B17457] focus:border-transparent transition"
                  placeholder="عنوان الاختبار"
                  value={quizTitle}
                  onChange={e => setQuizTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-[#4A4947] text-sm font-medium mb-2">تاريخ الاختبار</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-[#D8D2C2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#B17457] focus:border-transparent transition"
                    value={scheduledDate}
                    onChange={e => setScheduledDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[#4A4947] text-sm font-medium mb-2">وقت الاختبار</label>
                  <input
                    type="time"
                    className="w-full p-3 border border-[#D8D2C2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#B17457] focus:border-transparent transition"
                    value={scheduledTime}
                    onChange={e => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-[#4A4947] text-sm font-medium mb-2">مدة الاختبار (بالدقائق)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    className="w-full p-3 border border-[#D8D2C2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#B17457] focus:border-transparent transition"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pr-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#B17457]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Questions Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-[#4A4947]">الأسئلة</h3>
                  <button
                    className="bg-[#B17457] text-white px-4 py-2 rounded-lg hover:bg-[#9A6249] transition-colors flex items-center shadow-sm"
                    onClick={addQuestion}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    إضافة سؤال
                  </button>
                </div>

                {questions.map((q, idx) => (
                  <div 
                    key={idx} 
                    className="mb-6 p-5 rounded-xl border border-[#D8D2C2] bg-white shadow-sm relative transition-all hover:shadow-md"
                  >
                    <div className="absolute -top-3 right-4 bg-[#B17457] text-white text-xs font-bold py-1 px-3 rounded-full shadow-sm">
                      سؤال {idx + 1}
                    </div>
                    
                    {questions.length > 1 && (
                      <button
                        className="absolute top-3 left-3 h-8 w-8 flex items-center justify-center rounded-full bg-[#FAF7F0] text-[#B17457] hover:bg-[#B17457] hover:text-white transition-colors shadow-sm"
                        onClick={() => deleteQuestion(idx)}
                        title="حذف السؤال"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                    
                    <div className="mt-4 mb-4">
                      <input
                        className="w-full p-3 border border-[#D8D2C2] rounded-lg text-right bg-[#FAF7F0] focus:outline-none focus:ring-2 focus:ring-[#B17457] focus:border-transparent transition"
                        placeholder={`نص السؤال ${idx + 1}`}
                        value={q.question}
                        onChange={e => handleQuestionChange(idx, 'question', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-3 mt-4">
                      {optionLabels.map((label, oidx) => (
                        <div key={oidx} className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#B17457] bg-opacity-10 text-[#B17457] font-bold">
                            {label}
                          </span>
                          <input
                            className="flex-1 p-3 border border-[#D8D2C2] rounded-lg text-right bg-[#FAF7F0] focus:outline-none focus:ring-2 focus:ring-[#B17457] focus:border-transparent transition"
                            placeholder={`الخيار ${label}`}
                            value={q.options[oidx]}
                            onChange={e => handleQuestionChange(idx, oidx, e.target.value)}
                          />
                          <label className="flex items-center gap-2 cursor-pointer py-2 px-3 rounded-lg hover:bg-[#B17457] hover:bg-opacity-5 transition">
                            <input
                              type="radio"
                              name={`correct-${idx}`}
                              className="h-4 w-4 text-[#B17457] focus:ring-[#B17457]"
                              checked={q.answer === q.options[oidx]}
                              onChange={() => handleQuestionChange(idx, 'answer', q.options[oidx])}
                            />
                            <span className="text-sm text-[#4A4947]">الإجابة الصحيحة</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#D8D2C2] mt-8 flex flex-col gap-3">
                <button
                  className="w-full font-bold text-lg py-3 rounded-xl bg-[#B17457] text-white hover:bg-[#9A6249] transition-colors shadow-sm flex items-center justify-center"
                  onClick={submitQuiz}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  حفظ الاختبار
                </button>
                <button
                  className="w-full py-2 rounded-xl bg-[#D8D2C2] text-[#4A4947] hover:bg-opacity-80 transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Quiz Details */}
      {showQuizDetails && selectedQuizList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-[#FAF7F0] rounded-2xl shadow-2xl overflow-hidden animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="bg-[#B17457] px-6 py-5 text-center relative">
              <button 
                className="absolute left-4 top-4 text-white hover:text-[#FAF7F0] transition-colors"
                onClick={closeQuizDetails}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-white mb-2">تفاصيل الاختبارات</h2>
              <div className="bg-white/20 h-px w-32 mx-auto mb-3"></div>
              <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-[#FAF7F0] text-[#B17457] shadow-sm">
                لـ {selectedClass.name}
              </span>
            </div>
            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
              {selectedQuizList.length === 0 && (
                <div className="text-[#B17457] text-center font-bold">لا يوجد اختبارات لهذا الصف بعد.</div>
              )}
              {selectedQuizList.map((quiz, qidx) => (
                <div key={quiz._id} className="mb-8 border-b border-[#D8D2C2] pb-6 last:border-0 last:pb-0">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-lg text-[#4A4947] mb-2">عنوان الاختبار:</div>
                      <div className="bg-white rounded-lg p-3 border border-[#D8D2C2] text-[#4A4947]">{quiz.title}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="bg-[#B17457] text-white px-3 py-1 rounded hover:bg-[#9A6249] transition-colors"
                        onClick={() => openEditQuiz(quiz, selectedClass)}
                      >
                        تعديل
                      </button>
                      <button
                        className="bg-[#D8D2C2] text-[#4A4947] px-3 py-1 rounded hover:bg-red-200 transition-colors"
                        onClick={() => deleteQuiz(quiz._id)}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-bold text-[#4A4947] mb-1">تاريخ ووقت الاختبار:</div>
                      <div className="bg-white rounded-lg p-2 border border-[#D8D2C2] text-[#4A4947]">
                        {quiz.scheduledDate ? new Date(quiz.scheduledDate).toLocaleString('ar-EG') : 'غير محدد'}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-[#4A4947] mb-1">مدة الاختبار:</div>
                      <div className="bg-white rounded-lg p-2 border border-[#D8D2C2] text-[#4A4947]">
                        {quiz.duration} دقيقة
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-[#4A4947] mb-2">الأسئلة:</div>
                    {quiz.questions.map((q, idx) => (
                      <div key={idx} className="mb-4 p-4 rounded-lg border border-[#D8D2C2] bg-white">
                        <div className="font-bold text-[#B17457] mb-2">سؤال {idx + 1}: {q.question}</div>
                        <ul className="list-disc pr-6 text-[#4A4947]">
                          {q.options.map((opt, oidx) => (
                            <li key={oidx} className={q.answer === opt ? 'font-bold text-[#B17457]' : ''}>
                              {optionLabels[oidx]}. {opt} {q.answer === opt && <span className="ml-2 text-xs bg-[#B17457] text-white px-2 py-0.5 rounded-full">الإجابة الصحيحة</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 border-t border-[#D8D2C2] pt-6">
                    <div className="font-bold text-lg text-[#4A4947] mb-4">نتائج الطلاب:</div>
                    {quizResults[quiz._id]?.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-[#B17457] text-white">
                              <th className="p-3 text-right">اسم الطالب</th>
                              <th className="p-3 text-right">الدرجة</th>
                              <th className="p-3 text-right">عدد الأسئلة</th>
                              <th className="p-3 text-right">تاريخ التسليم</th>
                            </tr>
                          </thead>
                          <tbody>
                            {quizResults[quiz._id].map((result, idx) => (
                              <tr key={idx} className="border-b border-[#D8D2C2] hover:bg-[#FAF7F0]">
                                <td className="p-3 text-right">{result.student.fullName}</td>
                                <td className="p-3 text-right">{result.score} / {result.totalQuestions}</td>
                                <td className="p-3 text-right">{result.totalQuestions}</td>
                                <td className="p-3 text-right">{new Date(result.submittedAt).toLocaleString('ar-EG')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center text-[#B17457] py-4">
                        لا توجد نتائج لهذا الاختبار بعد
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}