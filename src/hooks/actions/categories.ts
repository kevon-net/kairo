import { generateUUID } from '@/utilities/generators/id';
import { useAppDispatch, useAppSelector } from '../redux';
import { CategoryGet } from '@/types/models/category';
import { CategoryType, Status, SyncStatus } from '@generated/prisma';
import { usePathname, useRouter } from 'next/navigation';
import { useItemEditContext } from '@/components/contexts/item-edit';
import {
  addCategory,
  deleteCategory,
  updateCategory,
} from '@/libraries/redux/slices/categories';
import { setTasks } from '@/libraries/redux/slices/tasks';

export const useCategoryActions = () => {
  const session = useAppSelector((state) => state.session.value);
  const categories = useAppSelector((state) => state.categories.value);
  const tasks = useAppSelector((state) => state.tasks.value);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();

  const { editing, editingId, setEditingState, startRename, inputRefs } =
    useItemEditContext();

  // handler to create category
  const handleCreateCategory = (params?: { values?: Partial<CategoryGet> }) => {
    if (!session?.id) return;

    const categoryNew = {
      ...params?.values,
      id: params?.values?.id || generateUUID(),
      title: params?.values?.title || 'New Folder',
      color: params?.values?.color || 'gray',
      type: params?.values?.type || CategoryType.SESSION,
      profile_id: params?.values?.profile_id || session.id,
      status: params?.values?.status || Status.ACTIVE,
    };

    // add to state
    dispatch(addCategory(categoryNew));

    return categoryNew;
  };

  // handler to update category
  const handleUpdateCategory = (params: { values: CategoryGet }) => {
    // update state
    dispatch(updateCategory(params.values));
  };

  // handler to delete category
  const handleDeleteCategory = (params: {
    values: CategoryGet;
    options?: { noRedirect?: boolean };
  }) => {
    if (tasks == null) return;

    // update tasks
    dispatch(
      setTasks(
        tasks.map((t) => {
          if (t.category_id != params.values.id) return t;

          return {
            ...t,
            category_id: null,
          };
        })
      )
    );

    // deleted from state
    dispatch(deleteCategory(params.values));

    // check if current category is in view
    if (!params.options?.noRedirect && pathname.includes(params.values.id)) {
      router.replace(`/app/home`);
    }
  };

  // handler to create category copy
  const handleCopyCategory = (params: { values: CategoryGet }) => {
    if (categories == null) return;
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

    // collect categories that are copies of this title
    const matchingCopies = categories.filter((n) => titleRegex.test(n.title));

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

    const categoryCopyId = generateUUID();

    const categoryCopy: Partial<CategoryGet> = {
      ...params.values,
      id: categoryCopyId,
      title: `${baseTitle} ${nextNumber}`,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    // add copy to state
    handleCreateCategory({ values: categoryCopy });

    const categoryTasks = tasks.filter(
      (n) => n.category_id == params.values.id
    );

    if (categoryTasks.length) {
      const updatedCategoryTasks = categoryTasks.map((n) => {
        return {
          ...n,
          id: generateUUID(),
          category_id: categoryCopyId,
          sync_status: SyncStatus.PENDING,
          updated_at: now.toISOString() as any,
        };
      });

      // add tasks to state
      dispatch(setTasks([...tasks, ...updatedCategoryTasks]));
    }

    return categoryCopy;
  };

  return {
    categories,
    createCategory: handleCreateCategory,
    copyCategory: handleCopyCategory,
    updateCategory: handleUpdateCategory,
    deleteCategory: handleDeleteCategory,
    // rename stuff
    categoryEditing: editing,
    categoryEditingId: editingId,
    setCategoryEditingState: setEditingState,
    startCategoryRename: startRename,
    categoryInputRefs: inputRefs,
  };
};
