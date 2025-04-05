import { Link } from "react-router-dom";

const SidebarAdmin = () => {
  return (
    <div className="w-64 h-screen text-white fixed top-0 right-0" style={{ backgroundColor: "#4A4947" }}>
      <div className="p-4 text-xl font-bold flex items-center justify-center" style={{ backgroundColor: "#B17457", color: "#FAF7F0" }}>
        <span>لوحة تحكم المسؤول</span>
      </div>
      <ul className="mt-6" dir="rtl">
        <li>
          <Link 
            to="/admin/students" 
            className="block py-3 px-4 flex items-center transition-colors duration-200 border-r-4 border-transparent" 
            style={{ 
              backgroundColor: "#4A4947", 
              color: "#FAF7F0",
              borderRightColor: "transparent"
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = "#B17457";
              e.currentTarget.style.borderRightColor = "#FAF7F0";
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = "#4A4947";
              e.currentTarget.style.borderRightColor = "transparent";
            }}
          >
            <span className="ml-2">👨‍🎓</span>
            <span>الطلاب</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/admin/teachers" 
            className="block py-3 px-4 flex items-center transition-colors duration-200 border-r-4 border-transparent" 
            style={{ 
              backgroundColor: "#4A4947", 
              color: "#FAF7F0",
              borderRightColor: "transparent"
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = "#B17457";
              e.currentTarget.style.borderRightColor = "#FAF7F0";
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = "#4A4947";
              e.currentTarget.style.borderRightColor = "transparent";
            }}
          >
            <span className="ml-2">👨‍🏫</span>
            <span>المعلمون</span>
          </Link>
        </li>
        <li>
         
        </li>
        <li>
          <Link 
            to="/admin/courses" 
            className="block py-3 px-4 flex items-center transition-colors duration-200 border-r-4 border-transparent" 
            style={{ 
              backgroundColor: "#4A4947", 
              color: "#FAF7F0",
              borderRightColor: "transparent"
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = "#B17457";
              e.currentTarget.style.borderRightColor = "#FAF7F0";
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = "#4A4947";
              e.currentTarget.style.borderRightColor = "transparent";
            }}
          >
            <span className="ml-2">📚</span>
            <span>المواد</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/admin/news" 
            className="block py-3 px-4 flex items-center transition-colors duration-200 border-r-4 border-transparent" 
            style={{ 
              backgroundColor: "#4A4947", 
              color: "#FAF7F0",
              borderRightColor: "transparent"
            }} 
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = "#B17457";  
              e.currentTarget.style.borderRightColor = "#FAF7F0";
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = "#4A4947";
              e.currentTarget.style.borderRightColor = "transparent";
            }}
          >
            <span className="ml-2">📰</span>
            <span>الأخبار</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/admin/messages"
            className="block py-3 px-4 flex items-center transition-colors duration-200 border-r-4 border-transparent" 
            style={{ 
              backgroundColor: "#4A4947", 
              color: "#FAF7F0",
              borderRightColor: "transparent"
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = "#B17457";
              e.currentTarget.style.borderRightColor = "#FAF7F0";
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = "#4A4947";
              e.currentTarget.style.borderRightColor = "transparent";
            }}
          >
            <span className="ml-2">✉️</span>
            <span>الرسائل</span>
          </Link>
        </li>
      </ul>
      <div className="absolute bottom-0 right-0 w-64 p-4 text-center" style={{ backgroundColor: "#D8D2C2", color: "#4A4947" }}>
        <span className="text-sm">تم تسجيل الدخول كمسؤول</span>
      </div>
    </div>
  );
};

export default SidebarAdmin;