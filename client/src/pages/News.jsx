// File: src/pages/Admin/News.jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

const COLORS = {
  bg: '#FAF7F0',
  border: '#D8D2C2',
  accent: '#B17457',
  text: '#4A4947',
  lightAccent: 'rgba(177, 116, 87, 0.1)',
  darkAccent: '#9A6249'
}

const API_URL = 'http://localhost:5000/api/news'

const News = () => {
  const [newsList, setNewsList] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    details: '',
    tags: '',
    images: []
  })
  const [detailItem, setDetailItem] = useState(null)
  const [previewImages, setPreviewImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const res = await axios.get(API_URL, { withCredentials: true })
      setNewsList(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error(err)
      setError('لا يمكن تحميل الأخبار')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = e => {
    const { name, value, files } = e.target
    if (name === 'images') {
      setForm(prev => ({ ...prev, images: files }))

      // Generate previews for selected images
      const previews = []
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = e => previews.push(e.target.result)
        reader.readAsDataURL(file)
      })
      setPreviewImages(previews)
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleAdd = async e => {
    e.preventDefault()
    setError('')
    const data = new FormData()
    data.append('title', form.title)
    data.append('details', form.details)
    data.append('tags', form.tags)
    Array.from(form.images).forEach(file => {
      data.append('images', file)
    })
    try {
      await axios.post(API_URL, data, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      await fetchNews()
      resetForm()
    } catch (err) {
      console.error(err)
      setError('خطأ في إضافة خبر')
    }
  }

  const resetForm = () => {
    setForm({ title: '', details: '', tags: '', images: [] })
    setPreviewImages([])
    setShowAdd(false)
  }

  const confirmDelete = id => {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن يتم حذف الخبر نهائياً',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم احذف',
      confirmButtonColor: COLORS.accent,
      cancelButtonText: 'إلغاء',
      background: COLORS.bg,
      iconColor: COLORS.accent
    }).then(res => {
      if (res.isConfirmed) deleteNews(id)
    })
  }

  const deleteNews = async id => {
    setError('')
    try {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true })
      await fetchNews()
    } catch (err) {
      console.error(err)
      setError('خطأ في حذف الخبر')
    }
  }

  const openDetail = item => {
    setDetailItem(item)
    setShowDetail(true)
  }

  const formatDate = dateString => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  // Icon components
  const NewsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke={COLORS.accent} strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  )

  const AddIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )

  const ViewIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={COLORS.accent} strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )

  const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )

  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke={COLORS.text} strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )

  const TagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={COLORS.accent} strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  )

  const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={COLORS.text} strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )

  const FormField = ({ label, children }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.text }}>{label}</label>
      {children}
    </div>
  )

  return (
    <div className="flex" dir="rtl">
      <div className="mr-64 w-full min-h-screen" style={{ backgroundColor: COLORS.bg }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: COLORS.lightAccent }}>
                <NewsIcon />
              </div>
              <h1 className="text-3xl font-bold" style={{ color: COLORS.text }}>الأخبار</h1>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center py-2.5 px-5 rounded-lg text-white transition-all hover:shadow-md"
              style={{ backgroundColor: COLORS.accent }}
            >
              <AddIcon />
              <span className="mr-1.5">إضافة خبر جديد</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* News List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-t-4 border-accent rounded-full animate-spin mx-auto mb-4" style={{ borderTopColor: COLORS.accent }}></div>
              <p style={{ color: COLORS.text }}>جاري تحميل البيانات...</p>
            </div>
          ) : newsList.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: COLORS.lightAccent }}>
                <NewsIcon />
              </div>
              <h3 className="text-xl font-medium mb-2" style={{ color: COLORS.text }}>لا توجد أخبار</h3>
              <p className="text-sm opacity-70 mb-6" style={{ color: COLORS.text }}>لم يتم إضافة أي أخبار حتى الآن</p>
              <button
                onClick={() => setShowAdd(true)}
                className="py-2 px-4 rounded-lg text-white transition-all"
                style={{ backgroundColor: COLORS.accent }}
              >
                إضافة خبر جديد
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {newsList.map(item => (
                <div
                  key={item._id}
                  className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md"
                  style={{ borderColor: COLORS.border }}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg line-clamp-1" style={{ color: COLORS.text }}>
                        {item.title}
                      </h3>
                      {item.createdAt && (
                        <span className="text-xs opacity-60 py-1 px-2 rounded-full" style={{ backgroundColor: COLORS.lightAccent, color: COLORS.text }}>
                          {formatDate(item.createdAt)}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm mb-4 line-clamp-2" style={{ color: COLORS.text }}>
                      {item.details}
                    </p>
                    
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap items-center mb-3">
                        <TagIcon />
                        <div className="mr-1.5 flex flex-wrap gap-1">
                          {item.tags.map((tag, i) => (
                            <span 
                              key={i} 
                              className="text-xs py-0.5 px-2 rounded-full"
                              style={{ backgroundColor: COLORS.lightAccent, color: COLORS.accent }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {Array.isArray(item.images) && item.images.length > 0 && (
                      <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                        <img
                          src={`http://localhost:5000/uploads/${item.images[0]}`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        {item.images.length > 1 && (
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs py-0.5 px-2 rounded-full flex items-center">
                            <ImageIcon />
                            <span className="mr-1">+{item.images.length - 1}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto border-t flex" style={{ borderColor: COLORS.border }}>
                    <button
                      onClick={() => openDetail(item)}
                      className="flex-1 py-2.5 flex items-center justify-center transition-all hover:bg-gray-50"
                      style={{ color: COLORS.accent }}
                    >
                      <ViewIcon />
                      <span className="mr-1.5">عرض</span>
                    </button>
                    <div className="w-px h-auto" style={{ backgroundColor: COLORS.border }}></div>
                    <button
                      onClick={() => confirmDelete(item._id)}
                      className="flex-1 py-2.5 flex items-center justify-center transition-all hover:bg-red-50 text-red-600"
                    >
                      <DeleteIcon />
                      <span className="mr-1.5">حذف</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
 {/* Add Modal */}
 {showAdd && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center"
            onClick={() => setShowAdd(false)}
          >
            <div
              className="bg-white p-6 rounded-lg w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl mb-4" style={{ color: COLORS.text }}>إضافة خبر</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block mb-1" style={{ color: COLORS.text }}>عنوان الخبر</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                    style={{ borderColor: COLORS.border }}
                  />
                </div>
                <div>
                  <label className="block mb-1" style={{ color: COLORS.text }}>تفاصيل الخبر</label>
                  <textarea
                    name="details"
                    value={form.details}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                    style={{ borderColor: COLORS.border }}
                  />
                </div>
                <div>
                  <label className="block mb-1" style={{ color: COLORS.text }}>وسوم</label>
                  <input
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="tag1, tag2"
                    className="w-full border rounded px-3 py-2"
                    style={{ borderColor: COLORS.border }}
                  />
                </div>
                <div>
                  <label className="block mb-1" style={{ color: COLORS.text }}>صور الخبر</label>
                  <input
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="py-2 px-4 rounded border"
                    style={{ borderColor: COLORS.border, color: COLORS.text }}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 rounded text-white"
                    style={{ backgroundColor: COLORS.accent }}
                  >
                    حفظ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetail && detailItem && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetail(false)}
          >
            <div
              className="bg-white rounded-xl w-full max-w-3xl overflow-hidden"
              style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-4 left-4 z-10">
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                >
                  <CloseIcon />
                </button>
              </div>
              
              {Array.isArray(detailItem.images) && detailItem.images.length > 0 && (
                <div className="w-full h-64">
                  <img
                    src={`http://localhost:5000/uploads/${detailItem.images[0]}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3" style={{ color: COLORS.text }}>
                  {detailItem.title}
                </h2>
                
                {detailItem.createdAt && (
                  <div className="mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={COLORS.accent} strokeWidth="1.5" className="ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm" style={{ color: COLORS.text }}>
                      تم النشر: {formatDate(detailItem.createdAt)}
                    </span>
                  </div>
                )}
                
                <div 
                  className="mb-6 p-4 rounded-lg"
                  style={{ backgroundColor: COLORS.bg, color: COLORS.text }}
                >
                  <p className="whitespace-pre-line">{detailItem.details}</p>
                </div>
                
                {detailItem.tags && detailItem.tags.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <TagIcon />
                      <span className="mr-1.5 font-medium" style={{ color: COLORS.text }}>الوسوم:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {detailItem.tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="text-sm py-1 px-3 rounded-full"
                          style={{ backgroundColor: COLORS.lightAccent, color: COLORS.accent }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {Array.isArray(detailItem.images) && detailItem.images.length > 1 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-3" style={{ color: COLORS.text }}>صور الخبر:</h4>
                    <div className="grid grid-cols-4 gap-3">
                      {detailItem.images.map((img, i) => (
                        <div key={i} className="aspect-square rounded-lg overflow-hidden shadow-sm">
                          <img
                            src={`http://localhost:5000/uploads/${img}`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: COLORS.border }}>
                  <button
                    onClick={() => confirmDelete(detailItem._id)}
                    className="py-2 px-4 rounded-lg flex items-center text-red-600 hover:bg-red-50 transition-all"
                  >
                    <DeleteIcon />
                    <span className="mr-1.5">حذف الخبر</span>
                  </button>
                  
                  <button
                    onClick={() => setShowDetail(false)}
                    className="py-2.5 px-5 rounded-lg text-white transition-all hover:shadow-md"
                    style={{ backgroundColor: COLORS.accent }}
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default News