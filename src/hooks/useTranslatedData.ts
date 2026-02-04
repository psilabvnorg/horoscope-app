import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Import English (default) data
import zodiacEn from '../data/zodiac.json';
import tarotEn from '../data/tarot.json';
import loveEn from '../data/love.json';

type DataType = 'zodiac' | 'tarot' | 'love';

interface TranslatedDataCache {
  [key: string]: any;
}

// Cache for loaded translations
const translationCache: TranslatedDataCache = {};

/**
 * Hook to load translated data files based on current language
 * Falls back to English if translation not available
 */
export function useTranslatedData<T = any>(dataType: DataType): T {
  const { i18n } = useTranslation();
  // Normalize language code (e.g., 'en-US' -> 'en', 'vi-VN' -> 'vi')
  const currentLang = i18n.language.split('-')[0];
  
  const [data, setData] = useState<T>(() => {
    // Return English data immediately as default
    return getDefaultData(dataType) as T;
  });

  useEffect(() => {
    async function loadTranslatedData() {
      // If English, use default data
      if (currentLang === 'en') {
        setData(getDefaultData(dataType) as T);
        return;
      }

      // Check cache first
      const cacheKey = `${dataType}-${currentLang}`;
      if (translationCache[cacheKey]) {
        setData(translationCache[cacheKey]);
        return;
      }

      try {
        // Try to load translated data using explicit imports
        let translatedData;
        
        if (currentLang === 'ja') {
          if (dataType === 'zodiac') {
            translatedData = await import('../data/translations/ja/zodiac.json');
          } else if (dataType === 'tarot') {
            translatedData = await import('../data/translations/ja/tarot.json');
          } else if (dataType === 'love') {
            translatedData = await import('../data/translations/ja/love.json');
          }
        } else if (currentLang === 'ko') {
          if (dataType === 'zodiac') {
            translatedData = await import('../data/translations/ko/zodiac.json');
          } else if (dataType === 'tarot') {
            translatedData = await import('../data/translations/ko/tarot.json');
          } else if (dataType === 'love') {
            translatedData = await import('../data/translations/ko/love.json');
          }
        } else if (currentLang === 'vi') {
          if (dataType === 'zodiac') {
            translatedData = await import('../data/translations/vi/zodiac.json');
          } else if (dataType === 'tarot') {
            translatedData = await import('../data/translations/vi/tarot.json');
          } else if (dataType === 'love') {
            translatedData = await import('../data/translations/vi/love.json');
          }
        }
        
        if (translatedData) {
          // Cache the loaded data
          translationCache[cacheKey] = translatedData.default;
          setData(translatedData.default as T);
        } else {
          throw new Error('Translation not found');
        }
      } catch (error) {
        // If translation not found, fall back to English
        console.warn(
          `[useTranslatedData] Translation not found for ${dataType} in ${currentLang}, using English`,
          error
        );
        setData(getDefaultData(dataType) as T);
      }
    }

    loadTranslatedData();
  }, [currentLang, dataType, i18n.language]);

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
