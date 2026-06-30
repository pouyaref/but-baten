import { Conversation } from '../types';
import { Trash2, Plus, X } from 'lucide-react';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function Sidebar({
  conversations = [],
  activeId,
  onSelect,
  onNew,
  onDelete,
  onClose,
  isMobile,
}: SidebarProps) {
  if (!conversations || conversations.length === 0) {
    return (
      <div className="h-full w-full bg-[#0f0f1a] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              بات باتن
            </span>
          </div>
          <button
            onClick={onNew}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <Plus className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 text-sm">هیچ گفتگویی وجود ندارد</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#0f0f1a] border-l border-white/5 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            بات باتن
          </span>
        </div>
        <div className="flex items-center gap-1">
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-all md:hidden"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
          <button
            onClick={onNew}
            className="p-2 hover:bg-white/10 rounded-lg transition-all group"
            title="گفتگوی جدید"
          >
            <Plus className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`
              group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200
              ${activeId === conv.id 
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20' 
                : 'hover:bg-white/5'
              }
            `}
            onClick={() => onSelect(conv.id)}
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm truncate text-gray-200 font-medium">
                {conv.title || 'گفتگوی جدید'}
              </div>
              <div className="text-xs text-gray-500">
                {conv.messages?.length || 0} پیام
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv.id);
              }}
              className={`
                p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100
                hover:bg-red-500/20 text-gray-500 hover:text-red-400
                ${conversations.length === 1 ? 'hidden' : ''}
              `}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/5">
        <div className="text-xs text-gray-600 text-center">
          v2.0 • با ❤️ ساخته شده
        </div>
      </div>
    </div>
  );
}