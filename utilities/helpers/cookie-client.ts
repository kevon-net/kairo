"use client";

export const setCookie = (
	name: string,
	value: string | Record<string, unknown>,
	options: {
		expiryInSeconds: number;
		secure?: boolean;
		sameSite?: "Strict" | "Lax" | "None";
		httpOnly?: boolean;
		path?: string;
	}
): void => {
	// get the current date and time
	const date = new Date();
	// calculates expiration date by adding given seconds to current time
	date.setTime(date.getTime() + options.expiryInSeconds * 1000);
	const expires = `expires=${date.toUTCString()}`;

	// Convert object to JSON string if value is an object
	const cookieValue = typeof value === "object" ? encodeURIComponent(JSON.stringify(value)) : value;

	let cookieString = `${name}=${cookieValue}; ${expires}; path=${options.path || "/"}`;

	// Add optional properties
	if (options.secure) cookieString += " Secure;";
	if (options.httpOnly) cookieString += " HttpOnly;";
	if (options.sameSite) cookieString += ` SameSite=${options.sameSite || "Lax"};`;

	document.cookie = cookieString;
};

export const getCookie = (cookieName: string): string | null => {
	if (typeof document === "undefined") {
		return null;
	}

	const cookies = document.cookie.split("; ");
	const cookie = cookies.find((c) => c.startsWith(`${cookieName}=`));

	return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};
