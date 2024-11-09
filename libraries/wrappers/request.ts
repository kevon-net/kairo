import { cookieName } from "@/data/constants";
import { getSessionCookie } from "@/utilities/helpers/cookies-server";

export const authenticateHeaders = async (headers: any) => {
	// Check if running in the client-side (browser)
	const isClient = typeof window !== "undefined";

	if (!isClient) {
		// In server-side, manually pass the session cookie if it's available

		const sessionCookie = await getSessionCookie();

		if (sessionCookie) {
			headers["Cookie"] = `${cookieName.sessionToken}=${sessionCookie}`;

			return headers;
		}
	}

	return headers;
};
