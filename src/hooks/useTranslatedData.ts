import { useTranslation } from 'react-i18next';
import { useAsyncData } from './useAsyncData';
import type {
  DailyForecastData,
  ElementBalanceData,
  TuViCompatibilityEntry,
  TuViSign,
  TuViSignProfile,
} from '@/types';

// Import English (default) data
import zodiacEn from '../data/zodiac.json';
import tarotEn from '../data/tarot.json';
import loveEn from '../data/love.json';
import elementBalanceEn from '../data/element-balance.json';
import zodiacCalendarEn from '../data/zodiac-star-calendar-2026.json';
import {
  getDailyForecast,
  getElementBalance,
  getLoveCompatibility,
  getTarotMeanings,
  getTuViCompatibility,
  getTuViProfiles,
  getZodiacCalendar,
  getZodiacDescriptions,
} from '@/data/queries';

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
      try {
        switch (dataType) {
          case 'zodiac': {
            const result = await getZodiacDescriptions(currentLang);
            return (Object.keys(result).length ? result : getDefaultData(dataType)) as T;
          }
          case 'tarot': {
            const result = await getTarotMeanings(currentLang);
            return (Object.keys(result['MAJOR ARCANA'] || {}).length ? result : getDefaultData(dataType)) as T;
          }
          case 'love': {
            const result = await getLoveCompatibility(currentLang);
            return (Object.keys(result).length ? result : getDefaultData(dataType)) as T;
          }
          case 'element-balance': {
            const result = await getElementBalance(currentLang);
            return (Object.keys(result).length ? result : getDefaultData(dataType)) as T;
          }
          case 'zodiac-star-calendar-2026': {
            const result = await getZodiacCalendar(currentLang);
            return (Object.keys(result).length ? result : getDefaultData(dataType)) as T;
          }
          default:
            return getDefaultData(dataType) as T;
        }
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

export function useTuViProfiles() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0];
  const { data } = useAsyncData<Record<TuViSign, TuViSignProfile> | Record<string, never>>({
    loader: async () => {
      const result = await getTuViProfiles(currentLang);
      return Object.keys(result).length ? result : {};
    },
    fallback: {} as Record<string, never>,
    cacheKey: `tuvi-profiles-${currentLang}`,
    dependencies: [currentLang],
  });
  return data as Partial<Record<TuViSign, TuViSignProfile>>;
}

export function useTuViCompatibility() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0];
  const { data } = useAsyncData<Record<TuViSign, TuViCompatibilityEntry[]> | Record<string, never>>({
    loader: async () => {
      const result = await getTuViCompatibility(currentLang);
      return Object.keys(result).length ? result : {};
    },
    fallback: {} as Record<string, never>,
    cacheKey: `tuvi-compat-${currentLang}`,
    dependencies: [currentLang],
  });
  return data as Partial<Record<TuViSign, TuViCompatibilityEntry[]>>;
}

export function useDailyForecast(signSlug: string) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0];
  const { data } = useAsyncData<DailyForecastData | null>({
    loader: async () => getDailyForecast(signSlug, currentLang),
    fallback: null,
    cacheKey: `daily-forecast-${signSlug}-${currentLang}`,
    dependencies: [signSlug, currentLang],
  });
  return data;
}
