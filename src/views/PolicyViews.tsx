import React, { useState } from 'react';
import { ShieldCheck, Truck, RefreshCw, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ_ITEMS } from '../data/mockData';

export const PolicyViews: React.FC<{ policyType: 'privacy' | 'terms' | 'shipping' | 'refund' | 'faq' }> = ({
  policyType,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (policyType === 'faq') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Help & Answers</span>
          <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-gray-900">
            Frequently Asked Questions (FAQs)
          </h1>
          <p className="text-xs text-gray-500">Everything you need to know about dry fruit sourcing, delivery timelines, and payment options in Pakistan.</p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs md:text-sm text-gray-900 flex justify-between items-center gap-2 hover:bg-gray-50"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-emerald-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (policyType === 'shipping') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold font-serif text-gray-900">Pakistan Express Shipping Policy</h1>
        <div className="bg-white p-6 rounded-3xl border border-gray-200 text-xs space-y-4 text-gray-700 leading-relaxed">
          <p><strong>1. Delivery Coverage:</strong> Master Grocery Shop delivers to over 100+ cities and towns across Punjab, Sindh, KPK, Balochistan, Gilgit-Baltistan, and AJK.</p>
          <p><strong>2. Delivery Timelines:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Lahore: Same-day or Next-Day Express Delivery (24 hours).</li>
            <li>Karachi, Islamabad, Rawalpindi, Peshawar, Faisalabad, Multan: 24 - 48 hours.</li>
            <li>Other cities and remote areas: 2 - 4 business days.</li>
          </ul>
          <p><strong>3. Free Shipping Threshold:</strong> Orders with a total value of ₨ 2,500 or more qualify for FREE shipping nationwide.</p>
        </div>
      </div>
    );
  }

  if (policyType === 'refund') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold font-serif text-gray-900">7-Day Fresh Guarantee & Return Policy</h1>
        <div className="bg-white p-6 rounded-3xl border border-gray-200 text-xs space-y-4 text-gray-700 leading-relaxed">
          <p><strong>1. Our Quality Assurance:</strong> If you receive any dry fruit item that is stale, broken, damaged, or does not meet our lab quality standards, we offer a 100% free replacement or full cash refund.</p>
          <p><strong>2. How to Claim:</strong> Take a photo of the received parcel and send it to our WhatsApp helpline at <code>+92 327 9408969</code> within 7 days of delivery.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold font-serif text-gray-900">Privacy & Terms Policy</h1>
      <div className="bg-white p-6 rounded-3xl border border-gray-200 text-xs space-y-4 text-gray-700 leading-relaxed">
        <p>Your privacy is important to us. We never sell your personal contact details or address to third-party advertisers. All order data is transmitted over SSL encryption.</p>
      </div>
    </div>
  );
};
