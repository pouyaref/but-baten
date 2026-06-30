import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Message } from '../types';

interface Props {
  message: Message;
  isNew?: boolean;
  onRegenerate?: () => void;
  isLastBot?: boolean;
  isStreaming?: boolean;
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit' }).format(date);
}

function CodeBlock({ children, className, inline }: { children: React.ReactNode; className?: string; inline?: boolean }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, '');
  const lang = className?.replace('language-', '') || '';

  if (inline) {
    return (
      <code className="px-1.5 py-0.5 rounded text-[11px] sm:text-[13px] font-mono" style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd' }}>
        {children}
      </code>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="my-2 sm:my-3 rounded-lg sm:rounded-xl overflow-hidden" style={{ 
      background: 'rgba(10, 15, 30, 0.9)', 
      border: '1px solid rgba(99,179,237,0.15)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>
      <div className="flex items-center justify-between px-2 sm:px-4 py-1.5 sm:py-2.5" style={{ 
        background: 'rgba(99,179,237,0.06)', 
        borderBottom: '1px solid rgba(99,179,237,0.1)' 
      }}>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[10px] sm:text-xs font-mono text-blue-300">{lang || 'code'}</span>
          {lang && (
            <span className="text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
              {lang}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-400 hover:text-white transition-all duration-200 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg hover:bg-white/5"
        >
          {copied ? (
            <>
              <svg width="11" height="11" sm:width="13" sm:height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-green-400 hidden sm:inline">کپی شد!</span>
            </>
          ) : (
            <>
              <svg width="11" height="11" sm:width="13" sm:height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span className="hidden sm:inline">کپی</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-2 sm:p-4 overflow-x-auto" style={{ direction: 'ltr', textAlign: 'left' }}>
        <code className={`${className || ''} hljs text-[11px] sm:text-[13px] leading-relaxed`} style={{ 
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          color: '#e5e7eb'
        }}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function MessageBubble({ message, isNew, onRegenerate, isLastBot, isStreaming }: Props) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isUser = message.role === 'user';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={`flex items-start gap-2 sm:gap-3 group ${isNew ? 'animate-fadeInUp' : ''} ${isUser ? 'flex-row-reverse' : 'flex-row'} px-1.5 sm:px-2 py-1`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar - ریسپانسیو */}
      <div className="flex-shrink-0 relative">
        <div 
          className="absolute -inset-0.5 sm:-inset-1 rounded-xl sm:rounded-2xl opacity-30 sm:opacity-50 blur-sm sm:blur-md transition-all duration-500"
          style={{
            background: isUser
              ? 'radial-gradient(circle, rgba(139,92,246,0.3), transparent)'
              : 'radial-gradient(circle, rgba(59,130,246,0.3), transparent)',
            opacity: isHovered ? 0.6 : 0.2
          }}
        />
        <div
          className="relative w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105"
          style={{
            background: isUser
              ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
              : 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            boxShadow: isUser 
              ? '0 0 15px rgba(139,92,246,0.15)' 
              : '0 0 15px rgba(59,130,246,0.15)',
          }}
        >
          {isUser ? (
            <svg width="12" height="12" sm:width="14" sm:height="14" md:width="16" md:height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          ) : (
            <img src="/images/bot-avatar.png" alt="bot" className="w-full h-full object-cover" />
          )}
        </div>
        {!isUser && (
          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border-2 border-gray-900 bg-emerald-400 animate-pulse" />
        )}
      </div>

      {/* Content */}
      <div className={`max-w-[75%] sm:max-w-[80%] md:max-w-[82%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1 sm:gap-1.5`}>
        {/* Name with role badge - ریسپانسیو */}
        <div className={`flex items-center gap-1.5 sm:gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className={`text-[10px] sm:text-xs font-semibold ${isUser ? 'text-purple-300' : 'text-blue-300'}`}>
            {isUser ? 'شما' : 'بات باتن'}
          </span>
          {!isUser && (
            <span
              className="text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-full font-medium"
              style={{ 
                background: 'rgba(59,130,246,0.15)', 
                color: '#93c5fd',
                border: '1px solid rgba(59,130,246,0.1)'
              }}
            >
              {isMobile ? '🤖' : '🤖 AI'}
            </span>
          )}
          {isUser && (
            <span
              className="text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-full font-medium"
              style={{ 
                background: 'rgba(139,92,246,0.1)', 
                color: '#a78bfa',
                border: '1px solid rgba(139,92,246,0.1)'
              }}
            >
              {isMobile ? '👤' : '👤 شما'}
            </span>
          )}
        </div>

        {/* Bubble - ریسپانسیو */}
        <div
          className={`relative px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm leading-relaxed transition-all duration-300 ${
            isUser
              ? 'text-white rounded-tr-sm'
              : 'text-gray-100 rounded-tl-sm'
          }`}
          style={{
            background: isUser
              ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
              : 'rgba(255, 255, 255, 0.04)',
            border: isUser 
              ? 'none'
              : '1px solid rgba(255,255,255,0.06)',
            boxShadow: isUser
              ? '0 4px 15px rgba(59,130,246,0.25)'
              : '0 4px 15px rgba(0,0,0,0.2)',
            backdropFilter: isUser ? 'none' : 'blur(10px)',
            maxWidth: '100%'
          }}
        >
          {!isUser && (
            <div 
              className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-10 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 0% 50%, rgba(59,130,246,0.2), transparent 70%)'
              }}
            />
          )}
          
          <div className="relative break-words">
            {isUser ? (
              <div className="whitespace-pre-wrap text-[13px] sm:text-sm">{message.content}</div>
            ) : (
              <div className="markdown-content text-[13px] sm:text-sm">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    // @ts-expect-error - custom code component
                    code: CodeBlock,
                    p: ({ children }) => <p className="mb-1.5 sm:mb-2 last:mb-0 leading-relaxed">{children}</p>,
                    h1: ({ children }) => <h1 className="text-base sm:text-xl font-bold mt-3 sm:mt-4 mb-1.5 sm:mb-2 text-white">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-sm sm:text-lg font-bold mt-2 sm:mt-3 mb-1 sm:mb-2 text-white">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xs sm:text-base font-bold mt-1.5 sm:mt-2 mb-0.5 sm:mb-1 text-white">{children}</h3>,
                    ul: ({ children }) => <ul className="list-disc pr-4 sm:pr-5 my-1.5 sm:my-2 space-y-0.5 sm:space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pr-4 sm:pr-5 my-1.5 sm:my-2 space-y-0.5 sm:space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-200 text-xs sm:text-sm">{children}</li>,
                    a: ({ children, href }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline transition-colors text-xs sm:text-sm">
                        {children}
                      </a>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-r-4 border-blue-500 pr-2 sm:pr-3 py-0.5 sm:py-1 my-1 sm:my-2 italic text-gray-300 text-xs sm:text-sm" style={{ background: 'rgba(59,130,246,0.05)' }}>
                        {children}
                      </blockquote>
                    ),
                    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                    em: ({ children }) => <em className="italic text-blue-200">{children}</em>,
                    table: ({ children }) => (
                      <div className="my-2 sm:my-3 overflow-x-auto rounded-lg" style={{ border: '1px solid rgba(99,179,237,0.2)' }}>
                        <table className="min-w-full text-[11px] sm:text-sm">{children}</table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="px-2 sm:px-3 py-1 sm:py-2 text-right font-bold bg-blue-500/10 text-white border-b border-blue-500/20 text-[11px] sm:text-sm">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-2 sm:px-3 py-1 sm:py-2 border-b border-white/5 text-[11px] sm:text-sm">{children}</td>
                    ),
                    hr: () => <hr className="my-2 sm:my-3 border-white/10" />,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                {isStreaming && (
                  <span className="inline-block w-1.5 h-3 sm:w-2 sm:h-4 ml-0.5 align-middle" style={{ 
                    background: 'linear-gradient(180deg, #60a5fa, #a78bfa)', 
                    animation: 'typing 1s infinite',
                    borderRadius: '2px'
                  }}></span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions row with timestamp - ریسپانسیو */}
        <div className={`flex items-center gap-1.5 sm:gap-2 mt-0.5 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="text-gray-500 text-[8px] sm:text-[10px] font-mono">
            {formatTime(message.timestamp)}
          </span>

          {!isUser && !isStreaming && (
            <div className={`flex items-center gap-0.5 transition-opacity duration-200 ${(isHovered || isMobile) ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={handleCopyMessage}
                className="p-1 rounded-md text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-200"
                title="کپی پیام"
              >
                {copied ? (
                  <svg width="11" height="11" sm:width="13" sm:height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="11" height="11" sm:width="13" sm:height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
              {isLastBot && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="p-1 rounded-md text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-200 hover:rotate-180"
                  title="تولید مجدد"
                >
                  <svg width="11" height="11" sm:width="13" sm:height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10" />
                    <polyline points="1 20 1 14 7 14" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}