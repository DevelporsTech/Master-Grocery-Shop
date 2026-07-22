import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PhoneCall, Mail, MapPin, Send, MessageCircle } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { showToast } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('retail');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Inquiry sent! Our Lahore customer service manager will contact you within 2 hours.', 'success');
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-gray-900">Get in Touch with Us</h1>
        <p className="text-xs text-gray-500">Retail customer helpline and wholesale dry fruit inquiries in Pakistan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-emerald-950 text-white p-6 rounded-3xl shadow-xl space-y-6">
            <h3 className="text-base font-bold font-serif text-white pb-2 border-b border-emerald-800">
              Sheikhupura Store & Hub
            </h3>

            <div className="space-y-4 text-xs text-emerald-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Physical Store & Packing Hub:</span>
                  <span>Regal Chowk, Sheikhupura, Punjab, Pakistan</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <PhoneCall className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Customer Helpline / WhatsApp:</span>
                  <span>+92 327 9408969 (Mon - Sat: 9 AM - 9 PM)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Official Email:</span>
                  <span>mastergrocerystore302@gmail.com</span>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/923279408969?text=Assalamu%20Alaikum%20Master%20Grocery%20Team!"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all block text-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp Directly</span>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
          <h3 className="text-base font-bold font-serif text-gray-900 mb-4">Send us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Your Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Asad Ullah Khan"
                required
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Mobile Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0327-9408969"
                required
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Inquiry Type *</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
              >
                <option value="retail">Retail Order Support</option>
                <option value="wholesale">Wholesale & Bulk Dry Fruit Crate Quote</option>
                <option value="wedding">Shadi / Festival Gift Packaging Box</option>
                <option value="complaint">Quality Warranty & Returns</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Message / Requirements *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Detail your inquiry or required dry fruit weights..."
                required
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Inquiry</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
