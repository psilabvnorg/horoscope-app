import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

interface TarotCardSelectionProps {
  onBack: () => void;
  onComplete: (selectedCards: number[]) => void;
}

const TOTAL_CARDS_TO_SELECT = 3;

export function TarotCardSelection({ onBack, onComplete }: TarotCardSelectionProps) {
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const cardsLeft = TOTAL_CARDS_TO_SELECT - selectedCards.length;

  const handleCardSelect = (cardIndex: number) => {
    if (selectedCards.includes(cardIndex)) return;
    if (selectedCards.length >= TOTAL_CARDS_TO_SELECT) return;

    const newSelected = [...selectedCards, cardIndex];
    setSelectedCards(newSelected);

    if (newSelected.length === TOTAL_CARDS_TO_SELECT) {
      setTimeout(() => onComplete(newSelected), 500);
    }
  };

  // Fan cards (8 cards in the deck)
  const deckCards = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="flex flex-col h-full bg-[#0a0a1a] text-white overflow-hidden">
      {/* Header */}
      <header className="p-4 pt-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-light tracking-[0.15em] uppercase text-white/90">
          Card Selection
        </h1>
      </header>

      {/* Selected Cards Slots */}
      <div className="px-4 py-6">
        <div className="flex justify-center gap-3">
          {Array.from({ length: TOTAL_CARDS_TO_SELECT }).map((_, index) => (
            <div
              key={index}
              className={`w-24 h-36 rounded-xl transition-all duration-300 ${
                index < selectedCards.length
                  ? 'bg-indigo-600/80 border-2 border-indigo-400/60'
                  : 'border-2 border-dashed border-indigo-400/40 bg-transparent'
              }`}
            >
              {index < selectedCards.length && <TarotCardBack size="slot" />}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-6 py-4">
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_CARDS_TO_SELECT }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === selectedCards.length
                  ? 'w-8 h-8 bg-[#1a1a2e] border border-white/30 flex items-center justify-center'
                  : i < selectedCards.length
                  ? 'bg-indigo-400'
                  : 'bg-white/30'
              }`}
            >
              {i === selectedCards.length && (
                <span className="text-sm font-medium">{selectedCards.length + 1}</span>
              )}
            </div>
          ))}
        </div>
        <span className="text-white/70 text-sm">
          {cardsLeft} card{cardsLeft !== 1 ? 's' : ''} left
        </span>
      </div>

      {/* Card Fan */}
      <div className="flex-1 relative mt-8">
        {/* Arc guide line */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-80 h-40">
          <svg viewBox="0 0 320 160" className="w-full h-full">
            <path
              d="M 20 140 Q 160 20 300 140"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Center indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-white/30 bg-white/10" />

        {/* Fan of cards */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
          {deckCards.map((cardIndex, i) => {
            const isSelected = selectedCards.includes(cardIndex);
            const totalCards = deckCards.length;
            const angleRange = 70; // Total spread angle
            const startAngle = -angleRange / 2;
            const angleStep = angleRange / (totalCards - 1);
            const angle = startAngle + i * angleStep;
            const radius = 180;

            return (
              <button
                key={cardIndex}
                onClick={() => handleCardSelect(cardIndex)}
                disabled={isSelected || selectedCards.length >= TOTAL_CARDS_TO_SELECT}
                className={`absolute transition-all duration-300 ${
                  isSelected ? 'opacity-30 scale-90' : 'hover:scale-110 hover:-translate-y-4'
                }`}
                style={{
                  transform: `rotate(${angle}deg) translateY(-${radius}px)`,
                  transformOrigin: 'bottom center',
                  left: '-40px',
                  bottom: '0',
                }}
              >
                <div style={{ transform: `rotate(${-angle * 0.3}deg)` }}>
                  <TarotCardBack size="fan" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


// Tarot card back design matching the Figma
function TarotCardBack({ size }: { size: 'fan' | 'slot' }) {
  const sizeClasses = size === 'fan' ? 'w-20 h-32' : 'w-full h-full';

  return (
    <div className={`${sizeClasses} rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 border border-indigo-400/50 p-2 shadow-lg shadow-indigo-900/50`}>
      <div className="w-full h-full border border-indigo-300/30 rounded-lg flex flex-col items-center justify-between py-2 relative overflow-hidden">
        {/* Top triple moon */}
        <div className="flex items-center gap-0.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 4C8 4 5 7 5 11C5 15 8 18 12 18C8 18 5 15 5 11C5 7 8 4 12 4Z" fill="currentColor" className="text-indigo-300/60"/>
          </svg>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="6" fill="currentColor" className="text-indigo-300/60"/>
          </svg>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 4C16 4 19 7 19 11C19 15 16 18 12 18C16 18 19 15 19 11C19 7 16 4 12 4Z" fill="currentColor" className="text-indigo-300/60"/>
          </svg>
        </div>

        {/* Center design - Triple goddess symbol */}
        <div className="flex flex-col items-center">
          {/* Sun rays */}
          <div className="relative">
            <div className="absolute -inset-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-2 bg-indigo-300/40 left-1/2 -translate-x-1/2"
                  style={{
                    transform: `rotate(${i * 30}deg) translateY(-12px)`,
                    transformOrigin: 'center 16px',
                  }}
                />
              ))}
            </div>
            {/* Inner circle with figure */}
            <div className="w-8 h-8 rounded-full border border-indigo-300/50 flex items-center justify-center bg-indigo-900/30">
              <div className="w-4 h-4 rounded-full bg-indigo-300/30 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-300/60" />
              </div>
            </div>
          </div>

          {/* Pentacle */}
          <div className="mt-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1" className="text-indigo-300/40"/>
              <path d="M12 4L14.5 10H19.5L15.5 14L17.5 20L12 16L6.5 20L8.5 14L4.5 10H9.5L12 4Z" stroke="currentColor" strokeWidth="1" fill="none" className="text-indigo-300/40"/>
            </svg>
          </div>
        </div>

        {/* Bottom triple moon (inverted) */}
        <div className="flex items-center gap-0.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 4C8 4 5 7 5 11C5 15 8 18 12 18C8 18 5 15 5 11C5 7 8 4 12 4Z" fill="currentColor" className="text-indigo-300/60"/>
          </svg>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="6" fill="currentColor" className="text-indigo-300/60"/>
          </svg>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 4C16 4 19 7 19 11C19 15 16 18 12 18C16 18 19 15 19 11C19 7 16 4 12 4Z" fill="currentColor" className="text-indigo-300/60"/>
          </svg>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-indigo-300/30 rounded-tl" />
        <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-indigo-300/30 rounded-tr" />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-indigo-300/30 rounded-bl" />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-indigo-300/30 rounded-br" />
      </div>
    </div>
  );
}
