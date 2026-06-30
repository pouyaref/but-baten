interface Props {
  onSuggestion: (text: string) => void;
}

const categories = [
  {
    title: '💻 برنامه‌نویسی',
    items: [
      'یک تابع JavaScript بنویس که آرایه را مرتب کند و توضیح بده',
      'تفاوت let و const و var در JavaScript چیست؟ با مثال',
      'یک API با Node.js و Express بساز و توضیح بده',
    ],
  },
  {
    title: '✍️ نوشتن خلاقانه',
    items: [
      'یک داستان کوتاه علمی-تخیلی درباره سفر در زمان بنویس',
      'یک شعر زیبا درباره بهار بنویس',
      'یک ایمیل حرفه‌ای برای درخواست کار بنویس',
    ],
  },
  {
    title: '🧠 یادگیری',
    items: [
      'فیزیک کوانتوم را ساده توضیح بده',
      'تاریخچه هوش مصنوعی را خلاصه کن',
      'مفهوم بلاک‌چین را توضیح بده',
    ],
  },
  {
    title: '🎯 حل مسئله',
    items: [
      'یک معادله درجه دوم را حل کن: x² + 5x + 6 = 0',
      'چطور می‌توانم بهره‌وری ام را افزایش دهم؟',
      'یک برنامه 30 روزه برای یادگیری برنامه‌نویسی بساز',
    ],
  },
];

export default function WelcomeScreen({ onSuggestion }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center overflow-y-auto">
      {/* Bot Avatar with glow */}
      <div className="relative mb-6 animate-float">
        <div
          className="w-24 h-24 rounded-3xl overflow-hidden animate-pulse-glow"
          style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6,#8b5cf6)' }}
        >
          <img src="/images/bot-avatar.png" alt="BatBaton" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-green-400 border-2 border-gray-900 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ textShadow: '0 0 30px rgba(99,179,237,0.3)' }}>
        سلام! من{' '}
        <span
          className="animate-gradient"
          style={{
            background: 'linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4,#3b82f6)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          بات باتن
        </span>{' '}
        هستم
      </h1>
      <p className="text-gray-400 text-base mb-3 max-w-xl leading-relaxed">
        دستیار هوشمند شما با قدرت AI واقعی 🚀 هر سوال، هر موضوع، هر کدی رو می‌تونم کمک کنم.
      </p>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { icon: '⚡', label: 'AI واقعی' },
          { icon: '🧠', label: 'هوشمند' },
          { icon: '💻', label: 'کدنویسی' },
          { icon: '🎨', label: 'خلاق' },
          { icon: '🌐', label: 'چندزبانه' },
          { icon: '📊', label: 'دقیق' },
        ].map((feat) => (
          <span
            key={feat.label}
            className="px-3 py-1 rounded-full text-xs font-medium text-blue-300 flex items-center gap-1"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            {feat.icon} {feat.label}
          </span>
        ))}
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {categories.map((cat) => (
          <div
            key={cat.title}
            className="p-4 rounded-2xl text-right"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <h3 className="text-white font-bold mb-3 text-sm">{cat.title}</h3>
            <div className="space-y-2">
              {cat.items.map((item) => (
                <button
                  key={item}
                  onClick={() => onSuggestion(item)}
                  className="w-full text-right px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.1)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                  }}
                >
                  ← {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom hint */}
      <div className="mt-8 text-xs text-gray-600 flex items-center gap-2">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        قدرت‌گرفته از مدل‌های AI پیشرفته OpenAI، Mistral، DeepSeek و Qwen
      </div>
    </div>
  );
}
