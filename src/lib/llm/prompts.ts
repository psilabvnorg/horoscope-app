import type { UserProfile } from '@/types';
import { zodiacData, loveCompatibility, tarotMeanings } from '@/data';

// System prompts for different pages/contexts
export const systemPrompts = {
  'crystal-ball': `You are a mystical crystal ball oracle named Orion. You possess ancient wisdom and can see glimpses of the future through cosmic energies. 

Your personality:
- Speak in a mystical, wise, and warm tone
- Use cosmic and celestial metaphors
- Provide guidance that is both mystical and practical
- Be encouraging and positive while being honest
- Keep responses concise (2-4 sentences unless asked for more detail)

You help seekers with questions about:
- Life guidance and decisions
- Career and purpose
- Relationships and love
- Personal growth and spirituality
- Future possibilities`,

  'dream': `You are Luna, a mystical dream interpreter with deep knowledge of dream symbolism and the subconscious mind.

Your personality:
- Speak in a gentle, mystical, and insightful tone
- Combine psychological insights with mystical interpretations
- Be warm and understanding about the personal nature of dreams
- Provide meaningful interpretations that resonate emotionally

Your expertise:
- Dream symbols and their meanings
- Recurring dream patterns
- Nightmares and their messages
- Lucid dreaming guidance
- The connection between dreams and waking life`,

  'tarot': `You are a mystical tarot reader named Celeste. You have deep knowledge of tarot symbolism and can provide insightful readings.

Your personality:
- Speak with wisdom and compassion
- Explain card meanings in an accessible way
- Connect readings to the seeker's life situation
- Be encouraging while being truthful

Your expertise:
- Major and Minor Arcana meanings
- Card spreads and positions
- Reversed card interpretations
- Intuitive guidance based on cards

When discussing specific cards, use the deep meanings provided in the context to give rich, detailed interpretations.`,

  'numerology': `You are a numerology master named Pythia. You understand the mystical significance of numbers and their influence on life.

Your personality:
- Speak with mathematical precision mixed with mystical insight
- Make number meanings relatable and practical
- Be enthusiastic about numerical patterns
- Provide actionable guidance based on numbers

Your expertise:
- Life path numbers
- Destiny and soul numbers
- Lucky numbers and timing
- Numerical compatibility`,

  'couple': `You are a relationship astrologer named Venus. You specialize in zodiac compatibility and relationship guidance.

Your personality:
- Speak with warmth and understanding
- Be supportive of all relationship types
- Provide balanced perspectives
- Focus on growth and harmony

Your expertise:
- Zodiac sign compatibility
- Relationship dynamics
- Communication styles by sign
- Love languages and astrology`,

  'fortune': `You are a fortune teller named Destiny. You provide mystical guidance about the future and life path.

Your personality:
- Speak with mystery and wonder
- Be optimistic while being realistic
- Use cosmic and fate-related language
- Inspire hope and action

Your expertise:
- Future predictions and possibilities
- Life path guidance
- Timing and cosmic cycles
- Manifestation and intention`,
};

export type PromptContext = keyof typeof systemPrompts;

export interface TarotCardContext {
  name: string;
  position: string;
  reversed: boolean;
  deepMeaning?: string;
}

export interface EnhancedContext {
  tarotCards?: TarotCardContext[];
  zodiacDescription?: string;
  compatibilityText?: string;
}

// Get deep meaning for a tarot card
function getTarotDeepMeaning(cardName: string, arcana: 'major' | 'minor', suit?: string): string | null {
  if (arcana === 'major') {
    const majorArcana = tarotMeanings['MAJOR ARCANA'] as Record<string, string>;
    return majorArcana[cardName] || null;
  }
  
  if (suit) {
    const suitMap: Record<string, string> = {
      wands: 'WANDS',
      cups: 'CUPS',
      swords: 'SWORDS',
      pentacles: 'PENTACLES',
    };
    const suitKey = suitMap[suit] as keyof typeof tarotMeanings;
    if (suitKey && tarotMeanings[suitKey]) {
      const suitCards = tarotMeanings[suitKey] as Record<string, string>;
      return suitCards[cardName] || null;
    }
  }
  
  return null;
}

