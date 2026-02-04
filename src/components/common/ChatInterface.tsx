import type { UserProfile } from '@/types';
import { useChatUI } from '@/hooks/useChatUI';
import { ChatPanel } from './ChatPanel';
import type { PromptContext, EnhancedContext } from '@/lib/llm';

interface ChatInterfaceProps {
  profile: UserProfile;
  context: PromptContext;
  onClose: () => void;
  initialMessage?: string;
  enhancedContext?: EnhancedContext;
  title?: string;
  subtitle?: string;
  theme?: 'violet' | 'purple' | 'pink' | 'yellow' | 'rose';
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

const contextThemes: Record<PromptContext, 'violet' | 'purple' | 'pink' | 'yellow' | 'rose'> = {
  tarot: 'violet',
  couple: 'pink',
  fortune: 'purple',
  'crystal-ball': 'yellow',
  numerology: 'rose',
  dream: 'purple',
};

export function ChatInterface({
  profile,
  context,
  onClose,
  initialMessage,
  enhancedContext,
  title,
  subtitle,
  theme,
}: ChatInterfaceProps) {
  const {
    messages,
    isLoading,
    input,
    setInput,
    handleSend,
    handleSuggestedQuestion,
  } = useChatUI({
    context,
    enhancedContext,
    profile,
    initialMessage,
  });

  const questions = suggestedQuestions[context] || suggestedQuestions.fortune;
  const chatTheme = theme || contextThemes[context] || 'violet';
  const chatTitle = title || 'Mystic Guide';
  const chatSubtitle = subtitle || `Ask anything about ${context.replace('-', ' ')}`;

  return (
    <ChatPanel
      messages={messages}
      isLoading={isLoading}
      input={input}
      onInputChange={setInput}
      onSend={handleSend}
      onClose={onClose}
      suggestedQuestions={questions}
      onSuggestedQuestion={handleSuggestedQuestion}
      theme={chatTheme}
      title={chatTitle}
      subtitle={chatSubtitle}
      placeholder="Ask the mystic guide..."
    />
  );
}
