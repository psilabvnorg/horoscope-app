import { useState, useCallback, useRef } from 'react';
import type { ChatMessage, UserProfile } from '@/types';

const OLLAMA_BASE_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434';
const MODEL = 'deepseek-r1:8b';

interface UseChatOptions {
  context?: string;
  systemPrompt?: string;
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
      const systemPrompt = buildSystemPrompt(profile, options.systemPrompt);
      
      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          prompt: `${systemPrompt}\n\nUser: ${content}\n\nAssistant:`,
          stream: false,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Clean up the response - remove thinking tags if present
      let assistantContent = data.response || '';
      assistantContent = assistantContent.replace(/<think>.*?<\/think>/gs, '').trim();
      
      if (!assistantContent) {
        assistantContent = "I'm here to help guide you through the mystical realm. What would you like to know?";
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
  }, [options.systemPrompt]);

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

function buildSystemPrompt(profile?: UserProfile, customPrompt?: string): string {
  let prompt = customPrompt || `You are a mystical fortune teller and astrologer. You provide guidance based on astrology, tarot, and spiritual wisdom. Be warm, encouraging, and insightful. Keep responses concise (2-3 sentences) and mystical in tone.`;

  if (profile) {
    prompt += `\n\nUser Profile:`;
    prompt += `\n- Zodiac Sign: ${profile.sign}`;
    prompt += `\n- Gender: ${profile.gender}`;
    if (profile.acceptedTraits.length > 0) {
      prompt += `\n- Traits: ${profile.acceptedTraits.join(', ')}`;
    }
    if (profile.partnerSign) {
      prompt += `\n- Partner's Sign: ${profile.partnerSign}`;
    }
  }

  prompt += `\n\nRespond as a mystical guide. Be warm, positive, and insightful.`;
  
  return prompt;
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
