import { useTranslation } from 'react-i18next';
import { useAsyncData } from './useAsyncData';
import { getDailyForecast } from '@/data/queries';
import type { DailyForecastData, ZodiacSign } from '@/types';

const emptyForecast: DailyForecastData = {
  date: null,
  summary: null,
  scores: { love: null, career: null, emotion: null, energy: null },
  lucky: { numbers: [], color: null, direction: null, hours: [] },
  actions: [],
};

export function useDailyForecast(sign: ZodiacSign) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return useAsyncData({
    loader: () => getDailyForecast(sign, lang).then((data) => data || emptyForecast),
    fallback: emptyForecast,
    cacheKey: `daily-forecast-${sign}-${lang}`,
    dependencies: [sign, lang],
  });
}
