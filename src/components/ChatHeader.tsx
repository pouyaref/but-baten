import ModelSelector from './ModelSelector';
import { useState, useEffect } from 'react';

interface Props {
  onClear: () => void;
  messageCount: number;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  onImageGenerate: () => void;
  onCancel?: () => void;
  isStreaming?: boolean;
}

export default function ChatHeader({ 
  onClear, 
  messageCount, 
  selectedModel, 
  onSelectModel, 
  onImageGenerate, 
  onCancel, 
  isStreaming 
}: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return (
    <header
      className="relative flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-4 gap-2 sm:gap-3"
      style={{
        background: 'rgba(10, 14, 30, 0.85)',
        backdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
        zIndex: 50,
        minHeight: '60px'
      }}
    >
      {/* پس‌زمینه گرادیانت متحرک */}
      <div 
        className="absolute inset-0 opacity-20 sm:opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 0% 50%, rgba(59,130,246,0.1), transparent 50%), radial-gradient(circle at 100% 50%, rgba(6,182,212,0.1), transparent 50%)',
        }}
      />

      {/* Left: Bot info - ریسپانسیو */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 relative z-10 flex-shrink-0">
        <div className="relative group">
          {/* حلقه نئونی - کوچک‌تر در موبایل */}
          <div 
            className="absolute -inset-0.5 sm:-inset-1 rounded-xl sm:rounded-2xl opacity-60 sm:opacity-75 blur-sm sm:blur-md transition-all duration-500 group-hover:opacity-100"
            style={{
              background: 'conic-gradient(from 0deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4)',
              animation: 'spin 4s linear infinite'
            }}
          />
          <div
            className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              border: '2px solid rgba(255,255,255,0.1)'
            }}
          >
            <img 
              src="/images/bot-avatar.png" 
              alt="BatBaton" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Status dot - کوچک‌تر در موبایل */}
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 rounded-full border-2 border-gray-900 transition-all duration-300 ${
              isStreaming ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400'
            }`}
            style={{
              boxShadow: isStreaming 
                ? '0 0 15px rgba(250,204,21,0.4)' 
                : '0 0 15px rgba(52,211,153,0.4)'
            }}
          />
        </div>

        <div>
          <h2 
            className="text-white font-bold text-sm sm:text-base md:text-lg leading-tight tracking-wide flex items-center flex-wrap gap-1"
            style={{
              textShadow: '0 0 30px rgba(99,179,237,0.2)'
            }}
          >
            بات باتن
            <span className="text-[10px] sm:text-xs font-normal text-gray-400">v3.0</span>
          </h2>
          <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
            <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full inline-block transition-all duration-300 ${
              isStreaming ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400'
            }`} />
            <p className={`text-[10px] sm:text-xs font-medium transition-all duration-300 truncate ${
              isStreaming ? 'text-yellow-400' : 'text-emerald-400'
            }`}>
              {isStreaming ? 'در حال تایپ...' : isMobile ? 'آنلاین' : '● آنلاین · AI واقعی'}
            </p>
          </div>
        </div>
      </div>

      {/* Center: Model Selector - مخفی در موبایل، نمایش در تبلت و دسکتاپ */}
      <div className="hidden sm:flex relative z-10 items-center flex-shrink-0">
        <div 
          className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <ModelSelector selectedModel={selectedModel} onSelect={onSelectModel} />
        </div>
      </div>

      {/* Right: Actions - ریسپانسیو */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 relative z-10 flex-shrink-0">
        {/* Cancel Button - ریسپانسیو */}
        {isStreaming && onCancel && (
          <button
            onClick={onCancel}
            className="relative flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-xl sm:rounded-2xl text-red-300 hover:text-white transition-all duration-300 text-[10px] sm:text-xs font-bold animate-fadeInUp overflow-hidden group"
            style={{
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <span 
              className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <svg width="12" height="12" sm:width="14" sm:height="14" viewBox="0 0 24 24" fill="currentColor" className="relative flex-shrink-0">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            <span className="relative hidden xs:inline">توقف</span>
          </button>
        )}

        {/* Image Generate Button - ریسپانسیو */}
        <button
          onClick={onImageGenerate}
          className="relative p-1.5 sm:p-2 md:p-2.5 rounded-xl sm:rounded-2xl text-gray-400 hover:text-purple-400 transition-all duration-300 group overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)'
          }}
          title="تولید تصویر با AI"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <svg 
            width="16" height="16" sm:width="18" sm:height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="relative group-hover:scale-110 transition-transform duration-300"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>

        {/* Message Count Badge - مخفی در موبایل */}
        {messageCount > 0 && (
          <div 
            className="hidden sm:flex items-center gap-1.5 md:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl text-gray-400 text-[10px] sm:text-xs font-medium"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <span className="text-emerald-400">{messageCount}</span>
            <span className="hidden md:inline">پیام</span>
          </div>
        )}

        {/* Clear Chat Button - ریسپانسیو */}
        <button
          onClick={onClear}
          className="relative p-1.5 sm:p-2 md:p-2.5 rounded-xl sm:rounded-2xl text-gray-400 hover:text-red-400 transition-all duration-300 group overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)'
          }}
          title="پاک کردن گفتگو"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <svg 
            width="16" height="16" sm:width="18" sm:height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="relative group-hover:scale-110 transition-transform duration-300"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>

      {/* انیمیشن CSS */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out;
        }
        
        @media (max-width: 380px) {
          .xs\\:inline {
            display: inline !important;
          }
        }
      `}</style>
    </header>
  );
}