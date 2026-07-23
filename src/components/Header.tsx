import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Truck,
  PhoneCall,
  Sparkles,
  GitCompare,
  ChevronDown,
  Menu,
  X,
  Flame,
  ShieldCheck,
  FileCode2,
  Bot,
  Settings,
  LogIn,
  LogOut,
  UserCheck,
  UserPlus,
  Lock,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    navigateTo,
    cartCount,
    wishlistIds,
    compareProducts,
    setIsCartDrawerOpen,
    setIsCompareModalOpen,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
    products,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalTab,
    logout,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.origin.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSelectProduct = (productId: string) => {
    navigateTo('product-detail', { productId });
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-xs">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#16A34A] text-white text-[10px] sm:text-xs py-1.5 px-4 font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="bg-[#F59E0B] text-white px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wide">
              EXPRESS DELIVERY
            </span>
            <p className="hidden sm:inline">
              PREMIUM DRY FRUITS & FRESH GROCERIES • FREE DELIVERY ON ORDERS ABOVE RS. 2,500
            </p>
            <p className="sm:hidden font-medium">Free Shipping over Rs. 2,500 in Pakistan!</p>
          </div>

          <div className="flex items-center gap-4 divide-x divide-white/20 text-white/90">
            <a href="tel:03279408969" className="flex items-center gap-1.5 hover:text-[#FEF3C7] transition-colors">
              <PhoneCall className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Helpline: 0327-9408969</span>
            </a>
            <div className="pl-3 hidden lg:flex items-center gap-2 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>Easypaisa, JazzCash & COD</span>
            </div>
            <button
              onClick={() => navigateTo('order-tracking')}
              className="pl-3 flex items-center gap-1 hover:text-[#FEF3C7] font-medium"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Branding & Search Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2 text-[#111827] hover:text-[#16A34A] rounded-xl hover:bg-[#FAFAFA] border border-gray-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
          aria-label="Open Side Panel Menu"
        >
          <Menu className="w-6 h-6 text-[#16A34A]" />
          <span className="text-xs font-bold text-[#111827] hidden xs:inline">Menu</span>
        </button>

        {/* Brand Logo */}
        <div
          onClick={() => navigateTo('home')}
          className="cursor-pointer flex items-center gap-2.5 group select-none"
        >
          <img
            src="/logo.jpg"
            alt="Master Grocery Store Logo"
            className="w-11 h-11 object-cover rounded-xl border border-emerald-200 shadow-sm group-hover:scale-105 transition-transform"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-extrabold tracking-tight text-[#111827] leading-none">
                MASTER
              </span>
              <span className="text-xl font-extrabold tracking-tight text-[#16A34A] leading-none">
                GROCERY
              </span>
            </div>
            <p className="text-[9px] font-semibold text-[#F59E0B] tracking-[0.2em] uppercase mt-0.5">
              PREMIUM QUALITY SINCE 1984
            </p>
          </div>
        </div>

        {/* Search Bar with Instant Auto-suggestions */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Search dry fruits, Basmati rice, Desi Ghee..."
              className="w-full pl-10 pr-24 py-2 bg-[#FAFAFA] border border-[#E5E7EB] rounded-full text-xs text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#16A34A] focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-2.5" />

            <button
              onClick={() => {
                setSelectedCategoryFilter('all');
                navigateTo('shop');
              }}
              className="absolute right-1 top-1 bottom-1 px-3 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold rounded-full transition-colors flex items-center gap-1"
            >
              Search
            </button>
          </div>

          {/* Auto-suggestions Dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] overflow-hidden z-50">
              <div className="p-2 text-xs font-semibold text-[#6B7280] uppercase tracking-wider bg-[#FAFAFA] border-b border-[#E5E7EB]">
                Suggested Products
              </div>
              <div className="divide-y divide-[#E5E7EB]">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onMouseDown={() => handleSelectProduct(product.id)}
                    className="p-3 hover:bg-[#F0FDF4] cursor-pointer flex items-center gap-3 transition-colors"
                  >
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg border border-[#E5E7EB]"
                    />
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-[#111827]">{product.name}</h4>
                      <p className="text-[11px] text-[#6B7280]">
                        {product.origin} • <span className="text-[#16A34A] font-semibold">₨ {product.basePricePKR.toLocaleString()}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons: Compare, Wishlist, Cart Drawer, Customer Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Compare Button */}
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="relative p-2 text-[#6B7280] hover:text-[#111827] rounded-xl hover:bg-[#FAFAFA] transition-colors hidden sm:flex items-center gap-1.5"
            title="Compare Products"
          >
            <GitCompare className="w-5 h-5" />
            {compareProducts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F59E0B] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {compareProducts.length}
              </span>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => navigateTo('wishlist')}
            className="relative p-2 text-[#6B7280] hover:text-[#111827] rounded-xl hover:bg-[#FAFAFA] transition-colors"
            title="Wishlist"
          >
            <Heart className={`w-5 h-5 ${wishlistIds.length > 0 ? 'text-red-500 fill-red-500' : ''}`} />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlistIds.length}
              </span>
            )}
          </button>



          {/* Customer Account Section - If logged in, show Account profile */}
          {currentUser && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigateTo('customer-dashboard')}
                className="px-2 sm:px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#16A34A] rounded-xl transition-all flex items-center gap-1.5 text-[11px] sm:text-xs font-bold shadow-2xs cursor-pointer"
                title="Account Dashboard"
              >
                <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16A34A] shrink-0" />
                <span className="max-w-[65px] xs:max-w-[85px] sm:max-w-[110px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
              <button
                onClick={logout}
                className="p-1.5 sm:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3 relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search dry fruits, rice, desi ghee..."
            className="w-full pl-9 pr-10 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] focus:border-[#16A34A] focus:bg-white rounded-xl text-xs text-[#111827]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-gray-400 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Auto-suggestions Dropdown */}
        {isSearchFocused && searchResults.length > 0 && (
          <div className="absolute top-full left-4 right-4 mt-1 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] overflow-hidden z-50">
            <div className="p-2 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider bg-[#FAFAFA] border-b border-[#E5E7EB]">
              Suggested Products
            </div>
            <div className="divide-y divide-[#E5E7EB]">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onMouseDown={() => handleSelectProduct(product.id)}
                  className="p-3 hover:bg-[#F0FDF4] active:bg-emerald-100 cursor-pointer flex items-center gap-3 transition-colors"
                >
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded-lg border border-[#E5E7EB]"
                  />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-[#111827]">{product.name}</h4>
                    <p className="text-[11px] text-[#6B7280]">
                      {product.origin} • <span className="text-[#16A34A] font-semibold">₨ {product.basePricePKR.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Navigation Links Bar */}
      <nav className="bg-white text-[#111827] border-t border-[#E5E7EB] hidden lg:block">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-12">
          <div className="flex items-center gap-6 text-sm font-medium">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="bg-[#FAFAFA] hover:bg-[#F3F4F6] border border-[#E5E7EB] px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#111827] flex items-center gap-2 transition-colors"
              >
                <Menu className="w-4 h-4 text-[#16A34A]" />
                <span>All Categories</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1 text-[#6B7280]" />
              </button>

              {isCategoryMenuOpen && (
                <div
                  onMouseLeave={() => setIsCategoryMenuOpen(false)}
                  className="absolute top-full left-0 w-64 bg-white text-[#111827] shadow-xl rounded-2xl border border-[#E5E7EB] py-2 z-50 animate-in fade-in slide-in-from-top-2 mt-1"
                >
                  {CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategoryFilter(cat.slug);
                        navigateTo('shop');
                        setIsCategoryMenuOpen(false);
                      }}
                      className="px-4 py-2.5 hover:bg-[#F0FDF4] hover:text-[#16A34A] cursor-pointer text-xs font-semibold flex items-center justify-between border-b border-[#FAFAFA] last:border-0"
                    >
                      <div>
                        <span>{cat.name}</span>
                        <p className="text-[10px] text-[#6B7280]">{cat.nameUrdu}</p>
                      </div>
                      <span className="text-[10px] bg-[#F0FDF4] text-[#16A34A] font-bold px-2 py-0.5 rounded-full">
                        {cat.itemCount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Nav Links */}
            <button
              onClick={() => navigateTo('home')}
              className={`py-3.5 transition-colors text-xs font-bold ${
                currentView === 'home' ? 'text-[#16A34A] border-b-2 border-[#16A34A]' : 'hover:text-[#16A34A]'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => {
                setSelectedCategoryFilter('dry-fruits');
                navigateTo('shop');
              }}
              className={`py-3.5 transition-colors text-xs font-bold flex items-center gap-1.5 ${
                currentView === 'shop' && selectedCategoryFilter === 'dry-fruits'
                  ? 'text-[#16A34A] border-b-2 border-[#16A34A]'
                  : 'hover:text-[#16A34A]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Dry Fruits</span>
            </button>

            <button
              onClick={() => {
                setSelectedCategoryFilter('all');
                navigateTo('shop');
              }}
              className={`py-3.5 transition-colors text-xs font-bold ${
                currentView === 'shop' && selectedCategoryFilter === 'all'
                  ? 'text-[#16A34A] border-b-2 border-[#16A34A]'
                  : 'hover:text-[#16A34A]'
              }`}
            >
              Fresh Groceries
            </button>

            <button
              onClick={() => {
                setSelectedCategoryFilter('all');
                navigateTo('shop');
              }}
              className="py-3.5 text-xs font-bold hover:text-[#16A34A] transition-colors flex items-center gap-1 text-[#F59E0B]"
            >
              <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Flash Deals</span>
            </button>

            <button
              onClick={() => navigateTo('ai-agent')}
              className={`py-3.5 transition-colors text-xs font-bold flex items-center gap-1.5 ${
                currentView === 'ai-agent'
                  ? 'text-[#16A34A] border-b-2 border-[#16A34A]'
                  : 'hover:text-[#16A34A] text-emerald-800'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>AI Assistant</span>
            </button>

            <button
              onClick={() => navigateTo('admin-products')}
              className={`py-3.5 transition-colors text-xs font-bold flex items-center gap-1.5 ${
                currentView === 'admin-products'
                  ? 'text-[#16A34A] border-b-2 border-[#16A34A]'
                  : 'hover:text-[#16A34A] text-amber-800'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Store Product Portal</span>
            </button>

            <button
              onClick={() => navigateTo('blog')}
              className={`py-3.5 transition-colors text-xs font-bold ${
                currentView === 'blog' ? 'text-[#16A34A] border-b-2 border-[#16A34A]' : 'hover:text-[#16A34A]'
              }`}
            >
              Health Tips & Blog
            </button>

            <button
              onClick={() => navigateTo('about')}
              className={`py-3.5 transition-colors text-xs font-bold ${
                currentView === 'about' ? 'text-[#16A34A] border-b-2 border-[#16A34A]' : 'hover:text-[#16A34A]'
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => navigateTo('contact')}
              className={`py-3.5 transition-colors text-xs font-bold ${
                currentView === 'contact' ? 'text-[#16A34A] border-b-2 border-[#16A34A]' : 'hover:text-[#16A34A]'
              }`}
            >
              Contact
            </button>
          </div>

          {/* Dev / SEO Strategy Link */}
          <button
            onClick={() => navigateTo('seo-dev-docs')}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#FAFAFA] hover:bg-[#F3F4F6] text-[#111827] border border-[#E5E7EB] text-xs font-bold rounded-lg transition-colors"
          >
            <FileCode2 className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>SEO & Dev Docs</span>
          </button>
        </div>
      </nav>

      {/* Side Panel Drawer for Mobile/Tablet */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer Slide-over Panel */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
            <div>
              {/* 1. Drawer Header with Official App Logo */}
              <div className="p-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white flex items-center justify-between border-b border-emerald-800">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/logo.jpg"
                    alt="Master Grocery Store Logo"
                    className="w-10 h-10 object-cover rounded-xl border-2 border-amber-400 shadow-sm"
                  />
                  <div>
                    <h3 className="text-sm font-black tracking-tight font-serif text-white leading-none">
                      MASTER GROCERY
                    </h3>
                    <p className="text-[9px] font-bold text-amber-300 uppercase tracking-widest mt-0.5">
                      EST. 1984 • SHEIKHUPURA
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer"
                  aria-label="Close Side Panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 2. Side Panel Auth / Account Control Section */}
              <div className="p-4 bg-emerald-50/70 border-b border-emerald-100 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#16A34A]" />
                    <span>User Account Portal</span>
                  </span>
                  {currentUser && (
                    <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-extrabold">
                      Active Session
                    </span>
                  )}
                </div>

                {currentUser ? (
                  /* Logged-in state in Side Panel */
                  <div className="p-3 bg-white rounded-2xl border border-emerald-200 shadow-2xs space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-emerald-950 font-black flex items-center justify-center font-serif text-sm shadow-xs shrink-0">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs text-gray-900 truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{currentUser.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100">
                      <button
                        onClick={() => {
                          navigateTo('customer-dashboard');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full py-2 px-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>My Account</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full py-2 px-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 active:scale-95 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-600" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Logged-out state in Side Panel - Sign In & Register */
                  <div className="p-3 bg-white rounded-2xl border border-emerald-200 shadow-2xs space-y-2.5">
                    <p className="text-[11px] text-gray-600 font-medium">
                      Sign in to manage orders, track shipments & save favorites.
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setAuthModalTab('login');
                          setIsAuthModalOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full py-2.5 px-3 bg-[#16A34A] hover:bg-[#15803D] active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <LogIn className="w-4 h-4 shrink-0" />
                        <span>Sign In</span>
                      </button>

                      <button
                        onClick={() => {
                          setAuthModalTab('signup');
                          setIsAuthModalOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-500 active:scale-95 text-emerald-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4 shrink-0 text-emerald-950" />
                        <span>Register</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Navigation Links List */}
              <div className="p-4 space-y-1">
                <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2 px-2">
                  Main Navigation
                </div>

                <button
                  onClick={() => {
                    navigateTo('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-3 transition-all ${
                    currentView === 'home'
                      ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base">🏠</span>
                  <span>Home Page</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedCategoryFilter('dry-fruits');
                    navigateTo('shop');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-3 transition-all ${
                    currentView === 'shop' && selectedCategoryFilter === 'dry-fruits'
                      ? 'bg-amber-50 text-amber-900 border border-amber-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base">🥜</span>
                  <div className="flex items-center justify-between flex-1">
                    <span>Dry Fruits & Nuts</span>
                    <span className="text-[10px] bg-amber-200/80 text-amber-950 font-extrabold px-2 py-0.5 rounded-full">
                      Organic
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setSelectedCategoryFilter('all');
                    navigateTo('shop');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-3 transition-all ${
                    currentView === 'shop' && selectedCategoryFilter === 'all'
                      ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base">🌾</span>
                  <span>All Fresh Groceries</span>
                </button>

                <button
                  onClick={() => {
                    navigateTo('order-tracking');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-3 transition-all ${
                    currentView === 'order-tracking'
                      ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Track Your Order</span>
                </button>

                <button
                  onClick={() => {
                    navigateTo('ai-agent');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-3 transition-all ${
                    currentView === 'ai-agent'
                      ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Bot className="w-4 h-4 text-emerald-600" />
                  <span>AI Health & Recipe Assistant</span>
                </button>

                <button
                  onClick={() => {
                    navigateTo('blog');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-3 transition-all ${
                    currentView === 'blog'
                      ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base">📚</span>
                  <span>Health Blog & Tips</span>
                </button>

                <button
                  onClick={() => {
                    navigateTo('about');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <span className="text-base">ℹ️</span>
                  <span>About Master Grocery</span>
                </button>

                <button
                  onClick={() => {
                    navigateTo('contact');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <span className="text-base">📞</span>
                  <span>Contact Support</span>
                </button>

                <div className="pt-2 border-t border-gray-100 space-y-1">
                  <button
                    onClick={() => {
                      navigateTo('admin-products');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 bg-emerald-100/70 text-emerald-950 border border-emerald-300 hover:bg-emerald-200/80 transition-all"
                  >
                    <Settings className="w-4 h-4 text-emerald-700" />
                    <span>Store Product Portal</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('seo-dev-docs');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 bg-amber-100/70 text-amber-950 border border-amber-300 hover:bg-amber-200/80 transition-all"
                  >
                    <FileCode2 className="w-4 h-4 text-amber-700" />
                    <span>SEO & Dev Docs</span>
                  </button>
                </div>
              </div>

              {/* 4. Store Categories Accordion / List in Side Panel */}
              <div className="p-4 border-t border-gray-100">
                <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2 px-2">
                  Shop By Category
                </div>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategoryFilter(cat.slug);
                        navigateTo('shop');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-2 px-3 hover:bg-emerald-50 rounded-lg text-xs font-semibold text-gray-700 hover:text-emerald-800 flex items-center justify-between text-left transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full">
                        {cat.itemCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Side Panel Bottom Help Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-2">
              <a
                href="https://wa.me/923279408969"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-[#111827] hover:bg-black text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>WhatsApp Helpline: 0327-9408969</span>
              </a>
              <p className="text-[10px] text-gray-500 text-center font-medium">
                Deliveries across Sheikhupura & all Pakistan
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
