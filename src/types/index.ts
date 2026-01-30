// Horos App Types

export interface UserProfile {
  name: string;
  birthday: string;
  birthTime?: string;
  birthLocation?: string;
  gender: 'male' | 'female' | 'other';
  relationshipStatus?: string;
  sign: ZodiacSign;
  partnerBirthday?: string;
  partnerSign?: ZodiacSign;
  acceptedTraits: string[];
  rejectedTraits: string[];
  swipeCount: number;
  interests: Record<string, number>;
  createdAt: string;
}

export type ZodiacSign = 
  | 'aries' | 'taurus' | 'gemini' | 'cancer' 
  | 'leo' | 'virgo' | 'libra' | 'scorpio' 
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export interface TraitCard {
  id: string;
  trait: string;
  description: string;
  category: string;
  emoji: string;
}

export interface TarotCard {
  id: number;
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'cups' | 'pentacles' | 'swords' | 'wands';
  number?: number;
  image: string;
  keywords: string[];
  meaning: {
    upright: string;
    reversed: string;
  };
}

export interface TarotReading {
  id: string;
  type: 'daily' | 'three-card' | 'past-present-future' | 'relationship';
  cards: { card: TarotCard; position: string; reversed: boolean }[];
  interpretation: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export type SwipeDirection = 'left' | 'right' | 'up';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer',
  'leo', 'virgo', 'libra', 'scorpio',
  'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

export const ZODIAC_DATES: Record<ZodiacSign, { start: [number, number]; end: [number, number] }> = {
  aries: { start: [3, 21], end: [4, 19] },
  taurus: { start: [4, 20], end: [5, 20] },
  gemini: { start: [5, 21], end: [6, 20] },
  cancer: { start: [6, 21], end: [7, 22] },
  leo: { start: [7, 23], end: [8, 22] },
  virgo: { start: [8, 23], end: [9, 22] },
  libra: { start: [9, 23], end: [10, 22] },
  scorpio: { start: [10, 23], end: [11, 21] },
  sagittarius: { start: [11, 22], end: [12, 21] },
  capricorn: { start: [12, 22], end: [1, 19] },
  aquarius: { start: [1, 20], end: [2, 18] },
  pisces: { start: [2, 19], end: [3, 20] }
};

export function getZodiacSign(dateStr: string): ZodiacSign {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  for (const [sign, range] of Object.entries(ZODIAC_DATES)) {
    const [startMonth, startDay] = range.start;
    const [endMonth, endDay] = range.end;
    
    if (startMonth === endMonth) {
      if (month === startMonth && day >= startDay && day <= endDay) {
        return sign as ZodiacSign;
      }
    } else {
      if ((month === startMonth && day >= startDay) || 
          (month === endMonth && day <= endDay) ||
          (month > startMonth && month < endMonth) ||
          (startMonth > endMonth && (month >= startMonth || month <= endMonth))) {
        return sign as ZodiacSign;
      }
    }
  }
  return 'aries';
}
