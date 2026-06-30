import { Sparkles, Zap, Palette, Code, Send } from 'lucide-react';

interface WelcomeScreenProps {
  onSuggestion: (text: string) => void;
}

const suggestions = [
  { icon: <Code className="w-4 h-4" />, text: 'به من کمک کن یه وب‌سایت با React بسازم' },
  { icon: <Sparkles className="w-4 h-4" />, text: 'فرق بین TypeScript و JavaScript چیه؟' },
  { icon: <Zap className="w-4 h-4" />, text: 'بهترین روش برای یادگیری برنامه‌نویسی چیه؟' },
  { icon: <Palette className="w-4 h-4" />, text: 'یه رزومه حرفه‌ای برای من بنویس' },
];

export default function WelcomeScreen({ onSuggestion }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="max-w-3xl animate-fade-in">
        <div className="relative inline-block mb-8">
          <div className="text-8xl sm:text-9xl animate-float">🤖</div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            بات باتن
          </span>
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl mb-2">
          یک دستیار هوش مصنوعی پیشرفته و دوستانه
        </p>
        <p className="text-gray-500 text-sm mb-10">
          با ۴ مدل مختلف • تولید تصویر • پاسخ‌های سریع
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestion(suggestion.text)}
              className="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] text-right"
            >
              <span className="text-blue-400 group-hover:text-blue-300 transition-colors">
                {suggestion.icon}
              </span>
              <span className="text-gray-300 group-hover:text-white text-sm transition-colors flex-1">
                {suggestion.text}
              </span>
              <Send className="w-3.5 h-3.5 text-gray-600 group-hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100" />
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <span className="text-blue-400">⚡</span> سریع
          </span>
          <span className="text-gray-700">•</span>
          <span className="flex items-center gap-1">
            <span className="text-purple-400">🧠</span> ۴ مدل
          </span>
          <span className="text-gray-700">•</span>
          <span className="flex items-center gap-1">
            <span className="text-pink-400">🎨</span> تصویر
          </span>
          <span className="text-gray-700">•</span>
          <span className="flex items-center gap-1">
            <span className="text-green-400">🔒</span> امن
          </span>
        </div>
      </div>
    </div>
  );
}