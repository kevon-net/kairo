"use server";

import { cookies } from "next/headers";

export const getCookie = async (cookieName: string): Promise<string | null> => {
	// Get the theme from cookies, defaulting to "light" if not set
	const themeCookie = cookies().get(cookieName);
	const colorScheme = themeCookie?.value || null;

	return colorScheme;
};
