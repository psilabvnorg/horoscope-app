type Database = {
  prepare: (sql: string) => {
    bind: (params: unknown[]) => void;
    step: () => boolean;
    getAsObject: () => Record<string, unknown>;
    free: () => void;
  };
};

let dbPromise: Promise<Database> | null = null;

export async function loadHoroscopeDb(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const sqlModule = await import(/* @vite-ignore */ 'https://esm.sh/sql.js@1.13.0');
      const initSqlJs = sqlModule.default || sqlModule;
      const SQL = await initSqlJs({ locateFile: file => `https://esm.sh/sql.js@1.13.0/dist/${file}` });
      const response = await fetch('/data/horoscope.db');
      if (!response.ok) {
        throw new Error(`Failed to load horoscope database: ${response.status}`);
      }
      const buffer = await response.arrayBuffer();
      return new SQL.Database(new Uint8Array(buffer));
    })();
  }
  return dbPromise;
}

export function resetHoroscopeDb() {
  dbPromise = null;
}
