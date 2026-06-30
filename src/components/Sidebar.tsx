import { useState } from 'react';
import { Conversation } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export default function Sidebar({ conversations, activeId, onSelect, onNew, onDelete }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="relative flex flex-col transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? '64px' : '260px',
        minWidth: collapsed ? '64px' : '260px',
        background: 'rgba(5, 9, 20, 0.9)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        zIndex: 10,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm">گفتگوها</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {collapsed ? (
              <path d="M9 18l6-6-6-6" />
            ) : (
              <path d="M15 18l-6-6 6-6" />
            )}
          </svg>
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}
          title="گفتگوی جدید"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {!collapsed && <span>گفتگوی جدید</span>}
        </button>
      </div>

      {/* Conversation List */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs">
              <div className="text-2xl mb-2">💬</div>
              هنوز گفتگویی نداری
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer border transition-all duration-200 ${
                  activeId === conv.id
                    ? 'border-blue-500/30 bg-blue-500/10 text-white'
                    : 'border-transparent text-gray-400 hover:text-white sidebar-item'
                }`}
                style={{ borderColor: activeId === conv.id ? 'rgba(59,130,246,0.3)' : 'transparent' }}
                onClick={() => onSelect(conv.id)}
              >
                <svg className="flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="text-xs truncate flex-1">{conv.title}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all duration-200 flex-shrink-0"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Footer */}
      {!collapsed && (
        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
              <img src="/images/bot-avatar.png" alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white text-xs font-medium">بات باتن</p>
              <p className="text-green-400 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse"></span>
                آنلاین
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
