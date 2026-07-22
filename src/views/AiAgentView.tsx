import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import {
  Bot,
  Send,
  Sparkles,
  Heart,
  Brain,
  Zap,
  Coffee,
  ShoppingBag,
  RefreshCw,
  Check,
  Apple,
  Award,
  BookOpen,
} from 'lucide-react';

export const AiAgentView: React.FC = () => {
  const { products, addToCart, navigateTo } = useStore();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeGoal, setActiveGoal] = useState<string>('Memory & Brain Power');

  const [chatLog, setChatLog] = useState<
    Array<{
      sender: 'user' | 'bot';
      text: string;
      recommendedProductIds?: string[];
      recipeTitle?: string;
    }>
  >([
    {
      sender: 'bot',
      text: 'Assalamu Alaikum! I am Master AI, your Pakistani Nutrition & Grocery Assistant powered by Gemini. Select a health goal below or ask me about dry fruit benefits, traditional Pakistani recipes (Peshawari Kahwa, Badam Halwa, Biryani secrets), or organic grocery advice!',
    },
  ]);

  const healthGoals = [
    { name: 'Memory & Brain Power', icon: Brain, sample: 'Which dry fruits boost memory for students during exams in Pakistan?' },
    { name: 'Immunity & Joint Care', icon: ShieldIcon, sample: 'Best winter dry fruit routine for joint pain and immunity in Lahore/Islamabad?' },
    { name: 'Pregnancy Nutrition', icon: Heart, sample: 'Safe organic dry fruits and dates for expecting mothers in Pakistan?' },
    { name: 'Weight Gain & Fitness', icon: Zap, sample: 'Natural dry fruit milkshake recipe for healthy weight gain?' },
    { name: 'Traditional Kahwa & Teas', icon: Coffee, sample: 'How to make authentic Peshawari Green Kahwa with saffron & cardamom?' },
  ];

  function ShieldIcon(props: any) {
    return <Award {...props} />;
  }

  const handleSend = async (questionText?: string) => {
    const query = questionText || prompt;
    if (!query.trim()) return;

    const userText = query.trim();
    setPrompt('');
    setChatLog((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    const reply = await api.askAiHealthAssistant(userText);

    // Smart catalog product recommendations matching query
    const recommendedIds: string[] = [];
    const lower = userText.toLowerCase();

    if (lower.includes('almond') || lower.includes('badam') || lower.includes('memory')) {
      const p = products.find((prod) => prod.slug.includes('almond') || prod.id === 'mgs-df-001');
      if (p) recommendedIds.push(p.id);
    }
    if (lower.includes('walnut') || lower.includes('akhrot') || lower.includes('brain')) {
      const p = products.find((prod) => prod.slug.includes('walnut') || prod.id === 'mgs-df-002');
      if (p) recommendedIds.push(p.id);
    }
    if (lower.includes('date') || lower.includes('khajoor') || lower.includes('ajwa')) {
      const p = products.find((prod) => prod.slug.includes('date') || prod.id === 'mgs-df-003');
      if (p) recommendedIds.push(p.id);
    }
    if (lower.includes('ghee') || lower.includes('bilona')) {
      const p = products.find((prod) => prod.slug.includes('ghee') || prod.id === 'mgs-gr-002');
      if (p) recommendedIds.push(p.id);
    }

    setChatLog((prev) => [
      ...prev,
      {
        sender: 'bot',
        text: reply,
        recommendedProductIds: recommendedIds.length > 0 ? recommendedIds : undefined,
      },
    ]);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="bg-amber-400 text-emerald-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full inline-block mb-2">
            AI NUTRITIONIST & CULINARY ASSISTANT
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-white flex items-center gap-2">
            <Bot className="w-8 h-8 text-amber-400" />
            Master AI Health & Recipe Advisor
          </h1>
          <p className="text-xs text-emerald-200 mt-1 max-w-2xl">
            Powered by Google Gemini. Get scientifically backed advice on dry fruit health benefits, soaking routines, traditional Pakistani recipes, and organic grocery recommendations.
          </p>
        </div>

        <button
          onClick={() => navigateTo('shop')}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs rounded-xl shadow-md transition-colors shrink-0"
        >
          Explore Shop Items
        </button>
      </div>

      {/* Goal Selector Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {healthGoals.map((goal, idx) => {
          const IconComponent = goal.icon;
          const isActive = activeGoal === goal.name;
          return (
            <button
              key={idx}
              onClick={() => {
                setActiveGoal(goal.name);
                handleSend(goal.sample);
              }}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between gap-3 ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg scale-102'
                  : 'bg-white text-gray-900 border-gray-200 hover:border-emerald-500 hover:shadow-md'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs">{goal.name}</h4>
                <p className={`text-[10px] mt-0.5 line-clamp-2 ${isActive ? 'text-emerald-100' : 'text-gray-500'}`}>
                  {goal.sample}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Chat Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Chat Window */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200 shadow-xs p-6 flex flex-col h-[580px]">
          {/* Chat Logs */}
          <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                    AI
                  </div>
                )}

                <div className="max-w-xl space-y-2">
                  <div
                    className={`p-4 rounded-2xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-700 text-white rounded-tr-none font-medium'
                        : 'bg-white text-gray-900 border border-gray-200 shadow-xs rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Product Recommendations */}
                  {msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl space-y-2">
                      <span className="text-[10px] font-extrabold uppercase text-emerald-900 block">
                        Recommended Store Products:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.recommendedProductIds.map((pid) => {
                          const prod = products.find((p) => p.id === pid);
                          if (!prod) return null;
                          return (
                            <div
                              key={prod.id}
                              className="bg-white p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <img src={prod.mainImage} alt={prod.name} className="w-10 h-10 object-cover rounded-lg" />
                                <div>
                                  <h5 className="font-bold text-xs text-gray-900 line-clamp-1">{prod.name}</h5>
                                  <span className="text-xs text-emerald-700 font-bold">
                                    ₨ {prod.basePricePKR.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => addToCart(prod, prod.weightOptions[0])}
                                className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-700"
                              >
                                Add
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    You
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-xs italic">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Master AI is generating nutrition advice...</span>
              </div>
            )}
          </div>

          {/* Prompt Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="mt-4 flex gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask e.g. What is the best dry fruit combo for kids memory and weight gain?"
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Ask Master AI</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Sidebar: Health Tips & Dry Fruit Guide */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-gray-900 font-serif flex items-center gap-2">
              <Apple className="w-4 h-4 text-emerald-600" /> Daily Soaking Guide
            </h3>
            <div className="space-y-3 text-xs text-gray-600">
              <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <strong className="text-emerald-950 block mb-1">🥜 Irani Mamra Almonds:</strong>
                Soak 5-7 almonds overnight in clean water. Peel off brown skin in morning for maximum Vitamin E absorption.
              </div>
              <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-100">
                <strong className="text-amber-950 block mb-1">🧠 Gilgit Kagzi Walnuts:</strong>
                Eat 2 walnut halves with breakfast. Rich in Omega-3 DHA for brain sharpness.
              </div>
              <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
                <strong className="text-purple-950 block mb-1">🌴 Madinah Ajwa Dates:</strong>
                Eat 3 Ajwa dates every morning on empty stomach for cardiac health & natural iron.
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-emerald-950 p-6 rounded-3xl shadow-lg border border-amber-300 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-amber-300 px-2.5 py-1 rounded-full inline-block">
              EXPRESS DELIVERY
            </span>
            <h4 className="font-bold font-serif text-base">Nationwide Delivery Across Pakistan</h4>
            <p className="text-xs text-emerald-950/90 leading-relaxed">
              All dry fruits and organic groceries recommended by Master AI are in stock and shipped via Leopard Express with 100% freshness guarantee.
            </p>
            <button
              onClick={() => navigateTo('shop')}
              className="w-full py-2.5 bg-emerald-950 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-900"
            >
              Shop Recommended Items
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
