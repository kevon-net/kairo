export const setCookie = (
  name: string,
  value: any,
  options: {
    expiryInSeconds: number;
    sameSite?: 'Strict' | 'Lax' | 'None';
    path?: string;
  }
): void => {
  // Convert object to JSON string if value is an object
  const cookieValue =
    typeof value === 'object'
      ? encodeURIComponent(JSON.stringify(value))
      : encodeURIComponent(value);

  // get the current date and time
  const date = new Date();
  // calculates expiration date by adding given seconds to current time
  date.setTime(date.getTime() + options.expiryInSeconds * 1000);

  document.cookie = `${name}=${cookieValue}; expires=${date.toUTCString()}; SameSite=${options.sameSite || 'Strict'}; path=${options.path || '/'}`;
};

export const getCookie = (cookieName: string): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split('; ');
  const cookie = cookies.find((c) => c.startsWith(`${cookieName}=`));

  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
};