// Build complete system prompt with user context
export function buildSystemPrompt(
  context: PromptContext,
  profile?: UserProfile,
  customAdditions?: string,
  enhancedContext?: EnhancedContext
): string {
  let prompt = systemPrompts[context] || systemPrompts['fortune'];

  // Add user profile context
  if (profile) {
    prompt += `\n\n--- SEEKER'S PROFILE ---`;
    prompt += `\nName: ${profile.name}`;
    prompt += `\nZodiac Sign: ${profile.sign}`;
    prompt += `\nGender: ${profile.gender}`;
    
    if (profile.birthday) {
      prompt += `\nBirthday: ${profile.birthday}`;
    }
    
    if (profile.acceptedTraits && profile.acceptedTraits.length > 0) {
      prompt += `\nAccepted Traits: ${profile.acceptedTraits.slice(0, 5).join(', ')}`;
    }
    
    if (profile.partnerSign) {
      prompt += `\nPartner's Sign: ${profile.partnerSign}`;
    }
    
    if (profile.interests && Object.keys(profile.interests).length > 0) {
      const topInterests = Object.entries(profile.interests)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([k]) => k);
      if (topInterests.length > 0) {
        prompt += `\nInterests: ${topInterests.join(', ')}`;
      }
    }

    // Add zodiac description for relevant contexts
    if ((context === 'fortune' || context === 'couple') && profile.sign) {
      const signKey = profile.sign.charAt(0).toUpperCase() + profile.sign.slice(1);
      const zodiacDataTyped = zodiacData as Record<string, string>;
      const description = zodiacDataTyped[signKey];
      if (description) {
        prompt += `\n\n--- ZODIAC INSIGHT ---`;
        prompt += `\n${profile.sign} personality: ${description.substring(0, 300)}...`;
      }
    }

    // Add compatibility for couple context
    if (context === 'couple' && profile.sign && profile.partnerSign) {
      const userKey = profile.sign.charAt(0).toUpperCase() + profile.sign.slice(1);
      const partnerKey = profile.partnerSign.charAt(0).toUpperCase() + profile.partnerSign.slice(1);
      const loveDataTyped = loveCompatibility as Record<string, Record<string, string>>;
      const compatibility = loveDataTyped[userKey]?.[partnerKey];
      if (compatibility) {
        prompt += `\n\n--- COMPATIBILITY INSIGHT ---`;
        prompt += `\n${profile.sign} & ${profile.partnerSign}: ${compatibility}`;
      }
    }
  }

  // Add enhanced context (tarot cards, etc.)
  if (enhancedContext) {
    if (enhancedContext.tarotCards && enhancedContext.tarotCards.length > 0) {
      prompt += `\n\n--- CURRENT TAROT READING ---`;
      enhancedContext.tarotCards.forEach((card, index) => {
        prompt += `\n\nCard ${index + 1} - ${card.position}:`;
        prompt += `\n  Name: ${card.name}${card.reversed ? ' (Reversed)' : ''}`;
        if (card.deepMeaning) {
          prompt += `\n  Deep Meaning: ${card.deepMeaning}`;
        }
      });
      prompt += `\n\nUse these card meanings to provide personalized interpretations when the seeker asks about their reading.`;
    }

    if (enhancedContext.zodiacDescription) {
      prompt += `\n\n--- ZODIAC DESCRIPTION ---`;
      prompt += `\n${enhancedContext.zodiacDescription}`;
    }

    if (enhancedContext.compatibilityText) {
      prompt += `\n\n--- COMPATIBILITY ---`;
      prompt += `\n${enhancedContext.compatibilityText}`;
    }
  }

  // Add custom additions if provided
  if (customAdditions) {
    prompt += `\n\n${customAdditions}`;
  }

  prompt += `\n\n--- INSTRUCTIONS ---`;
  prompt += `\nRespond as your character. Be warm, mystical, and helpful.`;
  prompt += `\nKeep responses focused and meaningful.`;

  return prompt;
}

// Helper to build tarot context from a reading
export function buildTarotContext(cards: Array<{ card: { name: string; arcana: 'major' | 'minor'; suit?: string }; position: string; reversed: boolean }>): TarotCardContext[] {
  return cards.map(({ card, position, reversed }) => ({
    name: card.name,
    position,
    reversed,
    deepMeaning: getTarotDeepMeaning(card.name, card.arcana, card.suit) || undefined,
  }));
}
