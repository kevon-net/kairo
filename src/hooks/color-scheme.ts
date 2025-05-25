import { MantineColorScheme, useMantineColorScheme } from '@mantine/core';
import { COOKIE_NAME, DEFAULT_COLOR_SCHEME, WEEK } from '@/data/constants';
import {
  setCookieClient,
  getCookieClient,
} from '@/utilities/helpers/cookie-client';
import { getOSTheme } from '@/utilities/helpers/theme';
import { useAppDispatch, useAppSelector } from './redux';
import { updateColorScheme } from '@/libraries/redux/slices/color-scheme';
import { useEffect } from 'react';
import { ColorScheme } from '@/types/theme';

export const useColorSchemeHandler = () => {
  const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });
  const colorScheme = useAppSelector((state) => state.colorScheme.value);
  const dispatch = useAppDispatch();

  const handleChange = (value: string) => {
    // update in state
    dispatch(updateColorScheme(value));

    // update scheme state cookie
    setCookieClient(COOKIE_NAME.COLOR_SCHEME_STATE, value, {
      expiryInSeconds: WEEK,
    });

    const scheme = getOSTheme(value as ColorScheme);

    // update mantine color scheme
    setColorScheme(scheme as MantineColorScheme);

    // update scheme cookie
    setCookieClient(COOKIE_NAME.COLOR_SCHEME, scheme, {
      expiryInSeconds: WEEK,
    });
  };

  useEffect(() => {
    const cookieValueState = getCookieClient(COOKIE_NAME.COLOR_SCHEME_STATE);

    if (!cookieValueState) {
      setCookieClient(COOKIE_NAME.COLOR_SCHEME_STATE, DEFAULT_COLOR_SCHEME, {
        expiryInSeconds: WEEK,
      });
    }

    const cookieValue = getCookieClient(COOKIE_NAME.COLOR_SCHEME);

    if (!cookieValue) {
      setCookieClient(COOKIE_NAME.COLOR_SCHEME, DEFAULT_COLOR_SCHEME, {
        expiryInSeconds: WEEK,
      });
    }

    dispatch(updateColorScheme(cookieValueState || DEFAULT_COLOR_SCHEME));
    setColorScheme((cookieValue as MantineColorScheme) || DEFAULT_COLOR_SCHEME);
  }, []);

  return { colorScheme, handleChange };
};
