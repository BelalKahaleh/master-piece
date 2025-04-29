import React, { useState, useEffect, useRef } from "react";
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
  Newspaper,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  /* -------------------- Scroll Listener -------------------- */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* -------------------- Click Outside Handler -------------------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* -------------------- Escape Key Handler -------------------- */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  /* -------------------- Palette -------------------- */
  const colors = {
    darkGray: "#4A4947",
    lightCream: "#FAF7F0",
    beige: "#D8D2C2",
    terracotta: "#B17457",
  };

  return (
    <header
      className={`fixed top-0 w-full transition-all duration-500 z-50 ${
        isScrolled ? "shadow-lg" : ""
      }`}
      style={{
        backgroundColor: isScrolled ? colors.darkGray : colors.lightCream,
        backdropFilter: isScrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="container mx-auto">
        {/* ---------------- Top Bar ---------------- */}
        <div className="flex items-center justify-between py-4 px-6">
          
            {/* Login Dropdown */}
            <div className="relative mx-2" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center px-3 py-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: dropdownOpen ? colors.terracotta : "transparent",
                  color: dropdownOpen
                    ? colors.lightCream
                    : isScrolled
                    ? colors.lightCream
                    : colors.darkGray,
                  boxShadow: dropdownOpen ? "0 4px 12px rgba(177, 116, 87, 0.3)" : "none",
                }}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span>تسجيل دخول</span>
                <LogIn size={18} className="mr-1 ml-2" />
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-48 rounded-lg overflow-hidden shadow-lg border transform origin-top-right transition-all duration-300"
                  style={{ 
                    backgroundColor: colors.beige, 
                    borderColor: colors.terracotta,
                    animation: "dropdownFade 0.3s ease forwards",
                  }}
                  role="menu"
                >
                  <DropdownItem 
                    to="/studentLogin" 
                    icon={<User size={16} />} 
                    colors={colors}
                    onClick={() => setDropdownOpen(false)}
                  >
                    بوابة الطالب
                  </DropdownItem>
                  <DropdownItem 
                    to="/teacherLogin" 
                    icon={<BookOpen size={16} />} 
                    colors={colors}
                    onClick={() => setDropdownOpen(false)}
                  >
                    بوابة المعلم
                  </DropdownItem>
                  <DropdownItem 
                    to="/AdminLogin" 
                    icon={<Users size={16} />} 
                    colors={colors}
                    onClick={() => setDropdownOpen(false)}
                  >
                    بوابة المدير
                  </DropdownItem>
                </div>
              )}
            </div>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden rounded-full p-2 transition-all duration-300 hover:scale-105 active:scale-95 order-1"
            style={{
              color: isScrolled ? colors.lightCream : colors.darkGray,
              backgroundColor: isOpen ? colors.terracotta : "transparent",
              boxShadow: isOpen ? "0 4px 12px rgba(177, 116, 87, 0.2)" : "none",
            }}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* -------- Desktop Navigation -------- */}
          <nav className="hidden md:flex items-center space-x-1 order-1">
            <NavLink to="/AboutUs" icon={<Info size={18} />} {...navProps(isScrolled, colors)}>
              حول
            </NavLink>
            <NavLink to="/contact" icon={<Mail size={18} />} {...navProps(isScrolled, colors)}>
              تواصل معنا
            </NavLink>
            <NavLink to="/news" icon={<Newspaper size={18} />} {...navProps(isScrolled, colors)}>
              الأخبار
            </NavLink>
            <NavLink to="/" icon={<Home size={18} />} {...navProps(isScrolled, colors)}>
              الرئيسية
            </NavLink>

          </nav>

          {/* ---------------- Logo ---------------- */}
          <div className="flex items-center order-2">
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight relative group text-right transition-all duration-300"
              style={{ color: isScrolled ? colors.lightCream : colors.darkGray }}
              aria-label="Home"
            >
              <span className="inline-block transition-transform duration-300 group-hover:scale-105">
                الحصاد التربوي
              </span>
              <span
                className="absolute -bottom-1 right-0 w-0 h-0.5 transition-all duration-500 ease-in-out group-hover:w-full"
                style={{ backgroundColor: colors.terracotta }}
              ></span>
            </Link>
          </div>
        </div>

        {/* -------- Mobile Navigation Drawer -------- */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{ 
            backgroundColor: colors.darkGray,
            boxShadow: isOpen ? "inset 0 5px 15px rgba(0,0,0,0.1)" : "none",
          }}
          aria-hidden={!isOpen}
        >
          <div className="flex flex-col py-2 px-4 space-y-1">
            <MobileNavLink 
              to="/news" 
              icon={<Newspaper size={18} />} 
              colors={colors}
              onClick={() => setIsOpen(false)}
            >
              الأخبار
            </MobileNavLink>
            <MobileNavLink 
              to="/about" 
              icon={<Info size={18} />} 
              colors={colors}
              onClick={() => setIsOpen(false)}
            >
              حول
            </MobileNavLink>
            <MobileNavLink 
              to="/contact" 
              icon={<Mail size={18} />} 
              colors={colors} 
              isHighlighted
              onClick={() => setIsOpen(false)}
            >
              تواصل معنا
            </MobileNavLink>
            <MobileNavLink 
              to="/" 
              icon={<Home size={18} />} 
              colors={colors}
              onClick={() => setIsOpen(false)}
            >
              الرئيسية
            </MobileNavLink>

            {/* Mobile Login Accordion */}
            <div className="pt-2 border-t" style={{ borderColor: `${colors.beige}33` }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex w-full items-center justify-between py-2 px-1 transition-all duration-300"
                style={{ color: colors.lightCream }}
                aria-expanded={dropdownOpen}
              >
                <span className="flex items-center">
                  <LogIn size={18} className="ml-2" />
                  تسجيل دخول
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out rounded-md mt-1 ${
                  dropdownOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                }`}
                style={{ 
                  backgroundColor: colors.beige,
                  boxShadow: dropdownOpen ? "inset 0 2px 8px rgba(0,0,0,0.1)" : "none",
                }}
                aria-hidden={!dropdownOpen}
              >
                <MobileDropdownItem 
                  to="/studentLogin" 
                  icon={<User size={16} />} 
                  colors={colors}
                  onClick={() => {
                    setDropdownOpen(false);
                    setIsOpen(false);
                  }}
                >
                  بوابة الطالب
                </MobileDropdownItem>
                <MobileDropdownItem 
                  to="/teacherLogin" 
                  icon={<BookOpen size={16} />} 
                  colors={colors}
                  onClick={() => {
                    setDropdownOpen(false);
                    setIsOpen(false);
                  }}
                >
                  بوابة المعلم
                </MobileDropdownItem>
                <MobileDropdownItem 
                  to="/adminLogin" 
                  icon={<Users size={16} />} 
                  colors={colors}
                  onClick={() => {
                    setDropdownOpen(false);
                    setIsOpen(false);
                  }}
                >
                  بوابة المدير
                </MobileDropdownItem>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS keyframes animation for the dropdown */}
      <style jsx>{`
        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </header>
  );
}

