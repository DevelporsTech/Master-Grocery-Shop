import { Product, Category, Order, Review, Coupon } from '../types';
import { PRODUCTS, CATEGORIES, COUPONS, REVIEWS, SAMPLE_ORDERS } from '../data/mockData';

// API Client interacting with server or fallback data
export const api = {
  // Fetch products with search, filter, and pagination
  async getProducts(params?: {
    category?: string;
    subcategory?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    isFlashDeal?: boolean;
    isBestSeller?: boolean;
    isOrganic?: boolean;
    sort?: 'price-low' | 'price-high' | 'rating' | 'newest';
  }): Promise<Product[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.set('category', params.category);
      if (params?.search) queryParams.set('search', params.search);
      if (params?.sort) queryParams.set('sort', params.sort);
      
      const res = await fetch(`/api/products?${queryParams.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback local filtering
    }

    let list = [...PRODUCTS];

    if (params?.category && params.category !== 'all') {
      list = list.filter((p) => p.category === params.category || p.slug === params.category);
    }
    if (params?.subcategory) {
      list = list.filter((p) => p.subcategory.toLowerCase() === params.subcategory?.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.origin.toLowerCase().includes(q)
      );
    }
    if (params?.minPrice !== undefined) {
      list = list.filter((p) => p.basePricePKR >= params.minPrice!);
    }
    if (params?.maxPrice !== undefined) {
      list = list.filter((p) => p.basePricePKR <= params.maxPrice!);
    }
    if (params?.isFlashDeal) {
      list = list.filter((p) => p.isFlashDeal);
    }
    if (params?.isBestSeller) {
      list = list.filter((p) => p.isBestSeller);
    }
    if (params?.isOrganic) {
      list = list.filter((p) => p.isOrganic);
    }

    if (params?.sort === 'price-low') {
      list.sort((a, b) => a.basePricePKR - b.basePricePKR);
    } else if (params?.sort === 'price-high') {
      list.sort((a, b) => b.basePricePKR - a.basePricePKR);
    } else if (params?.sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  },

  async getProductById(idOrSlug: string): Promise<Product | null> {
    try {
      const res = await fetch(`/api/products/${idOrSlug}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const found = PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    return found || null;
  },

  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return CATEGORIES;
  },

  async validateCoupon(code: string, subtotalPKR: number): Promise<{ valid: boolean; discountPKR: number; coupon?: Coupon; message: string }> {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotalPKR }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = COUPONS.find((c) => c.code === cleanCode);

    if (!coupon) {
      return { valid: false, discountPKR: 0, message: 'Invalid coupon code.' };
    }

    if (subtotalPKR < coupon.minOrderPKR) {
      return {
        valid: false,
        discountPKR: 0,
        message: `Minimum order amount for code ${coupon.code} is ₨ ${coupon.minOrderPKR.toLocaleString()}.`,
      };
    }

    let discountPKR = 0;
    if (coupon.discountType === 'percentage') {
      discountPKR = Math.round((subtotalPKR * coupon.value) / 100);
    } else {
      discountPKR = coupon.value;
    }

    return {
      valid: true,
      discountPKR,
      coupon,
      message: `Coupon ${coupon.code} applied successfully! Discount: ₨ ${discountPKR.toLocaleString()}`,
    };
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback local creation
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    let fallbackStatus: 'Pending' | 'Paid' | 'Verification Required' = 'Pending';
    if (orderData.paymentMethod === 'card') {
      fallbackStatus = 'Paid';
    } else if (orderData.paymentMethod === 'cod') {
      fallbackStatus = 'Pending';
    } else {
      fallbackStatus = orderData.transactionId ? 'Paid' : 'Verification Required';
    }

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      trackingNumber: `MGS-PK-${randomSuffix}`,
      customerName: orderData.customerName || 'Pakistani Customer',
      email: orderData.email || '',
      phone: orderData.phone || '',
      province: orderData.province || 'Punjab',
      city: orderData.city || 'Lahore',
      address: orderData.address || '',
      deliveryNotes: orderData.deliveryNotes,
      paymentMethod: orderData.paymentMethod || 'cod',
      paymentStatus: orderData.paymentStatus || fallbackStatus,
      transactionId: orderData.transactionId,
      paymentNote: orderData.paymentNote,
      items: orderData.items || [],
      subtotalPKR: orderData.subtotalPKR || 0,
      shippingFeePKR: orderData.shippingFeePKR || 0,
      discountPKR: orderData.discountPKR || 0,
      couponCode: orderData.couponCode,
      totalPKR: orderData.totalPKR || 0,
      status: 'Order Placed',
      courierName: 'Leopard Courier Express',
      estimatedDeliveryDays: '1-3 Days Across Pakistan',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in local storage for order history persistence
    const existingStr = localStorage.getItem('mgs_user_orders');
    const existing: Order[] = existingStr ? JSON.parse(existingStr) : [];
    localStorage.setItem('mgs_user_orders', JSON.stringify([newOrder, ...existing]));

    return newOrder;
  },

  async trackOrder(trackingOrPhone: string): Promise<Order | null> {
    try {
      const res = await fetch(`/api/orders/track?query=${encodeURIComponent(trackingOrPhone)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const q = trackingOrPhone.trim().toLowerCase();
    
    // Check local storage orders
    const existingStr = localStorage.getItem('mgs_user_orders');
    const localOrders: Order[] = existingStr ? JSON.parse(existingStr) : [];
    const all = [...localOrders, ...SAMPLE_ORDERS];

    const match = all.find(
      (o) =>
        o.trackingNumber.toLowerCase() === q ||
        o.phone.toLowerCase().includes(q) ||
        o.id.toLowerCase() === q
    );

    return match || null;
  },

  async askAiHealthAssistant(prompt: string): Promise<string> {
    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.reply;
      }
    } catch {
      // Fallback rule response
    }

    return "Irani Mamra Badam and Gilgit Kagzi Walnuts are packed with natural Omega-3s and Vitamin E. Soaking 5 almonds overnight in clean water and peeling them before breakfast maximizes nutrient absorption and boosts memory power!";
  },
};
