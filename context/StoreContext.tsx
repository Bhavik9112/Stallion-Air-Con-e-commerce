import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Brand, BasketItem, QuoteRequest, ContactMessage, User } from '../types';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  basket: BasketItem[];
  quotes: QuoteRequest[];
  contactMessages: ContactMessage[];
  isAdmin: boolean;
  currentUser: User | null;
  users: User[];
  
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
  
  loginUser: (email: string, password: string) => boolean;
  registerUser: (userData: Omit<User, 'id' | 'joinedDate'>) => void;
  logoutUser: () => void;
  updateUserProfile: (data: Partial<User>) => void;

  addToBasket: (productId: string, quantity: number) => void;
  removeFromBasket: (productId: string) => void;
  clearBasket: () => void;
  submitQuote: (customer: { name: string; email: string; phone: string; message: string }) => void;
  submitContactMessage: (data: Omit<ContactMessage, 'id' | 'date' | 'status'>) => void;
  
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addBrand: (brand: Brand) => void;
  updateBrand: (brand: Brand) => void;
  deleteBrand: (id: string) => void;
  updateQuoteStatus: (id: string, status: QuoteRequest['status']) => void;
  markContactAsRead: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Mock Initial Data
const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Compressors', image: 'https://images.unsplash.com/photo-1542385157-e6ae8f172558?auto=format&fit=crop&q=80&w=300&h=200' },
  { id: 'c2', name: 'Refrigerant Gases', image: 'https://images.unsplash.com/photo-1624823183488-299f18d7f25e?auto=format&fit=crop&q=80&w=300&h=200' },
  { id: 'c3', name: 'Copper Pipes & Fittings', image: 'https://images.unsplash.com/photo-1533756950285-484bf27da346?auto=format&fit=crop&q=80&w=300&h=200' },
  { id: 'c4', name: 'Tools', image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=300&h=200' },
  { id: 'c5', name: 'Valves', image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a78e?auto=format&fit=crop&q=80&w=300&h=200' },
  // Subcategories mock
  { id: 'sc1', name: 'Scroll Compressors', parentId: 'c1' },
  { id: 'sc2', name: 'Rotary Compressors', parentId: 'c1' },
  { id: 'sc3', name: 'R410A', parentId: 'c2' },
  { id: 'sc4', name: 'R32', parentId: 'c2' },
];

const INITIAL_BRANDS: Brand[] = [
  { 
    id: 'b1', 
    name: 'Danfoss', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Danfoss_logo.svg/2560px-Danfoss_logo.svg.png',
    cataloguePdf: 'https://assets.danfoss.com/documents/latest/195029/AI382949757657en-000101.pdf'
  },
  { 
    id: 'b2', 
    name: 'Copeland', 
    logo: 'https://logovector.net/wp-content/uploads/2014/06/Copeland-Brand-logo.png',
    cataloguePdf: 'https://climate.emerson.com/documents/copeland-scroll-compressors-for-air-conditioning-product-catalogue-en-4206680.pdf'
  },
  { 
    id: 'b3', 
    name: 'Emerson', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Emerson_Electric_Company_logo.svg/2560px-Emerson_Electric_Company_logo.svg.png' 
  },
  { 
    id: 'b4', 
    name: 'TotalLine', 
    logo: 'https://www.totaline.com.ar/wp-content/uploads/2019/07/logo-header.png' 
  },
  { 
    id: 'b5', 
    name: 'Honeywell', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Honeywell_logo.svg/2560px-Honeywell_logo.svg.png' 
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Copeland Scroll Compressor ZR61',
    description: 'High efficiency scroll compressor for HVAC applications. 5 Ton capacity, 3 Phase.',
    sku: 'ZR61K3-TFD',
    categoryId: 'c1',
    subCategoryId: 'sc1',
    brandId: 'b2',
    image: 'https://picsum.photos/seed/compressor1/400/400',
    status: 'active',
    pdf: 'https://climate.emerson.com/documents/copeland-scroll-compressors-for-air-conditioning-product-catalogue-en-4206680.pdf'
  },
  {
    id: 'p2',
    name: 'Danfoss Expansion Valve TE-5',
    description: 'Thermostatic expansion valve for R410A systems. Reliable superheat control.',
    sku: '068Z3209',
    categoryId: 'c5',
    brandId: 'b1',
    image: 'https://picsum.photos/seed/valve1/400/400',
    status: 'active',
    pdf: 'https://assets.danfoss.com/documents/latest/195029/AI382949757657en-000101.pdf'
  },
  {
    id: 'p3',
    name: 'R410A Refrigerant Gas (11.3kg)',
    description: 'High purity R410A refrigerant cylinder. Standard fit for modern AC units.',
    sku: 'REF-410A',
    categoryId: 'c2',
    subCategoryId: 'sc3',
    brandId: 'b4',
    image: 'https://picsum.photos/seed/gas1/400/400',
    status: 'active'
  },
  {
    id: 'p4',
    name: 'Digital Manifold Gauge Set',
    description: 'Professional digital manifold for accurate pressure and temperature readings.',
    sku: 'TOOL-DIGI-01',
    categoryId: 'c4',
    brandId: 'b5',
    image: 'https://picsum.photos/seed/tool1/400/400',
    status: 'active'
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage if available, otherwise use defaults
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('stallion_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('stallion_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });
  
  const [brands, setBrands] = useState<Brand[]>(() => {
    const saved = localStorage.getItem('stallion_brands');
    return saved ? JSON.parse(saved) : INITIAL_BRANDS;
  });

  const [basket, setBasket] = useState<BasketItem[]>(() => {
    const saved = localStorage.getItem('stallion_basket');
    return saved ? JSON.parse(saved) : [];
  });

  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => {
    const saved = localStorage.getItem('stallion_quotes');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('stallion_messages');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('stallion_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('stallion_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAdmin, setIsAdmin] = useState(false);

  // Persistence Effects
  useEffect(() => localStorage.setItem('stallion_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('stallion_categories', JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem('stallion_brands', JSON.stringify(brands)), [brands]);
  useEffect(() => localStorage.setItem('stallion_basket', JSON.stringify(basket)), [basket]);
  useEffect(() => localStorage.setItem('stallion_quotes', JSON.stringify(quotes)), [quotes]);
  useEffect(() => localStorage.setItem('stallion_messages', JSON.stringify(contactMessages)), [contactMessages]);
  useEffect(() => localStorage.setItem('stallion_users', JSON.stringify(users)), [users]);
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('stallion_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('stallion_currentUser');
    }
  }, [currentUser]);

  // Admin Actions
  const loginAdmin = (username: string, password: string) => {
      if (username === 'admin' && password === 'admin123') {
          setIsAdmin(true);
          return true;
      }
      return false;
  };
  const logoutAdmin = () => setIsAdmin(false);

  // User Actions
  const loginUser = (email: string, password: string): boolean => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const registerUser = (userData: Omit<User, 'id' | 'joinedDate'>) => {
    const newUser: User = {
      id: Date.now().toString(),
      joinedDate: new Date().toISOString(),
      ...userData
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...data };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  // Store Actions
  const addToBasket = (productId: string, quantity: number) => {
    setBasket(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const removeFromBasket = (productId: string) => {
    setBasket(prev => prev.filter(item => item.productId !== productId));
  };

  const clearBasket = () => setBasket([]);

  const submitQuote = (customer: { name: string; email: string; phone: string; message: string }) => {
    const newQuote: QuoteRequest = {
      id: Date.now().toString(),
      userId: currentUser?.id, // Link to current user if logged in
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      message: customer.message,
      items: [...basket],
      date: new Date().toISOString(),
      status: 'new'
    };
    setQuotes(prev => [newQuote, ...prev]);
    clearBasket();
  };

  const submitContactMessage = (data: Omit<ContactMessage, 'id' | 'date' | 'status'>) => {
    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      ...data,
      date: new Date().toISOString(),
      status: 'new'
    };
    setContactMessages(prev => [newMessage, ...prev]);
  };

  // CRUD Actions
  const addProduct = (product: Product) => setProducts(prev => [product, ...prev]);
  const updateProduct = (updated: Product) => setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  
  const addCategory = (cat: Category) => setCategories(prev => [...prev, cat]);
  const updateCategory = (updated: Category) => setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
  const deleteCategory = (id: string) => setCategories(prev => prev.filter(c => c.id !== id));
  
  const addBrand = (brand: Brand) => setBrands(prev => [...prev, brand]);
  const updateBrand = (updated: Brand) => setBrands(prev => prev.map(b => b.id === updated.id ? updated : b));
  const deleteBrand = (id: string) => setBrands(prev => prev.filter(b => b.id !== id));
  
  const updateQuoteStatus = (id: string, status: QuoteRequest['status']) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
  };

  const markContactAsRead = (id: string) => setContactMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' } : m));

  return (
    <StoreContext.Provider value={{
      products, categories, brands, basket, quotes, contactMessages, isAdmin, currentUser, users,
      loginAdmin, logoutAdmin, loginUser, registerUser, logoutUser, updateUserProfile,
      addToBasket, removeFromBasket, clearBasket, submitQuote, submitContactMessage,
      addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory, addBrand, updateBrand, deleteBrand, updateQuoteStatus, markContactAsRead
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};