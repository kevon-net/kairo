"use client";

import { signIn as authSignIn } from "next-auth/react";
import { signOut as authSignOut } from "next-auth/react";
import { sessionDelete } from "../request/database/session";
import { getSessionJti, setDeviceInfo } from "@/utilities/helpers/cookies";
import { getGeoData } from "@/services/api/geo";

export const signIn = async () => await authSignIn();

export const signInWithProvider = async (provider: string, os: string) => {
	// create cookie with device info
	const geoData = await getGeoData();
	setDeviceInfo(JSON.stringify({ ...geoData, os }));

	await authSignIn(provider, { redirect: false, callbackUrl: "/" });
};

export const signOut = async (params?: { redirectUrl?: string }) => {
	const token = getSessionJti();

	if (token) {
		await sessionDelete(token);
	}

	await authSignOut({ redirect: false });

	// // clear local storage item
	// window.localStorage.clear();

	window.location.replace(params?.redirectUrl ?? "/");
};
