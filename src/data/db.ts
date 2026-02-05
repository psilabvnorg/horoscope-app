import initSqlJs, { Database } from 'sql.js';

let dbPromise: Promise<Database> | null = null;

export async function loadHoroscopeDb(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = (async () => {
      console.log('[DB] Loading SQLite database...');
      
      // Initialize sql.js with the WASM file from CDN
      const SQL = await initSqlJs({
        locateFile: (file: string) => `https://sql.js.org/dist/${file}`
      });
      
      // Fetch the database file
      const response = await fetch('/data/horoscope.db');
      if (!response.ok) {
        throw new Error(`Failed to load horoscope database: ${response.status}`);
      }
      const buffer = await response.arrayBuffer();
      console.log('[DB] SQLite database loaded successfully!', `Size: ${buffer.byteLength} bytes`);
      
      return new SQL.Database(new Uint8Array(buffer));
    })();
  }
  return dbPromise;
}

export function resetHoroscopeDb() {
  dbPromise = null;
}
