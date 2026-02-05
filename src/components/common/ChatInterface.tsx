import { useTranslation } from 'react-i18next';
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
  customAdditions?: string;
  title?: string;
  subtitle?: string;
  theme?: 'violet' | 'purple' | 'pink' | 'yellow' | 'rose';
}

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
  customAdditions,
  title,
  subtitle,
  theme,
}: ChatInterfaceProps) {
  const { t } = useTranslation();
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
    customAdditions,
  });

  const suggested = t(`chat.suggested.${context}`, { returnObjects: true });
  const fallbackSuggested = t('chat.suggested.fortune', { returnObjects: true });
  const questions = Array.isArray(suggested)
    ? suggested
    : Array.isArray(fallbackSuggested)
      ? fallbackSuggested
      : [];
  const chatTheme = theme || contextThemes[context] || 'violet';
  const chatTitle = title || t(`chat.title.${context}`, { defaultValue: t('chat.title.default') });
  const chatSubtitle = subtitle || t(`chat.subtitle.${context}`, { defaultValue: t('chat.subtitle.default') });
  const chatPlaceholder = t('chat.placeholder');
  const suggestedTitle = t('chat.suggestedTitle');

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
      placeholder={chatPlaceholder}
      suggestedTitle={suggestedTitle}
    />
  );
}
