import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronRight, Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

const Shop: React.FC = () => {
  const { products, categories, brands } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialCategory = searchParams.get('category');
  const initialSearch = searchParams.get('search');

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [showFilters, setShowFilters] = useState(false);

  // Sync state with URL params when they change
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
    const matchBrand = selectedBrand === 'all' || p.brandId === selectedBrand;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSubCat && matchBrand && matchSearch;
  });

  const rootCategories = categories.filter(c => !c.parentId);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubCategory('all');
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedSubCategory('all');
    setSelectedBrand('all');
    setSearchQuery('');
    // Clear URL params
    setSearchParams({});
  };

  // Update searchQuery state and optionally URL if typing in local box
  // Note: We don't push to URL on every keystroke to avoid history spam, 
  // but we update the local filter immediately.
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Spare Parts Catalog</h1>
          
          <div className="flex gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name or SKU..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm placeholder-slate-400"
                  value={searchQuery}
                  onChange={handleSearchInput}
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
            <div className="bg-white p-6 rounded-2xl border border-slate-200 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar shadow-sm">
              <div className="flex justify-between items-center mb-4 md:hidden">
                <span className="font-bold text-lg">Filters</span>
                <button onClick={() => setShowFilters(false)}><X size={20} /></button>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-bold text-slate-800 mb-4 text-lg">Categories</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={selectedCategory === 'all'}
                      onChange={() => handleCategoryChange('all')}
                      className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className={`transition-colors ${selectedCategory === 'all' ? 'text-blue-600 font-bold' : 'text-slate-600 group-hover:text-blue-600'}`}>All Categories</span>
                  </label>
                  
                  {rootCategories.map(cat => {
                    const subCategories = categories.filter(c => c.parentId === cat.id);
                    const isSelected = selectedCategory === cat.id;

                    return (
                      <div key={cat.id} className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="category" 
                            checked={isSelected}
                            onChange={() => handleCategoryChange(cat.id)}
                            className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className={`transition-colors ${isSelected ? 'text-blue-600 font-bold' : 'text-slate-600 group-hover:text-blue-600'}`}>{cat.name}</span>
                        </label>
                        
                        {isSelected && subCategories.length > 0 && (
                          <div className="ml-5 pl-3 border-l-2 border-slate-100 space-y-2 animate-fade-in py-1">
                             <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded px-2 py-1 -ml-2 transition-colors">
                                <input 
                                  type="radio" 
                                  name={`subcategory-${cat.id}`}
                                  checked={selectedSubCategory === 'all'}
                                  onChange={() => setSelectedSubCategory('all')}
                                  className="w-3 h-3 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className={`text-sm ${selectedSubCategory === 'all' ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>All {cat.name}</span>
                             </label>
                             {subCategories.map(sub => (
                               <label key={sub.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded px-2 py-1 -ml-2 transition-colors">
                                  <input 
                                    type="radio" 
                                    name={`subcategory-${cat.id}`}
                                    checked={selectedSubCategory === sub.id}
                                    onChange={() => setSelectedSubCategory(sub.id)}
                                    className="w-3 h-3 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                  />
                                  <span className={`text-sm ${selectedSubCategory === sub.id ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>{sub.name}</span>
                               </label>
                             ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h3 className="font-bold text-slate-800 mb-4 text-lg">Brands</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="brand" 
                      checked={selectedBrand === 'all'}
                      onChange={() => setSelectedBrand('all')}
                      className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className={`transition-colors ${selectedBrand === 'all' ? 'text-blue-600 font-bold' : 'text-slate-600 group-hover:text-blue-600'}`}>All Brands</span>
                  </label>
                  {brands.map(brand => (
                    <label key={brand.id} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="brand" 
                        checked={selectedBrand === brand.id}
                        onChange={() => setSelectedBrand(brand.id)}
                        className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className={`transition-colors ${selectedBrand === brand.id ? 'text-blue-600 font-bold' : 'text-slate-600 group-hover:text-blue-600'}`}>{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Active Filters Summary */}
            {(selectedCategory !== 'all' || selectedBrand !== 'all' || searchQuery) && (
              <div className="mb-6 flex flex-wrap gap-2 items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                 <span className="text-sm text-slate-500 mr-2 font-medium pl-1">Active Filters:</span>
                 {selectedCategory !== 'all' && (
                    <span className="bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                       {categories.find(c => c.id === selectedCategory)?.name}
                       <button onClick={() => { handleCategoryChange('all'); }} className="hover:text-red-500 hover:bg-red-50 rounded-full p-0.5"><X size={14} /></button>
                    </span>
                 )}
                 {selectedSubCategory !== 'all' && (
                    <span className="bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                       <ChevronRight size={12} className="text-blue-400" />
                       {categories.find(c => c.id === selectedSubCategory)?.name}
                       <button onClick={() => setSelectedSubCategory('all')} className="hover:text-red-500 hover:bg-red-50 rounded-full p-0.5"><X size={14} /></button>
                    </span>
                 )}
                 {selectedBrand !== 'all' && (
                    <span className="bg-purple-50 border border-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                       Brand: {brands.find(b => b.id === selectedBrand)?.name}
                       <button onClick={() => setSelectedBrand('all')} className="hover:text-red-500 hover:bg-red-50 rounded-full p-0.5"><X size={14} /></button>
                    </span>
                 )}
                 {searchQuery && (
                    <span className="bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                       "{searchQuery}"
                       <button onClick={() => setSearchQuery('')} className="hover:text-red-500 hover:bg-red-50 rounded-full p-0.5"><X size={14} /></button>
                    </span>
                 )}
                 <button onClick={clearFilters} className="text-xs text-slate-500 hover:text-blue-600 font-medium ml-auto px-2">Clear All</button>
              </div>
            )}

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="inline-block p-4 rounded-full bg-slate-50 mb-4 text-slate-300">
                    <Search size={48} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No products found</h3>
                <p className="text-slate-500 mb-6">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                >
                  Clear All Filters
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