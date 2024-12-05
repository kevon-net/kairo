import { useMantineColorScheme } from '@mantine/core';
import { setCookie } from '@/utilities/helpers/cookie';
import { cookieName } from '@/data/constants';
import { getExpiry } from '@/utilities/helpers/time';
import { getOSTheme } from '@/utilities/helpers/theme';
import { useAppDispatch, useAppSelector } from './redux';
import { updateColorScheme } from '@/libraries/redux/slices/color-scheme';

export const useColorSchemeHandler = () => {
  const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });

  const session = useAppSelector((state) => state.session.value);
  const colorScheme = useAppSelector((state) => state.colorScheme.value);
  const dispatch = useAppDispatch();

  const handleChange = (value: string) => {
    // update in state
    dispatch(updateColorScheme(value));

    // update scheme state cookie
    setCookie(cookieName.colorSchemeState, value, {
      sameSite: 'Strict',
      expiryInSeconds: getExpiry(session?.user.remember ?? false).sec,
    });

    const scheme =
      value == 'light' ? 'light' : value == 'dark' ? 'dark' : getOSTheme();

    // update scheme cookie
    setCookie(cookieName.colorScheme, scheme, {
      sameSite: 'Strict',
      expiryInSeconds: getExpiry(session?.user.remember ?? false).sec,
    });

    // update mantine color scheme
    setColorScheme(scheme);
  };

  return { colorScheme, handleChange };
};
