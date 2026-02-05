import type { ElementBalanceData } from '@/types';
import { loadHoroscopeDb } from './db';

export async function getZodiacDescriptions(lang: string): Promise<Record<string, string>> {
  const db = await loadHoroscopeDb();
  const stmt = db.prepare(`
    SELECT st.name as name, st.description as description
    FROM signs s
    JOIN astrology_systems sys ON sys.id = s.system_id
    JOIN sign_translations st ON st.sign_id = s.id
    WHERE sys.code = 'western' AND st.lang = ?
    ORDER BY st.name
  `);
  const results: Record<string, string> = {};
  stmt.bind([lang]);
  while (stmt.step()) {
    const row = stmt.getAsObject() as { name: string; description: string };
    if (row.name && row.description) {
      results[row.name] = row.description;
    }
  }
  stmt.free();
  return results;
}

export async function getTarotMeanings(lang: string): Promise<{
  'MAJOR ARCANA': Record<string, string>;
  WANDS: Record<string, string>;
  CUPS: Record<string, string>;
  SWORDS: Record<string, string>;
  PENTACLES: Record<string, string>;
}> {
  const db = await loadHoroscopeDb();
  const stmt = db.prepare(`
    SELECT st.name as name, tm.upright as upright
    FROM tarot_meanings tm
    JOIN signs s ON s.id = tm.sign_id
    JOIN astrology_systems sys ON sys.id = s.system_id
    JOIN sign_translations st ON st.sign_id = s.id AND st.lang = tm.lang
    WHERE tm.lang = ? AND sys.code = 'western'
  `);
  const categories = {
    'MAJOR ARCANA': {},
    WANDS: {},
    CUPS: {},
    SWORDS: {},
    PENTACLES: {},
  } as {
    'MAJOR ARCANA': Record<string, string>;
    WANDS: Record<string, string>;
    CUPS: Record<string, string>;
    SWORDS: Record<string, string>;
    PENTACLES: Record<string, string>;
  };
  const suitMatchers: Array<{ key: keyof typeof categories; match: RegExp }> = [
    { key: 'WANDS', match: /wands/i },
    { key: 'CUPS', match: /cups/i },
    { key: 'SWORDS', match: /swords/i },
    { key: 'PENTACLES', match: /pentacles/i },
  ];

  stmt.bind([lang]);
  while (stmt.step()) {
    const row = stmt.getAsObject() as { name: string; upright: string };
    if (!row.name || !row.upright) continue;
    let bucket: keyof typeof categories = 'MAJOR ARCANA';
    for (const suit of suitMatchers) {
      if (suit.match.test(row.name)) {
        bucket = suit.key;
        break;
      }
    }
    categories[bucket][row.name] = row.upright;
  }
  stmt.free();
  return categories;
}

export async function getLoveCompatibility(lang: string): Promise<Record<string, Record<string, string>>> {
  const db = await loadHoroscopeDb();
  const stmt = db.prepare(`
    SELECT st.name as sign_name, st2.name as other_name, ct.description as description
    FROM compatibility c
    JOIN compatibility_translations ct ON ct.compatibility_id = c.id
    JOIN signs s ON s.id = c.sign_id
    JOIN signs s2 ON s2.id = c.other_sign_id
    JOIN sign_translations st ON st.sign_id = s.id AND st.lang = ct.lang
    JOIN sign_translations st2 ON st2.sign_id = s2.id AND st2.lang = ct.lang
    WHERE ct.lang = ?
  `);
  const results: Record<string, Record<string, string>> = {};
  stmt.bind([lang]);
  while (stmt.step()) {
    const row = stmt.getAsObject() as { sign_name: string; other_name: string; description: string };
    if (!row.sign_name || !row.other_name || !row.description) continue;
    if (!results[row.sign_name]) {
      results[row.sign_name] = {};
    }
    results[row.sign_name][row.other_name] = row.description;
  }
  stmt.free();
  return results;
}

export async function getElementBalance(lang: string): Promise<ElementBalanceData> {
  const db = await loadHoroscopeDb();
  const elementStmt = db.prepare(`
    SELECT et.element_code as element_code, et.keywords as keywords, et.balance as balance, et.imbalance as imbalance
    FROM element_translations et
    WHERE et.lang = ?
  `);
  const signStmt = db.prepare(`
    SELECT s.element_code as element_code, s.slug as slug
    FROM signs s
    JOIN astrology_systems sys ON sys.id = s.system_id
    WHERE sys.code = 'western' AND s.element_code IS NOT NULL
  `);
  const tipsStmt = db.prepare(`
    SELECT element_code, tip
    FROM element_tips
    WHERE lang = ?
  `);

  const signMap = new Map<string, string[]>();
  while (signStmt.step()) {
    const row = signStmt.getAsObject() as { element_code: string; slug: string };
    if (!signMap.has(row.element_code)) {
      signMap.set(row.element_code, []);
    }
    signMap.get(row.element_code)?.push(row.slug as string);
  }
  signStmt.free();

  const tipsMap = new Map<string, string[]>();
  tipsStmt.bind([lang]);
  while (tipsStmt.step()) {
    const row = tipsStmt.getAsObject() as { element_code: string; tip: string };
    if (!tipsMap.has(row.element_code)) {
      tipsMap.set(row.element_code, []);
    }
    tipsMap.get(row.element_code)?.push(row.tip);
  }
  tipsStmt.free();

  const data = {} as ElementBalanceData;
  elementStmt.bind([lang]);
  while (elementStmt.step()) {
    const row = elementStmt.getAsObject() as {
      element_code: string;
      keywords: string;
      balance: string;
      imbalance: string;
    };
    const keywords = row.keywords ? JSON.parse(row.keywords) : [];
    data[row.element_code as keyof ElementBalanceData] = {
      signs: (signMap.get(row.element_code) || []) as ElementBalanceData[keyof ElementBalanceData]['signs'],
      keywords,
      balance: row.balance || '',
      imbalance: row.imbalance || '',
      tips: tipsMap.get(row.element_code) || [],
    };
  }
  elementStmt.free();

  return data;
}

export async function getZodiacCalendar(lang: string): Promise<Record<string, Record<string, string>>> {
  const db = await loadHoroscopeDb();
  const stmt = db.prepare(`
    SELECT st.name as sign_name, zc.month as month, zc.status as status, zc.element as element, zc.description as description
    FROM zodiac_calendar_entries zc
    JOIN signs s ON s.id = zc.sign_id
    JOIN sign_translations st ON st.sign_id = s.id AND st.lang = zc.lang
    WHERE zc.lang = ?
  `);
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const results: Record<string, Record<string, string>> = {};
  stmt.bind([lang]);
  while (stmt.step()) {
    const row = stmt.getAsObject() as {
      sign_name: string;
      month: number;
      status: string;
      element: string;
      description: string;
    };
    const monthKey = monthLabels[row.month - 1];
    if (!monthKey) continue;
    if (!results[row.sign_name]) {
      results[row.sign_name] = {};
    }
    results[row.sign_name][monthKey] = `${row.status} – ${row.description} (${row.element})`.trim();
  }
  stmt.free();
  return results;
}