/* ============================================================
   Helper Components
   ============================================================ */
const navProps = (isScrolled, colors) => ({ isScrolled, colors });

/* ---------------- Desktop NavLink ---------------- */
const NavLink = ({ to, children, icon, isScrolled, colors, isHighlighted = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link
      to={to}
      className="flex items-center px-3 py-2 mx-1 rounded-full transition-all duration-300 relative overflow-hidden"
      style={{
        backgroundColor: isHighlighted 
          ? colors.terracotta 
          : isHovered 
            ? `${colors.terracotta}E6` 
            : "transparent",
        color: (isHighlighted || isHovered)
          ? colors.lightCream
          : isScrolled
          ? colors.lightCream
          : colors.darkGray,
        transform: isHovered ? "scale(1.05)" : "scale(1)",
        boxShadow: isHovered ? "0 4px 12px rgba(177, 116, 87, 0.25)" : "none",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {icon && (
        <span 
          className="ml-2 transition-transform duration-300" 
          style={{
            transform: isHovered ? "translateX(-3px)" : "translateX(0)"
          }}
        >
          {icon}
        </span>
      )}
      <span
        className="absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 transition-transform duration-300 origin-center"
        style={{
          backgroundColor: colors.lightCream,
          transform: isHovered ? "scaleX(0.8)" : "scaleX(0)",
        }}
      ></span>
    </Link>
  );
};

/* ---------------- Dropdown Item ---------------- */
const DropdownItem = ({ to, children, icon, colors, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link
      to={to}
      className="flex items-center px-4 py-3 transition-all duration-300 border-b last:border-b-0 relative"
      style={{
        borderColor: `${colors.darkGray}20`,
        color: isHovered ? colors.lightCream : colors.darkGray,
        backgroundColor: isHovered ? colors.terracotta : "transparent",
        transform: isHovered ? "translateX(-5px)" : "translateX(0)",
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon && (
        <span 
          className="ml-2 transition-all duration-300" 
          style={{
            transform: isHovered ? "scale(1.2)" : "scale(1)",
          }}
        >
          {icon}
        </span>
      )}
      {children}
    </Link>
  );
};

/* ---------------- Mobile NavLink ---------------- */
const MobileNavLink = ({ to, children, icon, colors, isHighlighted = false, onClick }) => {
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <Link
      to={to}
      className="flex items-center py-3 px-2 rounded transition-all duration-300"
      style={{
        backgroundColor: isHighlighted ? colors.terracotta : "transparent",
        color: colors.lightCream,
        transform: isPressed ? "scale(0.98)" : "scale(1)",
        boxShadow: isPressed ? "inset 0 2px 5px rgba(0,0,0,0.15)" : "none",
      }}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {children}
      {icon && <span className="ml-2 transition-transform duration-300">{icon}</span>}
    </Link>
  );
};

/* ---------------- Mobile Dropdown Item ---------------- */
const MobileDropdownItem = ({ to, children, icon, colors, onClick }) => {
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <Link
      to={to}
      className="flex items-center px-4 py-2 border-b last:border-b-0 transition-all duration-300"
      style={{ 
        borderColor: `${colors.darkGray}20`, 
        color: colors.darkGray,
        backgroundColor: isPressed ? `${colors.terracotta}99` : "transparent",
        transform: isPressed ? "translateX(-3px)" : "translateX(0)",
      }}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {children}
      {icon && <span className="ml-2 transition-transform duration-300">{icon}</span>}
    </Link>
  );
};