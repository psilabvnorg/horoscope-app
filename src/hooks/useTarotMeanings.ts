import { tarotMeanings } from '@/data';
import type { TarotCard } from '@/types';

type TarotSuit = 'MAJOR ARCANA' | 'WANDS' | 'CUPS' | 'SWORDS' | 'PENTACLES';

const suitMap: Record<string, TarotSuit> = {
  wands: 'WANDS',
  cups: 'CUPS',
  swords: 'SWORDS',
  pentacles: 'PENTACLES',
};

export function getEnhancedMeaning(card: TarotCard): string | null {
  if (card.arcana === 'major') {
    const majorArcana = tarotMeanings['MAJOR ARCANA'] as Record<string, string>;
    return majorArcana[card.name] || null;
  }
  
  if (card.suit) {
    const suitKey = suitMap[card.suit];
    if (suitKey) {
      const suitCards = tarotMeanings[suitKey] as Record<string, string>;
      return suitCards[card.name] || null;
    }
  }
  
  return null;
}

export function useTarotMeanings(card: TarotCard) {
  const enhancedMeaning = getEnhancedMeaning(card);
  
  return {
    basicMeaning: card.meaning,
    enhancedMeaning,
    hasEnhancedMeaning: !!enhancedMeaning,
  };
}
