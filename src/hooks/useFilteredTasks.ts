import { useMemo } from 'react';
import type { Task, TaskFilters, TaskSort } from '../types';

interface UseFilteredTasksResult {
  pageTasks: Task[];
  totalFiltered: number;
  totalPages: number;
}

export function useFilteredTasks(
  tasks: Task[],
  filters: TaskFilters,
  sort: TaskSort,
): UseFilteredTasksResult {
  return useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    const filtered = tasks.filter((task) => {
      if (search) {
        const matchesTitle = task.title.toLowerCase().includes(search);
        const matchesDescription = task.description.toLowerCase().includes(search);
        if (!matchesTitle && !matchesDescription) return false;
      }

      if (filters.status !== 'All' && task.status !== filters.status) return false;
      if (filters.priority !== 'All' && task.priority !== filters.priority) return false;

      if (filters.dueFrom && task.dueDate < filters.dueFrom) return false;
      if (filters.dueTo && task.dueDate > filters.dueTo) return false;

      return true;
    });

    const sorted = [...filtered].sort((a, b) => compareTasks(a, b, sort));

    const totalFiltered = sorted.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / filters.pageSize));
    const safePage = Math.min(filters.page, totalPages);

    const start = (safePage - 1) * filters.pageSize;
    const pageTasks = sorted.slice(start, start + filters.pageSize);

    return { pageTasks, totalFiltered, totalPages };
  }, [tasks, filters, sort]);
}

const PRIORITY_ORDER: Record<Task['priority'], number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

function compareTasks(a: Task, b: Task, sort: TaskSort): number {
  const dir = sort.direction === 'asc' ? 1 : -1;

  switch (sort.field) {
    case 'dueDate':
      return a.dueDate.localeCompare(b.dueDate) * dir;

    case 'priority':
      return (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]) * dir;

    case 'title':
      return a.title.localeCompare(b.title) * dir;

    case 'createdAt':
      return a.createdAt.localeCompare(b.createdAt) * dir;
  }
}