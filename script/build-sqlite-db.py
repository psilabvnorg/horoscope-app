import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "src" / "data"
OUTPUT_DIR = ROOT / "public" / "data"
OUTPUT_PATH = OUTPUT_DIR / "horoscope.db"

def load_json(path: Path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)

zodiac = load_json(DATA_DIR / "zodiac.json")
love = load_json(DATA_DIR / "love.json")
tarot = load_json(DATA_DIR / "tarot.json")
zodiac_calendar = load_json(DATA_DIR / "zodiac-star-calendar-2026.json")
element_balance = load_json(DATA_DIR / "element-balance.json")
tuvi = load_json(DATA_DIR / "tu-vi.json")

translation_root = DATA_DIR / "translations"
languages = [p.name for p in translation_root.iterdir() if p.is_dir()]
lang_data = {}
for lang in languages:
    lang_dir = translation_root / lang
    zodiac_calendar_path = lang_dir / "zodiac-star-calendar-2026.json"
    lang_data[lang] = {
        "zodiac": load_json(lang_dir / "zodiac.json"),
        "love": load_json(lang_dir / "love.json"),
        "tarot": load_json(lang_dir / "tarot.json"),
        "zodiac_calendar": load_json(zodiac_calendar_path) if zodiac_calendar_path.exists() else {},
        "element_balance": load_json(lang_dir / "element-balance.json"),
    }

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
if OUTPUT_PATH.exists():
    OUTPUT_PATH.unlink()

conn = sqlite3.connect(OUTPUT_PATH)
conn.execute("PRAGMA foreign_keys = ON")

schema = """
CREATE TABLE astrology_systems (
    id INTEGER PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE signs (
    id INTEGER PRIMARY KEY,
    system_id INTEGER NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    element_code TEXT,
    image_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(system_id) REFERENCES astrology_systems(id)
);

CREATE TABLE sign_translations (
    id INTEGER PRIMARY KEY,
    sign_id INTEGER NOT NULL,
    lang TEXT NOT NULL,
    name TEXT,
    description TEXT,
    UNIQUE(sign_id, lang),
    FOREIGN KEY(sign_id) REFERENCES signs(id)
);

CREATE TABLE elements (
    code TEXT PRIMARY KEY,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE element_translations (
    id INTEGER PRIMARY KEY,
    element_code TEXT NOT NULL,
    lang TEXT NOT NULL,
    name TEXT,
    keywords TEXT,
    balance TEXT,
    imbalance TEXT,
    UNIQUE(element_code, lang),
    FOREIGN KEY(element_code) REFERENCES elements(code)
);

CREATE TABLE element_tips (
    id INTEGER PRIMARY KEY,
    element_code TEXT NOT NULL,
    lang TEXT NOT NULL,
    tip TEXT,
    FOREIGN KEY(element_code) REFERENCES elements(code)
);

CREATE TABLE forecast_types (
    code TEXT PRIMARY KEY
);

CREATE TABLE forecasts (
    id INTEGER PRIMARY KEY,
    sign_id INTEGER NOT NULL,
    type_code TEXT NOT NULL,
    date TEXT,
    month INTEGER,
    year INTEGER,
    love_score INTEGER,
    career_score INTEGER,
    emotion_score INTEGER,
    energy_score INTEGER,
    FOREIGN KEY(sign_id) REFERENCES signs(id),
    FOREIGN KEY(type_code) REFERENCES forecast_types(code)
);

CREATE TABLE forecast_translations (
    id INTEGER PRIMARY KEY,
    forecast_id INTEGER NOT NULL,
    lang TEXT NOT NULL,
    summary TEXT,
    UNIQUE(forecast_id, lang),
    FOREIGN KEY(forecast_id) REFERENCES forecasts(id)
);

CREATE TABLE lucky_attributes (
    id INTEGER PRIMARY KEY,
    forecast_id INTEGER NOT NULL,
    numbers TEXT,
    color TEXT,
    direction TEXT,
    hours TEXT,
    FOREIGN KEY(forecast_id) REFERENCES forecasts(id)
);

CREATE TABLE compatibility (
    id INTEGER PRIMARY KEY,
    sign_id INTEGER NOT NULL,
    other_sign_id INTEGER NOT NULL,
    relation_type TEXT NOT NULL,
    FOREIGN KEY(sign_id) REFERENCES signs(id),
    FOREIGN KEY(other_sign_id) REFERENCES signs(id)
);

CREATE TABLE compatibility_translations (
    id INTEGER PRIMARY KEY,
    compatibility_id INTEGER NOT NULL,
    lang TEXT NOT NULL,
    description TEXT,
    UNIQUE(compatibility_id, lang),
    FOREIGN KEY(compatibility_id) REFERENCES compatibility(id)
);

CREATE TABLE actions (
    id INTEGER PRIMARY KEY,
    forecast_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    FOREIGN KEY(forecast_id) REFERENCES forecasts(id)
);

CREATE TABLE action_translations (
    id INTEGER PRIMARY KEY,
    action_id INTEGER NOT NULL,
    lang TEXT NOT NULL,
    content TEXT NOT NULL,
    UNIQUE(action_id, lang),
    FOREIGN KEY(action_id) REFERENCES actions(id)
);

CREATE TABLE tarot_suits (
    id INTEGER PRIMARY KEY,
    slug TEXT UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tarot_suit_translations (
    id INTEGER PRIMARY KEY,
    suit_id INTEGER,
    lang TEXT,
    name TEXT,
    FOREIGN KEY(suit_id) REFERENCES tarot_suits(id)
);

CREATE TABLE tarot_meanings (
    id INTEGER PRIMARY KEY,
    sign_id INTEGER NOT NULL,
    lang TEXT NOT NULL,
    upright TEXT,
    reversed TEXT,
    UNIQUE(sign_id, lang),
    FOREIGN KEY(sign_id) REFERENCES signs(id)
);

CREATE TABLE traits (
    id TEXT PRIMARY KEY,
    category TEXT,
    emoji TEXT
);

CREATE TABLE trait_translations (
    id INTEGER PRIMARY KEY,
    trait_id TEXT NOT NULL,
    lang TEXT NOT NULL,
    name TEXT,
    description TEXT,
    UNIQUE(trait_id, lang),
    FOREIGN KEY(trait_id) REFERENCES traits(id)
);

CREATE TABLE zodiac_calendar_entries (
    id INTEGER PRIMARY KEY,
    sign_id INTEGER NOT NULL,
    month INTEGER NOT NULL,
    status TEXT NOT NULL,
    element TEXT,
    sign TEXT,
    description TEXT,
    lang TEXT NOT NULL,
    UNIQUE(sign_id, month, lang),
    FOREIGN KEY(sign_id) REFERENCES signs(id)
);
"""

