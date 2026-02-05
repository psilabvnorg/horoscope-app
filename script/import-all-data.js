/**
 * Import all JSON data into SQLite database
 * - Traits from traits.ts
 * - Daily forecasts from daily-event.json
 * - Missing translations for tarot, love, zodiac-calendar
 */

import fs from "fs";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const db = new Database(join(rootDir, "public/data/horoscope.db"));

// ============================================================
// TRAITS DATA (from traits.ts)
// ============================================================
const traitCards = [
  // Personality Traits
  { id: 'personality-ambitious', trait: 'Ambitious', description: 'You set high goals and work tirelessly to achieve them. Success is your destination.', category: 'personality', emoji: '🎯' },
  { id: 'personality-intuitive', trait: 'Intuitive', description: 'You trust your gut feelings and often sense things before they happen.', category: 'personality', emoji: '🔮' },
  { id: 'personality-creative', trait: 'Creative', description: 'Your imagination knows no bounds. You see beauty and possibility everywhere.', category: 'personality', emoji: '🎨' },
  { id: 'personality-loyal', trait: 'Loyal', description: "Once you commit, you stay true. Your friends know you'll always be there.", category: 'personality', emoji: '🤝' },
  { id: 'personality-adventurous', trait: 'Adventurous', description: "You crave new experiences and aren't afraid to step outside your comfort zone.", category: 'personality', emoji: '🌍' },
  { id: 'personality-patient', trait: 'Patient', description: 'You understand that good things take time. You wait with grace.', category: 'personality', emoji: '🧘' },
  { id: 'personality-passionate', trait: 'Passionate', description: 'You throw yourself fully into what you love. Your enthusiasm is contagious.', category: 'personality', emoji: '🔥' },
  { id: 'personality-analytical', trait: 'Analytical', description: 'You think deeply before acting. Every decision is carefully considered.', category: 'personality', emoji: '🧠' },
  { id: 'personality-empathetic', trait: 'Empathetic', description: 'You feel what others feel. Your compassion makes you a natural healer.', category: 'personality', emoji: '💝' },
  { id: 'personality-independent', trait: 'Independent', description: 'You march to the beat of your own drum. Self-reliance is your strength.', category: 'personality', emoji: '🦅' },
  { id: 'personality-charming', trait: 'Charming', description: 'People are drawn to your charisma. You light up every room you enter.', category: 'personality', emoji: '✨' },
  { id: 'personality-resilient', trait: 'Resilient', description: 'You bounce back from setbacks stronger than before. Nothing keeps you down.', category: 'personality', emoji: '🌱' },
  { id: 'personality-perfectionist', trait: 'Perfectionist', description: 'You strive for excellence in everything you do. Good enough is never enough.', category: 'personality', emoji: '💎' },
  { id: 'personality-dreamer', trait: 'Dreamer', description: "Your head is often in the clouds, envisioning possibilities others can't see.", category: 'personality', emoji: '☁️' },
  { id: 'personality-practical', trait: 'Practical', description: 'You focus on what works. Feet firmly planted, you build lasting foundations.', category: 'personality', emoji: '🏗️' },
  
  // Love Traits
  { id: 'love-romantic', trait: 'Hopeless Romantic', description: 'You believe in true love and grand gestures. Your heart is always open.', category: 'love', emoji: '💕' },
  { id: 'love-committed', trait: 'Deeply Committed', description: 'When you love, you love fully. Your devotion knows no limits.', category: 'love', emoji: '💍' },
  { id: 'love-playful', trait: 'Playfully Flirtatious', description: 'You keep the spark alive with humor and teasing. Love is an adventure.', category: 'love', emoji: '😘' },
  { id: 'love-protective', trait: 'Protective Partner', description: 'You guard your loved ones fiercely. Their happiness is your priority.', category: 'love', emoji: '🛡️' },
  { id: 'love-spontaneous', trait: 'Spontaneous Lover', description: 'Surprise dates and unexpected gifts are your love language.', category: 'love', emoji: '🎁' },
  { id: 'love-supportive', trait: 'Supportive Partner', description: "You're the biggest cheerleader for your loved ones. Their wins are yours.", category: 'love', emoji: '📣' },
  { id: 'love-passionate', trait: 'Passionate Lover', description: 'Your love burns bright and intense. You love with your whole being.', category: 'love', emoji: '❤️‍🔥' },
  { id: 'love-patient', trait: 'Patient in Love', description: 'You understand love takes time to grow. You nurture it gently.', category: 'love', emoji: '🌹' },
  
  // Career Traits
  { id: 'career-leader', trait: 'Natural Leader', description: 'Others naturally follow your vision. You inspire and guide with confidence.', category: 'career', emoji: '👑' },
  { id: 'career-innovator', trait: 'Innovator', description: 'You see solutions where others see problems. Your ideas change the game.', category: 'career', emoji: '💡' },
  { id: 'career-dedicated', trait: 'Dedicated Worker', description: 'You give your all to your craft. Excellence is your standard.', category: 'career', emoji: '⚡' },
  { id: 'career-collaborator', trait: 'Team Player', description: 'You elevate everyone around you. Together, you achieve more.', category: 'career', emoji: '🤲' },
  { id: 'career-strategic', trait: 'Strategic Thinker', description: 'You plan three moves ahead. Your foresight is your superpower.', category: 'career', emoji: '♟️' },
  { id: 'career-adaptable', trait: 'Highly Adaptable', description: "Change doesn't faze you. You thrive in new environments.", category: 'career', emoji: '🔄' },
  { id: 'career-detail', trait: 'Detail-Oriented', description: 'Nothing escapes your notice. Perfection is in the details.', category: 'career', emoji: '🔍' },
  { id: 'career-communicator', trait: 'Great Communicator', description: 'Your words move mountains. You express ideas with clarity and impact.', category: 'career', emoji: '📢' },
  
  // Social Traits
  { id: 'social-extrovert', trait: 'Social Butterfly', description: 'You thrive in crowds and make friends everywhere. Energy flows to you.', category: 'social', emoji: '🦋' },
  { id: 'social-listener', trait: 'Great Listener', description: 'People open up to you. Your presence is a safe space.', category: 'social', emoji: '👂' },
  { id: 'social-connector', trait: 'Master Connector', description: 'You bring people together. Your network is your superpower.', category: 'social', emoji: '🕸️' },
  { id: 'social-witty', trait: 'Witty & Humorous', description: 'Your humor lights up conversations. Laughter follows you everywhere.', category: 'social', emoji: '😄' },
  { id: 'social-observer', trait: 'Keen Observer', description: 'You notice what others miss. Silence speaks volumes to you.', category: 'social', emoji: '👁️' },
  { id: 'social-diplomat', trait: 'Natural Diplomat', description: 'You navigate conflicts with grace. Peace follows in your wake.', category: 'social', emoji: '☮️' },
  
  // Emotional Traits
  { id: 'emotion-sensitive', trait: 'Deeply Sensitive', description: 'You feel things intensely. Your emotional depth is your gift.', category: 'emotion', emoji: '🌊' },
  { id: 'emotion-stable', trait: 'Emotionally Stable', description: 'You remain calm in storms. Others find peace in your presence.', category: 'emotion', emoji: '🏔️' },
  { id: 'emotion-expressive', trait: 'Emotionally Expressive', description: 'You wear your heart on your sleeve. Authenticity is your nature.', category: 'emotion', emoji: '🎭' },
  { id: 'emotion-introspective', trait: 'Introspective', description: 'You look within for answers. Self-awareness guides your path.', category: 'emotion', emoji: '🪞' },
  { id: 'emotion-optimistic', trait: 'Eternal Optimist', description: 'You always see the silver lining. Hope is your constant companion.', category: 'emotion', emoji: '☀️' },
  { id: 'emotion-passionate', trait: 'Fiercely Passionate', description: 'Your emotions run deep and strong. You live with full intensity.', category: 'emotion', emoji: '🌋' },
  
  // Spiritual Traits
  { id: 'spiritual-seeker', trait: 'Spiritual Seeker', description: 'You search for deeper meaning. The universe speaks to you.', category: 'spiritual', emoji: '🌟' },
  { id: 'spiritual-grounded', trait: 'Spiritually Grounded', description: "You're connected to earth and sky. Balance is your natural state.", category: 'spiritual', emoji: '🌳' },
  { id: 'spiritual-mystic', trait: 'Natural Mystic', description: 'The unseen world is real to you. Intuition is your guide.', category: 'spiritual', emoji: '🌙' },
  { id: 'spiritual-healer', trait: 'Born Healer', description: 'You have a gift for helping others heal. Compassion flows through you.', category: 'spiritual', emoji: '💫' },
  
  // Challenge Traits
  { id: 'challenge-stubborn', trait: 'Stubborn', description: 'Once you decide, you rarely change course. Determination or obstinacy?', category: 'challenge', emoji: '🐂' },
  { id: 'challenge-impulsive', trait: 'Impulsive', description: 'You act on instinct, sometimes without thinking. Spontaneity has its price.', category: 'challenge', emoji: '⚡' },
  { id: 'challenge-overthinker', trait: 'Overthinker', description: 'Your mind never stops analyzing. Sometimes you think too much.', category: 'challenge', emoji: '🔄' },
  { id: 'challenge-sensitive', trait: 'Easily Hurt', description: 'Your heart is tender. Criticism cuts deeper than intended.', category: 'challenge', emoji: '💔' },
  { id: 'challenge-restless', trait: 'Restless Spirit', description: 'You crave constant change. Stillness feels like stagnation.', category: 'challenge', emoji: '🌪️' },
  { id: 'challenge-secretive', trait: 'Secretive', description: 'You keep cards close to your chest. Trust comes slowly.', category: 'challenge', emoji: '🗝️' },
  { id: 'challenge-proud', trait: 'Proud', description: 'Your dignity matters deeply. Sometimes pride gets in the way.', category: 'challenge', emoji: '🦁' },
  { id: 'challenge-dramatic', trait: 'Dramatic', description: 'Life is never boring with you. Emotions run high and loud.', category: 'challenge', emoji: '🎬' },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================
function loadJson(relativePath) {
  const fullPath = join(rootDir, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

function getSignIdBySlug(slug) {
  const row = db.prepare("SELECT id FROM signs WHERE slug = ?").get(slug.toLowerCase());
  return row ? row.id : null;
}

// Western zodiac sign slugs
const westernSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

// Month name to number mapping
const monthMap = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };


// ============================================================
// IMPORT TRAITS
// ============================================================
function importTraits() {
  console.log("\n📋 Importing traits...");
  
  const insertTrait = db.prepare(`
    INSERT OR REPLACE INTO traits (id, category, emoji)
    VALUES (?, ?, ?)
  `);
  
  const insertTraitTrans = db.prepare(`
    INSERT OR REPLACE INTO trait_translations (trait_id, lang, name, description)
    VALUES (?, ?, ?, ?)
  `);
  
  let count = 0;
  for (const t of traitCards) {
    insertTrait.run(t.id, t.category, t.emoji);
    insertTraitTrans.run(t.id, 'en', t.trait, t.description);
    count++;
  }
  
  console.log(`   ✅ Imported ${count} traits`);
}

// ============================================================
// IMPORT FORECASTS (daily-event.json)
// ============================================================
function importForecasts() {
  console.log("\n📅 Importing forecasts...");
  
  const dailyEvent = loadJson("src/data/daily-event.json");
  if (!dailyEvent) {
    console.log("   ⚠️ daily-event.json not found, skipping");
    return;
  }
  
  // Ensure forecast_types exist
  const insertForecastType = db.prepare(`
    INSERT OR IGNORE INTO forecast_types (code)
    VALUES (?)
  `);
  
  insertForecastType.run('daily');
  
  const insertForecast = db.prepare(`
    INSERT OR REPLACE INTO forecasts (sign_id, type_code, date, month, year, love_score, career_score, emotion_score, energy_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const insertLucky = db.prepare(`
    INSERT OR REPLACE INTO lucky_attributes (forecast_id, numbers, color, direction, hours)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const insertAction = db.prepare(`
    INSERT INTO actions (forecast_id, type)
    VALUES (?, ?)
  `);
  
  const insertActionTrans = db.prepare(`
    INSERT INTO action_translations (action_id, lang, content)
    VALUES (?, ?, ?)
  `);
  
  let forecastCount = 0;
  let actionCount = 0;
  
  for (const year of Object.keys(dailyEvent)) {
    const yearData = dailyEvent[year];
    
    for (const dateStr of Object.keys(yearData)) {
      const dayData = yearData[dateStr];
      const [y, m, d] = dateStr.split('-').map(Number);
      
      let firstForecastId = null;
      
      // Process zodiac-specific forecasts
      if (dayData.zodiac) {
        for (const signName of Object.keys(dayData.zodiac)) {
          const signId = getSignIdBySlug(signName.toLowerCase());
          if (!signId) continue;
          
          const scores = dayData.zodiac[signName].scores || {};
          
          const result = insertForecast.run(
            signId,
            'daily',
            dateStr,
            m,
            y,
            scores.love || null,
            scores.career || null,
            scores.emotion || null,
            scores.energy || null
          );
          
          // Track first forecast ID for linking global actions
          if (!firstForecastId && result.lastInsertRowid) {
            firstForecastId = result.lastInsertRowid;
          }
          
          // Insert lucky attributes from global data
          if (dayData.global?.lucky && result.lastInsertRowid) {
            const lucky = dayData.global.lucky;
            insertLucky.run(
              result.lastInsertRowid,
              lucky.numbers ? JSON.stringify(lucky.numbers) : null,
              lucky.color || null,
              lucky.direction || null,
              lucky.hours ? JSON.stringify(lucky.hours) : null
            );
          }
          
          forecastCount++;
        }
      }
      
      // Import global actions (linked to first forecast of the day)
      if (dayData.global?.actions && firstForecastId) {
        const actions = dayData.global.actions;
        
        // Import "do" actions
        if (actions.do && Array.isArray(actions.do)) {
          for (const actionText of actions.do) {
            const actionResult = insertAction.run(firstForecastId, 'do');
            if (actionResult.lastInsertRowid) {
              insertActionTrans.run(actionResult.lastInsertRowid, 'en', actionText);
              actionCount++;
            }
          }
        }
        
        // Import "avoid" actions
        if (actions.avoid && Array.isArray(actions.avoid)) {
          for (const actionText of actions.avoid) {
            const actionResult = insertAction.run(firstForecastId, 'avoid');
            if (actionResult.lastInsertRowid) {
              insertActionTrans.run(actionResult.lastInsertRowid, 'en', actionText);
              actionCount++;
            }
          }
        }
      }
    }
  }
  
  console.log(`   ✅ Imported ${forecastCount} forecast entries`);
  console.log(`   ✅ Imported ${actionCount} actions`);
}

// ============================================================
// IMPORT ZODIAC CALENDAR TRANSLATIONS
// ============================================================
function importZodiacCalendarTranslations() {
  console.log("\n🗓️ Importing zodiac calendar translations...");
  
  const viCalendar = loadJson("src/data/translations/vi/zodiac-star-calendar-2026.json");
  if (!viCalendar) {
    console.log("   ⚠️ Vietnamese calendar not found, skipping");
    return;
  }
  
  // Check existing entries
  const existingVi = db.prepare("SELECT COUNT(*) as cnt FROM zodiac_calendar_entries WHERE lang = 'vi'").get();
  if (existingVi.cnt > 0) {
    console.log(`   ℹ️ Vietnamese calendar already has ${existingVi.cnt} entries, skipping`);
    return;
  }
  
  const insertCalendar = db.prepare(`
    INSERT INTO zodiac_calendar_entries (sign_id, month, status, element, sign, description, lang)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  let count = 0;
  for (const signName of Object.keys(viCalendar)) {
    const signId = getSignIdBySlug(signName.toLowerCase());
    if (!signId) continue;
    
    const months = viCalendar[signName];
    for (const monthName of Object.keys(months)) {
      const monthNum = monthMap[monthName];
      if (!monthNum) continue;
      
      const desc = months[monthName];
      // Parse: "compatible – Khí (Bảo Bình) nuôi dưỡng..."
      const match = desc.match(/^(\w+)\s*[–-]\s*(.+)$/);
      const status = match ? match[1] : 'neutral';
      const description = match ? match[2] : desc;
      
      insertCalendar.run(signId, monthNum, status, null, signName, description, 'vi');
      count++;
    }
  }
  
  console.log(`   ✅ Imported ${count} Vietnamese calendar entries`);
}


// ============================================================
// IMPORT TAROT TRANSLATIONS (ja, ko, vi)
// ============================================================
function importTarotTranslations() {
  console.log("\n🃏 Importing tarot translations...");
  
  const languages = ['ja', 'ko', 'vi'];
  
  // Get tarot card sign IDs (they're stored as signs with slugs like 'the-fool')
  const tarotSlugMap = {
    'The Fool': 'the-fool',
    'The Magician': 'the-magician',
    'The High Priestess': 'the-high-priestess',
    'The Empress': 'the-empress',
    'The Emperor': 'the-emperor',
    'The Hierophant': 'the-hierophant',
    'The Lovers': 'the-lovers',
    'The Chariot': 'the-chariot',
    'Strength': 'strength',
    'The Hermit': 'the-hermit',
    'Wheel of Fortune': 'wheel-of-fortune',
    'Justice': 'justice',
    'The Hanged Man': 'the-hanged-man',
    'Death': 'death',
    'Temperance': 'temperance',
    'The Devil': 'the-devil',
    'The Tower': 'the-tower',
    'The Star': 'the-star',
    'The Moon': 'the-moon',
    'The Sun': 'the-sun',
    'Judgment': 'judgment',
    'The World': 'the-world',
  };
  
  const insertTarotMeaning = db.prepare(`
    INSERT OR REPLACE INTO tarot_meanings (sign_id, lang, upright, reversed)
    VALUES (?, ?, ?, ?)
  `);
  
  let totalCount = 0;
  
  for (const lang of languages) {
    const tarotData = loadJson(`src/data/translations/${lang}/tarot.json`);
    if (!tarotData) {
      console.log(`   ⚠️ ${lang}/tarot.json not found`);
      continue;
    }
    
    let langCount = 0;
    
    // Process Major Arcana
    if (tarotData['MAJOR ARCANA']) {
      for (const [cardName, meaning] of Object.entries(tarotData['MAJOR ARCANA'])) {
        const slug = tarotSlugMap[cardName];
        if (!slug) continue;
        
        const signId = getSignIdBySlug(slug);
        if (!signId) {
          // Card might not exist in signs table, skip
          continue;
        }
        
        insertTarotMeaning.run(signId, lang, meaning, null);
        langCount++;
      }
    }
    
    console.log(`   ✅ ${lang}: ${langCount} tarot meanings`);
    totalCount += langCount;
  }
  
  console.log(`   ✅ Total: ${totalCount} tarot translations imported`);
}

// ============================================================
// IMPORT COMPATIBILITY TRANSLATIONS (ja, ko, vi)
// ============================================================
function importCompatibilityTranslations() {
  console.log("\n💕 Importing compatibility translations...");
  
  const languages = ['ja', 'ko', 'vi'];
  
  const getCompatibilityId = db.prepare(`
    SELECT c.id FROM compatibility c
    JOIN signs s1 ON c.sign_id = s1.id
    JOIN signs s2 ON c.other_sign_id = s2.id
    WHERE LOWER(s1.slug) = ? AND LOWER(s2.slug) = ?
  `);
  
  const checkExisting = db.prepare(`
    SELECT id FROM compatibility_translations WHERE compatibility_id = ? AND lang = ?
  `);
  
  const insertCompatTrans = db.prepare(`
    INSERT INTO compatibility_translations (compatibility_id, lang, description)
    VALUES (?, ?, ?)
  `);
  
  let totalCount = 0;
  
  for (const lang of languages) {
    const loveData = loadJson(`src/data/translations/${lang}/love.json`);
    if (!loveData) {
      console.log(`   ⚠️ ${lang}/love.json not found`);
      continue;
    }
    
    let langCount = 0;
    let skipped = 0;
    
    for (const sign1 of Object.keys(loveData)) {
      const sign1Slug = sign1.toLowerCase();
      
      for (const sign2 of Object.keys(loveData[sign1])) {
        const sign2Slug = sign2.toLowerCase();
        const description = loveData[sign1][sign2];
        
        const compat = getCompatibilityId.get(sign1Slug, sign2Slug);
        if (!compat) continue;
        
        // Check if translation already exists
        const existing = checkExisting.get(compat.id, lang);
        if (existing) {
          skipped++;
          continue;
        }
        
        insertCompatTrans.run(compat.id, lang, description);
        langCount++;
      }
    }
    
    console.log(`   ✅ ${lang}: ${langCount} new, ${skipped} skipped (already exist)`);
    totalCount += langCount;
  }
  
  console.log(`   ✅ Total: ${totalCount} compatibility translations imported`);
}

// ============================================================
// IMPORT ELEMENT TIPS TRANSLATIONS
// ============================================================
function importElementTipsTranslations() {
  console.log("\n🔥 Importing element tips translations...");
  
  const languages = ['ja', 'ko', 'vi'];
  
  const checkExistingTip = db.prepare(`
    SELECT id FROM element_tips WHERE element_code = ? AND lang = ? AND tip = ?
  `);
  
  const insertTip = db.prepare(`
    INSERT INTO element_tips (element_code, lang, tip)
    VALUES (?, ?, ?)
  `);
  
  let totalCount = 0;
  
  for (const lang of languages) {
    const elementData = loadJson(`src/data/translations/${lang}/element-balance.json`);
    if (!elementData) {
      console.log(`   ⚠️ ${lang}/element-balance.json not found`);
      continue;
    }
    
    let langCount = 0;
    
    for (const [elementCode, data] of Object.entries(elementData)) {
      if (!data.tips || !Array.isArray(data.tips)) continue;
      
      for (const tip of data.tips) {
        // Check if tip already exists
        const existing = checkExistingTip.get(elementCode, lang, tip);
        if (existing) continue;
        
        insertTip.run(elementCode, lang, tip);
        langCount++;
      }
    }
    
    console.log(`   ✅ ${lang}: ${langCount} element tips`);
    totalCount += langCount;
  }
  
  console.log(`   ✅ Total: ${totalCount} element tips imported`);
}

// ============================================================
// IMPORT SIGN TRANSLATIONS (ja, ko, vi zodiac descriptions)
// ============================================================
function importSignTranslations() {
  console.log("\n⭐ Importing sign translations...");
  
  const languages = ['ja', 'ko', 'vi'];
  
  const checkExisting = db.prepare(`
    SELECT id FROM sign_translations WHERE sign_id = ? AND lang = ?
  `);
  
  const insertSignTrans = db.prepare(`
    INSERT INTO sign_translations (sign_id, lang, name, description)
    VALUES (?, ?, ?, ?)
  `);
  
  const updateSignTrans = db.prepare(`
    UPDATE sign_translations SET description = ? WHERE sign_id = ? AND lang = ?
  `);
  
  let totalCount = 0;
  
  for (const lang of languages) {
    const zodiacData = loadJson(`src/data/translations/${lang}/zodiac.json`);
    if (!zodiacData) {
      console.log(`   ⚠️ ${lang}/zodiac.json not found`);
      continue;
    }
    
    let langCount = 0;
    
    for (const [signName, description] of Object.entries(zodiacData)) {
      const signSlug = signName.toLowerCase();
      const signId = getSignIdBySlug(signSlug);
      if (!signId) continue;
      
      const existing = checkExisting.get(signId, lang);
      if (existing) {
        // Update existing
        updateSignTrans.run(description, signId, lang);
      } else {
        // Insert new
        insertSignTrans.run(signId, lang, signName, description);
      }
      langCount++;
    }
    
    console.log(`   ✅ ${lang}: ${langCount} sign translations`);
    totalCount += langCount;
  }
  
  console.log(`   ✅ Total: ${totalCount} sign translations imported`);
}


// ============================================================
// IMPORT TAROT SUIT TRANSLATIONS
// ============================================================
function importTarotSuitTranslations() {
  console.log("\n🎴 Importing tarot suit translations...");
  
  const languages = ['ja', 'ko', 'vi'];
  
  // Suit translations
  const suitTranslations = {
    ja: { wands: 'ワンド', cups: 'カップ', swords: 'ソード', pentacles: 'ペンタクル' },
    ko: { wands: '완드', cups: '컵', swords: '소드', pentacles: '펜타클' },
    vi: { wands: 'Gậy', cups: 'Cốc', swords: 'Kiếm', pentacles: 'Đồng xu' }
  };
  
  const getSuitId = db.prepare("SELECT id FROM tarot_suits WHERE slug = ?");
  
  const checkExisting = db.prepare(`
    SELECT id FROM tarot_suit_translations WHERE suit_id = ? AND lang = ?
  `);
  
  const updateSuitTrans = db.prepare(`
    UPDATE tarot_suit_translations SET name = ? WHERE suit_id = ? AND lang = ?
  `);
  
  let totalCount = 0;
  
  for (const lang of languages) {
    const trans = suitTranslations[lang];
    if (!trans) continue;
    
    let langCount = 0;
    
    for (const [slug, name] of Object.entries(trans)) {
      const suit = getSuitId.get(slug);
      if (!suit) continue;
      
      const existing = checkExisting.get(suit.id, lang);
      if (existing) {
        updateSuitTrans.run(name, suit.id, lang);
      }
      langCount++;
    }
    
    console.log(`   ✅ ${lang}: ${langCount} suit translations updated`);
    totalCount += langCount;
  }
  
  console.log(`   ✅ Total: ${totalCount} suit translations`);
}

// ============================================================
// MAIN EXECUTION
// ============================================================
console.log("🚀 Starting data import...");
console.log("=".repeat(60));

db.transaction(() => {
  importTraits();
  importForecasts();
  importZodiacCalendarTranslations();
  importTarotTranslations();
  importCompatibilityTranslations();
  importElementTipsTranslations();
  importSignTranslations();
  importTarotSuitTranslations();
})();

console.log("\n" + "=".repeat(60));
console.log("✅ All data imported successfully!");

// Print summary
console.log("\n📊 Database Summary:");
const tables = ['traits', 'trait_translations', 'forecasts', 'lucky_attributes', 'actions', 'action_translations', 'zodiac_calendar_entries', 'tarot_meanings', 'compatibility_translations', 'element_tips', 'sign_translations'];
for (const table of tables) {
  try {
    const count = db.prepare(`SELECT COUNT(*) as cnt FROM ${table}`).get();
    console.log(`   ${table}: ${count.cnt} rows`);
  } catch (e) {
    console.log(`   ${table}: (table not found)`);
  }
}

db.close();
