/**
 * Import English tarot card data from src/data/tarot.json
 * Creates tarot cards in signs table and adds meanings to tarot_meanings
 */

import fs from "fs";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const db = new Database(join(rootDir, "public/data/horoscope.db"));

// Load tarot.json
const tarotData = JSON.parse(
  fs.readFileSync(join(rootDir, "src/data/tarot.json"), "utf8")
);

// Get or create tarot astrology system
let tarotSystemId = db.prepare("SELECT id FROM astrology_systems WHERE code = 'tarot'").get()?.id;
if (!tarotSystemId) {
  db.prepare("INSERT INTO astrology_systems (code, created_at) VALUES ('tarot', datetime('now'))").run();
  tarotSystemId = db.prepare("SELECT id FROM astrology_systems WHERE code = 'tarot'").get().id;
  console.log(`✅ Created tarot astrology system (id: ${tarotSystemId})`);
}

// Map suit names to slugs
const suitSlugMap = {
  "MAJOR ARCANA": "major-arcana",
  "WANDS": "wands",
  "CUPS": "cups",
  "SWORDS": "swords",
  "PENTACLES": "pentacles"
};

// Convert card name to slug
function toSlug(name) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// Prepare statements
const insertSign = db.prepare(`
  INSERT OR IGNORE INTO signs (system_id, slug, element_code, created_at)
  VALUES (?, ?, ?, datetime('now'))
`);

const getSignId = db.prepare("SELECT id FROM signs WHERE slug = ?");

const insertMeaning = db.prepare(`
  INSERT OR REPLACE INTO tarot_meanings (sign_id, lang, upright, reversed)
  VALUES (?, ?, ?, ?)
`);

let cardCount = 0;
let meaningCount = 0;

// Process each suit
for (const [suitName, cards] of Object.entries(tarotData)) {
  const suitSlug = suitSlugMap[suitName];
  console.log(`\n🃏 Processing ${suitName}...`);
  
  for (const [cardName, meaning] of Object.entries(cards)) {
    const slug = toSlug(cardName);
    
    // Insert card into signs table
    insertSign.run(tarotSystemId, slug, null);
    cardCount++;
    
    // Get the sign_id
    const signId = getSignId.get(slug)?.id;
    if (!signId) {
      console.log(`   ⚠️ Could not get sign_id for ${cardName}`);
      continue;
    }
    
    // Insert English meaning
    insertMeaning.run(signId, "en", meaning, null);
    meaningCount++;
  }
}

console.log(`\n✅ Imported ${cardCount} tarot cards`);
console.log(`✅ Imported ${meaningCount} English meanings`);

db.close();
