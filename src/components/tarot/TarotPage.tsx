import { useState, useRef, useEffect } from 'react';
import type { UserProfile } from '@/types';
import { useTarot } from '@/hooks/useTarot';
import { useChat } from '@/hooks/useChat';
import { buildTarotContext } from '@/lib/llm';
import { TarotCardComponent } from './TarotCard';
import { Sparkles, Send, X, RefreshCw } from 'lucide-react';

interface TarotPageProps {
  profile: UserProfile;
  readingType?: string;
  selectedCardIds?: number[];
}

const readingTypeInfo = {
  'daily': { title: 'Daily Tarot', cards: 1, description: 'Your card for today' },
  'near-future': { title: 'Near Future', cards: 3, description: 'What lies ahead' },
  'love': { title: 'Love & Relations', cards: 3, description: 'Your romantic path' },
  'yes-no': { title: 'Yes or No', cards: 1, description: 'A clear answer' },
  'meanings': { title: 'Card Library', cards: 0, description: 'Explore all cards' },
};

const suggestedQuestions = {
  'daily': [
    'What should I focus on today?',
    'What energy surrounds me?',
    'What lesson is today bringing?',
  ],
  'near-future': [
    'What opportunities are coming?',
    'What should I prepare for?',
    'How can I navigate what\'s ahead?',
  ],
  'love': [
    'What does my love life need?',
    'How can I improve my relationships?',
    'What blocks my romantic growth?',
  ],
  'yes-no': [
    'Should I take this opportunity?',
    'Is this the right path?',
    'Will this work out?',
  ],
};

export function TarotPage({ profile, readingType = 'daily' }: TarotPageProps) {
  const { getDailyCard, getThreeCardSpread } = useTarot();
  const [currentReading, setCurrentReading] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const info = readingTypeInfo[readingType as keyof typeof readingTypeInfo] || readingTypeInfo['daily'];

  // Build chat context with tarot cards
  const tarotContext = currentReading ? {
    tarotCards: buildTarotContext(currentReading.cards),
  } : undefined;

  const { messages, isLoading, sendMessage } = useChat({
    context: 'tarot',
    enhancedContext: tarotContext,
  });

  const drawCards = () => {
    let reading;
    if (readingType === 'daily' || readingType === 'yes-no') {
      reading = getDailyCard(profile.sign);
    } else {
      reading = getThreeCardSpread(profile.sign);
      // Customize positions based on reading type
      if (readingType === 'near-future') {
        reading.cards[0].position = 'Present';
        reading.cards[1].position = 'Near Future';
        reading.cards[2].position = 'Outcome';
      } else if (readingType === 'love') {
        reading.cards[0].position = 'You';
        reading.cards[1].position = 'Them';
        reading.cards[2].position = 'Connection';
      }
    }
    setCurrentReading(reading);
    setShowResult(true);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;
    const message = chatInput;
    setChatInput('');
    await sendMessage(message, profile);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question, profile);
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when result opens
  useEffect(() => {
    if (showResult && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [showResult]);

  // Get card theme color
  const getCardColor = (card: any) => {
    if (card.arcana === 'major') return { primary: '#a78bfa', glow: 'rgba(167, 139, 250, 0.4)' };
    switch (card.suit) {
      case 'wands': return { primary: '#fb923c', glow: 'rgba(251, 146, 60, 0.4)' };
      case 'cups': return { primary: '#22d3ee', glow: 'rgba(34, 211, 238, 0.4)' };
      case 'swords': return { primary: '#94a3b8', glow: 'rgba(148, 163, 184, 0.4)' };
      case 'pentacles': return { primary: '#fbbf24', glow: 'rgba(251, 191, 36, 0.4)' };
      default: return { primary: '#a78bfa', glow: 'rgba(167, 139, 250, 0.4)' };
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a1a] text-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔮</div>
          <h2 className="text-2xl font-black uppercase tracking-widest italic bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            {info.title}
          </h2>
          <p className="text-sm text-white/60 mt-2 tracking-wide">{info.description}</p>
        </div>

        {/* Draw Cards Button */}
        <button
          onClick={drawCards}
          className="px-12 py-4 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-lg shadow-violet-500/30"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Draw Cards
          </div>
        </button>
      </div>

      {/* Reading Result Modal with Chat */}
      {showResult && currentReading && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-h-[90vh] bg-[#0a0a1a] rounded-t-3xl border-t border-violet-500/20 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-b border-violet-500/20 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-white">{info.title}</h4>
                    <p className="text-xs text-white/60">Ask about your reading</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowResult(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Cards Display */}
              <div className="flex items-center justify-center gap-4 py-4">
                {currentReading.cards.map((cardData: any, index: number) => {
                  const color = getCardColor(cardData.card);
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="mb-2"
                        style={{ filter: `drop-shadow(0 0 20px ${color.glow})` }}
                      >
                        <TarotCardComponent
                          card={cardData.card}
                          reversed={cardData.reversed}
                          revealed={true}
                          size="sm"
                        />
                      </div>
                      <span className="text-xs text-violet-400 font-bold uppercase tracking-wider">
                        {cardData.position}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card Meanings Summary */}
            <div className="px-4 py-3 bg-[#1a1a2e]/50 border-b border-violet-500/10 flex-shrink-0 max-h-32 overflow-y-auto">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-violet-400 mb-2">
                Your Cards
              </h3>
              {currentReading.cards.map((cardData: any, index: number) => (
                <p key={index} className="text-white/70 text-xs leading-relaxed mb-2">
                  <span className="font-bold text-violet-300">{cardData.card.name}:</span>{' '}
                  {cardData.reversed ? cardData.card.meaning.reversed : cardData.card.meaning.upright}
                </p>
              ))}
            </div>

            {/* Chat Messages */}
            <div 
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
            >
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-white/60 text-center">
                    Ask me anything about your reading:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {(suggestedQuestions[readingType as keyof typeof suggestedQuestions] || suggestedQuestions['daily']).map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="px-3 py-2 bg-violet-500/20 text-violet-300 rounded-full text-xs hover:bg-violet-500/30 transition-all border border-violet-500/30"
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
                      ? 'bg-violet-500/30' 
                      : 'bg-gradient-to-br from-violet-500 to-purple-500'
                  }`}>
                    {message.role === 'user' ? (
                      <span className="text-sm">👤</span>
                    ) : (
                      <Sparkles className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-violet-500/80 text-white'
                      : 'bg-[#1a1a2e]/80 text-white/90 border border-violet-500/20'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-[#1a1a2e]/80 rounded-2xl px-4 py-2 border border-violet-500/20">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input and Actions */}
            <div className="p-4 pb-6 border-t border-violet-500/20 bg-[#1a1a2e]/50 space-y-3 flex-shrink-0">
              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your cards..."
                  className="flex-1 px-4 py-3 bg-[#0a0a1a] border border-violet-500/30 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-violet-500/60 text-sm"
                  disabled={isLoading}
                />
                <button 
                  onClick={handleSendMessage} 
                  disabled={!chatInput.trim() || isLoading}
                  className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center hover:from-violet-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
              
              {/* Draw Again Button */}
              <button
                onClick={() => {
                  drawCards();
                }}
                className="w-full py-3 rounded-full border border-violet-500/30 text-violet-300 font-medium hover:bg-violet-500/10 transition-all text-sm flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Draw New Cards
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
