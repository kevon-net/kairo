'use client';

import React, { useMemo, useRef } from 'react';

import { Provider } from 'react-redux';

import { makeStore, AppStore } from '@/libraries/redux/store';
import { updateSession } from '@/libraries/redux/slices/session';

export default function Store({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(undefined);

  const store = useMemo(() => {
    if (storeRef.current) return storeRef.current;

    // Create the store instance the first time this renders
    const newStore = makeStore();

    // initialize store
    newStore.dispatch(updateSession({ id: 'sid-1' }));

    return newStore;
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
