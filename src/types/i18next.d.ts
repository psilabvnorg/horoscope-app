import 'react-i18next';
import common from '../locales/en/common.json';
import tarot from '../locales/en/tarot.json';
import zodiac from '../locales/en/zodiac.json';
import readings from '../locales/en/readings.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      tarot: typeof tarot;
      zodiac: typeof zodiac;
      readings: typeof readings;
    };
  }
}
