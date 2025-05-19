import React from 'react';
import { BookOpenIcon, AcademicCapIcon, ClipboardDocumentListIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const COLORS = {
  bg: '#FAF7F0',
  border: '#D8D2C2',
  accent: '#B17457',
  text: '#4A4947',
  lightAccent: 'rgba(177, 116, 87, 0.1)',
};

const GuideSection = ({ icon: Icon, title, description, steps }) => (
  <div className="bg-white rounded-xl shadow-md border p-6 mb-6" style={{ borderColor: COLORS.border }}>
    <div className="flex items-start">
      <div className="flex-shrink-0 p-3 rounded-lg" style={{ backgroundColor: COLORS.lightAccent }}>
        <Icon className="w-6 h-6" style={{ color: COLORS.accent }} />
      </div>
      <div className="mr-4">
        <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.text }}>{title}</h3>
        <p className="mb-4" style={{ color: COLORS.text }}>{description}</p>
        {steps && (
          <ol className="list-decimal pr-6 space-y-2">
            {steps.map((step, index) => (
              <li key={index} style={{ color: COLORS.text }}>{step}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  </div>
);

export default function TeacherGuide() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: COLORS.bg }} dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-2 rounded-full bg-[#B17457] bg-opacity-20 mb-3">
            <BookOpenIcon className="h-8 w-8" style={{ color: COLORS.accent }} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>دليل المعلم</h1>
          <p className="text-lg mb-4" style={{ color: COLORS.accent }}>مرحباً بك في دليل المعلم. هنا ستجد كل ما تحتاجه للبدء في استخدام النظام</p>
          <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: COLORS.accent }}></div>
        </div>

        {/* Guide Sections */}
        <div className="space-y-6">
          <GuideSection
            icon={AcademicCapIcon}
            title="إدارة الصفوف"
            description="تعرف على كيفية إدارة الصفوف الخاصة بك وعرض الجدول الدراسي"
            steps={[
              "انتقل إلى صفحة الجدول من القائمة الجانبية",
              "اختر الصف الذي تريد عرض جدوله",
              "يمكنك عرض تفاصيل الصف والطلاب المسجلين",
              "تأكد من تحديث الجدول في حالة وجود أي تغييرات"
            ]}
          />

          <GuideSection
            icon={ClipboardDocumentListIcon}
            title="إدارة الامتحانات"
            description="كيفية إنشاء وإدارة الامتحانات للطلاب"
            steps={[
              "انتقل إلى صفحة الامتحانات",
              "اضغط على زر إضافة امتحان جديد",
              "حدد الصف والمادة وتاريخ الامتحان",
              "أدخل أسئلة الامتحان وعلاماتها",
              "احفظ الامتحان وشاركه مع الطلاب"
            ]}
          />

          <GuideSection
            icon={ChartBarIcon}
            title="إدارة العلامات"
            description="كيفية إدخال وتتبع علامات الطلاب"
            steps={[
              "انتقل إلى صفحة العلامات",
              "اختر الصف والمادة",
              "أدخل علامات الطلاب لكل امتحان",
              "يمكنك عرض إحصائيات وتقارير العلامات",
              "احفظ التغييرات بشكل دوري"
            ]}
          />

          <GuideSection
            icon={BookOpenIcon}
            title="نصائح عامة"
            description="بعض النصائح المهمة لاستخدام النظام بشكل فعال"
            steps={[
              "تأكد من تحديث بياناتك الشخصية في صفحة الملف الشخصي",
              "احتفظ بنسخة احتياطية من الامتحانات والعلامات",
              "استخدم نظام التنبيهات للإشعارات المهمة",
              "تواصل مع الدعم الفني في حالة وجود أي مشاكل",
              "قم بتسجيل الخروج بعد كل جلسة عمل"
            ]}
          />
        </div>
      </div>
    </div>
  );
}
