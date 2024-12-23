import { useMantineColorScheme } from '@mantine/core';
import { COOKIE_NAME, EXPIRY } from '@/data/constants';
import { setCookie, getOSTheme } from '@repo/utils/helpers';
import { useAppDispatch, useAppSelector } from './redux';
import { updateColorScheme } from '@/libraries/redux/slices/color-scheme';

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

    // update scheme cookie
    setCookie(COOKIE_NAME.COLOR_SCHEME, scheme, {
      expiryInSeconds: EXPIRY.SESSION.EXTENDED.SEC,
    });

    // update mantine color scheme
    setColorScheme(scheme);
  };

  return { colorScheme, handleChange };
};
