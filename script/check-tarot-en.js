import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, "../public/data/horoscope.db"));

const rows = db.prepare("SELECT * FROM tarot_meanings WHERE lang = 'en' LIMIT 5").all();
console.table(rows);
db.close();
