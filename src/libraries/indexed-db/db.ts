import appData from '@/data/app';
import { INDEXED_DB } from '@/data/constants';
import { DBConfig } from '@/types/indexed-db';
import { Database, DatabaseError } from './transactions';

// indexedDB config
export const config = {
  name: appData.name.app.toLowerCase(),
  version: 1,
  stores: [
    {
      name: INDEXED_DB.TASKS,
      keyPath: 'id',
    },
    {
      name: INDEXED_DB.RECURRING_RULES,
      keyPath: 'id',
    },
    {
      name: INDEXED_DB.REMINDERS,
      keyPath: 'id',
    },
    {
      name: INDEXED_DB.TAGS,
      keyPath: 'id',
    },
    {
      name: INDEXED_DB.CATEGORIES,
      keyPath: 'id',
    },
  ],
};

export const openDatabase = async (config: DBConfig): Promise<Database> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(config.name, config.version);

    request.onerror = () => {
      console.error('Failed to open database', request.error);
      reject(new DatabaseError('Failed to open database'));
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Handle version change events
      db.onversionchange = () => {
        db.close();
        window.location.reload(); // Optional: reload the page to get the new version
      };

      resolve(new Database(db));
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      config.stores.forEach((store) => {
        if (!db.objectStoreNames.contains(store.name)) {
          const objectStore = db.createObjectStore(store.name, {
            keyPath: store.keyPath,
          });

          // Create indexes if specified
          store.indexes?.forEach((index) => {
            objectStore.createIndex(index.name, index.keyPath, index.options);
          });
        }
      });
    };
  });
};
