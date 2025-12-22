
import React from 'react';
import { Building2, Target, Users, ShieldCheck, Award, Microscope, Rocket, Eye } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <div className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl font-black text-white mb-6 tracking-tighter uppercase">STALLION <span className="text-blue-500">AIR CON</span></h1>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto font-medium">
            Dedicated expertise in HVAC and refrigeration since 1997.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full bg-blue-600 rounded-3xl -z-10 transform -rotate-2 opacity-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800" 
              alt="Stallion Air Con Vapi Store" 
              className="rounded-3xl shadow-2xl border-8 border-white"
            />
            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-8 rounded-2xl shadow-xl hidden lg:block">
              <p className="text-4xl font-black tracking-tighter">25+</p>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Years of Legacy</p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-6 text-blue-600 font-black uppercase tracking-widest text-xs">
              <Award size={16} /> Est. 1997 | Vapi, Gujarat
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter uppercase leading-tight">A Legacy of Dedication and Expertise</h2>
            <p className="text-slate-600 mb-6 text-lg leading-relaxed font-medium">
              Stallion Air Con has been serving the HVAC industry with dedication and expertise for many years. Based in Vapi, Gujarat, we understand that reliable climate control systems are essential for comfort, productivity, and safety in both residential and commercial environments.
            </p>
            <p className="text-slate-600 mb-8 text-lg leading-relaxed font-medium">
              Our journey began with a simple mission: to provide high-quality HVAC products and solutions that professionals can trust. Today, we have grown to become a leading supplier in the industry, specializing in refrigerant plants, chillers, cold storage systems, condensing units, and a comprehensive range of refrigeration spare parts.
            </p>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <p className="text-blue-600 font-black text-xs uppercase tracking-widest mb-1">Industrial</p>
                  <p className="text-slate-900 font-bold text-sm">Specialized Spares</p>
               </div>
               <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <p className="text-blue-600 font-black text-xs uppercase tracking-widest mb-1">Global</p>
                  <p className="text-slate-900 font-bold text-sm">Authorized Brands</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white/5 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/10 group hover:border-blue-500 transition-all duration-500">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                <Rocket className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-black text-white mb-6 tracking-tighter uppercase">Our Mission</h3>
              <p className="text-slate-300 text-lg leading-relaxed font-medium italic">
                "To provide high-efficiency air conditioning and refrigeration solutions in a reliable, technical, and environmentally conscious way."
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white/5 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/10 group hover:border-blue-500 transition-all duration-500">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                <Eye className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-black text-white mb-6 tracking-tighter uppercase">Our Vision</h3>
              <p className="text-slate-300 text-lg leading-relaxed font-medium italic">
                "To lead the AC and cooling space through operational excellence, absolute customer satisfaction, and path-breaking performance."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-slate-50 py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-6">The Stallion Edge</h2>
            <p className="text-slate-500 text-lg font-medium">
              What sets us apart is our commitment to understanding our customers' needs. We work closely with HVAC technicians, contractors, and facility managers to ensure they have access to the right products at the right time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                <Microscope size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">Technical Support</h3>
              <p className="text-slate-500 font-medium">Expert guidance to help you navigate complex industrial refrigeration and cooling requirements.</p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">Trusted Quality</h3>
              <p className="text-slate-500 font-medium">Every product we supply is sourced from industry-leading manufacturers you can rely on.</p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">Professional Partnership</h3>
              <p className="text-slate-500 font-medium">Tailored solutions and competitive pricing specifically designed for HVAC contractors and facility managers.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
