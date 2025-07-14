'use client';

import { configureStore } from '@reduxjs/toolkit';
import reducerSession from './slices/session';
import { isProduction } from '@/utilities/helpers/environment';
import reducerColorScheme from './slices/color-scheme';
import reducerComments from './slices/comments';
import reducerAppShell from './slices/app-shell';
import reducerSyncStatus from './slices/sync-status';
import reducerTasks from './slices/tasks';
import reducerCategories from './slices/categories';
import reducerRecurringRules from './slices/recurring-rules';
import reducerReminders from './slices/reminders';
import reducerViews from './slices/views';
import reducerNotifications from './slices/notifications';

export const makeStore = () => {
  return configureStore({
    reducer: {
      colorScheme: reducerColorScheme,
      session: reducerSession,
      comments: reducerComments,

      appShell: reducerAppShell,
      syncStatus: reducerSyncStatus,
      tasks: reducerTasks,
      categories: reducerCategories,
      recurringRules: reducerRecurringRules,
      reminders: reducerReminders,
      views: reducerViews,
      notifications: reducerNotifications,
    },

    devTools: isProduction(),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
