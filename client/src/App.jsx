// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar"; // Navbar component
import Footer from "./components/footer";
import Home from "./pages/home";
import AdminDashboard from "./AdminDashboard";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import StudentDashboard from "./studentDashboard";
import TeacherDashboard from "./teacherDashboard";
import AdminLogin from "./pages/AdminLogin";
import TeacherLogin from "./pages/teacher/teacherLogin";
import TeacherProfile from "./pages/teacher/teacherProfile";
import PublicNews from './pages/PublicNews';
import { Toaster } from 'react-hot-toast';
import StudentLogin from './pages/StudentLogin';
import StudentHome from './pages/student/StudentHome';
import StudentProfile from './pages/student/studentProfile';
import StudentGuide from './pages/student/StudentGuide'
function App() {
  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#FAF7F0',
            color: '#4A4947',
            border: '1px solid #D8D2C2',
          },
          success: {
            iconTheme: {
              primary: '#B17457',
              secondary: '#FAF7F0',
            },
          },
          error: {
            iconTheme: {
              primary: '#B17457',
              secondary: '#FAF7F0',
            },
          },
        }}
      />
      <Routes>
        {/* Home page will have Navbar and Footer */}
        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
        <Route path="/AboutUs" element={<><Navbar /><AboutUs /><Footer /></>} />
        <Route path="/adminLogin" element={<><AdminLogin /></>} />
        <Route path="/teacherLogin" element={<><TeacherLogin /></>} />
        {/* Admin routes will not show Navbar or Footer */}
        <Route path="/admin/*" element={<AdminDashboard />} />
        {/* Teacher routes */}
        <Route path="/teacher/*" element={<TeacherDashboard />}>
           <Route path="teacherProfile" element={<TeacherProfile />} />
        </Route>
        <Route path="/news" element={<><Navbar /><PublicNews /><Footer /></>} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/studentLogin" element={<StudentLogin />} />
        <Route path="/student-dashboard/*" element={<StudentDashboard />} />
        <Route path="/student/studentProfile" element={<StudentProfile />} />
        <Route path="/student-dashboard/studentGuide" element={<StudentGuide />} />
      </Routes>
    </>
  );
}

export default App;
