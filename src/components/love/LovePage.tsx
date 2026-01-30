import { useState, useRef, useEffect } from 'react';
import type { UserProfile, ZodiacSign } from '@/types';
import { ZODIAC_SIGNS, ZODIAC_DATES } from '@/types';
import { getCompatibilityText } from '@/hooks/useCompatibility';
import { useChat } from '@/hooks/useChat';
import { ChevronLeft, Send, Sparkles, X } from 'lucide-react';

interface LovePageProps {
  profile: UserProfile;
  onBack?: () => void;
}

const zodiacImages: Record<ZodiacSign, string> = {
  aries: '/figma/asset/zodiac/aries.png',
  taurus: '/figma/asset/zodiac/taurus.png',
  gemini: '/figma/asset/zodiac/gemini.png',
  cancer: '/figma/asset/zodiac/cancer.png',
  leo: '/figma/asset/zodiac/leo.png',
  virgo: '/figma/asset/zodiac/virgo.png',
  libra: '/figma/asset/zodiac/libra.png',
  scorpio: '/figma/asset/zodiac/scorpio.png',
  sagittarius: '/figma/asset/zodiac/sagittarius.png',
  capricorn: '/figma/asset/zodiac/capricorn.png',
  aquarius: '/figma/asset/zodiac/aquarius.png',
  pisces: '/figma/asset/zodiac/pisces.png',
};

