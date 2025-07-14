import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { sortArray } from '@/utilities/helpers/array';
import {
  getTasksByDate,
  getTasksCategorized,
  getTasksPrioritized,
  GroupedReturnType,
} from '@/services/logic/view';
import { useForm, UseFormReturnType } from '@mantine/form';
import {
  GroupSort,
  Priority,
  SortDirection,
  SyncStatus,
  ViewType,
} from '@generated/prisma';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Order } from '@/enums/sort';
import { TaskRelations } from '@/types/models/task';
import { usePathname } from 'next/navigation';
import { linkify } from '@/utilities/formatters/string';
import { ViewGet, ViewUpdate } from '@/types/models/views';
import { generateUUID } from '@/utilities/generators/id';
import { updateViews } from '@/libraries/redux/slices/views';

export type FormView = {
  view: ViewType;
  groupBy: GroupSort;
  sortBy: GroupSort;
  sortDirection: SortDirection;
  filterBy: {
    priority: Priority;
    category: string;
  };
};

export type FormTaskView = UseFormReturnType<
  FormView,
  (values: FormView) => FormView
>;

export const useFormTaskView = () => {
  const session = useAppSelector((state) => state.session.value);
  const dispatch = useAppDispatch();

  const pathname = usePathname();
  const views = useAppSelector((state) => state.views.value);
  const view = useMemo(
    () => views?.find((v) => v.title == linkify(pathname)),
    [views, pathname]
  );

  const form = useForm({
    initialValues: {
      view: view?.view || ('' as ViewType),

      groupBy: view?.group_by || ('' as GroupSort),
      sortBy: view?.sort_by || ('' as GroupSort),
      sortDirection: view?.sort_direction || ('' as SortDirection),

      filterBy: {
        priority: view?.priority_filter || ('' as Priority),
        category: view?.category_filter || '',
      },
    },
  });

  const updateView = (params?: { reset?: boolean }) => {
    if (!session) return;
    if (views == null) return;

    const formValues = form.getValues();
    const now = new Date();

    if (!view) {
      const viewObject: ViewGet = {
        id: generateUUID(),
        title: linkify(pathname),
        view: formValues.view,
        group_by: formValues.groupBy,
        sort_by: formValues.sortBy,
        sort_direction: formValues.sortDirection,
        priority_filter: formValues.filterBy.priority,
        category_filter: formValues.filterBy.category,
        sync_status: SyncStatus.PENDING,
        profile_id: session.id,
        created_at: now.toISOString() as any,
        updated_at: now.toISOString() as any,
      };

      // add to state
      dispatch(updateViews([...views, viewObject]));
    } else {
      const viewObjectUpdate: ViewUpdate = {
        view: params?.reset ? ('' as any) : formValues.view,
        group_by: params?.reset ? ('' as any) : formValues.groupBy,
        sort_by: params?.reset ? ('' as any) : formValues.sortBy,
        sort_direction: params?.reset ? ('' as any) : formValues.sortDirection,
        priority_filter: params?.reset
          ? ('' as any)
          : formValues.filterBy.priority,
        category_filter: params?.reset
          ? ('' as any)
          : formValues.filterBy.category,
        sync_status: SyncStatus.PENDING,
        updated_at: now.toISOString() as any,
      };

      // update in state
      dispatch(
        updateViews(
          views.map((v) => {
            if (v.title !== linkify(pathname)) return v;
            return { ...v, ...viewObjectUpdate };
          })
        )
      );
    }
  };

  const tasks = useAppSelector((state) => state.tasks.value);

  const prevFormValuesRef = useRef<any | null>(null);

  useEffect(() => {
    if (views == null) return;
    if (!view) return;
    const formValues = form.getValues();
    if (prevFormValuesRef.current == null) return;
    if (prevFormValuesRef.current == formValues) return;

    // don't run if form values are the same as the view
    if (
      view.view == formValues.view &&
      view.group_by == formValues.groupBy &&
      view.sort_by == formValues.sortBy &&
      view.sort_direction == formValues.sortDirection &&
      view.priority_filter == formValues.filterBy.priority &&
      view.category_filter == formValues.filterBy.category
    )
      return;

    console.log('prevFormValuesRef.current', prevFormValuesRef.current);
    console.log('view', view);
    console.log('formValues', formValues);

    updateView();
  }, [form.values, tasks]);

  useEffect(() => {
    if (views == null) return;
    if (!view) return;

    const current = form.values;

    const same =
      current.view === view.view &&
      current.groupBy === view.group_by &&
      current.sortBy === view.sort_by &&
      current.sortDirection === view.sort_direction &&
      current.filterBy.priority === view.priority_filter &&
      current.filterBy.category === view.category_filter;

    if (same) return;

    form.setValues({
      view: view.view as ViewType,
      groupBy: view.group_by as GroupSort,
      sortBy: view.sort_by as GroupSort,
      sortDirection: view.sort_direction as SortDirection,
      filterBy: {
        priority: view.priority_filter as Priority,
        category: view.category_filter as string,
      },
    });

    // update 'prevFormValuesRef'
    prevFormValuesRef.current = form.values;
  }, [views]);

  return { form, exclusion: '', updateView, view };
};

