import React, { useState } from 'react';

// Define the color scheme
const COLORS = {
  bg: '#FAF7F0',
  border: '#D8D2C2',
  accent: '#B17457',
  text: '#4A4947',
  lightAccent: 'rgba(177, 116, 87, 0.1)',
};

const timetableData = [
  {
    day: "الأحد",
    period: 1,
    startTime: "٠٨:٠٠ ص",
    endTime: "٠٨:٤٠ ص",
    teacher: "682b2c6d48a32635ee9a1ae7",
    subject: "احياء",
    _id: "682b6c2afc77f9e868b0f522",
  },
  {
    day: "الأحد",
    period: 2,
    startTime: "٠٨:٤٥ ص",
    endTime: "٠٩:٢٥ ص",
    teacher: "682b0c0a91f246c8da7dc11f",
    subject: "علوم",
    _id: "682b6c2afc77f9e868b0f523",
  },
  {
    day: "الأحد",
    period: 3,
    startTime: "٠٩:٣٠ ص",
    endTime: "١٠:١٠ ص",
    teacher: "682b0a9b91f246c8da7dc102",
    subject: "عربي",
    _id: "682b6c2afc77f9e868b0f524",
  },
  {
    day: "الأحد",
    period: 4,
    startTime: "١٠:٥٠ ص",
    endTime: "١١:٣٠ ص",
    teacher: "682ad6a51b96ed62351df413",
    subject: "رياضيات",
    _id: "682b6c2afc77f9e868b0f525",
  },
  {
    day: "الأحد",
    period: 5,
    startTime: "١١:٣٥ ص",
    endTime: "١٢:١٥ م",
    teacher: "6828dfab21753071b87cdb97",
    subject: "رياضة",
    _id: "682b6c2afc77f9e868b0f526",
  },
  {
    day: "الأحد",
    period: 6,
    startTime: "١٢:٢٠ م",
    endTime: "٠١:٠٠ م",
    teacher: "682221a0b920a453fe9c3eb6",
    subject: "فيزياء",
    _id: "682b6c2afc77f9e868b0f527",
  },
  {
    day: "الأحد",
    period: 7,
    startTime: "٠١:٠٥ م",
    endTime: "٠١:٤٥ م",
    teacher: "6804fc7ef7134bd829805509",
    subject: "تاريخ الاردن",
    _id: "682b6c2afc77f9e868b0f528",
  },
  {
    day: "الإثنين",
    period: 1,
    startTime: "٠٨:٠٠ ص",
    endTime: "٠٨:٤٠ ص",
    teacher: "682b2c6d48a32635ee9a1ae7",
    subject: "احياء",
    _id: "682b6c2afc77f9e868b0f529",
  },
  {
    day: "الإثنين",
    period: 2,
    startTime: "٠٨:٤٥ ص",
    endTime: "٠٩:٢٥ ص",
    teacher: "682b0c0a91f246c8da7dc11f",
    subject: "علوم",
    _id: "682b6c2afc77f9e868b0f52b",
  },
  {
    day: "الإثنين",
    period: 3,
    startTime: "٠٩:٣٠ ص",
    endTime: "١٠:١٠ ص",
    teacher: "682b0a9b91f246c8da7dc102",
    subject: "عربي",
    _id: "682b6c2afc77f9e868b0f52a",
  },
  {
    day: "الإثنين",
    period: 4,
    startTime: "١٠:٥٠ ص",
    endTime: "١١:٣٠ ص",
    teacher: "682ad6a51b96ed62351df413",
    subject: "رياضيات",
    _id: "682b6c2afc77f9e868b0f52c",
  },
  {
    day: "الإثنين",
    period: 5,
    startTime: "١١:٣٥ ص",
    endTime: "١٢:١٥ م",
    teacher: "6828dfab21753071b87cdb97",
    subject: "رياضة",
    _id: "682b6c2afc77f9e868b0f52d",
  },
  {
    day: "الإثنين",
    period: 6,
    startTime: "١٢:٢٠ م",
    endTime: "٠١:٠٠ م",
    teacher: "682221a0b920a453fe9c3eb6",
    subject: "فيزياء",
    _id: "682b6c2afc77f9e868b0f52e",
  },
  {
    day: "الإثنين",
    period: 7,
    startTime: "٠١:٠٥ م",
    endTime: "٠١:٤٥ م",
    teacher: "6804fc7ef7134bd829805509",
    subject: "تاريخ الاردن",
    _id: "682b6c2afc77f9e868b0f52f",
  },
  {
    day: "الثلاثاء",
    period: 1,
    startTime: "٠٨:٠٠ ص",
    endTime: "٠٨:٤٠ ص",
    teacher: "682b2c6d48a32635ee9a1ae7",
    subject: "احياء",
    _id: "682b6c2afc77f9e868b0f530",
  },
  {
    day: "الثلاثاء",
    period: 2,
    startTime: "٠٨:٤٥ ص",
    endTime: "٠٩:٢٥ ص",
    teacher: "682b0c0a91f246c8da7dc11f",
    subject: "علوم",
    _id: "682b6c2afc77f9e868b0f531",
  },
  {
    day: "الثلاثاء",
    period: 3,
    startTime: "٠٩:٣٠ ص",
    endTime: "١٠:١٠ ص",
    teacher: "682b0a9b91f246c8da7dc102",
    subject: "عربي",
    _id: "682b6c2afc77f9e868b0f532",
  },
  {
    day: "الثلاثاء",
    period: 4,
    startTime: "١٠:٥٠ ص",
    endTime: "١١:٣٠ ص",
    teacher: "682ad6a51b96ed62351df413",
    subject: "رياضيات",
    _id: "682b6c2afc77f9e868b0f533",
  },
  {
    day: "الثلاثاء",
    period: 5,
    startTime: "١١:٣٥ ص",
    endTime: "١٢:١٥ م",
    teacher: "6828dfab21753071b87cdb97",
    subject: "رياضة",
    _id: "682b6c2afc77f9e868b0f534",
  },
  {
    day: "الثلاثاء",
    period: 6,
    startTime: "١٢:٢٠ م",
    endTime: "٠١:٠٠ م",
    teacher: "682221a0b920a453fe9c3eb6",
    subject: "فيزياء",
    _id: "682b6c2afc77f9e868b0f535",
  },
  {
    day: "الثلاثاء",
    period: 7,
    startTime: "٠١:٠٥ م",
    endTime: "٠١:٤٥ م",
    teacher: "6804fc7ef7134bd829805509",
    subject: "تاريخ الاردن",
    _id: "682b6c2afc77f9e868b0f536",
  },
  {
    day: "الأربعاء",
    period: 2,
    startTime: "٠٨:٤٥ ص",
    endTime: "٠٩:٢٥ ص",
    teacher: "682b0a9b91f246c8da7dc102",
    subject: "عربي",
    _id: "682b6c2afc77f9e868b0f538",
  },
  {
    day: "الأربعاء",
    period: 3,
    startTime: "٠٩:٣٠ ص",
    endTime: "١٠:١٠ ص",
    teacher: "682b0c0a91f246c8da7dc11f",
    subject: "علوم",
    _id: "682b6c2afc77f9e868b0f539",
  },
  {
    day: "الأربعاء",
    period: 4,
    startTime: "٠٩:٣٠ ص",
    endTime: "١٠:١٠ ص",
    teacher: "682ad6a51b96ed62351df413",
    subject: "رياضيات",
    _id: "682b6c2afc77f9e868b0f53a",
  },
  {
    day: "الأربعاء",
    period: 5,
    startTime: "١١:٣٥ ص",
    endTime: "١٢:١٥ م",
    teacher: "6828dfab21753071b87cdb97",
    subject: "رياضة",
    _id: "682b6c2afc77f9e868b0f53b",
  },
  {
    day: "الأربعاء",
    period: 6,
    startTime: "١٢:٢٠ م",
    endTime: "٠١:٠٠ م",
    teacher: "682221a0b920a453fe9c3eb6",
    subject: "فيزياء",
    _id: "682b6c2afc77f9e868b0f53c",
  },
  {
    day: "الأربعاء",
    period: 7,
    startTime: "٠١:٠٥ م",
    endTime: "٠١:٤٥ م",
    teacher: "6804fc7ef7134bd829805509",
    subject: "تاريخ الاردن",
    _id: "682b6c2afc77f9e868b0f53d",
  },
  {
    day: "الخميس",
    period: 1,
    startTime: "٠٨:٠٠ ص",
    endTime: "٠٨:٤٠ ص",
    teacher: "682b2c6d48a32635ee9a1ae7",
    subject: "احياء",
    _id: "682b6c2afc77f9e868b0f53e",
  },
  {
    day: "الخميس",
    period: 2,
    startTime: "٠٨:٤٥ ص",
    endTime: "٠٩:٢٥ ص",
    teacher: "682b0c0a91f246c8da7dc11f",
    subject: "علوم",
    _id: "682b6c2afc77f9e868b0f53f",
  },
  {
    day: "الخميس",
    period: 3,
    startTime: "٠٩:٣٠ ص",
    endTime: "١٠:١٠ ص",
    teacher: "682b0a9b91f246c8da7dc102",
    subject: "عربي",
    _id: "682b6c2afc77f9e868b0f540",
  },
  {
    day: "الخميس",
    period: 4,
    startTime: "١٠:٥٠ ص",
    endTime: "١١:٣٠ ص",
    teacher: "682ad6a51b96ed62351df413",
    subject: "رياضيات",
    _id: "682b6c2afc77f9e868b0f541",
  },
  {
    day: "الخميس",
    period: 5,
    startTime: "١١:٣٥ ص",
    endTime: "١٢:١٥ م",
    teacher: "6828dfab21753071b87cdb97",
    subject: "رياضة",
    _id: "682b6c2afc77f9e868b0f542",
  },
  {
    day: "الخميس",
    period: 6,
    startTime: "١٢:٢٠ م",
    endTime: "٠١:٠٠ م",
    teacher: "682221a0b920a453fe9c3eb6",
    subject: "فيزياء",
    _id: "682b6c2afc77f9e868b0f543",
  },
  {
    day: "الخميس",
    period: 7,
    startTime: "٠١:٠٥ م",
    endTime: "٠١:٤٥ م",
    teacher: "6804fc7ef7134bd829805509",
    subject: "تاريخ الاردن",
    _id: "682b6c2afc77f9e868b0f544",
  },
];

