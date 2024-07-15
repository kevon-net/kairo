import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { PrismaClient } from "@prisma/client";

import request from "./hooks/request";

// const prismaCli = new PrismaClient();

declare module "next-auth" {
	/**
	 * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		userId: string;
		token: string;

		user: {
			// /** The user's id. */
			// id: string;
			// /**
			//  * By default, TypeScript merges new interface properties and overwrites existing ones.
			//  * In this case, the default session user properties will be overwritten,
			//  * with the new ones defined above. To keep the default session user properties,
			//  * you need to add them back into the newly declared interface.
			//  */
		} & DefaultSession["user"];
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	// adapter: PrismaAdapter(prismaCli),

	pages: {
		signIn: "/auth/sign-in",
		signOut: "/auth/sign-out",
		error: "/auth/error", // Error code passed in query string as ?error=
		verifyRequest: "/auth/verify-request", // (used for check email message)
		// newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
	},

	session: {
		maxAge: 60 * 60 * 24 * 7,
		// strategy: "database",
	},

	providers: [
		Google,
		Credentials({
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				email: {},
				password: {},
			},
			authorize: async credentials => {
				try {
					const res = await request.post(process.env.NEXT_PUBLIC_API_URL + "/api/auth/sign-in", {
						method: "POST",
						body: JSON.stringify(credentials),
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
						},
					});

					if (!res.user.exists) {
						throw new Error("User not found");
					} else {
						if (!res.user.password.matches) {
							throw new Error("Incorrect password");
						} else {
							return { ...res.user.data };
						}
					}
				} catch (error) {
					console.error("x-> Error authorizing:", (error as Error).message);
					throw error;
				}
			},
		}),
	],

	callbacks: {
		async jwt({ token, account, profile, user }) {
			if (account) {
				token.accessToken = account.access_token;
				token.id = user.id;

				// create user record if doesn't exist (OAuth sign-in)
				await request.post(process.env.NEXT_PUBLIC_API_URL + "/api/auth/sign-up", {
					method: "POST",
					body: JSON.stringify({ email: user.email, password: null }),
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				});
			}

			return token;
		},

		async session({ session, token, user }) {
			// Send properties to the client, like a user id from a provider.
			session.token = token.accessToken as string;
			session.userId = token.id as string;

			return session;
		},
	},
});
