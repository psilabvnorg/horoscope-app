import { useLoveData } from './useTranslatedData';
import type { ZodiacSign } from '@/types';

export function useCompatibility(userSign: ZodiacSign, partnerSign: ZodiacSign): string {
  const loveCompatibility = useLoveData();
  
  // Capitalize first letter to match JSON keys
  const userKey = userSign.charAt(0).toUpperCase() + userSign.slice(1);
  const partnerKey = partnerSign.charAt(0).toUpperCase() + partnerSign.slice(1);
  
  const compatibility = loveCompatibility[userKey]?.[partnerKey];
  return compatibility || 'Compatibility information not available.';
}

export function getCompatibilityText(userSign: ZodiacSign, partnerSign: ZodiacSign, loveData: Record<string, Record<string, string>>): string {
  const userKey = userSign.charAt(0).toUpperCase() + userSign.slice(1);
  const partnerKey = partnerSign.charAt(0).toUpperCase() + partnerSign.slice(1);
  
  return loveData[userKey]?.[partnerKey] || 'Compatibility information not available.';
}
