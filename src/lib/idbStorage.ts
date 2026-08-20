import { openDB, IDBPDatabase } from 'idb';
import type { WebStorage } from 'redux-persist';

const DB_NAME = 'loomit-offline';
const STORE_NAME = 'persist';

let db: IDBPDatabase | null = null;

const isBrowser = typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';

async function getDB(): Promise<IDBPDatabase> {
  if (!isBrowser) {
    throw new Error('IndexedDB доступна только в браузере');
  }

  if (db) return db;

  db = await openDB(DB_NAME, 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    },
  });

  return db;
}

const idbStorage: WebStorage = {
  async getItem(key: string): Promise<string | null> {
    if (!isBrowser) return null;
    const database = await getDB();
    const value = await database.get(STORE_NAME, key);
    return value ?? null;
  },

  async setItem(key: string, value: string): Promise<void> {
    if (!isBrowser) return;
    const database = await getDB();
    await database.put(STORE_NAME, value, key);
  },

  async removeItem(key: string): Promise<void> {
    if (!isBrowser) return;
    const database = await getDB();
    await database.delete(STORE_NAME, key);
  },
};

export default idbStorage;
