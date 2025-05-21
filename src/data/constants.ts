import { isProduction } from '@/utilities/helpers/environment';

export const HOSTNAME = process.env.NEXT_PUBLIC_HOST;

const URL_PREFIX =
  isProduction() && HOSTNAME != 'localhost:3000' ? 'https://' : 'http://';

export const BASE_URL = `${URL_PREFIX}${HOSTNAME}`;
export const API_URL = `${BASE_URL}/api`;

export const ICON_SIZE = 20;
export const ICON_WRAPPER_SIZE = ICON_SIZE + 8;
export const ICON_STROKE_WIDTH = 1.5;
export const SECTION_SPACING = 64;

export const MINUTE = 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;

export const DEFAULT_COLOR_SCHEME: 'light' | 'dark' = 'light';

export const COOKIE_NAME = {
  CONSENT_COOKIES: 'consent.cookies',
};
