// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar"; // Navbar component
import Footer from "./components/footer";
import Home from "./pages/home";
import AdminDashboard from "./AdminDashboard";
import Contact from "./pages/Contact";
function App() {
  return (
      <Routes>
        {/* Home page will have Navbar and Footer */}
        <Route path="/" element={<>
        <Navbar />
        <Home />
        <Footer />
        </>} />

        <Route path="/contact" element={<>
        <Navbar />
        <Contact />
        <Footer />
        </>} />

        {/* Admin routes will not show Navbar or Footer */}
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
  );
}

export default App;
