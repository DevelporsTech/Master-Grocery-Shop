import React, { useState } from 'react';
import { api } from '../services/api';
import { Bot, Send, Sparkles, User, RefreshCw, HeartPulse } from 'lucide-react';

export const AiHealthAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'Assalamu Alaikum! I am your AI Nutrition & Recipe Advisor for MASTER GROCERY SHOP. Ask me about dry fruit benefits, Pakistani traditional recipes (Peshawari Kahwa, Badam Milk), or grocery storage tips!',
    },
  ]);

  const presetQuestions = [
    'Benefits of 5 soaked Irani Mamra Almonds daily?',
    'How to make authentic Peshawari Kahwa green tea?',
    'Which dry fruits boost kids memory during exams?',
    'Why is Bilona Desi Ghee healthier than vegetable oil?',
  ];

  const handleSend = async (questionText?: string) => {
    const q = questionText || prompt;
    if (!q.trim()) return;

    const userMsg = q.trim();
    setPrompt('');
    setChatHistory((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    const botReply = await api.askAiHealthAssistant(userMsg);
    setChatHistory((prev) => [...prev, { sender: 'bot', text: botReply }]);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xl my-12">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-amber-500 flex items-center justify-center text-white shadow-md">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold font-serif text-gray-900 flex items-center gap-1.5">
            AI Dry Fruit & Grocery Health Assistant
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              Powered by Gemini
            </span>
          </h3>
          <p className="text-xs text-gray-500">Ask nutrition benefits, recipes, or storage advice</p>
        </div>
      </div>

      {/* Preset Suggestion Chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {presetQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[11px] font-semibold bg-emerald-50 text-emerald-900 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
          >
            💡 {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="h-60 overflow-y-auto space-y-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 mb-4 text-xs">
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                AI
              </div>
            )}
            <div
              className={`p-3 rounded-2xl max-w-md leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-700 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 border border-gray-200 shadow-2xs rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                You
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-gray-400 text-xs italic">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
            <span>Consulting AI Nutritionist...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask e.g. Which dry fruit helps in joint pain during winter in Pakistan?"
          className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
        >
          <span>Ask AI</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
