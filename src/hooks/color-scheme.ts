'use client';

import { MantineColorScheme, useMantineColorScheme } from '@mantine/core';
import { COOKIE_NAME, DEFAULT_COLOR_SCHEME, EXPIRY } from '@/data/constants';
import { getOSTheme } from '@/utilities/helpers/theme';
import { useEffect, useState } from 'react';
import { setCookieServer } from '@/utilities/helpers/cookie-server';
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '@/utilities/helpers/storage';
import { getCookieClient } from '@/utilities/helpers/cookie-client';

export const useColorScheme = () => {
  const { setColorScheme: setMantineColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });

  // get value from cookie
  const cookieColorScheme = getCookieClient(COOKIE_NAME.COLOR_SCHEME);

  let localStorageColorScheme = DEFAULT_COLOR_SCHEME;

  // if cookie is not found
  if (!cookieColorScheme) {
    // get value from local storage
    localStorageColorScheme = getFromLocalStorage(COOKIE_NAME.COLOR_SCHEME);
  }

  const [colorScheme, setColorScheme] = useState<MantineColorScheme>(
    (cookieColorScheme as MantineColorScheme) ||
      (localStorageColorScheme as MantineColorScheme) ||
      (DEFAULT_COLOR_SCHEME as MantineColorScheme)
  );

  const handleChange = async () => {
    const binaryColorScheme = getOSTheme(colorScheme);

    // update scheme (visual)
    setMantineColorScheme(binaryColorScheme);

    // update color scheme state cookie
    await setCookieServer(COOKIE_NAME.COLOR_SCHEME_STATE, binaryColorScheme, {
      expiryInSeconds: EXPIRY.WEEK,
    });

    // initialize/update cookie
    await setCookieServer(COOKIE_NAME.COLOR_SCHEME, colorScheme, {
      expiryInSeconds: EXPIRY.WEEK,
    });

    // initialize/update local storage
    saveToLocalStorage(COOKIE_NAME.COLOR_SCHEME, colorScheme);
  };

  useEffect(() => {
    handleChange();
  }, [colorScheme]);

  return { colorScheme, setColorScheme };
};
