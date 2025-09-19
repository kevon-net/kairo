import { generateUUID } from '@/utilities/generators/id';
import { useAppDispatch, useAppSelector } from '../redux';
import { TaskGet } from '@/types/models/task';
import { Status, SyncStatus } from '@generated/prisma';
import { useItemEditContext } from '@/components/contexts/item-edit';
import { CategoryGet } from '@/types/models/category';
import {
  addTask,
  updateTask,
  deleteTask,
} from '@/libraries/redux/slices/tasks';

export const useTaskActions = () => {
  const session = useAppSelector((state) => state.session.value);
  const tasks = useAppSelector((state) => state.tasks.value);
  const categories = useAppSelector((state) => state.categories.value);
  const dispatch = useAppDispatch();

  const { editing, editingId, setEditingState, startRename, inputRefs } =
    useItemEditContext();

  // handler to create task
  const handleCreateTask = (params?: { values?: Partial<TaskGet> }) => {
    if (!session?.id) return;

    const now = new Date();

    const taskNew = {
      ...params?.values,
      id: params?.values?.id || generateUUID(),
      title: params?.values?.title || 'New Task',
      description: params?.values?.description || '',
      complete: params?.values?.complete || false,
      tag_id: params?.values?.tag_id || null,
      profile_id: params?.values?.profile_id || session.id,
      category_id: params?.values?.category_id || null,
      status: params?.values?.status || Status.ACTIVE,
      sync_status: params?.values?.sync_status || SyncStatus.PENDING,
      created_at: params?.values?.created_at || (now.toISOString() as any),
      updated_at: params?.values?.updated_at || (now.toISOString() as any),
    };

    // add to state
    dispatch(addTask(taskNew));

    return taskNew;
  };

  // handler to update task
  const handleUpdateTask = (params: { values: TaskGet }) => {
    // update in state
    dispatch(updateTask(params.values));
  };

  // handler to delete task
  const handleDeleteTask = (params: {
    values: TaskGet;
    options?: { noRedirect?: boolean };
  }) => {
    // deleted from state
    dispatch(deleteTask(params.values));
  };

  // handler to create task copy
  const handleCopyTask = (params: { values: TaskGet }) => {
    if (tasks == null) return;

    const now = new Date();

    const baseTitle = params.values.title?.trim() ?? '';

    // helper to escape regex special chars in title
    function escapeRegex(str: string) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const escapedBase = escapeRegex(baseTitle);

    // matches "<baseTitle>" or "<baseTitle> <number>" at the very end
    const titleRegex = new RegExp(`^${escapedBase}(?: (\\d+))?$`);

    // collect tasks that are copies of this title
    const matchingCopies = tasks.filter((n) => titleRegex.test(n.title));

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

    const taskCopy: TaskGet = {
      ...params.values,
      id: generateUUID(),
      title: `${baseTitle} ${nextNumber}`,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    // add copy to state
    handleCreateTask({ values: taskCopy });

    return taskCopy;
  };

  // handler to merge 2 tasks
  const handleMergeTask = (params: { from: TaskGet; to: TaskGet }) => {
    const now = new Date();

    function stripOuterPTags(html: string) {
      return html.replace(/^<p>/i, '').replace(/<\/p>$/i, '');
    }

    function mergeTaskContent(toContent: string, fromContent: string) {
      const strippedFrom = stripOuterPTags(fromContent);

      // Insert a line break before the new content
      return toContent.replace(/<\/p>$/i, `<br/>${strippedFrom}</p>`);
    }

    const task: TaskGet = {
      ...params.to,
      description: mergeTaskContent(
        params.to.description || '',
        params.from.description || ''
      ),
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    // add to task to state
    handleUpdateTask({ values: task });

    // delete merged task
    setTimeout(() => {
      handleDeleteTask({
        values: params.from,
        options: { noRedirect: true },
      });
    }, 3000);

    return task;
  };

  // handler to move task
  const handleMoveTask = (params: {
    values: TaskGet;
    category?: CategoryGet;
  }) => {
    // update task category id
    if (params.category) {
      handleUpdateTask({
        values: {
          ...params.values,
          category_id: params.category.id,
        },
      });
    }
  };

  return {
    tasks,
    categories,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    copyTask: handleCopyTask,
    mergeTask: handleMergeTask,
    moveTask: handleMoveTask,
    // rename stuff
    taskEditing: editing,
    taskEditingId: editingId,
    setTaskEditingState: setEditingState,
    startTaskRename: startRename,
    taskInputRefs: inputRefs,
  };
};
