import React, { useState, useEffect } from 'react';

const COLORS = {
  bg:     '#FAF7F0',
  border: '#D8D2C2',
  accent: '#B17457',
  text:   '#4A4947'
};

const API = 'http://localhost:5000/api/teachers';

const Teachers = () => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [spec, setSpec] = useState('');
  const [showModal, setShow] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    specialization: '',
    resume: null,
    photo: null
  });
  
  const specs = [
    'عربي','انجليزي','رياضيات','علوم','رياضة',
    'كيمياء','فيزياء','علوم ارض','احياء',
    'تربية اسلامية','اجتماعيات','تاريخ الاردن','جغرافيا'
  ];

  useEffect(() => { fetchList() }, [search, spec]);

  const fetchList = async () => {
    try {
      const res = await fetch(`${API}?search=${search}&specialization=${spec}`, {
        credentials: 'include'
      });
      const data = await res.json();
      setList(data);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    }
  };

  const handleInput = e => {
    const { name, value, files } = e.target;
    if (files) setForm(f => ({ ...f, [name]: files[0] }));
    else setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k,v]) => v != null && data.append(k,v));
    
    try {
      await fetch(API, {
        method: 'POST',
        body: data,
        credentials: 'include'
      });
      
      setShow(false);
      setForm({
        fullName: '', email: '', password: '', specialization: '',
        resume: null, photo: null
      });
      fetchList();
    } catch (error) {
      console.error("Failed to add teacher:", error);
    }
  };

  return (
    <div className="flex" dir="rtl">
      <div
        className="mr-64 w-full min-h-screen overflow-auto"
        style={{ backgroundColor: COLORS.bg }}
      >
        <div className="p-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold" style={{ color: COLORS.text }}>
              الأساتذة
            </h1>
            <button
              onClick={() => setShow(true)}
              className="py-2 px-5 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-shadow duration-300"
              style={{ backgroundColor: COLORS.accent }}
            >
              اضافة استاذ
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="ابحث بالاسم أو البريد"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="py-3 px-4 rounded-lg border shadow-sm flex-grow focus:ring-2 focus:outline-none"
              style={{ 
                borderColor: COLORS.border, 
                color: COLORS.text,
                backgroundColor: 'white' 
              }}
            />
            <select
              value={spec}
              onChange={e => setSpec(e.target.value)}
              className="py-3 px-4 rounded-lg border shadow-sm focus:ring-2 focus:outline-none"
              style={{ 
                borderColor: COLORS.border, 
                color: COLORS.text,
                backgroundColor: 'white' 
              }}
            >
              <option value="">جميع التخصصات</option>
              {specs.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Teacher List */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map(t => (
              <div
                key={t._id}
                className="p-5 bg-white rounded-lg shadow-md border transform transition-transform duration-300 hover:shadow-lg"
                style={{ borderColor: COLORS.border }}
              >
                <h2 className="text-lg font-semibold mb-2" style={{ color: COLORS.text }}>
                  {t.fullName}
                </h2>
                <p className="mb-1 font-medium" style={{ color: COLORS.accent }}>{t.specialization}</p>
                <p className="text-sm" style={{ color: COLORS.text }}>{t.email}</p>
              </div>
            ))}
          </div>
          
          {list.length === 0 && (
            <div className="text-center py-8 text-lg" style={{ color: COLORS.text }}>
              لا توجد نتائج
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShow(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl"
            style={{ borderColor: COLORS.border }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl mb-6 font-bold" style={{ color: COLORS.text }}>
              إضافة أستاذ جديد
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium" style={{ color: COLORS.text }}>
                  اسم الاستاذ الكامل
                </label>
                <input
                  name="fullName"
                  required
                  value={form.fullName}
                  onChange={handleInput}
                  className="w-full py-2 px-3 border rounded focus:ring-2 focus:outline-none"
                  style={{ borderColor: COLORS.border, color: COLORS.text }}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium" style={{ color: COLORS.text }}>
                  كلمة السر
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleInput}
                  className="w-full py-2 px-3 border rounded focus:ring-2 focus:outline-none"
                  style={{ borderColor: COLORS.border, color: COLORS.text }}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium" style={{ color: COLORS.text }}>
                  البريد الالكتروني
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleInput}
                  className="w-full py-2 px-3 border rounded focus:ring-2 focus:outline-none"
                  style={{ borderColor: COLORS.border, color: COLORS.text }}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium" style={{ color: COLORS.text }}>
                  تخصص الاستاذ
                </label>
                <select
                  name="specialization"
                  required
                  value={form.specialization}
                  onChange={handleInput}
                  className="w-full py-2 px-3 border rounded focus:ring-2 focus:outline-none"
                  style={{ borderColor: COLORS.border, color: COLORS.text }}
                >
                  <option value="">-- اختر التخصص --</option>
                  {specs.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium" style={{ color: COLORS.text }}>
                  تحميل السيرة الذاتية
                </label>
                <input
                  name="resume"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleInput}
                  className="w-full py-2"
                  style={{ color: COLORS.text }}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium" style={{ color: COLORS.text }}>
                  صورة شخصية
                </label>
                <input
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleInput}
                  className="w-full py-2"
                  style={{ color: COLORS.text }}
                />
              </div>

              <div className="flex justify-end space-x-reverse space-x-3 pt-4 mt-2 border-t" style={{ borderColor: COLORS.border }}>
                <button
                  type="button"
                  onClick={() => setShow(false)}
                  className="py-2 px-4 rounded border transition-colors duration-300"
                  style={{ borderColor: COLORS.border, color: COLORS.text }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="py-2 px-6 rounded text-white font-medium shadow-sm hover:shadow-md transition-shadow duration-300"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers; 