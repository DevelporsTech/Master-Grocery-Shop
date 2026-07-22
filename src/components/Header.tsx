import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import brandLogo from '../assets/logo';
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
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-[#111827] hover:text-[#16A34A] rounded-xl hover:bg-[#FAFAFA]"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <div
          onClick={() => navigateTo('home')}
          className="cursor-pointer flex items-center gap-2.5 group select-none"
        >
          <img
            src={brandLogo}
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



          {/* Customer Account & Auth Section */}
          {currentUser ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigateTo('customer-dashboard')}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#16A34A] rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold shadow-2xs"
                title="Account Dashboard"
              >
                <UserCheck className="w-4 h-4 text-[#16A34A]" />
                <span className="max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
              </button>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setAuthModalTab('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                title="Sign In / Log In"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => {
                  setAuthModalTab('signup');
                  setIsAuthModalOpen(true);
                }}
                className="hidden md:inline-flex px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs transition-all border border-gray-200"
              >
                Register
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

      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 space-y-3">
          <div className="font-bold text-xs uppercase text-gray-400 tracking-wider">Navigation</div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => {
                navigateTo('home');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 text-left bg-gray-50 rounded-lg text-gray-800"
            >
              🏠 Home
            </button>
            <button
              onClick={() => {
                setSelectedCategoryFilter('dry-fruits');
                navigateTo('shop');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 text-left bg-emerald-50 text-emerald-800 rounded-lg font-bold"
            >
              🥜 Dry Fruits
            </button>
            <button
              onClick={() => {
                setSelectedCategoryFilter('all');
                navigateTo('shop');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 text-left bg-gray-50 rounded-lg text-gray-800"
            >
              🌾 Fresh Groceries
            </button>
            <button
              onClick={() => {
                navigateTo('order-tracking');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 text-left bg-gray-50 rounded-lg text-gray-800"
            >
              🚚 Track Order
            </button>
            <button
              onClick={() => {
                navigateTo('blog');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 text-left bg-gray-50 rounded-lg text-gray-800"
            >
              📚 Health Blog
            </button>

            <button
              onClick={() => {
                navigateTo('admin-products');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 text-left bg-emerald-100 text-emerald-900 rounded-lg font-bold"
            >
              ⚙️ Admin Portal
            </button>

            <button
              onClick={() => {
                navigateTo('seo-dev-docs');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 text-left bg-amber-100 text-amber-900 rounded-lg font-bold"
            >
              ⚡ SEO & Dev Docs
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
