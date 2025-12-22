
import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Package, Layers, Building, ArrowLeft, LogOut, Plus, Trash2, Pencil, MessageSquare, 
  LayoutGrid, ImageIcon, Upload, Mail, Phone, Clock, ChevronRight, Search, Eye, 
  CheckCircle, AlertCircle, FileText, Settings as SettingsIcon, BarChart3, ExternalLink,
  X, Check, Loader2, ListChecks, Hash, Briefcase, User as UserIcon, Tag, FileType, 
  Database, ShieldCheck, Globe, FolderTree, ArrowRight, Table as TableIcon, AlignLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product, Category, Brand, QuoteRequest, ContactMessage, BrandCatalogue, BasketItem } from '../types';
import { uploadAsset, dataURIToBlob } from '../services/supabaseClient';
import Logo from '../components/Logo';

// --- Shared Components & Styles ---
const inputClasses = "w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400 font-medium shadow-sm text-sm";
const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1";

type AdminView = 'dashboard' | 'products' | 'categories' | 'brands' | 'quotes' | 'messages' | 'settings';

// --- Dashboard Component ---
const Dashboard: React.FC = () => {
  const { products, brands, quotes, contactMessages, categories } = useStore();
  
  const stats = [
    { label: 'Inventory SKU', value: products.length, icon: <Package className="text-blue-600" /> },
    { label: 'OEM Partners', value: brands.length, icon: <Building className="text-sky-600" /> },
    { label: 'RFQ Pipeline', value: quotes.filter(q => q.status === 'new').length, icon: <FileText className="text-orange-600" /> },
    { label: 'Support Queue', value: contactMessages.filter(m => m.status === 'new').length, icon: <MessageSquare className="text-indigo-600" /> },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-4 rounded-2xl bg-slate-50">{stat.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
            <Clock size={14} /> Priority RFQ Stream
          </h3>
          <div className="space-y-4">
            {quotes.length > 0 ? quotes.slice(0, 5).map(q => (
              <div key={q.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs">RFQ</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{q.customerName}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{q.items.length} Spare parts requested</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${q.status === 'new' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                    {q.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-[2rem]">
                <FileText className="mx-auto text-slate-200 mb-3" size={32} />
                <p className="text-slate-300 font-bold uppercase text-[10px] tracking-widest">No active requests in pipeline</p>
              </div>
            )}
          </div>
        </div>
        <div className="bg-[#0d2e5a] p-8 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
          <Globe className="absolute -right-20 -bottom-20 text-white/5 w-64 h-64 rotate-12" />
          <div className="relative z-10">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-blue-300 mb-6">Taxonomy Health</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-sm font-medium">Main Categories</span>
                <span className="text-sm font-black">{categories.filter(c => !c.parentId).length}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-sm font-medium">Sub-components</span>
                <span className="text-sm font-black">{categories.filter(c => c.parentId).length}</span>
              </div>
            </div>
          </div>
          <div className="pt-8 text-center border-t border-white/10 mt-8 relative z-10">
            <p className="text-[10px] text-blue-200 font-black uppercase tracking-widest mb-4">Enterprise Assets</p>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full w-[24%] transition-all duration-1000"></div>
            </div>
            <p className="text-[9px] mt-2 opacity-50 uppercase tracking-widest font-black">Storage Integrity: 100%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Products Manager ---
const ProductsManager: React.FC = () => {
  const { products, categories, brands, addProduct, updateProduct, deleteProduct } = useStore();
  const [isSaving, setIsSaving] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState<Partial<Product>>({ brandIds: [], status: 'active', specifications: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Structured Specs State (Combined Text and Table)
  const [specOverview, setSpecOverview] = useState('');
  const [specRows, setSpecRows] = useState<{key: string, value: string}[]>([{key: '', value: ''}]);

  useEffect(() => {
    if (editingId) {
      const p = products.find(prod => prod.id === editingId);
      if (p && p.specifications) {
        try {
          const parsed = JSON.parse(p.specifications);
          // New hybrid format check
          if (parsed && typeof parsed === 'object' && 'table' in parsed) {
            setSpecOverview(parsed.overview || '');
            setSpecRows(parsed.table && parsed.table.length > 0 ? parsed.table : [{key: '', value: ''}]);
          } 
          // Legacy array-only format check
          else if (Array.isArray(parsed)) {
            setSpecOverview('');
            setSpecRows(parsed);
          } else {
            setSpecOverview(p.specifications);
            setSpecRows([{key: '', value: ''}]);
          }
        } catch {
          // Plain text fallback
          setSpecOverview(p.specifications);
          setSpecRows([{key: '', value: ''}]);
        }
      } else {
        setSpecOverview('');
        setSpecRows([{key: '', value: ''}]);
      }
    } else {
      setSpecOverview('');
      setSpecRows([{key: '', value: ''}]);
    }
  }, [editingId, products]);

  const addSpecRow = () => setSpecRows([...specRows, {key: '', value: ''}]);
  const removeSpecRow = (idx: number) => setSpecRows(specRows.filter((_, i) => i !== idx));
  const updateSpecRow = (idx: number, field: 'key' | 'value', val: string) => {
    const next = [...specRows];
    next[idx][field] = val;
    setSpecRows(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId || !form.name || !form.sku) {
      setErrorMsg('Required fields missing: Name, SKU, or Category.');
      return;
    }
    
    setIsSaving(true);
    setErrorMsg('');
    setProgressMsg('Uploading technical assets...');

    try {
      let finalImg = form.image || '';
      if (finalImg && finalImg.startsWith('data:')) {
        setProgressMsg('Optimizing product visualization...');
        finalImg = await uploadAsset(dataURIToBlob(finalImg), `p_${form.sku}_img`);
      }
      
      let finalPdf = form.pdf || '';
      if (finalPdf && finalPdf.startsWith('data:')) {
        setProgressMsg('Storing technical manual...');
        finalPdf = await uploadAsset(dataURIToBlob(finalPdf), `p_${form.sku}_doc`);
      }

      // Hybrid specification construction
      const filteredTable = specRows.filter(r => r.key.trim() || r.value.trim());
      const hybridSpecs = JSON.stringify({
        overview: specOverview.trim(),
        table: filteredTable
      });

      const submissionData = { 
        ...form, 
        image: finalImg, 
        pdf: (finalPdf && finalPdf.trim() !== '') ? finalPdf : null,
        brandIds: form.brandIds || [],
        subCategoryId: (form.subCategoryId && form.subCategoryId !== 'all' && form.subCategoryId !== '') ? form.subCategoryId : null,
        description: form.description || '',
        specifications: hybridSpecs,
        status: form.status || 'active'
      } as any;

      setProgressMsg('Syncing with database...');
      if (editingId) {
        await updateProduct({ ...submissionData, id: editingId });
      } else {
        await addProduct(submissionData);
      }
      
      resetForm();
    } catch (err: any) {
      console.error('Save failed:', err);
      setErrorMsg(err.message || 'Data integrity error. Check unique SKU or category IDs.');
    } finally {
      setIsSaving(false);
      setProgressMsg('');
    }
  };

  const resetForm = () => {
    setForm({ brandIds: [], status: 'active', specifications: '', description: '' });
    setSpecRows([{key: '', value: ''}]);
    setSpecOverview('');
    setEditingId(null);
    setErrorMsg('');
    setProgressMsg('');
  };

  const handleBrandToggle = (bid: string) => {
    const current = form.brandIds || [];
    setForm({ ...form, brandIds: current.includes(bid) ? current.filter(id => id !== bid) : [...current, bid] });
  };

  const handleCategoryChange = (catId: string) => {
    setForm({ ...form, categoryId: catId, subCategoryId: undefined });
  };

  const subCats = useMemo(() => {
    if (!form.categoryId) return [];
    return categories.filter(c => c.parentId === form.categoryId);
  }, [form.categoryId, categories]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      <form onSubmit={handleSubmit} className="lg:col-span-5 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-4">
          {editingId ? 'Edit Spare Part' : 'Add New Inventory Item'}
        </h3>
        
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[11px] font-bold">
            <AlertCircle className="inline mr-2" size={14} /> {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClasses}>Part Name</label><input required className={inputClasses} value={form.name||''} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div><label className={labelClasses}>SKU / Model No.</label><input required className={inputClasses} value={form.sku||''} onChange={e => setForm({...form, sku: e.target.value})} /></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Primary Class</label>
            <select required className={inputClasses} value={form.categoryId||''} onChange={e => handleCategoryChange(e.target.value)}>
              <option value="">Select Category</option>
              {categories.filter(c => !c.parentId).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClasses}>Sub-Component</label>
            <select className={inputClasses} value={form.subCategoryId||''} onChange={e => setForm({...form, subCategoryId: e.target.value})} disabled={!form.categoryId}>
              <option value="">None / General</option>
              {subCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClasses}>OEM Manufacturer</label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-100">
            {brands.map(b => (
              <button key={b.id} type="button" onClick={() => handleBrandToggle(b.id)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${form.brandIds?.includes(b.id) ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-200 hover:border-blue-300'}`}>
                {b.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Product Image</label>
            <div className="relative group">
              <input type="file" accept="image/*" className="hidden" id="prod-img" onChange={e => {
                const file = e.target.files?.[0];
                if(file) { const r = new FileReader(); r.onloadend = () => setForm({...form, image: r.result as string}); r.readAsDataURL(file); }
              }} />
              <label htmlFor="prod-img" className="w-full flex items-center justify-center p-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <ImageIcon size={16} className="text-slate-400 mr-2" />
                <span className="text-[10px] font-black uppercase text-slate-400">Select Image</span>
              </label>
            </div>
          </div>
          <div className="flex justify-center items-center h-16 border rounded-xl bg-slate-50 overflow-hidden shadow-inner">
            {form.image ? <img src={form.image} className="max-h-full max-w-full object-contain p-2" /> : <Database size={24} className="text-slate-200" />}
          </div>
        </div>

        <div>
          <label className={labelClasses}>Technical Manual (PDF)</label>
          <div className="relative group">
            <input type="file" accept="application/pdf" className="hidden" id="prod-pdf" onChange={e => {
              const file = e.target.files?.[0];
              if(file) { const r = new FileReader(); r.onloadend = () => setForm({...form, pdf: r.result as string}); r.readAsDataURL(file); }
            }} />
            <label htmlFor="prod-pdf" className={`w-full flex items-center justify-center p-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${form.pdf ? 'border-blue-200 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
              <FileType size={16} className={form.pdf ? 'text-blue-600 mr-2' : 'text-slate-400 mr-2'} />
              <span className={`text-[10px] font-black uppercase ${form.pdf ? 'text-blue-600' : 'text-slate-400'}`}>
                {form.pdf ? 'Manual Loaded' : 'Upload Datasheet'}
              </span>
            </label>
          </div>
        </div>

        <div><label className={labelClasses}>General Description</label><textarea className={`${inputClasses} h-20`} value={form.description||''} onChange={e => setForm({...form, description: e.target.value})} /></div>
        
        {/* Technical Specs Hybrid Builder */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div>
            <label className={labelClasses}>Technical Overview (Text)</label>
            <textarea 
              className={`${inputClasses} h-24`} 
              placeholder="e.g. Optimized for high-ambient temperatures..." 
              value={specOverview} 
              onChange={e => setSpecOverview(e.target.value)} 
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5 ml-1">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Structured Parameters (Table)</label>
               <button type="button" onClick={addSpecRow} className="text-blue-600 hover:text-blue-700 font-black text-[9px] uppercase tracking-widest flex items-center gap-1">
                  <Plus size={10} /> Add Property
               </button>
            </div>
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 scrollbar-hide">
              {specRows.map((row, idx) => (
                <div key={idx} className="flex gap-2 group animate-fade-in">
                  <input 
                    className={`${inputClasses} flex-1 py-2 px-3 font-bold`} 
                    placeholder="Key" 
                    value={row.key} 
                    onChange={e => updateSpecRow(idx, 'key', e.target.value)} 
                  />
                  <input 
                    className={`${inputClasses} flex-1 py-2 px-3`} 
                    placeholder="Value" 
                    value={row.value} 
                    onChange={e => updateSpecRow(idx, 'value', e.target.value)} 
                  />
                  <button type="button" onClick={() => removeSpecRow(idx)} className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button type="submit" disabled={isSaving} className="flex-1 bg-blue-600 text-white p-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/10">
            {isSaving ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={14} />
                <span className="text-[10px]">{progressMsg || 'Processing...'}</span>
              </div>
            ) : (editingId ? 'Update Item' : 'Add to Catalog')}
          </button>
          {editingId && <button type="button" onClick={resetForm} className="p-4 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors"><X size={18}/></button>}
        </div>
      </form>

      <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h4 className="font-black text-xs uppercase text-slate-400 tracking-widest">Global Inventory</h4>
          <span className="text-[10px] font-bold text-slate-400">{products.length} Items Listed</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100"><tr className="text-[10px] font-black uppercase text-slate-400"><th className="p-4">Asset</th><th className="p-4">Classification</th><th className="p-4 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(p => {
                const cat = categories.find(c => c.id === p.categoryId);
                const subCat = categories.find(c => c.id === p.subCategoryId);
                return (
                  <tr key={p.id} className="hover:bg-slate-50 group transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img src={p.image} className="w-10 h-10 object-cover rounded-lg border border-slate-200 shadow-sm" />
                        ) : (
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center"><Package size={16} className="text-slate-300"/></div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                          <p className="text-[10px] font-mono text-blue-600">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit">{cat?.name || 'Uncategorized'}</span>
                        {subCat && (
                          <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                            <ArrowRight size={8} /> {subCat.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setForm({ ...p, brandIds: p.brandIds || [] }); setEditingId(p.id); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={16}/></button>
                        <button onClick={() => { if(confirm('Remove SKU?')) deleteProduct(p.id); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr><td colSpan={3} className="p-20 text-center text-slate-300 font-black uppercase text-[10px]">No records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Categories Manager ---
const CategoriesManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [form, setForm] = useState<Partial<Category>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setIsSaving(true);
    setProgressMsg('Processing assets...');
    
    try {
      let finalImg = form.image || null;
      if (finalImg && finalImg.startsWith('data:')) {
        setProgressMsg('Uploading visualization...');
        finalImg = await uploadAsset(dataURIToBlob(finalImg), `cat_${form.name}_img`);
      }

      const categoryData = { ...form, image: finalImg };

      if (editingId) {
        setProgressMsg('Updating records...');
        await updateCategory({ ...categoryData, id: editingId } as Category);
      } else {
        setProgressMsg('Creating records...');
        await addCategory(categoryData as Omit<Category, 'id'>);
      }
      
      setForm({});
      setEditingId(null);
      setProgressMsg('');
    } catch (err: any) { 
      console.error('Category Save Error:', err);
      alert('Error saving category: ' + (err.message || 'Check connection')); 
    }
    finally { 
      setIsSaving(false); 
      setProgressMsg('');
    }
  };

  const roots = categories.filter(c => !c.parentId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
      <form onSubmit={handleSubmit} className="md:col-span-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-4 h-fit sticky top-24">
        <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">{editingId ? 'Modify Classification' : 'New Classification'}</h3>
        
        <div>
          <label className={labelClasses}>Category Name</label>
          <input required className={inputClasses} value={form.name||''} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Industrial Chillers" />
        </div>

        <div>
          <label className={labelClasses}>Hierarchy Level</label>
          <select className={inputClasses} value={form.parentId||''} onChange={e => setForm({...form, parentId: e.target.value || undefined})}>
            <option value="">Root Category (Parent)</option>
            {roots.filter(r => r.id !== editingId).map(r => (
              <option key={r.id} value={r.id}>Sub-category of: {r.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClasses}>Category Visual</label>
          <div className="grid grid-cols-1 gap-3">
             <div className="relative group">
                <input type="file" accept="image/*" className="hidden" id="cat-img" onChange={e => {
                  const file = e.target.files?.[0];
                  if(file) { 
                    const r = new FileReader(); 
                    r.onloadend = () => setForm({...form, image: r.result as string}); 
                    r.readAsDataURL(file); 
                  }
                }} />
                <label htmlFor="cat-img" className="w-full flex items-center justify-center p-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <ImageIcon size={16} className="text-slate-400 mr-2" />
                  <span className="text-[10px] font-black uppercase text-slate-400">Select Image</span>
                </label>
             </div>
             {form.image && (
               <div className="relative h-24 border rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center group/img">
                  <img src={form.image} className="max-h-full max-w-full object-contain p-2" />
                  <button type="button" onClick={() => setForm({...form, image: undefined})} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <X size={12} />
                  </button>
               </div>
             )}
          </div>
        </div>

        <div className="pt-2 flex gap-2">
          <button type="submit" disabled={isSaving} className="flex-1 bg-blue-600 text-white p-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-2">
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                <span className="text-[10px]">{progressMsg || 'Saving...'}</span>
              </>
            ) : (editingId ? 'Update Identity' : 'Register Class')}
          </button>
          {editingId && (
            <button type="button" onClick={() => {setForm({}); setEditingId(null);}} className="p-4 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors">
              <X size={18} />
            </button>
          )}
        </div>
      </form>

      <div className="md:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h4 className="font-black text-xs uppercase text-slate-400 tracking-widest">Category Hierarchy</h4>
          <span className="text-[10px] font-bold text-slate-400">{categories.length} Classes</span>
        </div>
        <div className="divide-y divide-slate-100">
          {roots.map(root => {
            const children = categories.filter(c => c.parentId === root.id);
            return (
              <div key={root.id} className="bg-white">
                <div className="p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {root.image ? (
                      <img src={root.image} className="w-10 h-10 object-cover rounded-lg border border-slate-100" />
                    ) : (
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <FolderTree size={16} />
                      </div>
                    )}
                    <span className="font-black text-sm text-slate-900 uppercase tracking-tight">{root.name}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setForm(root); setEditingId(root.id); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Pencil size={14}/></button>
                    <button onClick={() => { if(confirm('Delete this parent category?')) deleteCategory(root.id); }} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={14}/></button>
                  </div>
                </div>
                
                {children.length > 0 && (
                  <div className="ml-12 border-l-2 border-slate-100 divide-y divide-slate-50 bg-slate-50/30">
                    {children.map(child => (
                      <div key={child.id} className="p-3 pl-6 flex items-center justify-between group/child hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2">
                          {child.image ? (
                            <img src={child.image} className="w-8 h-8 object-cover rounded-lg border border-slate-100 mr-2" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                          )}
                          <span className="text-xs font-bold text-slate-600">{child.name}</span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover/child:opacity-100 transition-opacity">
                          <button onClick={() => { setForm(child); setEditingId(child.id); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg"><Pencil size={12}/></button>
                          <button onClick={() => { if(confirm('Delete sub-category?')) deleteCategory(child.id); }} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={12}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {roots.length === 0 && (
            <div className="p-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">No root categories defined</div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Brands Manager ---
const BrandsManager: React.FC = () => {
  const { brands, addBrand, updateBrand, deleteBrand } = useStore();
  const [form, setForm] = useState<Partial<Brand>>({ catalogues: [], logoSize: 100 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');

  const sortedBrands = useMemo(() => {
    return [...brands].sort((a, b) => a.name.localeCompare(b.name));
  }, [brands]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return alert('Brand name is required');
    setIsSaving(true);
    setProgressMsg('Initiating...');
    
    try {
      let finalLogo = form.logo || '';
      if (finalLogo && finalLogo.startsWith('data:')) {
        setProgressMsg('Uploading Logo...');
        finalLogo = await uploadAsset(dataURIToBlob(finalLogo), `brand_${form.name}_logo`);
      }

      const finalCatalogues = await Promise.all((form.catalogues || []).map(async (cat, idx) => {
        if (cat.pdf && cat.pdf.startsWith('data:')) {
          setProgressMsg(`Uploading: ${cat.name || 'Catalogue'}...`);
          const pdfUrl = await uploadAsset(dataURIToBlob(cat.pdf), `brand_${form.name}_cat_${idx}`);
          return { name: cat.name || `Catalog ${idx + 1}`, pdf: pdfUrl };
        }
        return cat;
      }));

      const data = { ...form, logo: finalLogo, catalogues: finalCatalogues } as any;
      if (editingId) {
        await updateBrand({ ...data, id: editingId });
      } else {
        await addBrand(data);
      }
      resetForm();
    } catch (err: any) {
      alert(err.message || 'Error saving brand');
    } finally {
      setIsSaving(false);
      setProgressMsg('');
    }
  };

  const resetForm = () => {
    setForm({ catalogues: [], logoSize: 100 });
    setEditingId(null);
  };

  const addCatalogue = () => setForm({ ...form, catalogues: [...(form.catalogues || []), { name: '', pdf: '' }] });
  const removeCatalogue = (i: number) => setForm({ ...form, catalogues: (form.catalogues || []).filter((_, idx) => idx !== i) });
  const updateCatName = (i: number, val: string) => {
    const next = [...(form.catalogues || [])];
    next[i].name = val;
    setForm({ ...form, catalogues: next });
  };
  const handlePdfFile = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const next = [...(form.catalogues || [])];
        next[i].pdf = reader.result as string;
        setForm({ ...form, catalogues: next });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      <form onSubmit={handleSubmit} className="lg:col-span-5 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-2">
          {editingId ? 'Modify Brand Identity' : 'New OEM Partner'}
        </h3>
        
        <div>
          <label className={labelClasses}>Partner Name</label>
          <input required className={inputClasses} value={form.name||''} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Copeland" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Upload Logo</label>
            <input type="file" accept="image/*" className="hidden" id="brand-logo" onChange={e => {
              const file = e.target.files?.[0];
              if(file) { const r = new FileReader(); r.onloadend = () => setForm({...form, logo: r.result as string}); r.readAsDataURL(file); }
            }} />
            <label htmlFor="brand-logo" className="w-full flex items-center justify-center p-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
              <ImageIcon size={16} className="text-slate-400 mr-2" />
              <span className="text-[10px] font-black uppercase text-slate-400">Select Logo</span>
            </label>
          </div>
          <div className="flex justify-center items-center h-16 border rounded-xl bg-slate-50 overflow-hidden shadow-inner p-2">
            {form.logo ? <img src={form.logo} className="max-h-full max-w-full object-contain" /> : <ImageIcon className="text-slate-200" />}
          </div>
        </div>

        <div>
          <label className={labelClasses}>Visual Scale: {form.logoSize}%</label>
          <input type="range" min="50" max="150" value={form.logoSize||100} onChange={e => setForm({...form, logoSize: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
        </div>

        <div className="pt-4 border-t border-slate-100">
           <div className="flex justify-between items-center mb-4">
              <label className={labelClasses}>Technical Resources (Catalogues)</label>
              <button type="button" onClick={addCatalogue} className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors shadow-sm">
                <Plus size={16}/>
              </button>
           </div>
           <div className="space-y-4">
              {form.catalogues?.map((cat, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 relative group animate-fade-in shadow-sm">
                   <button type="button" onClick={() => removeCatalogue(i)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"><X size={12}/></button>
                   <input className="w-full mb-2 p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-500/20" placeholder="Doc Name (e.g. Parts List 2024)" value={cat.name} onChange={e => updateCatName(i, e.target.value)} />
                   <div className="relative">
                     <input type="file" accept="application/pdf" className="hidden" id={`cat-pdf-${i}`} onChange={e => handlePdfFile(i, e)} />
                     <label htmlFor={`cat-pdf-${i}`} className={`w-full flex items-center p-2 rounded-lg text-[10px] font-black uppercase cursor-pointer border-2 border-dashed ${cat.pdf ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-400'}`}>
                        <FileText size={14} className="mr-2" />
                        {cat.pdf ? 'Asset Loaded' : 'Select PDF'}
                     </label>
                   </div>
                </div>
              ))}
              {(!form.catalogues || form.catalogues.length === 0) && (
                <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-2xl">
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No catalogue resources added</p>
                </div>
              )}
           </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={isSaving} className="flex-1 bg-blue-600 text-white p-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/10">
            {isSaving ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={14} />
                <span className="text-[10px]">{progressMsg}</span>
              </div>
            ) : (editingId ? 'Update Partner' : 'Register Partner')}
          </button>
          {editingId && <button type="button" onClick={resetForm} className="p-4 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors"><X size={18}/></button>}
        </div>
      </form>

      <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h4 className="font-black text-xs uppercase text-slate-400 tracking-widest">Global OEM Partners</h4>
          <span className="text-[10px] font-bold text-slate-400">{brands.length} Brands</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100"><tr className="text-[10px] font-black uppercase text-slate-400"><th className="p-4">Partner</th><th className="p-4">Assets</th><th className="p-4 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {sortedBrands.map(b => (
                <tr key={b.id} className="hover:bg-slate-50 group transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg border border-slate-100 flex items-center justify-center p-2 shadow-sm">
                        <img src={b.logo} className="max-w-full max-h-full object-contain" style={{ width: `${(b.logoSize || 100) * 0.8}%` }} />
                      </div>
                      <span className="font-bold text-slate-900">{b.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase">
                        <FileType size={12} /> {b.catalogues?.length || 0} Docs
                     </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setForm({ ...b, catalogues: b.catalogues || [] }); setEditingId(b.id); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={16}/></button>
                      <button onClick={() => { if(confirm('Remove partner?')) deleteBrand(b.id); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Quotes Manager ---
const QuotesManager: React.FC = () => {
  const { quotes, updateQuoteStatus, products } = useStore();

  return (
    <div className="animate-fade-in bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col">
      <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h4 className="font-black text-xs uppercase text-slate-400 tracking-widest">RFQ Processing Center</h4>
        <span className="text-[10px] font-bold text-slate-400">{quotes.length} Requests</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-[10px] font-black uppercase text-slate-400">
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {quotes.map(q => (
              <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-slate-900">{q.customerName}</p>
                  <p className="text-[10px] text-slate-500">{q.customerEmail} | {q.customerPhone}</p>
                  <p className="text-[9px] text-slate-400 mt-1">{new Date(q.date).toLocaleString()}</p>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {q.items.map((item, idx) => {
                      const p = products.find(prod => prod.id === item.productId);
                      return (
                        <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[9px] font-bold">
                          {p?.sku || 'Item'} x{item.quantity}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="p-4">
                  <select 
                    value={q.status} 
                    onChange={(e) => updateQuoteStatus(q.id, e.target.value as QuoteRequest['status'])}
                    className="text-[10px] font-black uppercase bg-slate-100 border-none rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="viewed">Viewed</option>
                    <option value="replied">Replied</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                   <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="View Message">
                      <Eye size={16} />
                   </button>
                </td>
              </tr>
            ))}
            {quotes.length === 0 && (
              <tr><td colSpan={4} className="p-20 text-center text-slate-300 font-black uppercase text-[10px]">No RFQ data available</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main Admin Component ---
const Admin: React.FC = () => {
  const { isAdmin, loginAdmin, logoutAdmin, siteLogo, updateSiteLogo } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginAdmin(username, password)) {
      alert('Access Denied: Invalid Credentials');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0d2e5a] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-fade-in-up border border-white/20">
          <div className="flex flex-col items-center mb-10">
            <Logo className="h-12 mb-4" />
            <h2 className="text-2xl font-black tracking-tighter uppercase text-slate-900">Admin Authentication</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Stallion Air Con Enterprise Systems</p>
          </div>
          <div className="space-y-6">
            <div><label className={labelClasses}>Access Identity</label><input required className={inputClasses} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} /></div>
            <div><label className={labelClasses}>Encryption Key</label><input required type="password" className={inputClasses} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /></div>
            <button type="submit" className="w-full bg-[#0d2e5a] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:bg-blue-800 transition-all flex items-center justify-center gap-2">
              Authorize Login <ChevronRight size={14} />
            </button>
          </div>
        </form>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: <BarChart3 size={18} /> },
    { id: 'products', label: 'Inventory', icon: <Package size={18} /> },
    { id: 'categories', label: 'Taxonomy', icon: <Layers size={18} /> },
    { id: 'brands', label: 'OEM Partners', icon: <Building size={18} /> },
    { id: 'quotes', label: 'RFQ Stream', icon: <FileText size={18} /> },
    { id: 'messages', label: 'Inquiries', icon: <MessageSquare size={18} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <aside className="lg:w-72 bg-[#0d2e5a] lg:sticky lg:top-0 lg:h-screen flex flex-col p-6 text-white shrink-0">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="p-1 bg-white rounded-lg"><Logo className="h-8" /></div>
          <div>
            <p className="font-black text-xs tracking-tighter leading-none">STALLION</p>
            <p className="text-[8px] font-black uppercase text-blue-300 tracking-[0.2em]">Enterprise</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as AdminView)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                activeView === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-blue-100/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <button onClick={logoutAdmin} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 font-bold text-sm hover:bg-red-400/5 rounded-2xl transition-all">
            <LogOut size={18} /> Exit Console
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
              {navItems.find(n => n.id === activeView)?.label}
            </h1>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Management Control Interface</p>
          </div>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-slate-100 hover:shadow-sm transition-all">
            Live Storefront <ExternalLink size={14} />
          </button>
        </header>

        <div className="animate-fade-in min-h-[60vh]">
          {activeView === 'dashboard' && <Dashboard />}
          {activeView === 'brands' && <BrandsManager />}
          {activeView === 'products' && <ProductsManager />}
          {activeView === 'categories' && <CategoriesManager />}
          {activeView === 'quotes' && <QuotesManager />}
          {activeView === 'messages' && (
             <div className="bg-white p-12 rounded-[3.1rem] border border-slate-200 text-center shadow-sm">
                <MessageSquare size={48} className="mx-auto text-slate-100 mb-4" />
                <h3 className="font-black text-slate-900 uppercase">Communication Log</h3>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-2">Connecting to messaging server...</p>
             </div>
          )}
          {activeView === 'settings' && (
            <div className="max-w-2xl bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-10 flex items-center gap-2">
                <SettingsIcon size={14} /> Platform Identity Settings
              </h3>
              <div className="space-y-10">
                <div>
                  <label className={labelClasses}>Site Master Logo (Light Environment)</label>
                  <div className="mt-4 flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 border-dashed">
                    <img src={siteLogo} className="h-16 max-w-[120px] object-contain drop-shadow-sm" />
                    <div className="flex-1">
                       <input type="file" id="site-logo" className="hidden" onChange={e => {
                        const file = e.target.files?.[0];
                        if(file) {
                          const r = new FileReader();
                          r.onloadend = () => updateSiteLogo(r.result as string);
                          r.readAsDataURL(file);
                        }
                      }} />
                      <label htmlFor="site-logo" className="inline-block px-6 py-3 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">Change Identity</label>
                      <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Recommended: 400x120 SVG or PNG</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
