import fs from "fs";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const db = new Database(join(rootDir, "public/data/horoscope.db"));

const json = JSON.parse(fs.readFileSync(join(rootDir, "src/data/tu-vi.json"), "utf8"));

db.transaction(() => {

  //
  // Insert astrology system
  //
  const systemStmt = db.prepare(`
    INSERT INTO astrology_systems (code, created_at)
    VALUES (?, datetime('now'))
    ON CONFLICT(code) DO UPDATE SET code=excluded.code
  `);
  systemStmt.run(json.system.code);

  const system = db.prepare("SELECT id FROM astrology_systems WHERE code=?").get(json.system.code);
  const system_id = system.id;

  //
  // Insert elements
  //
  const insertElement = db.prepare(`
    INSERT OR IGNORE INTO elements (code, created_at)
    VALUES (?, datetime('now'))
  `);

  const insertElementTrans = db.prepare(`
    INSERT INTO element_translations (element_code, lang, name, keywords, balance, imbalance)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertElementTip = db.prepare(`
    INSERT INTO element_tips (element_code, lang, tip)
    VALUES (?, ?, ?)
  `);

  for (const el of json.elements) {

    insertElement.run(el.code);

    if (el.translations) {
      for (const lang of Object.keys(el.translations)) {
        const t = el.translations[lang];

        insertElementTrans.run(
          el.code,
          lang,
          t.name || null,
          t.keywords ? JSON.stringify(t.keywords) : null,
          t.balance || null,
          t.imbalance || null
        );
      }
    }

    if (el.tips) {
      for (const lang of Object.keys(el.tips)) {
        el.tips[lang].forEach(tip => {
          insertElementTip.run(el.code, lang, tip);
        });
      }
    }
  }

  //
  // Insert signs
  //
  const insertSign = db.prepare(`
    INSERT INTO signs (system_id, slug, element_code, image_url, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `);

  const insertSignTrans = db.prepare(`
    INSERT INTO sign_translations (sign_id, lang, name, description)
    VALUES (?, ?, ?, ?)
  `);

  const insertTarot = db.prepare(`
    INSERT INTO tarot_meanings (sign_id, lang, upright, reversed)
    VALUES (?, ?, ?, ?)
  `);

  const insertCalendar = db.prepare(`
    INSERT INTO zodiac_calendar_entries (sign_id, month, status, element, sign, description, lang)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const signIdMap = {};

  // Insert signs first
  for (const s of json.signs) {
    const result = insertSign.run(
      system_id,
      s.slug,
      s.element,
      s.image_url || null
    );
    const sign_id = result.lastInsertRowid;
    signIdMap[s.slug] = sign_id;

    // translations
    if (s.translations) {
      for (const lang of Object.keys(s.translations)) {
        const t = s.translations[lang];
        insertSignTrans.run(sign_id, lang, t.name, t.description || null);
      }
    }

    // tarot meanings
    if (s.tarot) {
      for (const lang of Object.keys(s.tarot)) {
        const t = s.tarot[lang];
        insertTarot.run(sign_id, lang, t.upright || null, t.reversed || null);
      }
    }

    // monthly calendar
    if (s.calendar) {
      for (const c of s.calendar) {
        insertCalendar.run(
          sign_id,
          c.month,
          c.status,
          c.element,
          c.sign,
          c.description,
          c.lang
        );
      }
    }
  }

  //
  // Insert compatibility
  //
  const insertCompatibility = db.prepare(`
    INSERT INTO compatibility (sign_id, other_sign_id, relation_type)
    VALUES (?, ?, ?)
  `);

  const insertCompatibilityTrans = db.prepare(`
    INSERT INTO compatibility_translations (compatibility_id, lang, description)
    VALUES (?, ?, ?)
  `);

  for (const c of json.compatibility) {
    const sign_id = signIdMap[c.sign];
    const other_sign_id = signIdMap[c.other];

    if (!sign_id || !other_sign_id) continue;

    const res = insertCompatibility.run(sign_id, other_sign_id, c.type);
    const comp_id = res.lastInsertRowid;

    if (c.translations) {
      for (const lang of Object.keys(c.translations)) {
        insertCompatibilityTrans.run(comp_id, lang, c.translations[lang]);
      }
    }
  }

})();

console.log("✅ Tử Vi data imported successfully");
