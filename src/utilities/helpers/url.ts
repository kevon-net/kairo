import { AUTH_URLS, PARAM_NAME } from '@/data/constants';
import { authRoues, protectedRoutes } from '@/data/routes';

export const setRedirectUrl = (params: {
  targetUrl: string;
  redirectUrl?: string;
  redirectParamName?: string;
}) => {
  const target = params.targetUrl;
  const redirect = params.redirectUrl || '';
  return `${target}?${params.redirectParamName || PARAM_NAME.REDIRECT_AUTH}=${encodeURIComponent(redirect)}`;
};

export const getUrlParam = (urlParamName: string): string | null => {
  if (typeof window === 'undefined') return '/';
  const urlParams = new URLSearchParams(window.location.search);
  const urlParam = urlParams.get(urlParamName);
  if (!urlParam) return null;
  return urlParams.get(urlParamName);
};

export const processUrl = (link: string, host: string) => {
  // Remove trailing slash from host if present
  const cleanHost = host.endsWith('/') ? host.slice(0, -1) : host;

  // Check if the link is already absolute using URL constructor
  try {
    new URL(link);
    return link; // Return as is if valid absolute URL
  } catch {
    // If URL constructor throws, it's likely relative
    // Remove leading slash from link if present to avoid double slashes
    const cleanLink = link.startsWith('/') ? link.slice(1) : link;
    return `${cleanHost}/${cleanLink}`;
  }
};

export function getSafeRedirectUrl(
  request: any,
  paramName: string,
  fallbackPath = AUTH_URLS.REDIRECT.DEFAULT
): string {
  const { searchParams } = new URL(request.url);
  const paramValue = searchParams.get(paramName);
  const fallbackUrl = new URL(fallbackPath, request.url);

  try {
    if (!paramValue) return fallbackUrl.toString();

    const nextUrl = new URL(paramValue, request.url);
    const currentOrigin = new URL(request.url).origin;

    // Allow if it's a same-origin or a relative path
    if (paramValue.startsWith('/') || nextUrl.origin === currentOrigin) {
      return nextUrl.toString();
    }

    return fallbackUrl.toString();
  } catch {
    return fallbackUrl.toString();
  }
}

export const validateRoute = (params: {
  user: any | null;
  pathname: string;
}) => {
  const { user, pathname } = params;
  const actions = { redirectToAuth: false, redirectFromAuth: false };

  if (!user) {
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtectedRoute) actions.redirectToAuth = true;
  } else {
    const isAuthRoute = authRoues.some((route) => pathname.startsWith(route));
    if (isAuthRoute) actions.redirectFromAuth = true;
  }

  return actions;
};