export const useGetOrganizedTasks = (props: {
  tasks: TaskRelations[];
  completeTasks?: boolean;
  defaultGroupTitle?: string;
}) => {
  const pathname = usePathname();
  const views = useAppSelector((state) => state.views.value);
  const view = useMemo(
    () => views?.find((v) => v.title == linkify(pathname)),
    [views, pathname]
  );

  const { groupBy, sortBy, filterBy } = {
    groupBy: view?.group_by,
    sortBy: view?.sort_by,
    filterBy: {
      priority: view?.priority_filter,
      category: view?.category_filter,
    },
  };
  const { priority, category } = filterBy;

  let organizedTasks: GroupedReturnType[] = [];
  const [organizedTasksState, setOrganizedTasksState] = useState<
    GroupedReturnType[]
  >([]);

  const completionStatusTasks = props.tasks.filter((t) =>
    props?.completeTasks ? !!t.complete : !t.complete
  );
  const categories = useAppSelector((state) => state.categories.value);

  const defaultGroup: GroupedReturnType = {
    id: 'default',
    title: props.defaultGroupTitle || 'All Tasks',
    tasks: completionStatusTasks,
  };

  const getOrganizedTasks = () => {
    if (groupBy) {
      switch (groupBy) {
        case GroupSort.PRIORITY:
          organizedTasks = sortArray(
            getTasksPrioritized({ tasks: completionStatusTasks }),
            (item) => item.title,
            Order.ASCENDING
          );
          break;

        case GroupSort.CATEGORY:
          // get tasks without categories
          const tasksWithoutCategory = completionStatusTasks.filter(
            (task) => !task.category_id
          );

          organizedTasks = [
            ...sortArray(
              getTasksCategorized({
                tasks: completionStatusTasks,
                categories: categories || [],
              }),
              (item) => item.title,
              Order.ASCENDING
            ),
            {
              id: 'inbox',
              title: 'Uncategorized',
              tasks: tasksWithoutCategory,
            },
          ];
          break;

        case GroupSort.DATE:
          // get tasks not due
          const tasksWithoutDueDate = completionStatusTasks.filter(
            (task) => !task.due_date && !task.reminders?.length
          );

          organizedTasks = [
            ...sortArray(
              getTasksByDate({ tasks: completionStatusTasks }),
              (item) => new Date(item.title),
              Order.ASCENDING
            ),
            {
              id: '',
              title: 'No Due Date',
              tasks: tasksWithoutDueDate,
            },
          ];
          break;

        default:
          // Default to ungrouped tasks
          organizedTasks = [
            {
              ...defaultGroup,
              tasks: sortArray(
                defaultGroup.tasks,
                (item) => new Date(item.created_at),
                Order.DESCENDING
              ),
            },
          ];
          break;
      }
    } else {
      // If no grouping is selected, treat all tasks as a single group.
      organizedTasks = [
        {
          ...defaultGroup,
          tasks: sortArray(
            defaultGroup.tasks,
            (item) => new Date(item.created_at),
            Order.DESCENDING
          ),
        },
      ];
    }

    if (sortBy) {
      switch (sortBy) {
        case GroupSort.PRIORITY:
          // sort group tasks by priority
          organizedTasks = organizedTasks.map((group) => {
            return {
              ...group,
              tasks: sortArray(
                group.tasks,
                (item) => item.priority,
                Order.ASCENDING
              ),
            };
          });
          break;

        case GroupSort.CATEGORY:
          // sort group tasks by category
          organizedTasks = organizedTasks.map((group) => {
            return {
              ...group,
              tasks: sortArray(
                group.tasks,
                (item) => item.category_id,
                Order.ASCENDING
              ),
            };
          });
          break;

        case GroupSort.DATE:
          // sort group tasks by date
          organizedTasks = organizedTasks.map((group) => {
            return {
              ...group,
              tasks: sortArray(
                group.tasks,
                (item) => (item.due_date ? new Date(item.due_date) : null),
                Order.ASCENDING
              ),
            };
          });
          break;

        default:
          // sort group tasks by title
          organizedTasks = organizedTasks.map((group) => {
            return {
              ...group,
              tasks: sortArray(
                group.tasks,
                (item) => item.title,
                Order.ASCENDING
              ),
            };
          });
          break;
      }
    }

    if (priority) {
      organizedTasks = organizedTasks
        .map((group) => {
          return {
            ...group,
            tasks: group.tasks.filter((task) => task.priority === priority),
          };
        })
        .filter((g) => g.tasks.length);
    }

    if (category) {
      organizedTasks = organizedTasks
        .map((group) => {
          return {
            ...group,
            tasks: group.tasks.filter((task) => task.category_id === category),
          };
        })
        .filter((g) => g.tasks.length);
    }

    setOrganizedTasksState(organizedTasks);
  };

  useEffect(() => {
    if (views == null) return;
    getOrganizedTasks();
  }, [views, props.tasks]);

  return { organizedTasksState, getOrganizedTasks };
};
