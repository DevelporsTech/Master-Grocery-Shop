export type WeightUnit = '250g' | '500g' | '1kg' | '2kg' | '5kg Wholesale';

export interface NutritionInfo {
  calories: number; // per 100g
  protein: string; // e.g., '21g'
  fats: string; // e.g., '49g'
  carbs: string; // e.g., '22g'
  fiber?: string;
  vitamins?: string;
}

export interface WeightOption {
  weight: WeightUnit;
  pricePKR: number;
  originalPricePKR?: number;
  savingsPct?: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  nameUrdu?: string;
  slug: string;
  category: 'dry-fruits' | 'groceries' | 'pulses' | 'spices' | 'oils-ghee' | 'rice-flour' | 'tea-beverages';
  subcategory: string;
  shortDescription: string;
  description: string;
  origin: string; // e.g., 'Gilgit-Baltistan', 'Quetta, Balochistan', 'Swat', 'California, USA', 'Iran'
  isOrganic: boolean;
  isBestSeller: boolean;
  isFlashDeal: boolean;
  flashDiscountPct?: number;
  rating: number; // 1 to 5
  reviewsCount: number;
  basePricePKR: number; // Price for default weight (e.g. 500g or 1kg)
  originalPricePKR?: number;
  defaultWeight: WeightUnit;
  weightOptions: WeightOption[];
  tags: string[];
  nutritionInfo: NutritionInfo;
  usageTips: string[];
  healthBenefits?: string[];
  mainImage: string;
  galleryImages: string[];
  inStock: boolean;
  sku: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameUrdu?: string;
  description: string;
  itemCount: number;
  featuredImage: string;
  iconName: string;
}

export interface CartItem {
  id: string; // unique cart line item id
  product: Product;
  selectedWeightOption: WeightOption;
  quantity: number;
  unitPricePKR: number;
  itemTotalPKR: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  weight: WeightUnit;
  quantity: number;
  unitPricePKR: number;
  totalPricePKR: number;
}

export type PaymentMethod = 'cod' | 'easypaisa' | 'jazzcash' | 'bank_transfer' | 'card' | 'raast';

export interface Order {
  id: string;
  trackingNumber: string;
  customerName: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  deliveryNotes?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid' | 'Verification Required';
  transactionId?: string;
  paymentNote?: string;
  items: OrderItem[];
  subtotalPKR: number;
  shippingFeePKR: number;
  discountPKR: number;
  couponCode?: string;
  totalPKR: number;
  status: 'Order Placed' | 'Confirmed' | 'Packing Fresh' | 'Out for Courier' | 'Delivered' | 'Cancelled';
  courierName: string;
  estimatedDeliveryDays: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  city: string;
  rating: number;
  comment: string;
  verifiedBuyer: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleUrdu?: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  coverImage: string;
  tags: string[];
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // % or PKR amount
  minOrderPKR: number;
  description: string;
}

export interface PakistanCity {
  name: string;
  province: string;
  expressDeliveryAvailable: boolean; // Same day or 24-hr
  deliveryFeePKR: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  address?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}
