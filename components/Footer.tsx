import React from 'react';
import { Wind, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 p-1.5 rounded-full">
                <Wind className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">STALLION<span className="text-blue-500"> AIR CON</span></span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Keeping your home and business cool, comfortable, and energy-efficient all year round.
            </p>
            <div className="text-xs text-slate-500 border-t border-slate-800 pt-4 mb-6">
              <span className="font-semibold text-slate-400 block mb-1">Deals in:</span>
              Refrigerant plants, Chillers, Cold storage systems, Condensing units and Refrigeration Spare parts, & Gas 22, 23, 32, 134A, 404, 407, 410.
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-blue-400 transition-colors">Shop Parts</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              <li><Link to="/admin" className="hover:text-blue-400 transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-blue-400 cursor-pointer">AC Installation</li>
              <li className="hover:text-blue-400 cursor-pointer">Repair & Maintenance</li>
              <li className="hover:text-blue-400 cursor-pointer">Commercial HVAC</li>
              <li className="hover:text-blue-400 cursor-pointer">Refrigeration Plants</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm mb-6">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <span>C-5/37 Commercial Zone,<br />Ritesh Shopping Center,<br />G.I.D.C Char Rasta, Vapi (G.J.)</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-500 flex-shrink-0" />
                <span>088660 04475</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-500 flex-shrink-0" />
                <span>stallionaircon@gmail.com</span>
              </li>
            </ul>
            
            {/* Embedded Map */}
            <div className="rounded-lg overflow-hidden border border-slate-700 h-40">
              <iframe 
                src="https://maps.google.com/maps?q=Ritesh+Shopping+Center,+GIDC,+Vapi&hl=en&z=15&output=embed" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Stallion Air Con Map Footer"
              ></iframe>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Stallion Air Con. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;