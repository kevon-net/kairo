'use client';

import React, { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/libraries/redux/store';
import { updateSession } from '@/libraries/redux/slices/session';
import { updateColorScheme } from '@/libraries/redux/slices/color-scheme';
import { updateAppShell } from '@/libraries/redux/slices/app-shell';
import { SyncStatus } from '@generated/prisma';
import {
  COOKIE_NAME,
  DEFAULT_COLOR_SCHEME,
  INDEXED_DB,
  WEEK,
} from '@/data/constants';
import { tasksGet } from '@/handlers/requests/database/task';
import { categoriesGet } from '@/handlers/requests/database/category';
import { sessionsGet } from '@/handlers/requests/database/session';
import { DatabaseError } from '@/libraries/indexed-db/transactions';
import { config, openDatabase } from '@/libraries/indexed-db/db';
import { viewsGet } from '@/handlers/requests/database/views';
import { registerServiceWorker } from '@/libraries/service-workers/register';
import { useMediaQuery, useNetwork } from '@mantine/hooks';
import { User } from '@supabase/supabase-js';
import { subscribeUser } from '@/services/api/notification';
import { NotificationGet } from '@/types/models/notification';
import {
  getCookieClient,
  setCookieClient,
} from '@/utilities/helpers/cookie-client';
import { AppShell } from '@/types/components/app-shell';
import { setCategories } from '@/libraries/redux/slices/categories';
import { setTasks } from '@/libraries/redux/slices/tasks';
import { setSessions } from '@/libraries/redux/slices/sessions';
import { setViews } from '@/libraries/redux/slices/views';
import { setNotifications } from '@/libraries/redux/slices/notifications';

export default function Store({
  session,
  children,
}: {
  session: User | null;
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  const prevItemsRef = useRef<any[]>([]);
  const networkStatus = useNetwork();

  if (!storeRef.current) storeRef.current = makeStore();

  // Always update store with the latest props
  const store = storeRef.current;

  // color scheme initialization
  useEffect(() => {
    const colorScheme =
      getCookieClient(COOKIE_NAME.COLOR_SCHEME_STATE) || DEFAULT_COLOR_SCHEME;

    storeRef.current?.dispatch(updateColorScheme(colorScheme));
  }, []);

  // session initialization
  useEffect(() => {
    if (session) store.dispatch(updateSession(session));
  }, [session]);

  // load appshell state
  const desktop = useMediaQuery('(min-width: 62em)');

  useEffect(() => {
    const initializeAppShell = () => {
      if (desktop == undefined) return;

      const appShellCookie = getCookieClient(COOKIE_NAME.APP_SHELL.NAVBAR);

      const appShellValue: AppShell = {
        navbar: desktop
          ? appShellCookie == null
            ? true
            : !(appShellCookie == 'false')
          : false,
      };

      storeRef.current?.dispatch(updateAppShell(appShellValue));

      if (appShellCookie == null)
        setCookieClient(COOKIE_NAME.APP_SHELL.NAVBAR, appShellValue.navbar, {
          expiryInSeconds: WEEK,
        });
    };

    initializeAppShell();
  }, [desktop]);

  // Helper function to merge local and server items
  const mergeItems = async (
    dataStore: string,
    clientItems: any[],
    serverItems: any[]
  ): Promise<any[]> => {
    // get tasks with DELETED sync status from server items
    const deletedServerItems = serverItems.filter(
      (item) => item.sync_status == SyncStatus.DELETED
    );

    let deletedItems: string[] = [];

    if (deletedServerItems.length) {
      deletedItems = clientItems
        .map((item) => item.id)
        .filter((id) => deletedServerItems.some((item) => item.id === id));

      if (deletedItems.length) {
        const db = await openDatabase(config);
        await db.delete(
          dataStore,
          clientItems.filter((i) => deletedItems.includes(i.id))
        );
      }
    }

    /////////////////////////////

    // filter out tasks with DELETED sync status from client items
    const filteredClientItems = clientItems.filter((item) => {
      const isNotDeletedOnServer = !deletedItems.includes(item.id);
      const isNotDeletedOnClient = item.sync_status != SyncStatus.DELETED;
      return isNotDeletedOnServer && isNotDeletedOnClient;
    });

    const mergedItems = [...filteredClientItems];

    // filter out tasks with DELETED sync status from server items
    const filteredServerItems = serverItems.filter(
      (item) => item.sync_status != SyncStatus.DELETED
    );

    filteredServerItems.forEach((serverItem) => {
      const localIndex = mergedItems.findIndex((i) => i.id === serverItem.id);
      const localItem = localIndex !== -1 ? mergedItems[localIndex] : null;

      const serverItemLastUpdated = new Date(serverItem.updatedAt);
      const localItemLastUpdated = new Date(localItem?.updatedAt || Date.now());

      if (!localItem || serverItemLastUpdated > localItemLastUpdated) {
        const updatedItem = {
          ...serverItem,
          sync_status: SyncStatus.SYNCED,
          updated_at: new Date(serverItem.updated_at).getTime(),
        };

        if (localIndex !== -1) {
          mergedItems[localIndex] = updatedItem;
        } else {
          mergedItems.push(updatedItem);
        }
      }
    });

    return mergedItems;
  };

  const loadInitialData = async (params: {
    dataStore: string;
    dataFetchFunction: (items?: any[]) => Promise<{ items: any[] }>;
    stateUpdateFunction: (items: any[]) => void;
    // deletedStateUpdateFunction?: (items: any[]) => void;
  }) => {
    let combinedItems: any[] = [];

    const db = await openDatabase(config);
    let clientItems: any[] = [];

    try {
      clientItems = await db.get(params.dataStore);
    } catch (error) {
      console.error((error as DatabaseError).message);
      throw error;
    }

    try {
      let serverItems: any[] = [];

      if (networkStatus.online) {
        // let deletedClientItems: any[] = [];

        // if (clientItems.length) {
        //   // get items with DELETED sync status from client items
        //   deletedClientItems = clientItems.filter(
        //     (item) => item.sync_status == SyncStatus.DELETED
        //   );
        // }

        const fetchedServerItems: { items: any[]; deletedItems?: any[] } =
          await params
            .dataFetchFunction
            // deletedClientItems.length > 0 ? deletedClientItems : undefined
            ();

        serverItems = fetchedServerItems.items;
      } else {
        console.log(
          `Skipped fetching ${params.dataStore} due to offline status`
        );
      }

      if (!clientItems?.length) {
        // filter out tasks with DELETED sync status from server items
        const filteredServerItems = serverItems.filter(
          (item) => item.sync_status !== SyncStatus.DELETED
        );

        if (filteredServerItems.length) {
          const indexedServerItems = filteredServerItems.map((item) => ({
            ...item,
            // sync_status: SyncStatus.SYNCED,
            updated_at: new Date(item.updated_at).getTime(),
          }));

          try {
            await db.add(params.dataStore, indexedServerItems);
          } catch (error) {
            console.error((error as DatabaseError).message);
            throw error;
          }

          combinedItems = indexedServerItems as any[];

          // Initialize prevItemsRef with indexed items
          prevItemsRef.current = indexedServerItems as any[];
        }
      } else {
        let mergedItems: any[] = [];

        mergedItems = !serverItems.length
          ? clientItems
          : await mergeItems(params.dataStore, clientItems, serverItems);

        const lengthComparison = mergedItems.length !== clientItems.length;
        const serialComparison =
          JSON.stringify(mergedItems) !== JSON.stringify(clientItems);

        if (lengthComparison || serialComparison) {
          try {
            await db.put(params.dataStore, mergedItems);
          } catch (error) {
            console.error((error as DatabaseError).message);
            throw error;
          }
        }

        combinedItems = mergedItems;
        // Initialize prevItemsRef with indexed items
        prevItemsRef.current = mergedItems;
      }
    } catch (error) {
      console.error('Initial data load error: ', (error as Error).message);
    }

    params.stateUpdateFunction(combinedItems);

    // if (params.deletedStateUpdateFunction) {
    //   const deletedItems = getDeletedItemsFromLocalStorage({
    //     dataStore: params.dataStore,
    //   });
    //   params.deletedStateUpdateFunction(deletedItems);
    // }
  };

  useEffect(() => {
    const loadTasks = async () => {
      if (prevItemsRef.current.length) return;

      await loadInitialData({
        dataStore: INDEXED_DB.TASKS,
        dataFetchFunction: async () => await tasksGet(),
        stateUpdateFunction: (stateUpdateItems) =>
          storeRef.current?.dispatch(setTasks(stateUpdateItems)),
        // deletedStateUpdateFunction: (deletedStateItems) =>
        //   storeRef.current?.dispatch(updateDeletedTasks(deletedStateItems)),
      });
    };

    const loadCategories = async () => {
      if (prevItemsRef.current.length) return;

      await loadInitialData({
        dataStore: INDEXED_DB.CATEGORIES,
        dataFetchFunction: async () => await categoriesGet(),
        stateUpdateFunction: (stateUpdateItems) =>
          storeRef.current?.dispatch(setCategories(stateUpdateItems)),
        // deletedStateUpdateFunction: (deletedStateItems) =>
        //   storeRef.current?.dispatch(
        //     updateDeletedCategories(deletedStateItems)
        //   ),
      });
    };

    const loadSessions = async () => {
      if (prevItemsRef.current.length) return;

      await loadInitialData({
        dataStore: INDEXED_DB.SESSIONS,
        dataFetchFunction: async () => await sessionsGet(),
        stateUpdateFunction: (stateUpdateItems) =>
          storeRef.current?.dispatch(setSessions(stateUpdateItems)),
        // deletedStateUpdateFunction: (deletedStateItems) =>
        //   storeRef.current?.dispatch(
        //     updateDeletedSessions(deletedStateItems)
        //   ),
      });
    };

    const loadViews = async () => {
      if (prevItemsRef.current.length) return;

      await loadInitialData({
        dataStore: INDEXED_DB.VIEWS,
        dataFetchFunction: async () => await viewsGet(),
        stateUpdateFunction: (stateUpdateItems) =>
          storeRef.current?.dispatch(setViews(stateUpdateItems)),
        // deletedStateUpdateFunction: (deletedStateItems) =>
        //   storeRef.current?.dispatch(updateDeletedViews(deletedStateItems)),
      });
    };

    loadTasks();
    loadCategories();
    loadSessions();
    loadViews();
  }, []);

  // useEffect(() => {
  //   const handleSessionLoad = async () => {
  //     if (!networkStatus.online) {
  //       const userSession: Session | null = getFromLocalStorage(
  //         LOCAL_STORAGE_NAME.SESSION
  //       );

  //       if (!userSession) {
  //         console.error('Session missing');
  //         return;
  //       }

  //       console.log('userSession (localstorage)', userSession);

  //       storeRef.current?.dispatch(updateSession(userSession.user));

  //       const { redirectToAuth, redirectFromAuth } = validateRoute({
  //         user: userSession.user,
  //         pathname: pathname,
  //       });

  //       if (redirectToAuth) router.push(AUTH_URLS.SIGN_IN);
  //       if (redirectFromAuth) router.push(BASE_URL);
  //     } else {
  //       const supabase = createClient();
  //       const { data, error } = await supabase.auth.getSession();

  //       if (error) {
  //         console.error('Supabase session error:', error.message);
  //         return;
  //       }

  //       saveToLocalStorage(LOCAL_STORAGE_NAME.SESSION, data.session?.user);
  //       storeRef.current?.dispatch(updateSession(data.session?.user));
  //     }
  //   };

  //   handleSessionLoad(); // run once on mount
  // }, [pathname, router]);

  useEffect(() => {
    // registerServiceWorker({ pathToWorker: '/offline-sw.js' });

    registerServiceWorker({
      pathToWorker: '/notifications-sw.js',
      onRegistrationSuccess: async (reg) => {
        const notification: NotificationGet | null = await subscribeUser(reg);

        if (!notification) return;

        await loadInitialData({
          dataStore: INDEXED_DB.NOTIFICATIONS,
          dataFetchFunction: async () => {
            return { items: [notification] };
          },
          stateUpdateFunction: (stateUpdateItems) =>
            storeRef.current?.dispatch(setNotifications(stateUpdateItems)),
          // deletedStateUpdateFunction: (deletedStateItems) =>
          //   storeRef.current?.dispatch(
          //     updateDeletedNotifications(deletedStateItems)
          //   ),
        });
      },
    });
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
