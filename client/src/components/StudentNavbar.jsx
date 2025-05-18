import { Link } from "react-router-dom";
import { useState } from "react";
import StudentProfile from "../pages/student/studentProfile";

const StudentNavbar = () => {
  const [activeItem, setActiveItem] = useState(null);
  
  // Navigation items
  const navItems = [
    { to: "/student/studentProfile", icon: "👨‍🎓", label: "الملف الشخصي" },
    { to: "/student/studentCourses", icon: "👨‍🏫", label: "المواد" },
    { to: "/student/exam", icon: "📚", label: "الامتحانات" },
    { to: "/student/marks", icon: "📰", label: "العلامات" },
    { to: "/student/studentGuide", icon: "✉️", label: "دليل الطالب" }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-opacity-95 shadow-md z-50 transition-all duration-300" style={{ backgroundColor: "#4A4947" }}>
      <div className="flex flex-col md:flex-row">
        {/* Logo/Title Section */}
        <div className="flex items-center justify-center py-3 px-6 md:w-64" style={{ backgroundColor: "#B17457" }}>
          <h1 className="text-xl font-bold" style={{ color: "#FAF7F0" }}>بوابة الطالب</h1>
        </div>
        
        {/* Navigation Items */}
        <div className="flex flex-wrap justify-center md:justify-end flex-grow px-4" dir="rtl">
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
                  <span className="mr-2 text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                  <span 
                    className="absolute bottom-0 right-0 w-0 h-1 transition-all duration-300 group-hover:w-full rounded-lg"
                    style={{ backgroundColor: "#FAF7F0" }}
                  ></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* User Status */}
        <div className="px-4 py-2 flex items-center justify-center md:justify-end" style={{ backgroundColor: "#D8D2C2", color: "#4A4947" }}>
          <span className="text-sm font-medium">تم تسجيل الدخول كطالب</span>
        </div>
      </div>
      
      {/* Mobile dropdown menu button - appears on smaller screens */}
      <div className="md:hidden flex justify-center py-2">
        <button 
          className="flex items-center px-3 py-2 rounded"
          style={{ backgroundColor: "#B17457", color: "#FAF7F0" }}
        >
          <span>القائمة</span>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default StudentNavbar;