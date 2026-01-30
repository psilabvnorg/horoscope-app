// Import raw JSON data
import zodiacData from './zodiac.json';
import loveCompatibility from './love.json';
import tarotMeanings from './tarot.json';
import zodiacCalendar from './zodiac-star-calendar-2026.json';

// Re-export existing data
export * from './tarotCards';
export * from './traits';

// Export new data
export { zodiacData, loveCompatibility, tarotMeanings, zodiacCalendar };
