import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentForm = () => {
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [birthCertificate, setBirthCertificate] = useState(null);
  const [marks, setMarks] = useState('');
  const [studentPicture, setStudentPicture] = useState(null);
  const [marksCertificate, setMarksCertificate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [previewUrl, setPreviewUrl] = useState(null);

  // In your studentForm.jsx, you can make the marks optional
const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const formData = new FormData();
    formData.append('studentName', studentName);
    formData.append('email', email);
    formData.append('gender', gender);
    formData.append('educationLevel', educationLevel);
    formData.append('marks', marks || ''); // Optional marks field
    formData.append('birthCertificate', birthCertificate);
    formData.append('studentPicture', studentPicture);
    formData.append('marksCertificate', marksCertificate);
  
    console.log('FormData being sent:', formData);
  
    try {
      const response = await axios.post('http://localhost:5000/api/register-student', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 201) {
        setStep(3); // Success step
        toast.success('تم تسجيل الطالب بنجاح');
      } else {
        toast.error('فشل تسجيل الطالب');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ ما!');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleMarksCertificateChange = (e) => {
    const file = e.target.files[0];
    console.log('Marks Certificate file selected:', file);
    setMarksCertificate(file);
  };
  
  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    console.log('Student Picture file selected:', file);
    setStudentPicture(file);
  };
  

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const resetForm = () => {
    setStep(1);
    setStudentName('');
    setEmail('');
    setGender('');
    setEducationLevel('');
    setBirthCertificate(null);
    setStudentPicture(null);
    setMarksCertificate(null);
    setPreviewUrl(null);
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[#B17457] text-white' : 'bg-[#D8D2C2] text-[#4A4947]'}`}>1</div>
        <div className={`w-16 h-1 ${step >= 2 ? 'bg-[#B17457]' : 'bg-[#D8D2C2]'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[#B17457] text-white' : 'bg-[#D8D2C2] text-[#4A4947]'}`}>2</div>
        <div className={`w-16 h-1 ${step >= 3 ? 'bg-[#B17457]' : 'bg-[#D8D2C2]'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-[#B17457] text-white' : 'bg-[#D8D2C2] text-[#4A4947]'}`}>3</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden" dir="rtl">
        {/* Header with decorative element */}
        <div className="bg-[#B17457] h-4 w-full"></div>
        <div className="bg-[#D8D2C2] p-6 text-center relative">
          <div className="absolute left-0 top-0 w-24 h-24 bg-[#B17457] opacity-20 rounded-br-full"></div>
          <h1 className="text-3xl font-bold text-[#4A4947]">تسجيل طالب جديد</h1>
          <p className="text-sm text-[#4A4947] mt-2">أدخل بيانات الطالب بدقة للتسجيل في المدرسة</p>
          {renderStepIndicator()}
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="mb-6">
                <label htmlFor="studentName" className="block text-sm font-medium text-[#4A4947] mb-2">اسم الطالب</label>
                <input
                  type="text"
                  id="studentName"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full p-4 border border-[#D8D2C2] rounded-lg bg-[#FAF7F0] text-[#4A4947] focus:outline-none focus:ring-2 focus:ring-[#B17457]"
                  placeholder="أدخل الاسم الكامل للطالب"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-[#4A4947] mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 border border-[#D8D2C2] rounded-lg bg-[#FAF7F0] text-[#4A4947] focus:outline-none focus:ring-2 focus:ring-[#B17457]"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#4A4947] mb-2">الجنس</label>
                <div className="flex space-x-4 space-x-reverse mt-2">
                  <label className="flex items-center p-4 border border-[#D8D2C2] rounded-lg bg-[#FAF7F0] cursor-pointer transition-all duration-300 hover:bg-[#D8D2C2] w-1/2 justify-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      onChange={(e) => setGender(e.target.value)}
                      checked={gender === 'male'}
                      className="hidden"
                    />
                    <div className={`w-4 h-4 rounded-full border ${gender === 'male' ? 'border-[#B17457] bg-[#B17457]' : 'border-[#4A4947]'} mr-2`}></div>
                    <span>ذكر</span>
                  </label>
                  <label className="flex items-center p-4 border border-[#D8D2C2] rounded-lg bg-[#FAF7F0] cursor-pointer transition-all duration-300 hover:bg-[#D8D2C2] w-1/2 justify-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      onChange={(e) => setGender(e.target.value)}
                      checked={gender === 'female'}
                      className="hidden"
                    />
                    <div className={`w-4 h-4 rounded-full border ${gender === 'female' ? 'border-[#B17457] bg-[#B17457]' : 'border-[#4A4947]'} mr-2`}></div>
                    <span>أنثى</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="educationLevel" className="block text-sm font-medium text-[#4A4947] mb-2">المرحلة الدراسية</label>
                <div className="relative">
                  <select
                    id="educationLevel"
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full p-4 border border-[#D8D2C2] rounded-lg bg-[#FAF7F0] text-[#4A4947] focus:outline-none focus:ring-2 focus:ring-[#B17457] appearance-none"
                    required
                  >
                    <option value="">اختر المرحلة الدراسية</option>
                    <option value="first">الصف الأول</option>
                    <option value="second">الصف الثاني</option>
                    <option value="third">الصف الثالث</option>
                    <option value="fourth">الصف الرابع</option>
                    <option value="fifth">الصف الخامس</option>
                    <option value="sixth">الصف السادس</option>
                    <option value="seventh">الصف السابع</option>
                    <option value="eighth">الصف الثامن</option>
                    <option value="ninth">الصف التاسع</option>
                    <option value="tenth">الصف العاشر</option>
                    <option value="eleventh_science">الصف الأول الثانوي علمي</option>
                    <option value="eleventh_arts">الصف الأول الثانوي أدبي</option>
                    <option value="twelfth_science">الصف الثاني الثانوي علمي</option>
                    <option value="twelfth_arts">الصف الثاني الثانوي أدبي</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-[#B17457]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={nextStep}
                  className="py-3 px-8 bg-[#B17457] text-white font-semibold rounded-lg hover:bg-[#4A4947] transition-all duration-300 flex items-center"
                >
                  التالي
                  <svg className="w-5 h-5 mr-2 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6 col-span-1">
                  <div className="mb-6">
                    <label htmlFor="birthCertificate" className="block text-sm font-medium text-[#4A4947] mb-2">شهادة الميلاد</label>
                    <div className="p-4 border border-dashed border-[#D8D2C2] rounded-lg bg-[#FAF7F0] text-center">
                      <input
                        type="file"
                        id="birthCertificate"
                        onChange={(e) => setBirthCertificate(e.target.files[0])}
                        className="hidden"
                        required
                      />
                      <label htmlFor="birthCertificate" className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-10 h-10 text-[#B17457]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          <span className="mt-2 text-sm text-[#4A4947]">{birthCertificate ? birthCertificate.name : 'انقر لرفع شهادة الميلاد'}</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="marksCertificate" className="block text-sm font-medium text-[#4A4947] mb-2">كشف العلامات (PDF أو صورة)</label>
                    <div className="p-4 border border-dashed border-[#D8D2C2] rounded-lg bg-[#FAF7F0] text-center">
                      <input
                        type="file"
                        id="marksCertificate"
                        onChange={handleMarksCertificateChange}
                        className="hidden"
                        required
                      />
                      <label htmlFor="marksCertificate" className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-10 h-10 text-[#B17457]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          <span className="mt-2 text-sm text-[#4A4947]">{marksCertificate ? marksCertificate.name : 'انقر لرفع كشف العلامات'}</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="mb-6">
                    <label htmlFor="studentPicture" className="block text-sm font-medium text-[#4A4947] mb-2">صورة الطالب</label>
                    <div className="p-4 border border-dashed border-[#D8D2C2] rounded-lg bg-[#FAF7F0] text-center h-64 flex flex-col items-center justify-center">
                      {previewUrl ? (
                        <div className="relative w-full h-full">
                          <img src={previewUrl} alt="Student Preview" className="w-full h-full object-contain rounded" />
                          <button 
                            onClick={() => {setPreviewUrl(null); setStudentPicture(null);}}
                            className="absolute top-2 right-2 bg-[#4A4947] text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >×</button>
                        </div>
                      ) : (
                        <>
                          <input
                            type="file"
                            id="studentPicture"
                            onChange={handlePictureChange}
                            className="hidden"
                            accept="image/*"
                            required
                          />
                          <label htmlFor="studentPicture" className="cursor-pointer">
                            <div className="flex flex-col items-center justify-center">
                              <svg className="w-16 h-16 text-[#B17457]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                              </svg>
                              <span className="mt-4 text-sm text-[#4A4947]">انقر لرفع صورة الطالب</span>
                            </div>
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="py-3 px-8 bg-[#D8D2C2] text-[#4A4947] font-semibold rounded-lg hover:bg-[#FAF7F0] transition-all duration-300 flex items-center"
                >
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  السابق
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`py-3 px-8 bg-[#B17457] text-white font-semibold rounded-lg hover:bg-[#4A4947] transition-all duration-300 flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'جاري التسجيل...' : 'إرسال الطلب '}
                  {!isSubmitting && (
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </button>
              </div>
            </form>
          )}

          <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
        </div>

      </div>
    </div>
  );
};

export default StudentForm;
