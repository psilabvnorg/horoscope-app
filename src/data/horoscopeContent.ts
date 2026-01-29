import type { ZodiacSign, HoroscopeContent } from '@/types';

const todayMessages: string[] = [
  "The stars align in your favor today. Trust your instincts and seize opportunities.",
  "A surprise encounter may lead to something wonderful. Keep your heart open.",
  "Your energy is magnetic today. Others are drawn to your positive aura.",
  "Take time for self-care today. Your soul needs nurturing.",
  "A long-awaited answer finally arrives. The wait was worth it.",
  "Creative inspiration strikes unexpectedly. Capture those ideas.",
  "Someone from your past reappears with important news.",
  "Financial opportunities present themselves. Trust your judgment.",
  "Your intuition is especially strong today. Listen to your inner voice.",
  "A small gesture creates ripples of kindness. Be the change.",
  "Challenges you face today build tomorrow's strength. Persevere.",
  "Love surrounds you in unexpected forms. Notice the signs.",
];

const loveSingleMessages: string[] = [
  "New romance blooms on the horizon. Be open to unexpected connections.",
  "Your soulmate may be closer than you think. Open your eyes to possibilities.",
  "Self-love attracts the right partner. Focus on being your best self.",
  "A chance meeting could spark something magical. Say yes to invitations.",
  "Your confidence attracts admirers. Shine your light brightly.",
  "Love finds you when you least expect it. Trust divine timing.",
  "An old friendship may transform into something more. Explore the connection.",
  "Your heart is ready for love. Release past fears and embrace joy.",
];

const loveRelationshipMessages: string[] = [
  "Deep conversations strengthen your bond. Share your true feelings.",
  "A romantic gesture rekindles the spark. Surprise your partner.",
  "Trust deepens through shared experiences. Create memories together.",
  "Understanding grows as you truly listen. Your patience is rewarded.",
  "Passion reignites in unexpected moments. Keep the fire burning.",
  "Your partnership grows stronger through challenges. Face them united.",
  "Small acts of kindness mean everything today. Show you care.",
  "Dreams align as you plan your future together. Build your vision.",
];

const careerStudentMessages: string[] = [
  "Your hard work pays off with recognition. Celebrate your achievements.",
  "A mentor appears to guide your path. Be open to learning.",
  "New opportunities expand your horizons. Say yes to growth.",
  "Creative solutions solve complex problems. Trust your unique mind.",
  "Collaboration leads to success. Teamwork makes the dream work.",
  "Your dedication opens doors previously closed. Keep pushing forward.",
  "Knowledge gained now serves your future. Invest in yourself.",
  "Confidence in your abilities attracts opportunities. Believe in yourself.",
];

const careerWorkingMessages: string[] = [
  "Leadership opportunities arise. Step up and show your capabilities.",
  "Your innovative ideas catch attention. Share your vision boldly.",
  "A promotion or raise may be coming. Your work speaks for itself.",
  "New projects align with your passions. Dive in with enthusiasm.",
  "Networking opens unexpected doors. Connect with intention.",
  "Your expertise is valued more than you know. Own your worth.",
  "Strategic moves position you for success. Plan your next steps.",
  "Recognition for past efforts arrives. Accept praise graciously.",
];

const moneyMessages: string[] = [
  "Unexpected financial gains brighten your day. Use wisdom with windfalls.",
  "Smart investments made now pay off later. Think long-term.",
  "A new income stream presents itself. Explore all opportunities.",
  "Financial stability grows through careful planning. Budget wisely.",
  "Generosity returns to you multiplied. Give with an open heart.",
  "Your relationship with money transforms. Abundance mindset attracts wealth.",
  "A forgotten asset resurfaces. Check on old accounts.",
  "Creative solutions improve your finances. Think outside the box.",
];

const lifeMessages: string[] = [
  "Personal growth accelerates through new experiences. Embrace change.",
  "Inner peace comes from accepting what you cannot change. Find serenity.",
  "Your authentic self shines through. Live your truth boldly.",
  "Forgiveness frees your spirit. Release what no longer serves you.",
  "Joy multiplies when shared. Spread happiness wherever you go.",
  "Your journey is uniquely yours. Compare less, appreciate more.",
  "Wisdom comes through both joy and pain. All experiences teach.",
  "Balance restores your energy. Prioritize what truly matters.",
];

export function generateDailyHoroscope(
  sign: ZodiacSign,
  gender: string,
  dayOfYear: number
): HoroscopeContent {
  const message = todayMessages[dayOfYear % todayMessages.length];
  
  return {
    id: `today-${sign}-${dayOfYear}`,
    type: 'today',
    sign,
    gender,
    title: `Daily Guidance for ${capitalize(sign)}`,
    short: message.slice(0, 160),
    deep: message,
    score: 70 + (dayOfYear % 25),
    tags: ['daily', 'guidance', 'cosmic'],
    variants: gender === 'female' ? [message + ' Your feminine intuition guides you powerfully today.'] : 
              gender === 'male' ? [message + ' Your masculine energy provides strength and direction.'] : 
              [message + ' Your unique energy creates your path forward.']
  };
}

