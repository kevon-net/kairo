import { MantineColorScheme, useMantineColorScheme } from '@mantine/core';
import { COOKIE_NAME, EXPIRY } from '@/data/constants';
import { setCookie, getOSTheme, getCookie } from '@repo/utils/helpers';
import { useAppDispatch, useAppSelector } from './redux';
import { updateColorScheme } from '@/libraries/redux/slices/color-scheme';
import { useEffect } from 'react';

export const useColorSchemeHandler = () => {
  const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });

  const colorScheme = useAppSelector((state) => state.colorScheme.value);
  const dispatch = useAppDispatch();

  const handleChange = (value: string) => {
    // update in state
    dispatch(updateColorScheme(value));

    // update scheme state cookie
    setCookie(COOKIE_NAME.COLOR_SCHEME_STATE, value, {
      expiryInSeconds: EXPIRY.SESSION.EXTENDED.SEC,
    });

    const scheme =
      value == 'light' ? 'light' : value == 'dark' ? 'dark' : getOSTheme();

    // update mantine color scheme
    setColorScheme(scheme as MantineColorScheme);

    // update scheme cookie
    setCookie(COOKIE_NAME.COLOR_SCHEME, scheme, {
      expiryInSeconds: EXPIRY.SESSION.EXTENDED.SEC,
    });
  };

  useEffect(() => {
    const cookieValueState = getCookie(COOKIE_NAME.COLOR_SCHEME_STATE);
    dispatch(updateColorScheme(cookieValueState));

    const cookieValue = getCookie(COOKIE_NAME.COLOR_SCHEME);
    setColorScheme((cookieValue as MantineColorScheme) || 'light');
  });

  return { colorScheme, handleChange };
};
