'use client';

import { INDEXED_DB } from '@/data/constants';
import { categoriesUpdate } from '@/handlers/requests/database/category';
import { tasksUpdate } from '@/handlers/requests/database/task';
import { sessionsUpdate } from '@/handlers/requests/database/session';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { config, openDatabase } from '@/libraries/indexed-db/db';
import { DatabaseError } from '@/libraries/indexed-db/transactions';
import { updateSyncStatus } from '@/libraries/redux/slices/sync-status';
import {
  useDebouncedCallback,
  useNetwork,
  useThrottledCallback,
} from '@mantine/hooks';
import { SyncStatus } from '@generated/prisma';
import React, { useEffect } from 'react';
import { viewsUpdate } from '@/handlers/requests/database/views';
import { useNotificationReminder } from '@/hooks/notifications';
import { notificationsUpdate } from '@/handlers/requests/database/notifications';
import {
  clearDeletedCategories,
  setCategories,
} from '@/libraries/redux/slices/categories';
import { clearDeletedTasks, setTasks } from '@/libraries/redux/slices/tasks';
import {
  clearDeletedSessions,
  setSessions,
} from '@/libraries/redux/slices/sessions';
import { clearDeletedViews, setViews } from '@/libraries/redux/slices/views';
import {
  clearDeletedNotifications,
  setNotifications,
} from '@/libraries/redux/slices/notifications';
import {
  clearDeletedPomoCycles,
  setPomoCycles,
} from '@/libraries/redux/slices/pomo-cycles';
import { pomoCyclesUpdate } from '@/handlers/requests/database/pomo-cycle';

// Add new type to handle deleted items
type SyncItem = {
  id: string;
  deleted?: boolean;
  [key: string]: any;
};

type SyncParams = {
  items: SyncItem[];
  deletedItems?: any[]; // Add array of deleted items
  dataStore: string;
  stateUpdateFunction: (items: any[]) => void;
  stateClearDeletedFunction: () => void;
  serverUpdateFunction: (items: any[], deletedIds?: string[]) => Promise<void>;
};

