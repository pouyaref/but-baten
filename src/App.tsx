import { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Conversation } from './types';
import { streamAIResponse, generateAIImage } from './services/ai';
import ParticleBackground from './components/ParticleBackground';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import MessageBubble from './components/MessageBubble';
import TypingIndicator from './components/TypingIndicator';
import ChatInput from './components/ChatInput';
import WelcomeScreen from './components/WelcomeScreen';

function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function createNewConversation(): Conversation {
  return {
    id: generateId(),
    title: 'گفتگوی جدید',
    messages: [],
    createdAt: new Date(),
  };
}

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([createNewConversation()]);
  const [activeId, setActiveId] = useState<string>(conversations[0].id);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [newMsgIds, setNewMsgIds] = useState<Set<string>>(new Set());
  const [selectedModel, setSelectedModel] = useState('openai');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const activeConv = conversations.find((c) => c.id === activeId)!;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeConv?.messages, isTyping]);

  const updateConversation = (id: string, updater: (c: Conversation) => Conversation) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));
  };

  const sendAIRequest = async (conversationId: string, messages: Message[], userMessageText?: string) => {
    setError(null);
    setIsTyping(true);
    abortRef.current = new AbortController();

    const botMsg: Message = {
      id: generateId(),
      role: 'bot',
      content: '',
      timestamp: new Date(),
    };

    setNewMsgIds((prev) => new Set(prev).add(botMsg.id));
    setStreamingId(botMsg.id);

    // Add empty bot message
    updateConversation(conversationId, (c) => ({
      ...c,
      title: userMessageText && c.messages.length === 0
        ? userMessageText.slice(0, 30) + (userMessageText.length > 30 ? '...' : '')
        : c.title,
      messages: [...c.messages, botMsg],
    }));

    try {
      await streamAIResponse(
        messages,
        selectedModel,
        (chunk) => {
          // Update streaming message with new chunk
          updateConversation(conversationId, (c) => ({
            ...c,
            messages: c.messages.map((m) =>
              m.id === botMsg.id ? { ...m, content: m.content + chunk } : m
            ),
          }));
          scrollToBottom();
        },
        abortRef.current.signal
      );
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // User cancelled
      } else {
        const errorMessage = err instanceof Error ? err.message : 'خطای ناشناخته';
        setError(errorMessage);
        updateConversation(conversationId, (c) => ({
          ...c,
          messages: c.messages.map((m) =>
            m.id === botMsg.id
              ? {
                  ...m,
                  content: `⚠️ متأسفم، در ارتباط با سرور AI خطایی رخ داد:\n\n\`\`\`\n${errorMessage}\n\`\`\`\n\nلطفاً دوباره تلاش کنید یا از منوی بالا مدل دیگری را انتخاب کنید.`,
                }
              : m
          ),
        }));
      }
    } finally {
      setIsTyping(false);
      setStreamingId(null);
      abortRef.current = null;
    }
  };

  const handleSend = async (text: string) => {
    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setNewMsgIds((prev) => new Set(prev).add(userMsg.id));

    const currentMessages = [...activeConv.messages, userMsg];

    updateConversation(activeId, (c) => ({
      ...c,
      title: c.messages.length === 0 ? text.slice(0, 30) + (text.length > 30 ? '...' : '') : c.title,
      messages: [...c.messages, userMsg],
    }));

    await sendAIRequest(activeId, currentMessages, text);
  };

  const handleRegenerate = async () => {
    // Find last user message and remove everything after it
    const msgs = [...activeConv.messages];
    let lastUserIdx = -1;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === 'user') {
        lastUserIdx = i;
        break;
      }
    }
    if (lastUserIdx === -1) return;

    const userMsgs = msgs.slice(0, lastUserIdx + 1);
    updateConversation(activeId, (c) => ({ ...c, messages: userMsgs }));

    await sendAIRequest(activeId, userMsgs);
  };

  const handleNewConversation = () => {
    if (abortRef.current) abortRef.current.abort();
    const newConv = createNewConversation();
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);
    setError(null);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => {
      const remaining = prev.filter((c) => c.id !== id);
      if (remaining.length === 0) {
        const fresh = createNewConversation();
        setActiveId(fresh.id);
        return [fresh];
      }
      if (activeId === id) setActiveId(remaining[0].id);
      return remaining;
    });
  };

  const handleClear = () => {
    if (abortRef.current) abortRef.current.abort();
    updateConversation(activeId, (c) => ({ ...c, messages: [], title: 'گفتگوی جدید' }));
    setError(null);
  };

  const handleImageGenerate = () => {
    const prompt = window.prompt('توضیح تصویری که می‌خواهید بسازید را وارد کنید:');
    if (!prompt) return;

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: `🎨 تصویر بساز: ${prompt}`,
      timestamp: new Date(),
    };

    const imageUrl = generateAIImage(prompt);

    const botMsg: Message = {
      id: generateId(),
      role: 'bot',
      content: `البته! در حال ساخت تصویر با توضیح: **"${prompt}"** 🎨\n\nتصویر شما آماده شد:\n\n![Generated Image](${imageUrl})\n\n💡 *این تصویر توسط هوش مصنوعی Flux ساخته شده است. می‌توانید روی آن کلیک راست کرده و ذخیره کنید.*`,
      timestamp: new Date(),
    };

    setNewMsgIds((prev) => new Set(prev).add(userMsg.id).add(botMsg.id));
    updateConversation(activeId, (c) => ({
      ...c,
      title: c.messages.length === 0 ? `🎨 ${prompt.slice(0, 25)}` : c.title,
      messages: [...c.messages, userMsg, botMsg],
    }));
  };

  const lastBotIndex = [...activeConv.messages].reverse().findIndex((m) => m.role === 'bot');
  const lastBotId = lastBotIndex >= 0 ? activeConv.messages[activeConv.messages.length - 1 - lastBotIndex].id : null;

  return (
    <div
      className="flex h-screen w-screen overflow-hidden relative"
      style={{ background: '#050914', direction: 'rtl' }}
    >
      <ParticleBackground />

      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" style={{ zIndex: 0 }} />

      <div
        className="fixed pointer-events-none"
        style={{
          zIndex: 0,
          top: '10%',
          left: '30%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
          transform: 'translate(-50%,-50%)',
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          zIndex: 0,
          bottom: '10%',
          right: '20%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)',
        }}
      />

      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={handleNewConversation}
        onDelete={handleDeleteConversation}
      />

      <main className="flex flex-col flex-1 min-w-0 relative" style={{ zIndex: 2 }}>
        <ChatHeader
          onClear={handleClear}
          messageCount={activeConv?.messages.length ?? 0}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          onImageGenerate={handleImageGenerate}
          onCancel={() => abortRef.current?.abort()}
          isStreaming={isTyping}
        />

        {error && (
          <div
            className="mx-4 mt-2 px-3 py-2 rounded-lg text-xs text-red-300 flex items-center gap-2"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
            <button onClick={() => setError(null)} className="mr-auto text-red-400 hover:text-red-200">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {activeConv?.messages.length === 0 ? (
            <WelcomeScreen onSuggestion={handleSend} />
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
              {activeConv.messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isNew={newMsgIds.has(msg.id)}
                  onRegenerate={handleRegenerate}
                  isLastBot={msg.id === lastBotId}
                  isStreaming={msg.id === streamingId}
                />
              ))}
              {isTyping && !streamingId && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="max-w-4xl w-full mx-auto">
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>
      </main>
    </div>
  );
}
