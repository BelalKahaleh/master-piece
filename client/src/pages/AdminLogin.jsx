// File: src/pages/Admin/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      if (res.ok) navigate("/admin/students");
      else {
        const data = await res.json();
        setError(data.message || "بيانات الاعتماد غير صحيحة");
      }
    } catch {
      setError("خطأ في الاتصال بالخادم");
    } finally { setLoading(false); }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: colors.bg }} dir="rtl">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg border-t-4" style={{ backgroundColor: colors.card, borderColor: colors.accent }}>
        <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: colors.text }}>تسجيل دخول المدير</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 font-medium" style={{ color: colors.text }}>البريد الإلكتروني</label>
            <input type="email" required className="w-full py-2 px-3 border rounded" placeholder="admin@school.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium" style={{ color: colors.text }}>كلمة المرور</label>
            <input type="password" required className="w-full py-2 px-3 border rounded" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-center text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-2 rounded-md font-medium text-white" style={{ backgroundColor: colors.accent }}>
            {loading ? "جاري التحقق..." : "دخول"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;