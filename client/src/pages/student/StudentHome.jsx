import React from 'react';
import { BookOpenIcon, ClipboardDocumentListIcon, AcademicCapIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';

const COLORS = {
  bg: '#FAF7F0',
  border: '#D8D2C2',
  accent: '#B17457',
  text: '#4A4947',
  lightAccent: 'rgba(177, 116, 87, 0.1)',
};

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white rounded-xl shadow-md border p-6 transition-all hover:shadow-lg" style={{ borderColor: COLORS.border }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium mb-1" style={{ color: COLORS.accent }}>{title}</p>
        <p className="text-2xl font-bold" style={{ color: COLORS.text }}>{value}</p>
      </div>
      <div className="p-3 rounded-lg" style={{ backgroundColor: COLORS.lightAccent }}>
        <Icon className="w-6 h-6" style={{ color: COLORS.accent }} />
      </div>
    </div>
  </div>
);

const ActivityItem = ({ icon: Icon, title, time, status }) => (
  <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border" style={{ borderColor: COLORS.border }}>
    <div className="flex-shrink-0 p-2 rounded-lg" style={{ backgroundColor: COLORS.lightAccent }}>
      <Icon className="w-5 h-5" style={{ color: COLORS.accent }} />
    </div>
    <div className="flex-grow">
      <p className="font-medium" style={{ color: COLORS.text }}>{title}</p>
      <div className="flex items-center mt-1">
        <ClockIcon className="w-4 h-4 ml-1" style={{ color: COLORS.accent }} />
        <span className="text-sm" style={{ color: COLORS.text }}>{time}</span>
      </div>
    </div>
    <span 
      className="px-2 py-1 text-xs rounded-full"
      style={{ 
        backgroundColor: status === 'completed' ? '#E8F5E9' : '#FFF3E0',
        color: status === 'completed' ? '#2E7D32' : '#E65100'
      }}
    >
      {status === 'completed' ? 'مكتمل' : 'قيد التنفيذ'}
    </span>
  </div>
);

const StudentHome = () => {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: COLORS.bg }} dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>مرحباً بك في لوحة الطالب</h1>
          <p className="text-lg" style={{ color: COLORS.accent }}>تابع تقدمك الدراسي وكن على اطلاع بآخر المستجدات</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpenIcon}
            title="الدورات المسجلة"
            value="3"
          />
          <StatCard
            icon={ClipboardDocumentListIcon}
            title="الواجبات المتبقية"
            value="2"
          />
          <StatCard
            icon={AcademicCapIcon}
            title="الاختبارات القادمة"
            value="1"
          />
          <StatCard
            icon={CalendarIcon}
            title="الحصص اليوم"
            value="4"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md border p-6" style={{ borderColor: COLORS.border }}>
              <h2 className="text-xl font-semibold mb-6" style={{ color: COLORS.text }}>النشاط الأخير</h2>
              <div className="space-y-4">
                <ActivityItem
                  icon={BookOpenIcon}
                  title="تم تسليم الواجب في مادة الرياضيات"
                  time="منذ ساعتين"
                  status="completed"
                />
                <ActivityItem
                  icon={ClipboardDocumentListIcon}
                  title="تم إضافة اختبار جديد في مادة العلوم"
                  time="منذ 3 ساعات"
                  status="pending"
                />
                <ActivityItem
                  icon={CalendarIcon}
                  title="تم تحديث جدول الدروس"
                  time="منذ 5 ساعات"
                  status="completed"
                />
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="bg-white rounded-xl shadow-md border p-6" style={{ borderColor: COLORS.border }}>
              <h2 className="text-xl font-semibold mb-6" style={{ color: COLORS.text }}>الأحداث القادمة</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.lightAccent }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium" style={{ color: COLORS.text }}>اختبار العلوم</span>
                    <span className="text-sm" style={{ color: COLORS.accent }}>غداً</span>
                  </div>
                  <p className="text-sm" style={{ color: COLORS.text }}>الساعة 10:00 صباحاً</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.lightAccent }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium" style={{ color: COLORS.text }}>موعد تسليم الواجب</span>
                    <span className="text-sm" style={{ color: COLORS.accent }}>بعد 3 أيام</span>
                  </div>
                  <p className="text-sm" style={{ color: COLORS.text }}>واجب الرياضيات</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome; 