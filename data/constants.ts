// Dynamically set the URL prefix based on the environment
const urlPrefix = process.env.NODE_ENV === "production" ? "https://" : "http://";

export const hostName = process.env.NEXT_PUBLIC_HOST;

export const baseUrl = `${urlPrefix}${hostName}`;

export const apiUrl = `${baseUrl}/api`;

export const authUrls = {
	signIn: `${apiUrl}/auth/signin`,
	signOut: `${apiUrl}/auth/signout`,
	verify: `${apiUrl}/auth/verify-request`,
};

export const geoDataUrl = `${process.env.NEXT_PUBLIC_IP_INFO_URL}?token=${process.env.NEXT_PUBLIC_IP_INFO_TOKEN}`;

export const iconStrokeWidth = 1.5;

export const transitionDuration = 250;

export const sectionSpacing = 64;

export const passwordRequirements = [
	{ re: /[0-9]/, label: "number" },
	{ re: /[a-z]/, label: "lowercase letter" },
	{ re: /[A-Z]/, label: "uppercase letter" },
	{ re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "special symbol" },
];

export const SALT_ROUNDS = 10;

export const timeout = { redirect: 5000 };

export const cookieName = {
	deviceInfo: "device-info",
	sessionJti: "authjs.session-jti",
	sessionToken: "authjs.session-token",
};
