import { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // بستن سایدبار در موبایل با کلیک خارج
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobile && isOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('.sidebar-container')) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen]);

  // در موبایل فقط آیکون همبرگر نمایش داده میشه
  if (isMobile) {
    return (
      <>
        {/* دکمه باز کردن سایدبار در موبایل */}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-3 right-3 z-50 p-2 rounded-xl bg-gray-900/80 backdrop-blur-xl border border-white/10 text-white hover:bg-gray-800 transition-all duration-300"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* سایدبار موبایل */}
        <aside
          className={`sidebar-container fixed top-0 right-0 h-full w-[280px] z-50 transition-all duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            background: 'rgba(5, 9, 20, 0.98)',
            backdropFilter: 'blur(30px)',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '-4px 0 40px rgba(0,0,0,0.5)'
          }}
        >
          <MobileSidebarContent
            conversations={conversations}
            activeId={activeId}
            onSelect={(id) => { onSelect(id); setIsOpen(false); }}
            onNew={() => { onNew(); setIsOpen(false); }}
            onDelete={onDelete}
            onClose={() => setIsOpen(false)}
          />
        </aside>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
        `}</style>
      </>
    );
  }

  // دسکتاپ - سایدبار عادی
  return (
    <aside
      className="relative flex flex-col transition-all duration-300 ease-in-out flex-shrink-0"
      style={{
        width: collapsed ? '64px' : '280px',
        minWidth: collapsed ? '64px' : '280px',
        background: 'rgba(5, 9, 20, 0.92)',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        zIndex: 10,
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm">گفتگوها</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-400">
              {conversations.length}
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white hover:bg-white/5 flex-shrink-0"
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
      <div className="p-2 sm:p-3">
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-95"
          style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}
          title="گفتگوی جدید"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {!collapsed && <span className="truncate">گفتگوی جدید</span>}
        </button>
      </div>

      {/* Conversation List */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs">
              <div className="text-3xl mb-2">💬</div>
              <p>هنوز گفتگویی نداری</p>
              <p className="text-[10px] text-gray-600 mt-1">با دکمه بالا شروع کن</p>
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
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all duration-200 flex-shrink-0 p-0.5"
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
        <div className="p-3 sm:p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
              <img src="/images/bot-avatar.png" alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">بات باتن</p>
              <p className="text-emerald-400 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                آنلاین
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

// کامپوننت سایدبار موبایل
function MobileSidebarContent({ 
  conversations, 
  activeId, 
  onSelect, 
  onNew, 
  onDelete, 
  onClose 
}: {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <>
      {/* Header موبایل */}
      <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">گفتگوها</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* New Chat موبایل */}
      <div className="p-3">
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-200"
          style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span>گفتگوی جدید</span>
        </button>
      </div>

      {/* List موبایل */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs">
            <div className="text-3xl mb-2">💬</div>
            <p>هنوز گفتگویی نداری</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer border transition-all duration-200 ${
                activeId === conv.id
                  ? 'border-blue-500/30 bg-blue-500/10 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
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
                className="text-red-400 hover:text-red-300 transition-all duration-200 flex-shrink-0 p-0.5"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer موبایل */}
      <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
            <img src="/images/bot-avatar.png" alt="avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-white text-xs font-medium">بات باتن</p>
            <p className="text-emerald-400 text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              آنلاین
            </p>
          </div>
        </div>
      </div>
    </>
  );
}