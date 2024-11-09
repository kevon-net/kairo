import { NextRequest } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { cookieName } from "./data/constants";
import { cookies } from "next/headers";
import { sessionGet } from "./handlers/request/database/session";
import { signOut } from "./auth";
import { redirect } from "next/navigation";

// Use only one of the two middleware options below

// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig)

// 2. Wrapped middleware option
const { auth } = NextAuth(authConfig);

export default auth(async function middleware(request: NextRequest) {
	// Your custom middleware logic goes here
	const jti = cookies().get(cookieName.sessionJti)?.value;

	if (jti) {
		const session = await sessionGet(jti);
		console.log(session);

		if (session.error) {
		}
	}
});
