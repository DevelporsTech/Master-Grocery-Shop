import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { User, Package, Heart, Award, MapPin, Phone, ShieldCheck, Mail, LogOut, LogIn, UserPlus, Edit3, Check } from 'lucide-react';

export const CustomerDashboardView: React.FC = () => {
  const { currentUser, recentOrders, wishlistIds, navigateTo, logout, setIsAuthModalOpen, setAuthModalTab, updateProfile } = useStore();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editCity, setEditCity] = useState(currentUser?.city || 'Lahore');
  const [editAddress, setEditAddress] = useState(currentUser?.address || '');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      phone: editPhone,
      city: editCity,
      address: editAddress,
    });
    setIsEditingProfile(false);
  };

  const totalSpentPKR = recentOrders.reduce((acc, o) => acc + o.totalPKR, 0);
  const rewardPoints = Math.floor(totalSpentPKR / 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-emerald-950 font-black text-2xl flex items-center justify-center font-serif shadow-md border-2 border-amber-300">
            {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'M'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold font-serif text-white">
                {currentUser ? currentUser.name : 'Guest Customer Account'}
              </h1>
              {currentUser?.role === 'admin' && (
                <span className="px-2 py-0.5 bg-amber-500 text-emerald-950 font-extrabold text-[10px] rounded-md uppercase">
                  STORE ADMIN
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              {currentUser ? currentUser.email : 'Sign in to sync your grocery orders and saved items'}
            </p>
          </div>
        </div>

        {/* Right Action: Sign Out or Sign In */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <button
              onClick={logout}
              className="px-4 py-2 bg-emerald-800 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all border border-emerald-700 flex items-center gap-2 shadow-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthModalTab('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-2 bg-[#F59E0B] hover:bg-amber-600 text-emerald-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => {
                  setAuthModalTab('signup');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </button>
            </div>
          )}

          {/* Loyalty Points Badge */}
          <div className="hidden sm:flex bg-emerald-800/80 p-3 px-4 rounded-2xl border border-emerald-700 items-center gap-3">
            <Award className="w-7 h-7 text-amber-400" />
            <div>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                Loyalty Rewards
              </span>
              <span className="text-lg font-black text-white">{rewardPoints} Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Account Details or Guest Prompt */}
        <div className="lg:col-span-5 space-y-6">
          {currentUser ? (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-bold font-serif text-gray-900 text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  Personal Information
                </h3>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">City in Pakistan</label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      placeholder="e.g. Lahore, Karachi"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Shipping Address</label>
                    <textarea
                      rows={2}
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      placeholder="House #, Street, Block, Area..."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#16A34A] text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1"
                  >
                    <Check className="w-4 h-4" /> Save Profile Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-3 text-xs text-gray-700">
                  <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 block">Email Address</span>
                      <span className="font-semibold text-gray-900">{currentUser.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 block">Phone Number</span>
                      <span className="font-semibold text-gray-900">{currentUser.phone || 'Not provided yet'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 block">City & Address</span>
                      <span className="font-semibold text-gray-900">
                        {currentUser.city || 'Lahore'} {currentUser.address ? `, ${currentUser.address}` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-amber-50 to-emerald-50/60 p-6 rounded-3xl border border-amber-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-amber-900">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold font-serif text-sm">Sign In to Your Account</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Enjoy fast 1-click checkout, track all courier shipments live, save your favorite organic dry fruits, and earn loyalty reward points on every order.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setAuthModalTab('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="flex-1 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl shadow-xs text-center"
                >
                  Sign In Now
                </button>
                <button
                  onClick={() => {
                    setAuthModalTab('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="flex-1 py-2.5 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs rounded-xl border border-gray-300 text-center"
                >
                  Create Account
                </button>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-3">
            <div
              onClick={() => navigateTo('wishlist')}
              className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-emerald-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs">My Saved Wishlist</h4>
                  <p className="text-[11px] text-gray-400">{wishlistIds.length} items saved</p>
                </div>
              </div>
              <span className="text-emerald-700 font-bold text-xs">View →</span>
            </div>

            <div
              onClick={() => navigateTo('order-tracking')}
              className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-emerald-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs">Track Active Parcel</h4>
                  <p className="text-[11px] text-gray-400">Live courier timeline</p>
                </div>
              </div>
              <span className="text-emerald-700 font-bold text-xs">Track →</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold font-serif text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
            <Package className="w-5 h-5 text-emerald-600" />
            Your Order History ({recentOrders.length})
          </h2>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12 text-xs text-gray-500">
              <p className="font-semibold text-gray-700">You have not placed any orders yet.</p>
              <p className="text-[11px] text-gray-400 mt-1">Explore our organic dry fruits and fresh Pakistan groceries.</p>
              <button
                onClick={() => navigateTo('shop')}
                className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
              >
                Start Grocery Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-gray-900 text-sm">#{order.trackingNumber}</span>
                      <p className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-[11px]">
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-gray-700 text-[11px]">
                        <span>{it.quantity}x {it.productName} ({it.weight})</span>
                        <span className="font-semibold">₨ {it.totalPricePKR.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Payment: {order.paymentMethod.toUpperCase()}</span>
                    <span className="font-black text-emerald-800 text-sm">₨ {order.totalPKR.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

