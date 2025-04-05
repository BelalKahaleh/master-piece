import React, { useState, useEffect } from 'react';
import { ChevronRight, Award, BookOpen, Users, Clock, MapPin, Calendar, Phone, Mail } from 'lucide-react';

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const [isVisible, setIsVisible] = useState({});

  // Animation for sections appearing on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.animate-section');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.8;
        if (isInView) {
          setIsVisible(prev => ({ ...prev, [section.id]: true }));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // School stats
  const stats = [
    { icon: <Users />, value: '1,200+', label: 'طلاب' },
    { icon: <BookOpen />, value: '45+', label: 'برامج تعليمية' },
    { icon: <Award />, value: '98%', label: 'نسبة النجاح' },
    { icon: <Clock />, value: '60+', label: 'سنوات الخبرة' },
  ];

  // Team members
  const teamMembers = [
    {
      name: 'د. رياض أحمد',
      position: 'مدير المدرسة',
      image: 'client/src/assets/manager.jpeg',
      bio: 'يمتلك خبرة أكثر من 20 عامًا في مجال التعليم والإدارة التربوية.'
    },
    {
      name: 'أ. محمد العلي',
      position: 'رئيس الشؤون الأكاديمية',
      image: 'client/src/assets/admin.jpeg',
      bio: 'حاصل على الدكتوراه في المناهج وطرق التدريس مع خبرة 15 عامًا.'
    },
    {
      name: 'أ. نور السالم',
      position: 'مشرفة الأنشطة الطلابية',
      image: 'client/src/assets/activity.jpeg',
      bio: 'متخصص في تطوير المهارات القيادية والإبداعية لدى الطلاب.'
    }
  ];

  // Timeline data
  const timelineEvents = [
    { year: '١٩٦٥', title: 'تأسيس المدرسة', description: 'تأسست مدرستنا بهدف توفير تعليم متميز يدمج بين الأصالة والمعاصرة.' },
    { year: '١٩٨٥', title: 'افتتاح المبنى الجديد', description: 'تم افتتاح المبنى الجديد المجهز بأحدث التقنيات التعليمية.' },
    { year: '٢٠٠٥', title: 'إطلاق البرامج الدولية', description: 'بدأنا في تقديم برامج دولية لتعزيز فرص الطلاب في الجامعات العالمية.' },
    { year: '٢٠٢٠', title: 'التحول الرقمي', description: 'استكملنا رحلة التحول الرقمي لتطوير العملية التعليمية وتعزيز مهارات المستقبل.' },
  ];

  return (
    <div className="bg-[#FAF7F0] min-h-screen" dir="rtl">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-[#4A4947] opacity-50"></div>
        <img 
          src="client/src/assets/school.jpg" 
          alt="صورة المدرسة" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">من نحن</h1>
          <p className="text-xl max-w-2xl text-center px-4">مدرستنا هي بيت العلم والتربية، حيث نبني أجيالاً واثقة قادرة على صنع المستقبل</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#FAF7F0" fillOpacity="1" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,133.3C960,160,1056,192,1152,186.7C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Mission, Vision, Values Tabs */}
      <section className="py-16 px-4 container mx-auto max-w-6xl animate-section" id="mission-section">
        <div className={`transition-all duration-1000 ${isVisible['mission-section'] ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
          <div className="flex flex-wrap justify-center mb-8 bg-white rounded-lg shadow-md overflow-hidden">
            <button 
              onClick={() => setActiveTab('mission')}
              className={`px-6 py-4 text-lg font-medium transition-colors ${activeTab === 'mission' ? 'bg-[#B17457] text-white' : 'text-[#4A4947] hover:bg-[#D8D2C2]'}`}
            >
              رسالتنا
            </button>
            <button 
              onClick={() => setActiveTab('vision')}
              className={`px-6 py-4 text-lg font-medium transition-colors ${activeTab === 'vision' ? 'bg-[#B17457] text-white' : 'text-[#4A4947] hover:bg-[#D8D2C2]'}`}
            >
              رؤيتنا
            </button>
            <button 
              onClick={() => setActiveTab('values')}
              className={`px-6 py-4 text-lg font-medium transition-colors ${activeTab === 'values' ? 'bg-[#B17457] text-white' : 'text-[#4A4947] hover:bg-[#D8D2C2]'}`}
            >
              قيمنا
            </button>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            {activeTab === 'mission' && (
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-6 md:mb-0 md:ml-8">
                  <h2 className="text-3xl font-bold text-[#4A4947] mb-4">رسالتنا</h2>
                  <p className="text-gray-700 mb-4">نسعى إلى توفير بيئة تعليمية محفزة ومبتكرة تساعد الطلاب على اكتشاف قدراتهم وتطوير مهاراتهم ليكونوا مواطنين مسؤولين ومبدعين قادرين على المساهمة في بناء المجتمع.</p>
                  <p className="text-gray-700">نؤمن بأن كل طالب لديه قدرات فريدة يمكن تنميتها من خلال التوجيه السليم والدعم المستمر، مع التركيز على القيم الأخلاقية والمهارات العلمية.</p>
                </div>
                <div className="md:w-1/2">
                  <img src="/api/placeholder/600/400" alt="رسالتنا" className="rounded-lg shadow-lg w-full" />
                </div>
              </div>
            )}
            
            {activeTab === 'vision' && (
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-6 md:mb-0 md:ml-8">
                  <h2 className="text-3xl font-bold text-[#4A4947] mb-4">رؤيتنا</h2>
                  <p className="text-gray-700 mb-4">نتطلع إلى أن نكون مؤسسة تعليمية رائدة ومرجعًا للتميز الأكاديمي والتربوي على المستوى المحلي والإقليمي، من خلال تبني أحدث الأساليب التعليمية وتوظيف التكنولوجيا لخدمة العملية التعليمية.</p>
                  <p className="text-gray-700">نسعى لتخريج أجيال واعية ومتسلحة بالعلم والمعرفة، قادرة على مواجهة تحديات المستقبل والمساهمة في التنمية المستدامة للمجتمع.</p>
                </div>
                <div className="md:w-1/2">
                  <img src="/api/placeholder/600/400" alt="رؤيتنا" className="rounded-lg shadow-lg w-full" />
                </div>
              </div>
            )}
            
            {activeTab === 'values' && (
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-6 md:mb-0 md:ml-8">
                  <h2 className="text-3xl font-bold text-[#4A4947] mb-4">قيمنا</h2>
                  <ul className="space-y-4">
                    <li className="flex">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#B17457] rounded-full flex items-center justify-center text-white">1</div>
                      <div className="mr-4">
                        <h3 className="font-bold text-[#4A4947]">التميز والإبداع</h3>
                        <p className="text-gray-700">نسعى دائماً نحو التميز في كل ما نقدمه، ونشجع الإبداع والابتكار في جميع جوانب العملية التعليمية.</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#B17457] rounded-full flex items-center justify-center text-white">2</div>
                      <div className="mr-4">
                        <h3 className="font-bold text-[#4A4947]">المسؤولية والالتزام</h3>
                        <p className="text-gray-700">نغرس في طلابنا روح المسؤولية والالتزام تجاه أنفسهم ومجتمعهم وبيئتهم.</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#B17457] rounded-full flex items-center justify-center text-white">3</div>
                      <div className="mr-4">
                        <h3 className="font-bold text-[#4A4947]">التعاون واحترام التنوع</h3>
                        <p className="text-gray-700">نعزز روح التعاون والعمل الجماعي، ونحترم التنوع والاختلاف كمصدر للثراء والإبداع.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2">
                  <img src="/api/placeholder/600/400" alt="قيمنا" className="rounded-lg shadow-lg w-full" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#D8D2C2] animate-section" id="stats-section">
        <div className={`container mx-auto px-4 transition-all duration-1000 ${isVisible['stats-section'] ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-center text-[#4A4947] mb-12">مدرستنا بالأرقام</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center transform transition-transform hover:scale-105">
                <div className="w-16 h-16 bg-[#B17457] rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-[#4A4947]">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4 container mx-auto max-w-6xl animate-section" id="timeline-section">
        <div className={`transition-all duration-1000 ${isVisible['timeline-section'] ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-center text-[#4A4947] mb-12">تاريخنا</h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-[#B17457] h-full"></div>
            
            {/* Timeline events */}
            {timelineEvents.map((event, index) => (
              <div key={index} className={`mb-12 flex ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                <div className="w-1/2"></div>
                <div className="w-10 flex justify-center relative z-10">
                  <div className="w-6 h-6 bg-[#B17457] rounded-full border-4 border-[#FAF7F0]"></div>
                </div>
                <div className={`w-1/2 px-6 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <span className="text-[#B17457] font-bold text-xl">{event.year}</span>
                    <h3 className="text-lg font-semibold text-[#4A4947] my-2">{event.title}</h3>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-[#FAF7F0] animate-section" id="team-section">
        <div className={`container mx-auto px-4 transition-all duration-1000 ${isVisible['team-section'] ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-center text-[#4A4947] mb-12">فريقنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md transform transition-transform hover:scale-105">
                <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#4A4947]">{member.name}</h3>
                  <p className="text-[#B17457] mb-4">{member.position}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 bg-[#D8D2C2] animate-section" id="facilities-section">
        <div className={`container mx-auto px-4 transition-all duration-1000 ${isVisible['facilities-section'] ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-center text-[#4A4947] mb-12">مرافقنا</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative group overflow-hidden rounded-lg shadow-lg">
              <img src="client/src/assets/labs.jpg" alt="مختبرات العلوم" className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A4947] to-transparent opacity-75"></div>
              <div className="absolute bottom-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">مختبرات العلوم</h3>
                <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">مختبرات مجهزة بأحدث التقنيات العلمية لتعزيز التعلم العملي</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-lg shadow-lg">
              <img src="client/src/assets/library.jpg" alt="المكتبة" className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A4947] to-transparent opacity-75"></div>
              <div className="absolute bottom-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">المكتبة</h3>
                <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">مكتبة ثرية تضم آلاف الكتب والمراجع الورقية والرقمية</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-lg shadow-lg">
              <img src="client/src/assets/playground.jpg" alt="الملاعب الرياضية" className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A4947] to-transparent opacity-75"></div>
              <div className="absolute bottom-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">الملاعب الرياضية</h3>
                <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">ملاعب متنوعة لممارسة مختلف الأنشطة الرياضية</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4 container mx-auto max-w-6xl animate-section" id="contact-section">
        <div className={`bg-white p-8 rounded-lg shadow-md transition-all duration-1000 ${isVisible['contact-section'] ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-center text-[#4A4947] mb-8">تواصل معنا</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center p-4 border border-[#D8D2C2] rounded-lg">
              <div className="w-12 h-12 bg-[#B17457] rounded-full flex items-center justify-center text-white mr-4">
                <MapPin />
              </div>
              <div>
                <h3 className="font-semibold text-[#4A4947]">العنوان</h3>
                <p className="text-gray-600">الأردن ، الزرقاء</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 border border-[#D8D2C2] rounded-lg">
              <div className="w-12 h-12 bg-[#B17457] rounded-full flex items-center justify-center text-white mr-4">
                <Phone />
              </div>
              <div>
                <h3 className="font-semibold text-[#4A4947]">رقم الهاتف</h3>
                <p className="text-gray-600">+962 78 137 3708</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 border border-[#D8D2C2] rounded-lg">
              <div className="w-12 h-12 bg-[#B17457] rounded-full flex items-center justify-center text-white mr-4">
                <Mail />
              </div>
              <div>
                <h3 className="font-semibold text-[#4A4947]">البريد الإلكتروني</h3>
                <p className="text-gray-600">dorob@school.edu.sa</p>
              </div>
            </div>
          </div>
          
        
        </div>
      </section>
    </div>
  );
};

export default AboutUs;