const URL_PREFIX =
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PUBLIC_HOST != 'localhost:3000'
    ? 'https://'
    : 'http://';

export const HOSTNAME = process.env.NEXT_PUBLIC_HOST;

export const BASE_URL = `${URL_PREFIX}${HOSTNAME}`;

export const HOSTED_BASE_URL = {
  EXAMPLE: `https://example.com`,
};

export const DEFAULT_COLOR_SCHEME: 'light' | 'dark' = 'light';

export const API_URL = `${BASE_URL}/api`;

export const ICON_SIZE = 20;

export const ICON_WRAPPER_SIZE = ICON_SIZE + 8;

export const ICON_STROKE_WIDTH = 1.5;

export const SECTION_SPACING = 64;

export const TIMEOUT = { REDIRECT: 5000 };

export const EXPIRY = {
  MINUTE: 60,
  HOUR: 60 * 60,
  DAY: 60 * 60 * 24,
  WEEK: 60 * 60 * 24 * 7,
};

export const COOKIE_NAME = {
  CONSENT: { COOKIES: 'consent.cookies' },
  LOCAL: { COUNTRY: 'local.country', COUNTRIES: 'local.countries' },
  COLOR_SCHEME: 'theme.color-scheme',
  COLOR_SCHEME_STATE: 'theme.color-scheme-state',
};

export const LOCAL_STORAGE_NAME = {
  COUNTRY: 'country',
  COUNTRIES: 'countries',
};
