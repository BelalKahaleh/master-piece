// src/pages/Admin/Students.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const COLORS = {
  bg: "#FAF7F0",
  border: "#D8D2C2",
  accent: "#B17457",
  text: "#4A4947",
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/students", { withCredentials: true })
      .then((res) => setStudents(res.data))
      .catch((err) => {
        console.error(err);
        setError("لا يمكن الوصول إلى الخادم. تأكد من تشغيل الخادم على http://localhost:5000");
      });
  }, []);

  useEffect(() => {
    let result = students;
    if (stageFilter) {
      result = result.filter((s) => s.stage === stageFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [students, search, stageFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const formData = new FormData(e.target);

    try {
      const res = await axios.post("http://localhost:5000/api/students", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 201) {
        setSuccess("تم إضافة الطالب بنجاح");
        e.target.reset();
        setShowModal(false);
        setStudents((prev) => [res.data.student, ...prev]);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "فشل الاتصال بالخادم. الرجاء المحاولة لاحقًا");
    }
  };

  const Field = ({ label, children }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium" style={{ color: COLORS.text }}>
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="flex" dir="rtl">
      <div
        className="mr-64 w-full min-h-screen"
        style={{ backgroundColor: COLORS.bg }}
      >
        <div
          className="px-8 py-6 shadow-sm"
          style={{ backgroundColor: COLORS.bg, borderBottom: `1px solid ${COLORS.border}` }}
        >
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
              صفحة الطلاب
            </h1>
            <p className="text-sm opacity-75" style={{ color: COLORS.text }}>
              إدارة سجلات الطلاب والبيانات المسجلة
            </p>
          </div>
        </div>

        <div className="container mx-auto px-8 py-6">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto mb-4 md:mb-0">
              <input
                type="text"
                placeholder="ابحث بالاسم أو البريد"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="py-2 px-4 rounded-lg border focus:ring-2 focus:ring-opacity-50"
                style={{ borderColor: COLORS.border, width: "100%", maxWidth: "250px" }}
              />
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="py-2 px-4 rounded-lg border focus:ring-2 focus:ring-opacity-50"
                style={{ borderColor: COLORS.border }}
              >
                <option value="">كل المراحل</option>
                <option value="الابتدائية">الابتدائية</option>
                <option value="الإعدادية">الإعدادية</option>
                <option value="الثانوية">الثانوية</option>
              </select>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="py-2 px-5 rounded-lg text-white font-medium transition-transform hover:scale-105"
              style={{ backgroundColor: COLORS.accent }}
            >
              + إضافة طالب جديد
            </button>
          </div>

          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600">
              {error}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <div key={s._id} className="bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="h-2" style={{ backgroundColor: COLORS.accent }}></div>
                <div className="p-5">
                  <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
                    {s.fullName}
                  </h2>
                  <div className="space-y-2 text-sm">
                    <p style={{ color: COLORS.text }}>
                      <span className="inline-block w-20 font-medium">البريد:</span> {s.email}
                    </p>
                    <p style={{ color: COLORS.text }}>
                      <span className="inline-block w-20 font-medium">المرحلة:</span>
                      <span
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ backgroundColor: `${COLORS.accent}20`, color: COLORS.accent }}
                      >
                        {s.stage}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-16 text-center">
                <p className="text-gray-500 mb-2">لا توجد نتائج للبحث</p>
                <p className="text-sm text-gray-400">جرب تغيير معايير البحث أو الفلترة</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setShowModal(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl bg-white"
          >
            <div className="h-1 w-full" style={{ backgroundColor: COLORS.accent }}></div>
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
              encType="multipart/form-data"
            >
              <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.text }}>
                إضافة بيانات الطالب
              </h2>

              <Field label="الاسم الكامل">
                <input
                  name="fullName"
                  type="text"
                  required
                  className="w-full py-3 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                  placeholder="أدخل الاسم الكامل"
                />
              </Field>

              <Field label="البريد الإلكتروني">
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full py-3 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                  placeholder="example@school.com"
                />
              </Field>

              <Field label="كلمة المرور">
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full py-3 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                  placeholder="••••••••"
                />
              </Field>

              <Field label="الجنس">
                <div className="flex items-center space-x-6 space-x-reverse">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="ذكر"
                      defaultChecked
                      className="form-radio"
                      style={{ color: COLORS.accent }}
                    />
                    <span className="mr-2">ذكر</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="أنثى"
                      className="form-radio"
                      style={{ color: COLORS.accent }}
                    />
                    <span className="mr-2">أنثى</span>
                  </label>
                </div>
              </Field>

              <Field label="المرحلة الدراسية">
                <select
                  name="stage"
                  required
                  className="w-full py-3 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                >
                  <option value="">-- اختر المرحلة --</option>
                  <option value="الابتدائية">الابتدائية</option>
                  <option value="الإعدادية">الإعدادية</option>
                  <option value="الثانوية">الثانوية</option>
                </select>
              </Field>

              <Field label="كشف العلامات (PDF أو صورة)">
                <div className="border border-dashed rounded-lg p-4" style={{ borderColor: COLORS.border }}>
                  <input name="transcript" type="file" accept=".pdf,image/*" required />
                </div>
              </Field>

              <Field label="شهادة الميلاد (PDF أو صورة)">
                <div className="border border-dashed rounded-lg p-4" style={{ borderColor: COLORS.border }}>
                  <input name="birthCert" type="file" accept=".pdf,image/*" required />
                </div>
              </Field>

              <Field label="صورة شخصية (PDF أو صورة)">
                <div className="border border-dashed rounded-lg p-4" style={{ borderColor: COLORS.border }}>
                  <input name="photo" type="file" accept=".pdf,image/*" required />
                </div>
              </Field>

              <div className="flex justify-between pt-4 border-t" style={{ borderColor: COLORS.border }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="py-2 px-5 rounded-lg border font-medium transition-colors hover:bg-gray-50"
                  style={{ borderColor: COLORS.border, color: COLORS.text }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="py-2 px-6 rounded-lg font-medium text-white transition-colors"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  تأكيد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
