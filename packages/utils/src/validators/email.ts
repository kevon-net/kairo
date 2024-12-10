import { errors } from './errors';
import { isEmpty } from './empty';

export const email = (val: string) =>
  isEmpty.string(
    val,
    () => !/^\S+@\S+\.\S+$/.test(val.trim()) && errors.isInvalid('email')
  );
