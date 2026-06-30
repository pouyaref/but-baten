import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Loader2, Paperclip, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const text = input.trim();
    if (!text || disabled) return;
    onSend(text);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = Math.min(target.scrollHeight, 200) + 'px';
  };

  return (
    <div className="flex items-end gap-3 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
      <button className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-500 hover:text-gray-300">
        <Paperclip className="w-5 h-5" />
      </button>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="پیام خود را بنویسید..."
        disabled={disabled}
        rows={1}
        className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 outline-none resize-none px-2 py-2 min-h-[44px] max-h-[200px] text-sm sm:text-base"
        style={{ direction: 'rtl' }}
      />
      <button className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-500 hover:text-gray-300">
        <Mic className="w-5 h-5" />
      </button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSend}
        disabled={!input.trim() || disabled}
        className={`
          shrink-0 p-2.5 rounded-xl transition-all duration-200
          ${input.trim() && !disabled
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 shadow-lg shadow-blue-500/25'
            : 'bg-white/5 text-gray-600 cursor-not-allowed'
          }
        `}
      >
        {disabled ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </motion.button>
    </div>
  );
}