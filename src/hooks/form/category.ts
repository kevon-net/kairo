import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux';
import { hasLength, useForm, UseFormReturnType } from '@mantine/form';
import { generateUUID } from '@/utilities/generators/id';
import { CategoryGet } from '@/types/models/category';
import {
  // CategoryView,
  Context,
  Status,
  SyncStatus,
} from '@generated/prisma';
import {
  updateCategories,
  updateDeletedCategories,
} from '@/libraries/redux/slices/categories';
import { updateTasks } from '@/libraries/redux/slices/tasks';
import { usePathname, useRouter } from 'next/navigation';
import { category as categoryColors } from '@/data/colors';

export type FormCategory = UseFormReturnType<
  {
    title: string;
    color: string;
  },
  (values: { title: string; color: string }) => {
    title: string;
    color: string;
  }
>;

export const useCategory = (params?: { id?: string }) => {
  const session = useAppSelector((state) => state.session.value);
  const categories = useAppSelector((state) => state.categories.value);
  const deletedCategories = useAppSelector((state) => state.categories.deleted);
  const tasks = useAppSelector((state) => state.tasks.value);
  const selectedCategory = useAppSelector(
    (state) => state.categories.selectedCategory
  );
  const category = categories?.find((c) => c.id === selectedCategory?.id);
  const pathname = usePathname();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      color: '',
    },

    validate: {
      title: hasLength({ max: 255 }, 'Max 255 characters'),
    },
  });

  const addToState = () => {
    const currentDate = new Date();
    const categoryId = generateUUID();

    const newCategory: CategoryGet = {
      id: categoryId,
      title: form.values.title,
      color: form.values.color,
      // view: CategoryView.LIST,
      created_at: currentDate.toISOString() as any,
      updated_at: currentDate.toISOString() as any,
      sync_status: SyncStatus.PENDING,
      profile_id: session?.id as string,
      context: Context.SESSIONS,
      status: Status.ACTIVE,
    };

    const newCategories = [newCategory, ...(categories || [])];

    dispatch(updateCategories(newCategories));
  };

  const updateState = () => {
    dispatch(
      updateCategories(
        categories?.map((t) => {
          if (t.id === category?.id) {
            return {
              ...t,
              title: form.values.title,
              color: form.values.color,
              updatedAt: new Date().toISOString(),
              sync_status: SyncStatus.PENDING,
            };
          }

          return t;
        })
      )
    );
  };

  const deleteFromState = () => {
    if (
      (category?.id && pathname.includes(category.id)) ||
      (params?.id && pathname.includes(params.id))
    ) {
      setTimeout(() => {
        router.push('/app/inbox');
      }, 3000);
    }

    if (category?.id || params?.id) {
      dispatch(
        updateTasks(
          tasks?.map((t) => {
            if (t.category_id == category?.id || t.category_id == params?.id)
              return {
                ...t,
                categoryId: null,
                sync_status: SyncStatus.PENDING,
                updatedAt: new Date().toISOString(),
              };

            return t;
          })
        )
      );

      dispatch(
        updateDeletedCategories([
          ...(deletedCategories || []),
          categories?.find((c) => c.id == category?.id || c.id == params?.id) ||
            [],
        ])
      );

      dispatch(
        updateCategories(
          categories?.filter((c) => {
            if (c.id == category?.id || c.id == params?.id) return false;
            return true;
          })
        )
      );
    }
  };

  const handleSubmit = (operation: () => void) => {
    if (form.isValid()) {
      try {
        setSubmitted(true);
        operation();
      } catch (error) {
        console.error('---> form submission error', (error as Error).message);
      } finally {
        setSubmitted(false);
      }
    } else {
      form.validate();
    }
  };

  // Track the last task state separately to avoid unnecessary resets
  const prevTaskRef = useRef(category);

  const editing = !!category?.title;

  const initializeValues = () => {
    form.setValues({
      title: category?.title || '',
      color: category?.color || categoryColors[0].value,
    });
  };

  useEffect(() => {
    if (!form.isDirty() && prevTaskRef.current !== category) {
      initializeValues();
      prevTaskRef.current = category; // Update ref to avoid unnecessary resets
    }
  }, [categories]);

  useEffect(() => {
    initializeValues();
    form.resetDirty();
  }, [category?.id]);

  return {
    form,
    handleSubmit,
    submitted,
    addToState,
    updateState,
    deleteFromState,
    editing,
  };
};
