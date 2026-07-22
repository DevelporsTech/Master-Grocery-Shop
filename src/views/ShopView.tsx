import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { Filter, SlidersHorizontal, Grid, List, Sparkles, RefreshCw, X } from 'lucide-react';

export const ShopView: React.FC = () => {
  const {
    products,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [sortOption, setSortOption] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [onlyFlash, setOnlyFlash] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategoryFilter !== 'all') {
      result = result.filter((p) => p.category === selectedCategoryFilter || p.slug === selectedCategoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    result = result.filter((p) => p.basePricePKR >= minPrice && p.basePricePKR <= maxPrice);

    if (onlyOrganic) result = result.filter((p) => p.isOrganic);
    if (onlyFlash) result = result.filter((p) => p.isFlashDeal);

    if (sortOption === 'price-low') {
      result.sort((a, b) => a.basePricePKR - b.basePricePKR);
    } else if (sortOption === 'price-high') {
      result.sort((a, b) => b.basePricePKR - a.basePricePKR);
    } else if (sortOption === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategoryFilter, searchQuery, minPrice, maxPrice, onlyOrganic, onlyFlash, sortOption]);

  const resetFilters = () => {
    setSelectedCategoryFilter('all');
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(10000);
    setOnlyOrganic(false);
    setOnlyFlash(false);
    setSortOption('default');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            {selectedCategoryFilter === 'all' ? 'Entire Catalog' : selectedCategoryFilter.replace('-', ' ')}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-white">
            Pakistan Grocery & Dry Fruit Shop
          </h1>
          <p className="text-xs text-emerald-200 mt-1">
            Showing {filteredProducts.length} items available for Express Nationwide Shipping
          </p>
        </div>

        {searchQuery && (
          <div className="bg-emerald-800/80 px-4 py-2 rounded-xl border border-emerald-700 flex items-center gap-2 text-xs">
            <span>Query: "<strong>{searchQuery}</strong>"</span>
            <button onClick={() => setSearchQuery('')} className="text-amber-300 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-3 space-y-6 bg-white p-5 rounded-3xl border border-gray-200 shadow-xs h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 font-serif">
              <Filter className="w-4 h-4 text-emerald-600" /> Filter Options
            </h3>
            <button onClick={resetFilters} className="text-xs text-emerald-700 hover:underline font-semibold">
              Reset
            </button>
          </div>

          {/* Categories Filter List */}
          <div>
            <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2.5">Categories</h4>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex justify-between ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-gray-700 hover:bg-emerald-50'
                }`}
              >
                <span>All Categories</span>
                <span>({products.length})</span>
              </button>

              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex justify-between ${
                    selectedCategoryFilter === cat.slug
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-gray-700 hover:bg-emerald-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="opacity-70">({cat.itemCount})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">
              Price Range (PKR)
            </h4>
            <div className="flex items-center justify-between text-xs font-bold text-gray-800">
              <span>₨ {minPrice.toLocaleString()}</span>
              <span>₨ {maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="200"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Attributes Checkboxes */}
          <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-gray-800 font-semibold">
              <input
                type="checkbox"
                checked={onlyOrganic}
                onChange={(e) => setOnlyOrganic(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>100% Organic Certified</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-gray-800 font-semibold">
              <input
                type="checkbox"
                checked={onlyFlash}
                onChange={(e) => setOnlyFlash(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Flash Deals & Offers</span>
            </label>
          </div>
        </div>

        {/* Main Product Grid */}
        <div className="lg:col-span-9 space-y-6">
          {/* Sorting & Layout Switcher */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">Sort By:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 font-bold text-gray-800 focus:ring-2 focus:ring-emerald-600"
              >
                <option value="default">Featured / Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-medium">Layout:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg border ${
                  viewMode === 'grid' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3">
              <RefreshCw className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-800">No products match your filter criteria</h3>
              <p className="text-xs text-gray-500">Try adjusting your price slider or clearing your search query.</p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
