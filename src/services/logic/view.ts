import { TaskRelations } from '@/types/models/task';
import { CategoryGet } from '@/types/models/category';
import { getRegionalDate } from '@/utilities/formatters/date';
import { TIME_FORMAT } from '@/data/constants';
import { areSameDay, deduplicateDates } from '@/utilities/helpers/time';

export type GroupedReturnType = {
  id: string;
  title: string;
  tasks: TaskRelations[];
  color?: string;
};

export const getTasksCategorized = (params: {
  tasks: TaskRelations[];
  categories: CategoryGet[];
}): GroupedReturnType[] => {
  const incompleteTasks = params.tasks.filter((t) => !t.complete);

  const tasksCategorized = params.categories.map((category) => {
    return {
      id: category.id,
      title: category.title,
      tasks: incompleteTasks.filter((task) => task.category_id == category.id),
    };
  });

  return tasksCategorized.filter((c) => c.tasks.length);
};

export const getTasksByDate = (params: {
  tasks: TaskRelations[];
}): GroupedReturnType[] => {
  const incompleteTasks = params.tasks.filter((t) => !t.complete);
  const tasksDue = incompleteTasks.filter((t) => t.created_at);

  const uniqueDueDates: Date[] = deduplicateDates(
    tasksDue.map((t) => {
      return new Date(t.created_at);
    })
  );

  // return all tasks with the same due date
  const tasksByDate = uniqueDueDates.map((date) => {
    const dateObj = new Date(date);

    return {
      id: dateObj.toISOString(),
      title: getRegionalDate(dateObj, {
        format: 'full',
        locale: TIME_FORMAT.LOCALE,
      }).date,
      tasks: incompleteTasks.filter((task) => {
        if (task.created_at) {
          return areSameDay(new Date(task.created_at as Date), dateObj);
        } else {
          return false;
        }
      }),
    };
  });

  return tasksByDate.filter((t) => t.tasks.length);
};
