import { Link } from "react-router-dom";

const SidebarStudent = () => {
  return (
    <div className="w-64 h-screen text-white fixed top-0 right-0" style={{ backgroundColor: "#4A4947" }}>
      <div className="p-4 text-xl font-bold flex items-center justify-center" style={{ backgroundColor: "#B17457", color: "#FAF7F0" }}>
        <span> بوابة الطالب </span>
      </div>
      <ul className="mt-6" dir="rtl">
        <li>
          <Link 
            to="/teacher/teacherProfile" 
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
            <span>الملف الشخصي</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/teacher/coursesTeacher" 
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
            <span>المواد</span>
          </Link>
        </li>
        <li>
         
        </li>
        <li>
          <Link 
            to="/teacher/examTeacher" 
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
            <span>الامتحانات</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/teacher/marksTeacher" 
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
            <span>العلامات</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/teacher/teacherGuide"
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
            <span>دليل معلم</span>
          </Link>
        </li>
      </ul>
      <div className="absolute bottom-0 right-0 w-64 p-4 text-center" style={{ backgroundColor: "#D8D2C2", color: "#4A4947" }}>
        <span className="text-sm">تم تسجيل الدخول كمعلم</span>
      </div>
    </div>
  );
};

export default SidebarStudent;