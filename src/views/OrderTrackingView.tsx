import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { Order } from '../types';
import { Search, Truck, CheckCircle2, Clock, PackageCheck, Printer, MapPin, Phone } from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const { recentOrders } = useStore();
  const [searchInput, setSearchInput] = useState('MGS-PK-89421');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(recentOrders[0] || null);
  const [loading, setLoading] = useState(false);
  const [notFoundMessage, setNotFoundMessage] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setLoading(true);
    setNotFoundMessage('');
    const order = await api.trackOrder(searchInput);
    setLoading(false);

    if (order) {
      setSearchedOrder(order);
    } else {
      setSearchedOrder(null);
      setNotFoundMessage(`No order record found for '${searchInput}'. Please check your Tracking ID or Mobile Number.`);
    }
  };

  const statusSteps = [
    'Order Placed',
    'Confirmed',
    'Packing Fresh',
    'Out for Courier',
    'Delivered',
  ];

  const getStepIndex = (status: string) => statusSteps.indexOf(status);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Search Bar Banner */}
      <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-8 rounded-3xl shadow-xl space-y-4">
        <div className="max-w-md">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Real-time Courier Status</span>
          <h1 className="text-2xl font-bold font-serif">Track Your Pakistan Grocery Parcel</h1>
          <p className="text-xs text-emerald-200 mt-1">Enter your Tracking ID (e.g. MGS-PK-89421) or registered Mobile Phone Number</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="e.g. MGS-PK-89421 or 03279408969"
            className="flex-1 px-4 py-3 bg-white text-gray-900 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Track</span>
          </button>
        </form>

        {notFoundMessage && (
          <p className="text-xs text-amber-300 bg-emerald-900/80 p-3 rounded-xl border border-amber-400/30">
            {notFoundMessage}
          </p>
        )}
      </div>

      {/* Tracked Order Details Card */}
      {searchedOrder && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-xs space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-100 gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                Status: {searchedOrder.status}
              </span>
              <h2 className="text-xl font-bold font-serif text-gray-900 mt-2">
                Order #{searchedOrder.trackingNumber}
              </h2>
              <p className="text-xs text-gray-400">Placed on: {new Date(searchedOrder.createdAt).toLocaleDateString()}</p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print PDF Invoice
            </button>
          </div>

          {/* Visual Status Stepper */}
          <div>
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-6">Shipment Timeline</h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
              {statusSteps.map((step, idx) => {
                const currentIdx = getStepIndex(searchedOrder.status);
                const isCompleted = idx <= currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div
                    key={step}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-emerald-950 border-amber-500 font-black shadow-md scale-102'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                        : 'bg-gray-50 text-gray-400 border-gray-200'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full mx-auto mb-1.5 flex items-center justify-center text-xs font-extrabold">
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <span className="text-[11px] block">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier & Delivery Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1">
              <span className="font-bold text-gray-500 uppercase block text-[10px]">Courier Partner</span>
              <p className="font-extrabold text-gray-900 text-sm">{searchedOrder.courierName}</p>
              <p className="text-gray-500">Estimated Delivery: {searchedOrder.estimatedDeliveryDays}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1">
              <span className="font-bold text-gray-500 uppercase block text-[10px]">Delivery Destination</span>
              <p className="font-bold text-gray-900">{searchedOrder.customerName}</p>
              <p className="text-gray-600">{searchedOrder.address}, {searchedOrder.city}, {searchedOrder.province}</p>
            </div>
          </div>

          {/* Itemized Receipt Table */}
          <div>
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Itemized Parcel Breakdown</h3>
            <div className="border border-gray-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 font-bold border-b">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3 text-center">Weight</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {searchedOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-bold text-gray-900">{it.productName}</td>
                      <td className="p-3 text-center text-emerald-800 font-semibold">{it.weight}</td>
                      <td className="p-3 text-center font-bold">{it.quantity}</td>
                      <td className="p-3 text-right font-extrabold">₨ {it.totalPricePKR.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-gray-50 p-4 border-t border-gray-200 space-y-1 text-right text-xs">
                <div className="text-gray-600">Subtotal: ₨ {searchedOrder.subtotalPKR.toLocaleString()}</div>
                <div className="text-gray-600">Shipping: ₨ {searchedOrder.shippingFeePKR.toLocaleString()}</div>
                {searchedOrder.discountPKR > 0 && (
                  <div className="text-amber-600 font-bold">Discount: - ₨ {searchedOrder.discountPKR.toLocaleString()}</div>
                )}
                <div className="text-base font-black text-emerald-800 pt-1 border-t border-gray-200">
                  Total Amount: ₨ {searchedOrder.totalPKR.toLocaleString()}
                </div>
                <div className="text-[11px] text-gray-600 pt-1">
                  Payment Method:{' '}
                  <span className="font-bold text-gray-900 uppercase">
                    {searchedOrder.paymentMethod === 'cod' && 'Cash on Delivery (COD)'}
                    {searchedOrder.paymentMethod === 'card' && 'Credit / Debit Card'}
                    {searchedOrder.paymentMethod === 'easypaisa' && 'Easypaisa Mobile Wallet'}
                    {searchedOrder.paymentMethod === 'jazzcash' && 'JazzCash Mobile Wallet'}
                    {searchedOrder.paymentMethod === 'raast' && 'Raast Instant Payment'}
                    {searchedOrder.paymentMethod === 'bank_transfer' && 'Direct Bank IBAN Transfer'}
                  </span>
                  {' '}• Status:{' '}
                  <span className={`font-extrabold px-2 py-0.5 rounded-md ${searchedOrder.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                    {searchedOrder.paymentStatus}
                  </span>
                </div>
                {(searchedOrder.transactionId || searchedOrder.paymentNote) && (
                  <div className="text-[10px] text-gray-500 italic">
                    {searchedOrder.transactionId && `Ref/TRX ID: ${searchedOrder.transactionId} `}
                    {searchedOrder.paymentNote && `(${searchedOrder.paymentNote})`}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
