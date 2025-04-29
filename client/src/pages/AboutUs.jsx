import React from "react";
import { BookOpen, Award, Users } from "lucide-react";

const AboutUs = () => {
  return (
    <section className="bg-[#FAF7F0] text-[#4A4947] py-16" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header with subtle animation */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">من نحن</h1>
          <div className="w-24 h-1 bg-[#B17457] mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-lg">
            نحن في مدرسة الحصاد التربوي نسعى إلى تقديم تجربة تعليمية متميزة تُعزّز الإبداع، وتنمّي مهارات الطلاب الأكاديمية والشخصية في بيئة آمنة ومحفِّزة.
          </p>
        </div>

        {/* Vision & Mission with improved design */}
        <div className="grid gap-8 md:grid-cols-2 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-[#B17457] hover:shadow-xl transition-all group">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[#B17457] rounded-full flex items-center justify-center text-white mr-3">
                <BookOpen size={20} />
              </div>
              <h2 className="text-2xl font-bold text-[#B17457] group-hover:text-[#4A4947] transition-colors">رؤيتنا</h2>
            </div>
            <p className="leading-relaxed">
              أن نكون روّادًا في مجال التعليم بتطبيق أحدث المناهج والأساليب التربوية، لنُخرّج جيلاً مُبدعًا قادرًا على مواكبة التطورات العالمية والمساهمة في بناء مستقبلٍ أفضل.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-[#B17457] hover:shadow-xl transition-all group">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[#B17457] rounded-full flex items-center justify-center text-white mr-3">
                <Award size={20} />
              </div>
              <h2 className="text-2xl font-bold text-[#B17457] group-hover:text-[#4A4947] transition-colors">رسالتنا</h2>
            </div>
            <p className="leading-relaxed">
              توفير بيئة تعليمية شاملة ومحفّزة تضع الطالب في مركز العملية التعليمية، وتعتمد على القيم الأخلاقية، وتعزّز التفكير النقدي، والابتكار، والمسؤولية المجتمعية.
            </p>
          </div>
        </div>

        {/* Core Values with styled cards */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">قيمنا الأساسية</h2>
            <div className="w-16 h-1 bg-[#B17457] mx-auto"></div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-md border-r-4 border-[#B17457] hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="bg-[#D8D2C2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">١</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">التميز الأكاديمي</h3>
              <p className="text-center text-gray-600">نسعى للتميز في كل جوانب العملية التعليمية والتربوية</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-r-4 border-[#B17457] hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="bg-[#D8D2C2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">٢</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">الإبداع والابتكار</h3>
              <p className="text-center text-gray-600">نشجع التفكير الإبداعي وتطوير الحلول المبتكرة</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-r-4 border-[#B17457] hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="bg-[#D8D2C2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">٣</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">المسؤولية والانتماء</h3>
              <p className="text-center text-gray-600">نعزز روح المسؤولية والانتماء لدى طلابنا</p>
            </div>
          </div>
        </div>

        {/* School stats */}
        <div className="bg-[#D8D2C2] rounded-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">مدرستنا بالأرقام</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="text-[#B17457] text-3xl font-bold mb-2">+1200</div>
              <div className="text-sm">طالب وطالبة</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="text-[#B17457] text-3xl font-bold mb-2">+100</div>
              <div className="text-sm">معلم ومعلمة</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="text-[#B17457] text-3xl font-bold mb-2">+25</div>
              <div className="text-sm">سنة خبرة</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="text-[#B17457] text-3xl font-bold mb-2">98%</div>
              <div className="text-sm">نسبة النجاح</div>
            </div>
          </div>
        </div>

        {/* Call to Action with improved button */}
        <div className="text-center">
          <a
            href="/contact"
            className="inline-block bg-[#B17457] text-white py-3 px-10 rounded-full hover:bg-[#4A4947] transition-all duration-300 font-medium shadow-md hover:shadow-lg"
          >
            تواصل معنا للمزيد من المعلومات
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;