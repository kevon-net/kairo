// Dynamically set the URL prefix based on the environment
const urlPrefix = process.env.NODE_ENV === "production" ? "https://" : "http://";

export const hostName = process.env.NEXT_PUBLIC_HOST;

export const baseUrl = `${urlPrefix}${hostName}`;

export const apiUrl = `${baseUrl}/api`;

export const authUrls = {
	signIn: `${apiUrl}/auth/signin`,
	signOut: `${apiUrl}/auth/signout`,
	verify: `${apiUrl}/auth/verify-request`
};

export const iconStrokeWidth = 1.5;

export const transitionDuration = 250;
