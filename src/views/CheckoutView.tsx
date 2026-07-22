import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PAKISTAN_CITIES } from '../data/mockData';
import { PaymentMethod } from '../types';
import { api } from '../services/api';
import { ShieldCheck, Truck, CheckCircle2, Lock, ArrowRight, CreditCard, Copy, Check, Building2, Wallet, Smartphone, Zap, HelpCircle } from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotalPKR,
    couponDiscountPKR,
    appliedCoupon,
    clearCart,
    addOrderToHistory,
    navigateTo,
    showToast,
    currentUser,
  } = useStore();

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [province, setProvince] = useState('Punjab');
  const [selectedCity, setSelectedCity] = useState(
    PAKISTAN_CITIES.find((c) => c.name.toLowerCase() === (currentUser?.city || '').toLowerCase()) || PAKISTAN_CITIES[0]
  );
  const [address, setAddress] = useState(currentUser?.address || '');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  
  // Wallet / Bank / Raast transaction ID
  const [transactionId, setTransactionId] = useState('');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const FREE_SHIPPING_THRESHOLD = 2500;
  const isFreeShipping = cartSubtotalPKR >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = isFreeShipping || cart.length === 0 ? 0 : selectedCity.deliveryFeePKR;
  const totalPKR = Math.max(0, cartSubtotalPKR - couponDiscountPKR + shippingFee);

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    showToast(`Copied ${keyName} to clipboard!`, 'success');
    setTimeout(() => setCopiedKey(null), 3000);
  };

  const handleFillDemoCard = () => {
    setCardHolder('Muhammad Salman');
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvc('888');
    showToast('Demo Visa Card Autofilled!', 'info');
  };

  const formatCardNumber = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/.{1,4}/g);
    return parts ? parts.join(' ') : raw;
  };

  const formatExpiry = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      return `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    return raw;
  };

  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(clean)) return 'Mastercard';
    if (clean.startsWith('62')) return 'UnionPay';
    if (clean.startsWith('5081')) return 'PayPak';
    return 'Card';
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address) {
      showToast('Please fill all required shipping address fields', 'warning');
      return;
    }

    if (paymentMethod === 'card') {
      const cleanCard = cardNumber.replace(/\s/g, '');
      if (cleanCard.length < 12 || !cardExpiry || !cardCvc) {
        showToast('Please enter valid Debit/Credit Card details or click "Fill Demo Card"', 'warning');
        return;
      }
    }

    setIsSubmitting(true);

    let paymentStatus: 'Pending' | 'Paid' | 'Verification Required' = 'Pending';
    let paymentNote = '';

    if (paymentMethod === 'cod') {
      paymentStatus = 'Pending';
      paymentNote = 'Cash to be collected upon parcel delivery';
    } else if (paymentMethod === 'card') {
      paymentStatus = 'Paid';
      const last4 = cardNumber.replace(/\s/g, '').slice(-4) || '4242';
      paymentNote = `${getCardBrand(cardNumber)} ending in ${last4} (Paid Online)`;
    } else {
      paymentStatus = transactionId.trim() ? 'Paid' : 'Verification Required';
      paymentNote = transactionId.trim()
        ? `Ref/TID: ${transactionId.trim()}`
        : 'Awaiting screenshot verification on WhatsApp';
    }

    const orderPayload = {
      customerName,
      email,
      phone,
      province,
      city: selectedCity.name,
      address,
      deliveryNotes,
      paymentMethod,
      paymentStatus,
      transactionId: transactionId.trim(),
      paymentNote,
      subtotalPKR: cartSubtotalPKR,
      shippingFeePKR: shippingFee,
      discountPKR: couponDiscountPKR,
      couponCode: appliedCoupon?.code,
      totalPKR,
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        weight: item.selectedWeightOption.weight,
        quantity: item.quantity,
        unitPricePKR: item.unitPricePKR,
        totalPricePKR: item.itemTotalPKR,
      })),
    };

    const createdOrder = await api.createOrder(orderPayload);
    addOrderToHistory(createdOrder);
    clearCart();
    setIsSubmitting(false);

    showToast(`Order Placed Successfully! Tracking ID: ${createdOrder.trackingNumber}`, 'success');
    navigateTo('order-tracking');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-gray-900">Checkout Express</h1>
        <p className="text-xs text-gray-500">Provide shipping details and choose any payment method usable for everyone across Pakistan</p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Shipping & Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Shipping Address */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold font-serif text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
              <Truck className="w-5 h-5 text-emerald-600" />
              1. Pakistani Shipping Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Muhammad Salman"
                  required
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Mobile Phone Number (for SMS Tracking) *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0327-9408969"
                  required
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="salman@gmail.com"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Province *</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                  <option value="Azad Jammu & Kashmir">Azad Jammu & Kashmir</option>
                  <option value="Capital Territory">Islamabad Capital</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">Select City *</label>
                <select
                  value={selectedCity.name}
                  onChange={(e) => {
                    const c = PAKISTAN_CITIES.find((city) => city.name === e.target.value);
                    if (c) setSelectedCity(c);
                  }}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} ({c.province}) - Express Fee ₨ {c.deliveryFeePKR}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">Complete House & Street Address *</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  placeholder="House #, Street #, Sector / Colony, Area Landmark"
                  required
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">Special Delivery Notes (Optional)</label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Call before delivery, deliver between 2 PM - 6 PM"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Select Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold font-serif text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                2. Select Payment Method (Usable for Everyone)
              </h2>
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full uppercase">
                100% Guaranteed Secure
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Option 1: Cash on Delivery */}
              <label className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      💵 Cash on Delivery (COD)
                    </span>
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-md">Most Popular</span>
                  </div>
                  <p className="text-gray-500 mt-1">Pay in cash directly to the courier rider upon delivery at your home or office anywhere in Pakistan.</p>
                </div>
              </label>

              {/* Option 2: Credit / Debit Card */}
              <div className={`p-4 rounded-2xl border transition-all ${paymentMethod === 'card' ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-600' : 'bg-gray-50 border-gray-200'}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                        💳 Credit / Debit Card (Visa, Mastercard, UnionPay, PayPak)
                      </span>
                      <span className="text-[10px] bg-amber-500 text-emerald-950 font-extrabold px-2 py-0.5 rounded-md">Instant Approval</span>
                    </div>
                    <p className="text-gray-500 mt-0.5">Pay securely using any Pakistani or International bank Visa, Mastercard, UnionPay, or PayPak card.</p>
                  </div>
                </label>

                {paymentMethod === 'card' && (
                  <div className="mt-4 pt-4 border-t border-emerald-200/60 space-y-3 bg-white p-4 rounded-xl border border-emerald-200">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        Card Processing Portal (256-Bit SSL Encrypted)
                      </span>
                      <button
                        type="button"
                        onClick={handleFillDemoCard}
                        className="text-[10px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2 py-1 rounded-lg transition-all"
                      >
                        ⚡ Fill Demo Test Card
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-600 block mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Name as printed on card"
                        className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[11px] font-bold text-gray-600">Card Number</label>
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {getCardBrand(cardNumber)}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                          className="w-full p-2 pl-9 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono font-bold tracking-wider"
                        />
                        <CreditCard className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-gray-600 block mb-1">Expiry Date (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-600 block mb-1">CVV / CVC Code</label>
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="123"
                          maxLength={4}
                          className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Option 3: Easypaisa */}
              <div className={`p-4 rounded-2xl border transition-all ${paymentMethod === 'easypaisa' ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-600' : 'bg-gray-50 border-gray-200'}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'easypaisa'}
                    onChange={() => setPaymentMethod('easypaisa')}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                        📱 Easypaisa Mobile Wallet
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-md">Mobile App / USSD *786#</span>
                    </div>
                    <p className="text-gray-500 mt-0.5">Send payment to Easypaisa account: <strong className="text-emerald-800">0327-9408969</strong> (Title: Master Grocery Shop).</p>
                  </div>
                </label>

                {paymentMethod === 'easypaisa' && (
                  <div className="mt-4 pt-3 border-t border-emerald-200/60 space-y-3 bg-white p-4 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 block">Easypaisa Mobile Account</span>
                        <span className="text-sm font-extrabold text-emerald-950">0327-9408969</span>
                        <span className="text-[11px] text-gray-600 block">Title: Master Grocery Shop</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('03279408969', 'Easypaisa Account Number')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-xs transition-all"
                      >
                        {copiedKey === 'Easypaisa Account Number' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'Easypaisa Account Number' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">
                        Transaction ID / Ref Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 03278912345 or TRX-8821"
                        className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">Entering your TRX ID speeds up instant dispatch, but you can also place order and WhatsApp screenshot to 0327-9408969.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Option 4: JazzCash */}
              <div className={`p-4 rounded-2xl border transition-all ${paymentMethod === 'jazzcash' ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-600' : 'bg-gray-50 border-gray-200'}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'jazzcash'}
                    onChange={() => setPaymentMethod('jazzcash')}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                        📱 JazzCash Mobile Wallet
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-md">Mobile App / USSD *786#</span>
                    </div>
                    <p className="text-gray-500 mt-0.5">Send payment to JazzCash account: <strong className="text-emerald-800">0327-9408969</strong> (Title: Master Grocery Shop).</p>
                  </div>
                </label>

                {paymentMethod === 'jazzcash' && (
                  <div className="mt-4 pt-3 border-t border-emerald-200/60 space-y-3 bg-white p-4 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 block">JazzCash Mobile Account</span>
                        <span className="text-sm font-extrabold text-emerald-950">0327-9408969</span>
                        <span className="text-[11px] text-gray-600 block">Title: Master Grocery Shop</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('03279408969', 'JazzCash Account Number')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-xs transition-all"
                      >
                        {copiedKey === 'JazzCash Account Number' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'JazzCash Account Number' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">
                        Transaction ID / Ref Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 819283719 or TRX-9921"
                        className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">Entering your TRX ID speeds up instant dispatch, or share screenshot on WhatsApp (0327-9408969).</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Option 5: Raast Instant Payment */}
              <div className={`p-4 rounded-2xl border transition-all ${paymentMethod === 'raast' ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-600' : 'bg-gray-50 border-gray-200'}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'raast'}
                    onChange={() => setPaymentMethod('raast')}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                        ⚡ Raast Instant Payment (State Bank Zero Fee)
                      </span>
                      <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-md">Any Bank App</span>
                    </div>
                    <p className="text-gray-500 mt-0.5">Transfer instantly from Meezan, HBL, UBL, Alfalah, Allied, MCB, NayaPay, or SadaPay apps using Raast ID.</p>
                  </div>
                </label>

                {paymentMethod === 'raast' && (
                  <div className="mt-4 pt-3 border-t border-emerald-200/60 space-y-3 bg-white p-4 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 block">Raast ID (Mobile Number)</span>
                        <span className="text-sm font-extrabold text-emerald-950">0327-9408969</span>
                        <span className="text-[11px] text-gray-600 block">Account Title: Master Grocery Shop</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('03279408969', 'Raast Mobile ID')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-xs transition-all"
                      >
                        {copiedKey === 'Raast Mobile ID' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'Raast Mobile ID' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">
                        Raast Reference Number / Transaction Ref (Optional)
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. RAAST-2026-98124"
                        className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Option 6: Direct Bank IBAN Transfer */}
              <div className={`p-4 rounded-2xl border transition-all ${paymentMethod === 'bank_transfer' ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-600' : 'bg-gray-50 border-gray-200'}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                        🏦 Direct Bank IBAN Transfer (Meezan / HBL / All Banks)
                      </span>
                      <span className="text-[10px] text-gray-600 bg-gray-200 font-bold px-2 py-0.5 rounded-md">Online Banking</span>
                    </div>
                    <p className="text-gray-500 mt-0.5">Transfer via online or mobile banking app to Meezan Bank Islamic account.</p>
                  </div>
                </label>

                {paymentMethod === 'bank_transfer' && (
                  <div className="mt-4 pt-3 border-t border-emerald-200/60 space-y-3 bg-white p-4 rounded-xl border border-emerald-200">
                    <div className="space-y-2 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-emerald-700 block">Bank Account IBAN</span>
                          <span className="text-xs font-extrabold text-emerald-950 font-mono">PK36MEZN00012345678901</span>
                          <span className="text-[11px] text-gray-600 block">Bank: Meezan Bank Islamic | Title: Master Grocery Shop</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('PK36MEZN00012345678901', 'Bank IBAN')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-xs transition-all"
                        >
                          {copiedKey === 'Bank IBAN' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'Bank IBAN' ? 'Copied!' : 'Copy IBAN'}</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">
                        Bank Transfer Reference / Transaction ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. MEZ-9918231"
                        className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-emerald-950 text-white p-6 rounded-3xl shadow-xl space-y-4 sticky top-24">
            <h2 className="text-base font-bold font-serif text-white pb-3 border-b border-emerald-800 flex justify-between items-center">
              <span>Order Summary</span>
              <span className="text-xs bg-emerald-800 text-emerald-200 px-2.5 py-0.5 rounded-full font-sans">{cart.length} items</span>
            </h2>

            <div className="divide-y divide-emerald-900 max-h-60 overflow-y-auto pr-1 text-xs">
              {cart.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white line-clamp-1">{item.product.name}</h4>
                    <span className="text-[10px] text-emerald-300">
                      {item.selectedWeightOption.weight} x {item.quantity}
                    </span>
                  </div>
                  <span className="font-extrabold text-amber-400">₨ {item.itemTotalPKR.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-emerald-800 space-y-2 text-xs text-emerald-200">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-white">₨ {cartSubtotalPKR.toLocaleString()}</span>
              </div>

              {couponDiscountPKR > 0 && (
                <div className="flex justify-between text-amber-400 font-bold">
                  <span>Discount:</span>
                  <span>- ₨ {couponDiscountPKR.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping ({selectedCity.name}):</span>
                <span className="font-bold text-white">
                  {isFreeShipping ? <span className="text-amber-400 uppercase font-black">FREE</span> : `₨ ${shippingFee}`}
                </span>
              </div>

              <div className="pt-3 border-t border-emerald-800 flex justify-between items-baseline text-sm font-bold">
                <span className="text-emerald-200">Total Payable Amount:</span>
                <span className="text-2xl font-black text-amber-400">₨ {totalPKR.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-emerald-900/80 p-3 rounded-2xl border border-emerald-700/50 text-[11px] text-emerald-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Payment Method Selected:</span>
              </div>
              <p className="font-semibold capitalize text-white pl-5">
                {paymentMethod === 'cod' && '💵 Cash on Delivery'}
                {paymentMethod === 'card' && '💳 Debit / Credit Card (Instant Approval)'}
                {paymentMethod === 'easypaisa' && '📱 Easypaisa Mobile Wallet'}
                {paymentMethod === 'jazzcash' && '📱 JazzCash Mobile Wallet'}
                {paymentMethod === 'raast' && '⚡ Raast Instant Payment (State Bank)'}
                {paymentMethod === 'bank_transfer' && '🏦 Direct Bank IBAN Transfer'}
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Confirming Order...' : 'Confirm Order & Generate Tracking'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

