import { cookieName } from "@/data/constants";
import { getSessionCookie } from "@/libraries/auth";

export const authHeaders = async (headers: any) => {
	// Check if running in the client-side (browser)
	const isClient = typeof window !== "undefined";

	if (!isClient) {
		// In server-side, manually pass the session cookie if it's available
		const sessionCookieValue = await getSessionCookie();

		if (sessionCookieValue) {
			headers["Cookie"] = `${cookieName.session}=${sessionCookieValue}`;
		}
	}

	return headers;
};
