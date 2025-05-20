import React from 'react';
import { FaFacebook, FaLinkedin, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Footer = () => {
  return (
    <footer className="bg-[#4A4947] text-[#FAF7F0] pt-16 pb-8" dir="rtl">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Site Information */}
          <div className="text-right">
            <h4 className="text-2xl font-bold mb-6 text-[#D8D2C2] border-r-4 border-[#B17457] pr-4"> الحصاد التربوي  </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <FaPhone className="text-[#B17457]" />
                <p className="text-sm" >رقم الهاتف: 00962781373708</p>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <FaMapMarkerAlt className="text-[#B17457] mt-1" />
                <p className="text-sm">الموقع : الاردن ، الزرقاء</p>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-right">
            <h4 className="text-xl font-bold mb-6 text-[#D8D2C2] border-r-4 border-[#B17457] pr-4">روابط سريعة</h4>
            <ul className="space-y-3">
              <li>
                <Link to="studentLogin" className="text-[#FAF7F0] hover:text-[#B17457] transition-colors duration-300 flex items-center">
                  <span className="hover:pr-2 transition-all duration-300">بوابة الطالب</span>
                </Link>
              </li>
              <li>
                <Link to="teacherLogin" className="text-[#FAF7F0] hover:text-[#B17457] transition-colors duration-300 flex items-center">
                  <span className="hover:pr-2 transition-all duration-300">بوابة المعلم</span>
                </Link>
              </li>
              <li>
                <Link to="contact" className="text-[#FAF7F0] hover:text-[#B17457] transition-colors duration-300 flex items-center">
                  <span className="hover:pr-2 transition-all duration-300">تواصل معنا</span>
                </Link>
              </li>
              <li>
                <Link to="about" className="text-[#FAF7F0] hover:text-[#B17457] transition-colors duration-300 flex items-center">
                  <span className="hover:pr-2 transition-all duration-300">حول</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Media Icons */}
          <div className="text-right">
            <h4 className="text-xl font-bold mb-6 text-[#D8D2C2] border-r-4 border-[#B17457] pr-4">تابعنا</h4>
            <div className="grid grid-cols-2 gap-4">
              <Link to="#" className="bg-[#4A4947] hover:bg-[#B17457] text-[#FAF7F0] p-3 rounded-lg transition-colors duration-300 border border-[#D8D2C2] hover:border-transparent flex items-center justify-center group">
                <FaFacebook size={24} className="group-hover:scale-110 transition-transform duration-300" />
              </Link>
              <Link to="#" className="bg-[#4A4947] hover:bg-[#B17457] text-[#FAF7F0] p-3 rounded-lg transition-colors duration-300 border border-[#D8D2C2] hover:border-transparent flex items-center justify-center group">
                <FaLinkedin size={24} className="group-hover:scale-110 transition-transform duration-300" />
              </Link>
              <Link to="#" className="bg-[#4A4947] hover:bg-[#B17457] text-[#FAF7F0] p-3 rounded-lg transition-colors duration-300 border border-[#D8D2C2] hover:border-transparent flex items-center justify-center group">
                <FaTwitter size={24} className="group-hover:scale-110 transition-transform duration-300" />
              </Link>
              <Link to="#" className="bg-[#4A4947] hover:bg-[#B17457] text-[#FAF7F0] p-3 rounded-lg transition-colors duration-300 border border-[#D8D2C2] hover:border-transparent flex items-center justify-center group">
                <FaInstagram size={24} className="group-hover:scale-110 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#B17457] to-transparent my-8"></div>

        {/* Bottom Section: Copyright */}
        <div className="text-center text-sm">
          <p>&copy; {new Date().getFullYear()}  الحصاد التربوي . جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