conn.executescript(schema)

cursor = conn.cursor()
cursor.execute("INSERT INTO astrology_systems (code) VALUES (?)", ("western",))
system_id = cursor.lastrowid

cursor.execute("INSERT OR IGNORE INTO astrology_systems (code) VALUES (?)", (tuvi["system"]["code"],))
tuvi_system_id = cursor.execute(
    "SELECT id FROM astrology_systems WHERE code = ?",
    (tuvi["system"]["code"],),
).fetchone()[0]

zodiac_element_map = {
    "aries": "fire",
    "leo": "fire",
    "sagittarius": "fire",
    "taurus": "earth",
    "virgo": "earth",
    "capricorn": "earth",
    "gemini": "air",
    "libra": "air",
    "aquarius": "air",
    "cancer": "water",
    "scorpio": "water",
    "pisces": "water",
}

zodiac_slug_to_id = {}
for name, description in zodiac.items():
    slug = name.lower()
    element_code = zodiac_element_map.get(slug)
    cursor.execute(
        "INSERT INTO signs (system_id, slug, element_code, image_url) VALUES (?, ?, ?, ?)",
        (system_id, slug, element_code, None),
    )
    sign_id = cursor.lastrowid
    zodiac_slug_to_id[slug] = sign_id
    cursor.execute(
        "INSERT INTO sign_translations (sign_id, lang, name, description) VALUES (?, ?, ?, ?)",
        (sign_id, "en", name, description),
    )

for lang, data in lang_data.items():
    for name, description in data["zodiac"].items():
        slug = name.lower()
        sign_id = zodiac_slug_to_id.get(slug)
        if sign_id:
            cursor.execute(
                "INSERT INTO sign_translations (sign_id, lang, name, description) VALUES (?, ?, ?, ?)",
                (sign_id, lang, name, description),
            )

for element_code in element_balance.keys():
    cursor.execute("INSERT INTO elements (code) VALUES (?)", (element_code,))

for element_code, element_data in element_balance.items():
    cursor.execute(
        "INSERT INTO element_translations (element_code, lang, name, keywords, balance, imbalance) VALUES (?, ?, ?, ?, ?, ?)",
        (
            element_code,
            "en",
            element_code,
            json.dumps(element_data.get("keywords", [])),
            element_data.get("balance", ""),
            element_data.get("imbalance", ""),
        ),
    )
    for tip in element_data.get("tips", []):
        cursor.execute(
            "INSERT INTO element_tips (element_code, lang, tip) VALUES (?, ?, ?)",
            (element_code, "en", tip),
        )

