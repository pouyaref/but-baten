import { Message } from '../types';
import { Copy, RotateCcw, Check, User, Bot } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageBubbleProps {
  message: Message;
  isNew: boolean;
  onRegenerate: () => void;
  isLastBot: boolean;
  isStreaming: boolean;
}

export default function MessageBubble({
  message,
  isNew,
  onRegenerate,
  isLastBot,
  isStreaming,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isBot = message.role === 'bot';

  return (
    <div className={`
      flex gap-3 animate-fade-in
      ${isBot ? 'justify-start' : 'justify-end'}
    `}>
      <div className={`
        shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold
        ${isBot 
          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
          : 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
        }
        ${isNew ? 'scale-0 animate-avatar-pop' : ''}
      `}>
        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      <div className={`
        max-w-[85%] sm:max-w-[75%] group
        ${isBot ? 'order-2' : 'order-1'}
      `}>
        <div className={`
          rounded-2xl px-4 py-3 relative
          ${isBot 
            ? 'bg-white/5 border border-white/10 text-gray-200' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
          }
          ${isStreaming ? 'animate-pulse-slow' : ''}
        `}>
          <div className="prose prose-invert max-w-none text-sm sm:text-base">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-xl text-xs sm:text-sm"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content || '...'}
            </ReactMarkdown>
          </div>

          {isBot && message.content && !isStreaming && (
            <div className="absolute -bottom-8 left-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-gray-300 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              {isLastBot && (
                <button
                  onClick={onRegenerate}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-gray-300 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className={`
          text-xs text-gray-600 mt-1 px-2
          ${isBot ? 'text-right' : 'text-left'}
        `}>
          {message.timestamp?.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}