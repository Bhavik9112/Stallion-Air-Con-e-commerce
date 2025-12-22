
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronRight, Search, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

const Shop: React.FC = () => {
  const { products, categories, brands } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialCategory = searchParams.get('category');
  const initialSearch = searchParams.get('search');

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]); // Changed to array for multiple select
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [showFilters, setShowFilters] = useState(false);

  const [catFilterQuery, setCatFilterQuery] = useState('');
  const [brandFilterQuery, setBrandFilterQuery] = useState('');

  useEffect(() => {
    const cat = searchParams.get('category');
    const search = searchParams.get('search');
    
    if (cat) {
       setSelectedCategory(cat);
       setSelectedSubCategory('all');
    }
    
    if (search !== null) {
       setSearchQuery(search);
    }
  }, [searchParams]);

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchSubCat = selectedSubCategory === 'all' || p.subCategoryId === selectedSubCategory;
    
    // Logic: Product must match AT LEAST one of the selected brands, if any are selected
    const matchBrand = selectedBrands.length === 0 || 
                       (p.brandIds && p.brandIds.some(bid => selectedBrands.includes(bid)));
                       
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
                        
    return matchCat && matchSubCat && matchBrand && matchSearch;
  });

  const rootCategories = categories.filter(c => !c.parentId);
  
  const filteredRootCategories = rootCategories.filter(c => 
    c.name.toLowerCase().includes(catFilterQuery.toLowerCase())
  );

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(brandFilterQuery.toLowerCase())
  );

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubCategory('all');
  };

  const toggleBrand = (brandId: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandId) ? prev.filter(id => id !== brandId) : [...prev, brandId]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedSubCategory('all');
    setSelectedBrands([]);
    setSearchQuery('');
    setCatFilterQuery('');
    setBrandFilterQuery('');
    setSearchParams({});
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Spare Parts Catalog</h1>
          
          <div className="flex gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search for parts or SKU..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm placeholder-slate-400 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <button 
               className="md:hidden p-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 transition-colors shadow-sm"
               onClick={() => setShowFilters(!showFilters)}
             >
               <Filter size={20} />
             </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`w-full md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide shadow-xl shadow-slate-200/50">
              <div className="flex justify-between items-center mb-6 md:hidden">
                <span className="font-black uppercase tracking-widest text-sm">Filter Tools</span>
                <button onClick={() => setShowFilters(false)} className="p-2 text-slate-400 hover:text-red-500"><X size={20} /></button>
              </div>

              {/* Categories Section */}
              <div className="mb-10">
                <h3 className="font-black text-slate-400 mb-4 text-[10px] uppercase tracking-[0.2em]">Classifications</h3>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search cats..."
                    className="w-full pl-9 pr-3 py-2 text-[11px] rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-300 outline-none transition-all font-bold"
                    value={catFilterQuery}
                    onChange={(e) => setCatFilterQuery(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={selectedCategory === 'all'}
                      onChange={() => handleCategoryChange('all')}
                      className="hidden"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${selectedCategory === 'all' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                        {selectedCategory === 'all' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                    </div>
                    <span className={`transition-colors text-xs font-bold uppercase tracking-wide ${selectedCategory === 'all' ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'}`}>All Families</span>
                  </label>
                  
                  {filteredRootCategories.map(cat => {
                    const subCategories = categories.filter(c => c.parentId === cat.id);
                    const isSelected = selectedCategory === cat.id;

                    return (
                      <div key={cat.id} className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="category" 
                            checked={isSelected}
                            onChange={() => handleCategoryChange(cat.id)}
                            className="hidden"
                          />
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                             {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                          </div>
                          <span className={`transition-colors text-xs font-bold uppercase tracking-wide ${isSelected ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'}`}>{cat.name}</span>
                        </label>
                        
                        {isSelected && subCategories.length > 0 && (
                          <div className="ml-7 pl-3 border-l-2 border-slate-100 space-y-2 animate-fade-in py-1 mt-1">
                             {subCategories.map(sub => (
                               <label key={sub.id} className="flex items-center gap-3 cursor-pointer group">
                                  <input 
                                    type="radio" 
                                    name={`subcategory-${cat.id}`}
                                    checked={selectedSubCategory === sub.id}
                                    onChange={() => setSelectedSubCategory(sub.id)}
                                    className="hidden"
                                  />
                                  <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all ${selectedSubCategory === sub.id ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                                     {selectedSubCategory === sub.id && <div className="w-1 h-1 bg-white rounded-full"></div>}
                                  </div>
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${selectedSubCategory === sub.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`}>{sub.name}</span>
                               </label>
                             ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Brands Section (Multi-Select) */}
              <div>
                <h3 className="font-black text-slate-400 mb-4 text-[10px] uppercase tracking-[0.2em]">OEM Partners</h3>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search brands..."
                    className="w-full pl-9 pr-3 py-2 text-[11px] rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-300 outline-none transition-all font-bold"
                    value={brandFilterQuery}
                    onChange={(e) => setBrandFilterQuery(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  {filteredBrands.map(brand => (
                    <label key={brand.id} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={selectedBrands.includes(brand.id)}
                        onChange={() => toggleBrand(brand.id)}
                        className="hidden"
                      />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${selectedBrands.includes(brand.id) ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                         {selectedBrands.includes(brand.id) && <Check size={10} className="text-white" />}
                      </div>
                      <span className={`transition-colors text-xs font-bold uppercase tracking-wide ${selectedBrands.includes(brand.id) ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'}`}>{brand.name}</span>
                    </label>
                  ))}
                  {filteredBrands.length === 0 && (
                    <p className="text-[10px] text-slate-400 italic py-2">No matching brands</p>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Active Filters Summary */}
            {(selectedCategory !== 'all' || selectedBrands.length > 0 || searchQuery) && (
              <div className="mb-8 flex flex-wrap gap-2 items-center bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 pl-1">Selected:</span>
                 {selectedCategory !== 'all' && (
                    <span className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-500/20 animate-fade-in">
                       {categories.find(c => c.id === selectedCategory)?.name}
                       <button onClick={() => { handleCategoryChange('all'); }} className="hover:text-red-200"><X size={12} /></button>
                    </span>
                 )}
                 {selectedBrands.map(bid => (
                    <span key={bid} className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-fade-in">
                       {brands.find(b => b.id === bid)?.name}
                       <button onClick={() => toggleBrand(bid)} className="hover:text-red-400"><X size={12} /></button>
                    </span>
                 ))}
                 {searchQuery && (
                    <span className="bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-fade-in">
                       "{searchQuery}"
                       <button onClick={() => setSearchQuery('')} className="hover:text-red-500"><X size={12} /></button>
                    </span>
                 )}
                 <button onClick={clearFilters} className="text-[10px] font-black text-slate-300 hover:text-red-500 uppercase tracking-[0.2em] ml-auto px-4 transition-colors">Reset All</button>
              </div>
            )}

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-sm animate-fade-in">
                <div className="inline-block p-6 rounded-full bg-slate-50 mb-6 text-slate-200">
                    <Search size={64} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">No Matching Spares</h3>
                <p className="text-slate-400 font-medium mb-8 max-w-sm mx-auto uppercase text-xs tracking-widest">Adjust your technical filters or clear your search to find available inventory.</p>
                <button 
                  onClick={clearFilters}
                  className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                >
                  Reset Catalog View
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
