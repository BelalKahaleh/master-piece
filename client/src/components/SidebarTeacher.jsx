import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const SidebarTeacher = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeRoute, setActiveRoute] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location]);

  // Example navLinks, adjust as needed
  const navLinks = [
    { path: "/teacher/dashboard", icon: "🏠", label: "الرئيسية" },
    { path: "/teacher/classes", icon: "📚", label: "الصفوف" },
    { path: "/teacher/messages", icon: "✉️", label: "الرسائل" },
    { path: "/teacher/profile", icon: "👤", label: "الملف الشخصي" }
  ];

  const handleNavigation = (path) => {
    if (path !== location.pathname) {
      setIsTransitioning(true);
      setTimeout(() => {
        navigate(path);
        setIsTransitioning(false);
        if (setSidebarOpen) setSidebarOpen(false);
      }, 300);
    }
  };

  const handleLogout = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate("/teacherLogin");
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
          fixed top-0 right-0 z-50 h-full w-64 text-white shadow-lg transition-transform duration-300
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
        {/* ...rest of your sidebar content... */}
      </div>
    </>
  );
};

export default SidebarTeacher; 