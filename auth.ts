import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
					// logic to salt and hash password
					const passwordHash = await hasher.create(credentials.password as string);

					// logic to verify if user exists
					const userRecord = await prisma.user.findUnique({ where: { email: credentials.email as string } });

					if (!userRecord) {
						// No user found, so this is their first attempt to login
						// meaning this is also the place you could do registration
						throw new Error("User not found.");
					} else {
						const passwordMatch = hasher.compare(passwordHash as string, userRecord.password);

						if (!passwordMatch) {
							// Return `null` to indicate that the credentials are invalid
							return null;
						} else {
							// return user object with the their profile data
							return { email: userRecord.email, password: userRecord.password };
						}
					}
				} catch (error) {
					console.error("x-> Error authorizing:", (error as Error).message);
					throw error;
				}
			},
		}),
	],
});
