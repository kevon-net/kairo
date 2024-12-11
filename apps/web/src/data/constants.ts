// Dynamically set the URL prefix based on the environment
const urlPrefix =
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PUBLIC_HOST != 'localhost:3000'
    ? 'https://'
    : 'http://';

export const hostName = process.env.NEXT_PUBLIC_HOST;

export const baseUrl = `${urlPrefix}${hostName}`;

export const apiUrl = `${baseUrl}/api`;

export const authUrls = {
  signIn: `${baseUrl}/auth/sign-in`,
  signUp: `${baseUrl}/auth/sign-up`,
  verifyRequest: `${baseUrl}/auth/verify-request`,
  error: `${baseUrl}/auth/error`,
  signOut: `${baseUrl}/auth/sign-out`,
  passwordForgot: `${baseUrl}/auth/password/forgot`,
};

export const geoDataUrl = {
  ip: `${process.env.NEXT_PUBLIC_IP_API_URL}`,
  countries: `${process.env.NEXT_PUBLIC_REST_COUNTRIES_API_URL}`,
};

export const iconSize = 20;

export const iconWrapperSize = iconSize + 8;

export const iconStrokeWidth = 1.5;

export const transitionDuration = 250;

export const sectionSpacing = 64;

export const fontCtaTitle = 40;

export const font = { ctaTitle: fontCtaTitle };

export const passwordRequirements = [
  { re: /[0-9]/, label: 'number' },
  { re: /[a-z]/, label: 'lowercase letter' },
  { re: /[A-Z]/, label: 'uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'special symbol' },
];

export const SALT_ROUNDS = 10;

export const timeout = { redirect: 5000 };

export const cookieName = {
  geo: 'geo',
  device: { os: 'device.os' },
  local: { country: 'local.country', countries: 'local.countries' },
  session: 'auth.session',
  colorScheme: 'theme.color-scheme',
  colorSchemeState: 'theme.color-scheme-state',
};

export const localStorageName = {
  country: 'country',
  countries: 'countries',
};

const withoutBody: HeadersInit = {
  Accept: 'application/json',
};

const withBody: HeadersInit = {
  'Content-Type': 'application/json',
  ...withoutBody,
};

export const headers = { withBody, withoutBody };

export const key = new TextEncoder().encode(process.env.JWT_SECRET);

const expirySessionSecStandard = 60 * 60 * 24;
const expirySessionSecExtended = 7 * expirySessionSecStandard;

export const expiry = {
  session: {
    standard: {
      sec: expirySessionSecStandard,
      millisec: expirySessionSecStandard * 1000,
    },
    extended: {
      sec: expirySessionSecExtended,
      millisec: expirySessionSecExtended * 1000,
    },
  },
};

export const name = {
  urlParam: { redirect: 'redirect' },
};
