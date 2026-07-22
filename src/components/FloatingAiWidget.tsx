import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { Bot, X, Send, Sparkles, MessageSquare, RefreshCw, ShoppingBag, ArrowRight } from 'lucide-react';

export const FloatingAiWidget: React.FC = () => {
  const { products, addToCart, navigateTo } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; recommendedProductId?: string }>>([
    {
      sender: 'bot',
      text: 'Assalamu Alaikum! I am Master AI, your Pakistani Nutrition & Grocery Assistant. Ask me anything about dry fruits, health benefits, or traditional recipes!',
    },
  ]);

  const quickPrompts = [
    'Best dry fruits for daily energy?',
    'How to soak Irani Mamra Almonds?',
    'Authentic Peshawari Kahwa recipe?',
    'Kainat Basmati Rice cooking ratio?',
  ];

  const handleSend = async (questionText?: string) => {
    const q = questionText || prompt;
    if (!q.trim()) return;

    const userText = q.trim();
    setPrompt('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    const reply = await api.askAiHealthAssistant(userText);

    // Smart product matching for recommendations
    let matchId: string | undefined = undefined;
    const lower = userText.toLowerCase();
    if (lower.includes('almond') || lower.includes('badam')) {
      matchId = products.find((p) => p.slug.includes('almond') || p.id === 'mgs-df-001')?.id;
    } else if (lower.includes('walnut') || lower.includes('akhrot')) {
      matchId = products.find((p) => p.slug.includes('walnut') || p.id === 'mgs-df-002')?.id;
    } else if (lower.includes('date') || lower.includes('khajoor')) {
      matchId = products.find((p) => p.slug.includes('date') || p.id === 'mgs-df-003')?.id;
    } else if (lower.includes('rice') || lower.includes('chawal')) {
      matchId = products.find((p) => p.slug.includes('rice') || p.id === 'mgs-gr-001')?.id;
    } else if (lower.includes('ghee')) {
      matchId = products.find((p) => p.slug.includes('ghee') || p.id === 'mgs-gr-002')?.id;
    }

    setMessages((prev) => [...prev, { sender: 'bot', text: reply, recommendedProductId: matchId }]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-[#16A34A] hover:bg-[#15803D] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-2.5 group hover:scale-105 border-2 border-white"
        title="Ask Master AI Assistant"
      >
        <div className="relative">
          <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F59E0B] rounded-full animate-ping" />
        </div>
        <span className="hidden sm:inline font-extrabold text-xs tracking-wide">Ask Master AI</span>
      </button>

      {/* Slide-Up Popup Dialog */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#111827] text-white p-4 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#16A34A] flex items-center justify-center text-white shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs flex items-center gap-1 text-white">
                  Master AI Assistant
                  <span className="bg-[#F59E0B] text-[#111827] text-[8px] font-black px-1.5 py-0.2 rounded">
                    GEMINI
                  </span>
                </h4>
                <p className="text-[10px] text-gray-400">Pakistani Nutritionist & Grocery Advisor</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigateTo('ai-agent');
                }}
                className="text-[10px] text-amber-400 font-bold hover:underline px-2 py-1"
              >
                Expand Page →
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Preset Chips */}
          <div className="p-2.5 bg-[#FAFAFA] border-b border-[#E5E7EB] flex items-center gap-1.5 overflow-x-auto text-[10px] scrollbar-none">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="shrink-0 bg-white hover:bg-[#F0FDF4] border border-[#E5E7EB] text-[#111827] font-semibold px-2.5 py-1 rounded-full transition-colors"
              >
                💡 {qp}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="h-72 overflow-y-auto p-4 space-y-3 bg-[#FAFAFA] text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className={`space-y-2 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div
                  className={`inline-block p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#16A34A] text-white rounded-tr-none font-medium'
                      : 'bg-white text-[#111827] border border-[#E5E7EB] shadow-2xs rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>

                {/* Inline Product Recommendation Card */}
                {m.recommendedProductId && (
                  <div className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-between gap-2 max-w-[85%] text-left">
                    {(() => {
                      const recProd = products.find((p) => p.id === m.recommendedProductId);
                      if (!recProd) return null;
                      return (
                        <>
                          <div className="flex items-center gap-2">
                            <img
                              src={recProd.mainImage}
                              alt={recProd.name}
                              className="w-9 h-9 object-cover rounded-lg border"
                            />
                            <div>
                              <h5 className="font-bold text-[11px] text-[#111827] line-clamp-1">{recProd.name}</h5>
                              <span className="text-[10px] text-[#16A34A] font-bold">
                                ₨ {recProd.basePricePKR.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              addToCart(recProd, recProd.weightOptions[0]);
                              setIsOpen(false);
                            }}
                            className="bg-[#16A34A] hover:bg-[#15803D] text-white p-1.5 rounded-lg shrink-0"
                            title="Add to Cart"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-xs italic">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#16A34A]" />
                <span>Master AI is preparing advice...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-[#E5E7EB] flex items-center gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask about dry fruits or recipes..."
              className="flex-1 px-3 py-2 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#16A34A]"
            />
            <button
              type="submit"
              disabled={loading}
              className="p-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