for lang, data in lang_data.items():
    for element_code, element_data in data["element_balance"].items():
        cursor.execute(
            "INSERT INTO element_translations (element_code, lang, name, keywords, balance, imbalance) VALUES (?, ?, ?, ?, ?, ?)",
            (
                element_code,
                lang,
                element_code,
                json.dumps(element_data.get("keywords", [])),
                element_data.get("balance", ""),
                element_data.get("imbalance", ""),
            ),
        )
        for tip in element_data.get("tips", []):
            cursor.execute(
                "INSERT INTO element_tips (element_code, lang, tip) VALUES (?, ?, ?)",
                (element_code, lang, tip),
            )

for element in tuvi.get("elements", []):
    cursor.execute("INSERT OR IGNORE INTO elements (code) VALUES (?)", (element["code"],))
    for lang, data in element.get("translations", {}).items():
        cursor.execute(
            "INSERT INTO element_translations (element_code, lang, name, keywords, balance, imbalance) VALUES (?, ?, ?, ?, ?, ?)",
            (
                element["code"],
                lang,
                data.get("name"),
                json.dumps(data.get("keywords", [])),
                data.get("balance"),
                data.get("imbalance"),
            ),
        )
    for lang, tips in element.get("tips", {}).items():
        for tip in tips:
            cursor.execute(
                "INSERT INTO element_tips (element_code, lang, tip) VALUES (?, ?, ?)",
                (element["code"], lang, tip),
            )

tuvi_slug_to_id = {}
for sign in tuvi.get("signs", []):
    cursor.execute(
        "INSERT INTO signs (system_id, slug, element_code, image_url) VALUES (?, ?, ?, ?)",
        (tuvi_system_id, sign["slug"], sign.get("element"), sign.get("image_url")),
    )
    sign_id = cursor.lastrowid
    tuvi_slug_to_id[sign["slug"]] = sign_id

    for lang, data in sign.get("translations", {}).items():
        cursor.execute(
            "INSERT INTO sign_translations (sign_id, lang, name, description) VALUES (?, ?, ?, ?)",
            (sign_id, lang, data.get("name"), data.get("description")),
        )

    for lang, tarot_entry in sign.get("tarot", {}).items():
        cursor.execute(
            "INSERT INTO tarot_meanings (sign_id, lang, upright, reversed) VALUES (?, ?, ?, ?)",
            (sign_id, lang, tarot_entry.get("upright"), tarot_entry.get("reversed")),
        )

    for entry in sign.get("calendar", []):
        cursor.execute(
            "INSERT INTO zodiac_calendar_entries (sign_id, month, status, element, sign, description, lang) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (
                sign_id,
                entry.get("month"),
                entry.get("status"),
                entry.get("element"),
                entry.get("sign"),
                entry.get("description"),
                entry.get("lang"),
            ),
        )

suits = ["wands", "cups", "swords", "pentacles"]
suit_id_map = {}
for suit in suits:
    cursor.execute("INSERT INTO tarot_suits (slug) VALUES (?)", (suit,))
    suit_id_map[suit] = cursor.lastrowid

for lang in lang_data.keys():
    for suit in suits:
        cursor.execute(
            "INSERT INTO tarot_suit_translations (suit_id, lang, name) VALUES (?, ?, ?)",
            (suit_id_map[suit], lang, suit),
        )

tarot_signs = {}
for section, cards in tarot.items():
    for card_name in cards.keys():
        if card_name not in tarot_signs:
            slug = "-".join(filter(None, "".join(c if c.isalnum() else " " for c in card_name.lower()).split()))
            cursor.execute(
                "INSERT INTO signs (system_id, slug, element_code, image_url) VALUES (?, ?, ?, ?)",
                (system_id, slug, None, None),
            )
            sign_id = cursor.lastrowid
            tarot_signs[card_name] = sign_id
            cursor.execute(
                "INSERT INTO sign_translations (sign_id, lang, name, description) VALUES (?, ?, ?, ?)",
                (sign_id, "en", card_name, None),
            )

for lang, data in lang_data.items():
    for section, cards in data["tarot"].items():
        for card_name in cards.keys():
            sign_id = tarot_signs.get(card_name)
            if sign_id:
                cursor.execute(
                    "INSERT INTO sign_translations (sign_id, lang, name, description) VALUES (?, ?, ?, ?)",
                    (sign_id, lang, card_name, None),
                )

for section, cards in tarot.items():
    for card_name, description in cards.items():
        sign_id = tarot_signs.get(card_name)
        if sign_id:
            cursor.execute(
                "INSERT INTO tarot_meanings (sign_id, lang, upright, reversed) VALUES (?, ?, ?, ?)",
                (sign_id, "en", description, None),
            )

