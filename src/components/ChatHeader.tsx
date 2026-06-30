import { Menu, Trash2, Sparkles, Image, X, ChevronDown } from 'lucide-react';
import { AI_MODELS } from '../services/ai';

interface ChatHeaderProps {
  onClear: () => void;
  messageCount: number;
  selectedModel: string;
  onSelectModel: (id: string) => void;
  onImageGenerate: () => void;
  onCancel: () => void;
  isStreaming: boolean;
  onToggleSidebar: () => void;
}

export default function ChatHeader({
  onClear,
  messageCount,
  selectedModel,
  onSelectModel,
  onImageGenerate,
  onCancel,
  isStreaming,
  onToggleSidebar,
}: ChatHeaderProps) {
  const currentModel = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0];

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-white/10 rounded-lg transition-all lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-gray-400" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-lg hidden sm:inline">💬</span>
          <span className="text-sm font-medium text-gray-300 hidden sm:inline">
            {messageCount > 0 ? `${messageCount} پیام` : 'گفتگوی جدید'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <select
            value={selectedModel}
            onChange={(e) => onSelectModel(e.target.value)}
            className="appearance-none px-3 py-1.5 pr-8 rounded-xl text-sm bg-white/5 border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer text-gray-300"
          >
            {AI_MODELS.map((model) => (
              <option key={model.id} value={model.id} className="bg-[#1a1a2e]">
                {model.icon} {model.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {isStreaming && (
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">لغو</span>
          </button>
        )}
        <button
          onClick={onImageGenerate}
          className="p-2 hover:bg-white/10 rounded-lg transition-all group"
          title="ساخت تصویر"
        >
          <Image className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
        </button>
        <button
          onClick={onClear}
          className="p-2 hover:bg-white/10 rounded-lg transition-all group"
          title="پاک کردن مکالمه"
        >
          <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
        </button>
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-xs text-gray-500">{currentModel.icon} {currentModel.name}</span>
        </div>
      </div>
    </header>
  );
}