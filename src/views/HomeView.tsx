import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, CATEGORIES, REVIEWS, BLOG_POSTS } from '../data/mockData';
import { HeroBanner } from '../components/HeroBanner';
import { ProductCard } from '../components/ProductCard';
import { WeightPriceCalculator } from '../components/WeightPriceCalculator';
import { AiHealthAssistant } from '../components/AiHealthAssistant';
import {
  Sparkles,
  Flame,
  Award,
  Truck,
  ShieldCheck,
  RefreshCw,
  Star,
  ArrowRight,
  CheckCircle2,
  Heart,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { products, navigateTo, setSelectedCategoryFilter } = useStore();

  // Flash Deal Countdown Timer (Simulated)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashDeals = products.filter((p) => p.isFlashDeal);
  const dryFruits = products.filter((p) => p.category === 'dry-fruits');
  const groceries = products.filter((p) => p.category !== 'dry-fruits');

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Trust Value Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto px-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-xs">100% Pure & Organic</h4>
            <p className="text-[11px] text-gray-500">Sourced directly from farmers</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-xs">Nationwide Express</h4>
            <p className="text-[11px] text-gray-500">24-48 hr Lahore, KHI, ISL</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-xs">COD & Mobile Wallets</h4>
            <p className="text-[11px] text-gray-500">Easypaisa, JazzCash, Cards</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-xs">7-Day Fresh Guarantee</h4>
            <p className="text-[11px] text-gray-500">Full replacement warranty</p>
          </div>
        </div>
      </div>

      {/* 3. Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase text-emerald-700 tracking-wider">Explore Collections</span>
            <h2 className="text-2xl font-bold font-serif text-gray-900">Featured Shop Categories</h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategoryFilter('all');
              navigateTo('shop');
            }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategoryFilter(cat.slug);
                navigateTo('shop');
              }}
              className="bg-white rounded-2xl border border-gray-200 p-3 text-center hover:border-emerald-600 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="h-28 rounded-xl overflow-hidden mb-2 bg-gray-100">
                <img
                  src={cat.featuredImage}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-gray-900 text-xs group-hover:text-emerald-700 line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[10px] text-emerald-800 font-serif font-medium">{cat.nameUrdu}</p>
              <span className="text-[10px] text-gray-400 block mt-0.5">{cat.itemCount} Items</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Flash Deals Section */}
      <section className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-3xl p-6 md:p-8 max-w-7xl mx-auto text-emerald-950 shadow-xl border border-amber-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-900 text-amber-400 rounded-2xl shadow-md">
              <Flame className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-950">Daily Special</span>
              <h2 className="text-2xl font-black font-serif">Pakistan Flash Deals & Discounts</h2>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-emerald-950 text-white px-4 py-2.5 rounded-2xl shadow-inner font-mono text-sm">
            <span className="text-amber-400 text-xs uppercase font-bold mr-1">Ends In:</span>
            <span className="bg-emerald-900 px-2 py-0.5 rounded-md font-bold">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span>:</span>
            <span className="bg-emerald-900 px-2 py-0.5 rounded-md font-bold">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span>:</span>
            <span className="bg-emerald-900 px-2 py-0.5 rounded-md font-bold">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {flashDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Premium Dry Fruits Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase text-amber-600 tracking-wider">Direct From Hunza & Quetta</span>
            <h2 className="text-2xl font-bold font-serif text-gray-900">Premium Organic Dry Fruits</h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategoryFilter('dry-fruits');
              navigateTo('shop');
            }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Explore All Dry Fruits</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {dryFruits.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Weight & Price Calculator */}
      <section className="max-w-7xl mx-auto px-4">
        <WeightPriceCalculator />
      </section>

      {/* 7. Fresh Grocery Collection */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase text-emerald-700 tracking-wider">Daily Kitchen Essentials</span>
            <h2 className="text-2xl font-bold font-serif text-gray-900">Fresh Grocery & Staples</h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategoryFilter('all');
              navigateTo('shop');
            }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All Staples</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {groceries.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. AI Health Assistant */}
      <section className="max-w-7xl mx-auto px-4">
        <AiHealthAssistant />
      </section>

      {/* 9. Verified Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase text-emerald-700 tracking-wider">Pakistani Buyer Trust</span>
          <h2 className="text-2xl font-bold font-serif text-gray-900 mt-1">
            Loved by Thousands of Families Across Pakistan
          </h2>
          <p className="text-xs text-gray-500 mt-1">Real feedback from verified customers in Lahore, Karachi, Islamabad & Peshawar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {REVIEWS.map((rev) => (
            <div key={rev.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              </div>

              <p className="text-xs text-gray-700 italic leading-relaxed">"{rev.comment}"</p>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="font-bold text-gray-900">{rev.userName}</span>
                <span className="text-gray-400 text-[11px]">📍 {rev.city}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Blog Articles Preview */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase text-amber-600 tracking-wider">Health & Cooking Tips</span>
            <h2 className="text-2xl font-bold font-serif text-gray-900">Articles & Nutritional Guides</h2>
          </div>
          <button onClick={() => navigateTo('blog')} className="text-xs font-bold text-emerald-700 hover:underline">
            Read All Articles →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => navigateTo('blog-detail', { blogSlug: post.slug })}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer grid grid-cols-1 sm:grid-cols-12"
            >
              <div className="sm:col-span-5 h-48 sm:h-full bg-gray-100">
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <div className="sm:col-span-7 p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-md">
                    {post.category}
                  </span>
                  <h3 className="font-bold text-sm font-serif text-gray-900 hover:text-emerald-700 transition-colors mt-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1.5">{post.excerpt}</p>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 mt-3">
                  <span>By {post.author}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
