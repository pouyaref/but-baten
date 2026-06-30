export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 animate-fadeInUp">
      {/* Bot Avatar */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)' }}
      >
        <img src="/images/bot-avatar.png" alt="bot" className="w-full h-full object-cover" />
      </div>

      {/* Typing bubble */}
      <div
        className="px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <span className="w-2 h-2 rounded-full bg-blue-400 typing-dot"></span>
        <span className="w-2 h-2 rounded-full bg-purple-400 typing-dot"></span>
        <span className="w-2 h-2 rounded-full bg-cyan-400 typing-dot"></span>
      </div>
    </div>
  );
}
