import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Sparkles, ShieldCheck, Truck, Flame, Award } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { navigateTo, setSelectedCategoryFilter } = useStore();

  return (
    <div className="my-6 max-w-7xl mx-auto px-4 sm:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 md:p-10 border border-[#E5E7EB] shadow-xs">
        {/* Left Copy Column */}
        <div className="lg:col-span-7 space-y-6">
          <span className="text-[#F59E0B] font-bold text-xs uppercase tracking-widest block">
            GILGIT & HUNZA HARVEST 2026
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111827] leading-[1.1] tracking-tight">
            Premium <span className="text-[#16A34A]">Dry Fruits</span> <br />
            Direct From <span className="underline decoration-[#F59E0B] underline-offset-8">Gilgit</span>
          </h1>

          <p className="text-[#6B7280] text-sm md:text-base max-w-xl leading-relaxed">
            Sourced directly from high-altitude mountain orchards of Pakistan. Sun-dried, organic, and hand-picked. Experience pure Irani Mamra Almonds, Gilgit Walnuts, Super Kernel Rice & Bilona Ghee.
          </p>

          {/* Call-to-actions */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => {
                setSelectedCategoryFilter('dry-fruits');
                navigateTo('shop');
              }}
              className="bg-[#16A34A] text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-[#16A34A]/20 hover:bg-[#15803D] transition-all flex items-center gap-2 text-xs md:text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>SHOP DRY FRUITS</span>
            </button>

            <button
              onClick={() => {
                setSelectedCategoryFilter('all');
                navigateTo('shop');
              }}
              className="border-2 border-[#E5E7EB] text-[#111827] font-bold px-8 py-3.5 rounded-xl hover:bg-white hover:border-[#16A34A] transition-all flex items-center gap-2 text-xs md:text-sm"
            >
              <Flame className="w-4 h-4 text-[#F59E0B]" />
              <span>VIEW OFFERS</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="pt-8 flex flex-wrap gap-8 border-t border-[#E5E7EB]">
            <div>
              <p className="text-2xl font-extrabold text-[#111827]">50k+</p>
              <p className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wider">Happy Families</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#111827]">100%</p>
              <p className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wider">Organic Certified</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#111827]">24h</p>
              <p className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wider">Express Shipping</p>
            </div>
          </div>
        </div>

        {/* Right Hero Image Bento Grid */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-[#FAFAFA] rounded-3xl p-5 border border-[#E5E7EB] relative flex flex-col justify-between group">
            <div className="absolute top-3 right-3 bg-[#F59E0B] text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
              BESTSELLER
            </div>
            <div className="h-20 w-20 bg-[#FEF3C7] rounded-full mx-auto my-2 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-[#F59E0B]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#111827]">California Almonds</h3>
              <p className="text-[#6B7280] text-[11px] mb-2">Hand-picked Premium Size</p>
              <p className="text-[#16A34A] font-extrabold text-base">
                Rs. 2,450 <span className="text-[10px] text-[#6B7280] font-normal">/kg</span>
              </p>
            </div>
          </div>

          <div className="bg-[#16A34A] rounded-3xl p-5 text-white flex flex-col justify-between relative">
            <div className="text-2xl font-extrabold tracking-widest text-white/20 uppercase">OFFER</div>
            <div>
              <h3 className="text-lg font-extrabold mb-1">Gilgit Walnuts</h3>
              <p className="text-white/80 text-[11px] mb-3">Extra crisp, white kernel quality.</p>
              <p className="font-bold text-sm text-[#FEF3C7]">Save 20% Today</p>
            </div>
          </div>

          <div className="bg-[#FAFAFA] rounded-3xl p-5 border border-[#E5E7EB] flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-white rounded-2xl mb-2 flex items-center justify-center border border-[#E5E7EB]">
              <Award className="w-6 h-6 text-[#16A34A]" />
            </div>
            <h3 className="font-bold text-xs text-[#111827]">Monthly Grocery Box</h3>
            <p className="text-[#6B7280] text-[9px] uppercase mt-1 tracking-widest font-semibold">Bundle Subscription</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E5E7EB] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-xs text-[#111827]">Iranian Dates</h3>
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
              </div>
              <p className="text-[#16A34A] font-bold text-sm">
                Rs. 850 <span className="text-[10px] text-[#6B7280] line-through font-normal">Rs. 1,100</span>
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategoryFilter('dry-fruits');
                navigateTo('shop');
              }}
              className="mt-3 w-full border border-[#16A34A] text-[#16A34A] py-1.5 rounded-lg text-[11px] font-bold hover:bg-[#16A34A] hover:text-white transition-all"
            >
              QUICK ADD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
