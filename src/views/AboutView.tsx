import React from 'react';
import { Award, ShieldCheck, MapPin, Heart, Truck, Users } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white p-8 md:p-12 rounded-3xl shadow-xl text-center space-y-3">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Our Heritage & Mission</span>
        <h1 className="text-3xl md:text-4xl font-black font-serif text-white">
          Bringing Pure Mountain Orchards to Every Pakistani Home
        </h1>
        <p className="text-xs md:text-sm text-emerald-200 max-w-2xl mx-auto leading-relaxed">
          Established to eliminate middleman inflation and fake synthetic dry fruits, Master Grocery Shop connects consumers across Lahore, Karachi, and Islamabad directly with organic farmers in Gilgit-Baltistan, Hunza, and Quetta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base font-serif text-gray-900">Direct Farm Sourcing</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Our Mamra almonds and Kagzi walnuts are handpicked by local mountain families in Hunza and Skardu.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base font-serif text-gray-900">Vacuum Sealed Freshness</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Processed in our ISO-grade clean facility in Lahore using food-grade nitrogen sealing to prevent moisture loss.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base font-serif text-gray-900">24-48h Express Shipping</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Partnered with Leopard, TCS, and Trax for fast cash-on-delivery service in all 100+ cities in Pakistan.
          </p>
        </div>
      </div>
    </div>
  );
};
