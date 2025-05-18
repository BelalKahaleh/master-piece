  // return (
  //   <div className="min-h-screen bg-[#FAF7F0]" dir="rtl">
  //     <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 lg:mr-64">
  //       {/* Header */}
  //       <div className="md:flex md:items-center md:justify-between mb-8">
  //         <div className="flex-1 min-w-0">
  //           <h2 className="text-3xl font-bold leading-7 text-[#4A4947] sm:text-4xl sm:truncate">
  //             إدارة المعلمين
  //           </h2>
  //         </div>
  //       </div>

  //       {/* Main Content */}
  //       <div className="bg-white rounded-2xl shadow-sm border border-[#D8D2C2] overflow-hidden">
  //         <div className="px-6 py-8">
  //           <div className="max-w-3xl mx-auto">
  //             <h3 className="text-xl font-semibold text-[#4A4947] mb-6">إضافة معلم جديد</h3>
              
  //             <form onSubmit={handleSubmit} className="space-y-6">
  //               {/* Personal Information */}
  //               <div className="bg-[#FAF7F0] rounded-lg p-6 border border-[#D8D2C2]">
  //                 <h4 className="text-lg font-medium text-[#4A4947] mb-4">المعلومات الشخصية</h4>
  //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //                   <div>
  //                     <label className="block text-sm font-medium text-[#4A4947] mb-2">
  //                       الاسم الكامل
  //                     </label>
  //                     <input
  //                       type="text"
  //                       name="fullName"
  //                       value={formData.fullName}
  //                       onChange={handleChange}
  //                       className="w-full px-4 py-3 rounded-lg border border-[#D8D2C2] focus:ring-2 focus:ring-[#B17457] focus:border-[#B17457] text-right bg-white"
  //                       required
  //                     />
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-[#4A4947] mb-2">
  //                       البريد الإلكتروني
  //                     </label>
  //                     <input
  //                       type="email"
  //                       name="email"
  //                       value={formData.email}
  //                       onChange={handleChange}
  //                       className="w-full px-4 py-3 rounded-lg border border-[#D8D2C2] focus:ring-2 focus:ring-[#B17457] focus:border-[#B17457] text-right bg-white"
  //                       required
  //                     />
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-[#4A4947] mb-2">
  //                       رقم الهاتف
  //                     </label>
  //                     <input
  //                       type="tel"
  //                       name="phone"
  //                       value={formData.phone}
  //                       onChange={handleChange}
  //                       className="w-full px-4 py-3 rounded-lg border border-[#D8D2C2] focus:ring-2 focus:ring-[#B17457] focus:border-[#B17457] text-right bg-white"
  //                       required
  //                     />
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-[#4A4947] mb-2">
  //                       التخصص
  //                     </label>
  //                     <input
  //                       type="text"
  //                       name="specialization"
  //                       value={formData.specialization}
  //                       onChange={handleChange}
  //                       className="w-full px-4 py-3 rounded-lg border border-[#D8D2C2] focus:ring-2 focus:ring-[#B17457] focus:border-[#B17457] text-right bg-white"
  //                       required
  //                     />
  //                   </div>
  //                 </div>
  //               </div>

  //               {/* Account Information */}
  //               <div className="bg-[#FAF7F0] rounded-lg p-6 border border-[#D8D2C2]">
  //                 <h4 className="text-lg font-medium text-[#4A4947] mb-4">معلومات الحساب</h4>
  //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //                   <div>
  //                     <label className="block text-sm font-medium text-[#4A4947] mb-2">
  //                       كلمة المرور
  //                     </label>
  //                     <input
  //                       type="password"
  //                       name="password"
  //                       value={formData.password}
  //                       onChange={handleChange}
  //                       className="w-full px-4 py-3 rounded-lg border border-[#D8D2C2] focus:ring-2 focus:ring-[#B17457] focus:border-[#B17457] text-right bg-white"
  //                       required
  //                     />
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-[#4A4947] mb-2">
  //                       تأكيد كلمة المرور
  //                     </label>
  //                     <input
  //                       type="password"
  //                       name="confirmPassword"
  //                       value={formData.confirmPassword}
  //                       onChange={handleChange}
  //                       className="w-full px-4 py-3 rounded-lg border border-[#D8D2C2] focus:ring-2 focus:ring-[#B17457] focus:border-[#B17457] text-right bg-white"
  //                       required
  //                     />
  //                   </div>
  //                 </div>
  //               </div>

  //               {/* Photo Upload */}
  //               <div className="bg-[#FAF7F0] rounded-lg p-6 border border-[#D8D2C2]">
  //                 <h4 className="text-lg font-medium text-[#4A4947] mb-4">الصورة الشخصية</h4>
  //                 <div className="flex items-center space-x-4 space-x-reverse">
  //                   <div className="flex-shrink-0">
  //                     {previewUrl ? (
  //                       <img
  //                         src={previewUrl}
  //                         alt="Preview"
  //                         className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
  //                       />
  //                     ) : (
  //                       <div className="h-24 w-24 rounded-full bg-[#D8D2C2] flex items-center justify-center">
  //                         <UserIcon className="h-12 w-12 text-[#4A4947]" />
  //                       </div>
  //                     )}
  //                   </div>
  //                   <div className="flex-grow">
  //                     <label className="block text-sm font-medium text-[#4A4947] mb-2">
  //                       اختر صورة
  //                     </label>
  //                     <input
  //                       type="file"
  //                       accept="image/*"
  //                       onChange={handlePhotoChange}
  //                       className="hidden"
  //                       id="photo-upload"
  //                     />
  //                     <label
  //                       htmlFor="photo-upload"
  //                       className="inline-flex items-center px-4 py-2 border border-[#D8D2C2] rounded-md shadow-sm text-sm font-medium text-[#4A4947] bg-white hover:bg-[#FAF7F0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B17457] cursor-pointer"
  //                     >
  //                       <PhotoIcon className="ml-2 h-5 w-5 text-[#B17457]" />
  //                       اختر صورة
  //                     </label>
  //                   </div>
  //                 </div>
  //               </div>

  //               {/* Submit Button */}
  //               <div className="flex justify-end">
  //                 <button
  //                   type="submit"
  //                   disabled={loading}
  //                   className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#B17457] hover:bg-[#965c44] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B17457] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
  //                 >
  //                   {loading ? (
  //                     <>
  //                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  //                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  //                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  //                       </svg>
  //                       جاري الحفظ...
  //                     </>
  //                   ) : (
  //                     'حفظ المعلم'
  //                   )}
  //                 </button>
  //               </div>
  //             </form>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Existing Teachers */}
  //       <div className="mt-12">
  //         <h3 className="text-2xl font-bold text-[#4A4947] mb-6">المعلمين الحاليين</h3>
          
  //         {teachers.length === 0 ? (
  //           <div className="text-center py-12">
  //             <div className="rounded-lg bg-white p-12 shadow-sm border border-[#D8D2C2]">
  //               <UserGroupIcon className="mx-auto h-12 w-12 text-[#B17457]" />
  //               <h3 className="mt-2 text-lg font-medium text-[#4A4947]">لا يوجد معلمين</h3>
  //               <p className="mt-1 text-sm text-[#4A4947]">قم بإضافة معلم جديد للبدء</p>
  //             </div>
  //           </div>
  //         ) : (
  //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //             {teachers.map((teacher) => (
  //               <div key={teacher._id} className="bg-white rounded-lg shadow-sm border border-[#D8D2C2] hover:shadow-md transition-shadow duration-200">
  //                 <div className="p-6">
  //                   <div className="flex items-center space-x-4 space-x-reverse">
  //                     {teacher.photo ? (
  //                       <img
  //                         src={`${API_BASE_URL}/uploads/${teacher.photo}`}
  //                         alt={teacher.fullName}
  //                         className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-lg"
  //                       />
  //                     ) : (
  //                       <div className="h-16 w-16 rounded-full bg-[#D8D2C2] flex items-center justify-center">
  //                         <UserIcon className="h-8 w-8 text-[#4A4947]" />
  //                       </div>
  //                     )}
  //                     <div className="flex-1 min-w-0">
  //                       <h4 className="text-lg font-medium text-[#4A4947] truncate">
  //                         {teacher.fullName}
  //                       </h4>
  //                       <p className="text-sm text-[#B17457]">
  //                         {teacher.specialization}
  //                       </p>
  //                       <p className="text-sm text-[#4A4947] truncate">
  //                         {teacher.email}
  //                       </p>
  //                     </div>
  //                     <button
  //                       onClick={() => handleDeleteTeacher(teacher._id)}
  //                       className="text-[#D8D2C2] hover:text-[#B17457] focus:outline-none transition-colors duration-200"
  //                     >
  //                       <TrashIcon className="h-5 w-5" />
  //                     </button>
  //                   </div>
  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // ); 