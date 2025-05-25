import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './libraries/supabase/middleware';
import {
  createRedirectHandler,
  setCorsHeaders,
} from './utilities/helpers/middeware';
import { dynamicRedirects, staticRedirects } from './data/redirects';
import { crossOrigins } from './data/hosts';

export async function middleware(request: NextRequest) {
  // First check for redirects
  const redirectResponse = handleRedirect(request);

  // If a redirect is found, return it immediately
  if (redirectResponse) return redirectResponse;

  // If no redirect, proceed with normal middleware
  const response = NextResponse.next({ request });

  // Set CORS headers for the response
  setCorsHeaders({ crossOrigins, request, response });

  // Update the session in the response
  return await updateSession(request, response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)',
  ],
};

const handleRedirect = createRedirectHandler(
  staticRedirects,
  dynamicRedirects,
  {
    permanent: true,
    preserveQuery: true,
    preserveHash: true,
  }
);
