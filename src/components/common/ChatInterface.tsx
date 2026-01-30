import { useState, useRef, useEffect } from 'react';
import type { UserProfile } from '@/types';
import { useChat } from '@/hooks/useChat';
import type { PromptContext, EnhancedContext } from '@/lib/llm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, X, Sparkles, User, Bot } from 'lucide-react';

interface ChatInterfaceProps {
  profile: UserProfile;
  context: PromptContext;
  onClose: () => void;
  initialMessage?: string;
  enhancedContext?: EnhancedContext;
}

const suggestedQuestions: Record<PromptContext, string[]> = {
  tarot: [
    'What does my daily card mean?',
    'How should I interpret reversed cards?',
    'What spread is best for career questions?',
    'Tell me about the Major Arcana',
  ],
  couple: [
    'Are we compatible?',
    'What are our strengths as a couple?',
    'How can we improve our relationship?',
    'What does our zodiac pairing mean?',
  ],
  fortune: [
    'What does my future hold?',
    'Will I find love soon?',
    'How will my career develop?',
    'What should I focus on today?',
  ],
  'crystal-ball': [
    'What wisdom do you have for me today?',
    'What should I focus on this week?',
    'Tell me about my future',
    'What guidance do you have for my career?',
  ],
  numerology: [
    'What is my life path number?',
    'What does my birth date reveal?',
    'What numbers are lucky for me?',
    'Tell me about master numbers',
  ],
  dream: [
    'I dreamed about flying, what does it mean?',
    'What does water symbolize in dreams?',
    'I had a recurring dream, help me understand',
    'What does dreaming about animals mean?',
  ],
};

export function ChatInterface({ profile, context, onClose, initialMessage, enhancedContext }: ChatInterfaceProps) {
  const { messages, isLoading, sendMessage } = useChat({ context, enhancedContext });
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialMessageSent = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Send initial message if provided
  useEffect(() => {
    if (initialMessage && !initialMessageSent.current) {
      initialMessageSent.current = true;
      sendMessage(initialMessage, profile);
    }
  }, [initialMessage, profile, sendMessage]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const message = input;
    setInput('');
    await sendMessage(message, profile);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question, profile);
  };

  const questions = suggestedQuestions[context] || suggestedQuestions.fortune;

  return (
    <div className="flex flex-col h-[500px] bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-sm">Mystic Guide</h4>
            <p className="text-xs text-muted-foreground">Ask anything about {context.replace('-', ' ')}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Suggested questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {questions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-xs hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-violet-100 dark:bg-violet-900/30' 
                  : 'bg-gradient-to-br from-violet-500 to-purple-500'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-violet-600" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                message.role === 'user'
                  ? 'bg-violet-500 text-white'
                  : 'bg-muted'
              }`}>
                {message.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t bg-muted/50">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the mystic guide..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            size="icon"
            className="bg-violet-500 hover:bg-violet-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
