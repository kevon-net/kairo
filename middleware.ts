import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import sessionActions from "@/utilities/session";

// Specify protected and public routes
const protectedRoutes = ["/[userId]/profile", "/[userId]/dashboard"];

// disallow auth routes after login or sign-up
const authRoutes = ["/sign-in", "/sign-up", "/"];

const publicRoutes = ["/"];

export default async function middleware(req: NextRequest) {
	// Check if the current route is protected or public
	const path = req.nextUrl.pathname;

	const isProtectedRoute = protectedRoutes.some(route => {
		const regex = new RegExp(`^${route.replace("[userId]", "\\d+")}`);
		return regex.test(path);
	});
	// const isPublicRoute = publicRoutes.includes(path);

	// Decrypt the session from the cookie
	const cookie = cookies().get("session")?.value;
	const session = await sessionActions.encryption.decrypt(cookie);

	if (!session) {
		// Redirect to /sign-in if the user is not authenticated
		if (isProtectedRoute) {
			return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
		}
	}
	// else {
	// 	// Redirect to /[userId]/dashboard if the user is authenticated
	// 	if (isPublicRoute && session?.userId && !req.nextUrl.pathname.startsWith("/[userId]/dashboard")) {
	// 		return NextResponse.redirect(new URL("/[userId]/dashboard", req.nextUrl));
	// 	}
	// }

	return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
