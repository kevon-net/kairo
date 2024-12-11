import { errors } from './errors';
import { isEmpty } from './empty';

export const hasLength = {
  string(val: string, min: number, max: number, action: () => any) {
    return isEmpty.string(val, () => {
      if (val.trim().length < min) {
        return errors.isShort(min);
      } else if (val.trim().length > max) {
        return errors.isLong(max);
      } else return action();
    });
  },

  number(val: number, min: number, max: number, action: () => any) {
    return isEmpty.number(val, () => {
      if (val < min) {
        return errors.isShort(min);
      } else if (val > max) {
        return errors.isLong(max);
      } else return action();
    });
  },
};
