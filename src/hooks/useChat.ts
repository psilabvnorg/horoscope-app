import { useState, useCallback, useRef } from 'react';
import type { ChatMessage, UserProfile } from '@/types';
import { generateResponse } from '@/lib/llm';
import { buildSystemPrompt, type PromptContext, type EnhancedContext } from '@/lib/llm';

interface UseChatOptions {
  context?: PromptContext;
  systemPrompt?: string;
  enhancedContext?: EnhancedContext;
}

export function useChat(options: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string, profile?: UserProfile) => {
    if (!content.trim()) return;

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      // Build system prompt with user context and enhanced context
      const systemPrompt = options.context
        ? buildSystemPrompt(options.context, profile, undefined, options.enhancedContext)
        : options.systemPrompt || buildSystemPrompt('fortune', profile, undefined, options.enhancedContext);

      const response = await generateResponse(
        systemPrompt,
        content,
        abortControllerRef.current.signal
      );

      let assistantContent = response.content;
      
      if (!assistantContent || response.error) {
        assistantContent = getFallbackResponse(content);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      
      console.error('Chat error:', err);
      setError('The mystical connection is weak. Please try again.');
      
      // Add fallback response
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getFallbackResponse(content),
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [options.context, options.systemPrompt, options.enhancedContext]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    stopGeneration,
  };
}

function getFallbackResponse(userMessage: string): string {
  const responses = [
    "The stars whisper of great possibilities ahead. Trust in the cosmic timing of your journey.",
    "Your energy resonates with the universe in this moment. Listen to your inner wisdom.",
    "The cards suggest a path of growth and transformation. Embrace the changes coming your way.",
    "Ancient wisdom speaks through me - you are exactly where you need to be right now.",
    "The celestial bodies align to guide you. Follow your intuition, it will not lead you astray.",
    "Mystical forces surround you with protection and love. Trust in the divine plan.",
    "Your question carries deep significance. The answer lies within your own heart.",
    "The universe conspires in your favor. Keep your thoughts positive and your spirit bright."
  ];
  
  const seed = userMessage.length;
  return responses[seed % responses.length];
}
