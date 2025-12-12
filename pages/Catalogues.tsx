import React from 'react';
import { useStore } from '../context/StoreContext';
import { FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const Catalogues: React.FC = () => {
  const { brands } = useStore();
  const brandsWithCatalogues = brands.filter(b => b.cataloguePdf);

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">PRODUCT CATALOGUE</h1>
          <div className="h-1 w-20 bg-blue-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-lg text-slate-600">
            Check out the brands we are associated with and download their latest product catalogues.
          </p>
        </div>

        {brandsWithCatalogues.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
             <div className="inline-block p-4 rounded-full bg-slate-50 mb-4 text-slate-400">
                 <FileText size={48} />
             </div>
             <h3 className="text-lg font-bold text-slate-900 mb-2">No Catalogues Available</h3>
             <p className="text-slate-500 mb-6">We are currently updating our catalogue library. Please check back later.</p>
             <Link to="/contact" className="text-blue-600 font-semibold hover:underline">Contact us for specific requests</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {brandsWithCatalogues.map((brand) => (
              <div key={brand.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 hover:-translate-y-1 group flex flex-col items-center p-8">
                 <div className="h-32 w-full flex items-center justify-center mb-6">
                    {brand.logo ? (
                       <img 
                         src={brand.logo} 
                         alt={brand.name} 
                         className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                       />
                    ) : (
                       <div className="text-2xl font-bold text-slate-300">{brand.name}</div>
                    )}
                 </div>
                 
                 <h3 className="text-xl font-bold text-slate-900 mb-4">{brand.name}</h3>
                 
                 <a 
                   href={brand.cataloguePdf} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="mt-auto px-6 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-full hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 group-hover:shadow-lg group-hover:shadow-blue-500/20"
                 >
                   <Download size={18} /> Download PDF
                 </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalogues;