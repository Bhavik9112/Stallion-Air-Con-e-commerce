
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Building2, Clock, MessageSquare, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Contact: React.FC = () => {
  const { submitContactMessage } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'parts',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContactMessage({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      service: formData.service,
      message: formData.message
    });
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', company: '', service: 'parts', message: '' });
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const labelClasses = "block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 pl-1";
  const inputClasses = "w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none shadow-sm placeholder-slate-300 font-medium";

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-slate-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter uppercase">Connect with Us</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            Contact leading industrial HVAC spares supplier. We are ready to assist with your technical requirements.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 pb-20">
        {isSubmitted && (
          <div className="mb-8 bg-blue-600 text-white p-6 rounded-3xl shadow-2xl flex items-center justify-between animate-fade-in border border-blue-400">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-full"><ShieldCheck /></div>
              <div>
                <p className="font-black text-lg">Inquiry Transmitted</p>
                <p className="text-blue-100 text-sm">Your request has been received. Our team will respond shortly.</p>
              </div>
            </div>
            <button onClick={() => setIsSubmitted(false)} className="text-white/50 hover:text-white"><MessageSquare size={20}/></button>
          </div>
        )}

        {/* Store Card */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border-2 border-blue-500 relative group overflow-hidden ring-8 ring-blue-50/50">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-slate-900 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-slate-500/20 flex-shrink-0">
                <Building2 size={48} />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-2">Stallion Air Con</h2>
                <span className="text-blue-700 text-xs font-black uppercase tracking-[0.2em] block mb-6">Our Store Location</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex gap-4 items-start text-left">
                    <MapPin className="text-blue-500 shrink-0" size={24} />
                    <p className="text-slate-600 font-medium leading-relaxed">
                      Shop No. 37, Commercial Zone, Ritesh Shopping Centre,<br/>
                      GIDC Char Rasta, Vapi, Gujarat 396195
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                      <Phone className="text-blue-500" size={20} />
                      <p className="font-black text-2xl text-slate-900 tracking-tight">+91 88660 04475</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Mail className="text-blue-500" size={20} />
                      <p className="font-bold text-slate-600">stallionaircon@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Map Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Visit Our Store</h3>
            <p className="text-slate-500 font-medium">Located in the heart of Vapi's industrial corridor.</p>
          </div>
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-white h-[450px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.432126748696!2d72.91824357469707!3d20.365065310243907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0ce385d3b34fb%3A0x5b9593ebd2fc3fb4!2sStallion%20Air%20Con!5e0!3m2!1sen!2sin!4v1766174153953!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Interactive Store Map"
            ></iframe>
          </div>
        </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          {/* Service Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                  <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                  Support Hours
                </h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                      <Clock size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest mb-1">Store Timings</p>
                      <p className="font-black text-lg text-white">9 AM - 8 PM</p>
                      <p className="text-xs text-slate-400 font-medium">Monday to Saturday</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100">
            <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Direct Inquiry</h3>
            <p className="text-slate-500 mb-10 font-medium">Specify your requirements and our specialists will assist you.</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="name" className={labelClasses}>Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClasses}>Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="phone" className={labelClasses}>Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="+91"
                  />
                </div>
                <div>
                  <label htmlFor="company" className={labelClasses}>Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Company Name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className={labelClasses}>Inquiry Type</label>
                <div className="relative">
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className={`${inputClasses} appearance-none cursor-pointer pr-10 font-bold`}
                  >
                    <option value="parts">Spare Parts Request</option>
                    <option value="gas">Refrigerant Gas Query</option>
                    <option value="maintenance">Maintenance Support</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="message" className={labelClasses}>Requirements Details</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputClasses} resize-none min-h-[120px]`}
                  placeholder="List part numbers, quantities, or specific models..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-black text-lg py-5 rounded-2xl hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-3 uppercase tracking-widest shadow-xl shadow-blue-500/10"
              >
                <Send size={20} />
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
