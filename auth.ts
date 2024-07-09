import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { PrismaClient } from "@prisma/client";

import request from "./hooks/request";

// const prismaCli = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
	// adapter: PrismaAdapter(prismaCli),

	pages: {
		signIn: "/auth/sign-in",
		signOut: "/auth/sign-out",
		error: "/auth/error", // Error code passed in query string as ?error=
		verifyRequest: "/auth/verify-request", // (used for check email message)
		newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
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
							return null;
						} else {
							console.log(res.user.data);
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
});
