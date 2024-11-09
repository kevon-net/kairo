import { cookieName } from "@/data/constants";

export const getSessionJti = (): string | undefined => {
	const cookies = document.cookie.split("; ");
	const cookie = cookies.find((row) => row.startsWith(`${cookieName.sessionJti}=`));

	return cookie?.split("=")[1];
};

export const setDeviceInfo = async (value: string) => {
	const expires = `; expires=${new Date(Date.now() + 0.33 * 60 * 1000).toUTCString()}`;
	const sameSite = "; SameSite=Lax";
	const secure = window.location.protocol === "https:" ? "; Secure" : "";
	document.cookie = `${cookieName.deviceInfo}=${encodeURIComponent(value)}${expires}${sameSite}${secure}; path=/`;
};
