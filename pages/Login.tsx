import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { loginUser, registerUser } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = loginUser(formData.email, formData.password);
      if (success) {
        navigate('/profile');
      } else {
        setError('Invalid email or password');
      }
    } else {
      // Register logic
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 4) {
        setError('Password must be at least 4 characters');
        return;
      }
      
      // Simple register
      try {
        registerUser({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          address: ''
        });
        navigate('/profile');
      } catch (e) {
        setError('Registration failed. Email might be in use.');
      }
    }
  };

  const inputContainerClass = "relative";
  const inputClass = "appearance-none block w-full pl-10 px-4 py-3.5 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm";
  const iconClass = "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50">
        <div>
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
             {isLogin ? <Lock className="text-blue-600" /> : <User className="text-blue-600" />}
          </div>
          <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            {isLogin ? 'Sign in to access your quote history' : 'Join Stallion Air Con for faster checkouts'}
          </p>
        </div>
        
        {/* Toggle */}
        <div className="flex bg-slate-100/80 p-1.5 rounded-xl">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
              isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
              !isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Register
          </button>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className={inputContainerClass}>
                  <div className={iconClass}><User className="h-5 w-5" /></div>
                  <input
                    name="name"
                    type="text"
                    required
                    className={inputClass}
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className={inputContainerClass}>
                  <div className={iconClass}><Phone className="h-5 w-5" /></div>
                  <input
                    name="phone"
                    type="tel"
                    required
                    className={inputClass}
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            
            <div className={inputContainerClass}>
              <div className={iconClass}><Mail className="h-5 w-5" /></div>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className={inputClass}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className={inputContainerClass}>
              <div className={iconClass}><Lock className="h-5 w-5" /></div>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={inputClass}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {!isLogin && (
               <div className={inputContainerClass}>
                 <div className={iconClass}><Lock className="h-5 w-5" /></div>
                 <input
                   name="confirmPassword"
                   type="password"
                   required
                   className={inputClass}
                   placeholder="Confirm Password"
                   value={formData.confirmPassword}
                   onChange={handleChange}
                 />
               </div>
            )}

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100 font-medium animate-pulse">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <span className="absolute right-0 inset-y-0 flex items-center pr-4">
                <ArrowRight className="h-5 w-5 text-blue-200 group-hover:text-white transition-colors" aria-hidden="true" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;