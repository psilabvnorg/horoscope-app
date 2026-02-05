import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { useTarot } from '../useTarot';

vi.mock('../useTranslatedData', () => ({
  useTarotData: () => ({
    'MAJOR ARCANA': {},
    WANDS: {},
    CUPS: {},
    SWORDS: {},
    PENTACLES: {},
  }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(I18nextProvider, { i18n }, children);

describe('useTarot', () => {
  beforeEach(async () => {
    localStorage.clear();
    await i18n.init({
      lng: 'en',
      fallbackLng: 'en',
      resources: {
        en: { common: {} },
      },
    });
  });

  it('should initialize with no daily reading', () => {
    const { result } = renderHook(() => useTarot(), { wrapper });
    expect(result.current.dailyReading).toBeNull();
    expect(result.current.history).toEqual([]);
  });

  it('should generate daily card for zodiac sign', () => {
    const { result } = renderHook(() => useTarot(), { wrapper });
    
    act(() => {
      const reading = result.current.getDailyCard('aries');
      expect(reading).toBeDefined();
      expect(reading.type).toBe('daily');
      expect(reading.cards).toHaveLength(1);
      expect(reading.cards[0].card).toBeDefined();
    });
  });

  it('should generate same daily card for same day and sign', () => {
    const { result } = renderHook(() => useTarot(), { wrapper });
    
    let reading1: ReturnType<typeof result.current.getDailyCard> | undefined;
    let reading2: ReturnType<typeof result.current.getDailyCard> | undefined;
    act(() => {
      reading1 = result.current.getDailyCard('taurus');
      reading2 = result.current.getDailyCard('taurus');
    });

    expect(reading1).toBeDefined();
    expect(reading2).toBeDefined();
    expect(reading1!.cards[0].card.id).toBe(reading2!.cards[0].card.id);
    expect(reading1!.cards[0].reversed).toBe(reading2!.cards[0].reversed);
  });

  it('should generate three card spread', () => {
    const { result } = renderHook(() => useTarot(), { wrapper });
    
    act(() => {
      const reading = result.current.getThreeCardSpread('gemini');
      expect(reading.type).toBe('three-card');
      expect(reading.cards).toHaveLength(3);
      expect(reading.cards[0].position).toBe('Past');
      expect(reading.cards[1].position).toBe('Present');
      expect(reading.cards[2].position).toBe('Future');
    });
  });

  it('should not have duplicate cards in three card spread', () => {
    const { result } = renderHook(() => useTarot(), { wrapper });
    
    act(() => {
      const reading = result.current.getThreeCardSpread('cancer');
      const cardIds = reading.cards.map(c => c.card.id);
      const uniqueIds = new Set(cardIds);
      expect(uniqueIds.size).toBe(3);
    });
  });

  it('should generate relationship reading', () => {
    const { result } = renderHook(() => useTarot(), { wrapper });
    
    act(() => {
      const reading = result.current.getRelationshipReading('leo', 'virgo');
      expect(reading.type).toBe('relationship');
      expect(reading.cards).toHaveLength(3);
      expect(reading.interpretation).toContain('leo');
      expect(reading.interpretation).toContain('virgo');
    });
  });

  it('should add readings to history', () => {
    const { result } = renderHook(() => useTarot(), { wrapper });
    
    act(() => {
      result.current.getThreeCardSpread('libra');
      result.current.getThreeCardSpread('scorpio');
    });

    expect(result.current.history).toHaveLength(2);
  });

  it('should limit history to 50 readings', () => {
    const { result } = renderHook(() => useTarot(), { wrapper });
    
    act(() => {
      for (let i = 0; i < 55; i++) {
        result.current.getThreeCardSpread('sagittarius');
      }
    });

    expect(result.current.history).toHaveLength(50);
  });

  it('should clear history and daily reading', () => {
    const { result } = renderHook(() => useTarot(), { wrapper });
    
    act(() => {
      result.current.getDailyCard('capricorn');
      result.current.getThreeCardSpread('aquarius');
      result.current.clearHistory();
    });

    expect(result.current.dailyReading).toBeNull();
    expect(result.current.history).toEqual([]);
  });

  it('should get card by id', () => {
    const { result } = renderHook(() => useTarot(), { wrapper });
    
    const card = result.current.getCardById(0);
    expect(card).toBeDefined();
    expect(card?.id).toBe(0);
  });

  it('should return undefined for invalid card id', () => {
    const { result } = renderHook(() => useTarot(), { wrapper });
    
    const card = result.current.getCardById(9999);
    expect(card).toBeUndefined();
  });
});
