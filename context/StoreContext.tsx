
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Brand, BasketItem, QuoteRequest, ContactMessage, User, BrandCatalogue } from '../types';
import { supabase, uploadAsset, dataURIToBlob } from '../services/supabaseClient';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  basket: BasketItem[];
  quotes: QuoteRequest[];
  contactMessages: ContactMessage[];
  isAdmin: boolean;
  currentUser: User | null;
  loading: boolean;
  siteLogo: string;
  
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
  
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (userData: Omit<User, 'id' | 'joinedDate'>) => Promise<void>;
  logoutUser: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;

  addToBasket: (productId: string, quantity: number) => void;
  updateBasketQuantity: (productId: string, quantity: number) => void;
  removeFromBasket: (productId: string) => void;
  clearBasket: () => void;
  submitQuote: (customer: { name: string; email: string; phone: string; message: string }) => Promise<void>;
  submitContactMessage: (data: Omit<ContactMessage, 'id' | 'date' | 'status'>) => Promise<void>;
  
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addBrand: (brand: Omit<Brand, 'id'>) => Promise<void>;
  updateBrand: (brand: Brand) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  updateQuoteStatus: (id: string, status: QuoteRequest['status']) => Promise<void>;
  markContactAsRead: (id: string) => Promise<void>;
  updateSiteLogo: (logoData: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEFAULT_LOGO = "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?auto=format&fit=crop&q=80&w=200";

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [siteLogo, setSiteLogo] = useState<string>(DEFAULT_LOGO);

  const fetchLogo = async () => {
    try {
      const { data } = await supabase.from('settings').select('value').eq('key', 'site_logo').single();
      if (data?.value) setSiteLogo(data.value);
    } catch (e) {
      console.warn('Logo fetch failed');
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await fetchLogo();
      const [pRes, cRes, bRes, qRes, mRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*'),
        supabase.from('brands').select('*'),
        supabase.from('quotes').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
      ]);

      setProducts(pRes.data?.map(p => ({
        id: p.id, 
        name: p.name, 
        description: p.description || '', 
        specifications: p.specifications || '',
        sku: p.sku, 
        categoryId: p.category_id, 
        subCategoryId: p.sub_category_id || undefined,
        // Map singular brand_id to the brandIds array for the UI
        brandIds: p.brand_id ? [p.brand_id] : (p.brand_ids || []), 
        image: p.image || '', 
        status: p.status || 'active', 
        pdf: p.pdf || undefined
      })) || []);

      setCategories(cRes.data?.map(c => ({
        id: c.id, name: c.name, parentId: c.parent_id || undefined, image: c.image || undefined
      })) || []);

      setBrands(bRes.data?.map(b => ({
        id: b.id, 
        name: b.name, 
        logo: b.logo || undefined, 
        catalogues: b.catalogues || [], 
        logoSize: b.logo_size !== undefined ? b.logo_size : 100
      })) || []);

      setQuotes(qRes.data?.map(q => ({
        id: q.id, userId: q.user_id, customerName: q.customer_name, customerEmail: q.customer_email,
        customerPhone: q.customer_phone, message: q.message, items: q.items, date: q.created_at, status: q.status
      })) || []);

      setContactMessages(mRes.data?.map(m => ({
        id: m.id, name: m.name, email: m.email, phone: m.phone, company: m.company,
        service: m.service, message: m.message, date: m.created_at, status: m.status
      })) || []);
    } catch (err) {
      console.error('Fetch all data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const savedBasket = localStorage.getItem('stallion_basket');
    if (savedBasket) setBasket(JSON.parse(savedBasket));
  }, []);

  useEffect(() => {
    localStorage.setItem('stallion_basket', JSON.stringify(basket));
  }, [basket]);

  const loginAdmin = (username: string, password: string) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };
  const logoutAdmin = () => setIsAdmin(false);

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      if (profile) {
        setCurrentUser({
          id: profile.id, name: profile.name, email: profile.email,
          phone: profile.phone, address: profile.address, joinedDate: profile.joined_date
        });
        return true;
      }
    }
    return false;
  };

  const registerUser = async (userData: Omit<User, 'id' | 'joinedDate'>) => {
    const { data, error } = await supabase.auth.signUp({ email: userData.email, password: userData.password! });
    if (error) throw error;
    if (data.user) {
      const newUserProfile = {
        id: data.user.id, name: userData.name, email: userData.email,
        phone: userData.phone, address: userData.address || '', joined_date: new Date().toISOString()
      };
      await supabase.from('profiles').insert(newUserProfile);
      setCurrentUser({
        id: newUserProfile.id,
        name: newUserProfile.name,
        email: newUserProfile.email,
        phone: newUserProfile.phone,
        address: newUserProfile.address,
        joinedDate: newUserProfile.joined_date
      });
    }
  };

  const logoutUser = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!currentUser) return;
    const { error } = await supabase.from('profiles').update(data).eq('id', currentUser.id);
    if (error) throw error;
    setCurrentUser({ ...currentUser, ...data });
  };

  const addToBasket = (productId: string, quantity: number) => {
    setBasket(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { productId, quantity }];
    });
  };

  const updateBasketQuantity = (productId: string, quantity: number) => {
    setBasket(prev => prev.map(item => 
      item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  const removeFromBasket = (productId: string) => {
    setBasket(prev => prev.filter(item => item.productId !== productId));
  };

  const clearBasket = () => {
    setBasket([]);
  };

  const submitQuote = async (customer: { name: string; email: string; phone: string; message: string }) => {
    const quoteData = {
      user_id: currentUser?.id || null,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      message: customer.message,
      items: basket,
      status: 'new'
    };
    const { error } = await supabase.from('quotes').insert(quoteData);
    if (error) throw error;
    clearBasket();
    fetchAllData();
  };

  const submitContactMessage = async (data: Omit<ContactMessage, 'id' | 'date' | 'status'>) => {
    const { error } = await supabase.from('contact_messages').insert({
      ...data,
      status: 'new'
    });
    if (error) throw error;
    fetchAllData();
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    // Determine the primary brand ID to save to the singular brand_id column
    const primaryBrandId = product.brandIds && product.brandIds.length > 0 ? product.brandIds[0] : null;

    const { error } = await supabase.from('products').insert({
      name: product.name,
      description: product.description || '',
      specifications: product.specifications || '',
      sku: product.sku,
      category_id: product.categoryId,
      sub_category_id: product.subCategoryId && product.subCategoryId !== 'all' ? product.subCategoryId : null,
      // Fixed: Using brand_id (singular) to match common schema cache
      brand_id: primaryBrandId,
      image: product.image || '',
      status: product.status || 'active',
      pdf: product.pdf || null
    });
    if (error) {
      console.error('[Supabase Insert Failed]', error);
      throw error;
    }
    await fetchAllData();
  };

  const updateProduct = async (product: Product) => {
    const primaryBrandId = product.brandIds && product.brandIds.length > 0 ? product.brandIds[0] : null;

    const { error } = await supabase.from('products').update({
      name: product.name,
      description: product.description || '',
      specifications: product.specifications || '',
      sku: product.sku,
      category_id: product.categoryId,
      sub_category_id: product.subCategoryId && product.subCategoryId !== 'all' ? product.subCategoryId : null,
      // Fixed: Using brand_id (singular)
      brand_id: primaryBrandId,
      image: product.image || '',
      status: product.status || 'active',
      pdf: product.pdf || null
    }).eq('id', product.id);
    if (error) {
      console.error('[Supabase Update Failed]', error);
      throw error;
    }
    await fetchAllData();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    fetchAllData();
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    const { error } = await supabase.from('categories').insert({
      name: category.name,
      parent_id: category.parentId || null,
      image: category.image || null
    });
    if (error) throw error;
    fetchAllData();
  };

  const updateCategory = async (category: Category) => {
    const { error } = await supabase.from('categories').update({
      name: category.name,
      parent_id: category.parentId || null,
      image: category.image || null
    }).eq('id', category.id);
    if (error) throw error;
    fetchAllData();
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    fetchAllData();
  };

  const addBrand = async (brand: Omit<Brand, 'id'>) => {
    const { error } = await supabase.from('brands').insert({
      name: brand.name,
      logo: brand.logo || null,
      catalogues: brand.catalogues || [],
      logo_size: brand.logoSize || 100
    });
    if (error) throw error;
    fetchAllData();
  };

  const updateBrand = async (brand: Brand) => {
    const { error } = await supabase.from('brands').update({
      name: brand.name,
      logo: brand.logo || null,
      catalogues: brand.catalogues || [],
      logo_size: brand.logoSize || 100
    }).eq('id', brand.id);
    if (error) throw error;
    fetchAllData();
  };

  const deleteBrand = async (id: string) => {
    const { error } = await supabase.from('brands').delete().eq('id', id);
    if (error) throw error;
    fetchAllData();
  };

  const updateQuoteStatus = async (id: string, status: QuoteRequest['status']) => {
    const { error } = await supabase.from('quotes').update({ status }).eq('id', id);
    if (error) throw error;
    fetchAllData();
  };

  const markContactAsRead = async (id: string) => {
    const { error } = await supabase.from('contact_messages').update({ status: 'read' }).eq('id', id);
    if (error) throw error;
    fetchAllData();
  };

  const updateSiteLogo = async (logoData: string) => {
    const { error } = await supabase.from('settings').upsert({ key: 'site_logo', value: logoData });
    if (error) throw error;
    setSiteLogo(logoData);
  };

  return (
    <StoreContext.Provider value={{
      products, categories, brands, basket, quotes, contactMessages,
      isAdmin, currentUser, loading, siteLogo,
      loginAdmin, logoutAdmin, loginUser, registerUser, logoutUser, updateUserProfile,
      addToBasket, updateBasketQuantity, removeFromBasket, clearBasket,
      submitQuote, submitContactMessage,
      addProduct, updateProduct, deleteProduct,
      addCategory, updateCategory, deleteCategory,
      addBrand, updateBrand, deleteBrand,
      updateQuoteStatus, markContactAsRead, updateSiteLogo
    }}>
      {children}
    </StoreContext.Provider>
  );
};
