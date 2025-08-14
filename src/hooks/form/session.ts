import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  updateSelectedSession,
  updateSessions,
} from '@/libraries/redux/slices/sessions';
import { SessionRelations } from '@/types/models/session';
import { generateUUID } from '@/utilities/generators/id';
import { DeepPartial } from '@/utilities/helpers/types';
import { hasLength, useForm, UseFormReturnType } from '@mantine/form';
import {
  Status,
  // Role,
  SyncStatus,
} from '@generated/prisma';
import { useMemo, useState } from 'react';
import { POMO_SESSION_LENGTH } from '@/data/constants';
import { getRegionalDate } from '@/utilities/formatters/date';

export type FormSessionValues = {
  title: string;
  properties: {
    start: string;
    focusDuration: number | null;
    end: string;
    category_id: string;
    task_id: string;
  };
};

export type OptionalFormSessionValues = DeepPartial<FormSessionValues>;

export type FormSession = UseFormReturnType<
  FormSessionValues,
  (values: FormSessionValues) => FormSessionValues
>;

export const useFormSession = (params?: {
  id?: string;
  defaultValues?: OptionalFormSessionValues;
  options?: { home?: boolean };
}) => {
  const dispatch = useAppDispatch();
  const sessionUser = useAppSelector((s) => s.session.value);
  const selectedSession = useAppSelector((s) => s.sessions.selectedSession);
  const sessions = useAppSelector((s) => s.sessions.value);

  const session = useMemo(
    () => sessions?.find((t) => t.id === (selectedSession?.id || params?.id)),
    [sessions, params?.id, selectedSession?.id]
  );

  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    initialValues: session
      ? {
          title: session.title,
          properties: {
            start: session.start as any,
            end: session.end as any,
            category_id: session.category_id || 'inbox',
            task_id: session.task_id || '',
          },
        }
      : {
          title: '',
          properties: {
            start: new Date().toISOString(),
            end: '',
            category_id: 'inbox',
            task_id: '',
          },
        },
    validate: { title: hasLength({ max: 255 }, 'Max 255 characters') },
    validateInputOnChange: true,
  });

  const addSessionToState = () => {
    const now = new Date();
    const id = generateUUID();
    const v = form.getValues();

    const startDate = now.toISOString();

    const newSession: Omit<SessionRelations, 'profile' | 'task' | 'category'> =
      {
        id,
        title: `${getRegionalDate(new Date(startDate)).time} - `,
        start: startDate as any,
        end: (v.properties.end || '') as any,
        status: Status.ACTIVE,
        pomo_duration:
          params?.defaultValues?.properties?.focusDuration ??
          POMO_SESSION_LENGTH,
        focus_duration: 0,
        profile_id: sessionUser?.id as string,
        task_id: v.properties.task_id || '',
        category_id:
          v.properties.category_id === 'inbox' ? '' : v.properties.category_id,
        sync_status: SyncStatus.PENDING,
        created_at: now.toISOString() as any,
        updated_at: now.toISOString() as any,
      };

    // Update list + select it
    dispatch(updateSessions([newSession, ...(sessions || [])]));
    dispatch(updateSelectedSession(newSession as any));
  };

  const handleSubmit = async (op: () => void, resetOnSubmit?: boolean) => {
    if (form.isValid()) {
      try {
        setSubmitted(true);
        op();
        if (resetOnSubmit) form.reset();
        form.resetTouched();
        form.resetDirty();
      } catch (e) {
        console.error('---> form submission error', (e as Error).message);
      } finally {
        setSubmitted(false);
      }
    } else {
      form.validate();
    }
  };

  const updateState = (runtimeUpdates: Partial<SessionRelations>) => {
    const formValues = form.getValues();

    const newSessions = sessions?.map((t) => {
      if (t.id === session?.id) {
        return {
          ...t,
          ...runtimeUpdates, // <-- comes from Pomodoro
          title: formValues.title,
          task_id: formValues.properties.task_id || '',
          category_id:
            formValues.properties.category_id === 'inbox'
              ? ''
              : formValues.properties.category_id,
          sync_status: SyncStatus.PENDING,
          updated_at: new Date().toISOString(),
        };
      }
      return t;
    });

    dispatch(updateSessions(newSessions));
  };

  const createOrSelectSession = async () => {
    if (!selectedSession) {
      await handleSubmit(addSessionToState, false);
    } else {
      // Ensure it's marked ACTIVE when resuming
      dispatch(
        updateSelectedSession({
          ...selectedSession,
          status: Status.ACTIVE,
          updated_at: new Date().toISOString() as any,
          sync_status: SyncStatus.PENDING,
        } as any)
      );
    }
  };

  // Do NOT validate form for runtime updates; we want timer persistence regardless of title/errors
  const persistRuntime = (
    runtime: Partial<SessionRelations>,
    options?: { stopped?: boolean }
  ) => {
    if (!session) return;

    const v = form.getValues();
    const now = new Date();

    const newSessions = sessions?.map((t) =>
      t.id === session.id
        ? {
            ...t,
            ...runtime, // focus_duration, status, end, etc.
            title: `${session.title}${options?.stopped ? getRegionalDate(now).time : ''}`,
            task_id: v.properties.task_id || '',
            category_id:
              v.properties.category_id === 'inbox'
                ? ''
                : v.properties.category_id,
            sync_status: SyncStatus.PENDING,
            updated_at: now.toISOString(),
          }
        : t
    );

    dispatch(updateSessions(newSessions));
  };

  const finalizeAndClear = (
    runtime: Partial<SessionRelations>,
    options?: { stopped?: boolean }
  ) => {
    persistRuntime(runtime, options);
    // Clear selection so the next Start creates a new session if needed
    dispatch(updateSelectedSession(null));
    // Optional: reset just end/start if you want a fresh form next time
    // form.reset();
  };

  return {
    form,
    addSessionToState,
    updateState,
    submitted,
    createOrSelectSession,
    persistRuntime,
    finalizeAndClear,
  };
};
