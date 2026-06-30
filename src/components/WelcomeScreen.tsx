// src/components/WelcomeScreen.tsx

import React from 'react';

interface WelcomeScreenProps {
  onSuggestion: (text: string) => void;
}

const suggestions = [
  'به من کمک کن یه وب‌سایت با React بسازم',
  'فرق بین TypeScript و JavaScript چیه؟',
  'بهترین روش برای یادگیری برنامه‌نویسی چیه؟',
  'یه رزومه حرفه‌ای برای من بنویس',
  'معرفی بهترین کتاب‌های برنامه‌نویسی',
  'چطور یه API با Node.js بسازم؟',
];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSuggestion }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="max-w-4xl">
        <div className="text-7xl mb-6 animate-bounce">🤖</div>
        <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          بات باتن
        </h1>
        <p className="text-gray-400 text-xl mb-4">
          یک دستیار هوش مصنوعی پیشرفته و دوستانه
        </p>
        <p className="text-gray-500 text-sm mb-10">
          با قدرت OpenAI، Mistral، Groq و Pollinations
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestion(suggestion)}
              className="text-right px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 text-gray-300 hover:text-white text-sm hover:scale-[1.02] hover:border-blue-500/50 group"
            >
              <span className="group-hover:text-blue-400 transition-colors">
                {suggestion}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <span className="text-yellow-500">⚡</span> پاسخ‌های سریع
          </span>
          <span className="text-gray-700">•</span>
          <span className="flex items-center gap-1">
            <span className="text-purple-500">🧠</span> ۴ مدل مختلف
          </span>
          <span className="text-gray-700">•</span>
          <span className="flex items-center gap-1">
            <span className="text-pink-500">🎨</span> تولید تصویر
          </span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;