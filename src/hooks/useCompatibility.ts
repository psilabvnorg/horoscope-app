import { loveCompatibility } from '@/data';
import type { ZodiacSign } from '@/types';

type LoveCompatibilityKey = keyof typeof loveCompatibility;
type PartnerKey = keyof typeof loveCompatibility[LoveCompatibilityKey];

export function useCompatibility(userSign: ZodiacSign, partnerSign: ZodiacSign): string {
  // Capitalize first letter to match JSON keys
  const userKey = userSign.charAt(0).toUpperCase() + userSign.slice(1) as LoveCompatibilityKey;
  const partnerKey = partnerSign.charAt(0).toUpperCase() + partnerSign.slice(1) as PartnerKey;
  
  const compatibility = loveCompatibility[userKey]?.[partnerKey];
  return compatibility || 'Compatibility information not available.';
}

export function getCompatibilityText(userSign: ZodiacSign, partnerSign: ZodiacSign): string {
  const userKey = userSign.charAt(0).toUpperCase() + userSign.slice(1) as LoveCompatibilityKey;
  const partnerKey = partnerSign.charAt(0).toUpperCase() + partnerSign.slice(1) as PartnerKey;
  
  return loveCompatibility[userKey]?.[partnerKey] || 'Compatibility information not available.';
}
