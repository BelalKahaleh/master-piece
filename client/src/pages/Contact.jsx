import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Send, User, Mail, MessageSquare, Check, X } from 'lucide-react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Colors from your design
  const primaryColor = '#B17457';
  const textColor = '#4A4947';
  const hoverColor = '#D8D2C2';
  const lightColor = '#F8F6F2';

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'الاسم مطلوب';
    if (!email.trim()) errors.email = 'البريد الإلكتروني مطلوب';
    else if (!validateEmail(email)) errors.email = 'البريد الإلكتروني غير صالح';
    if (!message.trim()) errors.message = 'الرسالة مطلوبة';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Toastify configuration
  const notifySuccess = () => toast.success('تم إرسال الرسالة بنجاح!', {
    position: "top-center",
    icon: <Check size={18} color="white" />,
    style: { background: primaryColor, color: 'white' }
  });
  
  const notifyError = (error) => toast.error(error, {
    position: "top-center",
    icon: <X size={18} color="white" />,
    style: { background: '#e74c3c', color: 'white' }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const isValid = validateForm();
    if (!isValid) {
      notifyError('يرجى تصحيح الأخطاء في النموذج');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setShowSuccessMessage(true);
        notifySuccess();
        setName('');
        setEmail('');
        setMessage('');
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      } else {
        const data = await response.json();
        notifyError(data.message || 'فشل إرسال الرسالة');
      }
    } catch (error) {
      notifyError('خطأ في الخادم الداخلي');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animated input field component
  const AnimatedInput = ({ type, id, label, value, onChange, placeholder, error, icon }) => {
    const isFocused = focused === id;
    
    return (
      <div className="mb-6 relative">
        <label 
          htmlFor={id} 
          className={`block text-sm font-medium transition-all duration-300 ${
            isFocused ? `text-${primaryColor}` : 'text-gray-600'
          }`}
        >
          {label}
        </label>
        
        <div className={`mt-1 relative rounded-lg overflow-hidden transition-all duration-300 ${
          error ? 'ring-2 ring-red-500' : isFocused ? 'ring-2 ring-opacity-50 ring-[#B17457]' : ''
        }`}>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            {icon}
          </div>
          
          {type === 'textarea' ? (
            <textarea
              id={id}
              rows="4"
              className="w-full border border-gray-300 rounded-lg pr-10 pl-4 py-3 text-[#4A4947] focus:outline-none transition-all duration-300"
              value={value}  // Ensure the value is tied to the state variable
              onChange={(e) => onChange(e.target.value)}  // Correctly update state value
              placeholder={placeholder}
              onFocus={() => setFocused(id)}
              onBlur={() => setFocused(null)}
              dir="rtl"
            />
          ) : (
            <input
              type={type}
              id={id}
              className="w-full border border-gray-300 rounded-lg pr-10 pl-4 py-3 text-[#4A4947] focus:outline-none transition-all duration-300"
              value={value}  // Ensure the value is tied to the state variable
              onChange={(e) => onChange(e.target.value)}  // Correctly update state value
              placeholder={placeholder}
              onFocus={() => setFocused(id)}
              onBlur={() => setFocused(null)}
              dir="rtl"
            />
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-500 flex items-center justify-end">
            <X size={14} className="mr-1" /> {error}
          </p>
        )}
      </div>
    );
  };

  // Success message component with animation
  const SuccessMessage = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95 rounded-lg z-10 animate-fadeIn">
      <div className="text-center p-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <Check size={32} className="text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-[#4A4947] mb-2">شكراً لك!</h3>
        <p className="text-gray-600 mb-4">تم استلام رسالتك وسنتواصل معك قريباً</p>
        <button 
          onClick={() => setShowSuccessMessage(false)}
          className="px-4 py-2 bg-[#B17457] text-white rounded-md hover:bg-[#D8D2C2] transition-colors duration-300 flex items-center mx-auto"
        >
          حسناً <Check size={16} className="mr-2" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-lg mx-auto relative" dir="rtl">
      <div className={`bg-white p-8 rounded-lg shadow-lg mt-16 transition-all duration-300 relative overflow-hidden ${
        isSubmitting ? 'opacity-70' : ''
      }`}>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B17457] to-[#D8D2C2]"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-[#F8F6F2] rounded-bl-full opacity-70"></div>
        
        {/* Contact form header */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#F8F6F2] flex items-center justify-center mr-4">
            <MessageSquare size={24} className="text-[#B17457]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#4A4947]">اتصل بنا</h2>
            <p className="text-gray-500 text-sm">نحن هنا للمساعدة والإجابة على أسئلتك</p>
          </div>
        </div>
        
        {/* Contact form */}
        <form onSubmit={handleSubmit}>
          <AnimatedInput 
            type="text"
            id="name"
            label="الاسم"
            value={name}
            onChange={(e) => setName(e)}
            placeholder="اسمك"
            error={formErrors.name}
            icon={<User size={18} className="text-[#B17457]" />}
          />
          
          <AnimatedInput 
            type="email"
            id="email"
            label="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e)}
            placeholder="بريدك الإلكتروني"
            error={formErrors.email}
            icon={<Mail size={18} className="text-[#B17457]" />}
          />
          
          <AnimatedInput 
            type="textarea"
            id="message"
            label="الرسالة"
            value={message}
            onChange={(e) => setMessage(e)}
            placeholder="رسالتك"
            error={formErrors.message}
            icon={<MessageSquare size={18} className="text-[#B17457]" />}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#B17457] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#D8D2C2] focus:outline-none focus:ring-2 focus:ring-[#B17457] focus:ring-opacity-50 transition-all duration-300 flex items-center justify-center ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري الإرسال...
              </span>
            ) : (
              <span className="flex items-center">
                إرسال الرسالة <Send size={16} className="mr-2" />
              </span>
            )}
          </button>
        </form>
        
        {/* Success message overlay */}
        {showSuccessMessage && <SuccessMessage />}
      </div>
      
      {/* Toast container */}
      <ToastContainer 
        position="top-center" 
        autoClose={5000} 
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default Contact;
