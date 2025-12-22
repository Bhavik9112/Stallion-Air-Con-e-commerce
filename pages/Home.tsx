
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Factory, Building2, Download } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const { categories, products, brands } = useStore();
  const featuredProducts = products.slice(0, 4);

  // Filter only root categories (no subcategories) for the main grid
  const rootCategories = categories.filter(c => !c.parentId);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 opacity-20">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6 bg-blue-600/10 px-4 py-2 rounded-full border border-blue-600/20">
              <Building2 size={16} className="text-blue-500" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Serving Vapi Since 1997</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 animate-fade-in-up leading-tight uppercase">
              Expert Solutions & <br/>
              <span className="text-blue-500">HVAC Genuine Spares</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl font-medium">
              Your authorized source for Compressors, Refrigerant Gases, and Copper Fittings. 
              Supplying world-class components to Vapi, Silvassa, and Daman industrial belts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-lg transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 uppercase tracking-widest">
                Browse Shop <ArrowRight size={20} />
              </Link>
              <Link to="/contact" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-lg transition-all border border-white/10 flex items-center justify-center uppercase tracking-widest">
                Request Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Brand Carousel */}
      <section className="py-20 bg-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
           <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Authorized Partner Ecosystem</h2>
           <p className="text-lg text-slate-500 mt-2 max-w-2xl mx-auto font-medium">Official supplier of premium HVAC engineering components from global market leaders.</p>
        </div>
        
        <div className="flex overflow-hidden relative group/carousel">
           <div className="flex animate-scroll hover:pause gap-12 min-w-full items-center py-6">
              {[...brands, ...brands, ...brands].map((brand, i) => (
                 <Link 
                    key={`${brand.id}-${i}`} 
                    to={`/catalogues#brand-${brand.id}`}
                    className="flex-shrink-0 w-44 sm:w-56 h-28 bg-white border border-slate-100 rounded-[2rem] flex flex-col items-center justify-center p-6 shadow-sm grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:border-blue-500 group"
                 >
                    <div className="relative h-full w-full flex items-center justify-center">
                      {brand.logo ? (
                         <img 
                            src={brand.logo} 
                            alt={`${brand.name} logo`} 
                            className="max-w-full max-h-[80%] object-contain opacity-80 group-hover:opacity-100 transition-all duration-300" 
                            style={{ width: `${brand.logoSize || 100}%` }}
                          />
                      ) : (
                         <span className="font-black text-lg text-slate-400 uppercase tracking-widest">{brand.name}</span>
                      )}
                      {/* Hover Badge */}
                      <div className="absolute -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                        <Download size={8} /> PDF Catalogue
                      </div>
                    </div>
                 </Link>
              ))}
           </div>
        </div>
        <div className="text-center mt-12">
           <Link to="/catalogues" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-blue-600 transition-colors flex items-center justify-center gap-2 group">
              View All Technical Catalogues <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Product Domains</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {rootCategories.map((cat) => (
              <Link key={cat.id} to={`/shop?category=${cat.id}`} className="group block h-full">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-blue-600 hover:shadow-2xl transition-all duration-500 text-center h-full flex flex-col items-center ring-1 ring-slate-100/50">
                   <div className="w-full aspect-square rounded-3xl overflow-hidden mb-6 bg-slate-50 relative border border-slate-50">
                     {cat.image ? (
                        <img 
                          src={cat.image} 
                          alt={cat.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                          <Building2 size={48} className="animate-pulse" />
                        </div>
                     )}
                   </div>
                   <span className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-[0.2em] text-[10px] mt-auto">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
               <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Premium Inventory</h2>
               <p className="text-slate-500 font-medium text-sm mt-1 uppercase tracking-widest">In-stock and ready for dispatch in Vapi</p>
            </div>
            <Link to="/shop" className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">Complete Catalog &rarr;</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Blocks */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-10 bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/10 hover:border-blue-500/50 transition-all group">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Genuine OEM</h3>
              <p className="text-slate-400 font-medium text-sm leading-relaxed italic">Direct authorized procurement from Danfoss, Copeland, LG, and Honeywell ensures zero risk of counterfeit parts.</p>
            </div>
            <div className="p-10 bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/10 hover:border-blue-500/50 transition-all group">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
                <Factory size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Industrial Stock</h3>
              <p className="text-slate-400 font-medium text-sm leading-relaxed italic">Massive local inventory in Vapi to support rapid response for industrial plant maintenance and commercial HVAC outages.</p>
            </div>
            <div className="p-10 bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/10 hover:border-blue-500/50 transition-all group">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
                <Truck size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Local Logistics</h3>
              <p className="text-slate-400 font-medium text-sm leading-relaxed italic">Immediate dispatch fleet serving the industrial triangle of Vapi, Silvassa, and Daman with priority same-day delivery.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
