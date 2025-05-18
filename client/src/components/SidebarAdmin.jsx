import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const SidebarAdmin = ({ sidebarOpen, setSidebarOpen }) => {
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
        if (setSidebarOpen) setSidebarOpen(false); // close sidebar on mobile after navigation
      }, 300);
    }
  };

  const handleLogout = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate("/adminLogin");
      setIsTransitioning(false);
      if (setSidebarOpen) setSidebarOpen(false);
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
      {/* Responsive sidebar overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity lg:hidden ${sidebarOpen ? "block" : "hidden"}`}
        onClick={() => setSidebarOpen && setSidebarOpen(false)}
      />
      <div
        className={`
          fixed top-0 right-0 z-50 h-screen w-64 text-white shadow-lg transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
          lg:translate-x-0 lg:static lg:block
        `}
        style={{ backgroundColor: "#4A4947" }}
      >
        {/* Close button for mobile */}
        <button
          className="lg:hidden absolute top-4 left-4 p-2 text-white"
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
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