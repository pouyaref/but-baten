import ModelSelector from './ModelSelector';
import { useState } from 'react';

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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header
      className="relative flex items-center justify-between px-4 md:px-8 py-4 flex-wrap gap-3"
      style={{
        background: 'rgba(10, 14, 30, 0.85)',
        backdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
        zIndex: 50
      }}
    >
      {/* پس‌زمینه گرادیانت متحرک */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 0% 50%, rgba(59,130,246,0.1), transparent 50%), radial-gradient(circle at 100% 50%, rgba(6,182,212,0.1), transparent 50%)',
        }}
      />

      {/* Left: Bot info with Neon Glow */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="relative group">
          {/* حلقه نئونی اطراف آواتار */}
          <div 
            className="absolute -inset-1 rounded-2xl opacity-75 blur-md transition-all duration-500 group-hover:opacity-100"
            style={{
              background: 'conic-gradient(from 0deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4)',
              animation: 'spin 4s linear infinite'
            }}
          />
          <div
            className="relative w-12 h-12 rounded-2xl overflow-hidden"
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
          {/* Status dot */}
          <div
            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-gray-900 transition-all duration-300 ${
              isStreaming ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400'
            }`}
            style={{
              boxShadow: isStreaming 
                ? '0 0 20px rgba(250,204,21,0.5)' 
                : '0 0 20px rgba(52,211,153,0.5)'
            }}
          />
        </div>

        <div>
          <h2 
            className="text-white font-bold text-lg leading-tight tracking-wide"
            style={{
              textShadow: '0 0 30px rgba(99,179,237,0.2), 0 0 60px rgba(99,179,237,0.1)'
            }}
          >
            بات باتن
            <span className="ml-2 text-xs font-normal text-gray-400">v3.0</span>
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full inline-block transition-all duration-300 ${
              isStreaming ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400'
            }`} />
            <p className={`text-xs font-medium transition-all duration-300 ${
              isStreaming ? 'text-yellow-400' : 'text-emerald-400'
            }`}>
              {isStreaming ? 'در حال تایپ...' : '● آنلاین · AI واقعی'}
            </p>
          </div>
        </div>
      </div>

      {/* Center: Model Selector with Glassmorphism */}
      <div className="relative z-10 flex items-center">
        <div 
          className="px-3 py-1.5 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <ModelSelector selectedModel={selectedModel} onSelect={onSelectModel} />
        </div>
      </div>

      {/* Right: Actions with Modern Design */}
      <div className="flex items-center gap-2 relative z-10">
        {/* Cancel Button */}
        {isStreaming && onCancel && (
          <button
            onClick={onCancel}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-red-300 hover:text-white transition-all duration-300 text-xs font-bold animate-fadeInUp overflow-hidden group"
            style={{
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <span 
              className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="relative">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            <span className="relative hidden sm:inline">توقف</span>
          </button>
        )}

        {/* Image Generate Button */}
        <button
          onClick={onImageGenerate}
          className="relative p-2.5 rounded-2xl text-gray-400 hover:text-purple-400 transition-all duration-300 group overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)'
          }}
          title="تولید تصویر با AI"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <svg 
            width="18" 
            height="18" 
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

        {/* Message Count Badge */}
        {messageCount > 0 && (
          <div 
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl text-gray-400 text-xs font-medium"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <span className="text-emerald-400">{messageCount}</span>
            <span>پیام</span>
          </div>
        )}

        {/* Clear Chat Button */}
        <button
          onClick={onClear}
          className="relative p-2.5 rounded-2xl text-gray-400 hover:text-red-400 transition-all duration-300 group overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)'
          }}
          title="پاک کردن گفتگو"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <svg 
            width="18" 
            height="18" 
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

      {/* انیمیشن CSS برای چرخش */}
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
      `}</style>
    </header>
  );
}