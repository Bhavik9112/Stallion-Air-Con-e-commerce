
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Send, ShoppingBasket, Plus, Minus } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Basket: React.FC = () => {
  const { basket, products, removeFromBasket, updateBasketQuantity, submitQuote, currentUser } = useStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone
      }));
    }
  }, [currentUser]);

  const basketItems = basket.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)
  })).filter(item => item.product !== undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitQuote(formData);
    setIsSubmitted(true);
  };

  const inputClasses = "w-full px-4 py-3 rounded-lg bg-white border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm placeholder-slate-400 text-slate-800 font-medium";

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-slate-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
            <Send size={36} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Quote Request Sent!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Thank you, <span className="font-semibold text-slate-900">{formData.name}</span>. Our team will review your request and get back to you with a technical quote.
          </p>
          <button onClick={() => navigate('/')} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold uppercase tracking-widest">Back to Home</button>
        </div>
      </div>
    );
  }

  if (basketItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <ShoppingBasket size={80} className="text-slate-200 mb-6" />
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Your Basket is Empty</h2>
        <Link to="/shop" className="px-10 py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">Browse Spares</Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-slate-900 mb-8 tracking-tight uppercase">Request Technical Quote</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <ul className="divide-y divide-slate-100">
                {basketItems.map((item) => (
                  <li key={item.productId} className="p-6 flex flex-col sm:flex-row items-center gap-6 group hover:bg-slate-50/30 transition-colors">
                    <img src={item.product!.image} className="w-20 h-20 object-cover rounded-xl border border-slate-100" alt="" />
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-bold text-slate-900 mb-1">{item.product!.name}</h3>
                      <p className="text-xs text-slate-400 font-mono">SKU: {item.product!.sku}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button onClick={() => updateBasketQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded text-slate-500"><Minus size={14}/></button>
                        <span className="w-10 text-center font-bold text-slate-800 text-sm">{item.quantity}</span>
                        <button onClick={() => updateBasketQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded text-slate-500"><Plus size={14}/></button>
                      </div>
                      <button onClick={() => removeFromBasket(item.productId)} className="p-2.5 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={20} /></button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
             <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sticky top-24">
                <h3 className="text-xl font-bold text-slate-900 mb-6 uppercase">Your Contact Info</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input required className={inputClasses} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" />
                  <input required type="email" className={inputClasses} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email" />
                  <input required className={inputClasses} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Phone" />
                  <textarea rows={3} className={inputClasses} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Any notes?"></textarea>
                  <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-all uppercase tracking-widest shadow-xl shadow-blue-500/20">Submit RFQ Request</button>
                </form>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Basket;
