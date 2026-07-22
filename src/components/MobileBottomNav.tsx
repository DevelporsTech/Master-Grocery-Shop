import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Home,
  ShoppingBag,
  Truck,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentView, navigateTo, cartCount, cartSubtotalPKR, setIsCartDrawerOpen } = useStore();

  return (
    <>
      {/* 1. Mobile Floating Quick Shopping Bag Bar (Shows when items are in cart) */}
      {cartCount > 0 && currentView !== 'cart' && currentView !== 'checkout' && (
        <div className="fixed bottom-[66px] left-3 right-3 z-30 lg:hidden animate-fade-in">
          <div className="bg-emerald-950/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl border border-emerald-700/60 flex items-center justify-between gap-3">
            <div
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
            >
              <div className="relative bg-emerald-800 p-2 rounded-xl flex-shrink-0">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <span className="absolute -top-1.5 -right-1.5 bg-[#F59E0B] text-emerald-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-emerald-950">
                  {cartCount}
                </span>
              </div>
              <div className="truncate">
                <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-300">
                  Your Shopping Bag
                </p>
                <p className="text-xs font-black text-white truncate">
                  {cartCount} {cartCount === 1 ? 'Item' : 'Items'} • <span className="text-amber-400">₨ {cartSubtotalPKR.toLocaleString()}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 active:scale-95 text-emerald-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 flex-shrink-0 cursor-pointer transition-all"
            >
              <span>View Bag</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Mobile Fixed Bottom Ergonomic Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] shadow-2xl lg:hidden px-2 py-1">
        <div className="max-w-md mx-auto grid grid-cols-5 items-end text-center">
          {/* 1. Home */}
          <button
            onClick={() => navigateTo('home')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1.5 px-1 rounded-xl transition-all active:scale-95 ${
              currentView === 'home'
                ? 'text-[#16A34A] font-extrabold bg-emerald-50'
                : 'text-gray-600 hover:text-[#111827]'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-none font-medium">Home</span>
          </button>

          {/* 2. Shop */}
          <button
            onClick={() => navigateTo('shop')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1.5 px-1 rounded-xl transition-all active:scale-95 ${
              currentView === 'shop'
                ? 'text-[#16A34A] font-extrabold bg-emerald-50'
                : 'text-gray-600 hover:text-[#111827]'
            }`}
          >
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-none font-medium">Shop</span>
          </button>

          {/* 3. Center Elevated Ergonomic Shopping Bag Button */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex flex-col items-center justify-center text-gray-800 relative group cursor-pointer -mt-4 pb-0.5"
            aria-label="Open Shopping Bag"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 bg-gradient-to-tr from-[#16A34A] via-[#15803D] to-[#166534] active:scale-90 rounded-full flex items-center justify-center shadow-lg shadow-emerald-700/30 border-4 border-white relative transition-all group-hover:scale-105">
              <ShoppingBag className="w-6 h-6 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F59E0B] text-white text-[11px] font-black min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[9px] font-black text-[#16A34A] mt-0.5 tracking-tight uppercase">
              {cartCount > 0 ? `Bag (${cartCount})` : 'Shopping Bag'}
            </span>
          </button>

          {/* 4. Track */}
          <button
            onClick={() => navigateTo('order-tracking')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1.5 px-1 rounded-xl transition-all active:scale-95 ${
              currentView === 'order-tracking'
                ? 'text-[#16A34A] font-extrabold bg-emerald-50'
                : 'text-gray-600 hover:text-[#111827]'
            }`}
          >
            <Truck className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-none font-medium">Track</span>
          </button>

          {/* 5. Admin / Account */}
          <button
            onClick={() => navigateTo('admin-products')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1.5 px-1 rounded-xl transition-all active:scale-95 ${
              currentView === 'admin-products'
                ? 'text-[#16A34A] font-extrabold bg-emerald-50'
                : 'text-gray-600 hover:text-[#111827]'
            }`}
          >
            <ShieldCheck className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-none font-medium">Admin</span>
          </button>
        </div>
      </div>
    </>
  );
};

