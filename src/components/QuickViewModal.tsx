import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { WeightOption } from '../types';
import { X, Star, Sparkles, ShoppingBag, ShieldCheck, Check } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, navigateTo } = useStore();

  const [selectedWeight, setSelectedWeight] = useState<WeightOption | null>(
    quickViewProduct
      ? quickViewProduct.weightOptions.find((w) => w.weight === quickViewProduct.defaultWeight) || quickViewProduct.weightOptions[0]
      : null
  );
  const [activeImage, setActiveImage] = useState<string>(
    quickViewProduct ? quickViewProduct.mainImage : ''
  );
  const [qty, setQty] = useState(1);

  if (!quickViewProduct) return null;

  const currentOption = selectedWeight || quickViewProduct.weightOptions[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images Gallery */}
          <div>
            <div className="h-64 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 mb-3">
              <img
                src={activeImage || quickViewProduct.mainImage}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {quickViewProduct.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                    (activeImage || quickViewProduct.mainImage) === img
                      ? 'border-emerald-600 scale-105'
                      : 'border-gray-200 opacity-70'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-emerald-700 uppercase">
                  {quickViewProduct.subcategory}
                </span>
                <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium">
                  📍 {quickViewProduct.origin}
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 font-serif">{quickViewProduct.name}</h2>
              {quickViewProduct.nameUrdu && (
                <p className="text-sm font-serif text-emerald-800 font-semibold mb-2">{quickViewProduct.nameUrdu}</p>
              )}

              <p className="text-xs text-gray-600 mb-3 line-clamp-3 leading-relaxed">
                {quickViewProduct.shortDescription}
              </p>

              {/* Weight Options */}
              <div className="mb-4">
                <span className="text-xs font-bold text-gray-500 block mb-1.5">Select Weight Variant:</span>
                <div className="flex flex-wrap gap-1.5">
                  {quickViewProduct.weightOptions.map((opt) => (
                    <button
                      key={opt.weight}
                      onClick={() => setSelectedWeight(opt)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                        currentOption.weight === opt.weight
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-500'
                      }`}
                    >
                      {opt.weight}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-4 flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-900">
                  ₨ {currentOption.pricePKR.toLocaleString()}
                </span>
                {currentOption.originalPricePKR && (
                  <span className="text-sm text-gray-400 line-through">
                    ₨ {currentOption.originalPricePKR.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  addToCart(quickViewProduct, currentOption, qty);
                  setQuickViewProduct(null);
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart (₨ {currentOption.pricePKR.toLocaleString()})</span>
              </button>

              <button
                onClick={() => {
                  setQuickViewProduct(null);
                  navigateTo('product-detail', { productId: quickViewProduct.id });
                }}
                className="w-full py-2 text-center text-xs text-emerald-700 font-bold hover:underline"
              >
                View Full Product Details & Health Benefits →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
