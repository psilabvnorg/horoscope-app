import { useState, useRef, useEffect } from 'react';
import { useChat } from './useChat';
import type { PromptContext, EnhancedContext } from '@/lib/llm';
import type { UserProfile } from '@/types';

interface UseChatUIOptions {
  context: PromptContext;
  enhancedContext?: EnhancedContext;
  profile?: UserProfile;
  initialMessage?: string;
}

export function useChatUI({ context, enhancedContext, profile, initialMessage }: UseChatUIOptions) {
  const { messages, isLoading, sendMessage } = useChat({ context, enhancedContext });
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Send initial message if provided
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      sendMessage(initialMessage, profile);
    }
  }, [initialMessage, messages.length, sendMessage, profile]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input, profile);
    setInput('');
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

  return {
    messages,
    isLoading,
    input,
    setInput,
    scrollRef,
    inputRef,
    handleSend,
    handleKeyDown,
    handleSuggestedQuestion,
  };
}
