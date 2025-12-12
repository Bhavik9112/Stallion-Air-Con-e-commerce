import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBasket, Check, Tag, FileText, Download } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, categories, brands, addToBasket } = useStore();

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <Link to="/shop" className="text-blue-600 hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const category = categories.find(c => c.id === product.categoryId);
  const brand = brands.find(b => b.id === product.brandId);

  const handleAddToBasket = () => {
    addToBasket(product.id, 1);
    navigate('/basket');
  };

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-slate-50 rounded-2xl overflow-hidden p-8 border border-slate-100 flex items-center justify-center">
            <img 
              src={product.image} 
              alt={product.name} 
              className="max-h-[500px] w-auto object-contain shadow-lg rounded-lg"
            />
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {brand?.name}
              </span>
              <span className="bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {category?.name}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
            <p className="text-slate-500 font-mono mb-6">SKU: {product.sku}</p>

            <div className="prose prose-slate mb-8">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {product.pdf && (
              <div className="mb-8">
                <a 
                  href={product.pdf} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                >
                  <FileText size={18} className="text-red-500" /> 
                  Download Spec Sheet (PDF)
                  <Download size={16} className="ml-1 text-slate-400" />
                </a>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                 <Tag className="text-blue-600 mt-1" size={20} />
                 <div>
                   <h4 className="font-semibold text-blue-900">Request for Quotation</h4>
                   <p className="text-sm text-blue-700 mt-1">
                     Prices for this item fluctuate daily based on market rates. 
                     Add to your basket and request a formal quote from our sales team.
                   </p>
                 </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleAddToBasket}
                className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                <ShoppingBasket size={20} />
                Add to Quote Basket
              </button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-100">
               <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                 <Check size={16} /> In Stock & Ready to Ship
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;