import { EXPIRY } from '@/data/constants';

export const getExpiry = (rememberUser: boolean = false) => {
  return {
    millisec: rememberUser
      ? EXPIRY.SESSION.EXTENDED.MILLISEC
      : EXPIRY.SESSION.STANDARD.MILLISEC,
    sec: rememberUser
      ? EXPIRY.SESSION.EXTENDED.SEC
      : EXPIRY.SESSION.STANDARD.SEC,
  };
};
