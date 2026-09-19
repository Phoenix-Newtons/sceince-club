import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

/** Load the database, seeding it from scratch when the file doesn't exist yet. */
export function loadDb(seedFn) {
  if (fs.existsSync(DB_FILE)) {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  }
  const seeded = seedFn();
  saveDb(seeded);
  console.log('[db] seeded fresh database at', DB_FILE);
  return seeded;
}

/** Atomic write: temp file + rename so a crash never corrupts the store. */
export function saveDb(db) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_FILE);
}
