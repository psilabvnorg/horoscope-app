"""
Add or update Tu Vi data in existing SQLite database without recreating it.
Usage: python script/add-tuvi-to-db.py
"""

import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "src" / "data"
DB_PATH = ROOT / "public" / "data" / "horoscope.db"

def load_json(path: Path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)

if not DB_PATH.exists():
    print(f"Error: Database not found at {DB_PATH}")
    print("Run 'npm run build:db' first to create the database.")
    exit(1)

tuvi = load_json(DATA_DIR / "tu-vi.json")

conn = sqlite3.connect(DB_PATH)
conn.execute("PRAGMA foreign_keys = ON")
cursor = conn.cursor()

# Check if Tu Vi system already exists
existing = cursor.execute(
    "SELECT id FROM astrology_systems WHERE code = ?",
    (tuvi["system"]["code"],)
).fetchone()

if existing:
    tuvi_system_id = existing[0]
    print(f"Tu Vi system exists (id={tuvi_system_id}). Deleting old data...")
    
    # Get all Tu Vi sign IDs
    sign_ids = [row[0] for row in cursor.execute(
        "SELECT id FROM signs WHERE system_id = ?", (tuvi_system_id,)
    )]
    
    if sign_ids:
        placeholders = ",".join("?" * len(sign_ids))
        
        # Delete compatibility translations first
        cursor.execute(f"""
            DELETE FROM compatibility_translations WHERE compatibility_id IN (
                SELECT id FROM compatibility WHERE sign_id IN ({placeholders})
            )
        """, sign_ids)
        
        # Delete compatibility
        cursor.execute(f"DELETE FROM compatibility WHERE sign_id IN ({placeholders})", sign_ids)
        
        # Delete zodiac calendar entries
        cursor.execute(f"DELETE FROM zodiac_calendar_entries WHERE sign_id IN ({placeholders})", sign_ids)
        
        # Delete tarot meanings
        cursor.execute(f"DELETE FROM tarot_meanings WHERE sign_id IN ({placeholders})", sign_ids)
        
        # Delete sign translations
        cursor.execute(f"DELETE FROM sign_translations WHERE sign_id IN ({placeholders})", sign_ids)
        
        # Delete signs
        cursor.execute(f"DELETE FROM signs WHERE id IN ({placeholders})", sign_ids)
    
    # Delete Tu Vi element data (kim, moc, thuy, hoa, tho)
    tuvi_elements = [e["code"] for e in tuvi.get("elements", [])]
    if tuvi_elements:
        placeholders = ",".join("?" * len(tuvi_elements))
        cursor.execute(f"DELETE FROM element_tips WHERE element_code IN ({placeholders})", tuvi_elements)
        cursor.execute(f"DELETE FROM element_translations WHERE element_code IN ({placeholders})", tuvi_elements)
        cursor.execute(f"DELETE FROM elements WHERE code IN ({placeholders})", tuvi_elements)
    
    print("Old Tu Vi data deleted.")
else:
    # Insert Tu Vi astrology system
    cursor.execute("INSERT INTO astrology_systems (code) VALUES (?)", (tuvi["system"]["code"],))
    tuvi_system_id = cursor.lastrowid
    print(f"Created Tu Vi system with id={tuvi_system_id}")

# Insert Tu Vi elements
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
print(f"Inserted {len(tuvi.get('elements', []))} Tu Vi elements")

# Insert Tu Vi signs
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
print(f"Inserted {len(tuvi.get('signs', []))} Tu Vi signs")

# Insert Tu Vi compatibility
compat_count = 0
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
    compat_count += 1
print(f"Inserted {compat_count} Tu Vi compatibility entries")

conn.commit()
conn.close()

print(f"\nTu Vi data added to {DB_PATH}")
