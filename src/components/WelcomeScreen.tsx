import { Sparkles, Zap, Palette, Code, Send, Rocket, Star, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  onSuggestion: (text: string) => void;
}

const suggestions = [
  { icon: <Code className="w-4 h-4" />, text: 'به من کمک کن یه وب‌سایت با React بسازم', color: 'from-blue-500 to-cyan-500' },
  { icon: <Brain className="w-4 h-4" />, text: 'فرق بین TypeScript و JavaScript چیه؟', color: 'from-purple-500 to-pink-500' },
  { icon: <Rocket className="w-4 h-4" />, text: 'بهترین روش برای یادگیری برنامه‌نویسی چیه؟', color: 'from-orange-500 to-red-500' },
  { icon: <Star className="w-4 h-4" />, text: 'یه رزومه حرفه‌ای برای من بنویس', color: 'from-green-500 to-emerald-500' },
  { icon: <Zap className="w-4 h-4" />, text: 'چطور با هوش مصنوعی کار کنم؟', color: 'from-yellow-500 to-amber-500' },
  { icon: <Palette className="w-4 h-4" />, text: 'بهترین ابزارهای طراحی UI چیا هستن؟', color: 'from-pink-500 to-rose-500' },
];

export default function WelcomeScreen({ onSuggestion }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl"
      >
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative inline-block mb-8"
        >
          <div className="text-8xl sm:text-9xl">🤖</div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
        >
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            بات باتن
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-lg sm:text-xl mb-2"
        >
          یک دستیار هوش مصنوعی پیشرفته و دوستانه
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 text-sm mb-10"
        >
          با ۴ مدل مختلف • تولید تصویر • پاسخ‌های سریع • ۱۰۰٪ رایگان
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8"
        >
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSuggestion(suggestion.text)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 text-right`}
            >
              <span className={`text-${suggestion.color.split(' ')[0]}`}>
                {suggestion.icon}
              </span>
              <span className="text-gray-300 group-hover:text-white text-sm transition-colors flex-1">
                {suggestion.text}
              </span>
              <Send className="w-3.5 h-3.5 text-gray-600 group-hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100" />
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600"
        >
          <span className="flex items-center gap-1">
            <span className="text-blue-400">⚡</span> پاسخ‌های سریع
          </span>
          <span className="text-gray-700 hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            <span className="text-purple-400">🧠</span> ۴ مدل هوشمند
          </span>
          <span className="text-gray-700 hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            <span className="text-pink-400">🎨</span> تولید تصویر
          </span>
          <span className="text-gray-700 hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            <span className="text-green-400">🔒</span> کاملاً امن
          </span>
          <span className="text-gray-700 hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            <span className="text-yellow-400">🌟</span> ۱۰۰٪ رایگان
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}