import React from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Package, Clock, FileText, ShoppingBasket } from 'lucide-react';

const Profile: React.FC = () => {
  const { currentUser, logoutUser, quotes, products } = useStore();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  // Filter quotes for current user
  const myQuotes = quotes.filter(
    q => q.userId === currentUser.id || q.customerEmail === currentUser.email
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-80 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                <User size={40} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
              <p className="text-slate-500 text-sm mb-6">{currentUser.email}</p>
              
              <div className="space-y-4 text-left border-t border-slate-100 pt-6">
                 <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase">Phone</span>
                    <p className="text-slate-800">{currentUser.phone}</p>
                 </div>
                 <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase">Member Since</span>
                    <p className="text-slate-800">{new Date(currentUser.joinedDate).toLocaleDateString()}</p>
                 </div>
              </div>

              <button 
                onClick={handleLogout}
                className="mt-8 w-full py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Quote History</h1>
            
            {myQuotes.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
                 <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText size={32} />
                 </div>
                 <h3 className="text-lg font-semibold text-slate-900 mb-2">No Quotes Yet</h3>
                 <p className="text-slate-500 mb-6">You haven't requested any price quotes yet.</p>
                 <Link to="/shop" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    <ShoppingBasket size={18} /> Browse Shop
                 </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {myQuotes.map(quote => (
                  <div key={quote.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="font-bold text-lg text-slate-800">Quote #{quote.id.slice(-6)}</span>
                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                               quote.status === 'completed' 
                                 ? 'bg-green-100 text-green-700' 
                                 : quote.status === 'viewed' 
                                   ? 'bg-yellow-100 text-yellow-700' 
                                   : 'bg-blue-100 text-blue-700'
                             }`}>
                               {quote.status === 'new' ? 'Pending' : quote.status === 'viewed' ? 'Viewed' : quote.status === 'completed' ? 'Completed' : 'Processing'}
                             </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                             <Clock size={14} />
                             {new Date(quote.date).toLocaleDateString()} at {new Date(quote.date).toLocaleTimeString()}
                          </div>
                       </div>
                    </div>
                    
                    <div className="p-6">
                       <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">Items Requested</h4>
                       <div className="space-y-3">
                          {quote.items.map((item, idx) => {
                             // Hydrate product details if missing
                             const product = item.product || products.find(p => p.id === item.productId);
                             return (
                               <div key={idx} className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg">
                                  {product && (
                                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover border border-slate-200" />
                                  )}
                                  <div className="flex-1">
                                     <p className="font-medium text-slate-900">{product?.name || 'Unknown Product'}</p>
                                     <p className="text-xs text-slate-500">SKU: {product?.sku}</p>
                                  </div>
                                  <div className="font-bold text-slate-700 bg-white px-3 py-1 rounded shadow-sm border border-slate-100">
                                     x{item.quantity}
                                  </div>
                               </div>
                             );
                          })}
                       </div>
                       {quote.message && (
                          <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-100">
                             <span className="font-bold block mb-1">Your Note:</span>
                             {quote.message}
                          </div>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;