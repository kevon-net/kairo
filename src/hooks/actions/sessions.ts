import { generateUUID } from '@/utilities/generators/id';
import { useAppDispatch, useAppSelector } from '../redux';
import { SessionGet } from '@/types/models/session';
import { Status, SyncStatus } from '@generated/prisma';
import { usePathname, useRouter } from 'next/navigation';
import { useItemEditContext } from '@/components/contexts/item-edit';
import { CategoryGet } from '@/types/models/category';
import {
  addSession,
  updateSession,
  deleteSession,
} from '@/libraries/redux/slices/sessions';
import { getRegionalDate } from '@/utilities/formatters/date';
import { capitalizeWords } from '@/utilities/formatters/string';

const path = '/app/home';

export const useSessionActions = () => {
  const session = useAppSelector((state) => state.session.value);
  const sessions = useAppSelector((state) => state.sessions.value);
  const categories = useAppSelector((state) => state.categories.value);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();

  const { editing, editingId, setEditingState, startRename, inputRefs } =
    useItemEditContext();

  // handler to create session
  const handleCreateSession = (params?: { values?: Partial<SessionGet> }) => {
    if (!session?.id) return;

    const now = new Date();

    const sessionNew = {
      ...params?.values,
      id: params?.values?.id || generateUUID(),
      title: params?.values?.title || `${getRegionalDate(now).time} -`,
      duration: params?.values?.duration || null,
      start: (params?.values?.start || now.toISOString()) as any,
      elapsed: params?.values?.elapsed || 0,
      end: params?.values?.end || null,
      tag_id: params?.values?.tag_id || null,
      task_id: params?.values?.task_id || null,
      category_id: params?.values?.category_id || null,
      profile_id: params?.values?.profile_id || session.id,
      status: params?.values?.status || Status.ACTIVE,
    };

    // add to state
    dispatch(addSession(sessionNew));

    if (pathname != path) router.push(path);

    return sessionNew;
  };

  // handler to update session
  const handleUpdateSession = (params: { values: SessionGet }) => {
    // update in state
    dispatch(updateSession(params.values));
  };

  // handler to delete session
  const handleDeleteSession = (params: {
    values: SessionGet;
    options?: { noRedirect?: boolean };
  }) => {
    // deleted from state
    dispatch(deleteSession(params.values));
  };

  // handler to create session copy
  const handleCopySession = (params: { values: SessionGet }) => {
    if (sessions == null) return;

    const now = new Date();

    const baseTitle = params.values.title?.trim() ?? '';

    // helper to escape regex special chars in title
    function escapeRegex(str: string) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const escapedBase = escapeRegex(baseTitle);

    // matches "<baseTitle>" or "<baseTitle> <number>" at the very end
    const titleRegex = new RegExp(`^${escapedBase}(?: (\\d+))?$`);

    // collect sessions that are copies of this title
    const matchingCopies = sessions.filter((n) => titleRegex.test(n.title));

    // find the highest numeric suffix already used
    let maxNumber = 0;
    for (const n of matchingCopies) {
      const match = n.title.match(titleRegex);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) maxNumber = num;
      }
    }

    const nextNumber = maxNumber + 1;

    const sessionCopy: SessionGet = {
      ...params.values,
      id: generateUUID(),
      title: `${baseTitle} ${nextNumber}`,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    // add copy to state
    handleCreateSession({ values: sessionCopy });

    return sessionCopy;
  };

  // handler to merge 2 sessions
  const handleMergeSession = (params: { from: SessionGet; to: SessionGet }) => {
    const now = new Date();

    const findEarlierDate = (a: Date, b: Date) => {
      return a < b ? a : b;
    };

    const newStart = findEarlierDate(
      new Date(params.from.start),
      new Date(params.to.start)
    );

    const findLaterDate = (a: Date, b: Date) => {
      return a > b ? a : b;
    };

    const newEnd = findLaterDate(
      new Date(params.from.end || 0),
      new Date(params.to.end || 0)
    );

    const newTitle = `${capitalizeWords(getRegionalDate(newStart).time)} - ${capitalizeWords(getRegionalDate(newEnd).time)}`;

    const session: SessionGet = {
      ...params.to,
      title: newTitle,
      start: newStart.toISOString() as any,
      end: newEnd.toISOString() as any,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    // add to session to state
    handleUpdateSession({ values: session });

    // delete merged session
    setTimeout(() => {
      handleDeleteSession({
        values: params.from,
        options: { noRedirect: true },
      });
    }, 3000);

    return session;
  };

  // handler to move session
  const handleMoveSession = (params: {
    values: SessionGet;
    category?: CategoryGet;
  }) => {
    // update session category id
    if (params.category) {
      handleUpdateSession({
        values: {
          ...params.values,
          category_id: params.category.id,
        },
      });
    }
  };

  return {
    sessions,
    categories,
    createSession: handleCreateSession,
    updateSession: handleUpdateSession,
    deleteSession: handleDeleteSession,
    copySession: handleCopySession,
    mergeSession: handleMergeSession,
    moveSession: handleMoveSession,
    // rename stuff
    sessionEditing: editing,
    sessionEditingId: editingId,
    setSessionEditingState: setEditingState,
    startSessionRename: startRename,
    sessionInputRefs: inputRefs,
  };
};
