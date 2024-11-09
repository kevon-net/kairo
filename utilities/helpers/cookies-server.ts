"use server";

import { cookieName } from "@/data/constants";
import { cookies } from "next/headers";

// Helper function to get session cookie in server-side
export const getSessionCookie = async () => {
	if (typeof document === "undefined") {
		const cookie = cookies().get(cookieName.sessionToken);
		return cookie?.value;
	}
	return null; // if running in client, you don't need to manually get cookie
};
