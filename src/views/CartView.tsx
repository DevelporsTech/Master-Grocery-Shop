import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PAKISTAN_CITIES } from '../data/mockData';
import { ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight, Truck, ShieldCheck } from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotalPKR,
    appliedCoupon,
    couponDiscountPKR,
    applyCoupon,
    removeCoupon,
    navigateTo,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [selectedCity, setSelectedCity] = useState(PAKISTAN_CITIES[0]);

  const FREE_SHIPPING_THRESHOLD = 2500;
  const isFreeShipping = cartSubtotalPKR >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = isFreeShipping || cart.length === 0 ? 0 : selectedCity.deliveryFeePKR;
  const finalTotalPKR = Math.max(0, cartSubtotalPKR - couponDiscountPKR + shippingFee);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    await applyCoupon(couponInput);
    setCouponInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-gray-900">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-gray-500 mt-2 mb-6 max-w-sm mx-auto">
          Explore our premium dry fruits from Gilgit & Quetta and fresh daily kitchen staples.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all"
        >
          Explore Catalog & Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-gray-900">Shopping Cart</h1>
          <p className="text-xs text-gray-500">{cart.length} unique item line(s) selected</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" /> Clear Entire Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="pb-3">Product Item</th>
                <th className="pb-3 text-center">Weight</th>
                <th className="pb-3 text-center">Price</th>
                <th className="pb-3 text-center">Quantity</th>
                <th className="pb-3 text-right">Total</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cart.map((item) => (
                <tr key={item.id} className="group">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.mainImage}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-xl border border-gray-200 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-xs line-clamp-1">{item.product.name}</h4>
                        <span className="text-[10px] text-gray-400">📍 {item.product.origin}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 text-center">
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-lg">
                      {item.selectedWeightOption.weight}
                    </span>
                  </td>

                  <td className="py-4 text-center font-semibold text-gray-800">
                    ₨ {item.unitPricePKR.toLocaleString()}
                  </td>

                  <td className="py-4 text-center">
                    <div className="inline-flex items-center border border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 text-gray-600"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 text-gray-600"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  <td className="py-4 text-right font-black text-gray-900 text-sm">
                    ₨ {item.itemTotalPKR.toLocaleString()}
                  </td>

                  <td className="py-4 text-right pl-3">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Summary & Coupon Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Code Card */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-emerald-600" /> Apply Discount Coupon
            </h3>

            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-emerald-100 text-emerald-900 p-3 rounded-2xl text-xs font-bold">
                <span>Code '{appliedCoupon.code}' (-₨ {couponDiscountPKR.toLocaleString()})</span>
                <button onClick={removeCoupon} className="text-emerald-800 hover:text-red-600 font-bold underline">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="e.g. PAKISTAN10"
                  className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs uppercase"
                />
                <button type="submit" className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl">
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* City Delivery Calculator */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" /> Destination City Shipping
            </h3>

            <select
              value={selectedCity.name}
              onChange={(e) => {
                const city = PAKISTAN_CITIES.find((c) => c.name === e.target.value);
                if (city) setSelectedCity(city);
              }}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
            >
              {PAKISTAN_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.province}) - Delivery ₨ {c.deliveryFeePKR}
                </option>
              ))}
            </select>
          </div>

          {/* Summary Box */}
          <div className="bg-emerald-950 text-white p-6 rounded-3xl shadow-xl space-y-4">
            <h3 className="text-base font-bold font-serif text-white pb-3 border-b border-emerald-800">
              Order Total Breakdown
            </h3>

            <div className="space-y-2 text-xs text-emerald-200">
              <div className="flex justify-between">
                <span>Subtotal Amount:</span>
                <span className="font-bold text-white">₨ {cartSubtotalPKR.toLocaleString()}</span>
              </div>

              {couponDiscountPKR > 0 && (
                <div className="flex justify-between text-amber-400 font-bold">
                  <span>Coupon Discount:</span>
                  <span>- ₨ {couponDiscountPKR.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping ({selectedCity.name}):</span>
                <span className="font-bold text-white">
                  {isFreeShipping ? <span className="text-amber-400 uppercase font-black">FREE</span> : `₨ ${shippingFee}`}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-800 flex justify-between items-baseline">
              <span className="text-sm font-bold text-emerald-200">Grand Total PKR:</span>
              <span className="text-2xl font-black text-amber-400">₨ {finalTotalPKR.toLocaleString()}</span>
            </div>

            <button
              onClick={() => navigateTo('checkout')}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 hover:scale-102 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
