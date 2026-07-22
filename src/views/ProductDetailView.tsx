import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, REVIEWS } from '../data/mockData';
import { WeightOption } from '../types';
import { ProductCard } from '../components/ProductCard';
import {
  Star,
  ShoppingBag,
  Heart,
  GitCompare,
  Sparkles,
  Truck,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  Plus,
  Minus,
  Check,
  Share2,
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const { products, selectedProductId, addToCart, toggleWishlist, isInWishlist, toggleCompare, isComparing, navigateTo, showToast, isAdminUnlocked } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(
    (product?.weightOptions && product.weightOptions.length > 0)
      ? (product.weightOptions.find((w) => w.weight === product.defaultWeight) || product.weightOptions[0])
      : { weight: '500g', pricePKR: product?.basePricePKR || 1000 }
  );
  const [activeImg, setActiveImg] = useState<string>(product?.mainImage || '');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'nutrition' | 'benefits' | 'usage' | 'reviews' | 'shipping'>('overview');

  // Sync selected weight & image if product changes
  React.useEffect(() => {
    if (product) {
      if (product.weightOptions && product.weightOptions.length > 0) {
        setSelectedWeight(product.weightOptions.find((w) => w.weight === product.defaultWeight) || product.weightOptions[0]);
      }
      setActiveImg(product.mainImage);
    }
  }, [product]);

  if (!product) return null;

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('Lahore');
  const [reviewsList, setReviewsList] = useState(REVIEWS.filter((r) => r.productId === product.id));

  const isLiked = isInWishlist(product.id);
  const isComp = isComparing(product.id);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newName.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      userName: newName,
      city: newCity,
      rating: newRating,
      comment: newComment,
      verifiedBuyer: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setReviewsList((prev) => [newRev, ...prev]);
    showToast('Thank you! Your review has been submitted.', 'success');
    setNewComment('');
    setNewName('');
  };

  const handleWhatsAppBuy = () => {
    const text = `Assalamu Alaikum MASTER GROCERY SHOP! I would like to order:
*Product:* ${product.name}
*Weight:* ${selectedWeight.weight}
*Quantity:* ${qty} Pack(s)
*Total Price:* ₨ ${(selectedWeight.pricePKR * qty).toLocaleString()}
Please confirm delivery timeline.`;

    const url = `https://wa.me/923279408969?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Admin Quick Control Banner if unlocked */}
      {isAdminUnlocked && (
        <div className="bg-emerald-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500 text-black rounded-lg font-bold text-xs uppercase">
              ADMIN CONTROL
            </span>
            <span className="text-xs font-bold">You are viewing this product as Store Admin</span>
          </div>
          <button
            onClick={() => navigateTo('admin-products')}
            className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <span>Edit "{product.name}" in Admin Panel →</span>
          </button>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
        <span className="hover:text-emerald-700 cursor-pointer" onClick={() => navigateTo('home')}>Home</span>
        <span>/</span>
        <span className="hover:text-emerald-700 cursor-pointer" onClick={() => navigateTo('shop')}>{product.category}</span>
        <span>/</span>
        <span className="text-gray-900 font-bold">{product.name}</span>
      </div>

      {/* Product Primary Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-xs">
        {/* Gallery */}
        <div className="lg:col-span-5 space-y-3">
          <div className="h-80 md:h-96 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 relative group">
            <img src={activeImg || product.mainImage} alt={product.name} className="w-full h-full object-cover" />
            {product.isOrganic && (
              <span className="absolute top-3 left-3 bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Organic
              </span>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {product.galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImg(img)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  (activeImg || product.mainImage) === img ? 'border-emerald-600 scale-105' : 'border-gray-200 opacity-70'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info & Options */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {product.subcategory} • 📍 {product.origin}
              </span>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-serif leading-tight">
              {product.name}
            </h1>
            {product.nameUrdu && (
              <p className="text-base font-serif text-emerald-800 font-bold mt-1">{product.nameUrdu}</p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-800">{product.rating}</span>
              <span className="text-xs text-gray-400">({reviewsList.length} Customer Reviews)</span>
            </div>

            <p className="text-xs text-gray-600 mt-3 leading-relaxed">{product.description}</p>

            {/* Weight Options */}
            <div className="mt-5">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block mb-2">
                Select Weight Variant:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.weightOptions.map((opt) => (
                  <button
                    key={opt.weight}
                    onClick={() => setSelectedWeight(opt)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                      selectedWeight.weight === opt.weight
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-gray-50 text-gray-800 border-gray-200 hover:border-emerald-400'
                    }`}
                  >
                    <div>{opt.weight}</div>
                    {opt.savingsPct && <span className="text-[10px] block font-normal opacity-80">Save {opt.savingsPct}%</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Display */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-xs font-semibold text-gray-500">PKR</span>
              <span className="text-3xl font-black text-gray-900">
                ₨ {(selectedWeight.pricePKR * qty).toLocaleString()}
              </span>
              {selectedWeight.originalPricePKR && (
                <span className="text-sm text-gray-400 line-through">
                  ₨ {(selectedWeight.originalPricePKR * qty).toLocaleString()}
                </span>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-xs font-bold text-gray-500 uppercase">Quantity:</span>
              <div className="flex items-center border border-gray-300 bg-gray-50 rounded-xl">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2 hover:bg-gray-200">
                  <Minus className="w-4 h-4 text-gray-700" />
                </button>
                <span className="px-4 text-xs font-bold text-gray-900">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="p-2 hover:bg-gray-200">
                  <Plus className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => addToCart(product, selectedWeight, qty)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart ({selectedWeight.weight})</span>
              </button>

              <button
                onClick={handleWhatsAppBuy}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Quick Order via WhatsApp</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Cash on Delivery & Easypaisa</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Express Shipping Across Pakistan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-xs">
        <div className="flex overflow-x-auto border-b border-gray-200 gap-4 pb-3 mb-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Overview & Sourcing
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`pb-2 transition-colors whitespace-nowrap ${activeTab === 'nutrition' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Nutrition Facts Table
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`pb-2 transition-colors whitespace-nowrap ${activeTab === 'benefits' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Health & Medical Benefits
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`pb-2 transition-colors whitespace-nowrap ${activeTab === 'usage' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Usage & Storage Tips
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2 transition-colors whitespace-nowrap ${activeTab === 'reviews' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Customer Reviews ({reviewsList.length})
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs text-gray-700 leading-relaxed max-w-3xl">
            <h3 className="text-base font-bold text-gray-900 font-serif">Harvest & Origin Story</h3>
            <p>{product.description}</p>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <h4 className="font-bold text-emerald-900 mb-1">Our Master Quality Promise:</h4>
              <p className="text-emerald-800">
                Each shipment is cleaned, sorted, and vacuum-sealed in Lahore before dispatching to ensure zero exposure to humidity or dust.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Nutrition */}
        {activeTab === 'nutrition' && (
          <div className="max-w-xl">
            <h3 className="text-base font-bold text-gray-900 font-serif mb-3">Nutritional Values per 100g</h3>
            <div className="border border-gray-200 rounded-2xl overflow-hidden text-xs">
              <div className="flex justify-between p-3 bg-gray-50 font-bold border-b">
                <span>Calories</span>
                <span>{product.nutritionInfo.calories} kcal</span>
              </div>
              <div className="flex justify-between p-3 border-b">
                <span>Protein</span>
                <span className="font-bold text-emerald-700">{product.nutritionInfo.protein}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 border-b">
                <span>Healthy Fats</span>
                <span>{product.nutritionInfo.fats}</span>
              </div>
              <div className="flex justify-between p-3 border-b">
                <span>Carbohydrates</span>
                <span>{product.nutritionInfo.carbs}</span>
              </div>
              {product.nutritionInfo.fiber && (
                <div className="flex justify-between p-3 bg-gray-50 border-b">
                  <span>Dietary Fiber</span>
                  <span>{product.nutritionInfo.fiber}</span>
                </div>
              )}
              {product.nutritionInfo.vitamins && (
                <div className="flex justify-between p-3">
                  <span>Vitamins & Minerals</span>
                  <span className="font-semibold">{product.nutritionInfo.vitamins}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Benefits */}
        {activeTab === 'benefits' && (
          <div className="space-y-3 max-w-2xl text-xs">
            <h3 className="text-base font-bold text-gray-900 font-serif mb-2">Key Health & Wellness Benefits</h3>
            {product.healthBenefits?.map((b, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-emerald-950 font-medium">{b}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Usage */}
        {activeTab === 'usage' && (
          <div className="space-y-3 max-w-2xl text-xs">
            <h3 className="text-base font-bold text-gray-900 font-serif mb-2">Recommended Usage & Pakistani Storage Tips</h3>
            {product.usageTips.map((tip, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="font-bold text-gray-900 block mb-0.5">Tip #{idx + 1}:</span>
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Existing Reviews */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-base font-bold text-gray-900 font-serif">Customer Feedback</h3>
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{rev.userName}</span>
                        <span className="text-gray-400">({rev.city})</span>
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 italic">"{rev.comment}"</p>
                    <span className="text-[10px] text-gray-400 block">{rev.createdAt}</span>
                  </div>
                ))}
              </div>

              {/* Write Review Form */}
              <div className="lg:col-span-5 bg-gray-50 p-6 rounded-3xl border border-gray-200">
                <h3 className="text-sm font-bold font-serif text-gray-900 mb-4">Write a Review</h3>
                <form onSubmit={handleAddReview} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Your Name:</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Tariq Mehmood"
                      required
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Your City:</label>
                    <select
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl"
                    >
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Quetta">Quetta</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Rating Stars:</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewRating(star)}
                          className={`p-1 rounded-lg ${newRating >= star ? 'text-amber-500' : 'text-gray-300'}`}
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Your Feedback:</label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      placeholder="How was the taste, packaging, and delivery speed?"
                      required
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"
                  >
                    Submit Verified Review
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      <div>
        <h2 className="text-xl font-bold font-serif text-gray-900 mb-6">Related Dry Fruits & Groceries</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