export default function Sync({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const networkStatus = useNetwork();
  const syncStatus = useAppSelector((state) => state.syncStatus.value);

  const syncToServerAfterDelay = async (params: SyncParams) => {
    dispatch(updateSyncStatus(SyncStatus.PENDING));

    const db = await openDatabase(config);
    const clientDbItems: any[] | undefined = await db.get(params.dataStore);

    const serverItems = await syncToServerDB({
      ...params,
      items: clientDbItems || [],
    });

    if (serverItems?.errorItems) {
      // update the client DB with sync error items
      await syncToClientDB({
        ...params,
        items: serverItems.errorItems,
        sameDate: true, // keep 'updatedAt' the same
        online: networkStatus.online,
      });

      dispatch(updateSyncStatus(SyncStatus.ERROR));

      return;
    }

    if (serverItems?.updatedItems) {
      // update the client DB with synced items
      await syncToClientDB({
        ...params,
        items: serverItems.updatedItems,
        sameDate: true, // keep 'updatedAt' the same
        online: networkStatus.online,
        cleanup: true, // cleanup deleted items
      });

      dispatch(updateSyncStatus(SyncStatus.SYNCED));
    }

    params.stateClearDeletedFunction();
  };

  const handleSync = async (params: SyncParams) => {
    try {
      dispatch(updateSyncStatus(SyncStatus.PENDING));

      const isOnline = networkStatus.online;

      // update the client DB with pending items
      await syncToClientDB({ ...params, online: isOnline });

      // sync to the server if online
      if (isOnline) {
        // Start/restart debounce timer
        debounceSyncToServer(params);
      }

      dispatch(updateSyncStatus(SyncStatus.SAVED));
    } catch (error) {
      dispatch(updateSyncStatus(SyncStatus.ERROR));
      console.error('Sync Error:', (error as Error).message);
    }
  };

  const debounceSync = useThrottledCallback(handleSync, 1000);
  const debounceSyncToServer = useDebouncedCallback(
    syncToServerAfterDelay,
    15000000000000
  );

  const tasks = useAppSelector((state) => state.tasks.value);
  const deletedTasks = useAppSelector((state) => state.tasks.deleted);
  const categories = useAppSelector((state) => state.categories.value);
  const deletedCategories = useAppSelector((state) => state.categories.deleted);
  const sessions = useAppSelector((state) => state.sessions.value);
  const deletedSessions = useAppSelector((state) => state.sessions.deleted);
  const pomoCycles = useAppSelector((state) => state.pomoCycles.value);
  const deletedPomoCycles = useAppSelector((state) => state.pomoCycles.deleted);
  const views = useAppSelector((state) => state.views.value);
  const deletedViews = useAppSelector((state) => state.views.deleted);
  const notifications = useAppSelector((state) => state.notifications.value);
  const deletedNotifications = useAppSelector(
    (state) => state.notifications.deleted
  );

  const syncTasks = () => {
    const trigger = triggerSync({
      items: tasks || [],
      deletedItems: deletedTasks,
      syncStatus,
      online: networkStatus.online,
    });

    if (!trigger) return;

    debounceSync({
      items: tasks || [],
      deletedItems: deletedTasks,
      dataStore: INDEXED_DB.TASKS,
      stateClearDeletedFunction: () => dispatch(clearDeletedTasks()),
      stateUpdateFunction: (stateUpdateItems) =>
        dispatch(setTasks(stateUpdateItems)),
      serverUpdateFunction: async (serverSyncItems, deletedIds) =>
        await tasksUpdate(serverSyncItems, deletedIds),
    });
  };

  const syncCategories = () => {
    const trigger = triggerSync({
      items: categories || [],
      deletedItems: deletedCategories || [],
      syncStatus,
      online: networkStatus.online,
    });

    if (!trigger) return;

    debounceSync({
      items: categories || [],
      deletedItems: deletedCategories || [],
      dataStore: INDEXED_DB.CATEGORIES,
      stateClearDeletedFunction: () => dispatch(clearDeletedCategories()),
      stateUpdateFunction: (stateUpdateItems) =>
        dispatch(setCategories(stateUpdateItems)),
      serverUpdateFunction: async (serverSyncItems, deletedIds) =>
        await categoriesUpdate(serverSyncItems, deletedIds),
    });
  };

  const syncSessions = () => {
    const trigger = triggerSync({
      items: sessions || [],
      deletedItems: deletedSessions,
      syncStatus,
      online: networkStatus.online,
    });

    if (!trigger) return;

    debounceSync({
      items: sessions || [],
      deletedItems: deletedSessions,
      dataStore: INDEXED_DB.SESSIONS,
      stateClearDeletedFunction: () => dispatch(clearDeletedSessions()),
      stateUpdateFunction: (stateUpdateItems) =>
        dispatch(setSessions(stateUpdateItems)),
      serverUpdateFunction: async (serverSyncItems, deletedIds) =>
        await sessionsUpdate(serverSyncItems, deletedIds),
    });
  };

  const syncPomoCycles = () => {
    const trigger = triggerSync({
      items: pomoCycles || [],
      deletedItems: deletedPomoCycles,
      syncStatus,
      online: networkStatus.online,
    });

    if (!trigger) return;

    debounceSync({
      items: pomoCycles || [],
      deletedItems: deletedPomoCycles,
      dataStore: INDEXED_DB.POMO_CYCLES,
      stateClearDeletedFunction: () => dispatch(clearDeletedPomoCycles()),
      stateUpdateFunction: (stateUpdateItems) =>
        dispatch(setPomoCycles(stateUpdateItems)),
      serverUpdateFunction: async (serverSyncItems, deletedIds) =>
        await pomoCyclesUpdate(serverSyncItems, deletedIds),
    });
  };

  const syncViews = () => {
    const trigger = triggerSync({
      items: views || [],
      deletedItems: deletedViews,
      syncStatus,
      online: networkStatus.online,
    });

    if (!trigger) return;

    debounceSync({
      items: views || [],
      deletedItems: deletedViews,
      dataStore: INDEXED_DB.VIEWS,
      stateClearDeletedFunction: () => dispatch(clearDeletedViews()),
      stateUpdateFunction: (stateUpdateItems) =>
        dispatch(setViews(stateUpdateItems)),
      serverUpdateFunction: async (serverSyncItems, deletedIds) =>
        await viewsUpdate(serverSyncItems, deletedIds),
    });
  };

  const syncNotifications = () => {
    const trigger = triggerSync({
      items: notifications || [],
      deletedItems: deletedNotifications,
      syncStatus,
      online: networkStatus.online,
    });

    if (!trigger) return;

    debounceSync({
      items: notifications || [],
      deletedItems: deletedNotifications,
      dataStore: INDEXED_DB.NOTIFICATIONS,
      stateClearDeletedFunction: () => dispatch(clearDeletedNotifications()),
      stateUpdateFunction: (stateUpdateItems) =>
        dispatch(setNotifications(stateUpdateItems)),
      serverUpdateFunction: async (serverSyncItems, deletedIds) =>
        await notificationsUpdate(serverSyncItems, deletedIds),
    });
  };

  useEffect(() => syncTasks(), [tasks]);
  useEffect(() => syncCategories(), [categories]);
  useEffect(() => syncSessions(), [sessions]);
  useEffect(() => syncPomoCycles(), [pomoCycles]);
  useEffect(() => syncViews(), [views]);
  useEffect(() => syncNotifications(), [notifications]);

  useEffect(() => {
    if (!networkStatus.online) return;

    syncTasks();
    syncCategories();
    syncSessions();
    syncPomoCycles();
    syncViews();
    syncNotifications();
  }, [networkStatus.online]);

  // task reminder notification watcher
  useNotificationReminder({ sessions });

  return <div>{children}</div>;
}

const triggerSync = (params: {
  items: any[];
  deletedItems: any[];
  syncStatus: SyncStatus;
  online: boolean;
}) => {
  if (params.syncStatus === SyncStatus.PENDING) return false;

  const hasDeletedTasks = params.deletedItems.length > 0;

  let hasPendingTasks: boolean;

  if (params.online) {
    hasPendingTasks = params.items?.some(
      (i) => i.sync_status !== SyncStatus.SYNCED
    );
  } else {
    hasPendingTasks = params.items?.some(
      (i) => i.sync_status === SyncStatus.PENDING
    );
  }

  if (hasPendingTasks || hasDeletedTasks) return true;

  return false;
};

const syncToServerDB = async (
  params: SyncParams
): Promise<void | { updatedItems?: SyncItem[]; errorItems?: SyncItem[] }> => {
  try {
    const updateDate = Date.now();

    // Prepare updated items for syncing
    const updatedItems = params.items.map((item) =>
      item.sync_status !== SyncStatus.SYNCED
        ? {
            ...item,
            updated_at: updateDate,
            sync_status:
              item.sync_status == SyncStatus.DELETED
                ? SyncStatus.DELETED
                : SyncStatus.SYNCED,
          }
        : item
    );

    // Sync with server DB
    await params.serverUpdateFunction(
      updatedItems,
      (params.deletedItems || []).map((i) => i.id)
    );

    return { updatedItems };
  } catch (error) {
    const updateDate = Date.now();

    // Mark items as error if sync fails
    const errorItems = params.items.map((item) =>
      item.sync_status !== SyncStatus.SYNCED
        ? { ...item, updated_at: updateDate, sync_status: SyncStatus.ERROR }
        : item
    );

    console.error('Sync to Server Error:', (error as Error).message);

    return { errorItems };
  }
};

const syncToClientDB = async (
  params: SyncParams & {
    sameDate?: boolean;
    online?: boolean;
    cleanup?: boolean;
  }
) => {
  try {
    const db = await openDatabase(config);

    const updateDate = Date.now();

    // Update IndexedDB with pending and deleted items

    let savedItems: any[] = [];
    let deletedItems: any[] = [];

    if (params.items.length) {
      savedItems = params.items.map((item) =>
        item.sync_status != SyncStatus.SYNCED
          ? {
              ...item,
              updated_at: params.sameDate ? item.updated_at : updateDate,
              sync_status:
                item.sync_status == SyncStatus.DELETED
                  ? SyncStatus.DELETED
                  : SyncStatus.SAVED,
            }
          : item
      );

      if (params.cleanup) {
        const containsDeletedItems = savedItems.some(
          (item) => item.sync_status === SyncStatus.DELETED
        );

        if (containsDeletedItems) {
          // remove items with sync status DELETE from client
          await db.delete(
            params.dataStore,
            savedItems.filter((i) => i.sync_status == SyncStatus.DELETED)
          );
        }
      }
    }

    if (params.deletedItems?.length) {
      deletedItems = params.deletedItems.map((item) => {
        return {
          ...item,
          updated_at: params.sameDate ? item.updated_at : updateDate,
          sync_status: SyncStatus.DELETED,
        };
      });
    }

    let savedItemsNotDeleted: any[] = [];

    if (savedItems.length) {
      savedItemsNotDeleted = savedItems.filter(
        (i) => i.sync_status !== SyncStatus.DELETED
      );
    }

    if (savedItems || savedItemsNotDeleted) {
      if (params.cleanup) {
        if (savedItemsNotDeleted.length)
          await db.put(params.dataStore, savedItemsNotDeleted);
      } else {
        await db.put(params.dataStore, [...savedItems, ...deletedItems]);
      }

      params.stateUpdateFunction(
        params.cleanup ? savedItemsNotDeleted : savedItems
      );
    }
  } catch (error) {
    console.error('Client DB Sync Error:', (error as DatabaseError).message);
  }
};
