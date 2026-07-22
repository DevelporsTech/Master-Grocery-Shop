import React, { useState } from 'react';
import {
  Copy,
  Globe,
  Database,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SeoAndDevDocsView: React.FC = () => {
  const { showToast } = useStore();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    showToast(`${label} snippet copied to clipboard!`, 'info');
    setTimeout(() => setCopiedSection(null), 3000);
  };

  const prismaSchemaCode = `// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Product {
  id              String         @id @default(uuid())
  name            String
  nameUrdu        String?
  slug            String         @unique
  category        String
  subcategory     String
  origin          String
  basePricePKR    Float
  rating          Float          @default(5.0)
  inStock         Boolean        @default(true)
  sku             String         @unique
  isOrganic       Boolean        @default(true)
  isFlashDeal     Boolean        @default(false)
  mainImage       String
  galleryImages   String[]
  weightOptions   WeightOption[]
  reviews         Review[]
  createdAt       DateTime       @default(now())
}

model WeightOption {
  id                 String   @id @default(uuid())
  productId          String
  product            Product  @relation(fields: [productId], references: [id])
  weight             String
  pricePKR           Float
  originalPricePKR   Float?
  savingsPct         Int?
}

model Order {
  id              String      @id @default(uuid())
  trackingNumber  String      @unique
  customerName    String
  email           String?
  phone           String
  province        String
  city            String
  address         String
  paymentMethod   String
  subtotalPKR     Float
  shippingFeePKR  Float
  discountPKR     Float
  totalPKR        Float
  status          String      @default("Order Placed")
  createdAt       DateTime    @default(now())
  items           OrderItem[]
}

model OrderItem {
  id           String  @id @default(uuid())
  orderId      String
  order        Order   @relation(fields: [orderId], references: [id])
  productName  String
  weight       String
  quantity     Int
  unitPricePKR Float
  totalPricePKR Float
}

model Review {
  id            String   @id @default(uuid())
  productId     String
  product       Product  @relation(fields: [productId], references: [id])
  userName      String
  city          String
  rating        Int
  comment       String
  verifiedBuyer Boolean  @default(true)
  createdAt     DateTime @default(now())
}`;

  const organizationSchema = `{
  "@context": "https://schema.org",
  "@type": "GroceryStore",
  "name": "MASTER GROCERY SHOP",
  "alternateName": "Master Grocery & Dry Fruit Shop Pakistan",
  "url": "https://mastergrocery.pk",
  "logo": "https://images.unsplash.com/photo-1596560548464-f010549b84d7",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+92-327-9408969",
    "contactType": "customer service",
    "areaServed": "PK",
    "availableLanguage": ["English", "Urdu"]
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Regal Chowk",
    "addressLocality": "Sheikhupura",
    "addressRegion": "Punjab",
    "postalCode": "39350",
    "addressCountry": "PK"
  },
  "priceRange": "PKR"
}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 text-white p-8 rounded-3xl shadow-xl space-y-3">
        <span className="bg-amber-500 text-emerald-950 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">
          Developer & SEO Command Center
        </span>
        <h1 className="text-2xl md:text-3xl font-black font-serif text-white">
          Developer & SEO Architecture Docs
        </h1>
        <p className="text-xs text-emerald-200 leading-relaxed max-w-2xl">
          Technical documentation for MASTER GROCERY SHOP database schema (Prisma ORM) and Schema.org structured data.
        </p>
      </div>

      {/* Database & Prisma Schema */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h2 className="text-base font-bold font-serif text-gray-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            1. PostgreSQL Database Schema (Prisma ORM)
          </h2>
          <button
            onClick={() => copyToClipboard(prismaSchemaCode, 'Prisma Schema')}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" /> Copy Prisma Code
          </button>
        </div>

        <pre className="bg-gray-900 text-emerald-300 p-4 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-80">
          {prismaSchemaCode}
        </pre>
      </div>

      {/* Schema.org Structured Data */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h2 className="text-base font-bold font-serif text-gray-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            2. Organization & E-commerce Schema.org JSON-LD
          </h2>
          <button
            onClick={() => copyToClipboard(organizationSchema, 'Organization Schema')}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" /> Copy JSON-LD
          </button>
        </div>

        <pre className="bg-gray-900 text-amber-300 p-4 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-60">
          {organizationSchema}
        </pre>
      </div>
    </div>
  );
};
