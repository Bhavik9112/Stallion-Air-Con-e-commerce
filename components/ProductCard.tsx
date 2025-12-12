import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToBasket } = useStore();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToBasket(product.id, 1);
  };

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
            RFQ
          </div>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <p className="text-xs text-slate-500 mb-1 font-mono">{product.sku}</p>
          <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
            {product.description}
          </p>
          
          <button 
            onClick={handleAdd}
            className="w-full mt-auto bg-slate-50 hover:bg-blue-600 hover:text-white text-blue-600 border border-blue-200 hover:border-blue-600 font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={16} />
            Add to Quote
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
