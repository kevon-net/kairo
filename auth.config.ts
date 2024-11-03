import { DefaultSession, User } from "next-auth";
import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { AdapterUser } from "next-auth/adapters";
import { signIn as handleSignIn } from "./handlers/request/auth/sign-in";
import { profileCreate } from "./handlers/request/database/profile";
import { generateId } from "./utilities/generators/id";

declare module "next-auth" {
	/**
	 * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		token: string;
		rememberMe: boolean;

		user: {
			//  * By default, TypeScript merges new interface properties and overwrites existing ones.
			//  * In this case, the default session user properties will be overwritten,
			//  * with the new ones defined above. To keep the default session user properties,
			//  * you need to add them back into the newly declared interface.
			//  */
		} & DefaultSession["user"];
	}

	/**
	 * The shape of the user object returned in the OAuth providers' `profile` callback,
	 * or the second parameter of the `session` callback, when using a database.
	 */
	interface User {
		// User signin error
		error?: string;
		rememberMe?: string;
		password: string | null;
	}

	/**
	 * The shape of the account object returned in the OAuth providers' `account` callback,
	 * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
	 */
	interface Account {}
}

export default {
	pages: {
		signIn: "/auth/sign-in",
		signOut: "/auth/sign-out",
		error: "/auth/error", // Error code passed in query string as ?error=
		verifyRequest: "/auth/verify-request", // (used for check email message)
		// newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
	},

	providers: [
		Google,
		Credentials({
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				email: {},
				password: {},
				rememberMe: {},
			},
			authorize: async (credentials) => {
				const response = await handleSignIn(credentials);

				const result = await response.json();

				if (!response.ok) {
					return { id: result.user ? result.user.id : "no-id", error: response.statusText };
				}

				return { ...credentials, ...result.user };
			},
		}),
	],

	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			// Check if the authorize function returned an error
			if (user.error) {
				const error = encodeURIComponent(user.error);
				const userId = encodeURIComponent(user.id!);

				// Redirect to auth error with custom error message and user ID as query parameters
				return `/auth/error?error=${error}${user.error == "Not Verified" ? `: ${userId}` : ""}`;
			}

			// if user used password, attach to user object (this will be updated in the database)
			user.password = credentials?.password ? "true" : null;

			// create new profile if doesn't exist
			await profileCreate({ user });

			// create new session record

			// Return true to allow the sign-in process to continue
			return true;
		},

		async jwt({ token, account, profile, user, session, trigger }) {
			if (account) {
				token.accessToken = account.access_token;
				token.id = user.id;
			}

			// Ensure token.user is always set if user is available
			if (user) {
				token.user = user;
			}

			if (trigger === "update" && session) {
				token.user = session.user;
			}

			if (trigger === "signIn") {
				token.rememberMe = user.rememberMe == "true" ? true : false;

				// attach user password signin to token
				token.password = user.password ? "true" : "false";
			}

			if (token.rememberMe == true) {
				token.exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
			} else {
				token.exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 1 day
			}

			return token;
		},

		async session({ session, token, user, newSession, trigger }) {
			session.user = token.user as AdapterUser & User;

			session.rememberMe = token.rememberMe as boolean;

			// Set session expiration dynamically based on token expiration
			session.expires = new Date(token.exp! * 1000).toISOString() as Date & string;

			// Send properties to the client, like a user id from a provider.
			session.token = token.accessToken as string;
			session.user.id = token.id as string;
			session.user.password = token.password as string;

			return session;
		},
	},
} satisfies NextAuthConfig;
