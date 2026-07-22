import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { QuickViewModal } from './components/QuickViewModal';
import { CompareModal } from './components/CompareModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';

import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { CustomerDashboardView } from './views/CustomerDashboardView';
import { WishlistView } from './views/WishlistView';
import { BlogView } from './views/BlogView';
import { BlogDetailView } from './views/BlogDetailView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { PolicyViews } from './views/PolicyViews';
import { SeoAndDevDocsView } from './views/SeoAndDevDocsView';
import { AdminProductsView } from './views/AdminProductsView';
import { AiAgentView } from './views/AiAgentView';
import { FloatingAiWidget } from './components/FloatingAiWidget';
import { MobileBottomNav } from './components/MobileBottomNav';

const MainAppContent: React.FC = () => {
  const { currentView } = useStore();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ShopView />;
      case 'product-detail':
        return <ProductDetailView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'order-tracking':
        return <OrderTrackingView />;
      case 'customer-dashboard':
        return <CustomerDashboardView />;
      case 'wishlist':
        return <WishlistView />;
      case 'blog':
        return <BlogView />;
      case 'blog-detail':
        return <BlogDetailView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'privacy-policy':
        return <PolicyViews policyType="privacy" />;
      case 'terms-conditions':
        return <PolicyViews policyType="terms" />;
      case 'shipping-policy':
        return <PolicyViews policyType="shipping" />;
      case 'refund-policy':
        return <PolicyViews policyType="refund" />;
      case 'faq':
        return <PolicyViews policyType="faq" />;
      case 'seo-dev-docs':
        return <SeoAndDevDocsView />;
      case 'admin-products':
        return <AdminProductsView />;
      case 'ai-agent':
        return <AiAgentView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans text-[#111827] antialiased selection:bg-[#F59E0B]/30 selection:text-[#111827]">
      <Header />
      <main className="flex-1 pb-20 lg:pb-0">{renderView()}</main>
      <Footer />

      {/* Mobile Sticky Navigation Bar */}
      <MobileBottomNav />

      {/* Global Slide-overs, Floating AI Widget & Modals */}
      <FloatingAiWidget />
      <CartDrawer />
      <QuickViewModal />
      <CompareModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
