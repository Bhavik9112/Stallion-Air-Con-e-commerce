
import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { FileText, Download, ChevronRight, Info, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Catalogues: React.FC = () => {
  const { brands } = useStore();
  const location = useLocation();
  const brandsWithCatalogues = brands.filter(b => b.catalogues && b.catalogues.length > 0);

  // Deep-linking effect
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location, brands]);

  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4 bg-blue-600/10 px-4 py-2 rounded-full border border-blue-600/20">
            <ShieldCheck size={16} className="text-blue-600" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Authorized Technical Repository</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-6 uppercase">OEM Resource Library</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            Download official technical datasheets, installation guides, and product specifications from our manufacturing partners.
          </p>
        </div>

        {brandsWithCatalogues.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-200 shadow-sm animate-fade-in">
             <div className="inline-block p-8 rounded-full bg-slate-50 mb-8 text-slate-200">
                 <FileText size={80} />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Library Under Maintenance</h3>
             <p className="text-slate-400 mb-10 max-w-sm mx-auto uppercase text-xs tracking-[0.2em] font-bold leading-relaxed">Our technical team is currently synchronizing the documentation with the latest manufacturer releases.</p>
             <Link to="/contact" className="bg-[#0d2e5a] text-white px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-blue-800 transition-all shadow-2xl shadow-blue-900/20 flex items-center justify-center gap-3 w-fit mx-auto">
                Request Specific Datasheet <ChevronRight size={18}/>
             </Link>
          </div>
        ) : (
          <div className="space-y-16">
            {brandsWithCatalogues.map((brand) => (
              <div 
                key={brand.id} 
                id={`brand-${brand.id}`} 
                className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden animate-fade-in-up"
              >
                 <div className="flex flex-col lg:flex-row">
                    {/* Brand Branding Panel */}
                    <div className="lg:w-1/3 bg-slate-50 p-12 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-slate-100 relative group">
                        <div className="h-32 w-full flex items-center justify-center mb-8">
                            {brand.logo ? (
                              <img 
                                src={brand.logo} 
                                alt={`${brand.name} logo`} 
                                className="max-h-full max-w-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-500"
                                style={{ width: `${brand.logoSize || 100}%` }}
                              />
                            ) : (
                              <div className="text-4xl font-black text-slate-300 uppercase tracking-widest">{brand.name}</div>
                            )}
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter uppercase">{brand.name}</h3>
                        <div className="text-[10px] font-black text-blue-600 bg-blue-100 px-4 py-1.5 rounded-full uppercase tracking-widest">Authorized OEM Partner</div>
                        
                        <div className="mt-8 pt-8 border-t border-slate-200 w-full">
                           <Link to={`/shop?brand=${brand.id}`} className="text-xs font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest flex items-center justify-center gap-2 group">
                              View Brand Products <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                           </Link>
                        </div>
                    </div>

                    {/* Catalogues Grid Panel */}
                    <div className="lg:w-2/3 p-12">
                       <div className="flex items-center gap-3 mb-8">
                          <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                          <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">Available Documentation</h4>
                       </div>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {brand.catalogues?.map((cat, idx) => (
                            <a 
                              key={idx}
                              href={cat.pdf} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="group bg-white border border-slate-200 p-6 rounded-[2rem] hover:border-blue-600 hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative"
                            >
                               <div className="bg-slate-50 p-4 rounded-2xl text-blue-600 w-fit mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                                  <FileText size={28} />
                               </div>
                               <h5 className="font-black text-slate-900 text-lg mb-2 uppercase tracking-tight leading-tight flex-1">{cat.name}</h5>
                               
                               <div className="mt-6 flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                     <Info size={12} /> Technical PDF
                                  </div>
                                  <div className="text-blue-600 group-hover:translate-y-1 transition-transform">
                                     <Download size={20} />
                                  </div>
                               </div>
                            </a>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}

        {/* Support Section */}
        <div className="mt-24 text-center">
           <div className="max-w-2xl mx-auto bg-slate-900 p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <FileText size={200} />
              </div>
              <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter">Missing a Datasheet?</h3>
              <p className="text-slate-400 font-medium mb-8">If you require a specific model manual or compliance certificate not listed above, please contact our technical desk.</p>
              <Link to="/contact" className="inline-flex bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
                 Request Engineering Support
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Catalogues;
