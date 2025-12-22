
import React from 'react';
import { Info, ShieldCheck, Zap, Thermometer, MapPin, FileText } from 'lucide-react';

const GasGuide: React.FC = () => {
  const gasData = [
    { no: "R22", use: "Commercial Chillers & Older Industrial Plants", size: "13.6kg, 61kg", eco: "Standard Inventory", color: "bg-green-100 text-green-800" },
    { no: "R32", use: "Modern Energy-Efficient Units", size: "7kg, 10kg, 45kg", eco: "Eco-Grade Stock", color: "bg-blue-100 text-blue-800" },
    { no: "R134A", use: "Automotive AC & Industrial Fridge Units", size: "13.6kg, 62kg", eco: "Top Seller", color: "bg-slate-100 text-slate-800" },
    { no: "R404A", use: "Low-Temp Cold Storage & Process Cooling", size: "10kg, 45kg", eco: "Industrial Grade", color: "bg-purple-100 text-purple-800" },
    { no: "R407C", use: "Vapi GIDC Process Water Chillers", size: "11.3kg, 45kg", eco: "Non-Ozone Depleting", color: "bg-orange-100 text-orange-800" },
    { no: "R410A", use: "VRF Systems & Rooftop Split Units", size: "11.3kg, 45kg", eco: "High Pressure Spec", color: "bg-cyan-100 text-cyan-800" }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4 bg-blue-600/10 px-4 py-2 rounded-full border border-blue-600/20">
            <MapPin size={16} className="text-blue-600" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Vapi Technical Resource</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Refrigerant Technical Index</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
            Technical specifications for Floron, Mafron, and Honeywell gases stocked at our Vapi store.
          </p>
        </div>

        {/* Technical Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:border-blue-500 transition-colors">
            <Zap className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={48} />
            <h3 className="text-xl font-black text-slate-900 mb-3 uppercase">GIDC Priority</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">Swift delivery support for all industrial units within the Vapi and Silvassa belts.</p>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:border-blue-500 transition-colors">
            <Thermometer className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={48} />
            <h3 className="text-xl font-black text-slate-900 mb-3 uppercase">Process Grade</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">Specially handled gases optimized for industrial process chilling requirements.</p>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:border-blue-500 transition-colors">
            <ShieldCheck className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={48} />
            <h3 className="text-xl font-black text-slate-900 mb-3 uppercase">Purity Guaranteed</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">Guaranteed purity levels with manufacturer certifications for every cylinder.</p>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
          <div className="p-10 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-center gap-6">
             <div>
                <h2 className="text-3xl font-black tracking-tight uppercase">In-Store Inventory</h2>
                <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-black">Daily Market Pricing — Contact for Bulk Rates</p>
             </div>
             <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20">
                <FileText size={18} /> Request Data Sheet
             </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="p-8">Refrigerant ID</th>
                  <th className="p-8">Primary Application</th>
                  <th className="p-8">Available Packing</th>
                  <th className="p-8">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gasData.map((gas, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="p-8">
                      <span className={`px-5 py-2 rounded-xl font-black text-sm uppercase tracking-widest shadow-sm ${gas.color}`}>
                        {gas.no}
                      </span>
                    </td>
                    <td className="p-8 font-black text-slate-800 text-sm tracking-tight">{gas.use}</td>
                    <td className="p-8 font-bold text-slate-500 text-sm italic">{gas.size}</td>
                    <td className="p-8">
                      <div className="flex items-center gap-2">
                         <Info size={14} className="text-blue-500" />
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{gas.eco}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quote Prompt */}
        <div className="mt-16 bg-blue-600 rounded-[2.5rem] p-12 text-center text-white shadow-2xl shadow-blue-600/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
            <Zap size={200} />
          </div>
          <h3 className="text-3xl font-black uppercase mb-4 tracking-tighter">Industrial Requirements?</h3>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto font-medium">Get customized corporate pricing for Silvassa and Vapi industrial units. Our specialists respond within 60 minutes during business hours.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-50 transition-colors">Start Quote Request</button>
             <button className="bg-blue-700 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-800 transition-colors border border-blue-500">Contact Store</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GasGuide;
