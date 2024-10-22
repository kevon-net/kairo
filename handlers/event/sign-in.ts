import { signIn as authSignIn } from "next-auth/react";

export const signIn = async () => await authSignIn();

export const signInWithProvider = async (provider: string) =>
	await authSignIn(provider, { redirect: false, callbackUrl: "/" });
