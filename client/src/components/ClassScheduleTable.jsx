import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { MdFreeBreakfast } from 'react-icons/md';

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
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // First, get the current teacher's information
        const teacherResponse = await axios.get(`${API_BASE_URL}/teachers/me`, {
          withCredentials: true
        });
        setCurrentTeacher(teacherResponse.data);

        // Then fetch classes with populated teacher data
        const classesResponse = await axios.get(`${API_BASE_URL}/classes`, {
          params: { populate: 'teacher,schedule.teacher' },
          withCredentials: true
        });

        // Filter classes to only show those assigned to the current teacher
        const teacherClasses = classesResponse.data.filter(cls => 
          // Check if teacher is the main teacher
          cls.teacher._id === teacherResponse.data._id ||
          // Or if teacher is in the schedule
          cls.schedule.some(slot => slot.teacher._id === teacherResponse.data._id)
        );

        setClasses(teacherClasses);
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

  if (!currentTeacher) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-600">لم يتم العثور على معلومات المعلم</div>
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

  // Get teacher's schedule for the selected day
  const getTeacherSchedule = () => {
    const schedule = {};
    
    // Initialize all periods as breaks
    allPeriods.forEach(period => {
      schedule[period] = {
        type: 'break',
        time: classes[0]?.schedule.find(s => s.period === period)?.startTime || '-'
      };
    });

    // Fill in actual classes
    classes.forEach(cls => {
      cls.schedule
        .filter(slot => slot.day === selectedDay && slot.teacher._id === currentTeacher._id)
        .forEach(slot => {
          schedule[slot.period] = {
            type: 'class',
            subject: slot.subject,
            className: cls.name,
            startTime: slot.startTime,
            endTime: slot.endTime
          };
        });
    });

    return schedule;
  };

  const teacherSchedule = getTeacherSchedule();

  // Helper to calculate period times
  const getPeriodTimes = (periodNumber) => {
    // periodNumber is 1-based
    let startHour = 8;
    let startMinute = 0;
    let totalMinutes = 0;
    for (let i = 1; i < periodNumber; i++) {
      totalMinutes += 40; // previous period
      if (i === 3) {
        totalMinutes += 40; // long break after 3rd
      } else {
        totalMinutes += 5; // short break
      }
    }
    const periodStart = new Date(0, 0, 0, startHour, startMinute + totalMinutes);
    const periodEnd = new Date(periodStart.getTime() + 40 * 60000);
    const pad = (n) => n.toString().padStart(2, '0');
    const format = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    return {
      start: format(periodStart),
      end: format(periodEnd)
    };
  };

  return (
    <div className="p-4 bg-[#F5F3EF] min-h-screen" dir="rtl">
      {/* Teacher's Schedule Summary */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-[#4A4947] text-right">جدول حصصي</h2>
        <div className="bg-white rounded-xl shadow-md border border-[#D8D2C2] p-6 flex flex-col md:flex-row items-center gap-6 md:flex-row-reverse">
          <div className="flex items-center gap-4 md:flex-row-reverse">
            <div className="bg-[#B17457] text-white rounded-full p-4 text-3xl shadow-md">
              <FaChalkboardTeacher />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#4A4947] mb-1 text-right">{currentTeacher.fullName}</h3>
              <p className="text-[#B17457] font-medium text-right">{currentTeacher.specialization}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Table Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-[#4A4947] text-right">جدول الحصص</h2>
        <div className="flex gap-2 mb-4 flex-wrap justify-center md:justify-end">
          {daysOfWeek.map((day, idx) => (
            <button
              key={day}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-sm border text-base md:text-lg ${
                selectedDay === day 
                  ? 'bg-[#B17457] text-white border-[#B17457]' 
                  : 'bg-[#FAF7F0] text-[#4A4947] border-[#D8D2C2] hover:bg-[#D8D2C2]'
              }`}
              onClick={() => setSelectedDay(day)}
            >
              {daysOfWeekArabic[idx]}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl border border-[#D8D2C2] shadow-md text-center" dir="rtl">
          <thead className="bg-[#FAF7F0]">
            <tr>
              <th className="px-6 py-3 text-center text-base font-bold text-[#4A4947] border-b border-[#D8D2C2]">الحصة</th>
              <th className="px-6 py-3 text-center text-base font-bold text-[#4A4947] border-b border-[#D8D2C2]">التوقيت</th>
              <th className="px-6 py-3 text-center text-base font-bold text-[#4A4947] border-b border-[#D8D2C2]">الحصة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8D2C2]">
            {allPeriods.map((period, idx) => {
              const slot = teacherSchedule[period];
              const times = getPeriodTimes(period);
              return (
                <React.Fragment key={period}>
                  <tr
                    className={
                      period % 2 === 0
                        ? 'bg-[#FAF7F0] hover:bg-[#F0EDE5] transition'
                        : 'bg-white hover:bg-[#F0EDE5] transition'
                    }
                  >
                    <td className="px-6 py-4 text-lg font-bold text-[#4A4947]">{period}</td>
                    <td className="px-6 py-4 text-base font-semibold text-[#4A4947] tracking-wide">{`${times.start} - ${times.end}`}</td>
                    <td className="px-6 py-4 text-base">
                      {slot.type === 'class' ? (
                        <div className="flex flex-col items-center gap-1 bg-[#FFF7F2] border border-[#B17457] rounded-lg p-2 shadow-sm">
                          <span className="text-[#B17457] text-2xl mb-1"><FaChalkboardTeacher /></span>
                          <span className="font-bold text-[#4A4947] text-lg">{slot.subject}</span>
                          <span className="text-[#B17457] text-sm font-medium">{slot.className}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-[#B17457] opacity-80">
                          <span className="text-2xl"><MdFreeBreakfast /></span>
                          <span className="font-semibold text-base">استراحة</span>
                        </div>
                      )}
                    </td>
                  </tr>
                  {period === 3 && (
                    <tr>
                      <td colSpan={3} className="text-center py-2 text-[#B17457] font-bold bg-[#FAF7F0] text-lg">
                        استراحة طويلة (40 دقيقة)
                      </td>
                    </tr>
                  )}
                  {period !== 3 && period !== allPeriods[allPeriods.length - 1] && (
                    <tr>
                      <td colSpan={3} className="text-center py-1 text-xs text-[#4A4947] bg-[#FAF7F0]">
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