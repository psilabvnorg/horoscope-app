import { useRef, useEffect } from 'react';
import type { ChatMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X, Sparkles, User, Bot } from 'lucide-react';

interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
  suggestedQuestions?: string[];
  onSuggestedQuestion?: (question: string) => void;
  theme?: 'violet' | 'purple' | 'pink' | 'yellow' | 'rose';
  title?: string;
  subtitle?: string;
  placeholder?: string;
  suggestedTitle?: string;
}

const themeColors = {
  violet: {
    gradient: 'from-violet-600 to-purple-600',
    glow: 'shadow-violet-500/30',
    text: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
  },
  purple: {
    gradient: 'from-purple-600 to-indigo-600',
    glow: 'shadow-purple-500/30',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  pink: {
    gradient: 'from-pink-600 to-rose-600',
    glow: 'shadow-pink-500/30',
    text: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
  },
  yellow: {
    gradient: 'from-yellow-600 to-amber-600',
    glow: 'shadow-yellow-500/30',
    text: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
  },
  rose: {
    gradient: 'from-rose-600 to-pink-600',
    glow: 'shadow-rose-500/30',
    text: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
  },
};

export function ChatPanel({
  messages,
  isLoading,
  input,
  onInputChange,
  onSend,
  onClose,
  suggestedQuestions = [],
  onSuggestedQuestion,
  theme = 'violet',
  title = 'Chat',
  subtitle,
  placeholder = 'Ask me anything...',
  suggestedTitle = 'Suggested questions:',
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const colors = themeColors[theme];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a12] flex flex-col">
      {/* Header */}
      <div className={`p-4 border-b border-white/10 bg-gradient-to-r ${colors.gradient} ${colors.glow}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && suggestedQuestions.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-white/60 text-center mb-4">{suggestedTitle}</p>
            {suggestedQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => onSuggestedQuestion?.(question)}
                className={`w-full p-3 rounded-xl ${colors.bg} border ${colors.border} text-left text-sm text-white/80 hover:bg-white/10 transition-colors`}
              >
                {question}
              </button>
            ))}
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                <Bot className={`w-4 h-4 ${colors.text}`} />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.role === 'user'
                  ? `bg-gradient-to-r ${colors.gradient} text-white`
                  : 'bg-white/5 text-white/90'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
              <Bot className={`w-4 h-4 ${colors.text}`} />
            </div>
            <div className="bg-white/5 p-3 rounded-2xl">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-[#0a0a12]">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            disabled={isLoading}
          />
          <Button
            onClick={onSend}
            disabled={!input.trim() || isLoading}
            className={`bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white`}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
