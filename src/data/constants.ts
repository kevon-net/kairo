// Dynamically set the URL prefix based on the environment
const urlPrefix =
  process.env.NODE_ENV === 'production' ? 'https://' : 'http://';

export const hostName = process.env.NEXT_PUBLIC_HOST;

export const baseUrl = `${urlPrefix}${hostName}`;

export const apiUrl = `${baseUrl}/api`;

export const authUrls = {
  signIn: `${baseUrl}/auth/sign-in`,
  signUp: `${baseUrl}/auth/sign-up`,
  verifyRequest: `${baseUrl}/auth/verify-request`,
  error: `${baseUrl}/auth/error`,
  signOut: `${baseUrl}/auth/sign-out`,
};

export const geoDataUrl = `${process.env.NEXT_PUBLIC_IP_INFO_URL}?token=${process.env.NEXT_PUBLIC_IP_INFO_TOKEN}`;

export const iconSize = 20;

export const iconWrapperSize = iconSize + 8;

export const iconStrokeWidth = 1.5;

export const transitionDuration = 250;

export const sectionSpacing = 64;

export const passwordRequirements = [
  { re: /[0-9]/, label: 'number' },
  { re: /[a-z]/, label: 'lowercase letter' },
  { re: /[A-Z]/, label: 'uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'special symbol' },
];

export const SALT_ROUNDS = 10;

export const timeout = { redirect: 5000 };

export const cookieName = {
  device: { geo: 'device.geo-data' },
  session: 'auth.session',
  colorScheme: 'color-scheme',
  colorSchemeState: 'color-scheme-state',
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
