import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { useTranslatedData, useZodiacData, useTarotData, useLoveData } from '../useTranslatedData';

vi.mock('@/data/queries', () => ({
  getZodiacDescriptions: vi.fn(async () => ({ aries: 'Aries description' })),
  getTarotMeanings: vi.fn(async () => ({ 'MAJOR ARCANA': { '0': 'The Fool' }, WANDS: {}, CUPS: {}, SWORDS: {}, PENTACLES: {} })),
  getLoveCompatibility: vi.fn(async () => ({ aries: { taurus: 'Aries-Taurus compatibility' } })),
  getElementBalance: vi.fn(async () => ({ fire: { signs: ['aries'], keywords: [], balance: '', imbalance: '', tips: [] }, earth: { signs: [], keywords: [], balance: '', imbalance: '', tips: [] }, air: { signs: [], keywords: [], balance: '', imbalance: '', tips: [] }, water: { signs: [], keywords: [], balance: '', imbalance: '', tips: [] } })),
  getZodiacCalendar: vi.fn(async () => ({ aries: { Jan: 'aligned – test (Fire)' } })),
}));

beforeEach(async () => {
  await i18n.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: { common: {} },
      vi: { common: {} },
    },
  });
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

describe('useTranslatedData', () => {
  it('should return English data by default', async () => {
    const { result } = renderHook(() => useTranslatedData('zodiac'), { wrapper });
    await waitFor(() => {
      expect(result.current).toEqual({ aries: 'Aries description' });
    });
  });

  it('should return zodiac data', async () => {
    const { result } = renderHook(() => useZodiacData(), { wrapper });
    await waitFor(() => {
      expect(result.current).toBeDefined();
      expect(result.current.aries).toBe('Aries description');
    });
  });

  it('should return tarot data', async () => {
    const { result } = renderHook(() => useTarotData(), { wrapper });
    await waitFor(() => {
      expect(result.current).toBeDefined();
      expect(result.current['MAJOR ARCANA']).toBeDefined();
    });
  });

  it('should return love data', async () => {
    const { result } = renderHook(() => useLoveData(), { wrapper });
    await waitFor(() => {
      expect(result.current).toBeDefined();
      expect(result.current.aries).toBeDefined();
    });
  });

  it('should handle missing translations gracefully', async () => {
    const { result } = renderHook(() => useTranslatedData('zodiac'), { wrapper });
    
    await act(async () => {
      await i18n.changeLanguage('ko');
    });
    
    await waitFor(() => {
      // Should fall back to English data
      expect(result.current).toBeDefined();
    });
  });
});
