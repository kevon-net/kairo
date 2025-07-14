// Make all properties, including nested ones, optional
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
