import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { useTranslatedData, useZodiacData, useTarotData, useLoveData } from '../useTranslatedData';

// Mock the data imports
vi.mock('../../data/zodiac.json', () => ({
  default: { aries: 'Aries description' }
}));

vi.mock('../../data/tarot.json', () => ({
  default: { 'MAJOR ARCANA': { '0': 'The Fool' } }
}));

vi.mock('../../data/love.json', () => ({
  default: { aries: { taurus: 'Aries-Taurus compatibility' } }
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
  it('should return English data by default', () => {
    const { result } = renderHook(() => useTranslatedData('zodiac'), { wrapper });
    expect(result.current).toEqual({ aries: 'Aries description' });
  });

  it('should return zodiac data', () => {
    const { result } = renderHook(() => useZodiacData(), { wrapper });
    expect(result.current).toBeDefined();
    expect(result.current.aries).toBe('Aries description');
  });

  it('should return tarot data', () => {
    const { result } = renderHook(() => useTarotData(), { wrapper });
    expect(result.current).toBeDefined();
    expect(result.current['MAJOR ARCANA']).toBeDefined();
  });

  it('should return love data', () => {
    const { result } = renderHook(() => useLoveData(), { wrapper });
    expect(result.current).toBeDefined();
    expect(result.current.aries).toBeDefined();
  });

  it('should handle missing translations gracefully', async () => {
    const { result } = renderHook(() => useTranslatedData('zodiac'), { wrapper });
    
    await i18n.changeLanguage('ko');
    
    await waitFor(() => {
      // Should fall back to English data
      expect(result.current).toBeDefined();
    });
  });
});
