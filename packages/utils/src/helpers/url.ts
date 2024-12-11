export const setRedirectUrl = (params: {
  targetUrl: string;
  redirectUrl?: string;
}) => {
  const target = params.targetUrl;
  const redirect = params.redirectUrl || '';
  return `${target}?redirect=${encodeURIComponent(redirect)}`;
};

export const getUrlParam = (urlParamName: string) => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(urlParamName) || '/';
  }

  return '/';
};
