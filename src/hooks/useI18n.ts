import { useTranslation } from 'react-i18next';

/**
 * Custom hook for easier i18n usage
 * Provides common translation functions and language utilities
 */
export function useI18n() {
  const { t, i18n } = useTranslation();

  return {
    // Translation function
    t,
    
    // Current language code
    currentLanguage: i18n.language,
    
    // Change language
    changeLanguage: (lang: string) => i18n.changeLanguage(lang),
    
    // Check if current language is...
    isEnglish: i18n.language === 'en',
    isVietnamese: i18n.language === 'vi',
    isKorean: i18n.language === 'ko',
    isJapanese: i18n.language === 'ja',
    
    // Get language name
    getLanguageName: () => {
      const names: Record<string, string> = {
        en: 'English',
        vi: 'Tiếng Việt',
        ko: '한국어',
        ja: '日本語',
      };
      return names[i18n.language] || 'English';
    },
    
    // Get language flag emoji
    getLanguageFlag: () => {
      const flags: Record<string, string> = {
        en: '🇺🇸',
        vi: '🇻🇳',
        ko: '🇰🇷',
        ja: '🇯🇵',
      };
      return flags[i18n.language] || '🇺🇸';
    },
  };
}

/**
 * Hook for specific namespace
 */
export function useI18nNamespace(namespace: 'common' | 'tarot' | 'zodiac' | 'readings') {
  const { t, i18n } = useTranslation(namespace);
  
  return {
    t,
    currentLanguage: i18n.language,
    changeLanguage: (lang: string) => i18n.changeLanguage(lang),
  };
}

/**
 * Usage examples:
 * 
 * // Basic usage
 * const { t, currentLanguage, changeLanguage } = useI18n();
 * 
 * // With namespace
 * const { t } = useI18nNamespace('tarot');
 * 
 * // Check language
 * const { isJapanese, getLanguageFlag } = useI18n();
 * if (isJapanese) {
 *   // Show Japanese-specific content
 * }
 */