const zodiacColors: Record<ZodiacSign, { primary: string; glow: string }> = {
  aries: { primary: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' },
  taurus: { primary: '#22c55e', glow: 'rgba(34, 197, 94, 0.4)' },
  gemini: { primary: '#eab308', glow: 'rgba(234, 179, 8, 0.4)' },
  cancer: { primary: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' },
  leo: { primary: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' },
  virgo: { primary: '#d4a574', glow: 'rgba(212, 165, 116, 0.4)' },
  libra: { primary: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)' },
  scorpio: { primary: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' },
  sagittarius: { primary: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)' },
  capricorn: { primary: '#6b7280', glow: 'rgba(107, 114, 128, 0.4)' },
  aquarius: { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' },
  pisces: { primary: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' },
};

function getDateRange(sign: ZodiacSign): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const range = ZODIAC_DATES[sign];
  const startMonth = months[range.start[0] - 1];
  const endMonth = months[range.end[0] - 1];
  return `${range.start[1]} ${startMonth} - ${range.end[1]} ${endMonth}`;
}

const suggestedLoveQuestions = [
  'What makes our relationship special?',
  'How can we strengthen our bond?',
  'What challenges might we face together?',
  'What does the future hold for us?',
  'How do our personalities complement each other?',
  'What should we focus on in our relationship?',
];

export function LovePage({ profile, onBack }: LovePageProps) {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>(profile.partnerSign || 'leo');
  const [showResult, setShowResult] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const userSign = profile.sign;
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [chatInput, setChatInput] = useState('');

  const compatibilityText = getCompatibilityText(userSign, selectedSign);
  
  // Initialize chat with love context and compatibility info
  const { messages, isLoading, sendMessage } = useChat({
    context: 'couple',
    enhancedContext: {
      compatibilityText,
      zodiacDescription: `${profile.name} is ${userSign} and their partner is ${selectedSign}.`,
    },
  });

  const handleCheckLove = () => {
    setShowResult(true);
    setShowChat(true);
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

  // Focus input when chat opens
  useEffect(() => {
    if (showChat && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showChat]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a12] text-white overflow-y-auto overflow-x-hidden">
      {/* Header */}
      <header className="p-4 pt-6 flex items-center gap-3">
        {onBack && (
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-xl font-light tracking-[0.15em] uppercase">Love Report</h1>
      </header>

      {/* Selected Signs Card */}
      <div className="px-4 mt-2">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] border border-purple-500/20 p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent" />
          
          <div className="relative flex items-center justify-center gap-4">
            {/* User's Sign */}
            <div className="flex flex-col items-center">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center relative"
                style={{ 
                  boxShadow: `0 0 30px ${zodiacColors[userSign].glow}`,
                }}
              >
                <ZodiacIcon sign={userSign} size={80} />
              </div>
              <span className="mt-3 text-sm font-medium capitalize">{userSign}</span>
            </div>

            {/* Plus Sign */}
            <div className="text-3xl text-purple-400 font-light mx-2">+</div>

            {/* Partner's Sign */}
            <div className="flex flex-col items-center">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center relative"
                style={{ 
                  boxShadow: `0 0 30px ${zodiacColors[selectedSign].glow}`,
                }}
              >
                <ZodiacIcon sign={selectedSign} size={80} />
              </div>
              <span className="mt-3 text-sm font-medium capitalize">{selectedSign}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Select a Sign Section */}
      <div className="flex-1 mt-8 overflow-hidden">
        <h2 className="text-center text-lg tracking-[0.2em] uppercase mb-6">Select a Sign</h2>
        
        {/* Zodiac Carousel */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x snap-mandatory scrollbar-hide touch-pan-x"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain'
          }}
        >
          {ZODIAC_SIGNS.map((sign, index) => {
            const isSelected = sign === selectedSign;
            const isFirst = index === 0;
            const isLast = index === ZODIAC_SIGNS.length - 1;
            return (
              <button
                key={sign}
                onClick={() => setSelectedSign(sign)}
                className={`flex-shrink-0 flex flex-col items-center snap-center transition-all duration-300 ${
                  isSelected ? 'scale-110' : 'scale-90 opacity-60'
                } ${isFirst ? 'ml-[calc(50%-3.5rem)]' : ''} ${isLast ? 'mr-[calc(50%-3.5rem)]' : ''}`}
              >
                <div 
                  className={`w-28 h-28 rounded-full flex items-center justify-center relative transition-all duration-300 ${
                    isSelected ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-[#0a0a12]' : ''
                  }`}
                  style={{ 
                    boxShadow: isSelected ? `0 0 40px ${zodiacColors[sign].glow}` : 'none',
                  }}
                >
                  <ZodiacIcon sign={sign} size={isSelected ? 100 : 70} />
                </div>
                <span className={`mt-3 text-sm font-medium capitalize transition-all ${
                  isSelected ? 'text-white' : 'text-white/50'
                }`}>
                  {sign}
                </span>
                <span className={`text-xs transition-all ${
                  isSelected ? 'text-white/60' : 'text-white/30'
                }`}>
                  {getDateRange(sign)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Navigation Arrows and Dots */}
        <div className="flex justify-center items-center gap-4 mt-4">
          {/* Left Arrow */}
          <button
            onClick={() => {
              const currentIndex = ZODIAC_SIGNS.indexOf(selectedSign);
              const newIndex = currentIndex > 0 ? currentIndex - 1 : ZODIAC_SIGNS.length - 1;
              const newSign = ZODIAC_SIGNS[newIndex];
              setSelectedSign(newSign);
              if (scrollRef.current) {
                const scrollWidth = scrollRef.current.scrollWidth;
                const containerWidth = scrollRef.current.clientWidth;
                const itemWidth = (scrollWidth - containerWidth) / (ZODIAC_SIGNS.length - 1);
                scrollRef.current.scrollTo({
                  left: newIndex * itemWidth,
                  behavior: 'smooth'
                });
              }
            }}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
            aria-label="Previous sign"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* 3 Dots */}
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-white/30" />
            <div className="w-2 h-2 rounded-full bg-white" />
            <div className="w-2 h-2 rounded-full bg-white/30" />
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => {
              const currentIndex = ZODIAC_SIGNS.indexOf(selectedSign);
              const newIndex = currentIndex < ZODIAC_SIGNS.length - 1 ? currentIndex + 1 : 0;
              const newSign = ZODIAC_SIGNS[newIndex];
              setSelectedSign(newSign);
              if (scrollRef.current) {
                const scrollWidth = scrollRef.current.scrollWidth;
                const containerWidth = scrollRef.current.clientWidth;
                const itemWidth = (scrollWidth - containerWidth) / (ZODIAC_SIGNS.length - 1);
                scrollRef.current.scrollTo({
                  left: newIndex * itemWidth,
                  behavior: 'smooth'
                });
              }
            }}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
            aria-label="Next sign"
          >
            <ChevronLeft className="w-5 h-5 rotate-180" />
          </button>
        </div>
      </div>

      {/* Check Love Button */}
      <div className="p-4 pb-24">
        <button
          onClick={handleCheckLove}
          className="w-full py-4 rounded-full bg-gradient-to-r from-purple-600/80 to-purple-500/80 border border-purple-400/30 text-white font-medium tracking-[0.15em] uppercase transition-all hover:from-purple-500/90 hover:to-purple-400/90 active:scale-[0.98]"
        >
          Check Love
        </button>
      </div>

      {/* Compatibility Result Modal with Chat */}
      {showResult && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-h-[90vh] bg-[#0a0a12] rounded-t-3xl border-t border-purple-500/20 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-b border-purple-500/20 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-white">Love Guide</h4>
                    <p className="text-xs text-white/60">Ask about your relationship</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowResult(false);
                    setShowChat(false);
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ boxShadow: `0 0 20px ${zodiacColors[userSign].glow}` }}
                >
                  <ZodiacIcon sign={userSign} size={40} />
                </div>
                <span className="text-xl text-pink-400">❤️</span>
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ boxShadow: `0 0 20px ${zodiacColors[selectedSign].glow}` }}
                >
                  <ZodiacIcon sign={selectedSign} size={40} />
                </div>
              </div>
              <h2 className="text-center text-base font-semibold text-white mt-3 capitalize">
                {userSign} & {selectedSign}
              </h2>
            </div>

            {/* Compatibility Summary */}
            <div className="px-4 py-3 bg-[#1a1a2e]/50 border-b border-purple-500/10 flex-shrink-0">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">
                Compatibility
              </h3>
              <p className="text-white/70 text-xs leading-relaxed">
                {compatibilityText}
              </p>
            </div>

            {/* Chat Messages */}
            <div 
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
            >
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-white/60 text-center">
                    Ask me anything about your relationship:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestedLoveQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="px-3 py-2 bg-purple-500/20 text-purple-300 rounded-full text-xs hover:bg-purple-500/30 transition-all border border-purple-500/30"
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
                      ? 'bg-purple-500/30' 
                      : 'bg-gradient-to-br from-purple-500 to-pink-500'
                  }`}>
                    {message.role === 'user' ? (
                      <span className="text-sm">👤</span>
                    ) : (
                      <Sparkles className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-purple-500/80 text-white'
                      : 'bg-[#1a1a2e]/80 text-white/90 border border-purple-500/20'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-[#1a1a2e]/80 rounded-2xl px-4 py-2 border border-purple-500/20">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input and Actions */}
            <div className="p-4 pb-6 border-t border-purple-500/20 bg-[#1a1a2e]/50 space-y-3 flex-shrink-0">
              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your love compatibility..."
                  className="flex-1 px-4 py-3 bg-[#0a0a12] border border-purple-500/30 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-purple-500/60 text-sm"
                  disabled={isLoading}
                />
                <button 
                  onClick={handleSendMessage} 
                  disabled={!chatInput.trim() || isLoading}
                  className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
              
              {/* Check Another Button */}
              <button
                onClick={() => {
                  setShowResult(false);
                  setShowChat(false);
                }}
                className="w-full py-3 rounded-full border border-purple-500/30 text-purple-300 font-medium hover:bg-purple-500/10 transition-all text-sm"
              >
                Check Another Compatibility
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Zodiac Icon Component with fallback to symbols
function ZodiacIcon({ sign, size = 80 }: { sign: ZodiacSign; size?: number }) {
  const symbols: Record<ZodiacSign, string> = {
    aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
    leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
    sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓'
  };

  const colors = zodiacColors[sign];

  return (
    <div 
      className="flex items-center justify-center"
      style={{ 
        width: size, 
        height: size,
        fontSize: size * 0.5,
        color: colors.primary,
        textShadow: `0 0 20px ${colors.glow}`,
      }}
    >
      <img 
        src={zodiacImages[sign]} 
        alt={sign}
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback to symbol if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = `<span style="font-size: ${size * 0.5}px">${symbols[sign]}</span>`;
        }}
      />
    </div>
  );
}
