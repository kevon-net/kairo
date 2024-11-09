import { DefaultSession, User } from "next-auth";
import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { AdapterUser } from "next-auth/adapters";
import { generateId } from "./utilities/generators/id";
import { cookies } from "next/headers";
import prisma from "./libraries/prisma";
import { segmentFullName } from "./utilities/formatters/string";
import { compareHashes } from "./utilities/helpers/hasher";
import { cookieName } from "./data/constants";
import { generateToken } from "./utilities/generators/token";

declare module "next-auth" {
	/**
	 * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		accessToken: string;
		sessionToken: string;
		withPassword: boolean;

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
		rememberMe?: boolean;
		password?: string | null;
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
		Google({
			allowDangerousEmailAccountLinking: true,
			authorization: {
				params: {
					scope: "openid profile email", // Ensures profile information, including image, is requested
				},
			},
		}),
		Credentials({
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				email: {},
				password: {},
				rememberMe: {},
			},
			authorize: async (credentials) => {
				const userRecord = await prisma.user.findUnique({ where: { email: credentials.email as string } });

				if (!userRecord) {
					return { error: "User not found" };
				}

				const passwordMatch = await compareHashes(credentials.password as string, userRecord.password!);

				if (!passwordMatch) {
					return { id: userRecord.id, error: "Invalid username/password" };
				}

				if (!userRecord.verified) {
					return { id: userRecord.id, error: "User not verified", user: userRecord };
				}

				return { ...userRecord, rememberMe: credentials.rememberMe == "true" };
			},
		}),
	],

	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			if (user.error) {
				const error = encodeURIComponent(user.error);
				const userId = encodeURIComponent(user.id!);

				return `/auth/error?error=${error}${user.error == "User not verified" ? `: ${userId}` : ""}`;
			}

			// Return true to allow the sign-in process to continue
			return true;
		},

		async jwt({ token, account, profile, user, session, trigger }) {
			// Only modify token on initial sign-in or explicit update

			// Initial sign-in
			if (account) {
				const explicitOrOauth = user.rememberMe || !(user.password ? true : false);

				const oneDay = 24 * 60 * 60;
				const oneWeek = 7 * oneDay;
				const expiry = Date.now() + (explicitOrOauth ? oneWeek : oneWeek) * 1000;

				const deviceInfoCookie = cookies().get(cookieName.deviceInfo);
				const deviceInfo = await JSON.parse(deviceInfoCookie?.value!);

				const userRecord = await prisma.user.findUnique({
					where: { email: user.email as string },
					include: { profile: true },
				});

				await prisma.session.deleteMany({ where: { userId: userRecord?.id, expires: { lt: new Date() } } });

				const id = generateId();

				if (!userRecord?.password) {
					await prisma.user.update({
						where: { email: user.email as string },
						data: {
							...user,
							email: user.email as string,
							verified: !user.password,
							name: user.name as string,
							image: user.image,
							emailVerified: profile?.email_verified || false,

							profile: userRecord?.profile
								? undefined
								: {
										create: {
											id: generateId(),
											firstName: segmentFullName(user.name!).first,
											lastName: segmentFullName(user.name!).last,
										},
								  },

							sessions: {
								create: {
									sessionToken: id,
									expires: new Date(expiry),
									city: deviceInfo?.city,
									country: deviceInfo?.country,
									ip: deviceInfo?.ip,
									loc: deviceInfo?.loc,
									region: deviceInfo?.region,
									timezone: deviceInfo?.timezone,
									os: deviceInfo?.os,
								},
							},
						},
					});
				} else {
					await prisma.session.create({
						data: {
							sessionToken: id,
							expires: new Date(expiry),
							city: deviceInfo?.city,
							country: deviceInfo?.country,
							ip: deviceInfo?.ip,
							loc: deviceInfo?.loc,
							region: deviceInfo?.region,
							timezone: deviceInfo?.timezone,
							os: deviceInfo?.os,
							userId: userRecord.id,
						},
					});
				}

				token.accessToken =
					account.access_token ||
					(await generateToken({ id: user.id!, email: user.email!, password: user.password! }, 60));
				token.id = user.id;
				token.verified = userRecord?.verified;
				token.picture = token.picture || userRecord?.image;
				token.emailVerified = profile?.email_verified ? profile?.email_verified : userRecord?.emailVerified;
				token.role = userRecord?.role;
				token.status = userRecord?.status;
				token.verified = userRecord?.verified;
				token.verified = userRecord?.verified;
				token.exp = Math.floor(expiry / 1000);
				token.rememberMe = user.rememberMe;
				token.withPassword = user.password || userRecord?.password ? true : false;
				token.jti = id;

				cookies().set(cookieName.sessionJti, id, {
					expires: expiry,
					httpOnly: false,
					sameSite: "lax",
					secure: process.env.NODE_ENV === "production",
				});

				return token;
			}

			const sessionJti = cookies().get(cookieName.sessionJti);

			if (sessionJti) {
				token.jti = sessionJti.value;
			}

			if (trigger === "update" && session) {
				token = { ...token, ...session.user, withPassword: session.withPassword };

				return token;
			}

			return token;
		},

		async session({ session, token, user, newSession, trigger }) {
			session.user = {
				id: token.id,
				email: token.email,
				emailVerified: token.emailVerified,
				image: token.picture,
				name: token.name,
			} as AdapterUser & User;

			session.accessToken = token.accessToken as string;
			session.sessionToken = token.jti as string;
			session.withPassword = token.withPassword as boolean;
			session.expires = new Date(token.exp! * 1000).toISOString() as Date & string;

			return session;
		},
	},
} satisfies NextAuthConfig;
