import { useState, useRef, KeyboardEvent, useEffect } from 'react';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
  isStreaming?: boolean;
}

export default function ChatInput({ onSend, disabled, isStreaming }: Props) {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  };

  // Auto-focus on mount
  useEffect(() => {
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  }, []);

  return (
    <div 
      className="relative p-3 md:p-4"
      style={{
        background: 'rgba(5, 9, 20, 0.9)',
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
        className={`relative flex items-end gap-2 md:gap-3 p-2 rounded-2xl transition-all duration-300 group ${
          isFocused ? 'ring-2 ring-blue-500/40' : ''
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
        {/* Attach Button with Tooltip */}
        <div className="relative">
          <button
            className="flex-shrink-0 p-2.5 rounded-xl text-gray-500 hover:text-gray-300 transition-all duration-300 group/attach"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
            title="افزودن فایل (به زودی)"
          >
            <svg 
              width="18" 
              height="18" 
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
          {/* Tooltip */}
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

        {/* Textarea with Gradient Scroll */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKey}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={disabled || isStreaming ? 'بات باتن در حال پاسخ‌دهی...' : 'پیامتون رو اینجا بنویسید...'}
            rows={1}
            className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none text-sm leading-relaxed py-2.5 px-1"
            style={{
              maxHeight: '160px',
              direction: 'rtl',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(59,130,246,0.3) transparent'
            }}
          />
          {/* خط‌نما (Cursor) */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 right-0 w-0.5 h-5 bg-blue-400 animate-pulse opacity-0 pointer-events-none"
            style={{ opacity: isFocused && !text ? 1 : 0 }}
          />
        </div>

        {/* Send Button with Gradient */}
        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled || isStreaming}
          className={`flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
            text.trim() && !disabled && !isStreaming
              ? 'hover:scale-105 active:scale-95'
              : 'opacity-40 cursor-not-allowed'
          }`}
          style={{
            background: text.trim() && !disabled && !isStreaming
              ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
              : 'rgba(255,255,255,0.05)',
            boxShadow: text.trim() && !disabled && !isStreaming
              ? '0 0 30px rgba(59,130,246,0.3)'
              : 'none'
          }}
        >
          {/* انیمیشن موج روی دکمه */}
          {text.trim() && !disabled && !isStreaming && (
            <span 
              className="absolute inset-0 rounded-2xl animate-ping opacity-20"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                animationDuration: '1.5s'
              }}
            />
          )}
          <svg 
            width="18" 
            height="18" 
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

      {/* Shortcut Hints */}
      <div className="flex items-center justify-between mt-2 px-1">
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

      {/* استایل برای اسکرول‌بار */}
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
      `}</style>
    </div>
  );
}