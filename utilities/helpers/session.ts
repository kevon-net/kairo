"use server";

import { NextResponse } from "next/server";
import { decrypt, encrypt } from "./token";
import { cookieName } from "@/data/constants";
import { cookies } from "next/headers";
import { getExpiry } from "./time";
import { sessionUpdate } from "@/handlers/requests/database/session";
import { Session } from "@/types/auth";

export const getSession = async (): Promise<Session | null> => {
	const sessionCookieValue = cookies().get(cookieName.session)?.value;
	const session = !sessionCookieValue ? null : await decrypt(sessionCookieValue);

	return session;
};

export const updateSession = async (session: string, response: NextResponse) => {
	const parsed: Session = await decrypt(session);
	const remember = parsed.user.remember;

	const expiry = getExpiry(remember).millisec;
	const expires = new Date(Date.now() + expiry);

	parsed.expires = expires;

	response.cookies.set({
		name: cookieName.session,
		value: await encrypt(parsed, getExpiry(remember).sec),
		expires: expires,
		httpOnly: true,
	});

	const expiresFormer = new Date(Number(parsed.exp) * 1000);
	const expiryDifference = expires.getTime() - expiresFormer.getTime();

	if (expiryDifference > expiry / 2) {
		await sessionUpdate(parsed, { create: true });
	}

	return response;
};