for lang, data in lang_data.items():
    for section, cards in data["tarot"].items():
        for card_name, description in cards.items():
            sign_id = tarot_signs.get(card_name)
            if sign_id:
                cursor.execute(
                    "INSERT INTO tarot_meanings (sign_id, lang, upright, reversed) VALUES (?, ?, ?, ?)",
                    (sign_id, lang, description, None),
                )

for sign_name, matches in love.items():
    sign_id = zodiac_slug_to_id.get(sign_name.lower())
    if not sign_id:
        continue
    for other_name, description in matches.items():
        other_id = zodiac_slug_to_id.get(other_name.lower())
        if not other_id:
            continue
        cursor.execute(
            "INSERT INTO compatibility (sign_id, other_sign_id, relation_type) VALUES (?, ?, ?)",
            (sign_id, other_id, "neutral"),
        )
        relation_id = cursor.lastrowid
        cursor.execute(
            "INSERT INTO compatibility_translations (compatibility_id, lang, description) VALUES (?, ?, ?)",
            (relation_id, "en", description),
        )

for lang, data in lang_data.items():
    for sign_name, matches in data["love"].items():
        sign_id = zodiac_slug_to_id.get(sign_name.lower())
        if not sign_id:
            continue
        for other_name, description in matches.items():
            other_id = zodiac_slug_to_id.get(other_name.lower())
            if not other_id:
                continue
            row = cursor.execute(
                "SELECT id FROM compatibility WHERE sign_id = ? AND other_sign_id = ? LIMIT 1",
                (sign_id, other_id),
            ).fetchone()
            if row:
                cursor.execute(
                    "INSERT INTO compatibility_translations (compatibility_id, lang, description) VALUES (?, ?, ?)",
                    (row[0], lang, description),
                )

for entry in tuvi.get("compatibility", []):
    sign_id = tuvi_slug_to_id.get(entry.get("sign"))
    other_id = tuvi_slug_to_id.get(entry.get("other"))
    if not sign_id or not other_id:
        continue
    cursor.execute(
        "INSERT INTO compatibility (sign_id, other_sign_id, relation_type) VALUES (?, ?, ?)",
        (sign_id, other_id, entry.get("type", "neutral")),
    )
    relation_id = cursor.lastrowid
    for lang, description in entry.get("translations", {}).items():
        cursor.execute(
            "INSERT INTO compatibility_translations (compatibility_id, lang, description) VALUES (?, ?, ?)",
            (relation_id, lang, description),
        )

month_order = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

def insert_calendar_entries(calendar_data, lang):
    for sign_name, months in calendar_data.items():
        sign_id = zodiac_slug_to_id.get(sign_name.lower())
        if not sign_id:
            continue
        for month_key, description in months.items():
            try:
                month_index = month_order.index(month_key) + 1
            except ValueError:
                continue
            parts = description.split(" – ")
            status = parts[0] if parts else ""
            rest = parts[1] if len(parts) > 1 else ""
            element = ""
            detail = rest
            if "(" in rest and ")" in rest:
                start = rest.find("(")
                end = rest.find(")", start)
                element = rest[start + 1:end]
                detail = (rest[:start] + rest[end + 1:]).strip()
            cursor.execute(
                "INSERT INTO zodiac_calendar_entries (sign_id, month, status, element, sign, description, lang) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (sign_id, month_index, status, element, element, detail, lang),
            )

insert_calendar_entries(zodiac_calendar, "en")
for lang, data in lang_data.items():
    insert_calendar_entries(data["zodiac_calendar"], lang)

cursor.execute("INSERT INTO forecast_types (code) VALUES (?)", ("daily",))
sample_date = "2026-05-13"
sample_month = 5
sample_year = 2026

for slug, sign_id in zodiac_slug_to_id.items():
    cursor.execute(
        "INSERT INTO forecasts (sign_id, type_code, date, month, year, love_score, career_score, emotion_score, energy_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (sign_id, "daily", sample_date, sample_month, sample_year, 3, 4, 3, 4),
    )
    forecast_id = cursor.lastrowid
    cursor.execute(
        "INSERT INTO forecast_translations (forecast_id, lang, summary) VALUES (?, ?, ?)",
        (
            forecast_id,
            "en",
            f"{slug.title()} sees steady momentum today—focus on small wins and keep your pace consistent.",
        ),
    )
    cursor.execute(
        "INSERT INTO lucky_attributes (forecast_id, numbers, color, direction, hours) VALUES (?, ?, ?, ?, ?)",
        (
            forecast_id,
            json.dumps([2, 7]),
            "silver",
            "Northeast",
            json.dumps(["09:00-11:00", "19:00-20:00"]),
        ),
    )

conn.commit()
conn.close()

print(f"SQLite database created at {OUTPUT_PATH}")
