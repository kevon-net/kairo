import { NextRequest, NextResponse } from "next/server";
import { cookieName } from "./data/constants";
import { updateSession } from "./libraries/auth";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	const session = request.cookies.get(cookieName.session)?.value;

	if (session) {
		const response = NextResponse.next();
		return await updateSession(session, response);
	}

	return NextResponse.next();

	// return NextResponse.redirect(new URL("/home", request.url));
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
