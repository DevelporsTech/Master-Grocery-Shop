import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import brandLogo from '../assets/logo';
import { ShoppingBag, X, Plus, Minus, Trash2, Tag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotalPKR,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    appliedCoupon,
    couponDiscountPKR,
    applyCoupon,
    removeCoupon,
    navigateTo,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartDrawerOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 2500;
  const progressPct = Math.min(100, Math.round((cartSubtotalPKR / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotalPKR);
  const isFreeShipping = cartSubtotalPKR >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = isFreeShipping || cart.length === 0 ? 0 : 199;

  const finalTotalPKR = Math.max(0, cartSubtotalPKR - couponDiscountPKR + shippingFee);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponInput);
    setCouponLoading(false);
    setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={brandLogo}
                alt="Master Grocery Store Logo"
                className="w-9 h-9 object-cover rounded-xl border border-amber-400 shadow-2xs"
                referrerPolicy="no-referrer"
              />
              <div>
                <h2 className="text-sm font-bold font-serif text-white leading-tight">Your Shopping Cart</h2>
                <span className="text-[10px] text-amber-300 font-bold">
                  {cart.length} Items Selected
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 hover:bg-emerald-800 rounded-lg text-emerald-200 transition-colors cursor-pointer"
              aria-label="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-emerald-50 p-3.5 border-b border-emerald-100">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-1.5">
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-emerald-600" />
                {isFreeShipping ? '🎉 FREE Express Shipping Unlocked!' : `Add ₨ ${amountNeeded.toLocaleString()} for FREE Express Shipping`}
              </span>
              <span>{progressPct}%</span>
            </div>
            <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-800">Your cart is empty</h3>
                <p className="text-xs text-gray-500 mt-1 mb-4">Explore our dry fruits and fresh grocery collections across Pakistan.</p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigateTo('shop');
                  }}
                  className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors shadow-md"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200 relative group">
                  <img
                    src={item.product.mainImage}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-gray-900 pr-6 line-clamp-1">{item.product.name}</h4>
                    <p className="text-[11px] text-emerald-700 font-semibold mb-2">
                      Weight: {item.selectedWeightOption.weight}
                    </p>

                    <div className="flex items-center justify-between">
                      {/* Quantity Stepper with ergonomic mobile touch targets */}
                      <div className="flex items-center border border-gray-300 bg-white rounded-xl overflow-hidden shadow-2xs">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-emerald-50 active:bg-emerald-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-emerald-50 active:bg-emerald-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-xs font-extrabold text-gray-900">
                        ₨ {item.itemTotalPKR.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-2 active:scale-90 transition-transform"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Coupon Code Input */}
          {cart.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-100 text-emerald-900 px-3 py-2 rounded-xl text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-700" />
                    <span>Coupon '{appliedCoupon.code}' Applied! (-₨ {couponDiscountPKR.toLocaleString()})</span>
                  </div>
                  <button onClick={removeCoupon} className="text-emerald-700 hover:text-red-600 font-bold underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. PAKISTAN10)"
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 uppercase"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Drawer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 bg-white border-t border-gray-200 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-bold text-gray-900">₨ {cartSubtotalPKR.toLocaleString()}</span>
              </div>

              {couponDiscountPKR > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount:</span>
                  <span>- ₨ {couponDiscountPKR.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee (Pakistan):</span>
                <span className="font-bold text-gray-900">
                  {shippingFee === 0 ? <span className="text-emerald-700 font-extrabold uppercase">FREE</span> : `₨ ${shippingFee}`}
                </span>
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline text-sm font-extrabold text-gray-900">
                <span>Total Amount:</span>
                <span className="text-xl text-emerald-700">₨ {finalTotalPKR.toLocaleString()}</span>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigateTo('cart');
                  }}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-colors"
                >
                  View Full Cart
                </button>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigateTo('checkout');
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-1 flex items-center justify-center gap-2 text-[10px] text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cash on Delivery, Easypaisa & JazzCash Supported</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
