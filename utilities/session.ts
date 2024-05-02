import "server-only";

import { JsonWebTokenError } from "jsonwebtoken";
import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET as string;
const encodedKey = new TextEncoder().encode(secretKey);

import { cookies } from "next/headers";

const encryption = {
	encrypt: async (payload: { userId: number; expiresAt: Date }) => {
		try {
			return new SignJWT(payload)
				.setProtectedHeader({ alg: "HS256" })
				.setIssuedAt()
				.setExpirationTime("7d")
				.sign(encodedKey);
		} catch (error) {
			console.error("x-> Error encrypting session:", (error as Error).message);
		}
	},
	decrypt: async (session: string | undefined) => {
		if (session === undefined) {
			return null; // or throw an error, depending on your use case
		}

		try {
			const { payload } = await jwtVerify(session, encodedKey, {
				algorithms: ["HS256"],
			});
			return payload;
		} catch (error) {
			if (error instanceof JsonWebTokenError) {
				console.log("x-> Error (invalid token):", (error as Error).message);
			} else {
				console.error("x-> Error decrypting session:", (error as Error).message);
			}
		}
	},
};

const session = {
	encryption,
	create: async (userId: number) => {
		try {
			const expiresAt = new Date();
			expiresAt.setDate(expiresAt.getDay() + 7);

			const session = await encryption.encrypt({ userId, expiresAt });

			cookies().set("session", session, {
				httpOnly: true,
				secure: true,
				expires: "expiresAt",
				sameSite: "lax",
				path: "/",
			});
		} catch (error) {
			console.error("x-> Error creating session:", (error as Error).message);
		}
	},
	update: async () => {
		const session = cookies().get("session")?.value;
		const payload = await encryption.decrypt(session);

		if (!session || !payload) {
			return null;
		}

		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDay() + 7);

		cookies().set("session", session, {
			httpOnly: true,
			secure: true,
			expires: expiresAt,
			sameSite: "lax",
			path: "/",
		});
	},
	delete: () => {
		cookies().delete("session");
	},
};

export default session;
