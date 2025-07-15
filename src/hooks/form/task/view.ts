import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { sortArray } from '@/utilities/helpers/array';
import { GroupedReturnType } from '@/services/logic/view';
import { useForm, UseFormReturnType } from '@mantine/form';
import { SortDirection, SyncStatus } from '@generated/prisma';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Order } from '@/enums/sort';
import { TaskRelations } from '@/types/models/task';
import { usePathname } from 'next/navigation';
import { linkify } from '@/utilities/formatters/string';
import { ViewGet, ViewUpdate } from '@/types/models/views';
import { generateUUID } from '@/utilities/generators/id';
import { updateViews } from '@/libraries/redux/slices/views';

export type FormView = {
  sortDirection: SortDirection;
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
      sortDirection: view?.sort_direction || ('' as SortDirection),
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
        sort_direction: formValues.sortDirection,
        sync_status: SyncStatus.PENDING,
        profile_id: session.id,
        created_at: now.toISOString() as any,
        updated_at: now.toISOString() as any,
      };

      // add to state
      dispatch(updateViews([...views, viewObject]));
    } else {
      const viewObjectUpdate: ViewUpdate = {
        sort_direction: params?.reset ? ('' as any) : formValues.sortDirection,
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
    if (view.sort_direction == formValues.sortDirection) return;

    updateView();
  }, [form.values, tasks]);

  useEffect(() => {
    if (views == null) return;
    if (!view) return;

    const current = form.values;

    const same = current.sortDirection === view.sort_direction;

    if (same) return;

    form.setValues({
      sortDirection: view.sort_direction as SortDirection,
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

  const { sortBy } = {
    sortBy: view?.sort_direction || ('' as SortDirection),
  };

  let organizedTasks: GroupedReturnType[] = [];
  const [organizedTasksState, setOrganizedTasksState] = useState<
    GroupedReturnType[]
  >([]);

  const completionStatusTasks = props.tasks.filter((t) =>
    props?.completeTasks ? !!t.complete : !t.complete
  );

  const defaultGroup: GroupedReturnType = {
    id: 'default',
    title: props.defaultGroupTitle || 'All Tasks',
    tasks: completionStatusTasks,
  };

  const getOrganizedTasks = () => {
    // Treat all tasks as a single group.
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

    if (sortBy) {
      switch (sortBy) {
        case SortDirection.ASCENDING:
          // sort group tasks by created_at ascending
          organizedTasks = organizedTasks.map((group) => {
            return {
              ...group,
              tasks: sortArray(
                group.tasks,
                (item) => new Date(item.created_at),
                Order.ASCENDING
              ),
            };
          });
          break;

        case SortDirection.DESCENDING:
          // sort group tasks by created_at descending
          organizedTasks = organizedTasks.map((group) => {
            return {
              ...group,
              tasks: sortArray(
                group.tasks,
                (item) => new Date(item.created_at),
                Order.DESCENDING
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

    setOrganizedTasksState(organizedTasks);
  };

  useEffect(() => {
    if (views == null) return;
    getOrganizedTasks();
  }, [views, props.tasks]);

  return { organizedTasksState, getOrganizedTasks };
};
