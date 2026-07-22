import React from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const { products, wishlistIds, navigateTo } = useStore();

  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));

  if (savedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-red-100">
          <Heart className="w-10 h-10 fill-current" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-gray-900">Your Wishlist is Empty</h2>
        <p className="text-xs text-gray-500 mt-2 mb-6 max-w-sm mx-auto">
          Save your favorite dry fruits and organic groceries to buy later.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all"
        >
          Explore Catalog & Save Favorites
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-gray-900">Your Saved Wishlist</h1>
        <p className="text-xs text-gray-500">{savedProducts.length} items saved in your collection</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {savedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
