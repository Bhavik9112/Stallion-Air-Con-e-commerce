import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, ShieldCheck, Truck, Percent } from 'lucide-react';
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
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 animate-fade-in-up leading-tight">
              Premium HVAC & <br/>
              <span className="text-blue-500">Refrigeration Parts</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl">
              One-stop shop for Compressors, Copper Pipes, Refrigerants, and Tools. 
              Request a quote today for the best daily market rates.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2">
                Browse Catalog <ArrowRight size={20} />
              </Link>
              <Link to="/contact" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-lg transition-all border border-slate-700 flex items-center justify-center">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Global Brand Partners Carousel */}
      <section className="py-16 bg-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
           <h2 className="text-3xl font-bold text-slate-900">Our Global Brand Partners</h2>
           <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">We are proud channel partners of some of the world’s most trusted names</p>
        </div>
        
        <div className="flex overflow-hidden relative group">
           <div className="flex animate-scroll hover:pause gap-12 min-w-full items-center">
              {[...brands, ...brands, ...brands].map((brand, i) => (
                 <div key={`${brand.id}-${i}`} className="flex-shrink-0 w-48 h-24 bg-white border border-slate-100 rounded-xl flex items-center justify-center p-6 shadow-sm grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-blue-200">
                    {brand.logo ? (
                       <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                    ) : (
                       <span className="font-bold text-lg text-slate-300">{brand.name}</span>
                    )}
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {rootCategories.map((cat) => (
              <Link key={cat.id} to={`/shop?category=${cat.id}`} className="group block">
                <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all text-center h-full flex flex-col items-center">
                   <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-slate-100 relative">
                     {cat.image ? (
                        <img 
                          src={cat.image} 
                          alt={cat.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-300">
                          <span className="text-4xl font-bold">{cat.name.charAt(0)}</span>
                        </div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                   </div>
                   <span className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
               <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
               Featured Spare Parts
            </h2>
            <Link to="/shop" className="text-blue-600 font-semibold hover:underline">View All &rarr;</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features / Why Us */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Genuine Parts</h3>
              <p className="text-slate-600">Authorized dealer for major brands like Danfoss, Copeland, and Honeywell.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Percent size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Best Market Rates</h3>
              <p className="text-slate-600">Daily price updates to ensure you get the most competitive wholesale pricing.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Logistics</h3>
              <p className="text-slate-600">Quick dispatch and delivery network for urgent maintenance requirements.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;