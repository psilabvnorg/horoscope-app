import type { TarotCard } from '@/types';
import { useTarotData } from './useTranslatedData';

type TarotSuit = 'MAJOR ARCANA' | 'WANDS' | 'CUPS' | 'SWORDS' | 'PENTACLES';

const suitMap: Record<string, TarotSuit> = {
  wands: 'WANDS',
  cups: 'CUPS',
  swords: 'SWORDS',
  pentacles: 'PENTACLES',
};

export function useTarotMeanings(card: TarotCard) {
  const tarotMeanings = useTarotData();
  
  const getEnhancedMeaning = (): string | null => {
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
  };
  
  const enhancedMeaning = getEnhancedMeaning();
  
  return {
    basicMeaning: card.meaning,
    enhancedMeaning,
    hasEnhancedMeaning: !!enhancedMeaning,
  };
}
