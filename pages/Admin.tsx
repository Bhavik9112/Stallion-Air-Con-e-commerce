import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Package, Users, Layers, Tag, Plus, Trash2, ShieldCheck, 
  MessageSquare, LayoutGrid, Building, FolderTree, ArrowLeft, LogOut, FileText, Pencil 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Product, Category, Brand } from '../types';

const inputClasses = "w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm placeholder-slate-400";
const labelClasses = "block text-sm font-semibold text-slate-700 mb-1";

// --- Sub-Components for Different Sections ---

// 1. Manage Products
const ProductsManager: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { products, categories, brands, deleteProduct, addProduct, updateProduct } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: '', sku: '', categoryId: '', subCategoryId: '', brandId: '', description: '', image: '', pdf: ''
  });
  const [pdfInputType, setPdfInputType] = useState<'url' | 'file'>('url');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewProduct({...newProduct, image: reader.result as string});
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) {
       if(file.size > 2 * 1024 * 1024) {
           alert("File is too large for this demo (limit 2MB). Please use a URL instead.");
           return;
        }
      const reader = new FileReader();
      reader.onloadend = () => setNewProduct({...newProduct, pdf: reader.result as string});
      reader.readAsDataURL(file);
    }
  };

  const handleStartEdit = (product: Product) => {
    setNewProduct({
      name: product.name,
      sku: product.sku,
      categoryId: product.categoryId,
      subCategoryId: product.subCategoryId || '',
      brandId: product.brandId,
      description: product.description,
      image: product.image,
      pdf: product.pdf || ''
    });
    setEditingId(product.id);
    setIsAdding(true);
    // If it's not base64, it's a URL
    setPdfInputType('url'); 
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewProduct({ name: '', sku: '', categoryId: '', subCategoryId: '', brandId: '', description: '', image: '', pdf: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct({
        id: editingId,
        ...newProduct,
        status: 'active'
      });
    } else {
      addProduct({
        id: Date.now().toString(),
        ...newProduct,
        status: 'active'
      });
    }
    handleCancel();
  };

  // Filter valid subcategories based on selected category
  const availableSubCategories = categories.filter(c => c.parentId === newProduct.categoryId);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full"><ArrowLeft /></button>
        <h2 className="text-2xl font-bold">Manage Products</h2>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl mb-6 border border-slate-200 shadow-sm animate-fade-in">
          <h3 className="font-bold text-lg mb-6 text-slate-800">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
               <label className={labelClasses}>Product Name</label>
               <input required placeholder="e.g. Compressor ZR61" className={inputClasses} value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
            </div>
            <div>
               <label className={labelClasses}>SKU</label>
               <input required placeholder="e.g. ZR61K3-TFD" className={inputClasses} value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} />
            </div>
            
            <div>
               <label className={labelClasses}>Category</label>
               <select required className={inputClasses} value={newProduct.categoryId} onChange={e => setNewProduct({...newProduct, categoryId: e.target.value, subCategoryId: ''})}>
                  <option value="">Select Category</option>
                  {categories.filter(c => !c.parentId).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
            </div>

            <div>
               <label className={labelClasses}>Subcategory</label>
               <select className={inputClasses} value={newProduct.subCategoryId} onChange={e => setNewProduct({...newProduct, subCategoryId: e.target.value})} disabled={!newProduct.categoryId}>
                  <option value="">Select Subcategory (Optional)</option>
                  {availableSubCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
            </div>

            <div>
               <label className={labelClasses}>Brand</label>
               <select required className={inputClasses} value={newProduct.brandId} onChange={e => setNewProduct({...newProduct, brandId: e.target.value})}>
                  <option value="">Select Brand</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
               </select>
            </div>
            
            <div className="col-span-2">
               <label className={labelClasses}>Description</label>
               <textarea placeholder="Enter product details..." className={inputClasses} rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
            </div>
            
            <div className="col-span-1">
                <label className={labelClasses}>Product Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"/>
                {editingId && newProduct.image && <div className="mt-2 text-xs text-slate-400">Current image loaded</div>}
            </div>

            <div className="col-span-1">
                <label className={labelClasses}>Product Datasheet (PDF)</label>
                <div className="flex gap-2 mb-2">
                   <button type="button" onClick={() => setPdfInputType('url')} className={`flex-1 py-1.5 text-xs font-semibold rounded ${pdfInputType === 'url' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>URL Link</button>
                   <button type="button" onClick={() => setPdfInputType('file')} className={`flex-1 py-1.5 text-xs font-semibold rounded ${pdfInputType === 'file' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>Upload File</button>
                </div>
                {pdfInputType === 'url' ? (
                   <input 
                     className={inputClasses}
                     placeholder="https://example.com/datasheet.pdf"
                     value={newProduct.pdf}
                     onChange={e => setNewProduct({...newProduct, pdf: e.target.value})}
                   />
                ) : (
                   <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"/>
                )}
                {newProduct.pdf && <div className="mt-2 text-xs text-green-600 font-semibold flex items-center gap-1"><FileText size={12}/> PDF Attached</div>}
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
            <button type="button" onClick={handleCancel} className="bg-white border border-slate-300 text-slate-700 px-5 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 shadow-sm transition-colors">{editingId ? 'Update Product' : 'Save Product'}</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/50 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">PDF</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const cat = categories.find(c => c.id === p.categoryId);
              const brand = brands.find(b => b.id === p.brandId);
              return (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4"><img src={p.image} className="w-12 h-12 object-cover rounded-lg border border-slate-200 bg-white" alt="" /></td>
                  <td className="p-4 font-medium">
                    {p.name}
                    <div className="text-xs text-slate-400 mt-0.5">{brand?.name} • {p.sku}</div>
                  </td>
                  <td className="p-4 text-slate-600"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-semibold">{cat?.name}</span></td>
                  <td className="p-4">
                     {p.pdf ? (
                       <a href={p.pdf} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs flex items-center gap-1"><FileText size={14}/> PDF</a>
                     ) : (
                       <span className="text-slate-300 text-xs">-</span>
                     )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleStartEdit(p)} className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-all"><Pencil size={18} /></button>
                      <button onClick={() => deleteProduct(p.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 2. Manage Categories
const CategoriesManager: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { categories, addCategory, deleteCategory, updateCategory } = useStore();
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const rootCategories = categories.filter(c => !c.parentId);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(name.trim()) {
        if(editingId) {
            updateCategory({
                id: editingId,
                name: name.trim(),
                image: image || undefined
            });
        } else {
            addCategory({ 
                id: Date.now().toString(), 
                name: name.trim(),
                image: image || undefined
            });
        }
        resetForm();
    }
  };

  const handleEdit = (cat: Category) => {
      setName(cat.name);
      setImage(cat.image || '');
      setEditingId(cat.id);
  };

  const resetForm = () => {
      setName('');
      setImage('');
      setEditingId(null);
  }

  return (
    <div className="max-w-5xl mx-auto">
       <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full"><ArrowLeft /></button>
        <h2 className="text-2xl font-bold">Manage Categories</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-24">
                <h3 className="font-bold mb-4 text-lg">{editingId ? 'Edit Category' : 'Add New Category'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className={labelClasses}>Category Name</label>
                        <input 
                            className={inputClasses} 
                            placeholder="e.g. Compressors"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className={labelClasses}>Category Image</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"/>
                        {image && <img src={image} alt="Preview" className="mt-3 w-full h-32 object-cover rounded-lg border border-slate-200" />}
                    </div>
                    <div className="flex gap-2">
                        {editingId && (
                             <button type="button" onClick={resetForm} className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-lg hover:bg-slate-200 font-medium transition-colors">Cancel</button>
                        )}
                        <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors">
                            {editingId ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-200 font-bold text-slate-700">
                        <tr>
                            <th className="p-4">Image</th>
                            <th className="p-4">Category Name</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rootCategories.map(c => (
                            <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                <td className="p-4">
                                    {c.image ? (
                                        <img src={c.image} alt={c.name} className="w-12 h-12 object-cover rounded-lg border border-slate-200 bg-white" />
                                    ) : (
                                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold border border-slate-200">
                                            {c.name.charAt(0)}
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 font-medium">{c.name}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(c)} className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-all">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => deleteCategory(c.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {rootCategories.length === 0 && (
                            <tr><td colSpan={3} className="p-8 text-center text-slate-500">No categories found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

// 3. Manage Subcategories
const SubCategoriesManager: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { categories, addCategory, deleteCategory, updateCategory } = useStore();
    const [parentId, setParentId] = useState('');
    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
  
    const rootCategories = categories.filter(c => !c.parentId);
    const subCategories = categories.filter(c => c.parentId);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(name.trim() && parentId) {
          if (editingId) {
             updateCategory({ id: editingId, name: name.trim(), parentId });
          } else {
             addCategory({ id: Date.now().toString(), name: name.trim(), parentId });
          }
          resetForm();
      }
    };

    const handleEdit = (sc: Category) => {
        setName(sc.name);
        setParentId(sc.parentId || '');
        setEditingId(sc.id);
    };

    const resetForm = () => {
        setName('');
        setParentId('');
        setEditingId(null);
    }
  
    return (
      <div className="max-w-5xl mx-auto">
         <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full"><ArrowLeft /></button>
          <h2 className="text-2xl font-bold">Manage Subcategories</h2>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-24">
                  <h3 className="font-bold mb-4 text-lg">{editingId ? 'Edit Subcategory' : 'Add Subcategory'}</h3>
                  <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className={labelClasses}>Parent Category</label>
                        <select 
                            className={inputClasses}
                            value={parentId}
                            onChange={e => setParentId(e.target.value)}
                            required
                        >
                            <option value="">Select Parent</option>
                            {rootCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="mb-6">
                          <label className={labelClasses}>Subcategory Name</label>
                          <input 
                              className={inputClasses} 
                              placeholder="e.g. Scroll Compressors"
                              value={name}
                              onChange={e => setName(e.target.value)}
                              required
                          />
                      </div>
                      <div className="flex gap-2">
                        {editingId && (
                             <button type="button" onClick={resetForm} className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-lg hover:bg-slate-200 font-medium transition-colors">Cancel</button>
                        )}
                        <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors">
                            {editingId ? 'Update' : 'Add'}
                        </button>
                      </div>
                  </form>
              </div>
          </div>
          <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left">
                      <thead className="bg-slate-50/50 border-b border-slate-200 font-bold text-slate-700">
                          <tr>
                              <th className="p-4">Subcategory</th>
                              <th className="p-4">Parent Category</th>
                              <th className="p-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          {subCategories.map(sc => {
                              const parent = rootCategories.find(rc => rc.id === sc.parentId);
                              return (
                                <tr key={sc.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 font-medium">{sc.name}</td>
                                    <td className="p-4 text-slate-500"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-semibold">{parent?.name || 'Unknown'}</span></td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(sc)} className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-all">
                                                <Pencil size={18} />
                                            </button>
                                            <button onClick={() => deleteCategory(sc.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                              );
                          })}
                          {subCategories.length === 0 && (
                            <tr><td colSpan={3} className="p-8 text-center text-slate-500">No subcategories found.</td></tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
        </div>
      </div>
    );
};

// 4. Manage Brands
const BrandsManager: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { brands, addBrand, deleteBrand, updateBrand } = useStore();
    const [name, setName] = useState('');
    const [logo, setLogo] = useState('');
    const [pdf, setPdf] = useState('');
    const [pdfInputType, setPdfInputType] = useState<'url' | 'file'>('url');
    const [editingId, setEditingId] = useState<string | null>(null);
  
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if(file) {
        const reader = new FileReader();
        reader.onloadend = () => setLogo(reader.result as string);
        reader.readAsDataURL(file);
      }
    };

    const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if(file) {
        // Warning about file size for local storage
        if(file.size > 2 * 1024 * 1024) {
           alert("File is too large for this demo (limit 2MB). Please use a URL instead.");
           return;
        }
        const reader = new FileReader();
        reader.onloadend = () => setPdf(reader.result as string);
        reader.readAsDataURL(file);
      }
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(name.trim()) {
          const brandData = {
            id: editingId || Date.now().toString(),
            name: name.trim(),
            logo: logo || undefined,
            cataloguePdf: pdf || undefined
          };

          if (editingId) {
             updateBrand(brandData);
          } else {
             addBrand(brandData);
          }
          resetForm();
      }
    };

    const handleEdit = (b: Brand) => {
        setName(b.name);
        setLogo(b.logo || '');
        setPdf(b.cataloguePdf || '');
        setEditingId(b.id);
        setPdfInputType('url');
    };

    const resetForm = () => {
        setName('');
        setLogo('');
        setPdf('');
        setEditingId(null);
    }
  
    return (
      <div className="max-w-5xl mx-auto">
         <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full"><ArrowLeft /></button>
          <h2 className="text-2xl font-bold">Manage Brands</h2>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-24">
                  <h3 className="font-bold mb-4 text-lg">{editingId ? 'Edit Brand' : 'Add New Brand'}</h3>
                  <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                          <label className={labelClasses}>Brand Name</label>
                          <input 
                              className={inputClasses} 
                              placeholder="e.g. Danfoss"
                              value={name}
                              onChange={e => setName(e.target.value)}
                              required
                          />
                      </div>
                      <div className="mb-4">
                          <label className={labelClasses}>Brand Logo</label>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"/>
                          {logo && <img src={logo} alt="Preview" className="mt-3 w-full h-16 object-contain rounded-lg border border-slate-200 bg-slate-50" />}
                      </div>
                      
                      <div className="mb-6">
                         <label className={labelClasses}>Catalogue PDF</label>
                         <div className="flex gap-2 mb-2">
                            <button type="button" onClick={() => setPdfInputType('url')} className={`flex-1 py-1.5 text-xs font-semibold rounded ${pdfInputType === 'url' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>URL Link</button>
                            <button type="button" onClick={() => setPdfInputType('file')} className={`flex-1 py-1.5 text-xs font-semibold rounded ${pdfInputType === 'file' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>Upload File</button>
                         </div>
                         
                         {pdfInputType === 'url' ? (
                            <input 
                              className={inputClasses}
                              placeholder="https://example.com/catalogue.pdf"
                              value={pdf}
                              onChange={e => setPdf(e.target.value)}
                            />
                         ) : (
                            <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"/>
                         )}
                         {pdf && <div className="mt-2 text-xs text-green-600 font-semibold flex items-center gap-1"><FileText size={12}/> PDF Attached</div>}
                      </div>

                      <div className="flex gap-2">
                        {editingId && (
                             <button type="button" onClick={resetForm} className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-lg hover:bg-slate-200 font-medium transition-colors">Cancel</button>
                        )}
                        <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors">
                            {editingId ? 'Update' : 'Add'}
                        </button>
                      </div>
                  </form>
              </div>
          </div>
          <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left">
                      <thead className="bg-slate-50/50 border-b border-slate-200 font-bold text-slate-700">
                          <tr>
                              <th className="p-4">Logo</th>
                              <th className="p-4">Brand Name</th>
                              <th className="p-4">Catalogue</th>
                              <th className="p-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          {brands.map(b => (
                              <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                  <td className="p-4">
                                     {b.logo ? (
                                        <img src={b.logo} alt={b.name} className="w-16 h-8 object-contain" />
                                     ) : (
                                        <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-xs font-bold text-slate-400">
                                            {b.name.charAt(0)}
                                        </div>
                                     )}
                                  </td>
                                  <td className="p-4 font-medium">{b.name}</td>
                                  <td className="p-4">
                                     {b.cataloguePdf ? (
                                        <a href={b.cataloguePdf} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs flex items-center gap-1">
                                           <FileText size={14} /> View PDF
                                        </a>
                                     ) : (
                                        <span className="text-slate-400 text-xs italic">None</span>
                                     )}
                                  </td>
                                  <td className="p-4 text-right">
                                      <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(b)} className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-all">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => deleteBrand(b.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
        </div>
      </div>
    );
};

// 5. Price Queries
const PriceQueriesManager: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { quotes, updateQuoteStatus, products } = useStore();

    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full"><ArrowLeft /></button>
          <h2 className="text-2xl font-bold">Price Queries</h2>
        </div>
        <div className="grid gap-6">
          {quotes.length === 0 && <p className="text-slate-500 text-center py-10">No quotes received yet.</p>}
          {quotes.map(quote => (
            <div key={quote.id} className={`bg-white p-6 rounded-xl border transition-shadow ${quote.status === 'new' ? 'border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500' : 'border-slate-200 shadow-sm hover:shadow-md'}`}>
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <h3 className="font-bold text-lg text-slate-900">{quote.customerName}</h3>
                   <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                      <span>{new Date(quote.date).toLocaleDateString()}</span>
                      <span className="text-slate-300">|</span>
                      <span>{quote.customerEmail}</span>
                      <span className="text-slate-300">|</span>
                      <span>{quote.customerPhone}</span>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-2">
                   <select 
                      value={quote.status} 
                      onChange={(e) => updateQuoteStatus(quote.id, e.target.value as any)}
                      className={`text-sm font-semibold py-1.5 pl-3 pr-8 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1em_1em] transition-colors ${
                        quote.status === 'new' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        quote.status === 'viewed' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                        quote.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-700'
                      }`}
                      style={{backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")'}}
                   >
                     <option value="new">Pending</option>
                     <option value="viewed">Viewed</option>
                     <option value="completed">Completed</option>
                   </select>
                 </div>
               </div>
               
               {quote.message && (
                <div className="bg-slate-50 p-4 rounded-lg mb-4 text-slate-700 border border-slate-100 italic">
                    <span className="font-semibold text-xs uppercase text-slate-400 block mb-1 not-italic">Message</span>
                    "{quote.message}"
                </div>
               )}
  
               <h4 className="font-semibold text-sm mb-3 text-slate-900 border-b border-slate-100 pb-2">Requested Items</h4>
               <ul className="space-y-2">
                 {quote.items.map(item => {
                   const p = products.find(prod => prod.id === item.productId);
                   return (
                     <li key={item.productId} className="flex justify-between text-sm bg-slate-50/50 p-2 rounded-lg">
                        <span className="text-slate-700">{p?.name} <span className="text-slate-400">({p?.sku})</span></span>
                        <span className="font-bold bg-white px-2 py-0.5 rounded border border-slate-200">x{item.quantity}</span>
                     </li>
                   );
                 })}
               </ul>
            </div>
          ))}
        </div>
      </div>
    );
};

// 6. General Queries
const GeneralQueriesManager: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { contactMessages, markContactAsRead } = useStore();

    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full"><ArrowLeft /></button>
          <h2 className="text-2xl font-bold">General Queries</h2>
        </div>
        <div className="grid gap-6">
          {contactMessages.length === 0 && <p className="text-slate-500 text-center py-10">No messages received yet.</p>}
          {contactMessages.map(msg => (
            <div key={msg.id} className={`bg-white p-6 rounded-xl border transition-shadow ${msg.status === 'new' ? 'border-red-500 shadow-lg shadow-red-500/10 ring-1 ring-red-500' : 'border-slate-200 shadow-sm hover:shadow-md'}`}>
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <h3 className="font-bold text-lg text-slate-900">{msg.name}</h3>
                   <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                      <span>{new Date(msg.date).toLocaleDateString()}</span>
                      <span className="text-slate-300">|</span>
                      <span>{msg.email}</span>
                      <span className="text-slate-300">|</span>
                      <span>{msg.phone}</span>
                   </div>
                   <div className="mt-2">
                       <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md font-semibold border border-blue-100 uppercase tracking-wide">{msg.service}</span>
                   </div>
                 </div>
                 {msg.status === 'new' ? (
                   <button 
                     onClick={() => markContactAsRead(msg.id)}
                     className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-red-700 shadow-sm hover:shadow transition-all"
                   >
                     Mark Read
                   </button>
                 ) : (
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold uppercase">Read</span>
                 )}
               </div>
               
               <div className="bg-slate-50 p-4 rounded-lg text-slate-700 border border-slate-100">
                 {msg.message}
               </div>
            </div>
          ))}
        </div>
      </div>
    );
};

// ... existing ViewState type ...
type ViewState = 'dashboard' | 'products' | 'categories' | 'subcategories' | 'brands' | 'price-queries' | 'general-queries';

const Admin: React.FC = () => {
  const { isAdmin, loginAdmin, logoutAdmin, products, categories, brands, quotes, contactMessages } = useStore();
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const navigate = useNavigate();

  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if(loginAdmin(username, password)) {
        setError('');
        setUsername('');
        setPassword('');
    } else {
        setError('Invalid ID or Password');
    }
  }

  // Redirect if logged out
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm border border-slate-200">
          <div className="text-center mb-6">
            <ShieldCheck size={48} className="mx-auto text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">Admin Portal</h2>
            <p className="text-slate-500 text-sm">Restricted Access</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
              <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Admin ID</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter Admin ID"
                  />
              </div>
              <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter Password"
                  />
              </div>

              {error && (
                  <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded border border-red-100">
                      {error}
                  </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-lg shadow-blue-600/20"
              >
                Secure Login
              </button>
          </form>

          <button onClick={() => navigate('/')} className="w-full mt-4 text-slate-400 hover:text-slate-600 text-sm">
            Back to Website
          </button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const pendingQuotes = quotes.filter(q => q.status === 'new').length;
  const pendingMessages = contactMessages.filter(m => m.status === 'new').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-1.5 rounded-lg"><ShieldCheck className="text-white" size={20} /></div>
             <h1 className="text-xl font-bold tracking-wide">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-6">
             <span className="text-sm text-slate-400 hidden sm:block">admin@stallionaircon.com</span>
             <button 
                onClick={() => { logoutAdmin(); navigate('/'); }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
             >
                <LogOut size={16} /> Logout
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {currentView === 'dashboard' && (
          <div className="animate-fade-in-up">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <StatCard label="Total Products" value={products.length} icon={<Package size={20} />} />
              <StatCard label="Categories" value={categories.filter(c => !c.parentId).length} icon={<Layers size={20} />} />
              <StatCard label="Brands" value={brands.length} icon={<Tag size={20} />} />
              <StatCard label="Pending Price Queries" value={pendingQuotes} icon={<MessageSquare size={20} />} isAlert={pendingQuotes > 0} />
              <StatCard label="Pending General Queries" value={pendingMessages} icon={<MessageSquare size={20} />} isAlert={pendingMessages > 0} />
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ActionCard 
                title="Manage Products" 
                desc="Add, edit, or delete products from the catalog" 
                icon={<Package size={32} className="text-blue-900" />} 
                onClick={() => setCurrentView('products')}
              />
              <ActionCard 
                title="Manage Categories" 
                desc="Add, edit, or delete product categories" 
                icon={<Layers size={32} className="text-blue-400" />} 
                onClick={() => setCurrentView('categories')}
              />
              <ActionCard 
                title="Manage Subcategories" 
                desc="Organize subcategories within categories" 
                icon={<FolderTree size={32} className="text-blue-600" />} 
                onClick={() => setCurrentView('subcategories')}
              />
              <ActionCard 
                title="Manage Brands" 
                desc="Add and manage product brands" 
                icon={<Building size={32} className="text-slate-600" />} 
                onClick={() => setCurrentView('brands')}
              />
              <ActionCard 
                title="Price Queries" 
                desc="View and respond to customer price requests" 
                icon={<MessageSquare size={32} className="text-red-500" />} 
                onClick={() => setCurrentView('price-queries')}
                badge={pendingQuotes > 0 ? pendingQuotes : undefined}
              />
              <ActionCard 
                title="General Queries" 
                desc="View contact form messages and general inquiries" 
                icon={<MessageSquare size={32} className="text-yellow-500" />} 
                onClick={() => setCurrentView('general-queries')}
                badge={pendingMessages > 0 ? pendingMessages : undefined}
              />
            </div>
          </div>
        )}

        {/* Specific Views */}
        {currentView === 'products' && <ProductsManager onBack={() => setCurrentView('dashboard')} />}
        {currentView === 'categories' && <CategoriesManager onBack={() => setCurrentView('dashboard')} />}
        {currentView === 'subcategories' && <SubCategoriesManager onBack={() => setCurrentView('dashboard')} />}
        {currentView === 'brands' && <BrandsManager onBack={() => setCurrentView('dashboard')} />}
        {currentView === 'price-queries' && <PriceQueriesManager onBack={() => setCurrentView('dashboard')} />}
        {currentView === 'general-queries' && <GeneralQueriesManager onBack={() => setCurrentView('dashboard')} />}

      </main>
    </div>
  );
};

// --- Helper Components for Dashboard ---

const StatCard: React.FC<{ label: string; value: number; icon: React.ReactNode; isAlert?: boolean }> = ({ label, value, icon, isAlert }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between h-28 relative overflow-hidden transition-all hover:shadow-md">
    <div className="flex justify-between items-start">
       <div className={`p-2 rounded-xl ${isAlert ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
         {icon}
       </div>
       <span className={`text-3xl font-extrabold ${isAlert ? 'text-red-600' : 'text-slate-800'}`}>{value}</span>
    </div>
    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-2">{label}</span>
  </div>
);

const ActionCard: React.FC<{ title: string; desc: string; icon: React.ReactNode; onClick: () => void; badge?: number }> = ({ title, desc, icon, onClick, badge }) => (
  <button 
    onClick={onClick}
    className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all text-left group relative h-full"
  >
    {badge !== undefined && (
        <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-bounce">
            {badge} New
        </span>
    )}
    <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300 origin-left">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </button>
);

export default Admin;