import React, { useState, useEffect } from 'react';
import { FaFacebook, FaLinkedin, FaTwitter, FaInstagram, FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import axios from 'axios';

const Home = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/news?limit=3');
        setLatestNews(response.data.news || []);
      } catch (error) {
        console.error('Error fetching latest news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-[#FAF7F0] font-[Tajawal], sans-serif text-right" dir="rtl">
      {/* Hero Section with Motivational Video */}
      <section className="relative h-screen bg-[#4A4947] overflow-hidden">
        <video 
          src="/src/assets/herosection.mp4" 
          type="video/mp4"
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          onPlay={() => setIsVideoPlaying(true)}
          onPause={() => setIsVideoPlaying(false)}
        >
          <source />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-black opacity-50 bg-gradient-to-b from-transparent to-black"></div>
        
        <div className="flex items-center justify-center h-full relative z-10 text-center px-4">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight animate-fadeIn">
              انضم إلى رحلتنا التعليمية اليوم!
            </h1>
            <p className="text-xl md:text-2xl mb-10 leading-relaxed">
              شاهد الفيديو التعريفي وتعرف على كل ما نقدمه من فرص تعليمية متميزة.
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <Link to="#why-us" className="text-white animate-bounce inline-block">
            <FaChevronDown size={24} />
          </Link>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-24 bg-[#FAF7F0]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#4A4947] mb-6">أحدث الأخبار</h2>
            <div className="w-24 h-1 bg-[#B17457] mx-auto mb-8"></div>
            <p className="text-xl text-[#4A4947] max-w-3xl mx-auto leading-relaxed">
              تعرف على آخر الأخبار والتحديثات في مدرستنا
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-t-4 border-[#B17457] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#4A4947]">جاري تحميل الأخبار...</p>
            </div>
          ) : latestNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#4A4947]">لا توجد أخبار متاحة حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestNews.map((news) => (
                <div key={news._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
                  {Array.isArray(news.images) && news.images.length > 0 && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={`http://localhost:5000/uploads/news/${news.images[0]}`}
                        alt={news.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.png';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-[#4A4947] line-clamp-1">
                        {news.title}
                      </h3>
                      {news.createdAt && (
                        <span className="text-xs opacity-60 py-1 px-2 rounded-full bg-[rgba(177,116,87,0.1)] text-[#4A4947]">
                          {formatDate(news.createdAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-[#4A4947] mb-4 line-clamp-2">
                      {news.details}
                    </p>
                    {news.tags && news.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {news.tags.map((tag, i) => (
                          <span 
                            key={i} 
                            className="text-xs py-0.5 px-2 rounded-full"
                            style={{ backgroundColor: 'rgba(177,116,87,0.1)', color: '#B17457' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link 
                      to="/news"
                      className="mt-4 block w-full py-2 px-4 text-center rounded-lg text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: '#B17457' }}
                    >
                      اقرأ المزيد
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link 
              to="/news"
              className="inline-block py-3 px-8 rounded-lg text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#B17457' }}
            >
              عرض جميع الأخبار
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="py-24 bg-[#D8D2C2]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#4A4947] mb-6">لماذا نحن؟</h2>
            <div className="w-24 h-1 bg-[#B17457] mx-auto mb-8"></div>
            <p className="text-xl text-[#4A4947] max-w-3xl mx-auto leading-relaxed">
              نحن نقدم بيئة تعليمية متكاملة تركز على تطوير مهارات الطلاب وتزويدهم
              بالمعرفة العملية التي ستساعدهم في بناء مستقبل مشرق.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition duration-300">
              <div className="w-16 h-16 bg-[#B17457] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">١</span>
              </div>
              <h3 className="text-xl font-bold text-[#4A4947] mb-4 text-center">جودة التعليم</h3>
              <p className="text-[#4A4947] text-center">نعتمد أحدث المناهج التعليمية وأساليب التدريس لضمان تقديم أفضل تجربة تعليمية.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition duration-300">
              <div className="w-16 h-16 bg-[#B17457] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">٢</span>
              </div>
              <h3 className="text-xl font-bold text-[#4A4947] mb-4 text-center">كادر تعليمي متميز</h3>
              <p className="text-[#4A4947] text-center">نضم نخبة من المعلمين ذوي الخبرة والكفاءة العالية في مجالات تخصصهم.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition duration-300">
              <div className="w-16 h-16 bg-[#B17457] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">٣</span>
              </div>
              <h3 className="text-xl font-bold text-[#4A4947] mb-4 text-center">بيئة محفزة للإبداع</h3>
              <p className="text-[#4A4947] text-center">نوفر بيئة تعليمية محفزة تشجع على الابتكار والإبداع وتنمية المهارات.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps to Register Section */}
      <section className="py-24 bg-[#FAF7F0]" id="register-steps">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#4A4947] mb-6">
              خطوات التسجيل في المدرسة
            </h2>
            <div className="w-24 h-1 bg-[#B17457] mx-auto mb-8"></div>
          </div>
          
          <div className="relative">
            {/* Timeline connector */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#B17457] transform -translate-x-1/2 hidden md:block"></div>
            
            <div className="space-y-12 md:space-y-0">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-left mb-6 md:mb-0 order-2 md:order-1">
                  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                    <h3 className="text-2xl font-bold text-[#4A4947] mb-4">
                      ١- التسجيل الإلكتروني
                    </h3>
                    <p className="text-lg text-[#4A4947]">
                      قم بملء نموذج التسجيل الإلكتروني المخصص للطلاب الجدد عبر موقعنا.
                    </p>
                  </div>
                </div>
                <div className="md:w-1/2 relative order-1 md:order-2 mb-8 md:mb-0">
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 relative order-1 mb-8 md:mb-0">
                </div>
                <div className="md:w-1/2 md:pl-12 order-2">
                  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                    <h3 className="text-2xl font-bold text-[#4A4947] mb-4">
                      ٢- المقابلة الشخصية
                    </h3>
                    <p className="text-lg text-[#4A4947]">
                      بعد التسجيل، سيتم تحديد موعد لإجراء المقابلة الشخصية مع لجنة القبول.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-left mb-6 md:mb-0 order-2 md:order-1">
                  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                    <h3 className="text-2xl font-bold text-[#4A4947] mb-4">
                      ٣- تأكيد التسجيل
                    </h3>
                    <p className="text-lg text-[#4A4947]">
                      بعد اجتياز المقابلة، يمكنك تأكيد التسجيل ودفع الرسوم الدراسية للعام الدراسي.
                    </p>
                  </div>
                </div>
                <div className="md:w-1/2 relative order-1 md:order-2">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
