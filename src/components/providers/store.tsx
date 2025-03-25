'use client';

import React, { useMemo, useRef } from 'react';

import { Provider } from 'react-redux';

import { makeStore, AppStore } from '@/libraries/redux/store';
import { updateColorScheme } from '@/libraries/redux/slices/color-scheme';

export default function Store({
  colorScheme,
  children,
}: {
  colorScheme: string;
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();

  const store = useMemo(() => {
    if (storeRef.current) return storeRef.current;

    // Create the store instance the first time this renders
    const newStore = makeStore();

    // initialize store
    newStore.dispatch(updateColorScheme(colorScheme));

    return newStore;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
