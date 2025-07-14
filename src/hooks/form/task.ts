import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  updateRecurringRules,
  updateDeletedRecurringRules,
} from '@/libraries/redux/slices/recurring-rules';
import {
  updateReminders,
  updateDeletedReminders,
} from '@/libraries/redux/slices/reminders';
import {
  updateDeletedTasks,
  updateTasks,
} from '@/libraries/redux/slices/tasks';
import { getNextDate, getNextWeekdays } from '@/services/logic/time';
import { TaskRelations } from '@/types/models/task';
import { generateUUID } from '@/utilities/generators/id';
import { areSameDay } from '@/utilities/helpers/time';
import { DeepPartial } from '@/utilities/helpers/types';
import { hasLength, useForm, UseFormReturnType } from '@mantine/form';
import { useDebouncedCallback } from '@mantine/hooks';
import {
  $Enums,
  Frequency,
  Priority,
  Reminder,
  // Role,
  Status,
  SyncStatus,
  Weekdays,
} from '@generated/prisma';
import { useEffect, useMemo, useRef, useState } from 'react';

export type FormTaskValues = {
  title: string;
  description: string;
  properties: {
    complete: boolean;
    due_date: string;
    time: string;
    priority: $Enums.Priority;
    interval: number;
    frequency: $Enums.Frequency;
    weekdays: $Enums.Weekdays[];
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

  const recurringRules = useAppSelector((state) => state.recurringRules.value);
  const deletedRules = useAppSelector((state) => state.recurringRules.deleted);
  const recurringRule = useMemo(
    () => recurringRules?.find((rr) => rr.id === task?.recurring_rule_id),
    [recurringRules, task?.recurring_rule_id]
  );
  const reminders = useAppSelector((state) => state.reminders.value);
  const deletedReminders = useAppSelector((state) => state.reminders.deleted);
  const reminder = useMemo(
    () => reminders?.find((r) => r.id === (task?.reminders || [])[0]?.id),
    [reminders, task?.reminders]
  );

  const dispatch = useAppDispatch();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    initialValues: task
      ? {
          title: task.title,
          description: task.description || '',

          properties: {
            complete: task.complete,
            due_date: (task.due_date as any) || '',
            time: ((task?.reminders || [])[0]?.remind_at as any) || '',
            priority: task.priority,
            interval: task.recurring_rule?.interval || 1,
            frequency: task.recurring_rule?.frequency || ('' as Frequency),
            weekdays: task.recurring_rule?.day_of_week || ([] as Weekdays[]),
            category_id: task.category_id || 'inbox',
          },
        }
      : {
          title: '',
          description: '',

          properties: {
            complete: false,
            due_date: '',
            time: '',
            priority: '' as Priority,
            interval: 1,
            frequency: '' as Frequency,
            weekdays: [] as Weekdays[],
            category_id: '',
          },
        },

    validate: {
      title: hasLength({ max: 255 }, 'Max 255 characters'),
      description: hasLength({ max: 2048 }, 'Max 2048 characters'),
    },

    validateInputOnChange: true,
  });

  const currentDate = new Date();
  const recurringRuleId = generateUUID();

  const recurringRuleObject = {
    id: recurringRuleId,
    frequency: form.values.properties.frequency as Frequency,
    interval: form.values.properties.interval || 1,
    day_of_week: form.values.properties.weekdays as Weekdays[],
    end_date: null,
    status: Status.ACTIVE,
    sync_status: SyncStatus.PENDING,
    created_at: recurringRule?.created_at || (currentDate.toISOString() as any),
    updated_at: currentDate.toISOString() as any,
    profile_id: session?.id as string,
  };

  const recurringRuleObjectUpdate = {
    sync_status: SyncStatus.PENDING,
    updated_at: currentDate.toISOString(),

    // update form items
    frequency: form.values.properties.frequency as Frequency,
    interval: form.values.properties.interval || 1,
    day_of_week: form.values.properties.weekdays as Weekdays[],
  };

  const taskId = generateUUID();
  const reminderId = generateUUID();

  let newDate: Date | null = form.values.properties.due_date
    ? new Date(form.values.properties.due_date)
    : null;

  const timeDate = new Date(form.values.properties.time);
  const useDate = newDate && timeDate > newDate;

  const reminderObject = {
    id: (task?.reminders || [])[0]?.id || reminderId,
    remind_at: useDate
      ? (newDate?.toISOString() as any)
      : (form.values.properties.time as any),
    sync_status: SyncStatus.PENDING,
    sent: false,
    created_at: reminder?.created_at || (currentDate.toISOString() as any),
    updated_at: currentDate.toISOString() as any,
    task_id: task?.id || taskId,
    profile_id: session?.id as string,
  };

  const reminderObjectUpdate = {
    sync_status: SyncStatus.PENDING,
    updated_at: currentDate.toISOString(),

    // update form item
    remind_at: form.values.properties.time as any,
  };

  const newTask: Omit<TaskRelations, 'profile'> = {
    id: taskId,
    title: form.values.title,
    complete: form.values.properties.complete,
    description: form.values.description,
    due_date: newDate ? (newDate.toISOString() as any) : null,
    priority: form.values.properties.priority as Priority,
    profile_id: session?.id as string,
    recurring_rule_id: form.values.properties.frequency
      ? recurringRuleId
      : null,
    recurring_rule: form.values.properties.frequency
      ? recurringRuleObject
      : null,
    category_id:
      form.values.properties.category_id == 'inbox'
        ? ''
        : form.values.properties.category_id,
    tags: [],
    reminders: reminderObject ? [reminderObject] : [],
    sync_status: SyncStatus.PENDING,
    created_at: task?.created_at || (currentDate.toISOString() as any),
    updated_at: currentDate.toISOString() as any,
  };

  const addTaskToState = () => {
    // If the task has a recurring frequency, initialize the recurring rule
    if (form.values.properties.frequency) {
      const newRecurringRules = [...recurringRules, recurringRuleObject];
      dispatch(updateRecurringRules(newRecurringRules));

      if (form.values.properties.weekdays.length) {
        newDate = getNextWeekdays(newDate || currentDate)[0];
      }
    }

    // If time is provided, update newDate's time component and add reminder
    if (form.values.properties.time) {
      const newReminders = [...reminders, reminderObject];
      dispatch(updateReminders(newReminders));

      if (useDate) {
        newDate?.setHours(
          timeDate.getHours(),
          timeDate.getMinutes(),
          timeDate.getSeconds()
        );
      }
    }

    const newTasks = [newTask, ...(tasks || [])];
    dispatch(updateTasks(newTasks));
  };

  const updateState = () => {
    // handle recurring rule relation
    if (!form.values.properties.frequency) {
      if (recurringRule?.id) {
        // check if rule is being used by other tasks
        const otherTasksUsingRule = tasks?.filter(
          (task) => task.recurring_rule_id == recurringRule.id
        );

        if ((otherTasksUsingRule || []).length < 2) {
          dispatch(
            updateDeletedRecurringRules([...deletedRules, recurringRule])
          );
          dispatch(
            updateRecurringRules(
              recurringRules.filter((rr) => rr.id != recurringRule.id)
            )
          );
        }
      }
    } else {
      // if creating new rule add to state else update current rule
      if (recurringRule?.id) {
        // check if the rule has actually changed
        const recurringRuleChanged =
          recurringRule.frequency != form.values.properties.frequency ||
          recurringRule.interval != form.values.properties.interval ||
          recurringRule.day_of_week.length !=
            form.values.properties.weekdays.length;

        if (recurringRuleChanged) {
          const updatedRecurringRules = recurringRules.map((rr) => {
            if (rr.id === recurringRule.id) {
              return { ...rr, ...recurringRuleObjectUpdate };
            }

            return rr;
          });

          dispatch(updateRecurringRules(updatedRecurringRules));
        }
      } else {
        const newRecurringRules = [...recurringRules, recurringRuleObject];
        dispatch(updateRecurringRules(newRecurringRules));
      }
    }

    // handle reminder relation
    if (!form.values.properties.time) {
      if (reminder?.id) {
        dispatch(updateDeletedReminders([...deletedReminders, reminder]));
        dispatch(
          updateReminders(reminders.filter((re) => re.id != reminder.id))
        );
      }
    } else {
      // if creating new reminder, add to state else update current reminder
      if (reminder?.id) {
        // check if reminder has actually changed
        const reminderChanged =
          new Date(reminder.remind_at).getTime() !=
          new Date(form.values.properties.time).getTime();

        if (reminderChanged) {
          const updatedReminders = reminders.map((re) => {
            if (re.id === reminder.id) {
              return { ...re, ...reminderObjectUpdate };
            }

            return re;
          });

          dispatch(updateReminders(updatedReminders));
        }
      } else {
        const newReminders = [...reminders, reminderObject];
        dispatch(updateReminders(newReminders));
      }
    }

    let newTasks = tasks?.map((t) => {
      if (t.id === task?.id) {
        return {
          ...t,
          sync_status: SyncStatus.PENDING,
          updated_at: currentDate.toISOString(),
          title: form.values.title,
          complete: form.values.properties.complete,
          description: form.values.description,
          due_date: form.values.properties.due_date,
          priority: form.values.properties.priority,
          recurring_rule_id: !form.values.properties.frequency
            ? null
            : t.recurring_rule_id || recurringRuleId,
          recurring_rule: !form.values.properties.frequency
            ? null
            : {
                ...t.recurring_rule,
                ...recurringRuleObjectUpdate,
                id:
                  t.recurring_rule?.id ||
                  task?.recurring_rule_id ||
                  recurringRuleId,
              },
          reminders: !form.values.properties.time
            ? []
            : [
                {
                  ...t.reminders[0],
                  ...reminderObjectUpdate,
                  id:
                    t.reminders[0]?.id ||
                    (task?.reminders || [])[0]?.id ||
                    reminderId,
                  remindAt: form.values.properties.time,
                },
              ],
          category_id:
            form.values.properties.category_id == 'inbox'
              ? ''
              : form.values.properties.category_id,
        };
      }

      return t;
    });

    // handle new task creation according to recurring rule
    if (
      form.values.properties.complete &&
      task?.due_date &&
      task.recurring_rule?.frequency
    ) {
      // get next due date
      const nextDueDate: Date = getNextDate({
        date: new Date(task.due_date),
        frequency: task.recurring_rule?.frequency || 1,
        interval: task.recurring_rule.interval,
        weekdays: task.recurring_rule?.day_of_week,
      });

      /**
       * check if there's an existing task in state
       * that already has the same 'task.recurringRuleId'-'nextDate' combination
       *  */
      const existingTask = tasks?.find(
        (t) =>
          t.recurring_rule_id == task.recurring_rule_id &&
          areSameDay(t.due_date || '', nextDueDate.toISOString() as any)
      );

      if (!!!existingTask) {
        let nextReminder: Reminder | null = null;

        if (task?.reminders.length) {
          // get next remind at date
          const nextRemindAtDate = getNextDate({
            date: new Date((task?.reminders || [])[0].remind_at),
            frequency: task.recurring_rule?.frequency || 1,
            interval: task.recurring_rule.interval,
            weekdays: task.recurring_rule?.day_of_week,
          });

          // add new reminder to state
          nextReminder = {
            ...(task?.reminders || [])[0],
            id: reminderId,
            remind_at: nextRemindAtDate.toISOString() as any,
            task_id: taskId,
            created_at: currentDate.toISOString() as any,
            updated_at: currentDate.toISOString() as any,
          };

          const newReminders = [...reminders, nextReminder];
          dispatch(updateReminders(newReminders));
        }

        // create next task object
        const nextTask: TaskRelations = {
          ...task,
          id: taskId,
          complete: false,
          due_date: nextDueDate.toISOString() as any,
          created_at: currentDate.toISOString() as any,
          recurring_rule_id: task.recurring_rule_id,
          recurring_rule: task.recurring_rule,
          reminders: !nextReminder ? [] : [nextReminder],
        };

        // add next task
        newTasks = [nextTask, ...(newTasks || [])];
      }
    }

    dispatch(updateTasks(newTasks));
  };

  const handleDelete = () => {
    // remove rule from state

    if (recurringRule?.id) {
      // check if rule is being used by other tasks
      const otherTasksUsingRule = tasks?.filter(
        (task) => task.recurring_rule_id == recurringRule.id
      );

      if ((otherTasksUsingRule || []).length < 2) {
        dispatch(updateDeletedRecurringRules([...deletedRules, recurringRule]));
        dispatch(
          updateRecurringRules(
            recurringRules.filter((rr) => rr.id != recurringRule.id)
          )
        );
      }
    }

    // remove reminder from state
    if (reminder?.id) {
      dispatch(updateDeletedReminders([...deletedReminders, reminder]));
      dispatch(updateReminders(reminders.filter((re) => re.id != reminder.id)));
    }

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
          description: params?.defaultValues?.description || '',
          properties: {
            complete: params?.defaultValues?.properties?.complete || false,
            due_date: params?.defaultValues?.properties?.due_date || '',
            interval: params?.defaultValues?.properties?.interval || 1,
            frequency: (params?.defaultValues?.properties?.frequency ||
              '') as Frequency,
            category_id:
              params?.defaultValues?.properties?.category_id || 'inbox',
            priority:
              params?.defaultValues?.properties?.priority ||
              Priority.NOT_URGENT_UNIMPORTANT,
            weekdays: [] as Weekdays[],
            time: '',
          },
        });
      } else {
        const initialValues: FormTaskValues = {
          title: task.title,
          description: task.description || '',
          properties: {
            complete: task.complete,
            due_date: (task.due_date as any) || '',
            time: ((task?.reminders || [])[0]?.remind_at as any) || '',
            interval: task.recurring_rule?.interval || 1,
            frequency: (task.recurring_rule?.frequency || '') as Frequency,
            weekdays: (task.recurring_rule?.day_of_week || []) as Weekdays[],
            priority: task.priority,
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
          description: task.description || '',
          properties: {
            complete: task.complete,
            due_date: (task.due_date as any) || '',
            time: ((task?.reminders || [])[0]?.remind_at as any) || '',
            priority: task.priority,
            interval: task.recurring_rule?.interval || 1,
            frequency: (task.recurring_rule?.frequency || '') as Frequency,
            weekdays: (task.recurring_rule?.day_of_week || []) as Weekdays[],
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
