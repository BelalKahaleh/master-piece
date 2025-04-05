import React, { useState, useEffect } from "react";
import { 
  Menu, 
  X, 
  ChevronDown, 
  Home,
  Info,
  Mail,
  LogIn,
  User,
  BookOpen,
  Users,
  Newspaper 
} from "lucide-react";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scrolling for navbar style changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Custom colors matching your palette
  const colors = {
    darkGray: "#4A4947",
    lightCream: "#FAF7F0",
    beige: "#D8D2C2",
    terracotta: "#B17457"
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header 
      className={`fixed top-0 w-full transition-all duration-300 z-50 ${isScrolled ? "shadow-md" : ""}`}
      style={{ 
        backgroundColor: isScrolled ? colors.darkGray : colors.lightCream, // change to lightCream when not scrolled
        backdropFilter: isScrolled ?  "blur(8px)" : "none"
      }}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4 px-6">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-2xl font-bold tracking-tight relative group"
              style={{ color: isScrolled ? colors.lightCream : colors.darkGray }}
            >
              <span className="inline-block transition-transform duration-300 group-hover:scale-105"> الحصاد التربوي </span>
              <span 
                className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" 
                style={{ backgroundColor: colors.terracotta }}
              ></span>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden rounded-full p-2 transition-colors duration-200"
            style={{ 
              color: isScrolled ? colors.lightCream : colors.darkGray,
              backgroundColor: isOpen ? colors.terracotta : "transparent" 
            }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex items-center space-x-1 rtl"
            dir="rtl"
          >
            <NavLink 
              to="/" 
              icon={<Home size={18} />} 
              isScrolled={isScrolled}
              colors={colors}
            >
              الرئيسية
            </NavLink>
            <NavLink 
              to="news" 
              icon={<Newspaper size={18} />} 
              isScrolled={isScrolled}
              colors={colors}
            >
              الأخبار
            </NavLink>
            <NavLink 
              to="AboutUs" 
              icon={<Info size={18} />} 
              isScrolled={isScrolled}
              colors={colors}
            >
              حول
            </NavLink>
           
            <NavLink 
              to="contact" 
              icon={<Mail size={18} />} 
              isScrolled={isScrolled}
              colors={colors}
            >
              تواصل معنا
            </NavLink>

            {/* Login Dropdown */}
            <div className="relative mx-2">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center px-3 py-2 rounded-full transition-all duration-200"
                style={{ 
                  backgroundColor: dropdownOpen ? colors.terracotta : "transparent",
                  color: dropdownOpen 
                    ? colors.lightCream 
                    : (isScrolled ? colors.lightCream : colors.darkGray)
                }}
              >
                <span>تسجيل دخول</span>
                <LogIn size={18} className="mr-1 ml-2" />
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} 
                />
              </button>

              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 rounded-lg overflow-hidden shadow-lg border"
                  style={{ 
                    backgroundColor: colors.beige,
                    borderColor: colors.terracotta 
                  }}
                >
                  <DropdownItem to="studentLogin" icon={<User size={16} />} colors={colors}>
                    بوابة الطالب
                  </DropdownItem>
                  <DropdownItem to="teacherLogin" icon={<BookOpen size={16} />} colors={colors}>
                    بوابة المعلم
                  </DropdownItem>
                  <DropdownItem to="adminLogin" icon={<Users size={16} />} colors={colors}>
                    بوابة المدير
                  </DropdownItem>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
          style={{ backgroundColor: colors.darkGray }}
        >
          <div className="flex flex-col py-2 px-4 space-y-1 rtl" dir="rtl">
            <MobileNavLink to="/" icon={<Home size={18} />} colors={colors}>
              الرئيسية
            </MobileNavLink>
            
            <MobileNavLink to="about" icon={<Info size={18} />} colors={colors}>
              حول
            </MobileNavLink>
            
            <MobileNavLink 
              to="contact" 
              icon={<Mail size={18} />} 
              colors={colors}
              isHighlighted={true}
            >
              تواصل معنا
            </MobileNavLink>

            <div className="pt-2 border-t" style={{ borderColor: `${colors.beige}33` }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex w-full items-center justify-between py-2 px-1"
                style={{ color: colors.lightCream }}
              >
                <span className="flex items-center">
                  <LogIn size={18} className="ml-2" />
                  تسجيل دخول
                </span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div 
                className={`overflow-hidden transition-all duration-200 rounded-md mt-1 ${dropdownOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                style={{ backgroundColor: colors.beige }}
              >
                <MobileDropdownItem to="studentLogin" icon={<User size={16} />} colors={colors}>
                  بوابة الطالب
                </MobileDropdownItem>
                <MobileDropdownItem to="teacherLogin" icon={<BookOpen size={16} />} colors={colors}>
                  بوابة المعلم
                </MobileDropdownItem>
                <MobileDropdownItem to="adminLogin" icon={<Users size={16} />} colors={colors}>
                  بوابة المدير
                </MobileDropdownItem>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Component for desktop navigation links
const NavLink = ({ to, children, icon, isScrolled, colors, isHighlighted = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link
      to={to}
      className="flex items-center px-3 py-2 mx-1 rounded-full transition-all duration-200"
      style={{ 
        backgroundColor: isHovered || isHighlighted ? colors.terracotta : "transparent",
        color: isHovered || isHighlighted 
          ? colors.lightCream 
          : (isScrolled ? colors.lightCream : colors.darkGray)
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon && <span className="ml-2">{icon}</span>}
      {children}
    </Link>
  );
};

// Component for dropdown menu items
const DropdownItem = ({ to, children, icon, colors }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link
      to={to}
      className="flex items-center px-4 py-3 transition-colors duration-200 border-b last:border-b-0"
      style={{ 
        borderColor: `${colors.darkGray}20`,
        backgroundColor: isHovered ? colors.terracotta : "transparent",
        color: isHovered ? colors.lightCream : colors.darkGray
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon && <span className="ml-2">{icon}</span>}
      {children}
    </Link>
  );
};

// Component for mobile navigation links
const MobileNavLink = ({ to, children, icon, colors, isHighlighted = false }) => {
  return (
    <Link
      to={to}
      className="flex items-center py-3 px-2 rounded transition-colors duration-200"
      style={{ 
        backgroundColor: isHighlighted ? colors.terracotta : "transparent",
        color: isHighlighted ? colors.lightCream : colors.lightCream
      }}
    >
      {icon && <span className="ml-2">{icon}</span>}
      {children}
    </Link>
  );
};

// Component for mobile dropdown items
const MobileDropdownItem = ({ to, children, icon, colors }) => {
  return (
    <Link
      to={to}
      className="flex items-center px-4 py-2 border-b last:border-b-0 transition-colors duration-200"
      style={{ 
        borderColor: `${colors.darkGray}20`,
        color: colors.darkGray
      }}
    >
      {icon && <span className="ml-2">{icon}</span>}
      {children}
    </Link>
  );
};
