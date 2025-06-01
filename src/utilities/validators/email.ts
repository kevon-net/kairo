import { errors } from './errors';

export const email = (val: string) =>
  !/^\S+@\S+\.\S+$/.test(val.trim()) && errors.isInvalid('email');
