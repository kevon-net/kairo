import { cookies } from "next/headers";

import jwt from "jsonwebtoken";

export function getSecretKey() {
	const secret = process.env.SECRET_KEY;

	if (!secret) {
		throw new Error("JWT Secret key is not set");
	} else {
		return secret;
	}
}

export async function verifyJwtToken(token: string) {
	try {
		const payload = jwt.verify(token, getSecretKey());

		return payload;
	} catch (error) {
		return null;
	}
}

export async function getJwt() {
	const cookieStore = cookies();
	const token = cookieStore.get("token");

	if (token) {
		try {
			const payload = await verifyJwtToken(token.value);

			if (payload) {
				return {
					id: payload.id as string,
					name: payload.name as string,
					email: payload.email as string,
					role: payload.role as string,
					exp: payload.exp as number,
				};
			}
		} catch (error) {
			return null;
		}
	}

	return null;
}

export async function logout() {
	const cookieStore = cookies();
	const token = cookieStore.get("token");

	if (token) {
		try {
			cookieStore.delete("token");
		} catch (_) {}
	}

	const userData = cookieStore.get("userData");

	if (userData) {
		try {
			cookieStore.delete("userData");
			return true;
		} catch (_) {}
	}

	return null;
}

export function setUserDataCookie(userData) {
	const cookieStore = cookies();

	cookieStore.set({
		name: "userData",
		value: JSON.stringify(userData),
		path: "/",
		maxAge: 86400, // 24 hours
		sameSite: "strict",
	});
}
