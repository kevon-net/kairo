// Dynamically set the URL prefix based on the environment
const URL_PREFIX =
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PUBLIC_HOST != 'localhost:3000'
    ? 'https://'
    : 'http://';

export const HOSTNAME = process.env.NEXT_PUBLIC_HOST;

export const BASE_URL = `${URL_PREFIX}${HOSTNAME}`;

export const API_URL = `${BASE_URL}/api`;

export const AUTH_URLS = {
  SIGN_IN: `${BASE_URL}/auth/sign-in`,
  SIGN_UP: `${BASE_URL}/auth/sign-up`,
  VERIFY_REQUEST: `${BASE_URL}/auth/verify-request`,
  ERROR: `${BASE_URL}/auth/error`,
  SIGN_OUT: `${BASE_URL}/auth/sign-out`,
};

export const GEO_DATA_URL = {
  COUNTRIES: `${process.env.NEXT_PUBLIC_REST_COUNTRIES_API_URL}`,
};

export const ICON_SIZE = 20;

export const ICON_WRAPPER_SIZE = ICON_SIZE + 8;

export const ICON_STROKE_WIDTH = 1.5;

export const TRANSITION_DURATION = 250;

export const SECTION_SPACING = 64;

export const FONT_CTA_TITLE = 40;

export const FONT = { CTA_TITLE: FONT_CTA_TITLE };

export const TIMEOUT = { REDIRECT: 5000 };

export const FILE_NAME = {
  AVATAR: 'avatar',
};

export const COOKIE_NAME = {
  CONSENT: { COOKIES: 'consent.cookies' },
  LOCAL: { COUNTRY: 'local.country', COUNTRIES: 'local.countries' },
  COLOR_SCHEME: 'theme.color-scheme',
  COLOR_SCHEME_STATE: 'theme.color-scheme-state',
};

export const BUCKET_NAME = {
  AVATARS: 'avatars',
};

export const LOCAL_STORAGE_NAME = {
  COUNTRY: 'country',
  COUNTRIES: 'countries',
};

const WITHOUT_BODY: HeadersInit = {
  Accept: 'application/json',
};

const WITH_BODY: HeadersInit = {
  'Content-Type': 'application/json',
  ...WITHOUT_BODY,
};

export const HEADERS = { WITH_BODY, WITHOUT_BODY };

const EXPIRY_SESSION_SEC_STANDARD = 60 * 60 * 24;
const EXPIRY_SESSION_SEC_EXTENDED = 7 * EXPIRY_SESSION_SEC_STANDARD;

export const EXPIRY = {
  SESSION: {
    STANDARD: {
      SEC: EXPIRY_SESSION_SEC_STANDARD,
      MILLISEC: EXPIRY_SESSION_SEC_STANDARD * 1000,
    },
    EXTENDED: {
      SEC: EXPIRY_SESSION_SEC_EXTENDED,
      MILLISEC: EXPIRY_SESSION_SEC_EXTENDED * 1000,
    },
  },
};

export const URL_PARAM = { REDIRECT: 'redirect' };
