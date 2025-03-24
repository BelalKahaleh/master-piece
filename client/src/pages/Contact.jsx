import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        Swal.fire({
          title: 'Success!',
          text: 'Your message has been sent successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          background: '#FAF7F0',
          color: '#4A4947',
          confirmButtonColor: '#B17457',
        });

        // Clear the form fields after successful submission
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again later.');
      Swal.fire({
        title: 'Error!',
        text: 'There was a problem sending your message.',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#FAF7F0',
        color: '#4A4947',
        confirmButtonColor: '#B17457',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF7F0] min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Heading section with decorative elements */}
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl font-bold text-[#4A4947] mb-2">Get in Touch</h1>
          <p className="text-[#4A4947]/80 max-w-lg mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
          <div className="absolute left-1/2 -translate-x-1/2 w-24 h-1 bg-[#B17457] mt-4"></div>
        </div>

        {/* Contact form card */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Top decorative bar */}
          <div className="h-2 bg-[#B17457]"></div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#4A4947]">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#FAF7F0] border border-[#D8D2C2] rounded-md focus:ring-2 focus:ring-[#B17457]/50 focus:border-[#B17457] transition-all duration-200"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#4A4947]">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#FAF7F0] border border-[#D8D2C2] rounded-md focus:ring-2 focus:ring-[#B17457]/50 focus:border-[#B17457] transition-all duration-200"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#4A4947]">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#FAF7F0] border border-[#D8D2C2] rounded-md focus:ring-2 focus:ring-[#B17457]/50 focus:border-[#B17457] transition-all duration-200 min-h-[150px] resize-y"
                  placeholder="How can we help you today?"
                  required
                ></textarea>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 px-6 bg-[#B17457] hover:bg-[#B17457]/90 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Message...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact information below form */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#D8D2C2] rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4A4947]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#4A4947]">Email Us</h3>
            <p className="text-[#4A4947]/80 mt-2">contact@example.com</p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#D8D2C2] rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4A4947]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#4A4947]">Call Us</h3>
            <p className="text-[#4A4947]/80 mt-2">(123) 456-7890</p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#D8D2C2] rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4A4947]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#4A4947]">Visit Us</h3>
            <p className="text-[#4A4947]/80 mt-2">123 Business Ave, Suite 100</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
