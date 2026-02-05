/**
 * Import forecasts + actions from daily-event.json
 * Generates missing zodiac scores if not present in JSON
 */

import fs from "fs";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const db = new Database(join(rootDir, "public/data/horoscope.db"));

const westernSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

function loadJson(relativePath) {
  const fullPath = join(rootDir, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

function getSignIdBySlug(slug) {
  const row = db.prepare("SELECT id FROM signs WHERE slug = ?").get(slug.toLowerCase());
  return row ? row.id : null;
}

// Generate random score between 1-5
function randomScore() {
  return Math.floor(Math.random() * 5) + 1;
}

console.log("🚀 Importing forecasts + actions from daily-event.json...\n");

const dailyEvent = loadJson("src/data/daily-event.json");
if (!dailyEvent) {
  console.log("❌ daily-event.json not found");
  process.exit(1);
}

// Ensure forecast_types exist
const insertForecastType = db.prepare(`INSERT OR IGNORE INTO forecast_types (code) VALUES (?)`);
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

db.transaction(() => {
  for (const year of Object.keys(dailyEvent)) {
    const yearData = dailyEvent[year];
    
    for (const dateStr of Object.keys(yearData)) {
      const dayData = yearData[dateStr];
      const [y, m, d] = dateStr.split('-').map(Number);
      
      let firstForecastId = null;
      
      // Import forecasts for ALL 12 zodiac signs
      for (const signSlug of westernSigns) {
        const signId = getSignIdBySlug(signSlug);
        if (!signId) continue;
        
        // Get scores from JSON or generate random
        const signName = signSlug.charAt(0).toUpperCase() + signSlug.slice(1);
        const zodiacData = dayData.zodiac?.[signName];
        const scores = zodiacData?.scores || {
          love: randomScore(),
          career: randomScore(),
          emotion: randomScore(),
          energy: randomScore()
        };
        
        const result = insertForecast.run(
          signId,
          'daily',
          dateStr,
          m,
          y,
          scores.love,
          scores.career,
          scores.emotion,
          scores.energy
        );
        
        // Track first forecast ID for linking actions
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
      
      // Import actions (linked to first forecast of the day)
      if (dayData.global?.actions && firstForecastId) {
        const actions = dayData.global.actions;
        
        if (actions.do && Array.isArray(actions.do)) {
          for (const actionText of actions.do) {
            const result = insertAction.run(firstForecastId, 'do');
            if (result.lastInsertRowid) {
              insertActionTrans.run(result.lastInsertRowid, 'en', actionText);
              actionCount++;
            }
          }
        }
        
        if (actions.avoid && Array.isArray(actions.avoid)) {
          for (const actionText of actions.avoid) {
            const result = insertAction.run(firstForecastId, 'avoid');
            if (result.lastInsertRowid) {
              insertActionTrans.run(result.lastInsertRowid, 'en', actionText);
              actionCount++;
            }
          }
        }
      }
      
      console.log(`   ✅ ${dateStr}: 12 forecasts + actions imported`);
    }
  }
})();

console.log(`\n✅ Imported ${forecastCount} forecasts, ${actionCount} actions`);

// Show results
const tables = ['forecasts', 'lucky_attributes', 'actions', 'action_translations'];
console.log(`\n📊 Database now has:`);
for (const table of tables) {
  const count = db.prepare(`SELECT COUNT(*) as cnt FROM ${table}`).get();
  console.log(`   ${table}: ${count.cnt} rows`);
}

db.close();
