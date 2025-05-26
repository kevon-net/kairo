export type DBConfig = {
  name: string;
  version: number;
  stores: {
    name: string;
    keyPath: string;
    indexes?: {
      name: string;
      keyPath: string;
      options?: IDBIndexParameters;
    }[];
  }[];
};
