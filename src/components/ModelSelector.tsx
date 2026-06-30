import { useState, useRef, useEffect } from 'react';
import { AI_MODELS, AIModel } from '../services/ai';

interface Props {
  selectedModel: string;
  onSelect: (modelId: string) => void;
}

export default function ModelSelector({ selectedModel, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getModelColor = (modelId: string) => {
    const colors: Record<string, string> = {
      openai: '#3b82f6',
      mistral: '#8b5cf6',
      deepseek: '#06b6d4',
      'qwen-coder': '#f59e0b'
    };
    return colors[modelId] || '#3b82f6';
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
        style={{
          background: 'rgba(59,130,246,0.08)',
          border: '1px solid rgba(59,130,246,0.15)',
          boxShadow: open ? '0 0 30px rgba(59,130,246,0.1)' : 'none'
        }}
      >
        {/* مدل آیکون با حلقه - ریسپانسیو */}
        <div className="relative">
          <div 
            className="w-2 h-2 sm:w-2.5 rounded-full animate-pulse"
            style={{ 
              background: `radial-gradient(circle, ${getModelColor(current.id)}, ${getModelColor(current.id)}80)`,
              boxShadow: `0 0 8px ${getModelColor(current.id)}50`
            }}
          />
          <div 
            className="absolute -inset-1 rounded-full blur-sm animate-pulse"
            style={{ 
              background: getModelColor(current.id),
              opacity: 0.2
            }}
          />
        </div>
        
        <span className="text-[10px] sm:text-xs text-blue-300 font-bold tracking-wide whitespace-nowrap">
          {current.icon} {isMobile ? '' : current.name}
        </span>
        
        {/* فلش با انیمیشن */}
        <svg 
          width="10" height="10" sm:width="12" sm:height="12"
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          className="text-blue-400 transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <path d={open ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute top-full mt-1 sm:mt-2 ${isMobile ? 'right-0 w-[85vw] max-w-[320px]' : 'left-0 w-72'} rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl animate-fadeInUp`}
          style={{
            background: 'rgba(10,15,31,0.97)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(99,179,237,0.1)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
            zIndex: 100,
          }}
        >
          {/* هدر با گرادیانت - ریسپانسیو */}
          <div className="relative px-3 sm:px-4 py-2 sm:py-3" style={{ 
            borderBottom: '1px solid rgba(99,179,237,0.06)',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(139,92,246,0.05))'
          }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-gray-500 font-bold flex items-center gap-1.5 sm:gap-2">
                <svg width="12" height="12" sm:width="14" sm:height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <span className={isMobile ? 'hidden' : 'inline'}>مدل‌های هوش مصنوعی</span>
                <span className={isMobile ? 'inline' : 'hidden'}>مدل‌ها</span>
              </span>
              <span className="text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-mono">
                {AI_MODELS.length}
              </span>
            </div>
          </div>

          {/* لیست مدل‌ها - ریسپانسیو */}
          <div className="p-1 sm:p-1.5 max-h-64 sm:max-h-80 overflow-y-auto" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(59,130,246,0.2) transparent'
          }}>
            {AI_MODELS.map((model: AIModel) => {
              const isSelected = selectedModel === model.id;
              const isHovered = hoveredModel === model.id;
              const color = getModelColor(model.id);

              return (
                <button
                  key={model.id}
                  onClick={() => { onSelect(model.id); setOpen(false); }}
                  onMouseEnter={() => setHoveredModel(model.id)}
                  onMouseLeave={() => setHoveredModel(null)}
                  className={`relative w-full text-right px-2 sm:px-3 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl transition-all duration-300 group/model ${
                    isSelected ? 'scale-[1.02]' : ''
                  }`}
                  style={{
                    background: isSelected 
                      ? `rgba(${parseInt(color.slice(1,3), 16)}, ${parseInt(color.slice(3,5), 16)}, ${parseInt(color.slice(5,7), 16)}, 0.12)`
                      : isHovered
                      ? 'rgba(255,255,255,0.03)'
                      : 'transparent',
                    border: isSelected 
                      ? `1px solid ${color}30`
                      : '1px solid transparent',
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  {isHovered && !isSelected && (
                    <div 
                      className="absolute inset-0 rounded-lg sm:rounded-xl opacity-20"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${color}20, transparent 70%)`
                      }}
                    />
                  )}

                  {isSelected && (
                    <div 
                      className="absolute inset-0 rounded-lg sm:rounded-xl blur-xl opacity-30"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${color}, transparent 70%)`
                      }}
                    />
                  )}

                  {/* آیکون با حلقه - ریسپانسیو */}
                  <div className="relative flex-shrink-0">
                    <div 
                      className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-xl transition-transform duration-300 group-hover/model:scale-110"
                      style={{
                        background: isSelected 
                          ? `linear-gradient(135deg, ${color}30, transparent)`
                          : 'rgba(255,255,255,0.03)',
                        border: isSelected 
                          ? `1px solid ${color}30`
                          : '1px solid rgba(255,255,255,0.05)'
                      }}
                    >
                      {model.icon}
                    </div>
                    {isSelected && (
                      <div 
                        className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse"
                        style={{ background: color }}
                      />
                    )}
                  </div>

                  {/* اطلاعات مدل - ریسپانسیو */}
                  <div className="flex-1 relative min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className={`text-xs sm:text-sm font-bold transition-colors duration-300 truncate ${
                        isSelected ? 'text-white' : 'text-gray-300'
                      }`}>
                        {model.name}
                      </span>
                      {isSelected && (
                        <span className="text-[7px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-400 border border-blue-500/20 flex-shrink-0">
                          فعال
                        </span>
                      )}
                    </div>
                    <div className={`text-[9px] sm:text-[11px] transition-colors duration-300 truncate ${
                      isSelected ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {isMobile ? model.description.split(' ').slice(0, 3).join(' ') + '...' : model.description}
                    </div>
                  </div>

                  {/* تیک انتخابی - ریسپانسیو */}
                  {isSelected && (
                    <div className="relative flex-shrink-0">
                      <svg 
                        width="14" height="14" sm:width="18" sm:height="18"
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={color} 
                        strokeWidth="3"
                        className="animate-fadeInUp"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}

                  {/* فلش هاور */}
                  {!isSelected && isHovered && (
                    <div className="relative flex-shrink-0 animate-fadeInUp">
                      <svg width="12" height="12" sm:width="16" sm:height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* فوتر با اطلاعات - ریسپانسیو */}
          <div className="px-3 sm:px-4 py-2 sm:py-2.5" style={{ 
            borderTop: '1px solid rgba(99,179,237,0.06)',
            background: 'rgba(0,0,0,0.2)'
          }}>
            <div className="flex items-center justify-between text-[8px] sm:text-[10px] text-gray-500">
              <span className="flex items-center gap-1 sm:gap-1.5">
                <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-green-400 animate-pulse" />
                <span className={isMobile ? 'hidden' : 'inline'}>همه مدل‌ها آنلاین</span>
                <span className={isMobile ? 'inline' : 'hidden'}>آنلاین</span>
              </span>
              <span className="font-mono opacity-50">
                v{AI_MODELS.length}.0
              </span>
            </div>
          </div>
        </div>
      )}

      {/* استایل اسکرول */}
      <style>{`
        .max-h-64::-webkit-scrollbar,
        .max-h-80::-webkit-scrollbar {
          width: 3px;
        }
        .max-h-64::-webkit-scrollbar-track,
        .max-h-80::-webkit-scrollbar-track {
          background: transparent;
        }
        .max-h-64::-webkit-scrollbar-thumb,
        .max-h-80::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 10px;
        }
        .max-h-64::-webkit-scrollbar-thumb:hover,
        .max-h-80::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
}