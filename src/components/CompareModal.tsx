import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, Sparkles, Check } from 'lucide-react';

export const CompareModal: React.FC = () => {
  const {
    compareProducts,
    toggleCompare,
    clearCompare,
    isCompareModalOpen,
    setIsCompareModalOpen,
    addToCart,
  } = useStore();

  if (!isCompareModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        onClick={() => setIsCompareModalOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-3xl max-w-5xl w-full p-6 shadow-2xl z-10 overflow-hidden my-8">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
          <div>
            <h2 className="text-xl font-bold font-serif text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Product Comparison Matrix
            </h2>
            <p className="text-xs text-gray-500">Compare price, origin, weight options & nutrition side-by-side</p>
          </div>

          <div className="flex items-center gap-3">
            {compareProducts.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-red-600 hover:text-red-700 font-bold underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            )}
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {compareProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm font-semibold text-gray-600">No items added to comparison yet.</p>
            <p className="text-xs text-gray-400 mt-1">Click the comparison icon on any product card to compare.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr>
                  <th className="p-3 bg-gray-50 font-bold text-gray-500 border-b w-40">Attribute</th>
                  {compareProducts.map((p) => (
                    <th key={p.id} className="p-3 border-b text-center min-w-[200px]">
                      <div className="relative">
                        <button
                          onClick={() => toggleCompare(p)}
                          className="absolute -top-1 -right-1 text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <img
                          src={p.mainImage}
                          alt={p.name}
                          className="w-20 h-20 object-cover rounded-xl mx-auto border mb-2"
                        />
                        <h4 className="font-bold text-gray-900 line-clamp-2">{p.name}</h4>
                        <span className="text-emerald-700 font-extrabold text-sm block mt-1">
                          ₨ {p.basePricePKR.toLocaleString()} ({p.defaultWeight})
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-3 bg-gray-50 font-bold text-gray-700">Origin / Region</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center text-gray-800 font-medium">
                      📍 {p.origin}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-gray-50 font-bold text-gray-700">Organic Certified</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center">
                      {p.isOrganic ? (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Check className="w-3 h-3" /> Yes
                        </span>
                      ) : (
                        <span className="text-gray-400">Standard</span>
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-gray-50 font-bold text-gray-700">Calories / 100g</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center font-bold text-gray-800">
                      {p.nutritionInfo.calories} kcal
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-gray-50 font-bold text-gray-700">Protein</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center text-emerald-800 font-bold">
                      {p.nutritionInfo.protein}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-gray-50 font-bold text-gray-700">Fats</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center text-gray-700">
                      {p.nutritionInfo.fats}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-gray-50 font-bold text-gray-700">Vitamins & Minerals</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center text-gray-600 text-[11px]">
                      {p.nutritionInfo.vitamins || 'Essential Nutrients'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-gray-50 font-bold text-gray-700">Action</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center">
                      <button
                        onClick={() => {
                          addToCart(p, p.weightOptions[0], 1);
                          setIsCompareModalOpen(false);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-sm"
                      >
                        Add to Cart
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
