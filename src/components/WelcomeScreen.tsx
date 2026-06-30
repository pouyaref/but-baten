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
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  const words = [
    'کدنویسی',
    'یادگیری',
    'خلاقیت',
    'مسئله‌ها',
    'ایده‌ها',
    'پروژه‌ها'
  ];

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

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

  const getAvatarSize = () => {
    if (isMobile) return 'w-20 h-20';
    if (isTablet) return 'w-24 h-24';
    return 'w-28 h-28';
  };

  const getTitleSize = () => {
    if (isMobile) return 'text-2xl';
    if (isTablet) return 'text-3xl';
    return 'text-4xl md:text-6xl';
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 text-center overflow-y-auto">
      {/* آواتار با حلقه‌های نئونی - ریسپانسیو */}
      <div className="relative mb-4 sm:mb-6 md:mb-8 animate-float">
        {/* حلقه بیرونی - کوچک‌تر در موبایل */}
        <div 
          className={`absolute ${isMobile ? '-inset-4' : '-inset-5 sm:-inset-6'} rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl animate-pulse`}
          style={{
            background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)',
            opacity: 0.3,
            animation: 'spin 6s linear infinite'
          }}
        />
        
        {/* حلقه میانی - کوچک‌تر در موبایل */}
        <div 
          className={`absolute ${isMobile ? '-inset-2' : '-inset-2 sm:-inset-3'} rounded-xl sm:rounded-2xl blur-lg sm:blur-xl animate-pulse`}
          style={{
            background: 'conic-gradient(from 180deg, #8b5cf6, #06b6d4, #3b82f6, #8b5cf6)',
            opacity: 0.2,
            animation: 'spin 8s linear infinite reverse'
          }}
        />
        
        <div
          className={`relative ${getAvatarSize()} rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-105`}
          style={{ 
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
            boxShadow: '0 0 40px rgba(59,130,246,0.3)'
          }}
        >
          <img src="/images/bot-avatar.png" alt="BatBaton" className="w-full h-full object-cover" />
        </div>
        
        {/* نشانگر آنلاین - ریسپانسیو */}
        <div className={`absolute ${isMobile ? '-bottom-0.5 -right-0.5' : '-bottom-1 -right-1'}`}>
          <div className={`absolute ${isMobile ? '-inset-0.5' : '-inset-1'} rounded-full blur-sm sm:blur-md bg-emerald-400 animate-pulse`} />
          <div className={`relative ${isMobile ? 'w-3.5 h-3.5' : 'w-4 sm:w-5 h-4 sm:h-5'} rounded-full bg-emerald-400 border-2 border-gray-900 flex items-center justify-center`}>
            <span className={`${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full bg-green-300 animate-pulse`} />
          </div>
        </div>
      </div>

      {/* عنوان - ریسپانسیو */}
      <h1 className={`${getTitleSize()} font-bold mb-2 sm:mb-3 md:mb-4`} style={{ textShadow: '0 0 30px rgba(99,179,237,0.2)' }}>
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

      {/* زیرنویس با تایپینگ افکت - ریسپانسیو */}
      <div className="h-6 sm:h-7 md:h-8 mb-3 sm:mb-4">
        <p className={`text-xs sm:text-sm md:text-base text-gray-400 ${isMobile ? 'px-2' : ''}`}>
          <span className="text-blue-400">✨</span> آماده‌ام برای{' '}
          <span className="font-bold text-transparent bg-clip-text" style={{
            background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {typedText}
          </span>
          <span className={`inline-block ${isMobile ? 'w-0.5 h-3' : 'w-0.5 h-4 sm:h-5'} ml-0.5 bg-blue-400 animate-pulse`} />
        </p>
      </div>

      {/* Feature Pills - ریسپانسیو */}
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 md:mb-8 px-1">
        {[
          { icon: '⚡', label: isMobile ? 'AI' : 'AI واقعی', color: '#3b82f6' },
          { icon: '🧠', label: isMobile ? 'هوشمند' : 'هوشمند', color: '#8b5cf6' },
          { icon: '💻', label: isMobile ? 'کد' : 'کدنویسی', color: '#06b6d4' },
          { icon: '🎨', label: isMobile ? 'خلاق' : 'خلاق', color: '#ec4899' },
          { icon: '🌐', label: isMobile ? 'چندزبان' : 'چندزبانه', color: '#f59e0b' },
          { icon: '📊', label: isMobile ? 'دقیق' : 'دقیق', color: '#10b981' },
        ].map((feat, index) => (
          <span
            key={feat.label}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1 sm:gap-1.5 cursor-default`}
            style={{
              background: `rgba(${parseInt(feat.color.slice(1,3), 16)}, ${parseInt(feat.color.slice(3,5), 16)}, ${parseInt(feat.color.slice(5,7), 16)}, 0.1)`,
              border: `1px solid ${feat.color}30`,
              color: feat.color,
              animationDelay: `${index * 100}ms`
            }}
          >
            <span className="animate-pulse text-[10px] sm:text-sm">{feat.icon}</span>
            <span className="hidden xs:inline">{feat.label}</span>
          </span>
        ))}
      </div>

      {/* Suggestions Grid - ریسپانسیو */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 w-full max-w-5xl px-1">
        {categories.map((cat) => {
          const isHovered = hoveredCategory === cat.id;
          
          return (
            <div
              key={cat.id}
              className="relative p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl text-right transition-all duration-300 overflow-hidden"
              onMouseEnter={() => setHoveredCategory(cat.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              style={{
                background: isHovered 
                  ? `rgba(${parseInt(cat.color.slice(1,3), 16)}, ${parseInt(cat.color.slice(3,5), 16)}, ${parseInt(cat.color.slice(5,7), 16)}, 0.08)`
                  : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isHovered ? cat.color + '40' : 'rgba(255,255,255,0.06)'}`,
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isHovered ? `0 4px 20px rgba(0,0,0,0.3)` : 'none'
              }}
            >
              {isHovered && (
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${cat.color}, transparent 70%)`
                  }}
                />
              )}
              
              {/* هدر دسته‌بندی - ریسپانسیو */}
              <div className="relative flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                <span className={`text-lg sm:text-2xl ${isMobile ? 'text-base' : ''}`}>{cat.icon}</span>
                <h3 className={`${isMobile ? 'text-[10px]' : 'text-xs sm:text-sm'} text-white font-bold`}>
                  {cat.title}
                </h3>
                <div 
                  className="flex-1 h-px"
                  style={{
                    background: `linear-gradient(90deg, ${cat.color}40, transparent)`
                  }}
                />
              </div>

              {/* آیتم‌های پیشنهادی - ریسپانسیو */}
              <div className="relative space-y-1 sm:space-y-1.5">
                {cat.items.slice(0, isMobile ? 2 : 4).map((item) => (
                  <button
                    key={item}
                    onClick={() => onSuggestion(item)}
                    className="w-full text-right px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 group/suggestion flex items-center justify-between"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      color: isHovered ? '#d1d5db' : '#9ca3af',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.background = `rgba(${parseInt(cat.color.slice(1,3), 16)}, ${parseInt(cat.color.slice(3,5), 16)}, ${parseInt(cat.color.slice(5,7), 16)}, 0.1)`;
                      el.style.color = '#ffffff';
                      el.style.transform = 'translateX(-2px)';
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
                    <span className="opacity-0 group-hover/suggestion:opacity-100 transition-opacity duration-200 text-[10px] sm:text-xs">
                      ←
                    </span>
                    <span className={`flex-1 text-right ${isMobile ? 'text-[10px]' : 'text-[11px] sm:text-xs'} line-clamp-2`}>
                      {item}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* آمار و اطلاعات پایین - ریسپانسیو */}
      <div className="mt-4 sm:mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-[9px] sm:text-xs text-gray-600">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>آنلاین</span>
        </div>
        <div className="w-px h-3 bg-white/5 hidden xs:block" />
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span>🤖</span>
          <span className="hidden xs:inline">پاسخ‌های هوشمند</span>
          <span className="xs:hidden">هوشمند</span>
        </div>
        <div className="w-px h-3 bg-white/5 hidden xs:block" />
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span>⚡</span>
          <span className="hidden xs:inline">سرعت بالا</span>
          <span className="xs:hidden">سرعت</span>
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

        @media (max-width: 480px) {
          .xs\\:inline {
            display: inline !important;
          }
          .xs\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}