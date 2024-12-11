import { errors } from './errors';

export const isEmpty = {
  string: (val: string, action: () => any) =>
    val.trim() ? action() : errors.isEmpty,

  number: (val: number, action: () => any) => (val ? action() : errors.isEmpty),

  checkbox: (val: boolean) => !val && errors.isUnchecked,
};
