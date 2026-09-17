import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { TaskFilters, TaskPriority, TaskStatus } from '../types';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

const DEFAULTS: TaskFilters = {
  search: '',
  status: 'All',
  priority: 'All',
  dueFrom: null,
  dueTo: null,
  page: DEFAULT_PAGE,
  pageSize: DEFAULT_PAGE_SIZE,
};

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: TaskFilters = {
  search: searchParams.get('search') ?? DEFAULTS.search,
  status: (searchParams.get('status') as TaskStatus | 'All') ?? DEFAULTS.status,
  priority: (searchParams.get('priority') as TaskPriority | 'All') ?? DEFAULTS.priority,
  dueFrom: searchParams.get('dueFrom'),
  dueTo: searchParams.get('dueTo'),
  page: Number(searchParams.get('page')) || DEFAULT_PAGE,
  pageSize: Number(searchParams.get('pageSize')) || DEFAULT_PAGE_SIZE,
};

 const setFilter = useCallback(
  (key: keyof TaskFilters, value: string | number | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (value === null || value === '' || value === 'All') {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }

      return next;
    });
  },
  [setSearchParams],
);

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return { filters, setFilter, clearFilters };
}