import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from '../locales/en/common.json';
import enTarot from '../locales/en/tarot.json';
import enZodiac from '../locales/en/zodiac.json';
import enReadings from '../locales/en/readings.json';

import viCommon from '../locales/vi/common.json';
import viTarot from '../locales/vi/tarot.json';
import viZodiac from '../locales/vi/zodiac.json';
import viReadings from '../locales/vi/readings.json';

import koCommon from '../locales/ko/common.json';
import koTarot from '../locales/ko/tarot.json';
import koZodiac from '../locales/ko/zodiac.json';
import koReadings from '../locales/ko/readings.json';

import jaCommon from '../locales/ja/common.json';
import jaTarot from '../locales/ja/tarot.json';
import jaZodiac from '../locales/ja/zodiac.json';
import jaReadings from '../locales/ja/readings.json';

const resources = {
  en: {
    common: enCommon,
    tarot: enTarot,
    zodiac: enZodiac,
    readings: enReadings,
  },
  vi: {
    common: viCommon,
    tarot: viTarot,
    zodiac: viZodiac,
    readings: viReadings,
  },
  ko: {
    common: koCommon,
    tarot: koTarot,
    zodiac: koZodiac,
    readings: koReadings,
  },
  ja: {
    common: jaCommon,
    tarot: jaTarot,
    zodiac: jaZodiac,
    readings: jaReadings,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'tarot', 'zodiac', 'readings'],
    
    interpolation: {
      escapeValue: false, // React already escapes
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
