import { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/contact",
        formData
      );
      console.log(formData);

      Swal.fire({
        icon: "success",
        title: "!تم الإرسال",
        text: "تم إرسال رسالتك بنجاح",
        confirmButtonColor: "#B17457",
      });
      setFormData({ name: "", email: "", message: "" }); 
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "!عذراً",
        text: error.response ? error.response.data.error : "حدث خطأ ما.",
        confirmButtonColor: "#B17457",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#FAF7F0] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#4A4947] mb-3">تواصل معنا</h1>
          <div className="w-24 h-1 bg-[#B17457] mx-auto mb-3"></div>
          <p className="text-[#4A4947] max-w-lg mx-auto">نحن هنا لمساعدتك والإجابة على استفساراتك</p>
        </div>

        <div className="flex flex-wrap gap-8 md:flex-nowrap">
          <div className="flex-1 bg-white p-8 rounded-lg shadow-md border-t-4 border-[#B17457] transition-all hover:shadow-lg">
            <h2 className="text-2xl font-bold text-[#4A4947] mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#D8D2C2] flex items-center justify-center mr-3">
                <FaEnvelope className="text-[#B17457] text-sm" />
              </span>
              تواصل معنا
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#4A4947] mb-1">الاسم</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="أدخل اسمك"
                  className="w-full p-3 border border-[#D8D2C2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B17457] focus:border-transparent bg-[#FAF7F0] text-[#4A4947] transition-all"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#4A4947] mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  className="w-full p-3 border border-[#D8D2C2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B17457] focus:border-transparent bg-[#FAF7F0] text-[#4A4947] transition-all"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#4A4947] mb-1">رسالتك</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="أدخل رسالتك"
                  rows="5"
                  className="w-full p-3 border border-[#D8D2C2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B17457] focus:border-transparent bg-[#FAF7F0] text-[#4A4947] transition-all"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#B17457] text-white py-3 px-4 rounded-md hover:bg-[#D8D2C2] hover:text-[#4A4947] transition-all duration-300 font-medium flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الإرسال...
                  </>
                ) : (
                  "إرسال الرسالة"
                )}
              </button>
            </form>
          </div>

          <div className="flex-1">
            <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-[#B17457] mb-8 transition-all hover:shadow-lg">
              <h2 className="text-2xl font-bold text-[#4A4947] mb-6 flex items-center">
                <span className="w-8 h-8 rounded-full bg-[#D8D2C2] flex items-center justify-center mr-3">
                  <FaMapMarkerAlt className="text-[#B17457] text-sm" />
                </span>
                معلومات التواصل
              </h2>
              <ul className="space-y-4 text-[#4A4947]">
                <li className="flex items-center p-3 rounded-md hover:bg-[#FAF7F0] transition-all">
                  <div className="w-10 h-10 rounded-full bg-[#D8D2C2] flex items-center justify-center mr-4">
                    <FaMapMarkerAlt className="text-[#B17457]" />
                  </div>
                  <div>
                    <p className="font-medium">العنوان</p>
                    <p className="text-sm text-gray-600">123، عمان، الأردن</p>
                  </div>
                </li>
                <li className="flex items-center p-3 rounded-md hover:bg-[#FAF7F0] transition-all">
                  <div className="w-10 h-10 rounded-full bg-[#D8D2C2] flex items-center justify-center mr-4">
                    <FaPhone className="text-[#B17457]" />
                  </div>
                  <div>
                    <p className="font-medium">الهاتف</p>
                    <p className="text-sm text-gray-600">+962 781 373 708</p>
                  </div>
                </li>
                <li className="flex items-center p-3 rounded-md hover:bg-[#FAF7F0] transition-all">
                  <div className="w-10 h-10 rounded-full bg-[#D8D2C2] flex items-center justify-center mr-4">
                    <FaEnvelope className="text-[#B17457]" />
                  </div>
                  <div>
                    <p className="font-medium">البريد الإلكتروني</p>
                    <p className="text-sm text-gray-600">belalkh274@gmail.com</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-[#B17457] transition-all hover:shadow-lg">
              <h2 className="text-2xl font-bold text-[#4A4947] mb-6">تابعنا على</h2>
              <div className="flex justify-between">
                <a href="" className="w-12 h-12 rounded-full bg-[#D8D2C2] flex items-center justify-center hover:bg-[#B17457] transition-all group">
                  <FaFacebookF className="text-[#B17457] group-hover:text-white" />
                </a>
                <a href="" className="w-12 h-12 rounded-full bg-[#D8D2C2] flex items-center justify-center hover:bg-[#B17457] transition-all group">
                  <FaTwitter className="text-[#B17457] group-hover:text-white" />
                </a>
                <a href="" className="w-12 h-12 rounded-full bg-[#D8D2C2] flex items-center justify-center hover:bg-[#B17457] transition-all group">
                  <FaInstagram className="text-[#B17457] group-hover:text-white" />
                </a>
                <a href="" className="w-12 h-12 rounded-full bg-[#D8D2C2] flex items-center justify-center hover:bg-[#B17457] transition-all group">
                  <FaLinkedinIn className="text-[#B17457] group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;