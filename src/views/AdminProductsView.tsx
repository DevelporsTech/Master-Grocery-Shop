import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, WeightOption, Order, Coupon } from '../types';
import { CATEGORIES, COUPONS } from '../data/mockData';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Flame,
  ShieldCheck,
  Tag,
  DollarSign,
  Image as ImageIcon,
  Upload,
  Camera,
  Layers,
  Globe,
  Eye,
  CheckCircle2,
  ArrowLeft,
  Link,
  Edit2,
  LayoutDashboard,
  ShoppingBag,
  Truck,
  Ticket,
  Settings,
  TrendingUp,
  Printer,
  MapPin,
  Phone,
  Mail,
  FileText,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  Store,
} from 'lucide-react';

// Preset High Quality Stock Images for easy 1-click product image creation
const PRESET_IMAGES = [
  { label: 'Irani Mamra Almonds', url: 'https://images.unsplash.com/photo-1508061252966-1738f7129f10?auto=format&fit=crop&w=800&q=80' },
  { label: 'Gilgit Walnuts', url: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Swat Pistachios', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Madinah Ajwa Dates', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Kainat Basmati Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bilona Desi Ghee', url: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=800&q=80' },
  { label: 'Organic Pulses & Daal', url: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80' },
  { label: 'Peshawari Green Tea', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80' },
];

export const AdminProductsView: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProductsToDefault,
    recentOrders,
    updateOrderStatus,
    isAdminUnlocked,
    setIsAdminUnlocked,
    adminPasscode,
    unlockAdmin,
    lockAdmin,
    updateAdminPasscode,
    navigateTo,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons' | 'settings'>('overview');

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [newPasscodeState, setNewPasscodeState] = useState('');

  // Products Filters
  const [filterQuery, setFilterQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Orders Filters
  const [orderQuery, setOrderQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState<Order | null>(null);

  // Coupon State
  const [couponsList, setCouponsList] = useState<Coupon[]>(COUPONS);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<{ code: string; value: number; minOrderPKR: number; description: string }>({
    code: '',
    value: 10,
    minOrderPKR: 2000,
    description: 'Special Discount Code',
  });

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Quick Image Change Modal State
  const [quickImageProduct, setQuickImageProduct] = useState<Product | null>(null);
  const [quickImageUrl, setQuickImageUrl] = useState<string>('');

  // Quick Product Name Change Modal State
  const [quickRenameProduct, setQuickRenameProduct] = useState<Product | null>(null);
  const [quickName, setQuickName] = useState<string>('');
  const [quickNameUrdu, setQuickNameUrdu] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const modalFileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State for Products
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    nameUrdu: '',
    category: 'dry-fruits',
    subcategory: 'Premium Dry Fruits',
    origin: 'Gilgit-Baltistan, Pakistan',
    basePricePKR: 1500,
    originalPricePKR: 1800,
    defaultWeight: '500g',
    shortDescription: '',
    description: '',
    mainImage: PRESET_IMAGES[0].url,
    isOrganic: true,
    isBestSeller: false,
    isFlashDeal: false,
    flashDiscountPct: 15,
    inStock: true,
    tags: ['Fresh', 'Organic'],
    weightOptions: [
      { weight: '250g', pricePKR: 800, stock: 100 },
      { weight: '500g', pricePKR: 1500, stock: 100 },
      { weight: '1kg', pricePKR: 2800, stock: 50 },
    ],
  });

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = unlockAdmin(pinInput);
    if (!res.success) {
      setPinError(true);
    } else {
      setPinError(false);
      setPinInput('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'modal' | 'quick') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP)', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (target === 'modal') {
        setFormData((prev) => ({ ...prev, mainImage: result }));
      } else {
        setQuickImageUrl(result);
      }
      showToast('Image uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleAddWeightOption = () => {
    const currentOptions = formData.weightOptions || [];
    setFormData({
      ...formData,
      weightOptions: [
        ...currentOptions,
        { weight: '1kg', pricePKR: (formData.basePricePKR || 1000) * 1.8, stock: 50 },
      ],
    });
  };

  const handleUpdateWeightOption = (index: number, field: keyof WeightOption, value: any) => {
    const currentOptions = [...(formData.weightOptions || [])];
    currentOptions[index] = { ...currentOptions[index], [field]: value };
    setFormData({ ...formData, weightOptions: currentOptions });
  };

  const handleRemoveWeightOption = (index: number) => {
    const currentOptions = [...(formData.weightOptions || [])];
    if (currentOptions.length <= 1) {
      showToast('Product must have at least one weight option', 'warning');
      return;
    }
    currentOptions.splice(index, 1);
    setFormData({ ...formData, weightOptions: currentOptions });
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      nameUrdu: '',
      category: 'dry-fruits',
      subcategory: 'Premium Dry Fruits',
      origin: 'Gilgit-Baltistan, Pakistan',
      basePricePKR: 1500,
      originalPricePKR: 1800,
      defaultWeight: '500g',
      shortDescription: 'Fresh premium quality grocery item.',
      description: 'Sourced directly from certified suppliers in Pakistan for highest purity and freshness.',
      mainImage: PRESET_IMAGES[0].url,
      isOrganic: true,
      isBestSeller: false,
      isFlashDeal: false,
      flashDiscountPct: 15,
      inStock: true,
      tags: ['Fresh', 'Organic'],
      weightOptions: [
        { weight: '250g', pricePKR: 800, stock: 100 },
        { weight: '500g', pricePKR: 1500, stock: 100 },
        { weight: '1kg', pricePKR: 2800, stock: 50 },
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      weightOptions: product.weightOptions ? [...product.weightOptions] : [
        { weight: product.defaultWeight || '500g', pricePKR: product.basePricePKR, stock: 50 }
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenQuickImageModal = (product: Product) => {
    setQuickImageProduct(product);
    setQuickImageUrl(product.mainImage);
  };

  const handleSaveQuickImage = () => {
    if (quickImageProduct && quickImageUrl) {
      updateProduct(quickImageProduct.id, {
        mainImage: quickImageUrl,
        galleryImages: [quickImageUrl],
      });
      showToast(`Updated image for ${quickImageProduct.name}`, 'success');
      setQuickImageProduct(null);
    }
  };

  const handleOpenQuickRenameModal = (product: Product) => {
    setQuickRenameProduct(product);
    setQuickName(product.name);
    setQuickNameUrdu(product.nameUrdu || '');
  };

  const handleSaveQuickRename = () => {
    if (quickRenameProduct) {
      if (!quickName.trim()) {
        showToast('Please enter a product title', 'warning');
        return;
      }
      updateProduct(quickRenameProduct.id, {
        name: quickName.trim(),
        nameUrdu: quickNameUrdu.trim() || undefined,
      });
      showToast(`Updated product title to "${quickName.trim()}"`, 'success');
      setQuickRenameProduct(null);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showToast('Please enter a product name', 'warning');
      return;
    }
    if (!formData.basePricePKR || formData.basePricePKR <= 0) {
      showToast('Please enter a valid base price in PKR', 'warning');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingProductId) {
      deleteProduct(deletingProductId);
      setDeletingProductId(null);
    }
  };

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) {
      showToast('Please enter a coupon code', 'warning');
      return;
    }
    const formattedCode = newCoupon.code.trim().toUpperCase();
    if (couponsList.some((c) => c.code === formattedCode)) {
      showToast('Coupon code already exists!', 'warning');
      return;
    }
    const created: Coupon = {
      code: formattedCode,
      discountType: 'percentage',
      value: Number(newCoupon.value) || 10,
      minOrderPKR: Number(newCoupon.minOrderPKR) || 2000,
      description: newCoupon.description || 'Special Discount Code',
    };
    setCouponsList([created, ...couponsList]);
    showToast(`Added new coupon code: ${formattedCode}`, 'success');
    setIsCouponModalOpen(false);
    setNewCoupon({ code: '', value: 10, minOrderPKR: 2000, description: 'Special Discount Code' });
  };

  const handleDeleteCoupon = (code: string) => {
    setCouponsList((prev) => prev.filter((c) => c.code !== code));
    showToast(`Removed coupon: ${code}`, 'info');
  };

  // Filtered product inventory
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.origin.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtered orders
  const filteredOrders = recentOrders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(orderQuery.toLowerCase()) ||
      o.phone.includes(orderQuery) ||
      o.trackingNumber.toLowerCase().includes(orderQuery.toLowerCase()) ||
      o.city.toLowerCase().includes(orderQuery.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Analytics Metrics
  const totalRevenuePKR = recentOrders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.totalPKR : 0), 0);
  const totalOrdersCount = recentOrders.length;
  const pendingOrdersCount = recentOrders.filter((o) => o.status === 'Order Placed' || o.status === 'Packing Fresh').length;
  const deliveredOrdersCount = recentOrders.filter((o) => o.status === 'Delivered').length;
  const avgOrderValuePKR = totalOrdersCount > 0 ? Math.round(totalRevenuePKR / totalOrdersCount) : 0;

  // Security Lock Overlay
  if (!isAdminUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-50 text-[#16A34A] rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
            PROTECTED STORE ADMIN PORTAL
          </span>
          <h2 className="text-2xl font-bold font-serif text-[#111827] mt-3">Store Passcode Required</h2>
          <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
            Master Grocery Shop • Regal Chowk, Sheikhupura, Punjab
            <br />
            Only store managers with the secret passcode can edit products, prices, or orders.
          </p>
        </div>

        <form onSubmit={handleUnlockPin} className="space-y-4">
          <div className="text-left">
            <label className="block text-xs font-bold text-[#111827] mb-1.5">
              Enter Owner Passcode
            </label>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                if (pinError) setPinError(false);
              }}
              placeholder="Enter secret passcode"
              className="w-full px-4 py-3.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl text-base font-mono tracking-widest text-center text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              autoFocus
            />
            {pinError ? (
              <p className="text-xs text-red-600 mt-1.5 font-bold flex items-center gap-1 justify-center">
                <XCircle className="w-3.5 h-3.5" /> Incorrect Passcode. Please try again.
              </p>
            ) : (
              <p className="text-[11px] text-gray-500 mt-1.5 text-center">
                Authorized store management access only
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
          >
            <Unlock className="w-4 h-4" />
            <span>Unlock Admin Control Panel</span>
          </button>
        </form>

        <div className="pt-4 border-t border-[#E5E7EB]">
          <button
            onClick={() => navigateTo('home')}
            className="text-xs font-bold text-gray-600 hover:text-emerald-700 hover:underline flex items-center justify-center gap-1.5 mx-auto transition-colors"
          >
            <Store className="w-4 h-4 text-[#16A34A]" />
            <span>Return to Public Grocery Store</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Admin Header Bar */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="/logo.jpg"
            alt="Master Grocery Store Logo"
            className="w-14 h-14 object-cover rounded-2xl border-2 border-emerald-200 shadow-md"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold font-serif text-[#111827]">
                Master Grocery Store Admin Panel
              </h1>
              <span className="text-[10px] font-bold bg-[#F0FDF4] text-[#16A34A] px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Owner Active
              </span>
            </div>
            <p className="text-xs text-[#6B7280] flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Regal Chowk, Sheikhupura, Punjab, Pakistan</span>
              <span>•</span>
              <Phone className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>+92 327 9408969</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('home')}
            className="px-4 py-2 bg-[#FAFAFA] hover:bg-gray-100 border border-[#E5E7EB] text-[#111827] font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
          >
            <Globe className="w-4 h-4 text-[#16A34A]" />
            <span>View Public Storefront</span>
          </button>

          <button
            onClick={() => {
              setIsAdminUnlocked(false);
              showToast('Admin Portal Locked', 'info');
            }}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
          >
            <Lock className="w-4 h-4" />
            <span>Lock Portal</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-[#E5E7EB] shadow-xs flex items-center gap-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'bg-[#16A34A] text-white shadow-md'
              : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFA]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview & Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'products'
              ? 'bg-[#16A34A] text-white shadow-md'
              : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFA]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products Catalog</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'products' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}`}>
            {products.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'orders'
              ? 'bg-[#16A34A] text-white shadow-md'
              : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFA]'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Orders & Deliveries</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'}`}>
            {recentOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'coupons'
              ? 'bg-[#16A34A] text-white shadow-md'
              : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFA]'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Coupons & Discounts</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'settings'
              ? 'bg-[#16A34A] text-white shadow-md'
              : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFA]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Store Info & Settings</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#E5E7EB] shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase">Total Store Sales</span>
                <div className="p-2.5 bg-emerald-50 text-[#16A34A] rounded-2xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black font-serif text-[#111827] mt-2">
                ₨ {totalRevenuePKR.toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> From {totalOrdersCount} verified orders
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E5E7EB] shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase">Active Inventory</span>
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black font-serif text-[#111827] mt-2">
                {products.length} Items
              </p>
              <p className="text-[11px] text-blue-600 font-bold mt-1">
                {products.filter((p) => p.inStock).length} in stock • {products.filter((p) => !p.inStock).length} out of stock
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E5E7EB] shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase">Orders Pending</span>
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black font-serif text-[#111827] mt-2">
                {pendingOrdersCount} Pending
              </p>
              <p className="text-[11px] text-amber-600 font-bold mt-1">
                {deliveredOrdersCount} orders delivered across Pakistan
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E5E7EB] shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase">Avg Order Value</span>
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black font-serif text-[#111827] mt-2">
                ₨ {avgOrderValuePKR.toLocaleString()}
              </p>
              <p className="text-[11px] text-purple-600 font-bold mt-1">
                Express Delivery via TCS / Leopard
              </p>
            </div>
          </div>

          {/* Quick Actions & Category Share */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-bold font-serif text-base text-[#111827] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#16A34A]" />
                  <span>Category Revenue Breakdown</span>
                </h3>
                <span className="text-xs text-gray-400">Live Inventory Distribution</span>
              </div>

              <div className="space-y-3.5">
                {CATEGORIES.map((cat) => {
                  const catProducts = products.filter((p) => p.category === cat.id);
                  const pct = Math.round((catProducts.length / (products.length || 1)) * 100);
                  return (
                    <div key={cat.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                        <span>{cat.name} ({cat.nameUrdu})</span>
                        <span>{catProducts.length} Products ({pct}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#16A34A] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Tile */}
            <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-md space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-[#F59E0B] text-black px-2.5 py-1 rounded-full">
                  STORE MANAGEMENT
                </span>
                <h3 className="text-lg font-bold font-serif text-white mt-2">Quick Store Controls</h3>
                <p className="text-xs text-emerald-200 mt-1">
                  Manage dry fruit inventory, review live Pakistan courier orders, or print dispatch slips.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleOpenAddModal}
                  className="w-full py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product to Store</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4 text-[#F59E0B]" />
                  <span>Review {recentOrders.length} Orders</span>
                </button>

                <button
                  onClick={resetProductsToDefault}
                  className="w-full py-2 bg-emerald-950/60 hover:bg-emerald-950 text-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-emerald-800"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Catalog Defaults</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Orders Stream */}
          <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold font-serif text-base text-[#111827] flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#16A34A]" />
                <span>Recent Customer Orders</span>
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-[#16A34A] hover:underline"
              >
                View All Orders →
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {recentOrders.slice(0, 5).map((o) => (
                <div key={o.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold font-mono text-[#111827]">{o.trackingNumber}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {o.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      {o.customerName} • {o.city} ({o.paymentMethod.toUpperCase()})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-[#111827] text-sm">₨ {o.totalPKR.toLocaleString()}</span>
                    <p className="text-[10px] text-gray-400">{o.items.length} item(s)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CATALOG */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Controls & Search Header */}
          <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold font-serif text-[#111827]">
                  Master Product Catalog ({filteredProducts.length})
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Add, edit prices, update stock, or modify product titles & images.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleOpenAddModal}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>

                <button
                  onClick={resetProductsToDefault}
                  title="Reset catalog to default preset items"
                  className="p-2.5 bg-[#FAFAFA] hover:bg-gray-100 text-[#6B7280] border border-[#E5E7EB] rounded-xl"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280]" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Search by title, origin, SKU..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#111827]"
              >
                <option value="all">All Categories ({products.length})</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({products.filter((p) => p.category === c.id).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products List Table / Grid */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFAFA] text-[#6B7280] font-extrabold uppercase border-b border-[#E5E7EB]">
                  <tr>
                    <th className="p-4">Product Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Base Price (PKR)</th>
                    <th className="p-4">Stock Status</th>
                    <th className="p-4">Badges</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="relative shrink-0">
                            <img
                              src={p.mainImage}
                              alt={p.name}
                              className="w-12 h-12 object-cover rounded-xl border border-gray-200"
                            />
                            <button
                              onClick={() => handleOpenQuickImageModal(p)}
                              title="Click to change image"
                              className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-white rounded-full shadow-xs hover:scale-110 transition-transform"
                            >
                              <ImageIcon className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          <div>
                            <button
                              onClick={() => handleOpenQuickRenameModal(p)}
                              className="text-left font-bold text-[#111827] hover:text-[#16A34A] text-xs flex items-center gap-1 group/title"
                              title="Click to rename product"
                            >
                              <span>{p.name}</span>
                              <Edit2 className="w-3 h-3 text-[#16A34A] opacity-0 group-hover/title:opacity-100 transition-opacity" />
                            </button>
                            {p.nameUrdu && <p className="text-[10px] text-[#16A34A] font-serif">{p.nameUrdu}</p>}
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-[#6B7280] font-mono">{p.sku}</span>
                              <span className="text-gray-300">•</span>
                              <button
                                onClick={() => handleOpenQuickRenameModal(p)}
                                className="text-[10px] font-bold text-[#16A34A] hover:underline flex items-center gap-0.5"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>Edit Name</span>
                              </button>
                              <span className="text-gray-300">•</span>
                              <button
                                onClick={() => handleOpenQuickImageModal(p)}
                                className="text-[10px] font-bold text-amber-600 hover:underline flex items-center gap-0.5"
                              >
                                <ImageIcon className="w-3 h-3" />
                                <span>Change Image</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-gray-700 uppercase text-[11px]">
                        {p.category}
                      </td>

                      <td className="p-4">
                        <span className="font-extrabold text-[#111827]">₨ {p.basePricePKR.toLocaleString()}</span>
                        {p.originalPricePKR && (
                          <span className="text-[10px] text-gray-400 line-through block">
                            ₨ {p.originalPricePKR.toLocaleString()}
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => {
                            updateProduct(p.id, { inStock: !p.inStock });
                            showToast(`Toggled stock for ${p.name}`, 'info');
                          }}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 w-fit ${
                            p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {p.inStock ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>{p.inStock ? 'IN STOCK' : 'OUT OF STOCK'}</span>
                        </button>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {p.isOrganic && (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                              Organic
                            </span>
                          )}
                          {p.isBestSeller && (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold">
                              Best Seller
                            </span>
                          )}
                          {p.isFlashDeal && (
                            <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 text-[10px] font-bold">
                              Flash Sale
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-2 bg-gray-100 hover:bg-[#16A34A] hover:text-white rounded-lg transition-colors text-gray-700"
                            title="Edit full product details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeletingProductId(p.id)}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS & DELIVERIES */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold font-serif text-[#111827]">
                  Order Management & Courier Dispatch ({filteredOrders.length})
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Track live orders placed across Pakistan, update fulfillment statuses, and generate packing slips.
                </p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280]" />
                <input
                  type="text"
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="Search by customer name, phone, tracking ID, or city..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#111827]"
              >
                <option value="all">All Order Statuses ({recentOrders.length})</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Packing Fresh">Packing Fresh</option>
                <option value="Out for Courier">Out for Courier</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Cards Grid */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center border border-[#E5E7EB] text-gray-500">
                <Truck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="font-bold">No matching orders found</p>
              </div>
            ) : (
              filteredOrders.map((o) => (
                <div key={o.id} className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <div>
                      <span className="font-mono font-black text-sm text-[#111827]">{o.trackingNumber}</span>
                      <span className="text-xs text-gray-400 ml-2 font-mono">({new Date(o.createdAt).toLocaleDateString()})</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status Selector */}
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        className="px-3 py-1.5 bg-emerald-50 text-[#16A34A] font-extrabold text-xs rounded-xl border border-emerald-200 focus:ring-2 focus:ring-[#16A34A]"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing Fresh">Packing Fresh</option>
                        <option value="Out for Courier">Out for Courier</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => setSelectedOrderForSlip(o)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Slip</span>
                      </button>
                    </div>
                  </div>

                  {/* Customer Info & Items */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="font-bold text-gray-400 uppercase text-[10px]">Customer & Destination</span>
                      <p className="font-bold text-[#111827]">{o.customerName}</p>
                      <p className="text-gray-600">{o.phone}</p>
                      <p className="text-gray-500 font-serif">{o.address}, {o.city}, {o.province}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-gray-400 uppercase text-[10px]">Payment & Courier</span>
                      <p className="font-bold text-[#111827] uppercase">Method: {o.paymentMethod}</p>
                      <p className="text-emerald-700 font-semibold">Payment: {o.paymentStatus}</p>
                      <p className="text-gray-500">Courier: {o.courierName}</p>
                    </div>

                    <div className="space-y-1 md:text-right">
                      <span className="font-bold text-gray-400 uppercase text-[10px]">Order Total</span>
                      <p className="text-xl font-black text-[#111827]">₨ {o.totalPKR.toLocaleString()}</p>
                      <p className="text-gray-500 text-[10px]">{o.items.length} item(s) ordered</p>
                    </div>
                  </div>

                  {/* Items Summary Table */}
                  <div className="bg-[#FAFAFA] rounded-2xl p-3 text-xs space-y-1 border border-gray-100">
                    <span className="font-bold text-gray-500 uppercase text-[10px]">Ordered Items:</span>
                    {o.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between font-medium text-gray-800">
                        <span>• {item.quantity}x {item.productName} ({item.weight})</span>
                        <span className="font-bold">₨ {item.totalPricePKR.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: COUPONS & DISCOUNTS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold font-serif text-[#111827]">
                Store Promotional Coupons & Discounts
              </h2>
              <p className="text-xs text-[#6B7280]">
                Create discount codes for customer checkout savings.
              </p>
            </div>

            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Coupon Code</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {couponsList.map((c) => (
              <div key={c.code} className="bg-white p-5 rounded-3xl border border-[#E5E7EB] shadow-xs space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-base text-[#16A34A] bg-[#F0FDF4] px-3 py-1 rounded-xl border border-emerald-200">
                    {c.code}
                  </span>
                  <button
                    onClick={() => handleDeleteCoupon(c.code)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs font-bold text-[#111827]">{c.description}</p>

                <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                  <p>Discount: <strong className="text-gray-900">{c.value}% OFF</strong></p>
                  <p>Min Order: <strong className="text-gray-900">₨ {c.minOrderPKR.toLocaleString()}</strong></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: STORE INFO & SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-xs space-y-6 max-w-3xl">
          <div>
            <h2 className="text-xl font-bold font-serif text-[#111827]">
              Store Profile & Location Settings
            </h2>
            <p className="text-xs text-[#6B7280] mt-1">
              Verified physical store address and official owner contact details.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#FAFAFA] rounded-2xl border border-gray-200 space-y-2">
              <span className="font-bold text-[#111827] block text-sm">🏬 Physical Store Address:</span>
              <p className="text-gray-700 font-semibold text-sm">Regal Chowk, Sheikhupura, Punjab, Pakistan</p>
              <p className="text-gray-500">Postal Code: 39350</p>
            </div>

            <div className="p-4 bg-[#FAFAFA] rounded-2xl border border-gray-200 space-y-2">
              <span className="font-bold text-[#111827] block text-sm">📞 Phone & WhatsApp Order Hotline:</span>
              <p className="text-gray-700 font-semibold text-sm">+92 327 9408969</p>
            </div>

            <div className="p-4 bg-[#FAFAFA] rounded-2xl border border-gray-200 space-y-2">
              <span className="font-bold text-[#111827] block text-sm">✉️ Official Email Address:</span>
              <p className="text-gray-700 font-semibold text-sm">mastergrocerystore302@gmail.com</p>
            </div>

            <div className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/70 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-950 block text-sm flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-emerald-700" /> Store Owner Admin Passcode Protection
                  </span>
                  <p className="text-emerald-800 text-xs mt-0.5">
                    Current Active Passcode: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-900">{adminPasscode}</strong>
                  </p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateAdminPasscode(newPasscodeState);
                  setNewPasscodeState('');
                }}
                className="flex flex-col sm:flex-row gap-2 pt-1"
              >
                <input
                  type="password"
                  value={newPasscodeState}
                  onChange={(e) => setNewPasscodeState(e.target.value)}
                  placeholder="Enter new secret passcode"
                  className="flex-1 px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl font-mono text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer"
                >
                  Update Passcode
                </button>
              </form>
              <p className="text-[11px] text-emerald-700 italic">
                Note: Give this passcode only to trusted managers who need access to edit products or prices.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-[#E5E7EB] shadow-2xl my-8 space-y-5 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#6B7280] hover:text-[#111827] bg-[#FAFAFA] rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase bg-[#F0FDF4] text-[#16A34A] px-2.5 py-1 rounded-full">
                {editingProduct ? 'EDIT ITEM' : 'NEW CATALOG ITEM'}
              </span>
              <h3 className="text-xl font-bold font-serif text-[#111827] mt-1">
                {editingProduct ? `Edit ${editingProduct.name}` : 'Add New Product to Store'}
              </h3>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#111827] mb-1">Product Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Gilgit Kagzi Walnut Halves"
                    className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#111827] mb-1">Product Title (Urdu)</label>
                  <input
                    type="text"
                    value={formData.nameUrdu || ''}
                    onChange={(e) => setFormData({ ...formData, nameUrdu: e.target.value })}
                    placeholder="e.g. گلگت کاغذی اخروٹ"
                    className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl font-serif text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#111827] mb-1">Category *</label>
                  <select
                    value={formData.category || 'dry-fruits'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl font-semibold text-xs"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#111827] mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={formData.subcategory || ''}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    placeholder="e.g. Premium Dry Fruits"
                    className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#111827] mb-1">Origin / Location</label>
                  <input
                    type="text"
                    value={formData.origin || ''}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="e.g. Gilgit-Baltistan, Pakistan"
                    className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#111827] mb-1">Base Display Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.basePricePKR || 0}
                    onChange={(e) => setFormData({ ...formData, basePricePKR: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl font-extrabold text-[#111827] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#111827] mb-1">Original Price (Strikethrough PKR)</label>
                  <input
                    type="number"
                    value={formData.originalPricePKR || 0}
                    onChange={(e) => setFormData({ ...formData, originalPricePKR: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">Product Main Image (URL, Local File Upload, or Stock Presets)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={formData.mainImage || ''}
                    onChange={(e) => setFormData({ ...formData, mainImage: e.target.value, galleryImages: [e.target.value] })}
                    placeholder="Paste image URL link..."
                    className="flex-1 px-3.5 py-2 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-xs"
                  />
                  <input
                    type="file"
                    ref={modalFileInputRef}
                    onChange={(e) => handleFileUpload(e, 'modal')}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => modalFileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-[#FAFAFA] hover:bg-gray-100 border border-[#E5E7EB] font-bold rounded-xl flex items-center gap-1.5 text-xs text-[#16A34A]"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                </div>

                {/* Image Preview Box */}
                {formData.mainImage && (
                  <div className="flex items-center gap-3 p-2 bg-[#FAFAFA] rounded-2xl border border-gray-200 mb-2">
                    <img src={formData.mainImage} alt="Preview" className="w-12 h-12 object-cover rounded-xl border border-gray-300" />
                    <span className="text-[11px] text-gray-600 font-mono truncate">Live Preview Active</span>
                  </div>
                )}

                {/* Presets */}
                <span className="text-[10px] font-bold text-gray-500 block mb-1">Or choose a 1-click high quality preset photo:</span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, mainImage: preset.url, galleryImages: [preset.url] })}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#16A34A] border border-emerald-200 rounded-lg text-[10px] font-bold"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight Options & Individual Prices */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-emerald-950 text-xs">Weight Variations & Custom Prices (PKR)</label>
                    <p className="text-[10px] text-emerald-800">Set custom weights (250g, 500g, 1kg) and prices for customer selection.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddWeightOption}
                    className="px-3 py-1 bg-[#16A34A] text-white font-bold text-[11px] rounded-lg shadow-xs flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Weight Option
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.weightOptions || []).map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-emerald-200">
                      <div className="w-1/3">
                        <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Weight Label</label>
                        <input
                          type="text"
                          value={opt.weight}
                          onChange={(e) => handleUpdateWeightOption(idx, 'weight', e.target.value)}
                          placeholder="e.g. 250g, 500g, 1kg"
                          className="w-full px-2.5 py-1.5 bg-[#FAFAFA] border border-gray-200 rounded-lg font-bold text-xs"
                        />
                      </div>
                      <div className="w-1/3">
                        <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Price (PKR)</label>
                        <input
                          type="number"
                          value={opt.pricePKR}
                          onChange={(e) => handleUpdateWeightOption(idx, 'pricePKR', Number(e.target.value))}
                          placeholder="800"
                          className="w-full px-2.5 py-1.5 bg-[#FAFAFA] border border-gray-200 rounded-lg font-extrabold text-xs text-[#111827]"
                        />
                      </div>
                      <div className="w-1/4">
                        <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Stock</label>
                        <input
                          type="number"
                          value={opt.stock ?? 50}
                          onChange={(e) => handleUpdateWeightOption(idx, 'stock', Number(e.target.value))}
                          placeholder="50"
                          className="w-full px-2.5 py-1.5 bg-[#FAFAFA] border border-gray-200 rounded-lg text-xs"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveWeightOption(idx)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg mt-3"
                        title="Delete this weight option"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">Short Description (Subheading summary)</label>
                <input
                  type="text"
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="e.g. Fresh organic Gilgit walnuts rich in Omega-3"
                  className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">Full Detailed Product Description</label>
                <textarea
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide complete product details, taste profile, origin history, quality assurance..."
                  className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-xs leading-relaxed"
                />
              </div>

              {/* Toggles & Badges */}
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <span className="font-bold text-[#111827] block text-xs">Product Badges & Deal Flags:</span>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-gray-800">
                    <input
                      type="checkbox"
                      checked={formData.isOrganic ?? true}
                      onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                      className="w-4 h-4 accent-[#16A34A] rounded"
                    />
                    <span>100% Organic Badge</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-gray-800">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller ?? false}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="w-4 h-4 accent-[#16A34A] rounded"
                    />
                    <span>Best Seller Badge</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-gray-800">
                    <input
                      type="checkbox"
                      checked={formData.isFlashDeal ?? false}
                      onChange={(e) => setFormData({ ...formData, isFlashDeal: e.target.checked })}
                      className="w-4 h-4 accent-[#16A34A] rounded"
                    />
                    <span>Flash Sale Item</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-gray-800">
                    <input
                      type="checkbox"
                      checked={formData.inStock ?? true}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="w-4 h-4 accent-[#16A34A] rounded"
                    />
                    <span>In Stock</span>
                  </label>
                </div>

                {formData.isFlashDeal && (
                  <div className="pt-2 flex items-center gap-2">
                    <label className="font-bold text-xs text-red-700">Flash Sale Discount %:</label>
                    <input
                      type="number"
                      value={formData.flashDiscountPct || 15}
                      onChange={(e) => setFormData({ ...formData, flashDiscountPct: Number(e.target.value) })}
                      className="w-24 px-3 py-1 bg-white border border-red-300 rounded-lg font-bold text-xs text-red-700"
                    />
                  </div>
                )}
              </div>

              {/* Save & Cancel */}
              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#FAFAFA] text-[#6B7280] font-bold text-xs rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProduct ? 'Save All Changes' : 'Publish Product to Store'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK RENAME MODAL */}
      {quickRenameProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E5E7EB] shadow-2xl space-y-5 relative">
            <button
              onClick={() => setQuickRenameProduct(null)}
              className="absolute top-4 right-4 p-2 text-[#6B7280] hover:text-[#111827] bg-[#FAFAFA] rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase bg-[#F0FDF4] text-[#16A34A] px-2.5 py-1 rounded-full">
                RENAME PRODUCT
              </span>
              <h3 className="text-lg font-bold font-serif text-[#111827] mt-1">
                Edit Product Title
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#111827] mb-1">Product Title (English) *</label>
                <input
                  type="text"
                  required
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">Product Title (Urdu)</label>
                <input
                  type="text"
                  value={quickNameUrdu}
                  onChange={(e) => setQuickNameUrdu(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-xs font-serif"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setQuickRenameProduct(null)}
                className="px-4 py-2 bg-[#FAFAFA] text-[#6B7280] font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuickRename}
                className="px-5 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Title</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK IMAGE CHANGE MODAL */}
      {quickImageProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E5E7EB] shadow-2xl space-y-5 relative">
            <button
              onClick={() => setQuickImageProduct(null)}
              className="absolute top-4 right-4 p-2 text-[#6B7280] hover:text-[#111827] bg-[#FAFAFA] rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase bg-[#F0FDF4] text-[#16A34A] px-2.5 py-1 rounded-full">
                UPDATE PHOTO
              </span>
              <h3 className="text-lg font-bold font-serif text-[#111827] mt-1">
                Change Image for {quickImageProduct.name}
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="w-full h-40 bg-[#FAFAFA] rounded-2xl overflow-hidden border border-[#E5E7EB] flex items-center justify-center">
                <img src={quickImageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>

              <div>
                <label className="block font-bold text-[#111827] mb-1">Image URL or Local Upload</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={quickImageUrl}
                    onChange={(e) => setQuickImageUrl(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-xs"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileUpload(e, 'quick')}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-[#FAFAFA] hover:bg-gray-100 border border-[#E5E7EB] font-bold rounded-xl flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setQuickImageProduct(null)}
                className="px-4 py-2 bg-[#FAFAFA] text-[#6B7280] font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuickImage}
                className="px-5 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Image</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT SLIP MODAL */}
      {selectedOrderForSlip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#E5E7EB] shadow-2xl space-y-4 relative">
            <button
              onClick={() => setSelectedOrderForSlip(null)}
              className="absolute top-4 right-4 p-2 text-[#6B7280] hover:text-[#111827] bg-[#FAFAFA] rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center border-b border-gray-200 pb-4">
              <h3 className="font-serif font-black text-lg text-emerald-900">MASTER GROCERY SHOP</h3>
              <p className="text-[11px] text-gray-500">Regal Chowk, Sheikhupura, Punjab • Phone: +92 327 9408969</p>
              <p className="text-xs font-mono font-bold mt-1 text-gray-800">Dispatch Slip #{selectedOrderForSlip.trackingNumber}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-[#FAFAFA] p-3 rounded-xl border border-gray-200 space-y-1">
                <p><strong>Customer:</strong> {selectedOrderForSlip.customerName}</p>
                <p><strong>Phone:</strong> {selectedOrderForSlip.phone}</p>
                <p><strong>Address:</strong> {selectedOrderForSlip.address}, {selectedOrderForSlip.city}</p>
                <p><strong>Payment:</strong> {selectedOrderForSlip.paymentMethod.toUpperCase()} ({selectedOrderForSlip.paymentStatus})</p>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                {selectedOrderForSlip.items.map((item, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between font-medium">
                    <span>{item.quantity}x {item.productName} ({item.weight})</span>
                    <span className="font-bold">₨ {item.totalPricePKR.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between font-black text-sm pt-2">
                <span>Grand Total:</span>
                <span className="text-[#16A34A]">₨ {selectedOrderForSlip.totalPKR.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedOrderForSlip(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 bg-[#16A34A] text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD COUPON MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E5E7EB] shadow-2xl space-y-4 relative">
            <button
              onClick={() => setIsCouponModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#6B7280] hover:text-[#111827] bg-[#FAFAFA] rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-bold font-serif text-[#111827]">Create New Discount Coupon</h3>
            </div>

            <form onSubmit={handleAddCouponSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SHEIKHUPURA15"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl font-mono uppercase font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Discount Percentage (%)</label>
                <input
                  type="number"
                  value={newCoupon.value}
                  onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Minimum Order Amount (PKR)</label>
                <input
                  type="number"
                  value={newCoupon.minOrderPKR}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minOrderPKR: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <input
                  type="text"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#16A34A] text-white font-bold rounded-xl"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E5E7EB] shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-serif text-[#111827]">Delete Product?</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to delete this product from the catalog? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-red-600 text-white font-bold text-xs rounded-xl"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
