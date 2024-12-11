import { expiry } from '@/data/constants';

export const getExpiry = (rememberUser: boolean = false) => {
  return {
    millisec: rememberUser
      ? expiry.session.extended.millisec
      : expiry.session.standard.millisec,
    sec: rememberUser
      ? expiry.session.extended.sec
      : expiry.session.standard.sec,
  };
};
