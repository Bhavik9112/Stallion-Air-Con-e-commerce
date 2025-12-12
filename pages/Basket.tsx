import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Send, ChevronRight, ShoppingBasket } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Basket: React.FC = () => {
  const { basket, products, removeFromBasket, submitQuote, currentUser } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto-fill form if user is logged in
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

  // Hydrate basket items with product details
  const basketItems = basket.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)
  })).filter(item => item.product !== undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuote(formData);
    setIsSubmitted(true);
  };

  const inputClasses = "w-full px-4 py-3 rounded-lg bg-white border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm placeholder-slate-400 text-slate-800";

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-slate-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
            <Send size={36} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Quote Request Sent!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Thank you, <span className="font-semibold text-slate-900">{formData.name}</span>. Our sales team has received your request and will email you the quotation shortly.
            {currentUser && <span className="block mt-4 p-3 bg-blue-50 rounded-lg text-blue-700 text-sm font-medium">You can view this request in your Profile history.</span>}
          </p>
          <div className="flex flex-col gap-3">
            {currentUser ? (
              <Link to="/profile" className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-500/20 transition-all">
                View Quote History
              </Link>
            ) : null}
            <Link to="/" className="text-slate-500 hover:text-slate-800 text-sm font-medium py-2">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (basketItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="text-slate-200 mb-6">
          <ShoppingBasket size={80} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Your Basket is Empty</h2>
        <p className="text-slate-500 mb-8 text-lg">Browse our catalog to add spare parts for quotation.</p>
        <Link to="/shop" className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:-translate-y-1">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">Request Quotation</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                   <ShoppingBasket className="text-blue-600" size={20}/> 
                   Items in Basket ({basketItems.length})
                </h2>
              </div>
              <ul className="divide-y divide-slate-100">
                {basketItems.map((item) => (
                  <li key={item.productId} className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-slate-50/50 transition-colors">
                    <img 
                      src={item.product!.image} 
                      alt={item.product!.name} 
                      className="w-24 h-24 object-cover rounded-xl border border-slate-100 shadow-sm bg-white"
                    />
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-bold text-slate-900 text-lg mb-1">{item.product!.name}</h3>
                      <p className="text-sm text-slate-500 font-mono bg-slate-100 inline-block px-2 py-0.5 rounded">SKU: {item.product!.sku}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-100 px-4 py-2 rounded-lg text-sm font-bold text-slate-700">
                        Qty: {item.quantity}
                      </div>
                      <button 
                        onClick={() => removeFromBasket(item.productId)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-full transition-all"
                        title="Remove"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-6 bg-slate-50 border-t border-slate-100 text-right">
                <Link to="/shop" className="text-blue-600 text-sm font-bold hover:text-blue-800 transition-colors inline-flex items-center gap-1">
                  <Plus size={16} /> Add more items
                </Link>
              </div>
            </div>
          </div>

          {/* Quote Form */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-8 sticky top-24">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Your Details</h3>
                
                {!currentUser && (
                  <div className="mb-6 p-4 bg-blue-50/80 border border-blue-100 rounded-xl text-sm text-blue-800 flex justify-between items-center">
                     <span>Have an account?</span>
                     <Link to="/login" className="font-bold hover:underline bg-white px-3 py-1.5 rounded shadow-sm border border-blue-100 text-blue-600">Login</Link>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Name</label>
                    <input 
                      required
                      type="text"
                      className={inputClasses}
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      disabled={!!currentUser} 
                      placeholder="Your Full Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
                    <input 
                      required
                      type="email"
                      className={inputClasses}
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      disabled={!!currentUser}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone</label>
                    <input 
                      required
                      type="tel"
                      className={inputClasses}
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="Contact Number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Message (Optional)</label>
                    <textarea 
                      rows={3}
                      className={`${inputClasses} resize-none`}
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      placeholder="Any special requirements?"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mt-4"
                  >
                    Submit Request <ChevronRight size={20} />
                  </button>
                  <p className="text-xs text-slate-400 text-center mt-4">
                    By submitting, you agree to our privacy policy.
                  </p>
                </form>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import needed icons
import { Plus } from 'lucide-react';

export default Basket;