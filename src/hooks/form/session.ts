import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  updateDeletedSessions,
  updateSessions,
} from '@/libraries/redux/slices/sessions';
import { SessionRelations } from '@/types/models/session';
import { generateUUID } from '@/utilities/generators/id';
import { DeepPartial } from '@/utilities/helpers/types';
import { hasLength, useForm, UseFormReturnType } from '@mantine/form';
import { useDebouncedCallback } from '@mantine/hooks';
import {
  Status,
  // Role,
  SyncStatus,
} from '@generated/prisma';
import { useEffect, useMemo, useRef, useState } from 'react';

export type FormSessionValues = {
  title: string;
  properties: {
    start: string;
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
  const sessionUser = useAppSelector((state) => state.session.value);
  const selectedSession = useAppSelector(
    (state) => state.sessions.selectedSession
  );
  const deletedSessions = useAppSelector((state) => state.sessions.deleted);
  const sessions = useAppSelector((state) => state.sessions.value);
  const session = useMemo(
    () => sessions?.find((t) => t.id === (selectedSession?.id || params?.id)),
    [sessions, params?.id, selectedSession?.id]
  );

  const dispatch = useAppDispatch();
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

    validate: {
      title: hasLength({ max: 255 }, 'Max 255 characters'),
    },

    validateInputOnChange: true,
  });

  const currentDate = new Date();

  const sessionId = generateUUID();

  const newSession: Omit<SessionRelations, 'profile' | 'task' | 'category'> = {
    id: sessionId,
    title: form.values.title,
    start: session?.start || (currentDate.toISOString() as any),
    end: session?.end || (currentDate.toISOString() as any),
    status: Status.ACTIVE,
    duration: 25,
    profile_id: sessionUser?.id as string,
    task_id: form.values.properties.task_id || '',
    category_id:
      form.values.properties.category_id == 'inbox'
        ? ''
        : form.values.properties.category_id,
    sync_status: SyncStatus.PENDING,
    created_at: session?.created_at || (currentDate.toISOString() as any),
    updated_at: currentDate.toISOString() as any,
  };

  const addSessionToState = () => {
    const newSessions = [newSession, ...(sessions || [])];
    dispatch(updateSessions(newSessions));
  };

  const updateState = () => {
    const newSessions = sessions?.map((t) => {
      if (t.id === session?.id) {
        return {
          ...t,
          sync_status: SyncStatus.PENDING,
          updated_at: currentDate.toISOString(),
          title: form.values.title,
          start: form.values.properties.start,
          end: form.values.properties.end,
          task_id: form.values.properties.task_id || '',
          category_id:
            form.values.properties.category_id == 'inbox'
              ? ''
              : form.values.properties.category_id,
        };
      }

      return t;
    });

    dispatch(updateSessions(newSessions));
  };

  const handleDelete = () => {
    // remember to remove all session relations (above this line) before removing session

    // remove session from state
    if (session) {
      dispatch(updateDeletedSessions([...deletedSessions, session]));
      dispatch(updateSessions(sessions?.filter((t) => t.id != session.id)));
    }
  };

  const handleSubmit = async (
    operation: () => void,
    resetOnSubmit?: boolean
  ) => {
    if (form.isValid()) {
      try {
        setSubmitted(true);
        operation();

        if (resetOnSubmit) form.reset();

        form.resetTouched();
        form.resetDirty();
      } catch (error) {
        console.error('---> form submission error', (error as Error).message);
      } finally {
        setSubmitted(false);
      }
    } else {
      form.validate();
    }
  };

  // Track the last form session properties state separately to avoid unnecessary resets
  const prevSessionPropertiesRef = useRef(form.values.properties);

  const handlePropertiesChange = () => {
    if (!session?.id || !form.isTouched() || !form.isValid()) return;

    // check if form session properties have actually changed
    const propertiesChanged =
      JSON.stringify(prevSessionPropertiesRef.current) !=
      JSON.stringify(form.values.properties);

    if (!propertiesChanged) return;

    form.resetTouched();
    form.resetDirty();

    updateState();

    // Update ref to avoid unnecessary resets
    prevSessionPropertiesRef.current = form.values.properties;
  };

  const debounceHandlePropertiesChange = useDebouncedCallback(() => {
    handlePropertiesChange();
  }, 250);

  useEffect(() => debounceHandlePropertiesChange(), [form.values.properties]);

  useEffect(() => {
    if (params?.options?.home && selectedSession?.id) return;

    const handleIdChange = () => {
      if (!session) {
        form.setValues({
          title: params?.defaultValues?.title || '',
          properties: {
            start:
              params?.defaultValues?.properties?.start ||
              new Date().toISOString(),
            end: params?.defaultValues?.properties?.end || '',
            task_id: params?.defaultValues?.properties?.task_id || '',
            category_id:
              params?.defaultValues?.properties?.category_id || 'inbox',
          },
        });
      } else {
        const initialValues: FormSessionValues = {
          title: session.title,
          properties: {
            start: session.start as any,
            end: session.end as any,
            task_id: session.task_id || '',
            category_id: session.category_id || 'inbox',
          },
        };

        form.setValues(initialValues);

        // Update 'prevSessionPropertiesRef' to avoid unnecessary resets
        prevSessionPropertiesRef.current = initialValues.properties;

        form.resetTouched();
      }

      form.resetDirty();
    };

    handleIdChange();
  }, [selectedSession?.id]);

  // sync changes made to Redux to all form instances immediately
  useEffect(() => {
    if (params?.options?.home) return;

    const handleSessionUpdate = () => {
      if (session && form.isTouched()) {
        form.setValues({
          title: session.title,
          properties: {
            start: session.start as any,
            end: session.end as any,
            task_id: session.task_id || '',
            category_id: session.category_id || 'inbox',
          },
        });
      }
    };

    handleSessionUpdate();
  }, [session]);

  return {
    form,
    handleSubmit,
    submitted,
    handleDelete,
    addSessionToState,
    updateState,
  };
};
