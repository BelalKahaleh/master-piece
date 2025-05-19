import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

export default function TeacherMark() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [marks, setMarks] = useState({});
  const [editingMark, setEditingMark] = useState(null);

  // Fetch teacher's classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/quizzes/my-classes`, { withCredentials: true });
        setClasses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load classes');
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  // Fetch students and marks when a class is selected
  useEffect(() => {
    const fetchClassData = async () => {
      if (!selectedClass) return;
      
      try {
        setLoading(true);
        // Fetch students in the class
        const studentsRes = await axios.get(`${API_BASE_URL}/classes/${selectedClass._id}/students`, { withCredentials: true });
        setStudents(studentsRes.data);

        // Fetch existing marks
        const marksRes = await axios.get(`${API_BASE_URL}/marks/class/${selectedClass._id}`, { withCredentials: true });
        const marksMap = {};
        marksRes.data.forEach(mark => {
          marksMap[mark.student] = mark;
        });
        setMarks(marksMap);
        setLoading(false);
      } catch (err) {
        setError('Failed to load class data');
        setLoading(false);
      }
    };

    fetchClassData();
  }, [selectedClass]);

  const handleMarkChange = async (studentId, value) => {
    try {
      const markData = {
        student: studentId,
        class: selectedClass._id,
        value: parseFloat(value),
        date: new Date().toISOString()
      };

      if (marks[studentId]) {
        // Update existing mark
        await axios.put(`${API_BASE_URL}/marks/${marks[studentId]._id}`, markData, { withCredentials: true });
      } else {
        // Create new mark
        await axios.post(`${API_BASE_URL}/marks`, markData, { withCredentials: true });
      }

      // Update local state
      setMarks(prev => ({
        ...prev,
        [studentId]: { ...markData, _id: marks[studentId]?._id || 'temp' }
      }));
      setMessage('Mark saved successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to save mark');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading && !selectedClass) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B17457] mx-auto"></div>
          <p className="mt-4 text-[#4A4947]">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-2 rounded-full bg-[#B17457] bg-opacity-20 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#B17457]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#4A4947] mb-2">إدارة العلامات</h1>
          <p className="text-[#B17457] text-lg">قم بإدارة علامات الطلاب في الصفوف الخاصة بك</p>
          <div className="mt-4 w-24 h-1 bg-[#B17457] mx-auto rounded-full"></div>
        </div>

        {/* Messages */}
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

        {error && (
          <div className="mb-8 py-3 px-4 bg-red-100 border-r-4 border-red-500 rounded-lg shadow-sm">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Class Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-[#4A4947] mb-2">اختر الصف</label>
          <select
            value={selectedClass?._id || ''}
            onChange={(e) => {
              const classId = e.target.value;
              const selected = classes.find(c => c._id === classId);
              setSelectedClass(selected || null);
            }}
            className="w-full px-4 py-2 rounded-lg border border-[#D8D2C2] focus:ring-2 focus:ring-[#B17457] focus:border-[#B17457] bg-white"
          >
            <option value="">اختر صف...</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>{cls.name}</option>
            ))}
          </select>
        </div>

        {/* Marks Table */}
        {selectedClass && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#D8D2C2]">
                <thead className="bg-[#FAF7F0]">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#4A4947] uppercase tracking-wider">
                      اسم الطالب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#4A4947] uppercase tracking-wider">
                      العلامة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#4A4947] uppercase tracking-wider">
                      تاريخ التحديث
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#D8D2C2]">
                  {students.map(student => (
                    <tr key={student._id} className="hover:bg-[#FAF7F0]">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#4A4947]">{student.fullName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          value={marks[student._id]?.value || ''}
                          onChange={(e) => handleMarkChange(student._id, e.target.value)}
                          className="w-24 px-3 py-1 rounded-lg border border-[#D8D2C2] focus:ring-2 focus:ring-[#B17457] focus:border-[#B17457] text-right"
                          placeholder="أدخل العلامة"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4947]">
                        {marks[student._id]?.date ? new Date(marks[student._id].date).toLocaleDateString('ar-SA') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedClass && !loading && (
          <div className="text-center py-12">
            <div className="rounded-lg bg-white p-12 shadow-sm border border-[#D8D2C2]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#B17457] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-[#4A4947]">اختر صفاً للبدء</h3>
              <p className="mt-2 text-sm text-[#4A4947]">قم باختيار صف من القائمة أعلاه لإدارة علامات الطلاب</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
