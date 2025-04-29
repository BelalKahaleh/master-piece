import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeRoute, setActiveRoute] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Set active route based on current location
  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location]);

  // Navigation links configuration
  const navLinks = [
    { path: "/admin/students", icon: "👨‍🎓", label: "الطلاب" },
    { path: "/admin/teachers", icon: "👨‍🏫", label: "المعلمون" },
    { path: "/admin/classes", icon: "📚", label: "الصفوف" },
    { path: "/admin/section", icon: "📚", label: "الشعب" },
    { path: "/admin/news", icon: "📰", label: "الأخبار" },
    { path: "/admin/messages", icon: "✉️", label: "الرسائل" },
    { path: "/admin/allAdmins", icon: "👨‍🎓", label: "المسؤولون" }

  ];

  // Handle smooth page transitions
  const handleNavigation = (path) => {
    if (path !== location.pathname) {
      setIsTransitioning(true);
      setTimeout(() => {
        navigate(path);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleLogout = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      // هنا يمكنك مسح بيانات الجلسة أو التوكن إذا لزم الأمر
      navigate("/adminLogin");
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <>
      {/* Page transition overlay */}
      <div 
        className="fixed inset-0 bg-black z-50 pointer-events-none transition-opacity duration-300" 
        style={{ 
          opacity: isTransitioning ? 0.3 : 0,
          visibility: isTransitioning ? "visible" : "hidden"
        }}
      />
      
      <div className="w-64 h-screen text-white fixed top-0 right-0 shadow-lg" style={{ backgroundColor: "#4A4947" }}>
        <div className="p-4 text-xl font-bold flex items-center justify-center" style={{ backgroundColor: "#B17457", color: "#FAF7F0" }}>
          <span className="transition-transform duration-300 transform hover:scale-105">لوحة تحكم المسؤول</span>
        </div>
        <ul className="mt-6" dir="rtl">
          {navLinks.map((link, index) => (
            <li key={index} className="mb-1">
              <Link 
                to={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(link.path);
                }}
                className="block py-3 px-4 flex items-center transition-all duration-300 border-r-4 relative overflow-hidden" 
                style={{ 
                  backgroundColor: activeRoute === link.path ? "#B17457" : "#4A4947", 
                  color: "#FAF7F0",
                  borderRightColor: activeRoute === link.path ? "#FAF7F0" : "transparent",
                  transform: activeRoute === link.path ? "translateX(-5px)" : "translateX(0)",
                }}
                onMouseOver={e => {
                  if (activeRoute !== link.path) {
                    e.currentTarget.style.backgroundColor = "#B17457AA";
                    e.currentTarget.style.borderRightColor = "#FAF7F0";
                    e.currentTarget.style.transform = "translateX(-3px)";
                  }
                }}
                onMouseOut={e => {
                  if (activeRoute !== link.path) {
                    e.currentTarget.style.backgroundColor = "#4A4947";
                    e.currentTarget.style.borderRightColor = "transparent";
                    e.currentTarget.style.transform = "translateX(0)";
                  }
                }}
              >
                <span className="ml-2 transition-transform duration-300" style={{
                  transform: activeRoute === link.path ? "scale(1.2)" : "scale(1)"
                }}>{link.icon}</span>
                <span>{link.label}</span>
                
                {/* Active indicator line animation */}
                <span 
                  className="absolute bottom-0 right-0 h-0.5 bg-white transition-all duration-500 ease-in-out"
                  style={{ 
                    width: activeRoute === link.path ? "100%" : "0%",
                    opacity: activeRoute === link.path ? 0.7 : 0
                  }}
                />
              </Link>
            </li>
          ))}
        </ul>
        <div className="absolute bottom-0 right-0 w-64 p-4 flex flex-col items-center" style={{ backgroundColor: "#D8D2C2", color: "#4A4947" }}>
          <span className="text-sm mb-2">تم تسجيل الدخول كمسؤول</span>
          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-md font-medium transition-all duration-300 hover:shadow-md"
            style={{ 
              backgroundColor: "#B17457", 
              color: "#FAF7F0" 
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(177, 116, 87, 0.3)";
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            تسجيل خروج
          </button>
        </div>
      </div>
    </>
  );
};

export default SidebarAdmin;