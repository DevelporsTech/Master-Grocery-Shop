import React, { useEffect, useState } from 'react';
import { ShoppingBag, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Store...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Progress timer
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 5;
        if (next > 30 && next < 60) {
          setStatusText('Loading Fresh Groceries & Organic Spices...');
        } else if (next >= 60 && next < 90) {
          setStatusText('Preparing Best Prices & Offers...');
        } else if (next >= 90) {
          setStatusText('Welcome to Master Grocery Shop!');
        }
        return next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 400); // Allow fade-out animation to finish
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between p-6 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white transition-opacity duration-400 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Banner Tag */}
      <div className="pt-8 flex items-center gap-2 px-3.5 py-1.5 bg-emerald-800/60 border border-emerald-700/80 rounded-full text-xs font-semibold text-amber-300 shadow-sm animate-pulse">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>Regal Chowk, Sheikhupura • Delivering Nationwide</span>
      </div>

      {/* Main Logo & Branding Centerpiece */}
      <div className="flex flex-col items-center text-center max-w-sm my-auto">
        <div className="relative mb-6 group">
          {/* Glowing Aura Ring */}
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-500 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
          
          {/* App Official Logo Image */}
          <img
            src="/logo.jpg"
            alt="Master Grocery Shop Logo"
            className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-amber-400 shadow-2xl transform transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute -bottom-2 -right-2 bg-amber-500 text-emerald-950 p-1.5 rounded-full border-2 border-emerald-950 shadow-md">
            <CheckCircle2 className="w-5 h-5 fill-amber-500 text-emerald-950" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-white flex items-center justify-center gap-1.5">
          <span>MASTER</span>
          <span className="text-amber-400">GROCERY</span>
        </h1>
        <p className="text-xs font-bold tracking-[0.25em] text-emerald-300 uppercase mt-1">
          SHOP • EST. 1984
        </p>

        {/* Tagline */}
        <p className="text-xs sm:text-sm text-emerald-100/90 font-medium mt-3 px-2 leading-relaxed">
          Pakistan's Premier Destination for Dry Fruits, Organic Pulses & Daily Essentials
        </p>

        {/* Progress Bar Container */}
        <div className="w-full max-w-xs mt-8 space-y-2">
          <div className="w-full h-2.5 bg-emerald-950/80 rounded-full overflow-hidden p-0.5 border border-emerald-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[11px] text-emerald-300 font-mono">
            <span>{statusText}</span>
            <span className="font-bold text-amber-400">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Footer Trust Badges */}
      <div className="pb-4 flex flex-col items-center gap-2 text-[11px] text-emerald-300/80 font-medium">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>100% Organic & Fresh</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>Cash on Delivery & Online Payment</span>
          </span>
        </div>
        <p className="text-[10px] text-emerald-400/60">
          Powered by Master Grocery Shop Mobile App
        </p>
      </div>
    </div>
  );
};
