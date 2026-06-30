import { useState, useEffect } from 'react';

export default function TypingIndicator() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const messages = [
    'در حال فکر کردن...',
    'در حال تحلیل...',
    'در حال پردازش...',
    'در حال نوشتن...',
    'در حال بررسی...',
    'در حال تولید پاسخ...'
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-end gap-2 sm:gap-3 animate-fadeInUp ${isMobile ? 'px-2' : ''}`}>
      {/* Bot Avatar with Glow - ریسپانسیو */}
      <div className="relative flex-shrink-0">
        {/* حلقه نئونی - کوچک‌تر در موبایل */}
        <div 
          className={`absolute ${isMobile ? '-inset-0.5' : '-inset-1'} rounded-xl sm:rounded-2xl blur-sm sm:blur-md animate-pulse`}
          style={{
            background: 'conic-gradient(from 0deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4)',
            opacity: 0.5,
            animation: 'spin 3s linear infinite'
          }}
        />
        <div
          className={`relative ${isMobile ? 'w-7 h-7' : 'w-8 h-8 sm:w-9 sm:h-9'} rounded-lg sm:rounded-xl overflow-hidden`}
          style={{ 
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            border: '2px solid rgba(255,255,255,0.1)'
          }}
        >
          <img src="/images/bot-avatar.png" alt="bot" className="w-full h-full object-cover" />
        </div>
        {/* وضعیت آنلاین - کوچک‌تر در موبایل */}
        <div className={`absolute -bottom-0.5 -right-0.5 ${isMobile ? 'w-2 h-2' : 'w-2.5 h-2.5 sm:w-3 sm:h-3'} rounded-full border-2 border-gray-900 bg-emerald-400 animate-pulse`} />
      </div>

      {/* Typing bubble with gradient - ریسپانسیو */}
      <div className="relative max-w-[75%] sm:max-w-full">
        {/* سایه و درخشش - کمتر در موبایل */}
        <div 
          className={`absolute ${isMobile ? '-inset-0.5' : '-inset-0.5 sm:-inset-0.5'} rounded-xl sm:rounded-2xl blur-lg sm:blur-xl opacity-20`}
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        />
        
        <div
          className={`relative ${isMobile ? 'px-3 py-2.5' : 'px-4 sm:px-5 py-3 sm:py-3.5'} rounded-xl sm:rounded-2xl rounded-tl-sm flex items-center gap-1.5 sm:gap-2`}
          style={{ 
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}
        >
          {/* انیمیشن دات‌ها - کوچک‌تر در موبایل */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span 
              className={`${isMobile ? 'w-2 h-2' : 'w-2 sm:w-2.5 h-2 sm:h-2.5'} rounded-full typing-dot`}
              style={{ 
                background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                animationDelay: '0ms'
              }}
            />
            <span 
              className={`${isMobile ? 'w-2 h-2' : 'w-2 sm:w-2.5 h-2 sm:h-2.5'} rounded-full typing-dot`}
              style={{ 
                background: 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
                animationDelay: '200ms'
              }}
            />
            <span 
              className={`${isMobile ? 'w-2 h-2' : 'w-2 sm:w-2.5 h-2 sm:h-2.5'} rounded-full typing-dot`}
              style={{ 
                background: 'linear-gradient(135deg, #67e8f9, #06b6d4)',
                animationDelay: '400ms'
              }}
            />
          </div>

          {/* جداساز عمودی - مخفی در موبایل */}
          {!isMobile && (
            <div className="w-px h-4 sm:h-5 bg-white/5" />
          )}

          {/* متن متغیر - ریسپانسیو */}
          <span 
            className={`${isMobile ? 'text-[10px]' : 'text-[11px] sm:text-xs'} text-gray-400 font-medium transition-all duration-500 ${isMobile ? 'truncate max-w-[100px]' : 'whitespace-nowrap'}`}
            style={{
              background: 'linear-gradient(135deg, #93c5fd, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {isMobile ? messages[messageIndex].replace('...', '') : messages[messageIndex]}
          </span>

          {/* خط‌چین‌چین متحرک - مخفی در موبایل */}
          {!isMobile && (
            <span className="inline-block w-0.5 h-3 sm:h-3.5 bg-gradient-to-b from-blue-400 to-purple-400 animate-pulse" />
          )}
        </div>
      </div>

      {/* استایل‌های انیمیشن */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }
        
        .typing-dot {
          animation: typing 1.4s ease-in-out infinite;
        }
        
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-4px) scale(1.2);
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}