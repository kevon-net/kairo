'use client';

import React, { useRef } from 'react';

import { Provider } from 'react-redux';

import { makeStore, AppStore } from '@/libraries/redux/store';
import { updateColorScheme } from '@/libraries/redux/slices/color-scheme';
import { updateSession } from '@/libraries/redux/slices/session';
import { AuthUser } from '@/types/auth';

export default function Store({
  colorScheme,
  session,
  children,
}: {
  colorScheme: string;
  session: AuthUser | null;
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();

    // initialize store
    storeRef.current.dispatch(updateColorScheme(colorScheme));

    if (session) {
      storeRef.current.dispatch(updateSession(session));
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
