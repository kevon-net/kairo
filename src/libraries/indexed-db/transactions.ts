export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class Database {
  private db: IDBDatabase;

  constructor(db: IDBDatabase) {
    this.db = db;
  }

  async get<T>(
    storeName: string,
    key?: IDBValidKey,
    options?: {
      index?: string;
    }
  ): Promise<T | T[] | undefined> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);

      transaction.onerror = () => {
        reject(new DatabaseError(`Failed to get record(s) from ${storeName}`));
      };

      // Use index if specified
      const target = options?.index ? store.index(options.index) : store;

      // If no key is provided, get all records
      if (key === undefined) {
        const request = target.getAll();

        request.onsuccess = (event) => {
          const result = (event.target as IDBRequest).result as T[];
          resolve(result.length > 0 ? result : []);
        };

        request.onerror = () => {
          reject(
            new DatabaseError(`Failed to get all records from ${storeName}`)
          );
        };
      } else {
        // Get single record by key
        const request = target.get(key);

        request.onsuccess = (event) => {
          const result = (event.target as IDBRequest).result as T | undefined;
          resolve(result);
        };

        request.onerror = () => {
          reject(new DatabaseError(`Failed to get record from ${storeName}`));
        };
      }
    });
  }

  async add<T extends object>(
    storeName: string,
    data: T | T[]
  ): Promise<IDBValidKey | IDBValidKey[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      transaction.onerror = () => {
        reject(new DatabaseError(`Failed to add record(s) to ${storeName}`));
      };

      if (Array.isArray(data)) {
        if (data.length === 0) {
          reject(
            new DatabaseError('Empty array provided, no operation performed.')
          );
          return;
        }

        const keys: IDBValidKey[] = [];
        let completed = 0;

        const handleCompletion = () => {
          completed++;

          if (completed === data.length) {
            resolve(keys); // Resolve once all items are processed
          }
        };

        data.forEach((item) => {
          const request = store.add(item);

          request.onsuccess = (event) => {
            const key = (event.target as IDBRequest).result;
            keys.push(key);
            handleCompletion();
          };

          request.onerror = (event) => {
            event.stopPropagation(); // Prevent transaction abort
            handleCompletion();
          };
        });
      } else {
        const request = store.add(data);

        request.onsuccess = (event) => {
          const key = (event.target as IDBRequest).result;
          resolve(key);
        };

        request.onerror = () => {
          reject(
            new DatabaseError(
              `Failed to add record to ${storeName}. The record might already exist.`
            )
          );
        };
      }
    });
  }

  async put<T extends object>(
    storeName: string,
    data: T | T[]
  ): Promise<IDBValidKey | IDBValidKey[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const keys: IDBValidKey[] = [];
      let completed = 0;

      transaction.onerror = () => {
        reject(new DatabaseError(`Failed to update record(s) in ${storeName}`));
      };

      if (Array.isArray(data)) {
        if (data.length === 0) {
          reject(
            new DatabaseError('Empty array provided, no operation performed.')
          );
          return;
        }

        const handleCompletion = () => {
          completed++;

          if (completed === data.length) {
            resolve(keys); // Resolve once all items are processed
          }
        };

        data.forEach((item) => {
          const request = store.put(item);

          request.onsuccess = (event) => {
            const key = (event.target as IDBRequest).result;
            keys.push(key);
            handleCompletion();
          };

          request.onerror = (event) => {
            event.stopPropagation(); // Prevent transaction abortion
            handleCompletion();
          };
        });
      } else {
        const request = store.put(data);

        request.onsuccess = (event) => {
          const key = (event.target as IDBRequest).result;
          resolve(key);
        };

        request.onerror = () => {
          reject(new DatabaseError(`Failed to update record in ${storeName}`));
        };
      }
    });
  }

  async delete<T extends { [key: string]: any }>(
    storeName: string,
    data: T | T[],
    keyPath?: string
  ): Promise<IDBValidKey[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      // Get the keyPath from the store if not provided
      const actualKeyPath = keyPath || (store.keyPath as string);

      if (!actualKeyPath || typeof actualKeyPath !== 'string') {
        reject(new DatabaseError('Invalid or missing keyPath.'));
        return;
      }

      if (Array.isArray(data)) {
        if (data.length === 0) {
          reject(
            new DatabaseError('Empty array provided, no operation performed.')
          );
          return;
        }

        const success: IDBValidKey[] = [];
        let completed = 0;

        transaction.onerror = () => {
          reject(
            new DatabaseError(
              `Transaction failed while deleting from ${storeName}`
            )
          );
        };

        const handleCompletion = () => {
          completed++;

          if (completed === data.length) {
            resolve(success); // Resolve once all items are processed
          }
        };

        data.forEach((item) => {
          const key = item[actualKeyPath];
          const request = store.delete(key);

          request.onsuccess = () => {
            success.push(key);
            handleCompletion();
          };

          request.onerror = (event) => {
            event.stopPropagation(); // Prevent transaction abortion
            handleCompletion();
          };
        });
      } else {
        const key = data[actualKeyPath];
        const request = store.delete(key);

        transaction.onerror = () => {
          reject(
            new DatabaseError(
              `Transaction failed while deleting from ${storeName}`
            )
          );
        };

        request.onsuccess = () => {
          resolve([key]);
        };

        request.onerror = () => {
          reject(
            new DatabaseError(
              `Failed to delete item with key ${key} from ${storeName}`
            )
          );
        };
      }
    });
  }
}
