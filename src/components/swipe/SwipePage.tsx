import { useState, useCallback, useEffect, useMemo } from 'react';
import type { TraitCard, SwipeDirection, UserProfile } from '@/types';
import { traitCards, getPersonalizedDeck } from '@/data/traits';
import { SwipeCard as SwipeCardComponent } from './SwipeCard';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowUp, Share2, Sparkles, RotateCcw } from 'lucide-react';

interface SwipePageProps {
  profile: UserProfile;
  onSwipe: (traitId: string, direction: SwipeDirection) => void;
}

export function SwipePage({ profile, onSwipe }: SwipePageProps) {
  const [deck, setDeck] = useState<TraitCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize deck
  useEffect(() => {
    const initialDeck = getPersonalizedDeck(profile.acceptedTraits, profile.rejectedTraits);
    setDeck(initialDeck);
  }, [profile.acceptedTraits, profile.rejectedTraits]);

  const currentCard = deck[currentIndex];
  const nextCard = deck[currentIndex + 1];

  const handleSwipe = useCallback((direction: SwipeDirection) => {
    if (!currentCard || isAnimating) return;
    
    setIsAnimating(true);
    onSwipe(currentCard.id, direction);
    
    // Animate card off screen
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
      
      // Replenish deck if running low
      if (currentIndex >= deck.length - 5) {
        const newCards = getPersonalizedDeck(
          [...profile.acceptedTraits, currentCard.id],
          profile.rejectedTraits
        ).filter(c => !deck.some(d => d.id === c.id));
        setDeck(prev => [...prev, ...newCards.slice(0, 10)]);
      }
    }, 300);
  }, [currentCard, currentIndex, deck, isAnimating, onSwipe, profile]);

  const handleButtonSwipe = useCallback((direction: SwipeDirection) => {
    handleSwipe(direction);
  }, [handleSwipe]);

  const handleShare = useCallback(async () => {
    if (!currentCard) return;
    
    try {
      await navigator.share({
        title: `I'm ${currentCard.trait}!`,
        text: currentCard.description,
        url: window.location.href,
      });
    } catch {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`I'm ${currentCard.trait}! ${currentCard.description}`);
    }
  }, [currentCard]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    const newDeck = getPersonalizedDeck([], []);
    setDeck(newDeck);
  }, []);

  const progress = useMemo(() => {
    const total = traitCards.length;
    const seen = profile.acceptedTraits.length + profile.rejectedTraits.length;
    return Math.min((seen / total) * 100, 100);
  }, [profile]);

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">You've seen all traits!</h3>
          <p className="text-muted-foreground">
            You've explored {profile.acceptedTraits.length + profile.rejectedTraits.length} traits
          </p>
        </div>
        <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <Button onClick={handleReset} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-lg font-semibold">Discover Yourself</h2>
          <p className="text-sm text-muted-foreground">
            {profile.swipeCount} traits explored
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {deck.length}
          </span>
        </div>
      </div>

      {/* Card stack */}
      <div className="flex-1 relative p-4 max-w-md mx-auto w-full min-h-0">
        <div className="relative w-full h-full min-h-[400px] max-h-[600px]">
          {/* Background card */}
          {nextCard && (
            <div className="absolute inset-0 scale-95 opacity-50 translate-y-4">
              <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-3xl shadow-lg" />
            </div>
          )}
          
          {/* Current card */}
          <SwipeCardComponent
            trait={currentCard}
            onSwipe={handleSwipe}
            isTop={true}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-6 border-t bg-white/50 dark:bg-black/50 backdrop-blur-sm relative z-0">
        <div className="flex items-center justify-center gap-4 max-w-sm mx-auto">
          {/* Reject */}
          <Button
            variant="outline"
            size="lg"
            className="w-16 h-16 rounded-full border-2 border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-900 dark:hover:bg-red-950"
            onClick={() => handleButtonSwipe('left')}
            disabled={isAnimating}
          >
            <X className="w-8 h-8 text-red-500" />
          </Button>

          {/* Share */}
          <Button
            variant="outline"
            size="lg"
            className="w-14 h-14 rounded-full"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
          </Button>

          {/* Very accurate (up) */}
          <Button
            variant="outline"
            size="lg"
            className="w-14 h-14 rounded-full border-2 border-violet-200 hover:bg-violet-50 hover:border-violet-300 dark:border-violet-900 dark:hover:bg-violet-950"
            onClick={() => handleButtonSwipe('up')}
            disabled={isAnimating}
          >
            <ArrowUp className="w-5 h-5 text-violet-500" />
          </Button>

          {/* Accept */}
          <Button
            variant="outline"
            size="lg"
            className="w-16 h-16 rounded-full border-2 border-green-200 hover:bg-green-50 hover:border-green-300 dark:border-green-900 dark:hover:bg-green-950"
            onClick={() => handleButtonSwipe('right')}
            disabled={isAnimating}
          >
            <Check className="w-8 h-8 text-green-500" />
          </Button>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
          <span>Swipe or tap buttons</span>
        </div>
      </div>

      {/* Accepted traits summary */}
      {profile.acceptedTraits.length > 0 && (
        <div className="px-4 pb-4">
          <p className="text-sm text-muted-foreground mb-2">Your traits:</p>
          <div className="flex flex-wrap gap-2">
            {profile.acceptedTraits.slice(-5).map(traitId => {
              const trait = traitCards.find(t => t.id === traitId);
              return trait ? (
                <span 
                  key={traitId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs"
                >
                  {trait.emoji} {trait.trait}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
