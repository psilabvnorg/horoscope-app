import { useTranslation } from 'react-i18next';
import { useAsyncData } from './useAsyncData';
import type { ElementBalanceData } from '@/types';

// Import English (default) data
import zodiacEn from '../data/zodiac.json';
import tarotEn from '../data/tarot.json';
import loveEn from '../data/love.json';
import elementBalanceEn from '../data/element-balance.json';
import zodiacCalendarEn from '../data/zodiac-star-calendar-2026.json';

type DataType = 'zodiac' | 'tarot' | 'love' | 'element-balance' | 'zodiac-star-calendar-2026';

/**
 * Hook to load translated data files based on current language
 * Falls back to English if translation not available
 */
export function useTranslatedData<T = any>(dataType: DataType): T {
  const { i18n } = useTranslation();
  // Normalize language code (e.g., 'en-US' -> 'en', 'vi-VN' -> 'vi')
  const currentLang = i18n.language.split('-')[0];
  
  const { data } = useAsyncData<T>({
    loader: async () => {
      // If English, use default data
      if (currentLang === 'en') {
        return getDefaultData(dataType) as T;
      }

      try {
        // Dynamic import based on language and data type
        const translatedData = await import(`../data/translations/${currentLang}/${dataType}.json`);
        return translatedData.default as T;
      } catch (error) {
        // If translation not found, fall back to English
        console.warn(
          `[useTranslatedData] Translation not found for ${dataType} in ${currentLang}, using English`,
          error
        );
        return getDefaultData(dataType) as T;
      }
    },
    fallback: getDefaultData(dataType) as T,
    cacheKey: `${dataType}-${currentLang}`,
    dependencies: [currentLang, dataType],
  });

  return data;
}

/**
 * Get default English data
 */
function getDefaultData(dataType: DataType): any {
  switch (dataType) {
    case 'zodiac':
      return zodiacEn;
    case 'tarot':
      return tarotEn;
    case 'love':
      return loveEn;
    case 'element-balance':
      return elementBalanceEn;
    case 'zodiac-star-calendar-2026':
      return zodiacCalendarEn;
    default:
      return {};
  }
}

/**
 * Hook specifically for zodiac data
 */
export function useZodiacData() {
  return useTranslatedData<Record<string, string>>('zodiac');
}

/**
 * Hook specifically for tarot data
 */
export function useTarotData() {
  return useTranslatedData<{
    'MAJOR ARCANA': Record<string, string>;
    WANDS: Record<string, string>;
    CUPS: Record<string, string>;
    SWORDS: Record<string, string>;
    PENTACLES: Record<string, string>;
  }>('tarot');
}

/**
 * Hook specifically for love compatibility data
 */
export function useLoveData() {
  return useTranslatedData<Record<string, Record<string, string>>>('love');
}

/**
 * Hook specifically for element balance data
 */
export function useElementBalanceData() {
  return useTranslatedData<ElementBalanceData>('element-balance');
}

/**
 * Hook specifically for zodiac calendar data
 */
export function useZodiacCalendarData() {
  return useTranslatedData<Record<string, Record<string, string>>>('zodiac-star-calendar-2026');
}
