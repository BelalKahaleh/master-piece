import React, { useState, useEffect } from 'react';
import axios from 'axios';


const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const daysOfWeekArabic = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

const COLORS = {
  bg: "#FAF7F0",
  border: "#D8D2C2",
  accent: "#B17457",
  text: "#4A4947",
};

const ClassScheduleTable = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch classes with populated teacher data
        const classesResponse = await axios.get(`${API_BASE_URL}/classes`, {
          params: { populate: 'teacher,schedule.teacher' },
          withCredentials: true
        });
        setClasses(classesResponse.data);

        // Fetch teachers
        const teachersResponse = await axios.get(`${API_BASE_URL}/teachers`, {
          withCredentials: true
        });
        setTeachers(teachersResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('حدث خطأ أثناء تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-[#4A4947]">جاري التحميل...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  // Get all unique periods from all classes for the selected day
  const allPeriods = Array.from(new Set(
    classes.flatMap(cls => 
      cls.schedule
        .filter(slot => slot.day === selectedDay)
        .map(slot => slot.period)
    )
  )).sort((a, b) => a - b);

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-[#4A4947]">جدول الفصول الدراسية</h2>
        <div className="flex gap-2 mb-4">
          {daysOfWeek.map((day, idx) => (
            <button
              key={day}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                selectedDay === day 
                  ? 'bg-[#B17457] text-white' 
                  : 'bg-[#FAF7F0] text-[#4A4947] border border-[#D8D2C2] hover:bg-[#D8D2C2]'
              }`}
              onClick={() => setSelectedDay(day)}
            >
              {daysOfWeekArabic[idx]}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg border border-[#D8D2C2] shadow-sm">
          <thead className="bg-[#FAF7F0]">
            <tr>
              <th className="px-6 py-3 text-right text-sm font-medium text-[#4A4947] border-b border-[#D8D2C2]">
                الحصة
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-[#4A4947] border-b border-[#D8D2C2]">
                التوقيت
              </th>
              {classes.map((cls) => (
                <th key={cls._id} className="px-6 py-3 text-right text-sm font-medium text-[#4A4947] border-b border-[#D8D2C2]">
                  {cls.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8D2C2]">
            {allPeriods.map((period) => {
              // Get the first class's schedule for this period to get the time
              const timeSlot = classes[0]?.schedule.find(
                slot => slot.day === selectedDay && slot.period === period
              );

              return (
                <React.Fragment key={period}>
                  <tr className={period % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F0]'}>
                    <td className="px-6 py-4 text-sm font-medium text-[#4A4947]">
                      {period}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#4A4947]">
                      {timeSlot ? `${timeSlot.startTime} - ${timeSlot.endTime}` : '-'}
                    </td>
                    {classes.map((cls) => {
                      const slot = cls.schedule.find(
                        s => s.day === selectedDay && s.period === period
                      );
                      const teacher = teachers.find(t => t._id === slot?.teacher);

                      return (
                        <td key={cls._id} className="px-6 py-4 text-sm text-[#4A4947]">
                          {slot ? (
                            <div>
                              <div className="font-medium">{slot.subject}</div>
                              <div className="text-[#B17457]">{teacher?.fullName || 'غير محدد'}</div>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  {period === 3 && (
                    <tr>
                      <td colSpan={classes.length + 2} className="text-center py-2 text-[#B17457] font-medium bg-[#FAF7F0]">
                        استراحة طويلة (40 دقيقة)
                      </td>
                    </tr>
                  )}
                  {period !== 3 && period !== allPeriods[allPeriods.length - 1] && (
                    <tr>
                      <td colSpan={classes.length + 2} className="text-center py-1 text-xs text-[#4A4947] bg-[#FAF7F0]">
                        استراحة قصيرة (5 دقائق)
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassScheduleTable; 