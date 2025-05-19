// File: src/pages/Admin/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeLinkButton from '../components/HomeLinkButton';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const colors = {
    bg: "#FAF7F0",
    card: "#FFFFFF",
    accent: "#B17457",
    border: "#D8D2C2",
    text: "#4A4947",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      console.log("Login response:", data);

      if (res.ok) {
        // Navigate to admin dashboard
        navigate("/admin/students", { replace: true });
      } else {
        setError(data.message || "بيانات الاعتماد غير صحيحة");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative" style={{ backgroundColor: colors.bg }} dir="rtl">
      <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 10 }}>
        <HomeLinkButton onClick={() => navigate('/')} />
      </div>
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl border-t-4 border" style={{ backgroundColor: colors.card, borderColor: colors.accent, boxShadow: '0 8px 32px rgba(177, 116, 87, 0.10)' }}>
        <div className="flex justify-center mb-6">
          <div className="bg-[#FAF7F0] rounded-full p-3 shadow" style={{ border: `2px solid ${colors.accent}` }}>
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill={colors.accent} fillOpacity="0.1" />
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill={colors.accent}/>
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: colors.text, letterSpacing: '0.5px' }}>تسجيل دخول المدير</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 font-medium" style={{ color: colors.text }}>البريد الإلكتروني</label>
            <input
              type="email"
              required
              className="w-full py-2.5 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B17457]/30 transition-all"
              placeholder="admin@school.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ borderColor: colors.border, backgroundColor: colors.bg, color: colors.text }}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium" style={{ color: colors.text }}>كلمة المرور</label>
            <input
              type="password"
              required
              className="w-full py-2.5 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B17457]/30 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ borderColor: colors.border, backgroundColor: colors.bg, color: colors.text }}
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 justify-center bg-red-50 border border-red-200 text-red-700 rounded-lg py-2 px-3 text-sm mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              <span>{error}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-medium text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
            style={{ backgroundColor: colors.accent, letterSpacing: '0.5px' }}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? "جاري التحقق..." : "دخول"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;