"use client";

import { signIn as authSignIn } from "next-auth/react";
import { signOut as authSignOut } from "next-auth/react";
import { sessionDelete } from "../request/database/session";
import { getSessionJti, setDeviceInfo } from "@/utilities/helpers/cookies";
import { getDeviceInfo } from "@/services/api/device-info";

export const signIn = async () => await authSignIn();

export const signInWithProvider = async (provider: string) => {
	// create cookie with device info
	const deviceInfo = await getDeviceInfo();
	setDeviceInfo(JSON.stringify(deviceInfo));

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
