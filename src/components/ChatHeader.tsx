import ModelSelector from './ModelSelector';

interface Props {
  onClear: () => void;
  messageCount: number;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  onImageGenerate: () => void;
  onCancel?: () => void;
  isStreaming?: boolean;
}

export default function ChatHeader({ onClear, messageCount, selectedModel, onSelectModel, onImageGenerate, onCancel, isStreaming }: Props) {
  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 py-3 flex-wrap gap-2"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,9,20,0.8)', backdropFilter: 'blur(20px)', zIndex: 5 }}
    >
      {/* Left: Bot info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className="w-10 h-10 rounded-xl overflow-hidden animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)' }}
          >
            <img src="/images/bot-avatar.png" alt="BatBaton" className="w-full h-full object-cover" />
          </div>
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900 ${
              isStreaming ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
            }`}
          ></div>
        </div>
        <div>
          <h2 className="text-white font-bold text-base leading-tight" style={{ textShadow: '0 0 20px rgba(99,179,237,0.3)' }}>
            بات باتن
          </h2>
          <p className={`text-xs flex items-center gap-1 ${isStreaming ? 'text-yellow-400' : 'text-green-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${isStreaming ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></span>
            {isStreaming ? 'در حال نوشتن...' : 'آنلاین · قدرت‌گرفته از AI واقعی'}
          </p>
        </div>
      </div>

      {/* Center: Model Selector */}
      <ModelSelector selectedModel={selectedModel} onSelect={onSelectModel} />

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {isStreaming && onCancel && (
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-300 hover:text-red-200 transition-all duration-200 text-xs font-medium animate-fadeInUp"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
            title="توقف تولید"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
            <span className="hidden md:inline">توقف</span>
          </button>
        )}
        <button
          onClick={onImageGenerate}
          className="p-2 rounded-xl text-gray-500 hover:text-purple-400 transition-all duration-200 hidden md:block"
          style={{ background: 'rgba(255,255,255,0.04)' }}
          title="تولید تصویر با AI"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>
        {messageCount > 0 && (
          <span
            className="text-xs text-gray-500 px-2 py-1 rounded-lg hidden md:block"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            {messageCount} پیام
          </span>
        )}
        <button
          onClick={onClear}
          className="p-2 rounded-xl text-gray-500 hover:text-red-400 transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.04)' }}
          title="پاک کردن گفتگو"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </header>
  );
}
