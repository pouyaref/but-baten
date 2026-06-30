import { useState, useRef, useEffect } from 'react';
import { AI_MODELS, AIModel } from '../services/ai';

interface Props {
  selectedModel: string;
  onSelect: (modelId: string) => void;
}

export default function ModelSelector({ selectedModel, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-[1.02]"
        style={{
          background: 'rgba(59,130,246,0.1)',
          border: '1px solid rgba(59,130,246,0.2)',
        }}
      >
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        <span className="text-blue-300 text-xs font-medium">{current.icon} {current.name}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-300">
          <path d={open ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full mt-2 left-0 w-64 rounded-xl overflow-hidden shadow-2xl animate-fadeInUp"
          style={{
            background: 'rgba(10,15,31,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99,179,237,0.2)',
            zIndex: 100,
          }}
        >
          <div className="px-3 py-2" style={{ borderBottom: '1px solid rgba(99,179,237,0.1)' }}>
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">انتخاب مدل</span>
          </div>
          {AI_MODELS.map((model: AIModel) => (
            <button
              key={model.id}
              onClick={() => { onSelect(model.id); setOpen(false); }}
              className={`w-full text-right px-3 py-2.5 flex items-center gap-3 transition-all duration-200 ${
                selectedModel === model.id
                  ? 'bg-blue-500/10'
                  : 'hover:bg-white/5'
              }`}
            >
              <span className="text-xl">{model.icon}</span>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">{model.name}</div>
                <div className="text-gray-500 text-xs">{model.description}</div>
              </div>
              {selectedModel === model.id && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
