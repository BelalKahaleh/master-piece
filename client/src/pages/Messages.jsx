// File: src/pages/Messages.jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { X, Mail, Eye, ArrowLeft } from 'lucide-react'
import { toast } from 'react-hot-toast'
import SidebarAdmin from '../components/SidebarAdmin'

const API = 'http://localhost:5000/api/contact'

const Messages = () => {
  const [list, setList] = useState([])
  const [filter, setFilter] = useState('all')
  const [detail, setDetail] = useState(null)
  const [reply, setReply] = useState('')
  const [showReply, setShowReply] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const response = await axios.get(API, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setList(response.data)
    } catch (error) {
      console.error('Error fetching messages:', error)
      if (error.response) {
        console.error('Error response:', error.response.data)
        console.error('Error status:', error.response.status)
      }
      toast.error('فشل في تحميل الرسائل')
    }
  }

  const toggleRead = async (id, read) => {
    try {
      await axios.patch(
        `${API}/${id}/read`,
        { read },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
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
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
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

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'هل أنت متأكد؟',
        text: 'لا يمكن التراجع عن حذف الرسالة!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#B17457',
        cancelButtonColor: '#D8D2C2',
        confirmButtonText: 'نعم، احذف الرسالة',
        cancelButtonText: 'إلغاء',
        reverseButtons: true
      })

      if (result.isConfirmed) {
        const response = await axios.delete(`${API}/${id}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        setList(prevList => prevList.filter(message => message._id !== id))
        
        Swal.fire({
          title: 'تم الحذف!',
          text: 'تم حذف الرسالة بنجاح',
          icon: 'success',
          confirmButtonColor: '#B17457'
        })
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      if (error.response) {
        console.error('Error response:', error.response.data)
        console.error('Error status:', error.response.status)
      }
      
      Swal.fire({
        title: 'خطأ!',
        text: error.response?.data?.message || 'فشل في حذف الرسالة',
        icon: 'error',
        confirmButtonColor: '#B17457'
      })
    }
  }

  return (
    <div className="flex min-h-screen bg-[#FAF7F0]" dir="rtl">
      {/* Hamburger button for mobile */}
      <button
        className="fixed top-4 right-4 z-50 p-2 bg-[#B17457] text-white rounded lg:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Sidebar */}
      <SidebarAdmin sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Main Content */}
      <div className="flex-1 p-2 sm:p-4 md:p-6">
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openDetail(m)}
                      className="p-2 rounded hover:bg-[#FAF7F0] text-[#B17457]"
                      title="عرض التفاصيل"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(m._id)}
                      className="p-2 rounded hover:bg-red-50 text-red-600"
                      title="حذف الرسالة"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-[#4A4947] text-sm">
                  <Mail className="inline-block ml-1" size={16} />
                  {m.email}
                </div>
                <div className="mt-2 text-[#4A4947] text-sm">
                  {m.message}
                </div>
              </div>
            ))
          )}
        </div>
        {/* Detail Modal (no reply button) */}
        {detail && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setDetail(null)}>
            <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-xl border border-[#D8D2C2]" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center p-4 border-b border-[#D8D2C2]">
                <h2 className="text-xl font-bold text-[#4A4947]">تفاصيل الرسالة</h2>
                <button onClick={() => setDetail(null)} className="p-2 rounded hover:bg-[#FAF7F0]">
                  <X size={22} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center text-[#4A4947]">
                  <Mail className="inline-block ml-2" size={18} />
                  <span className="font-medium">{detail.email}</span>
                </div>
                <div className="text-[#4A4947]">
                  <span className="font-medium">الاسم:</span> {detail.name}
                </div>
                <div className="text-[#4A4947]">
                  <span className="font-medium">الرسالة:</span>
                  <div className="mt-2 bg-[#FAF7F0] p-4 rounded-lg border border-[#D8D2C2]">
                    {detail.message}
                  </div>
                </div>
                <div className="text-[#4A4947]">
                  <span className="font-medium">تاريخ الإرسال:</span> {new Date(detail.createdAt).toLocaleString('ar-SA')}
                </div>
              </div>
              <div className="flex justify-end p-4 border-t border-[#D8D2C2]">
                <button onClick={() => setDetail(null)} className="py-2 px-6 rounded-lg font-medium text-white transition-colors" style={{ backgroundColor: '#B17457' }}>
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Messages
