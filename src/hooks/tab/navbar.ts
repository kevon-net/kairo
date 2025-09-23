import { usePathname } from 'next/navigation';
import { useAppSelector } from '../redux';
import { useEffect, useState } from 'react';
import { extractUuidFromParam } from '@/utilities/helpers/string';

export const useTabAside = () => {
  const pathname = usePathname();

  const categories = useAppSelector((state) => state.categories.value);
  const tasks = useAppSelector((state) => state.tasks.value);
  const sessions = useAppSelector((state) => state.sessions.value);

  const [activeTab, setActiveTab] = useState<string | null>('sessions');

  const currentCategoryId = extractUuidFromParam(pathname);
  const category = categories?.find((c) => c.id == currentCategoryId);

  const filteredSessions = !category
    ? sessions
    : (sessions || []).filter((s) => s.category_id == category.id);

  const filteredTasks = !category
    ? []
    : (tasks || []).filter((t) => t.category_id == category.id);

  useEffect(() => {
    if (categories == null) return;
    if (activeTab != 'tasks') return;
    if (!category) setActiveTab('sessions');
  }, [pathname]);

  return {
    activeTab,
    setActiveTab,
    categories,
    category,
    tasks,
    sessions,
    filteredSessions,
    filteredTasks,
  };
};
