'use server';

import { cookies } from 'next/headers';

// helper to retrieve value from server cookies
export const getCookieServer = async (
  cookieName: string
): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(cookieName);

    return cookie ? cookie.value : null;
  } catch (error) {
    console.error('---> utility error (get cookie value):', error);
    return null;
  }
};

// helper to set server cookie value
export const setCookieServer = async (
  name: string,
  value: any,
  options: {
    expiryInSeconds: number;
    sameSite?: 'strict' | 'lax' | 'none';
    path?: string;
    secure?: boolean;
  }
): Promise<void> => {
  try {
    // Convert object to JSON string if value is an object
    const cookieValue =
      typeof value === 'object'
        ? encodeURIComponent(JSON.stringify(value))
        : encodeURIComponent(value);

    // get the current date and time
    const date = new Date();

    // calculates expiration date by adding given seconds to current time
    date.setTime(date.getTime() + options.expiryInSeconds * 1000);

    const cookieStore = await cookies();

    cookieStore.set({
      name,
      value: cookieValue,
      expires: date,
      path: options.path || '/',
      sameSite: options.sameSite || 'strict',
      secure: options.secure ?? false,
    });
  } catch (error) {
    console.error('---> utility error (save cookie value):', error);
  }
};
