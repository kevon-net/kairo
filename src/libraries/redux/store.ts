'use client';

import { configureStore } from '@reduxjs/toolkit';

import reducerColorScheme from './slices/color-scheme';
import reducerSession from './slices/session';
import reducerComments from './slices/comments';
import reducerGeoData from './slices/geolocation';

export const makeStore = () => {
  return configureStore({
    reducer: {
      colorScheme: reducerColorScheme,
      session: reducerSession,
      comments: reducerComments,
      geoData: reducerGeoData,
    },

    devTools: process.env.NODE_ENV !== 'production',
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
