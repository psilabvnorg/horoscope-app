import { useState, useCallback, useEffect } from 'react';
import type { TraitCard, SwipeDirection, UserProfile } from '@/types';
import { getPersonalizedDeck } from '@/data/traits';
import { SwipeCard as SwipeCardComponent } from './SwipeCard';
import { Button } from '@/components/ui/button';
import { X, Check, ArrowUp, RotateCcw, Sparkles } from 'lucide-react';

interface SwipePageProps {
  profile: UserProfile;
  onSwipe: (traitId: string, direction: SwipeDirection) => void;
}

export function SwipePage({ profile, onSwipe }: SwipePageProps) {
  const [deck, setDeck] = useState<TraitCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [forcedDirection, setForcedDirection] = useState<SwipeDirection | null>(null);

  useEffect(() => {
    const initialDeck = getPersonalizedDeck(profile.acceptedTraits, profile.rejectedTraits);
    setDeck(initialDeck);
  }, [profile.acceptedTraits, profile.rejectedTraits]);

  const currentCard = deck[currentIndex];
  const nextCard = deck[currentIndex + 1];

  const handleSwipe = useCallback((direction: SwipeDirection) => {
    if (!currentCard || isAnimating) return;

    setIsAnimating(true);
    setForcedDirection(direction);
    onSwipe(currentCard.id, direction);

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
      setForcedDirection(null);

      if (currentIndex >= deck.length - 5) {
        const newCards = getPersonalizedDeck(
          [...profile.acceptedTraits, currentCard.id],
          profile.rejectedTraits
        ).filter(c => !deck.some(d => d.id === c.id));
        setDeck(prev => [...prev, ...newCards.slice(0, 10)]);
      }
    }, 500);
  }, [currentCard, currentIndex, deck, isAnimating, onSwipe, profile]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    const newDeck = getPersonalizedDeck([], []);
    setDeck(newDeck);
  }, []);

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-8 bg-black">
        <div className="w-32 h-32 rounded-2xl border border-violet-500/30 bg-violet-500/5 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.15)]">
          <Sparkles className="w-16 h-16 text-violet-400" />
        </div>
        <div className="space-y-4 max-w-xs">
          <h3 className="text-2xl font-semibold uppercase tracking-widest text-white">Enlightened</h3>
          <p className="text-gray-500 text-sm">
            You've explored {profile.swipeCount} traits. The stars are satisfied for now.
          </p>
        </div>
        <Button onClick={handleReset} className="rounded-full px-8 py-6 bg-violet-400 hover:bg-violet-300 text-black gap-2 uppercase tracking-widest text-xs font-semibold">
          <RotateCcw className="w-4 h-4" />
          Seek more
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black overflow-hidden">
      {/* Header */}
      <header className="p-4 pt-6 flex justify-between items-center">
        <h1 className="text-lg font-semibold tracking-widest uppercase text-white">Discovery</h1>
        <div className="text-xs font-medium uppercase tracking-widest text-violet-400">
          {currentIndex + 1} / {deck.length}
        </div>
      </header>

      {/* Card stack area */}
      <div className="flex-1 relative px-6 py-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md aspect-[3/4] relative">
          {/* Next Card Preview */}
          {nextCard && (
            <div className="absolute inset-0 scale-95 translate-y-6 opacity-20 pointer-events-none">
              <div className="w-full h-full rounded-3xl border border-violet-500/20 bg-gray-900/50" />
            </div>
          )}

          {/* Current Card */}
          <SwipeCardComponent
            key={currentCard.id}
            trait={currentCard}
            onSwipe={handleSwipe}
            isTop={true}
            forcedDirection={forcedDirection}
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="p-6 pb-24">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            className="w-16 h-16 rounded-2xl border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:border-violet-500/30 text-gray-400 hover:text-white p-0 transition-all"
            onClick={() => handleSwipe('left')}
            disabled={isAnimating}
          >
            <X className="w-7 h-7" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-14 h-14 rounded-2xl border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:border-violet-500/30 text-violet-400 p-0 transition-all"
            onClick={() => handleSwipe('up')}
            disabled={isAnimating}
          >
            <ArrowUp className="w-6 h-6" />
          </Button>

          <Button
            size="lg"
            className="w-16 h-16 rounded-2xl bg-violet-400 hover:bg-violet-300 text-black p-0 transition-all"
            onClick={() => handleSwipe('right')}
            disabled={isAnimating}
          >
            <Check className="w-7 h-7" />
          </Button>
        </div>
      </div>
    </div>
  );
}
