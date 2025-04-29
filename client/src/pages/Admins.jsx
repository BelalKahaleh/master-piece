// File: src/pages/Admin/Admins.jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

const COLORS = {
  bg: '#FAF7F0',
  border: '#D8D2C2',
  accent: '#B17457',
  text: '#4A4947',
}

// Base URL for API
const API_URL = 'http://localhost:5000/api/admins'

const Admins = () => {
  const [admins, setAdmins] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(API_URL, { withCredentials: true })
      setAdmins(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error(err)
      setError('لا يمكن تحميل المسؤولين')
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      await axios.post(
        API_URL,
        { fullName, email, password },
        { withCredentials: true }
      )
      await fetchAdmins()
      setFullName('')
      setEmail('')
      setPassword('')
      setShowModal(false)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'خطأ في إنشاء مسؤول')
    }
  }

  const handleDelete = async id => {
    setError('')
    try {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true })
      await fetchAdmins()
    } catch (err) {
      console.error(err)
      setError('خطأ في حذف المسؤول')
    }
  }

  const confirmDelete = id => {
    Swal.fire({
      title: 'هل أنت متأكد من الحذف؟',
      text: 'لن يمكنك التراجع عن هذا الإجراء',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم, احذف',
      cancelButtonText: 'إلغاء',
    }).then(result => {
      if (result.isConfirmed) {
        handleDelete(id)
      }
    })
  }

  const Field = ({ label, children }) => (
    <div className="mb-4">
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: COLORS.text }}
      >
        {label}
      </label>
      {children}
    </div>
  )

  return (
    <div className="flex" dir="rtl">
      <div
        className="mr-64 w-full min-h-screen"
        style={{ backgroundColor: COLORS.bg }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1
              className="text-3xl font-bold"
              style={{ color: COLORS.text }}
            >
              المسؤولون
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="py-2.5 px-6 rounded-lg text-white font-medium transition-all hover:opacity-90"
              style={{
                backgroundColor: COLORS.accent,
                boxShadow: '0 2px 4px rgba(177,116,87,0.3)',
              }}
            >
              + إضافة مسؤول
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {Array.isArray(admins) && admins.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg" style={{ color: COLORS.text }}>
                لا يوجد مسؤولين حالياً
              </p>
              <p
                className="text-sm opacity-70 mt-2"
                style={{ color: COLORS.text }}
              >
                قم بإضافة مسؤول جديد للبدء
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admins.map(admin => (
                <div
                  key={admin._id}
                  className="bg-white p-5 rounded-lg shadow-sm border transition-all hover:shadow"
                  style={{ borderColor: COLORS.border }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3
                      className="font-bold text-lg"
                      style={{ color: COLORS.text }}
                    >
                      {admin.fullName}
                    </h3>
                    <button
                      onClick={() => confirmDelete(admin._id)}
                      className="text-red-500 hover:bg-red-50 p-1 rounded"
                      title="حذف المسؤول"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path
                          fillRule="evenodd"
                          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill={COLORS.accent}
                      viewBox="0 0 16 16"
                      className="ml-2"
                    >
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                    </svg>
                    <span style={{ color: COLORS.text }}>
                      {admin.fullName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill={COLORS.accent}
                      viewBox="0 0 16 16"
                      className="ml-2"
                    >
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                    </svg>
                    <span className="text-sm" style={{ color: COLORS.text }}>
                      {admin.email}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showModal && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl"
              style={{ borderTop: `4px solid ${COLORS.accent}` }}
              onClick={e => e.stopPropagation()}
            >
              <h2
                className="text-2xl mb-6 font-bold"
                style={{ color: COLORS.text }}
              >
                إضافة مسؤول جديد
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="اسم المسؤول الكامل">
                  <input
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    placeholder="أدخل الاسم الكامل"
                    className="w-full py-2.5 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{ borderColor: COLORS.border }}
                  />
                </Field>

                <Field label="البريد الالكتروني">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="example@domain.com"
                    className="w-full py-2.5 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{ borderColor: COLORS.border }}
                  />
                </Field>

                <Field label="كلمة السر">
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="********"
                    className="w-full py-2.5 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{ borderColor: COLORS.border }}
                  />
                </Field>

                <div className="flex justify-end space-x-reverse space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="py-2.5 px-5 rounded-lg border font-medium transition-all hover:bg-gray-50"
                    style={{ borderColor: COLORS.border, color: COLORS.text }}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-lg text-white font-medium transition-all hover:opacity-90"
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
    </div>
  )
}

export default Admins
