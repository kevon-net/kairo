import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './libraries/supabase/middleware';
import {
  // createRedirectHandler,
  setCorsHeaders,
} from './utilities/helpers/middeware';

export async function middleware(request: NextRequest) {
  // // First check for redirects
  // const redirectResponse = handleRedirect(request);

  // if (redirectResponse) {
  //   return redirectResponse;
  // }

  // If no redirect, proceed with normal middleware
  const response = NextResponse.next({ request });

  setCorsHeaders({ crossOrigins, request, response });

  return await updateSession(request, response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

const crossOrigins = [
  'localhost',
  '127.0.0.1',
  'devokrann.vercel.app',
  'next.vercel.app',
];

// const staticRedirects = {
//   '/contact': '/about/contact',
// };

// const dynamicRedirects = [
//   {
//     // Matches "/stories/blog/any-title-123" and preserves the dynamic part
//     pattern: /^\/stories\/blog\/([^\/]+)$/,
//     replacement: '/resources/blog/$1',
//   },

//   {
//     // Matches "/stories/blog/categories/any-title-123" and preserves the dynamic part
//     pattern: /^\/stories\/blog\/categories\/([^\/]+)$/,
//     replacement: '/resources/blog/categories/$1',
//   },

//   {
//     // Matches "/stories/blog/tags/any-title-123" and preserves the dynamic part
//     pattern: /^\/stories\/blog\/tags\/([^\/]+)$/,
//     replacement: '/resources/blog/tags/$1',
//   },

//   {
//     // Matches "/services/any-service-title" and redirects to /drone-solutions
//     pattern: /^\/services\/[^\/]+$/,
//     replacement: '/drone-solutions',
//   },
// ];

// const handleRedirect = createRedirectHandler(
//   staticRedirects,
//   dynamicRedirects,
//   {
//     permanent: true,
//     preserveQuery: true,
//     preserveHash: true,
//   }
// );
