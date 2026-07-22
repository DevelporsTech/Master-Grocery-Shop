import React, { useState } from 'react';
import { WeightUnit } from '../types';
import { PRODUCTS } from '../data/mockData';
import { Calculator, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WeightPriceCalculator: React.FC = () => {
  const { products, addToCart } = useStore();
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const [selectedWeight, setSelectedWeight] = useState<WeightUnit>('1kg');
  const [qty, setQty] = useState<number>(1);

  if (!selectedProduct) return null;

  const matchedOption =
    selectedProduct.weightOptions.find((w) => w.weight === selectedWeight) ||
    selectedProduct.weightOptions[0];

  const totalPKR = matchedOption.pricePKR * qty;
  const originalTotalPKR = (matchedOption.originalPricePKR || matchedOption.pricePKR) * qty;
  const savingsPKR = originalTotalPKR - totalPKR;

  return (
    <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-3xl text-white p-6 md:p-8 shadow-2xl relative overflow-hidden my-12 border border-emerald-800">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column Text */}
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-500/30">
            <Calculator className="w-3.5 h-3.5" />
            <span>Smart Dry Fruit Price Calculator</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold font-serif text-white leading-tight">
            Calculate Bulk Dry Fruit & Grocery Savings in PKR
          </h2>

          <p className="text-emerald-200 text-xs md:text-sm leading-relaxed">
            Planning family winter stock or a wedding shadi gift box? Use our instant calculator to lock wholesale discount prices for 250g, 1kg, 2kg, or 5kg bulk crates across Pakistan.
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs pt-2">
            <div className="bg-emerald-800/60 p-3 rounded-2xl border border-emerald-700">
              <span className="text-amber-400 font-bold block text-sm">Up to 20% OFF</span>
              <span className="text-emerald-200 text-[11px]">On 5kg Wholesale Crates</span>
            </div>
            <div className="bg-emerald-800/60 p-3 rounded-2xl border border-emerald-700">
              <span className="text-amber-400 font-bold block text-sm">Free Express Shipping</span>
              <span className="text-emerald-200 text-[11px]">Orders Over ₨ 2,500</span>
            </div>
          </div>
        </div>

        {/* Right Interactive Calculator Box */}
        <div className="lg:col-span-7 bg-white text-gray-900 p-6 md:p-8 rounded-3xl shadow-xl">
          <div className="space-y-5">
            {/* 1. Select Product */}
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block mb-2">
                1. Select Item:
              </label>
              <select
                value={selectedProduct.id}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              >
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name} ({prod.origin})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Weight Selector */}
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block mb-2">
                2. Select Pack Weight:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {selectedProduct.weightOptions.map((opt) => (
                  <button
                    key={opt.weight}
                    onClick={() => setSelectedWeight(opt.weight)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all ${
                      selectedWeight === opt.weight
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-102'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-400'
                    }`}
                  >
                    <div>{opt.weight}</div>
                    {opt.savingsPct && (
                      <span className="text-[9px] block opacity-80 font-normal">
                        Save {opt.savingsPct}%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Quantity Stepper */}
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block mb-2">
                3. Pack Quantity:
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 font-bold rounded-xl text-gray-800 text-lg flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-base font-extrabold text-gray-900 px-4">{qty} Pack(s)</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 font-bold rounded-xl text-gray-800 text-lg flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Calculated Output Box */}
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-xs text-gray-500 font-semibold block">Calculated Price:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-800">
                    ₨ {totalPKR.toLocaleString()}
                  </span>
                  {savingsPKR > 0 && (
                    <span className="text-xs text-gray-400 line-through">
                      ₨ {originalTotalPKR.toLocaleString()}
                    </span>
                  )}
                </div>
                {savingsPKR > 0 && (
                  <p className="text-[11px] font-bold text-amber-700 mt-0.5">
                    🎉 Total Savings: ₨ {savingsPKR.toLocaleString()}!
                  </p>
                )}
              </div>

              <button
                onClick={() => addToCart(selectedProduct, matchedOption, qty)}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Calculated Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
