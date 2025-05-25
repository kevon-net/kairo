'use client';

import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/libraries/redux/store';
import { updateSession } from '@/libraries/redux/slices/session';
import { generateUUID } from '@/utilities/generators/id';

export default function Store({
  session = { id: generateUUID() },
  children,
}: {
  session?: { id: string };
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) storeRef.current = makeStore();

  // Always update store with the latest props
  const store = storeRef.current;

  // initialize store
  if (session) store.dispatch(updateSession(session));

  return <Provider store={store}>{children}</Provider>;
}
