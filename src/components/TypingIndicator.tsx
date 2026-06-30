import { useState, useEffect } from 'react';

export default function TypingIndicator() {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    'در حال فکر کردن...',
    'در حال تحلیل...',
    'در حال پردازش...',
    'در حال نوشتن...',
    'در حال بررسی...',
    'در حال تولید پاسخ...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end gap-3 animate-fadeInUp">
      {/* Bot Avatar with Glow */}
      <div className="relative flex-shrink-0">
        {/* حلقه نئونی دور آواتار */}
        <div 
          className="absolute -inset-1 rounded-2xl blur-md animate-pulse"
          style={{
            background: 'conic-gradient(from 0deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4)',
            opacity: 0.5,
            animation: 'spin 3s linear infinite'
          }}
        />
        <div
          className="relative w-9 h-9 rounded-xl overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            border: '2px solid rgba(255,255,255,0.1)'
          }}
        >
          <img src="/images/bot-avatar.png" alt="bot" className="w-full h-full object-cover" />
        </div>
        {/* وضعیت آنلاین */}
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900 bg-emerald-400 animate-pulse" />
      </div>

      {/* Typing bubble with gradient */}
      <div className="relative">
        {/* سایه و درخشش */}
        <div 
          className="absolute -inset-0.5 rounded-2xl blur-xl opacity-20"
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        />
        
        <div
          className="relative px-5 py-3.5 rounded-2xl rounded-tl-sm flex items-center gap-2"
          style={{ 
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}
        >
          {/* انیمیشن دات‌ها با رنگ‌های مختلف */}
          <div className="flex items-center gap-1.5">
            <span 
              className="w-2.5 h-2.5 rounded-full typing-dot"
              style={{ 
                background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                animationDelay: '0ms'
              }}
            />
            <span 
              className="w-2.5 h-2.5 rounded-full typing-dot"
              style={{ 
                background: 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
                animationDelay: '200ms'
              }}
            />
            <span 
              className="w-2.5 h-2.5 rounded-full typing-dot"
              style={{ 
                background: 'linear-gradient(135deg, #67e8f9, #06b6d4)',
                animationDelay: '400ms'
              }}
            />
          </div>

          {/* جداساز عمودی */}
          <div className="w-px h-5 bg-white/5" />

          {/* متن متغیر */}
          <span 
            className="text-xs text-gray-400 font-medium transition-all duration-500 whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #93c5fd, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {messages[messageIndex]}
          </span>

          {/* خط‌چین‌چین متحرک */}
          <span className="inline-block w-0.5 h-3.5 bg-gradient-to-b from-blue-400 to-purple-400 animate-pulse" />
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
            transform: translateY(-6px) scale(1.2);
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