import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, List, X } from 'lucide-react';

const COLORS = {
  bg: '#FAF7F0',
  border: '#D8D2C2',
  accent: '#B17457',
  text: '#4A4947',
  lightAccent: 'rgba(177, 116, 87, 0.1)',
  darkAccent: '#9A6249'
};

const API_URL = 'http://localhost:5000/api/news';

const PublicNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage] = useState(6);
  const [totalNews, setTotalNews] = useState(0);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    fetchNews();
  }, [currentPage]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}?page=${currentPage}&limit=${newsPerPage}`);
      setNewsList(Array.isArray(res.data.news) ? res.data.news : []);
      setTotalNews(res.data.totalCount);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('لا يمكن تحميل الأخبار');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const totalPages = Math.ceil(totalNews / newsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-8 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
            الأخبار
          </h1>
          <p className="text-sm opacity-75" style={{ color: COLORS.text }}>
            آخر الأخبار والتحديثات
          </p>
        </div>

        <div className="flex justify-end mb-6 gap-2">
          <button
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'grid' 
                ? 'bg-[#B17457] text-white' 
                : 'bg-[#D8D2C2] text-[#4A4947]'
            }`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <Grid size={20} />
          </button>
          <button
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list' 
                ? 'bg-[#B17457] text-white' 
                : 'bg-[#D8D2C2] text-[#4A4947]'
            }`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <List size={20} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-t-4 border-accent rounded-full animate-spin mx-auto mb-4" style={{ borderTopColor: COLORS.accent }}></div>
            <p style={{ color: COLORS.text }}>جاري تحميل البيانات...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: COLORS.text }}>لا توجد أخبار متاحة</p>
          </div>
        ) : (
          <>
            <div className={
              viewMode === 'grid'
                ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-6'
            }>
              {newsList.map(item => (
                <div
                  key={item._id}
                  className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md border border-[#D8D2C2] ${
                    viewMode === 'list' ? 'flex md:flex-row flex-col items-stretch' : 'flex flex-col'
                  }`}
                >
                  {Array.isArray(item.images) && item.images.length > 0 && (
                    <div className={`${viewMode === 'list' ? 'md:w-48 w-full h-40 md:h-auto' : 'h-48'}`}>
                      <img
                        src={`http://localhost:5000/uploads/news/${item.images[0]}`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/placeholder-image.png'; }}
                      />
                    </div>
                  )}

                  <div className={`p-5 flex-1 flex flex-col ${viewMode === 'list' ? 'justify-between' : ''}`}>
                    <div>
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
                        <div className="flex flex-wrap gap-1">
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
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedNews(item)}
                      className="mt-4 w-full py-2 px-4 rounded-lg text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: COLORS.accent }}
                    >
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="py-2 px-4 rounded border disabled:opacity-50"
                  style={{ borderColor: COLORS.border, color: COLORS.text, backgroundColor: COLORS.bg }}
                >
                  السابق
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`py-2 px-4 rounded border ${
                      currentPage === number ? 'bg-[#B17457] text-white' : ''
                    }`}
                    style={{ 
                      borderColor: COLORS.border, 
                      color: currentPage === number ? 'white' : COLORS.text, 
                      backgroundColor: currentPage === number ? COLORS.accent : COLORS.bg 
                    }}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="py-2 px-4 rounded border disabled:opacity-50"
                  style={{ borderColor: COLORS.border, color: COLORS.text, backgroundColor: COLORS.bg }}
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedNews && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedNews(null)}>
          <div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 left-4 p-2 rounded-full bg-white/80 hover:bg-white transition-all"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            >
              <X size={20} style={{ color: COLORS.text }} />
            </button>

            <div className="p-6">
              {Array.isArray(selectedNews.images) && selectedNews.images.length > 0 && (
                <div className="mb-6">
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <img
                      src={`http://localhost:5000/uploads/news/${selectedNews.images[0]}`}
                      alt={selectedNews.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/placeholder-image.png'; }}
                    />
                  </div>
                  {selectedNews.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {selectedNews.images.slice(1).map((image, index) => (
                        <img
                          key={index}
                          src={`http://localhost:5000/uploads/news/${image}`}
                          alt={`${selectedNews.title} - Image ${index + 2}`}
                          className="w-full h-20 object-cover rounded-lg"
                          onError={(e) => { e.target.src = '/placeholder-image.png'; }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>
                  {selectedNews.title}
                </h2>
                {selectedNews.createdAt && (
                  <p className="text-sm opacity-60" style={{ color: COLORS.text }}>
                    نشر في: {formatDate(selectedNews.createdAt)}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: COLORS.text }}>
                  {selectedNews.details}
                </p>
              </div>

              {selectedNews.tags && selectedNews.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedNews.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="text-sm py-1 px-3 rounded-full"
                      style={{ backgroundColor: COLORS.lightAccent, color: COLORS.accent }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicNews;
