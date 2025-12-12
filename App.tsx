import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetails from './pages/ProductDetails';
import Basket from './pages/Basket';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Catalogues from './pages/Catalogues';
import WhatsAppButton from './components/WhatsAppButton';
import { StoreProvider } from './context/StoreContext';

// Wrapper to handle scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout component to hide Header/Footer on specific routes if needed, 
// but for now we keep them everywhere except maybe Admin if we wanted a full screen dashboard.
// We'll keep Navbar on Admin for easy navigation back to site.

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen font-sans text-slate-900 bg-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/catalogues" element={<Catalogues />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/basket" element={<Basket />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </Router>
    </StoreProvider>
  );
};

export default App;