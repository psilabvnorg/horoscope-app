import { useZodiacCalendarData } from '@/hooks/useTranslatedData';
import type { ZodiacSign, EnergyStatus } from '@/types';

const MONTH_KEYS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

type MonthKey = (typeof MONTH_KEYS)[number];

export interface MonthlyEnergyData {
  status: EnergyStatus;
  description: string;
  month: string;
  fullDescription: string;
}

export function useMonthlyEnergy(sign: ZodiacSign, month?: number): MonthlyEnergyData {
  const zodiacCalendar = useZodiacCalendarData();
  const currentMonth = month ?? new Date().getMonth();
  const monthKey = MONTH_KEYS[currentMonth] as MonthKey;
  const signKey = sign.charAt(0).toUpperCase() + sign.slice(1);
  
  const signData = zodiacCalendar[signKey] as Record<string, string> | undefined;
  const fullDescription = signData?.[monthKey] || '';
  
  // Parse status from description (e.g., "aligned – ..." or "compatible – ..." or "challenging – ...")
  let status: EnergyStatus = 'compatible';
  if (fullDescription.startsWith('aligned')) {
    status = 'aligned';
  } else if (fullDescription.startsWith('challenging')) {
    status = 'challenging';
  }
  
  // Extract description after the dash
  const description = fullDescription.split(' – ')[1] || fullDescription;
  
  return {
    status,
    description,
    month: monthKey,
    fullDescription,
  };
}

export function getYearlyEnergy(sign: ZodiacSign): MonthlyEnergyData[] {
  return MONTH_KEYS.map((_, index) => useMonthlyEnergy(sign, index));
}
