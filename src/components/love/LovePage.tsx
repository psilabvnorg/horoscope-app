import { useState, useRef } from 'react';
import type { UserProfile, ZodiacSign } from '@/types';
import { ZODIAC_SIGNS, ZODIAC_DATES } from '@/types';
import { ChevronLeft } from 'lucide-react';

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

export function LovePage({ profile, onBack }: LovePageProps) {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>(profile.partnerSign || 'leo');
  const userSign = profile.sign;
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCheckLove = () => {
    // Navigate to compatibility result or show result
    console.log('Checking love compatibility between', userSign, 'and', selectedSign);
  };

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
