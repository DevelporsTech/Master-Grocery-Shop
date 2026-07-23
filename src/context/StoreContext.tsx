import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, WeightOption, CartItem, Order, Coupon, User } from '../types';
import { PRODUCTS, SAMPLE_ORDERS } from '../data/mockData';
import { api } from '../services/api';

export type ViewName =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-tracking'
  | 'customer-dashboard'
  | 'wishlist'
  | 'blog'
  | 'blog-detail'
  | 'about'
  | 'contact'
  | 'faq'
  | 'privacy-policy'
  | 'terms-conditions'
  | 'shipping-policy'
  | 'refund-policy'
  | 'seo-dev-docs'
  | 'admin-products'
  | 'ai-agent';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface StoreContextType {
  currentView: ViewName;
  navigateTo: (view: ViewName, params?: { productId?: string; categorySlug?: string; blogSlug?: string }) => void;
  selectedProductId: string | null;
  selectedCategorySlug: string | null;
  selectedBlogSlug: string | null;

  // Products CRUD Catalog
  products: Product[];
  addProduct: (newProductData: Partial<Product>) => void;
  updateProduct: (productId: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  resetProductsToDefault: () => void;

  // Admin Access Gate
  isAdminUnlocked: boolean;
  setIsAdminUnlocked: (unlocked: boolean) => void;
  adminPasscode: string;
  unlockAdmin: (passcode: string) => { success: boolean; message: string };
  lockAdmin: () => void;
  updateAdminPasscode: (newPasscode: string) => void;
  
  // Search & Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (c: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, weightOption: WeightOption, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartSubtotalPKR: number;
  cartCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Coupon
  appliedCoupon: Coupon | null;
  couponDiscountPKR: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Wishlist
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Comparison
  compareProducts: Product[];
  toggleCompare: (product: Product) => void;
  isComparing: (productId: string) => boolean;
  clearCompare: () => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;

  // Quick View
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Recent Orders
  recentOrders: Order[];
  addOrderToHistory: (order: Order) => void;
  updateOrderStatus: (orderId: string, newStatus: string) => void;

  // User Authentication
  currentUser: User | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'signup';
  setAuthModalTab: (tab: 'login' | 'signup') => void;
  login: (email: string, password: string) => { success: boolean; message: string };
  signup: (name: string, email: string, password: string, phone?: string, city?: string) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;

  // Toast Alerts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewName>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);

  // Products State initialized with LocalStorage or default PRODUCTS
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('mgs_custom_products_v1');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mgs_admin_unlocked');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [adminPasscode, setAdminPasscode] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('mgs_admin_passcode');
      return saved || '1984';
    } catch {
      return '1984';
    }
  });

  useEffect(() => {
    localStorage.setItem('mgs_admin_unlocked', isAdminUnlocked ? 'true' : 'false');
  }, [isAdminUnlocked]);

  useEffect(() => {
    localStorage.setItem('mgs_admin_passcode', adminPasscode);
  }, [adminPasscode]);

  const unlockAdmin = (inputPasscode: string) => {
    const cleanInput = inputPasscode.trim();
    if (cleanInput && cleanInput === adminPasscode) {
      setIsAdminUnlocked(true);
      showToast('Owner Portal Unlocked Successfully!', 'success');
      return { success: true, message: 'Portal Unlocked' };
    } else {
      showToast('Incorrect Passcode! Access Denied.', 'warning');
      return { success: false, message: 'Incorrect passcode.' };
    }
  };

  const lockAdmin = () => {
    setIsAdminUnlocked(false);
    showToast('Admin Portal Locked.', 'info');
  };

  const updateAdminPasscode = (newPasscode: string) => {
    const clean = newPasscode.trim();
    if (!clean) {
      showToast('Passcode cannot be empty.', 'warning');
      return;
    }
    setAdminPasscode(clean);
    showToast(`Passcode updated! Your new passcode is: ${clean}`, 'success');
  };

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mgs_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mgs_wishlist');
      return saved ? JSON.parse(saved) : ['mgs-df-001', 'mgs-gr-001'];
    } catch {
      return ['mgs-df-001', 'mgs-gr-001'];
    }
  });

  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscountPKR, setCouponDiscountPKR] = useState<number>(0);

  const [recentOrders, setRecentOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('mgs_user_orders');
      return saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : SAMPLE_ORDERS;
    } catch {
      return SAMPLE_ORDERS;
    }
  });

  // User Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('mgs_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mgs_current_user');
      return !saved;
    } catch {
      return true;
    }
  });
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist current user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mgs_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mgs_current_user');
    }
  }, [currentUser]);

  // Seed default users if not present
  const getUsersList = (): any[] => {
    try {
      const saved = localStorage.getItem('mgs_registered_users');
      if (saved) return JSON.parse(saved);
    } catch {}
    const defaultUsers = [
      {
        id: 'usr-admin-01',
        name: 'Master Grocery Admin',
        email: 'admin@mastergrocery.pk',
        password: 'admin123',
        phone: '0300-0000000',
        city: 'Lahore',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr-cust-01',
        name: 'Chaudhry Umar Farooq',
        email: 'customer@gmail.com',
        password: 'customer123',
        phone: '0300-1234567',
        city: 'Lahore',
        address: 'House #45, Block C, Gulberg III',
        role: 'customer',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem('mgs_registered_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  };

  const login = (emailInput: string, passwordInput: string) => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const users = getUsersList();
    const found = users.find(
      (u: any) => u.email.toLowerCase() === cleanEmail && u.password === passwordInput
    );

    if (found) {
      const userObj: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        phone: found.phone || '',
        city: found.city || 'Lahore',
        address: found.address || '',
        role: found.role || 'customer',
        createdAt: found.createdAt || new Date().toISOString(),
      };
      setCurrentUser(userObj);
      if (userObj.role === 'admin' || userObj.email === 'admin@mastergrocery.pk') {
        setIsAdminUnlocked(true);
      }
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${userObj.name}!`, 'success');
      return { success: true, message: 'Logged in successfully!' };
    } else {
      showToast('Invalid email or password. Please try again.', 'warning');
      return { success: false, message: 'Invalid email or password.' };
    }
  };

  const signup = (name: string, email: string, password: string, phone?: string, city?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const users = getUsersList();
    if (users.some((u: any) => u.email.toLowerCase() === cleanEmail)) {
      showToast('An account with this email address already exists.', 'warning');
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUserRecord = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: password,
      phone: phone || '',
      city: city || 'Lahore',
      address: '',
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    users.push(newUserRecord);
    localStorage.setItem('mgs_registered_users', JSON.stringify(users));

    const userObj: User = {
      id: newUserRecord.id,
      name: newUserRecord.name,
      email: newUserRecord.email,
      phone: newUserRecord.phone,
      city: newUserRecord.city,
      role: 'customer',
      createdAt: newUserRecord.createdAt,
    };

    setCurrentUser(userObj);
    setIsAuthModalOpen(false);
    showToast(`Account created successfully! Welcome, ${userObj.name}.`, 'success');
    return { success: true, message: 'Account created successfully!' };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthModalOpen(true);
    showToast('Signed out of your account.', 'info');
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    showToast('Account details updated!', 'success');
  };

  // Persist custom products
  useEffect(() => {
    localStorage.setItem('mgs_custom_products_v1', JSON.stringify(products));
  }, [products]);

  // Persist recent orders
  useEffect(() => {
    localStorage.setItem('mgs_user_orders', JSON.stringify(recentOrders));
  }, [recentOrders]);

  // Persist admin lock status
  useEffect(() => {
    localStorage.setItem('mgs_admin_unlocked', String(isAdminUnlocked));
  }, [isAdminUnlocked]);

  // Persist cart
  useEffect(() => {
    localStorage.setItem('mgs_cart', JSON.stringify(cart));
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem('mgs_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const navigateTo = (
    view: ViewName,
    params?: { productId?: string; categorySlug?: string; blogSlug?: string }
  ) => {
    setCurrentView(view);
    if (params?.productId) setSelectedProductId(params.productId);
    if (params?.categorySlug) setSelectedCategorySlug(params.categorySlug);
    if (params?.blogSlug) setSelectedBlogSlug(params.blogSlug);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product, weightOption: WeightOption, quantity: number = 1) => {
    const cartItemId = `${product.id}-${weightOption.weight}`;
    
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          itemTotalPKR: newQty * weightOption.pricePKR,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          product,
          selectedWeightOption: weightOption,
          quantity,
          unitPricePKR: weightOption.pricePKR,
          itemTotalPKR: quantity * weightOption.pricePKR,
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added ${quantity}x ${product.name} (${weightOption.weight}) to cart!`);
    setIsCartDrawerOpen(true);
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId
          ? {
              ...item,
              quantity,
              itemTotalPKR: quantity * item.unitPricePKR,
            }
          : item
      )
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscountPKR(0);
  };

  const cartSubtotalPKR = cart.reduce((acc, item) => acc + item.itemTotalPKR, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const applyCoupon = async (code: string) => {
    const res = await api.validateCoupon(code, cartSubtotalPKR);
    if (res.valid && res.coupon) {
      setAppliedCoupon(res.coupon);
      setCouponDiscountPKR(res.discountPKR);
      showToast(res.message, 'success');
      return { success: true, message: res.message };
    } else {
      showToast(res.message, 'warning');
      return { success: false, message: res.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscountPKR(0);
    showToast('Coupon removed', 'info');
  };

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(exists ? 'Removed from Wishlist' : 'Saved to Wishlist! ❤️', exists ? 'info' : 'success');
      return updated;
    });
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const toggleCompare = (product: Product) => {
    setCompareProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed ${product.name} from comparison`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        if (prev.length >= 4) {
          showToast('You can compare maximum 4 products at a time', 'warning');
          return prev;
        }
        showToast(`Added ${product.name} to comparison!`, 'success');
        setIsCompareModalOpen(true);
        return [...prev, product];
      }
    });
  };

  const isComparing = (productId: string) => compareProducts.some((p) => p.id === productId);

  const clearCompare = () => setCompareProducts([]);

  const addOrderToHistory = (order: Order) => {
    setRecentOrders((prev) => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setRecentOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus as any, updatedAt: new Date().toISOString() } : o
      )
    );
    showToast(`Order status updated to "${newStatus}"`, 'success');
  };

  // Product Catalog CRUD Handlers
  const addProduct = (newProductData: Partial<Product>) => {
    const newId = `mgs-custom-${Date.now()}`;
    const slug = (newProductData.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const defaultWeightOptions: WeightOption[] = newProductData.weightOptions && newProductData.weightOptions.length > 0
      ? newProductData.weightOptions
      : [
          { weight: '500g', pricePKR: newProductData.basePricePKR || 1000, stock: 50 },
          { weight: '1kg', pricePKR: (newProductData.basePricePKR || 1000) * 1.9, stock: 50 },
        ];

    const newProduct: Product = {
      id: newId,
      sku: `SKU-MGS-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newProductData.name || 'New Grocery Item',
      nameUrdu: newProductData.nameUrdu || '',
      slug: slug || newId,
      category: newProductData.category || 'dry-fruits',
      subcategory: newProductData.subcategory || 'General Essentials',
      shortDescription: newProductData.shortDescription || 'Fresh premium quality grocery item.',
      description: newProductData.description || 'Sourced directly from certified suppliers in Pakistan for highest purity and freshness.',
      origin: newProductData.origin || 'Pakistan',
      isOrganic: newProductData.isOrganic ?? true,
      isBestSeller: newProductData.isBestSeller ?? false,
      isFlashDeal: newProductData.isFlashDeal ?? false,
      flashDiscountPct: newProductData.flashDiscountPct || 10,
      rating: newProductData.rating || 5.0,
      reviewsCount: newProductData.reviewsCount || 1,
      basePricePKR: newProductData.basePricePKR || 1000,
      originalPricePKR: newProductData.originalPricePKR || (newProductData.basePricePKR || 1000) * 1.2,
      defaultWeight: newProductData.defaultWeight || '500g',
      weightOptions: defaultWeightOptions,
      tags: newProductData.tags || ['Fresh', 'Organic', 'Pakistan Store'],
      nutritionInfo: newProductData.nutritionInfo || { calories: 350, protein: '15g', fats: '10g', carbs: '45g' },
      usageTips: newProductData.usageTips || ['Store in an airtight container in a cool place.'],
      healthBenefits: newProductData.healthBenefits || ['Rich in natural nutrients and vital energy.'],
      mainImage: newProductData.mainImage || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      galleryImages: newProductData.galleryImages || [newProductData.mainImage || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'],
      inStock: newProductData.inStock ?? true,
    };

    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Successfully added item: ${newProduct.name}! 🎉`, 'success');
  };

  const updateProduct = (productId: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            ...updatedFields,
            basePricePKR: updatedFields.basePricePKR ?? p.basePricePKR,
            weightOptions: updatedFields.weightOptions ?? p.weightOptions,
          };
        }
        return p;
      })
    );
    showToast('Product details updated successfully!', 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from catalog', 'info');
  };

  const resetProductsToDefault = () => {
    setProducts(PRODUCTS);
    localStorage.removeItem('mgs_custom_products_v1');
    showToast('Catalog reset to initial default items!', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        navigateTo,
        selectedProductId,
        selectedCategorySlug,
        selectedBlogSlug,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,
        isAdminUnlocked,
        setIsAdminUnlocked,
        adminPasscode,
        unlockAdmin,
        lockAdmin,
        updateAdminPasscode,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotalPKR,
        cartCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        appliedCoupon,
        couponDiscountPKR,
        applyCoupon,
        removeCoupon,
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        compareProducts,
        toggleCompare,
        isComparing,
        clearCompare,
        isCompareModalOpen,
        setIsCompareModalOpen,
        quickViewProduct,
        setQuickViewProduct,
        recentOrders,
        addOrderToHistory,
        updateOrderStatus,
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        login,
        signup,
        logout,
        updateProfile,
        toasts,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
