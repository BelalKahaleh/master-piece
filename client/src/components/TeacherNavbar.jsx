import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const TeacherNavbar = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Navigation items
  const navItems = [
    { to: "/teacher/teacherProfile", icon: "👨‍🎓", label: "الملف الشخصي" },
    { to: "/teacher/coursesTeacher", icon: "👨‍🏫", label: "الجدول" },
    { to: "/teacher/QuizManager", icon: "📚", label: "الامتحانات" },
    { to: "/teacher/teacherGuide", icon: "✉️", label: "دليل معلم" }
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('teacherToken');
    localStorage.removeItem('teacher');
    navigate('/'); // Redirect to home page
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-opacity-95 shadow-md z-50 transition-all duration-300" style={{ backgroundColor: "#4A4947" }}>
      <div className="flex flex-col md:flex-row">
        {/* Logo/Title Section */}
        <div className="flex items-center justify-center py-3 px-6 md:w-64" style={{ backgroundColor: "#B17457" }}>
          <h1 className="text-xl font-bold" style={{ color: "#FAF7F0" }}>بوابة المعلم</h1>
        </div>
        
        {/* Desktop Navigation and User Status */}
        <div className="flex-grow flex flex-col md:flex-row items-center justify-between px-4" dir="rtl">
          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-wrap justify-center md:justify-start flex-grow">
            <ul className="flex flex-wrap items-center">
              {navItems.map((item, index) => (
                <li key={index} className="relative group">
                  <Link 
                    to={item.to}
                    className="flex items-center px-4 py-3 mx-1 my-1 rounded-lg transition-all duration-300"
                    style={{ 
                      backgroundColor: activeItem === index ? "#B17457" : "transparent",
                      color: "#FAF7F0"
                    }}
                    onMouseEnter={() => setActiveItem(index)}
                    onMouseLeave={() => setActiveItem(null)}
                  >
                    <span className="ml-2 text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                    <span 
                      className="absolute bottom-0 left-0 w-0 h-1 transition-all duration-300 group-hover:w-full rounded-lg"
                      style={{ backgroundColor: "#FAF7F0" }}
                    ></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* User Status and Logout Button */}
          <div className="px-4 py-2 flex items-center justify-center md:justify-end gap-4" style={{ color: "#FAF7F0" }}>
            
            <button
              onClick={handleLogout}
              className="py-1.5 px-3 rounded bg-[#B17457] text-white hover:bg-[#9A6249] transition-colors duration-200"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu button */}
      <div className="md:hidden flex justify-center py-2">
        <button 
          className="flex items-center px-3 py-2 rounded"
          style={{ backgroundColor: "#B17457", color: "#FAF7F0" }}
          onClick={toggleMobileMenu}
        >
          <span>القائمة</span>
          <svg 
            className={`w-5 h-5 mr-2 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
      
      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden" dir="rtl">
          <ul className="px-2 pb-3 space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.to}
                  className="flex items-center py-2 px-4 rounded-lg text-base transition-colors duration-200"
                  style={{ 
                    backgroundColor: activeItem === index ? "#B17457" : "transparent",
                    color: "#FAF7F0"
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="ml-2 text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full text-right py-2 px-4 rounded-lg text-base transition-colors duration-200 bg-[#B17457] text-white hover:bg-[#9A6249]"
              >
                تسجيل الخروج
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default TeacherNavbar;