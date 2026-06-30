import { useState } from 'react';
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
      <code className="px-1.5 py-0.5 rounded text-[13px] font-mono" style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd' }}>
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
    <div className="my-3 rounded-xl overflow-hidden" style={{ background: '#0a0f1f', border: '1px solid rgba(99,179,237,0.15)' }}>
      <div className="flex items-center justify-between px-4 py-2" style={{ background: 'rgba(99,179,237,0.08)', borderBottom: '1px solid rgba(99,179,237,0.15)' }}>
        <span className="text-xs font-mono text-blue-300">{lang || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-green-400">کپی شد!</span>
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              کپی
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto" style={{ direction: 'ltr', textAlign: 'left' }}>
        <code className={`${className || ''} hljs text-[13px] leading-relaxed`} style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function MessageBubble({ message, isNew, onRegenerate, isLastBot, isStreaming }: Props) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

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
      className={`flex items-start gap-3 group ${isNew ? 'animate-fadeInUp' : ''} ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className="flex-shrink-0 w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-lg"
        style={{
          background: isUser
            ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)'
            : 'linear-gradient(135deg,#06b6d4,#3b82f6)',
          boxShadow: isUser ? '0 0 20px rgba(139,92,246,0.2)' : '0 0 20px rgba(59,130,246,0.2)',
        }}
      >
        {isUser ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ) : (
          <img src="/images/bot-avatar.png" alt="bot" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Content */}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {/* Name */}
        <div className={`flex items-center gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="text-xs font-semibold text-gray-400">
            {isUser ? 'شما' : 'بات باتن'}
          </span>
          {!isUser && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(59,130,246,0.1)', color: '#93c5fd' }}
            >
              AI
            </span>
          )}
        </div>

        {/* Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'message-user text-white rounded-tr-sm'
              : 'message-bot text-gray-100 rounded-tl-sm'
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  // @ts-expect-error - custom code component
                  code: CodeBlock,
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2 text-white">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold mt-3 mb-2 text-white">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-bold mt-2 mb-1 text-white">{children}</h3>,
                  ul: ({ children }) => <ul className="list-disc pr-5 my-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pr-5 my-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-200">{children}</li>,
                  a: ({ children, href }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                      {children}
                    </a>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-r-4 border-blue-500 pr-3 py-1 my-2 italic text-gray-300" style={{ background: 'rgba(59,130,246,0.05)' }}>
                      {children}
                    </blockquote>
                  ),
                  strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                  em: ({ children }) => <em className="italic text-blue-200">{children}</em>,
                  table: ({ children }) => (
                    <div className="my-3 overflow-x-auto rounded-lg" style={{ border: '1px solid rgba(99,179,237,0.2)' }}>
                      <table className="min-w-full text-sm">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="px-3 py-2 text-right font-bold bg-blue-500/10 text-white border-b border-blue-500/20">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-3 py-2 border-b border-white/5">{children}</td>
                  ),
                  hr: () => <hr className="my-3 border-white/10" />,
                }}
              >
                {message.content}
              </ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-2 h-4 ml-0.5 align-middle" style={{ background: 'linear-gradient(180deg,#60a5fa,#a78bfa)', animation: 'typing 1s infinite' }}></span>
              )}
            </div>
          )}
        </div>

        {/* Actions row */}
        <div className={`flex items-center gap-2 mt-0.5 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="text-gray-600 text-xs">{formatTime(message.timestamp)}</span>

          {/* Action buttons for bot messages */}
          {!isUser && !isStreaming && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleCopyMessage}
                className="p-1 rounded-md text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                title="کپی پیام"
              >
                {copied ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
              {isLastBot && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="p-1 rounded-md text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                  title="تولید مجدد"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
