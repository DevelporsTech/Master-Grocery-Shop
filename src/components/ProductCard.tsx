import React, { useState } from 'react';
import { Product, WeightOption } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, Eye, ShoppingCart, Star, GitCompare, Sparkles, Check, Edit2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isComparing,
    setQuickViewProduct,
    navigateTo,
    isAdminUnlocked,
  } = useStore();

  const [selectedOption, setSelectedOption] = useState<WeightOption>(
    product.weightOptions.find((w) => w.weight === product.defaultWeight) || product.weightOptions[0]
  );

  const isLiked = isInWishlist(product.id);
  const isComp = isComparing(product.id);

  return (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group relative">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.isOrganic && (
          <span className="bg-[#16A34A] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3 text-[#FEF3C7]" /> Organic
          </span>
        )}
        {product.isFlashDeal && product.flashDiscountPct && (
          <span className="bg-[#F59E0B] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
            {product.flashDiscountPct}% OFF
          </span>
        )}
        <span className="bg-[#FAFAFA]/90 backdrop-blur-xs border border-[#E5E7EB] text-[#111827] text-[10px] font-medium px-2 py-0.5 rounded-md">
          📍 {product.origin}
        </span>
      </div>

      {/* Top Floating Action Buttons (Wishlist, Compare, & Admin Edit) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {isAdminUnlocked && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateTo('admin-products');
            }}
            className="p-2 rounded-full shadow-md transition-all bg-[#16A34A] text-white hover:bg-[#15803D] border border-emerald-400"
            title="Edit in Admin Panel"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`p-2 rounded-full shadow-sm transition-all ${
            isLiked ? 'bg-red-500 text-white scale-110' : 'bg-white/90 hover:bg-white text-[#6B7280] hover:text-red-500 border border-[#E5E7EB]'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleCompare(product);
          }}
          className={`p-2 rounded-full shadow-sm transition-all ${
            isComp ? 'bg-[#16A34A] text-white' : 'bg-white/90 hover:bg-white text-[#6B7280] hover:text-[#16A34A] border border-[#E5E7EB]'
          }`}
          title="Compare Product"
        >
          <GitCompare className="w-4 h-4" />
        </button>
      </div>

      {/* Product Image Box */}
      <div
        onClick={() => navigateTo('product-detail', { productId: product.id })}
        className="relative h-48 sm:h-52 overflow-hidden bg-[#FAFAFA] cursor-pointer group"
      >
        <img
          src={product.mainImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="px-4 py-2 bg-white text-[#111827] font-bold text-xs rounded-xl shadow-md border border-[#E5E7EB] flex items-center gap-1.5 transition-transform hover:scale-105"
          >
            <Eye className="w-4 h-4 text-[#16A34A]" />
            Quick Preview
          </button>
        </div>
      </div>

      {/* Product Details Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Subcategory & Rating */}
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-1">
            <span className="font-bold text-[#16A34A] uppercase tracking-wider text-[10px]">
              {product.subcategory}
            </span>
            <div className="flex items-center gap-1 bg-[#FEF3C7] px-1.5 py-0.5 rounded-md border border-[#F59E0B]/30">
              <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
              <span className="font-bold text-[#111827] text-[11px]">{product.rating}</span>
              <span className="text-[#6B7280] text-[10px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => navigateTo('product-detail', { productId: product.id })}
            className="font-bold text-[#111827] text-sm hover:text-[#16A34A] transition-colors line-clamp-2 cursor-pointer mb-1 leading-snug"
          >
            {product.name}
          </h3>

          {/* Urdu Subtitle if available */}
          {product.nameUrdu && (
            <p className="text-xs text-[#16A34A] font-medium mb-2">{product.nameUrdu}</p>
          )}

          {/* Weight Selection Pills */}
          <div className="my-2.5">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1">
              Select Weight:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.weightOptions.map((opt) => (
                <button
                  key={opt.weight}
                  onClick={() => setSelectedOption(opt)}
                  className={`px-3 py-1.5 min-h-[36px] text-xs font-semibold rounded-lg border transition-all ${
                    selectedOption.weight === opt.weight
                      ? 'bg-[#16A34A] text-white border-[#16A34A] shadow-xs font-bold'
                      : 'bg-[#FAFAFA] text-[#111827] border-[#E5E7EB] hover:border-[#16A34A] hover:bg-white'
                  }`}
                >
                  {opt.weight}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing & Add to Cart Footer */}
        <div className="pt-3 border-t border-[#E5E7EB] mt-2">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-lg font-extrabold text-[#111827]">
                ₨ {selectedOption.pricePKR.toLocaleString()}
              </span>
              {selectedOption.originalPricePKR && (
                <span className="text-xs text-[#6B7280] line-through ml-2">
                  ₨ {selectedOption.originalPricePKR.toLocaleString()}
                </span>
              )}
            </div>

            {selectedOption.savingsPct && (
              <span className="text-[10px] font-bold text-[#16A34A] bg-[#F0FDF4] px-1.5 py-0.5 rounded-md border border-[#16A34A]/20">
                Save {selectedOption.savingsPct}%
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, selectedOption, 1)}
            className="w-full py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 group/btn shadow-xs"
          >
            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-105 transition-transform" />
            <span>Add to Cart ({selectedOption.weight})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