const StudentCourses = () => {
  const [selectedDay, setSelectedDay] = useState('كل الأيام');

  const filteredData = selectedDay === 'كل الأيام'
    ? timetableData
    : timetableData.filter(item => item.day === selectedDay);

  const daysOfWeek = ['كل الأيام', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

  return (
    <div dir="rtl" className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: COLORS.bg }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>جدول الحصص</h1>
          <p className="text-lg" style={{ color: COLORS.text }}>تابع جدول حصصك اليومي</p>
        </div>

        {/* Day Filter */}
        <div className="mb-8">
          <div className="flex justify-center space-x-4 rtl:space-x-reverse">
            {daysOfWeek.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedDay === day
                    ? 'shadow-lg transform scale-105'
                    : 'bg-white shadow hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: selectedDay === day ? COLORS.accent : COLORS.bg,
                  color: selectedDay === day ? 'white' : COLORS.text,
                  borderColor: selectedDay === day ? COLORS.accent : COLORS.border,
                  borderWidth: '1px'
                }}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Timetable Table */}
        <div className="rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: COLORS.border + '40', border: `1px solid ${COLORS.border}` }}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.text }}>
                    اليوم
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.text }}>
                    الحصة
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.text }}>
                    المادة
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.text }}>
                    الوقت
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: COLORS.border }}>
                {filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: COLORS.text }}>
                      {item.day}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.text }}>
                      الحصة {item.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.text }}>
                      {item.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: COLORS.text }}>
                      {item.startTime} - {item.endTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-lg" style={{ color: COLORS.text }}>لا توجد حصص متاحة لهذا اليوم</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCourses; 