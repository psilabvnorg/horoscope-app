import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { TarotReading, TarotCard, ZodiacSign } from '@/types';
import { tarotCards } from '@/data/tarotCards';

const DAILY_READING_KEY = 'horos-daily-tarot';
const READING_HISTORY_KEY = 'horos-tarot-history';

export function useTarot() {
  const [dailyReading, setDailyReading] = useLocalStorage<TarotReading | null>(DAILY_READING_KEY, null);
  const [history, setHistory] = useLocalStorage<TarotReading[]>(READING_HISTORY_KEY, []);

  const getDailyCard = useCallback((sign: ZodiacSign): TarotReading => {
    const today = new Date().toDateString();
    const seed = getDeterministicSeed(today + sign);
    const cardIndex = seed % tarotCards.length;
    const card = tarotCards[cardIndex];
    const reversed = (seed % 2) === 1;

    const reading: TarotReading = {
      id: `daily-${today}-${sign}`,
      type: 'daily',
      cards: [{ card, position: 'Daily Card', reversed }],
      interpretation: reversed ? card.meaning.reversed : card.meaning.upright,
      date: new Date().toISOString(),
    };

    setDailyReading(reading);
    return reading;
  }, [setDailyReading]);

  const getThreeCardSpread = useCallback((sign: ZodiacSign): TarotReading => {
    const seed = getDeterministicSeed(new Date().toDateString() + sign + '-3card');
    const positions = ['Past', 'Present', 'Future'];
    const cards: { card: TarotCard; position: string; reversed: boolean }[] = [];
    const usedIndices = new Set<number>();

    for (let i = 0; i < 3; i++) {
      let index: number;
      do {
        index = (seed + i * 17 + Math.floor(Math.random() * tarotCards.length)) % tarotCards.length;
      } while (usedIndices.has(index));
      usedIndices.add(index);

      cards.push({
        card: tarotCards[index],
        position: positions[i],
        reversed: ((seed + i) % 2) === 1,
      });
    }

    const reading: TarotReading = {
      id: `3card-${Date.now()}-${sign}`,
      type: 'three-card',
      cards,
      interpretation: generateThreeCardInterpretation(cards),
      date: new Date().toISOString(),
    };

    setHistory(prev => [reading, ...prev].slice(0, 50));
    return reading;
  }, [setHistory]);

  const getPastPresentFuture = useCallback((sign: ZodiacSign): TarotReading => {
    return getThreeCardSpread(sign);
  }, [getThreeCardSpread]);

  const getRelationshipReading = useCallback((sign1: ZodiacSign, sign2: ZodiacSign): TarotReading => {
    const seed = getDeterministicSeed(new Date().toDateString() + sign1 + sign2 + '-rel');
    const positions = ['Your Energy', 'Partner\'s Energy', 'Relationship Path'];
    const cards: { card: TarotCard; position: string; reversed: boolean }[] = [];
    const usedIndices = new Set<number>();

    for (let i = 0; i < 3; i++) {
      let index: number;
      do {
        index = (seed + i * 23) % tarotCards.length;
      } while (usedIndices.has(index));
      usedIndices.add(index);

      cards.push({
        card: tarotCards[index],
        position: positions[i],
        reversed: ((seed + i) % 3) === 0,
      });
    }

    const reading: TarotReading = {
      id: `rel-${Date.now()}-${sign1}-${sign2}`,
      type: 'relationship',
      cards,
      interpretation: generateRelationshipInterpretation(cards, sign1, sign2),
      date: new Date().toISOString(),
    };

    setHistory(prev => [reading, ...prev].slice(0, 50));
    return reading;
  }, [setHistory]);

  const getCardById = useCallback((id: number): TarotCard | undefined => {
    return tarotCards.find(card => card.id === id);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setDailyReading(null);
  }, [setHistory, setDailyReading]);

  return {
    dailyReading,
    history,
    getDailyCard,
    getThreeCardSpread,
    getPastPresentFuture,
    getRelationshipReading,
    getCardById,
    clearHistory,
  };
}

function getDeterministicSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function generateThreeCardInterpretation(cards: { card: TarotCard; position: string; reversed: boolean }[]): string {
  return cards.map(c => 
    `${c.position}: ${c.card.name} ${c.reversed ? '(Reversed)' : ''} - ${c.reversed ? c.card.meaning.reversed : c.card.meaning.upright}`
  ).join('. ');
}

function generateRelationshipInterpretation(
  cards: { card: TarotCard; position: string; reversed: boolean }[],
  sign1: ZodiacSign,
  sign2: ZodiacSign
): string {
  return `For ${sign1} and ${sign2}: ${generateThreeCardInterpretation(cards)}`;
}
