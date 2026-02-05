import type {
  DailyForecastData,
  ElementBalanceData,
  TuViCompatibilityEntry,
  TuViSign,
  TuViSignProfile,
} from '@/types';
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

export async function getTuViProfiles(lang: string): Promise<Record<TuViSign, TuViSignProfile>> {
  const db = await loadHoroscopeDb();
  const stmt = db.prepare(`
    SELECT s.slug as slug,
           s.element_code as element_code,
           s.image_url as image_url,
           st.name as name,
           st.description as description,
           et.name as element_name,
           tm.upright as upright,
           tm.reversed as reversed
    FROM signs s
    JOIN astrology_systems sys ON sys.id = s.system_id
    JOIN sign_translations st ON st.sign_id = s.id AND st.lang = ?
    LEFT JOIN element_translations et ON et.element_code = s.element_code AND et.lang = st.lang
    LEFT JOIN tarot_meanings tm ON tm.sign_id = s.id AND tm.lang = st.lang
    WHERE sys.code = 'eastern_tuvi'
    ORDER BY s.slug
  `);
  const results = {} as Record<TuViSign, TuViSignProfile>;
  stmt.bind([lang]);
  while (stmt.step()) {
    const row = stmt.getAsObject() as {
      slug: TuViSign;
      element_code: string | null;
      image_url: string | null;
      name: string;
      description: string;
      element_name?: string | null;
      upright?: string | null;
      reversed?: string | null;
    };
    if (!row.slug || !row.name) continue;
    results[row.slug] = {
      slug: row.slug,
      name: row.name,
      description: row.description || '',
      element: row.element_code,
      elementName: row.element_name || null,
      imageUrl: row.image_url || null,
      tarot: row.upright || row.reversed ? { upright: row.upright, reversed: row.reversed } : undefined,
    };
  }
  stmt.free();
  return results;
}

export async function getTuViCompatibility(lang: string): Promise<Record<TuViSign, TuViCompatibilityEntry[]>> {
  const db = await loadHoroscopeDb();
  const stmt = db.prepare(`
    SELECT s.slug as sign_slug,
           s2.slug as other_slug,
           c.relation_type as relation_type,
           ct.description as description
    FROM compatibility c
    JOIN signs s ON s.id = c.sign_id
    JOIN signs s2 ON s2.id = c.other_sign_id
    JOIN astrology_systems sys ON sys.id = s.system_id
    JOIN astrology_systems sys2 ON sys2.id = s2.system_id
    JOIN compatibility_translations ct ON ct.compatibility_id = c.id
    WHERE sys.code = 'eastern_tuvi' AND sys2.code = 'eastern_tuvi' AND ct.lang = ?
    ORDER BY s.slug, s2.slug
  `);
  const results = {} as Record<TuViSign, TuViCompatibilityEntry[]>;
  stmt.bind([lang]);
  while (stmt.step()) {
    const row = stmt.getAsObject() as {
      sign_slug: TuViSign;
      other_slug: TuViSign;
      relation_type: string;
      description: string;
    };
    if (!row.sign_slug || !row.other_slug) continue;
    if (!results[row.sign_slug]) {
      results[row.sign_slug] = [];
    }
    results[row.sign_slug].push({
      other: row.other_slug,
      type: row.relation_type,
      description: row.description || '',
    });
  }
  stmt.free();
  return results;
}

export async function getDailyForecast(signSlug: string, lang: string): Promise<DailyForecastData | null> {
  const db = await loadHoroscopeDb();
  const forecastStmt = db.prepare(`
    SELECT f.id as forecast_id,
           f.date as date,
           f.love_score as love_score,
           f.career_score as career_score,
           f.emotion_score as emotion_score,
           f.energy_score as energy_score,
           ft.summary as summary
    FROM forecasts f
    JOIN signs s ON s.id = f.sign_id
    JOIN astrology_systems sys ON sys.id = s.system_id
    LEFT JOIN forecast_translations ft ON ft.forecast_id = f.id AND ft.lang = ?
    WHERE sys.code = 'western' AND s.slug = ? AND f.type_code = 'daily'
    ORDER BY f.date DESC
    LIMIT 1
  `);
  forecastStmt.bind([lang, signSlug]);
  if (!forecastStmt.step()) {
    forecastStmt.free();
    return null;
  }
  const forecast = forecastStmt.getAsObject() as {
    forecast_id: number;
    date: string | null;
    love_score: number | null;
    career_score: number | null;
    emotion_score: number | null;
    energy_score: number | null;
    summary?: string | null;
  };
  forecastStmt.free();

  const luckyStmt = db.prepare(`
    SELECT numbers, color, direction, hours
    FROM lucky_attributes
    WHERE forecast_id = ?
  `);
  luckyStmt.bind([forecast.forecast_id]);
  let lucky = {
    numbers: [] as number[],
    color: null as string | null,
    direction: null as string | null,
    hours: [] as string[],
  };
  if (luckyStmt.step()) {
    const row = luckyStmt.getAsObject() as {
      numbers?: string | null;
      color?: string | null;
      direction?: string | null;
      hours?: string | null;
    };
    lucky = {
      numbers: row.numbers ? JSON.parse(row.numbers) : [],
      color: row.color || null,
      direction: row.direction || null,
      hours: row.hours ? JSON.parse(row.hours) : [],
    };
  }
  luckyStmt.free();

  return {
    date: forecast.date || null,
    summary: forecast.summary || null,
    scores: {
      love: forecast.love_score ?? null,
      career: forecast.career_score ?? null,
      emotion: forecast.emotion_score ?? null,
      energy: forecast.energy_score ?? null,
    },
    lucky,
  };
}
