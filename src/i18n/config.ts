import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from '../locales/en/common.json';
import enTarot from '../locales/en/tarot.json';
import enZodiac from '../locales/en/zodiac.json';
import enReadings from '../locales/en/readings.json';
import enTuVi from '../locales/en/tuvi.json';

import viCommon from '../locales/vi/common.json';
import viTarot from '../locales/vi/tarot.json';
import viZodiac from '../locales/vi/zodiac.json';
import viReadings from '../locales/vi/readings.json';
import viTuVi from '../locales/vi/tuvi.json';

import koCommon from '../locales/ko/common.json';
import koTarot from '../locales/ko/tarot.json';
import koZodiac from '../locales/ko/zodiac.json';
import koReadings from '../locales/ko/readings.json';
import koTuVi from '../locales/ko/tuvi.json';

import jaCommon from '../locales/ja/common.json';
import jaTarot from '../locales/ja/tarot.json';
import jaZodiac from '../locales/ja/zodiac.json';
import jaReadings from '../locales/ja/readings.json';
import jaTuVi from '../locales/ja/tuvi.json';

const resources = {
  en: {
    common: enCommon,
    tarot: enTarot,
    zodiac: enZodiac,
    readings: enReadings,
    tuvi: enTuVi,
  },
  vi: {
    common: viCommon,
    tarot: viTarot,
    zodiac: viZodiac,
    readings: viReadings,
    tuvi: viTuVi,
  },
  ko: {
    common: koCommon,
    tarot: koTarot,
    zodiac: koZodiac,
    readings: koReadings,
    tuvi: koTuVi,
  },
  ja: {
    common: jaCommon,
    tarot: jaTarot,
    zodiac: jaZodiac,
    readings: jaReadings,
    tuvi: jaTuVi,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'tarot', 'zodiac', 'readings', 'tuvi'],
    
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
