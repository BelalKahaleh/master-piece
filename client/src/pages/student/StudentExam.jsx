import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../config';

const StudentExam = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesRes, scoresRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/quizzes/student`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/quizzes/scores`, { withCredentials: true })
        ]);
        setQuizzes(quizzesRes.data);
        setScores(scoresRes.data);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStartQuiz = (quiz) => {
    const now = new Date();
    const quizTime = new Date(quiz.scheduledDate);
    const endTime = new Date(quizTime.getTime() + quiz.duration * 60000);

    if (now < quizTime) {
      Swal.fire({
        title: 'تنبيه!',
        text: 'لم يحن وقت الاختبار بعد',
        icon: 'warning',
        confirmButtonColor: '#B17457'
      });
      return;
    }

    if (now > endTime) {
      Swal.fire({
        title: 'تنبيه!',
        text: 'انتهى وقت الاختبار',
        icon: 'warning',
        confirmButtonColor: '#B17457'
      });
      return;
    }

    navigate(`/student-dashboard/exam/${quiz._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B17457]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="text-[#B17457] text-2xl mb-4">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#4A4947] mb-4">الاختبارات</h1>
          <div className="w-24 h-1 bg-[#B17457] mx-auto rounded-full"></div>
        </div>

        {scores.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#4A4947] mb-6 text-center">نتائج الاختبارات</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#B17457] text-white">
                      <th className="px-6 py-3 text-right">اسم الاختبار</th>
                      <th className="px-6 py-3 text-right">الدرجة</th>
                      <th className="px-6 py-3 text-right">عدد الأسئلة</th>
                      <th className="px-6 py-3 text-right">تاريخ التسليم</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((score) => (
                      <tr key={score._id} className="border-b border-[#D8D2C2] hover:bg-[#FAF7F0]">
                        <td className="px-6 py-4 text-[#4A4947]">{score.quiz.title}</td>
                        <td className="px-6 py-4 text-[#4A4947]">
                          <span className="font-bold text-[#B17457]">{score.score}</span> من {score.totalQuestions}
                        </td>
                        <td className="px-6 py-4 text-[#4A4947]">{score.totalQuestions}</td>
                        <td className="px-6 py-4 text-[#4A4947]">
                          {new Date(score.submittedAt).toLocaleDateString('ar-EG')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-[#4A4947] mb-6 text-center">الاختبارات المتاحة</h2>
          {quizzes.length === 0 ? (
            <div className="text-center text-[#4A4947] text-lg">
              لا توجد اختبارات متاحة حالياً
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.map(quiz => {
                const now = new Date();
                const quizTime = new Date(quiz.scheduledDate);
                const endTime = new Date(quizTime.getTime() + quiz.duration * 60000);
                const isAvailable = now >= quizTime && now <= endTime;
                const isExpired = now > endTime;
                const isUpcoming = now < quizTime;
                const hasSubmitted = scores.some(score => score.quiz._id === quiz._id);

                return (
                  <div key={quiz._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-[#4A4947] mb-4">{quiz.title}</h2>
                      <div className="space-y-2 text-[#4A4947] mb-6">
                        <p>عدد الأسئلة: {quiz.questions.length}</p>
                        <p>مدة الاختبار: {quiz.duration} دقيقة</p>
                        <p>تاريخ الاختبار: {new Date(quiz.scheduledDate).toLocaleDateString('ar-EG')}</p>
                        <p>وقت الاختبار: {new Date(quiz.scheduledDate).toLocaleTimeString('ar-EG')}</p>
                      </div>
                      <button
                        onClick={() => handleStartQuiz(quiz)}
                        disabled={!isAvailable || hasSubmitted}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          hasSubmitted
                            ? 'bg-green-500 text-white cursor-not-allowed'
                            : isAvailable
                            ? 'bg-[#B17457] text-white hover:bg-[#9A6249]'
                            : isExpired
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[#D8D2C2] text-[#4A4947] cursor-not-allowed'
                        }`}
                      >
                        {hasSubmitted
                          ? 'تم التسليم'
                          : isAvailable
                          ? 'ابدأ الاختبار'
                          : isExpired
                          ? 'انتهى وقت الاختبار'
                          : 'لم يحن وقت الاختبار بعد'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentExam; 