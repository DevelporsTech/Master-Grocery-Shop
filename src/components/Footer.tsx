import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  Send,
  Truck,
  Heart,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, setSelectedCategoryFilter, showToast } = useStore();
  const [emailInput, setEmailInput] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    showToast('Subscribed! Use promo code NEWSLETTER100 for ₨ 100 off your first order!', 'success');
    setEmailInput('');
  };

  return (
    <footer className="bg-white text-[#111827] pt-12 pb-8 border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Feature Bar matching Design HTML */}
        <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap gap-8 items-center">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-xs font-bold text-[#111827]">National Express Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-xs font-bold text-[#111827]">Easypaisa / JazzCash / COD</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-xs font-bold text-[#111827]">Hygienic Sealed Packaging</span>
            </div>
          </div>

          <a
            href="https://wa.me/923279408969"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#111827] hover:bg-black text-white px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <PhoneCall className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-xs font-bold">WHATSAPP SUPPORT</span>
          </a>
        </div>

        {/* Newsletter Banner */}
        <div className="bg-[#FAFAFA] p-8 rounded-3xl border border-[#E5E7EB] mb-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-2">
            <span className="bg-[#F59E0B] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
              Special Pakistan Offer
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold text-[#111827]">
              Subscribe & Get ₨ 100 Discount Voucher
            </h3>
            <p className="text-xs text-[#6B7280]">
              Receive weekly health tips on dry fruits, seasonal grocery discounts, and new harvest arrivals in Lahore, Karachi, and Islamabad.
            </p>
          </div>

          <div className="lg:col-span-5">
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email address..."
                required
                className="flex-1 px-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#16A34A]"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#E5E7EB]">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigateTo('home')}>
              <img
                src="/logo.jpg"
                alt="Master Grocery Store Logo"
                className="w-11 h-11 object-cover rounded-xl border border-emerald-200 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <span className="text-xl font-extrabold tracking-tight text-[#111827]">
                MASTER <span className="text-[#16A34A]">GROCERY</span>
              </span>
            </div>

            <p className="text-xs text-[#6B7280] leading-relaxed max-w-sm">
              Pakistan’s premier online destination for 100% pure organic dry fruits, aged Basmati rice, cold-pressed oils, pure Bilona Desi Ghee, and household groceries. Delivering fresh harvest quality straight from mountain orchards to your kitchen.
            </p>

            <div className="space-y-2 text-xs text-[#111827] pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span>Regal Chowk, Sheikhupura, Punjab, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span>Helpline / WhatsApp: +92 327 9408969</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span>mastergrocerystore302@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-4">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-[#6B7280]">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('dry-fruits');
                    navigateTo('shop');
                  }}
                  className="hover:text-[#16A34A] transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-[#F59E0B]" /> Irani Mamra Almonds
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('dry-fruits');
                    navigateTo('shop');
                  }}
                  className="hover:text-[#16A34A] transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-[#F59E0B]" /> Gilgit Kagzi Walnuts
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('dry-fruits');
                    navigateTo('shop');
                  }}
                  className="hover:text-[#16A34A] transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-[#F59E0B]" /> Quetta Jumbo Pistachios
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('rice-flour');
                    navigateTo('shop');
                  }}
                  className="hover:text-[#16A34A] transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-[#F59E0B]" /> Super Kernel Basmati Rice
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('oils-ghee');
                    navigateTo('shop');
                  }}
                  className="hover:text-[#16A34A] transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-[#F59E0B]" /> Organic Bilona Desi Ghee
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Support */}
          <div>
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs text-[#6B7280]">
              <li>
                <button onClick={() => navigateTo('order-tracking')} className="hover:text-[#16A34A] transition-colors">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('customer-dashboard')} className="hover:text-[#16A34A] transition-colors">
                  My Account & Wallet
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('faq')} className="hover:text-[#16A34A] transition-colors">
                  FAQs & Help Center
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shipping-policy')} className="hover:text-[#16A34A] transition-colors">
                  Shipping Policy across Pakistan
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('refund-policy')} className="hover:text-[#16A34A] transition-colors">
                  7-Day Quality Guarantee & Returns
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Corporate & Policy */}
          <div>
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-[#6B7280]">
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-[#16A34A] transition-colors">
                  Our Story & Farm Sourcing
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-[#16A34A] transition-colors">
                  Wholesale & Bulk Inquiries
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('privacy-policy')} className="hover:text-[#16A34A] transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('terms-conditions')} className="hover:text-[#16A34A] transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('admin-products')} className="text-[#16A34A] font-bold hover:underline flex items-center gap-1">
                  <span>⚙️ Admin Product Portal</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('seo-dev-docs')} className="text-[#16A34A] font-bold hover:underline">
                  Developer & SEO Architecture
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Pakistan Delivery Cities Bar */}
        <div className="py-6 border-b border-[#E5E7EB]">
          <h5 className="text-[11px] font-bold uppercase text-[#111827] tracking-wider mb-2 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#F59E0B]" />
            Express Grocery & Dry Fruit Delivery Cities in Pakistan:
          </h5>
          <p className="text-[11px] text-[#6B7280] leading-relaxed">
            Lahore • Karachi • Islamabad • Rawalpindi • Faisalabad • Multan • Peshawar • Quetta • Sialkot • Gujranwala • Hyderabad • Abbottabad • Gilgit • Muzaffarabad • Bahawalpur • Sargodha • Sukkur • Mardan • Larkana • Sheikhupura • Okara • Jhelum
          </p>
        </div>

        {/* Payment Gateways & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#6B7280]">
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="font-semibold text-[#111827]">Accepted Payments:</span>
            <span className="bg-[#FAFAFA] text-[#111827] px-2.5 py-1 rounded-md border border-[#E5E7EB] font-bold">
              💵 Cash on Delivery
            </span>
            <span className="bg-[#FAFAFA] text-[#111827] px-2.5 py-1 rounded-md border border-[#E5E7EB] font-bold">
              📱 Easypaisa
            </span>
            <span className="bg-[#FAFAFA] text-[#111827] px-2.5 py-1 rounded-md border border-[#E5E7EB] font-bold">
              📱 JazzCash
            </span>
            <span className="bg-[#FAFAFA] text-[#111827] px-2.5 py-1 rounded-md border border-[#E5E7EB] font-bold">
              🏦 Bank Transfer (Meezan/HBL)
            </span>
          </div>

          <p>© 2026 MASTER GROCERY SHOP Pakistan. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
