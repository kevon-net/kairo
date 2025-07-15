import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  updateDeletedTasks,
  updateTasks,
} from '@/libraries/redux/slices/tasks';
import { TaskRelations } from '@/types/models/task';
import { generateUUID } from '@/utilities/generators/id';
import { DeepPartial } from '@/utilities/helpers/types';
import { hasLength, useForm, UseFormReturnType } from '@mantine/form';
import { useDebouncedCallback } from '@mantine/hooks';
import {
  // Role,
  SyncStatus,
} from '@generated/prisma';
import { useEffect, useMemo, useRef, useState } from 'react';

export type FormTaskValues = {
  title: string;
  date: string;
  properties: {
    complete: boolean;
    category_id: string;
  };
};

export type OptionalFormTaskValues = DeepPartial<FormTaskValues>;

export type FormTask = UseFormReturnType<
  FormTaskValues,
  (values: FormTaskValues) => FormTaskValues
>;

export const useFormTask = (params?: {
  id?: string;
  defaultValues?: OptionalFormTaskValues;
  options?: { home?: boolean };
}) => {
  const session = useAppSelector((state) => state.session.value);
  const selectedTask = useAppSelector((state) => state.tasks.selectedTask);
  const deletedTasks = useAppSelector((state) => state.tasks.deleted);
  const tasks = useAppSelector((state) => state.tasks.value);
  const task = useMemo(
    () => tasks?.find((t) => t.id === (selectedTask?.id || params?.id)),
    [tasks, params?.id, selectedTask?.id]
  );

  const dispatch = useAppDispatch();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    initialValues: task
      ? {
          title: task.title,
          date: task.created_at as any,

          properties: {
            complete: task.complete,
            category_id: task.category_id || 'inbox',
          },
        }
      : {
          title: '',
          date: new Date().toISOString(),

          properties: {
            complete: false,
            category_id: '',
          },
        },

    validate: {
      title: hasLength({ max: 255 }, 'Max 255 characters'),
    },

    validateInputOnChange: true,
  });

  const currentDate = new Date();

  const taskId = generateUUID();

  const newTask: Omit<TaskRelations, 'profile' | 'category' | 'sessions'> = {
    id: taskId,
    title: form.values.title,
    complete: form.values.properties.complete,
    profile_id: session?.id as string,
    category_id:
      form.values.properties.category_id == 'inbox'
        ? ''
        : form.values.properties.category_id,
    sync_status: SyncStatus.PENDING,
    created_at: task?.created_at || (currentDate.toISOString() as any),
    updated_at: currentDate.toISOString() as any,
  };

  const addTaskToState = () => {
    const newTasks = [newTask, ...(tasks || [])];
    dispatch(updateTasks(newTasks));
  };

  const updateState = () => {
    const newTasks = tasks?.map((t) => {
      if (t.id === task?.id) {
        return {
          ...t,
          sync_status: SyncStatus.PENDING,
          updated_at: currentDate.toISOString(),
          title: form.values.title,
          complete: form.values.properties.complete,
          category_id:
            form.values.properties.category_id == 'inbox'
              ? ''
              : form.values.properties.category_id,
        };
      }

      return t;
    });

    dispatch(updateTasks(newTasks));
  };

  const handleDelete = () => {
    // remember to remove all task relations (above this line) before removing task

    // remove task from state
    if (task) {
      dispatch(updateDeletedTasks([...deletedTasks, task]));
      dispatch(updateTasks(tasks?.filter((t) => t.id != task.id)));
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

  // Track the last form task properties state separately to avoid unnecessary resets
  const prevTaskPropertiesRef = useRef(form.values.properties);

  const handlePropertiesChange = () => {
    if (!task?.id || !form.isTouched() || !form.isValid()) return;

    // check if form task properties have actually changed
    const propertiesChanged =
      JSON.stringify(prevTaskPropertiesRef.current) !=
      JSON.stringify(form.values.properties);

    if (!propertiesChanged) return;

    form.resetTouched();
    form.resetDirty();

    updateState();

    // Update ref to avoid unnecessary resets
    prevTaskPropertiesRef.current = form.values.properties;
  };

  const debounceHandlePropertiesChange = useDebouncedCallback(() => {
    handlePropertiesChange();
  }, 250);

  useEffect(() => debounceHandlePropertiesChange(), [form.values.properties]);

  useEffect(() => {
    if (params?.options?.home && selectedTask?.id) return;

    const handleIdChange = () => {
      if (!task) {
        form.setValues({
          title: params?.defaultValues?.title || '',
          date: params?.defaultValues?.date || '',
          properties: {
            complete: params?.defaultValues?.properties?.complete || false,
            category_id:
              params?.defaultValues?.properties?.category_id || 'inbox',
          },
        });
      } else {
        const initialValues: FormTaskValues = {
          title: task.title,
          date: task.created_at.toISOString(),
          properties: {
            complete: task.complete,
            category_id: task.category_id || 'inbox',
          },
        };

        form.setValues(initialValues);

        // Update 'prevTaskPropertiesRef' to avoid unnecessary resets
        prevTaskPropertiesRef.current = initialValues.properties;

        form.resetTouched();
      }

      form.resetDirty();
    };

    handleIdChange();
  }, [selectedTask?.id]);

  // sync changes made to Redux to all form instances immediately
  useEffect(() => {
    if (params?.options?.home) return;

    const handleTaskUpdate = () => {
      if (task && form.isTouched()) {
        form.setValues({
          title: task.title,
          date: task.created_at.toISOString(),
          properties: {
            complete: task.complete,
            category_id: task.category_id || 'inbox',
          },
        });
      }
    };

    handleTaskUpdate();
  }, [task]);

  return {
    form,
    handleSubmit,
    submitted,
    handleDelete,
    addTaskToState,
    updateState,
  };
};
