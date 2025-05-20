import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://localhost:5000/api';
const optionLabels = ['أ', 'ب', 'ج', 'د'];

export default function TakeQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/quizzes/${quizId}`, { withCredentials: true });
        const quizData = response.data;
        
        // Check if quiz time has arrived
        const now = new Date();
        const quizTime = new Date(quizData.scheduledDate);
        
        if (now < quizTime) {
          setError('لم يحن وقت الاختبار بعد');
          return;
        }

        // Check if quiz time has expired
        const endTime = new Date(quizTime.getTime() + quizData.duration * 60000);
        if (now > endTime) {
          setError('انتهى وقت الاختبار');
          return;
        }

        setQuiz(quizData);
        setTimeLeft(Math.floor((endTime - now) / 1000));
      } catch (err) {
        setError('حدث خطأ أثناء تحميل الاختبار');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const submitQuiz = async () => {
    try {
      // Check if all questions are answered
      const unansweredQuestions = quiz.questions.filter((_, index) => !answers[index]);
      if (unansweredQuestions.length > 0) {
        const result = await Swal.fire({
          title: 'تنبيه!',
          text: 'هناك أسئلة لم تتم الإجابة عليها. هل تريد المتابعة؟',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#B17457',
          cancelButtonColor: '#D8D2C2',
          confirmButtonText: 'نعم، سلم الاختبار',
          cancelButtonText: 'لا، أريد المراجعة',
          reverseButtons: true
        });

        if (!result.isConfirmed) {
          return;
        }
      }

      await axios.post(`${API_BASE_URL}/quizzes/${quizId}/submit`, {
        answers
      }, { withCredentials: true });

      await Swal.fire({
        title: 'تم!',
        text: 'تم تسليم الاختبار بنجاح',
        icon: 'success',
        confirmButtonColor: '#B17457'
      });

      navigate('/student-dashboard/exam');
    } catch (err) {
      await Swal.fire({
        title: 'خطأ!',
        text: 'حدث خطأ أثناء تسليم الاختبار',
        icon: 'error',
        confirmButtonColor: '#B17457'
      });
    }
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
          <button
            onClick={() => navigate('/student-dashboard/exam')}
            className="bg-[#B17457] text-white px-6 py-2 rounded-lg hover:bg-[#9A6249] transition-colors"
          >
            العودة للصفحة السابقة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-3xl mx-auto">
        {/* Quiz Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-[#4A4947]">{quiz.title}</h1>
            <div className="bg-[#B17457] text-white px-4 py-2 rounded-lg">
              الوقت المتبقي: {formatTime(timeLeft)}
            </div>
          </div>
          <div className="text-[#4A4947]">
            <p>عدد الأسئلة: {quiz.questions.length}</p>
            <p>مدة الاختبار: {quiz.duration} دقيقة</p>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-4">
                <span className="bg-[#B17457] text-white px-3 py-1 rounded-full text-sm">
                  سؤال {index + 1}
                </span>
              </div>
              <p className="text-lg text-[#4A4947] mb-4">{question.question}</p>
              <div className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      answers[index] === option
                        ? 'bg-[#B17457] bg-opacity-10 border-[#B17457]'
                        : 'bg-[#FAF7F0] hover:bg-[#B17457] hover:bg-opacity-5'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={() => handleAnswerChange(index, option)}
                      className="hidden"
                    />
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#B17457] bg-opacity-10 text-[#B17457] font-bold ml-3">
                      {optionLabels[optionIndex]}
                    </span>
                    <span className="text-[#4A4947]">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            onClick={submitQuiz}
            className="bg-[#B17457] text-white px-8 py-3 rounded-lg hover:bg-[#9A6249] transition-colors text-lg font-bold"
          >
            تسليم الاختبار
          </button>
        </div>
      </div>
    </div>
  );
} 