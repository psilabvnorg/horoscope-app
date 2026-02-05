import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, "../public/data/horoscope.db"));

// List all tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();

// Print first 5 rows of each table
tables.forEach(t => {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`📋 ${t.name}`);
  console.log("=".repeat(60));
  const rows = db.prepare(`SELECT * FROM "${t.name}" LIMIT 5`).all();
  if (rows.length === 0) {
    console.log("  (empty)");
  } else {
    console.table(rows);
  }
});

db.close();
