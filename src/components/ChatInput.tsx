import { useState, useRef, KeyboardEvent } from 'react';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
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

  return (
    <div className="p-3 md:p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div
        className="flex items-end gap-2 md:gap-3 p-2 rounded-2xl transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: text ? '0 0 30px rgba(59,130,246,0.15)' : '0 0 30px rgba(59,130,246,0.05)',
        }}
      >
        {/* Attach btn */}
        <button
          className="flex-shrink-0 p-2 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all duration-200"
          title="افزودن فایل (به زودی)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKey}
          placeholder={disabled ? 'بات باتن در حال پاسخ‌دهی...' : 'پیامتون رو اینجا بنویسید... (Enter برای ارسال، Shift+Enter برای خط جدید)'}
          rows={1}
          className="flex-1 bg-transparent text-white placeholder-gray-500 resize-none outline-none text-sm leading-relaxed py-2 px-1"
          style={{ maxHeight: '160px', direction: 'rtl' }}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center send-btn"
          title="ارسال"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2 11 13" />
            <path d="M22 2 15 22 11 13 2 9l20-7z" />
          </svg>
        </button>
      </div>

      {/* Hint */}
      <p className="text-center text-gray-600 text-[10px] mt-2 flex items-center justify-center gap-2">
        <span className="inline-block w-1 h-1 rounded-full bg-blue-400 animate-pulse"></span>
        قدرت‌گرفته از مدل‌های OpenAI، Mistral، DeepSeek و Qwen · پاسخ‌های AI ممکنه اشتباه باشن
      </p>
    </div>
  );
}
