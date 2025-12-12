import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Wind, Phone, ShoppingBasket, ShieldCheck, User as UserIcon, LogIn, Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { basket, isAdmin, currentUser } = useStore();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop Parts', path: '/shop' },
    { name: 'Catalogues', path: '/catalogues' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Admin Panel', path: '/admin' });
  }

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-2 rounded-xl shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/40 transition-all duration-300">
                <Wind className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-slate-800 tracking-tight leading-none group-hover:text-blue-700 transition-colors">STALLION<span className="text-blue-600"> AIR CON</span></span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">HVAC & Ref Spare Parts</span>
              </div>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="w-full relative group">
              <input
                type="text"
                placeholder="Search for parts, brands, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder-slate-400 text-sm"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
            </form>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 flex-shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                  isActive(link.path)
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            <Link to="/basket" className="relative group p-2 rounded-full hover:bg-slate-100 transition-colors">
              <div className="text-slate-600 group-hover:text-blue-600 transition-colors">
                <ShoppingBasket size={22} />
                {basket.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full shadow-sm border border-white">
                    {basket.length}
                  </span>
                )}
              </div>
            </Link>

            {/* User Profile / Login */}
            {currentUser ? (
              <Link 
                to="/profile" 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  isActive('/profile') ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-blue-600 hover:border-slate-200'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <UserIcon size={14} />
                </div>
                <span className="max-w-[80px] truncate hidden lg:block">{currentUser.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link 
                to="/login"
                className={`p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors ${isActive('/login') ? 'text-blue-600 bg-blue-50' : ''}`}
                title="Login / Register"
              >
                <LogIn size={22} />
              </Link>
            )}

            <Link
              to="/shop"
              className="hidden xl:flex bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 items-center gap-2"
            >
              <Phone size={16} />
              Get Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-3 md:hidden">
             <button onClick={() => navigate('/shop?search=')} className="text-slate-600 p-2">
                 <Search size={24} />
             </button>
            <Link to="/basket" className="relative text-slate-600 p-2">
               <ShoppingBasket size={24} />
               {basket.length > 0 && (
                  <span className="absolute 0 top-0 right-0 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                    {basket.length}
                  </span>
                )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-blue-600 hover:bg-slate-100 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-xl absolute w-full left-0 top-20 h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="px-4 py-6 space-y-4">
            
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            </form>

            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium ${
                    isActive(link.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2">
              {currentUser ? (
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                >
                  <UserIcon size={20} /> My Profile
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                >
                  <LogIn size={20} /> Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;