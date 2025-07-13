import { appName } from '@/data/app';
import { INDEXED_DB } from '@/data/constants';
import { DBConfig } from '@/types/indexed-db';
import { Database, DatabaseError } from './transactions';

// indexedDB config
export const config = {
  name: appName.toLowerCase(),
  version: 1,
  stores: [
    {
      name: INDEXED_DB.SAMPLE_STORE,
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

export const deleteDatabase = async (dbName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(dbName);

    request.onsuccess = () => {
      console.log(`Deleted IndexedDB "${dbName}" successfully.`);
      resolve();
    };

    request.onerror = () => {
      console.error(`Error deleting IndexedDB "${dbName}":`, request.error);
      reject(request.error);
    };

    request.onblocked = () => {
      console.warn(
        `Deletion of "${dbName}" is blocked. Close all open tabs using the database.`
      );
    };
  });
};
