import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";

import Email from "next-auth/providers/email";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "./databases/next";

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const config: NextAuthOptions = {
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),

		// Email({
		// 	server: {
		// 		host: process.env.EMAIL_SERVER_HOST as string,
		// 		port: process.env.EMAIL_SERVER_PORT as number | undefined,
		// 		auth: {
		// 			user: process.env.EMAIL_SENDER_USERNAME as string,
		// 			pass: process.env.EMAIL_SENDER_PASSWORD as string,
		// 		},
		// 	},
		// 	from: process.env.EMAIL_FROM as string,

		// 	// How long email links are valid for (default 24h)
		// 	maxAge: 60 * 60, // 1 hour
		// }),

		Credentials({
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, email, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},

			async authorize(credentials, req) {
				// You need to provide your own logic here that takes the credentials
				// submitted and returns either a object representing a user or value
				// that is false/null if the credentials are invalid.
				// e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
				// You can also use the `req` object to obtain additional parameters
				// (i.e., the request IP address)
				const res = await fetch("http://localhost:3000/api/auth/sign-in", {
					method: "POST",
					body: JSON.stringify(credentials),
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				});

				const user = await res.json();

				// If no error and we have user data, return it
				return res.ok && user ? user : null;
			},
		}),
	],

	/**
	 * required in production
	 * If you set NEXTAUTH_SECRET as an environment variable, you don't have to define this option.
	 *  */
	// secret: process.env.NEXTAUTH_SECRET,

	session: {
		// Choose how you want to save the user session.
		// The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
		// If you use an `adapter` however, we default it to `"database"` instead.
		// You can still force a JWT session by explicitly defining `"jwt"`.
		// When using `"database"`, the session cookie will only contain a `sessionToken` value,
		// which is used to look up the session in the database.
		strategy: "jwt",

		// Seconds - How long until an idle session expires and is no longer valid.
		maxAge: 7 * 24 * 60 * 60, // 7 days

		// Seconds - Throttle how frequently to write to database to extend a session.
		// Use it to limit write operations. Set to 0 to always update the database.
		// Note: This option is ignored if using JSON Web Tokens
		updateAge: 24 * 60 * 60, // 24 hours
	},

	jwt: {
		// The maximum age of the NextAuth.js issued JWT in seconds.
		// Defaults to `session.maxAge`.
		maxAge: 60 * 60 * 24 * 7, // 7 days
		// You can define your own encode/decode functions for signing and encryption
		// async encode() {},
		// async decode() {},
	},

	pages: {
		// to do: update all auth routes
		signIn: "/auth/sign-in",
		// signOut: "/auth/sign-out",
		// Error code passed in query string as ?error=
		// error: "/auth/error",
		// (used for check email message)
		// verifyRequest: "/auth/sign-in/sent",
		/**
		 * New users will be directed here on first sign in
		 * (leave the property out if not of interest)
		 */
		// newUser: "/auth/new-user",
	},

	callbacks: {
		// authorized({ req, token, request: { nextUrl } }) {
		// 	const isLoggedIn = token;
		// 	const paths = ["/blog"];
		// 	const isProtected = paths.some(path => nextUrl.pathname.startsWith(path));

		// 	if (isProtected && !isLoggedIn) {
		// 		const redirectUrl = new URL("/auth/sign-in", nextUrl.origin);
		// 		redirectUrl.searchParams.append("callbackUrl", nextUrl.href);

		// 		return Response.redirect(redirectUrl);
		// 	}

		// 	return true;
		// },

		async signIn({
			user, // res returned by authorize
			account,
			profile, // raw body of post from credentials
			email,
			credentials,
		}) {
			const isAllowedToSignIn = true;
			if (isAllowedToSignIn) {
				return true;
			} else {
				// Return false to display a default error message
				return false;
				// Or you can return a URL to redirect to:
				// return '/unauthorized'
			}
		},

		// async redirect({ url, baseUrl }) {
		// 	// Allows relative callback URLs
		// 	if (url.startsWith("/")) return `${baseUrl}${url}`;
		// 	// Allows callback URLs on the same origin
		// 	else if (new URL(url).origin === baseUrl) return url;
		// 	return baseUrl;
		// },

		async jwt({ token, account, user, trigger, session }) {
			// Persist the OAuth access_token and or the user id to the token right after signin
			if (account) {
				// token.accessToken = account.access_token;
				token.id = user?.id;
				token.role = user?.role;
			}

			if (trigger === "update" && session?.name) {
				// Note, that `session` can be any arbitrary object, remember to validate it!
				token.name = session.name;
			}

			return token;
		},

		async session({ session, token, user, trigger, newSession }) {
			// Send properties to the client, like an access_token and user id from a provider.
			// session.accessToken = token.accessToken as string;
			session.user.id = token.id as string;
			session.user.role = token.role as string;

			// Note, that `rest.session` can be any arbitrary object, remember to validate it!
			if (trigger === "update" && newSession?.name) {
				// You can update the session in the database if it's not already updated.
				// await adapter.updateUser(session.user.id, { name: newSession.name })
				// Make sure the updated value is reflected on the client
				// session.name = newSession.name;
			}

			return session;
		},
	},

	adapter: PrismaAdapter(prisma),

	// necessary during deployment
	// debug: true,
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(
	...args:
		| [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
		| [NextApiRequest, NextApiResponse]
		| []
) {
	return getServerSession(...args, config);
}