export function generateLoveHoroscope(
  sign: ZodiacSign,
  gender: string,
  status: 'single' | 'relationship',
  id: number
): HoroscopeContent {
  const messages = status === 'single' ? loveSingleMessages : loveRelationshipMessages;
  const message = messages[id % messages.length];
  
  return {
    id: `love-${sign}-${gender}-${status}-${id}`,
    type: 'love',
    sign,
    gender,
    title: status === 'single' ? 'Love Horoscope for Singles' : 'Relationship Insights',
    short: message.slice(0, 160),
    deep: message,
    score: 60 + (id % 35),
    tags: ['love', 'romance', 'heart'],
    variants: [message]
  };
}

export function generateCareerHoroscope(
  sign: ZodiacSign,
  gender: string,
  status: 'student' | 'working',
  id: number
): HoroscopeContent {
  const messages = status === 'student' ? careerStudentMessages : careerWorkingMessages;
  const message = messages[id % messages.length];
  
  return {
    id: `career-${sign}-${gender}-${status}-${id}`,
    type: 'career',
    sign,
    gender,
    title: status === 'student' ? 'Academic Success' : 'Career Advancement',
    short: message.slice(0, 160),
    deep: message,
    score: 65 + (id % 30),
    tags: ['career', 'success', 'growth'],
    variants: [message]
  };
}

export function generateMoneyHoroscope(
  sign: ZodiacSign,
  gender: string,
  id: number
): HoroscopeContent {
  const message = moneyMessages[id % moneyMessages.length];
  
  return {
    id: `money-${sign}-${gender}-${id}`,
    type: 'money',
    sign,
    gender,
    title: 'Financial Outlook',
    short: message.slice(0, 160),
    deep: message,
    score: 55 + (id % 40),
    tags: ['money', 'abundance', 'prosperity'],
    variants: [message]
  };
}

export function generateFortune(
  topic: 'future' | 'love' | 'career' | 'money' | 'life',
  sign: ZodiacSign,
  dayOfYear: number
): { id: string; topic: 'future' | 'love' | 'career' | 'money' | 'life'; content: string; date: string } {
  let message: string;
  
  switch (topic) {
    case 'love':
      message = loveSingleMessages[dayOfYear % loveSingleMessages.length];
      break;
    case 'career':
      message = careerWorkingMessages[dayOfYear % careerWorkingMessages.length];
      break;
    case 'money':
      message = moneyMessages[dayOfYear % moneyMessages.length];
      break;
    case 'life':
      message = lifeMessages[dayOfYear % lifeMessages.length];
      break;
    case 'future':
    default:
      message = todayMessages[dayOfYear % todayMessages.length];
      break;
  }
  
  return {
    id: `fortune-${topic}-${sign}-${dayOfYear}`,
    topic,
    content: message,
    date: new Date().toISOString()
  };
}

export function generateCoupleCompatibility(
  signA: ZodiacSign,
  signB: ZodiacSign
): { score: number; strengths: string[]; weaknesses: string[]; dailyMessage: string } {
  const seed = signA.charCodeAt(0) + signB.charCodeAt(0);
  const score = 50 + (seed % 45);
  
  const allStrengths = [
    "Deep emotional understanding",
    "Complementary energies",
    "Shared values and goals",
    "Strong physical attraction",
    "Intellectual stimulation",
    "Mutual respect and admiration",
    "Excellent communication",
    "Natural harmony",
    "Supportive partnership",
    "Creative collaboration"
  ];
  
  const allWeaknesses = [
    "Occasional power struggles",
    "Different communication styles",
    "Need for personal space",
    "Stubbornness in conflicts",
    "Emotional sensitivity differences",
    "Pace of life mismatches",
    "Decision-making challenges",
    "Different social needs"
  ];
  
  const messages = [
    "Today brings opportunities to deepen your connection.",
    "A small gesture of love creates lasting warmth.",
    "Understanding grows through patient listening.",
    "Shared laughter strengthens your bond.",
    "Trust deepens as you share vulnerabilities.",
    "Your differences create beautiful balance.",
    "Today is perfect for creating new memories.",
    "Your love story continues to unfold beautifully."
  ];
  
  return {
    score,
    strengths: allStrengths.slice(seed % 3, seed % 3 + 4),
    weaknesses: allWeaknesses.slice((seed + 2) % 4, (seed + 2) % 4 + 3),
    dailyMessage: messages[seed % messages.length]
  };
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
