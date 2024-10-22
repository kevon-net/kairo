import { signOut as authSignOut } from "next-auth/react";

export const signOut = async (params?: { redirectUrl?: string }) =>
	await authSignOut({ redirect: false })
		.then(() => window.localStorage.clear())
		.then(() => window.location.replace(params?.redirectUrl ?? "/"));
