
import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-1 rounded-xl bg-white/5">
                <Logo className="h-8 w-auto" />
              </div>
              <span className="font-black text-lg text-white tracking-tighter uppercase">STALLION<span className="text-blue-500"> AIR CON</span></span>
            </div>
            <p className="text-xs text-slate-400 mb-6 font-medium leading-relaxed italic">
              Vapi's premier source for genuine HVAC and refrigeration spares. Serving industrial units and professionals with excellence since 1997.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6">Explore Catalog</h3>
            <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest">
              <li><Link to="/shop" className="hover:text-blue-400 transition-colors">Shop Spare Parts</Link></li>
              <li><Link to="/catalogues" className="hover:text-blue-400 transition-colors">Brand Catalogues</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">Company Profile</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Request Quote</Link></li>
            </ul>
          </div>

          {/* Main Location (Vapi) */}
          <div className="md:col-span-2">
            <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
               Our Store Location
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <ul className="space-y-4 text-[10px] font-bold">
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-blue-500 shrink-0" />
                  <span className="leading-relaxed">Shop No. 37, Commercial Zone, Ritesh Shopping Centre, GIDC Char Rasta, Vapi, Gujarat 396195</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-blue-500 shrink-0" />
                  <span className="text-sm font-black text-white">+91 88660 04475</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-blue-500 shrink-0" />
                  <span className="lowercase">stallionaircon@gmail.com</span>
                </li>
              </ul>
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg h-32 md:h-auto">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.432126748696!2d72.91824357469707!3d20.365065310243907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0ce385d3b34fb%3A0x5b9593ebd2fc3fb4!2sStallion%20Air%20Con!5e0!3m2!1sen!2sin!4v1766174153953!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Stallion Air Con Vapi Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} Stallion Air Con. All rights reserved.</p>
          <div className="flex gap-6 items-center">
             <Link to="/shop" className="hover:text-blue-500">Inventory</Link>
             <Link to="/contact" className="hover:text-blue-500">Request Quote</Link>
             <div className="w-px h-3 bg-slate-800"></div>
             <Link to="/admin" className="flex items-center gap-1.5 text-slate-700 hover:text-blue-500 transition-colors">
                <ShieldCheck size={12} />
                Admin Portal
             </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
