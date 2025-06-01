export const setRedirectUrl = (params: {
  targetUrl: string;
  redirectUrl?: string;
}) => {
  const target = params.targetUrl;
  const redirect = params.redirectUrl || '';
  return `${target}?redirect=${encodeURIComponent(redirect)}`;
};

export const getUrlParam = (urlParamName: string) => {
  if (typeof window === 'undefined') {
    return '/';
  }

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(urlParamName) || '/';
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
  fallbackPath = '/'
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
