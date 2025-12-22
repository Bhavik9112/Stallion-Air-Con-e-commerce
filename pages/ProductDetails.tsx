
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBasket, Check, FileText, Settings, Plus, Minus, Info, ClipboardList, AlignLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, categories, brands, addToBasket } = useStore();
  const [activeTab, setActiveTab] = useState<'description' | 'additional'>('description');
  const [qty, setQty] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
        <Link to="/shop" className="text-blue-600 hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const category = categories.find(c => c.id === product.categoryId);
  const associatedBrands = brands.filter(b => product.brandIds?.includes(b.id));
  const relatedProducts = products
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAddToBasket = () => {
    addToBasket(product.id, qty);
    navigate('/basket');
  };

  // Improved Hybrid Specification Renderer
  const renderTechnicalSpecs = () => {
    if (!product.specifications) return <div className="text-center py-12 text-slate-400 font-bold uppercase tracking-widest text-xs">No technical data provided for this item.</div>;

    try {
      const parsed = JSON.parse(product.specifications);
      
      // Case 1: New Hybrid Format (Object with overview and table)
      if (parsed && typeof parsed === 'object' && 'table' in parsed) {
        return (
          <div className="space-y-8 animate-fade-in">
            {parsed.overview && (
              <div className="max-w-4xl">
                 <p className="text-slate-600 leading-relaxed font-medium text-lg whitespace-pre-wrap">
                    {parsed.overview}
                 </p>
              </div>
            )}
            
            {parsed.table && parsed.table.length > 0 && (
              <div className="overflow-hidden border border-slate-200 rounded-[2rem] shadow-sm bg-white">
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-slate-100">
                    {parsed.table.map((spec: any, i: number) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="p-5 w-1/3 font-black text-[10px] uppercase tracking-widest text-slate-400 border-r border-slate-100">{spec.key}</td>
                        <td className="p-5 text-sm font-bold text-slate-900">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {!parsed.overview && (!parsed.table || parsed.table.length === 0) && (
              <div className="text-center py-12 text-slate-400 font-bold uppercase tracking-widest text-xs">No technical data provided.</div>
            )}
          </div>
        );
      }
      
      // Case 2: Legacy Standalone Table Format (Array)
      if (Array.isArray(parsed)) {
        return (
          <div className="overflow-hidden border border-slate-200 rounded-[2rem] shadow-sm bg-white animate-fade-in">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-slate-100">
                {parsed.map((spec, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="p-5 w-1/3 font-black text-[10px] uppercase tracking-widest text-slate-400 border-r border-slate-100">{spec.key}</td>
                    <td className="p-5 text-sm font-bold text-slate-900">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    } catch {
      // Fallback: Legacy Plain Text Format
      return (
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 text-slate-700 whitespace-pre-wrap font-medium leading-relaxed animate-fade-in">
          {product.specifications}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-slate-400 hover:text-blue-600 mb-8 transition-colors font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Catalog
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2.5rem] p-12 flex items-center justify-center relative shadow-inner border border-slate-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-h-[500px] w-auto object-contain"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="mb-6">
               <h1 className="text-3xl font-black text-slate-900 mb-6 tracking-tight leading-tight uppercase">{product.name}</h1>
               <div className="flex items-center gap-2 mb-8">
                  <ClipboardList className="text-blue-600" size={20} />
                  <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Product Configuration</h2>
               </div>
            </div>

            <div className="overflow-hidden border border-slate-200 rounded-2xl shadow-sm mb-8 bg-slate-50/30">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-4 w-1/3 bg-slate-50 font-black text-[10px] uppercase tracking-widest text-slate-400 border-r border-slate-200">SKU / Model</td>
                    <td className="p-4 text-sm font-mono font-bold text-blue-600">{product.sku}</td>
                  </tr>
                  <tr>
                    <td className="p-4 bg-slate-50 font-black text-[10px] uppercase tracking-widest text-slate-400 border-r border-slate-200">OEM Source</td>
                    <td className="p-4 text-sm font-bold text-slate-700">
                       <div className="flex flex-wrap gap-2">
                          {associatedBrands.length > 0 ? associatedBrands.map(b => (
                            <span key={b.id} className="bg-white border border-slate-200 px-2 py-1 rounded text-[10px] uppercase tracking-wider font-black text-slate-500 shadow-sm">{b.name}</span>
                          )) : 'Authorized Partner'}
                       </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 bg-slate-50 font-black text-[10px] uppercase tracking-widest text-slate-400 border-r border-slate-200">Category</td>
                    <td className="p-4 text-sm font-bold text-slate-700">{category?.name}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
               <div className="flex items-center bg-slate-100 rounded-xl p-1 h-14 w-full sm:w-auto border border-slate-200 shadow-inner">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-full flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600"><Minus size={18}/></button>
                  <span className="w-12 text-center font-black text-slate-800">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-12 h-full flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600"><Plus size={18}/></button>
               </div>
               <button 
                  onClick={handleAddToBasket}
                  className="w-full sm:flex-1 bg-[#0d2e5a] text-white h-14 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3"
                >
                  <ShoppingBasket size={18} /> Add to Quote Basket
                </button>
            </div>
            
            <p className="mt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center sm:text-left">Immediate dispatch from Vapi logistics hub</p>
          </div>
        </div>

        <div className="mb-12 border-b border-slate-200 flex gap-1">
          <button 
            onClick={() => setActiveTab('description')}
            className={`px-10 py-4 font-black text-xs uppercase tracking-widest rounded-t-[1.5rem] transition-all ${activeTab === 'description' ? 'bg-[#0d2e5a] text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('additional')}
            className={`px-10 py-4 font-black text-xs uppercase tracking-widest rounded-t-[1.5rem] transition-all ${activeTab === 'additional' ? 'bg-[#0d2e5a] text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            Technical Parameters
          </button>
        </div>

        <div className="animate-fade-in mb-24 min-h-[300px]">
           {activeTab === 'description' ? (
             <div className="max-w-4xl">
                <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Description</h2>
                <p className="text-slate-600 leading-relaxed font-medium text-lg whitespace-pre-wrap">
                   {product.description || 'General information available on request.'}
                </p>
             </div>
           ) : (
             <div className="bg-slate-50 p-6 md:p-12 rounded-[3rem] border border-slate-200">
                <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight flex items-center gap-3">
                  <Settings className="text-blue-600" />
                  Technical Specifications
                </h3>
                {renderTechnicalSpecs()}
                
                <div className="mt-12 p-8 bg-blue-600 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-500/20">
                   <div className="flex items-center gap-4">
                      <div className="bg-white/20 p-3 rounded-2xl"><FileText size={24} /></div>
                      <div>
                         <p className="font-black uppercase text-sm tracking-widest">Technical Datasheet</p>
                         <p className="text-blue-100 text-xs font-bold">Comprehensive PDF technical manual for {product.sku}</p>
                      </div>
                   </div>
                   {product.pdf ? (
                      <a href={product.pdf} target="_blank" rel="noreferrer" className="px-8 py-3 bg-white text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center gap-2">
                         Download PDF <Plus size={14} />
                      </a>
                   ) : (
                      <Link to="/contact" className="px-8 py-3 bg-blue-700 text-white border border-white/20 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all">
                         Request Document
                      </Link>
                   )}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
