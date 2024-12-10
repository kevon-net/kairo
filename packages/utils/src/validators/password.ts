import { errors } from './errors';
import { isEmpty } from './empty';
import { hasLength } from './length';

export const password = (val: string, min: number, max: number) =>
  isEmpty.string(val, () =>
    hasLength.string(
      val,
      min,
      max,
      () =>
        !(
          /[$&+,:;=?@#|'<>.^*()%!-]/.test(val.trim()) &&
          /[0-9]/.test(val.trim()) &&
          /[a-z]/.test(val.trim()) &&
          /[A-Z]/.test(val.trim())
        ) && errors.isPassword
    )
  );
