// File: src/pages/Messages.jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { X, Mail, Eye, ArrowLeft } from 'lucide-react'

const API = 'http://localhost:5000/api/contact'

const Messages = () => {
  const [list, setList] = useState([])
  const [filter, setFilter] = useState('all')
  const [detail, setDetail] = useState(null)
  const [reply, setReply] = useState('')
  const [showReply, setShowReply] = useState(false)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const res = await axios.get(API, { withCredentials: true })
      setList(res.data)
    } catch (err) {
      console.error(err)
      Swal.fire('خطأ', 'فشل في جلب الرسائل', 'error')
    }
  }

  const toggleRead = async (id, read) => {
    try {
      await axios.patch(
        `${API}/${id}/read`,
        { read },
        { withCredentials: true }
      )
      fetchAll()
    } catch (err) {
      console.error(err)
      Swal.fire('خطأ', 'فشل في تحديث الحالة', 'error')
    }
  }

  const openDetail = msg => {
    setDetail(msg)
    if (!msg.read) toggleRead(msg._id, true)
  }

  const sendReply = async () => {
    if (!reply.trim()) return
    try {
      await axios.post(
        `${API}/${detail._id}/reply`,
        { reply },
        { withCredentials: true }
      )
      Swal.fire('تم الإرسال', '', 'success')
      setShowReply(false)
      setReply('')
    } catch (err) {
      console.error(err)
      Swal.fire(
        'خطأ في الإرسال',
        err.response?.data?.message || 'يرجى المحاولة لاحقاً',
        'error'
      )
    }
  }

  const filtered =
    filter === 'all'
      ? list
      : list.filter(m => (filter === 'read' ? m.read : !m.read))

  return (
    <div className="flex" dir="rtl">
      <div className="mr-64 w-full min-h-screen overflow-auto bg-[#FAF7F0]">
        <div className="p-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#4A4947] mb-6">الرسائل</h1>

          <div className="flex space-x-2 space-x-reverse mb-6">
            {['all','unread','read'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  filter === f
                    ? 'bg-[#B17457] text-white'
                    : 'bg-[#D8D2C2] text-[#4A4947] hover:bg-opacity-20'
                }`}
              >
                {f === 'all' ? 'الكل' : f === 'unread' ? 'غير مقروءة' : 'مقروءة'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-lg shadow border border-[#D8D2C2]">
                <p className="text-[#4A4947]">لا توجد رسائل</p>
              </div>
            ) : (
              filtered.map(m => (
                <div
                  key={m._id}
                  className={`p-4 rounded-lg shadow border ${
                    m.read ? 'border-[#D8D2C2]' : 'border-[#B17457]'
                  } bg-white`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {!m.read && (
                        <div className="w-2 h-2 bg-[#B17457] rounded-full ml-2"></div>
                      )}
                      <h3 className="font-medium text-[#4A4947]">{m.name}</h3>
                      <span className="mx-2 text-sm text-[#4A4947]">-</span>
                      <span className="text-sm text-[#4A4947]">
                        {new Date(m.createdAt).toLocaleString('ar-SA')}
                      </span>
                    </div>
                    <button
                      onClick={() => openDetail(m)}
                      className="p-2 text-[#B17457] hover:bg-[#FAF7F0] rounded-full transition"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                  <p className="mt-2 text-[#4A4947] line-clamp-1">{m.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {detail && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10"
          onClick={() => setDetail(null)}
        >
          <div
            className="bg-[#FAF7F0] w-full max-w-2xl rounded-lg shadow-lg overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-[#D8D2C2]">
              <h2 className="text-xl font-bold text-[#4A4947]">
                رسالة من {detail.name}
              </h2>
              <button
                onClick={() => setDetail(null)}
                className="p-2 text-[#4A4947] hover:bg-[#D8D2C2] rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm font-medium text-[#4A4947] mb-1">
                البريد الإلكتروني:
              </p>
              <p className="text-[#4A4947] mb-4">{detail.email}</p>

              <p className="text-sm font-medium text-[#4A4947] mb-1">الرسالة:</p>
              <div className="bg-white p-4 rounded-md border border-[#D8D2C2] mb-6">
                <p className="text-[#4A4947] whitespace-pre-wrap">
                  {detail.message}
                </p>
              </div>

              {showReply ? (
                <>
                  <textarea
                    rows={4}
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    className="w-full p-3 rounded-md border border-[#D8D2C2] focus:border-[#B17457] focus:outline-none resize-none"
                    placeholder="اكتب ردك هنا..."
                  />
                  <div className="mt-4 flex space-x-2 space-x-reverse">
                    <button
                      onClick={sendReply}
                      className="flex items-center px-4 py-2 bg-[#B17457] text-white rounded-md font-medium hover:opacity-90 transition"
                    >
                      <Mail size={16} className="ml-2" />
                      إرسال الرد
                    </button>
                    <button
                      onClick={() => setShowReply(false)}
                      className="px-4 py-2 bg-[#D8D2C2] text-[#4A4947] rounded-md font-medium hover:opacity-90 transition"
                    >
                      إلغاء
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-end space-x-2 space-x-reverse">
                  <button
                    onClick={() => setShowReply(true)}
                    className="flex items-center px-4 py-2 bg-[#B17457] text-white rounded-md font-medium hover:opacity-90 transition"
                  >
                    <ArrowLeft size={16} className="ml-2" />
                    رد
                  </button>
                  <button
                    onClick={() => setDetail(null)}
                    className="px-4 py-2 bg-[#D8D2C2] text-[#4A4947] rounded-md font-medium hover:opacity-90 transition"
                  >
                    إغلاق
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Messages
