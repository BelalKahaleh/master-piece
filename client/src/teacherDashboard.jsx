// src/teacherDashboard.jsx
import React from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import TeacherNavbar from "./components/TeacherNavbar";
import TeacherProfile from "./pages/teacher/teacherProfile";
import CoursesTeacher from "./pages/teacher/CoursesTeacher";
import QuizManager from "./pages/teacher/QuizManager";
import TeacherMark from "./pages/teacher/teacherMark";
import TeacherGuide from "./pages/teacher/TeacherGuide";

export default function TeacherDashboard() {
  return (
    <div className="flex">

      {/* Teacher Navbar (Sidebar/Header) */}
      <TeacherNavbar />

      {/* Main Content Area for Nested Routes - Added pt-20 for space below navbar */}
      <div className="flex-1 bg-[#FAF7F0] p-4 pt-24 lg:pt-4"> {/* Removed mt-16 lg:mt-0, added pt-24 */}
        <Routes>
          {/* Define nested teacher routes here */}

          {/* Route for /teacher/teacherProfile */}
          <Route path="teacherProfile" element={<TeacherProfile />} />

          {/* Add routes for other teacher pages, e.g., */}
          <Route path="coursesTeacher" element={<CoursesTeacher />} />
          <Route path="QuizManager" element={<QuizManager />} />
          <Route path="TeacherMark" element={<TeacherMark />} />
          <Route path="teacherGuide" element={<TeacherGuide />} />

          {/* Optional: Redirect from the base /teacher route to a default nested route */}
          {/* <Route index element={<Navigate to="teacherProfile" replace />} /> */}

        </Routes>
        {/* Outlet will render the matched nested route component */}
        {/* <Outlet />  -- We are directly rendering the matched route element within Routes for this structure */}

        {/* If you want to use Outlet, structure would be: */}
        {/* <Routes> */}
        {/*    <Route path="/" element={<Outlet />}> */}
        {/*        <Route path="teacherProfile" element={<TeacherProfile />} /> */}
        {/*        // other nested routes */}
        {/*    </Route> */}
        {/* </Routes> */}
        {/* For your current simple nested routes, defining them directly within Routes like above is also common. */}
        {/* The key is to avoid rendering the component AND Outlet for the same path. */}

        {/* Given the duplication issue, let's ensure only one instance of Routes defines the paths. */}
        {/* If the duplication persists, it might be an issue in App.jsx rendering TeacherDashboard multiple times. */}
        {/* For now, let's remove the potentially conflicting Outlet if it was causing a double render. */}
        {/* Let's assume the goal is to define the nested routes directly within the TeacherDashboard's Routes. */}

        {/* The previous edit added <Outlet /> alongside Routes. This is the likely cause of duplication. */}
        {/* We will keep the nested Routes definition and remove the separate Outlet. */}

      </div>
    </div>
  );
}
