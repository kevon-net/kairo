"use client";

import { cookieName } from "@/data/constants";
import { getGeoData } from "@/services/api/geo";
import { Credentials } from "@/types/auth";
import { setCookie } from "@/utilities/helpers/cookie-client";
import { Provider } from "@prisma/client";
import { signIn as handleRequestSignIn } from "../requests/auth/sign-in";
import { signOut as handleRequestSignOut } from "../requests/auth/sign-out";

export const signIn = async (provider?: Provider, credentials?: Credentials, device?: { os?: string }) => {
	// create cookie with device info
	const geoData = await getGeoData();
	setCookie(cookieName.device.geo, { ...geoData, os: device?.os }, { expiryInSeconds: 30 });

	return await handleRequestSignIn({ provider, credentials });
};

export const signOut = async () => {
	// do something before sign out

	return await handleRequestSignOut();
};
