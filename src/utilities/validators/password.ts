import { errors } from './errors';

export const password = (val: string) =>
  !(
    /[$&+,:;=?@#|'<>.^*()%!-]/.test(val.trim()) &&
    /[0-9]/.test(val.trim()) &&
    /[a-z]/.test(val.trim()) &&
    /[A-Z]/.test(val.trim())
  ) && errors.isPassword;
