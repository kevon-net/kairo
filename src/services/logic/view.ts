import { Priority } from '@generated/prisma';
import { getPriorityColor } from '@/services/logic/priorityColor';
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

export const getTasksPrioritized = (params: {
  tasks: TaskRelations[];
}): GroupedReturnType[] => {
  const incompleteTasks = params.tasks.filter((t) => !t.complete);

  const priority1 = incompleteTasks.filter(
    (t) => t.priority == Priority.URGENT_IMPORTANT
  );
  const priority2 = incompleteTasks.filter(
    (t) => t.priority == Priority.URGENT_UNIMPORTANT
  );
  const priority3 = incompleteTasks.filter(
    (t) => t.priority == Priority.NOT_URGENT_IMPORTANT
  );
  const priority4 = incompleteTasks.filter(
    (t) => t.priority == Priority.NOT_URGENT_UNIMPORTANT
  );

  const tasksPrioritized = [
    {
      id: Priority.URGENT_IMPORTANT,
      title: 'Priority I',
      tasks: priority1,
      color: getPriorityColor(priority1[0]?.priority),
    },
    {
      id: Priority.URGENT_UNIMPORTANT,
      title: 'Priority II',
      tasks: priority2,
      color: getPriorityColor(priority2[0]?.priority),
    },
    {
      id: Priority.NOT_URGENT_IMPORTANT,
      title: 'Priority III',
      tasks: priority3,
      color: getPriorityColor(priority3[0]?.priority),
    },
    {
      id: Priority.NOT_URGENT_UNIMPORTANT,
      title: 'Priority IV',
      tasks: priority4,
      color: getPriorityColor(priority4[0]?.priority),
    },
  ];

  return tasksPrioritized.filter((p) => p.tasks.length);
};

export const getTasksByDate = (params: {
  tasks: TaskRelations[];
}): GroupedReturnType[] => {
  const incompleteTasks = params.tasks.filter((t) => !t.complete);
  const tasksDue = incompleteTasks.filter(
    (t) => t.due_date || t.reminders.length
  );

  const uniqueDueDates: Date[] = deduplicateDates(
    tasksDue.map((t) => {
      return new Date(t.due_date || t.reminders[0].remind_at);
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
        if (task.due_date || task?.reminders.length) {
          return areSameDay(
            new Date(
              (task.due_date || (task?.reminders || [])[0].remind_at) as Date
            ),
            dateObj
          );
        } else {
          return false;
        }
      }),
    };
  });

  return tasksByDate.filter((t) => t.tasks.length);
};
