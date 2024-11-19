import { NextRequest, NextResponse } from "next/server";
import { authUrls, baseUrl, cookieName } from "./data/constants";
import { updateSession } from "./libraries/auth";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	const session = request.cookies.get(cookieName.session)?.value;

	if (session) {
		const isAuthRoute = routes.auth.some((route) => request.nextUrl.pathname.startsWith(route));

		if (isAuthRoute) {
			return NextResponse.redirect(new URL(baseUrl, request.url));
		}

		const response = NextResponse.next();
		return await updateSession(session, response);
	}

	const isProtectedRoute = routes.protected.some((route) => request.nextUrl.pathname.startsWith(route));

	if (isProtectedRoute) {
		return NextResponse.redirect(new URL(authUrls.signIn, request.url));
	}
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};

const routes = {
	protected: [
		"/account",
		"/dashboard",
		"/auth/sign-out",
		// Add other protected routes
	],

	auth: [
		"/auth/password",
		"/auth/sign-in",
		"/auth/sign-up",
		"/auth/verify",
		// Add other auth routes
	],
};
