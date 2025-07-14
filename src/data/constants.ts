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
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;
export const MONTH = 30 * DAY;

export const DEFAULT_COLOR_SCHEME: 'light' | 'dark' = 'light';

export const COOKIE_NAME = {
  CONSENT_COOKIES: 'consent.cookies',
  LOCAL: { COUNTRY: 'local.country', COUNTRIES: 'local.countries' },
  COLOR_SCHEME: 'theme.color-scheme',
  COLOR_SCHEME_STATE: 'theme.color-scheme-state',
};

export const LOCAL_STORAGE_NAME = {
  COUNTRY: 'country',
  COUNTRIES: 'countries',
};

export const PARAM_NAME = {
  REDIRECT_AUTH: '/redirect',
};

export const GEO_DATA_URL = {
  COUNTRIES: `${process.env.NEXT_PUBLIC_REST_COUNTRIES_API_URL}`,
};

const WITHOUT_BODY: HeadersInit = {
  Accept: 'application/json',
};

const WITH_BODY: HeadersInit = {
  'Content-Type': 'application/json',
  ...WITHOUT_BODY,
};

export const HEADERS = { WITHOUT_BODY, WITH_BODY };

export const BUCKET_NAME = {
  AVATARS: 'avatars',
};

export const FILE_NAME = {
  AVATAR: 'avatar',
};

export const AUTH_URLS = {
  SIGN_IN: `${BASE_URL}/auth/sign-in`,
  SIGN_UP: `${BASE_URL}/auth/sign-up`,
  VERIFY_REQUEST: `${BASE_URL}/auth/verify-request`,
  ERROR: `${BASE_URL}/auth/error`,
  SIGN_OUT: `${BASE_URL}/auth/sign-out`,
  REDIRECT: {
    DEFAULT: '/app/home',
  },
};

export const HOSTED_BASE_URL = {
  PRIMARY: `https://example.com`,
};

export const INDEXED_DB = {
  SAMPLE_STORE: 'sampleStore',
};
