import { useState, useEffect } from 'react';

interface Props {
  onSuggestion: (text: string) => void;
}

const categories = [
  {
    id: 'programming',
    icon: '💻',
    title: 'برنامه‌نویسی',
    color: '#3b82f6',
    items: [
      'یک تابع JavaScript بنویس که آرایه را مرتب کند و توضیح بده',
      'تفاوت let و const و var در JavaScript چیست؟ با مثال',
      'یک API با Node.js و Express بساز و توضیح بده',
      'الگوریتم جستجوی دودویی را توضیح بده با کد',
    ],
  },
  {
    id: 'writing',
    icon: '✍️',
    title: 'نوشتن خلاقانه',
    color: '#8b5cf6',
    items: [
      'یک داستان کوتاه علمی-تخیلی درباره سفر در زمان بنویس',
      'یک شعر زیبا درباره بهار بنویس',
      'یک ایمیل حرفه‌ای برای درخواست کار بنویس',
      'یک مقاله درباره تاثیر AI روی آینده بنویس',
    ],
  },
  {
    id: 'learning',
    icon: '🧠',
    title: 'یادگیری',
    color: '#06b6d4',
    items: [
      'فیزیک کوانتوم را ساده توضیح بده',
      'تاریخچه هوش مصنوعی را خلاصه کن',
      'مفهوم بلاک‌چین را توضیح بده',
      'سیستم عامل را به زبان ساده توضیح بده',
    ],
  },
  {
    id: 'problem',
    icon: '🎯',
    title: 'حل مسئله',
    color: '#f59e0b',
    items: [
      'یک معادله درجه دوم را حل کن: x² + 5x + 6 = 0',
      'چطور می‌توانم بهره‌وری ام را افزایش دهم؟',
      'یک برنامه 30 روزه برای یادگیری برنامه‌نویسی بساز',
      'چگونه استرس را مدیریت کنیم؟',
    ],
  },
];

export default function WelcomeScreen({ onSuggestion }: Props) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [typedText, setTypedText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const words = [
    'کدنویسی',
    'یادگیری',
    'خلاقیت',
    'مسئله‌ها',
    'ایده‌ها',
    'پروژه‌ها'
  ];

  // تایپینگ افکت برای زیرنویس
  useEffect(() => {
    const currentWord = words[wordIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (typedText.length < currentWord.length) {
          setTypedText(currentWord.slice(0, typedText.length + 1));
        } else {
          setIsDeleting(true);
          setTimeout(() => {}, 1500);
        }
      } else {
        if (typedText.length > 0) {
          setTypedText(currentWord.slice(0, typedText.length - 1));
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, wordIndex]);

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 md:px-8 py-8 text-center overflow-y-auto">
      {/* آواتار با حلقه‌های نئونی متعدد */}
      <div className="relative mb-8 animate-float">
        {/* حلقه بیرونی */}
        <div 
          className="absolute -inset-6 rounded-3xl blur-2xl animate-pulse"
          style={{
            background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)',
            opacity: 0.3,
            animation: 'spin 6s linear infinite'
          }}
        />
        
        {/* حلقه میانی */}
        <div 
          className="absolute -inset-3 rounded-2xl blur-xl animate-pulse"
          style={{
            background: 'conic-gradient(from 180deg, #8b5cf6, #06b6d4, #3b82f6, #8b5cf6)',
            opacity: 0.2,
            animation: 'spin 8s linear infinite reverse'
          }}
        />
        
        <div
          className="relative w-28 h-28 rounded-3xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-105"
          style={{ 
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
            boxShadow: '0 0 60px rgba(59,130,246,0.3)'
          }}
        >
          <img src="/images/bot-avatar.png" alt="BatBaton" className="w-full h-full object-cover" />
        </div>
        
        {/* نشانگر آنلاین با هاله */}
        <div className="absolute -bottom-1 -right-1">
          <div className="absolute -inset-1 rounded-full blur-md bg-green-400 animate-pulse" />
          <div className="relative w-5 h-5 rounded-full bg-emerald-400 border-2 border-gray-900 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
          </div>
        </div>
      </div>

      {/* عنوان با گرادیانت متحرک */}
      <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ textShadow: '0 0 30px rgba(99,179,237,0.2)' }}>
        <span className="text-white">سلام! من </span>
        <span
          className="animate-gradient bg-clip-text text-transparent"
          style={{
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)',
            backgroundSize: '300% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          بات باتن
        </span>
        <span className="text-white"> هستم</span>
      </h1>

      {/* زیرنویس با تایپینگ افکت */}
      <div className="h-8 mb-4">
        <p className="text-gray-400 text-base md:text-lg">
          <span className="text-blue-400">✨</span> آماده‌ام برای{' '}
          <span className="font-bold text-transparent bg-clip-text" style={{
            background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {typedText}
          </span>
          <span className="inline-block w-0.5 h-5 ml-0.5 bg-blue-400 animate-pulse" />
        </p>
      </div>

      {/* Feature Pills با آیکون‌های متحرک */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { icon: '⚡', label: 'AI واقعی', color: '#3b82f6' },
          { icon: '🧠', label: 'هوشمند', color: '#8b5cf6' },
          { icon: '💻', label: 'کدنویسی', color: '#06b6d4' },
          { icon: '🎨', label: 'خلاق', color: '#ec4899' },
          { icon: '🌐', label: 'چندزبانه', color: '#f59e0b' },
          { icon: '📊', label: 'دقیق', color: '#10b981' },
        ].map((feat, index) => (
          <span
            key={feat.label}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1.5 cursor-default"
            style={{
              background: `rgba(${parseInt(feat.color.slice(1,3), 16)}, ${parseInt(feat.color.slice(3,5), 16)}, ${parseInt(feat.color.slice(5,7), 16)}, 0.1)`,
              border: `1px solid ${feat.color}30`,
              color: feat.color,
              animationDelay: `${index * 100}ms`
            }}
          >
            <span className="animate-pulse">{feat.icon}</span>
            {feat.label}
          </span>
        ))}
      </div>

      {/* Suggestions Grid با کارت‌های تعاملی */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl">
        {categories.map((cat) => {
          const isHovered = hoveredCategory === cat.id;
          
          return (
            <div
              key={cat.id}
              className="relative p-4 rounded-2xl text-right transition-all duration-300 overflow-hidden"
              onMouseEnter={() => setHoveredCategory(cat.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              style={{
                background: isHovered 
                  ? `rgba(${parseInt(cat.color.slice(1,3), 16)}, ${parseInt(cat.color.slice(3,5), 16)}, ${parseInt(cat.color.slice(5,7), 16)}, 0.08)`
                  : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isHovered ? cat.color + '40' : 'rgba(255,255,255,0.06)'}`,
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isHovered ? `0 8px 30px rgba(0,0,0,0.3)` : 'none'
              }}
            >
              {/* پس‌زمینه گرادیانت در هاور */}
              {isHovered && (
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${cat.color}, transparent 70%)`
                  }}
                />
              )}
              
              {/* هدر دسته‌بندی */}
              <div className="relative flex items-center gap-2 mb-3">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="text-white font-bold text-sm">
                  {cat.title}
                </h3>
                <div 
                  className="flex-1 h-px"
                  style={{
                    background: `linear-gradient(90deg, ${cat.color}40, transparent)`
                  }}
                />
              </div>

              {/* آیتم‌های پیشنهادی */}
              <div className="relative space-y-1.5">
                {cat.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => onSuggestion(item)}
                    className="w-full text-right px-3 py-2 rounded-lg text-xs transition-all duration-200 group/suggestion flex items-center justify-between"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      color: isHovered ? '#d1d5db' : '#9ca3af',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.background = `rgba(${parseInt(cat.color.slice(1,3), 16)}, ${parseInt(cat.color.slice(3,5), 16)}, ${parseInt(cat.color.slice(5,7), 16)}, 0.1)`;
                      el.style.color = '#ffffff';
                      el.style.transform = 'translateX(-4px)';
                      el.style.borderColor = cat.color + '30';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.background = 'rgba(255,255,255,0.02)';
                      el.style.color = isHovered ? '#d1d5db' : '#9ca3af';
                      el.style.transform = 'translateX(0)';
                      el.style.borderColor = 'transparent';
                    }}
                    style={{ border: '1px solid transparent' }}
                  >
                    <span className="opacity-0 group-hover/suggestion:opacity-100 transition-opacity duration-200">
                      ←
                    </span>
                    <span className="flex-1 text-right">{item}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* آمار و اطلاعات پایین */}
      <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>آنلاین</span>
        </div>
        <div className="w-px h-3 bg-white/5" />
        <div className="flex items-center gap-1.5">
          <span>🤖</span>
          <span>پاسخ‌های هوشمند</span>
        </div>
        <div className="w-px h-3 bg-white/5" />
        <div className="flex items-center gap-1.5">
          <span>⚡</span>
          <span>سرعت بالا</span>
        </div>
      </div>

      {/* استایل‌های انیمیشن */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 300% auto;
          animation: gradient 3s ease infinite;
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}