import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Contact: React.FC = () => {
  const { submitContactMessage } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'installation',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContactMessage(formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', service: 'installation', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const inputClasses = "w-full px-4 py-3 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none shadow-sm placeholder-slate-400";

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Get in Touch</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Ready to upgrade your comfort? Fill out the form below or give us a call. Our team is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl h-fit">
            <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-blue-200 text-sm mb-1 uppercase tracking-wider font-semibold">Call Us</p>
                  <p className="font-semibold text-lg tracking-wide">088660 04475</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-blue-200 text-sm mb-1 uppercase tracking-wider font-semibold">Email Us</p>
                  <p className="font-semibold text-lg tracking-wide break-all">stallionaircon@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-blue-200 text-sm mb-1 uppercase tracking-wider font-semibold">Visit Us</p>
                  <p className="font-semibold text-lg leading-relaxed">
                    C-5/37 Commercial Zone,<br />Ritesh Shopping Center,<br />G.I.D.C Char Rasta, Vapi (G.J.)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-blue-200 text-sm leading-relaxed">
                <strong className="text-white block mb-1">Hours of Operation:</strong>
                Mon - Fri: 9am - 8pm<br />
                Sat: 9am - 8pm
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h3>
            
            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-8 text-center animate-fade-in flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <Send size={32} />
                </div>
                <p className="font-bold text-xl mb-2">Message Sent Successfully!</p>
                <p className="text-green-700">We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="e.g. john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="e.g. +91 88660 04475"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-semibold text-slate-700 mb-2">Service Required</label>
                    <div className="relative">
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className={`${inputClasses} appearance-none cursor-pointer`}
                      >
                        <option value="installation">New Installation</option>
                        <option value="repair">Repair & Fix</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="commercial">Commercial Quote</option>
                        <option value="parts">Spare Parts</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">How can we help?</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className={`${inputClasses} resize-none`}
                    placeholder="Tell us about your issue or requirements..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
           <div className="flex items-center gap-3 mb-4 px-2">
             <MapPin className="text-blue-600" />
             <h3 className="text-xl font-bold text-slate-900">Find Us on the Map</h3>
           </div>
           <div className="w-full h-96 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
             <iframe 
                src="https://maps.google.com/maps?q=Ritesh+Shopping+Center,+GIDC,+Vapi&hl=en&z=17&output=embed" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Stallion Air Con Location"
                className="filter grayscale-[20%] hover:grayscale-0 transition-all duration-500"
              ></iframe>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;