'use client';

import React, { useRef } from 'react';

import { Provider } from 'react-redux';

import { makeStore, AppStore } from '@/libraries/redux/store';
import { updateColorScheme } from '@/libraries/redux/slices/color-scheme';
import { Session } from '@repo/types';
import { updateSession } from '@/libraries/redux/slices/session';
import { IpData } from '@/types/bodies/response';
import { updateGeoData } from '@/libraries/redux/slices/geolocation';

export default function Store({
  colorScheme,
  session,
  geoData,
  children,
}: {
  colorScheme: string;
  session: Session | null;
  geoData: IpData | null;
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();

    // initialize store
    storeRef.current.dispatch(updateColorScheme(colorScheme));

    if (session) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { iat, exp, ...restSession } = session;
      storeRef.current.dispatch(updateSession(restSession));
    }

    if (geoData) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { iat, exp, ...restGeoData } = geoData;
      storeRef.current.dispatch(updateGeoData(restGeoData));
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
