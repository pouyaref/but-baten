import { useState, useRef, KeyboardEvent, useEffect } from 'react';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
  isStreaming?: boolean;
}

export default function ChatInput({ onSend, disabled, isStreaming }: Props) {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSend = () => {
    if (!text.trim() || disabled || isStreaming) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  };

  useEffect(() => {
    if (!isMobile) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isMobile]);

  return (
    <div 
      className="relative p-2 sm:p-3 md:p-4"
      style={{
        background: 'rgba(5, 9, 20, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 -4px 30px rgba(0,0,0,0.3)'
      }}
    >
      {/* گرادیانت بالای ورودی */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3), rgba(6,182,212,0.3), transparent)'
        }}
      />

      <div
        className={`relative flex items-end gap-1.5 sm:gap-2 md:gap-3 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl transition-all duration-300 group ${
          isFocused ? 'ring-1 sm:ring-2 ring-blue-500/40' : ''
        }`}
        style={{
          background: isFocused 
            ? 'rgba(255,255,255,0.06)' 
            : 'rgba(255,255,255,0.03)',
          border: `1px solid ${isFocused ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.06)'}`,
          boxShadow: isFocused 
            ? '0 0 40px rgba(59,130,246,0.1), inset 0 0 30px rgba(59,130,246,0.05)' 
            : '0 0 20px rgba(59,130,246,0.02)',
        }}
      >
        {/* Attach Button - مخفی در موبایل */}
        <div className="relative hidden sm:block">
          <button
            className="flex-shrink-0 p-2 sm:p-2.5 rounded-xl text-gray-500 hover:text-gray-300 transition-all duration-300 group/attach"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
            title="افزودن فایل (به زودی)"
          >
            <svg 
              width="16" height="16" sm:width="18" sm:height="18"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="group-hover/attach:rotate-90 transition-transform duration-300"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
          </button>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] rounded-lg opacity-0 group-hover/attach:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none"
            style={{
              background: 'rgba(0,0,0,0.8)',
              color: '#9ca3af',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            افزودن فایل
          </span>
        </div>

        {/* Textarea */}
        <div className="relative flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKey}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={disabled || isStreaming ? 'در حال پاسخ‌دهی...' : isMobile ? 'پیام...' : 'پیامتون رو اینجا بنویسید...'}
            rows={1}
            className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none text-sm leading-relaxed py-2 sm:py-2.5 px-1"
            style={{
              maxHeight: '120px',
              direction: 'rtl',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(59,130,246,0.3) transparent',
              fontSize: isMobile ? '14px' : '15px'
            }}
          />
          {/* خط‌نما */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 right-0 w-0.5 h-4 sm:h-5 bg-blue-400 animate-pulse opacity-0 pointer-events-none"
            style={{ opacity: isFocused && !text ? 1 : 0 }}
          />
        </div>

        {/* Send Button - ریسپانسیو */}
        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled || isStreaming}
          className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
            text.trim() && !disabled && !isStreaming
              ? 'hover:scale-105 active:scale-95'
              : 'opacity-40 cursor-not-allowed'
          }`}
          style={{
            background: text.trim() && !disabled && !isStreaming
              ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
              : 'rgba(255,255,255,0.05)',
            boxShadow: text.trim() && !disabled && !isStreaming
              ? '0 0 20px rgba(59,130,246,0.3)'
              : 'none'
          }}
        >
          {text.trim() && !disabled && !isStreaming && (
            <span 
              className="absolute inset-0 rounded-xl sm:rounded-2xl animate-ping opacity-20"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                animationDuration: '1.5s'
              }}
            />
          )}
          <svg 
            width="16" height="16" sm:width="18" sm:height="18"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={`relative transition-transform duration-300 ${
              text.trim() && !disabled && !isStreaming ? 'translate-x-0' : ''
            }`}
          >
            <path d="M22 2 11 13" />
            <path d="M22 2 15 22 11 13 2 9l20-7z" />
          </svg>
        </button>
      </div>

      {/* Shortcut Hints - مخفی در موبایل */}
      <div className="hidden sm:flex items-center justify-between mt-2 px-1">
        <div className="flex items-center gap-3">
          <span className="text-gray-600 text-[10px] flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded text-[9px] font-mono"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.05)',
                color: '#6b7280'
              }}
            >
              Enter
            </kbd>
            <span>ارسال</span>
          </span>
          <span className="text-gray-600 text-[10px] flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded text-[9px] font-mono"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.05)',
                color: '#6b7280'
              }}
            >
              Shift
            </kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 rounded text-[9px] font-mono"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.05)',
                color: '#6b7280'
              }}
            >
              Enter
            </kbd>
            <span>خط جدید</span>
          </span>
        </div>
        
        {/* Status Indicator */}
        {(disabled || isStreaming) && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-yellow-400/60 text-[10px] font-medium">
              {isStreaming ? 'در حال پاسخ‌دهی...' : 'در حال پردازش...'}
            </span>
          </div>
        )}
      </div>

      {/* استایل اسکرول‌بار */}
      <style>{`
        textarea::-webkit-scrollbar {
          width: 3px;
        }
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        textarea::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 10px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
        
        @media (max-width: 640px) {
          textarea {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}