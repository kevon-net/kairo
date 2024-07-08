import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import hasher from "./utilities/hasher";
import prisma from "./services/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				email: {},
				password: {},
			},
			authorize: async credentials => {
				try {
					// check if user exists
					const userRecord = await prisma.user.findUnique({ where: { email: credentials.email as string } });

					if (!userRecord) {
						throw new Error("User not found");
					} else {
						// check if provided password is correct
						const passwordMatch = await hasher.compare(credentials.password as string, userRecord.password);

						if (!passwordMatch) {
							return null;
						} else {
							return { ...userRecord };
						}
					}
				} catch (error) {
					console.error("x-> Error authorizing:", (error as Error).message);
					throw error;
				}
			},
		}),

		Google,
	],

	pages: {
		signIn: "sign-in",
		signOut: "sign-out",
		newUser: "welcome",
		error: "error",
	},

	session: {
		maxAge: 60 * 60 * 24 * 7,
	},
});
