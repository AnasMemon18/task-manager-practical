import { renderHook } from '@testing-library/react';
import { useFilteredTasks } from '../hooks/useFilteredTasks';
import type { Task, TaskFilters, TaskSort } from '../types';

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: 'task-1',
  title: 'Test task',
  description: '',
  status: 'Todo',
  priority: 'Medium',
  dueDate: '2026-12-31',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

const defaultFilters: TaskFilters = {
  search: '',
  status: 'All',
  priority: 'All',
  dueFrom: null,
  dueTo: null,
  page: 1,
  pageSize: 10,
  view: 'list',
};

const defaultSort: TaskSort = { field: 'createdAt', direction: 'desc' };

describe('useFilteredTasks', () => {
  it('returns all tasks when no filters are active', () => {
    const tasks = [makeTask({ id: 'a' }), makeTask({ id: 'b' }), makeTask({ id: 'c' })];
    const { result } = renderHook(() => useFilteredTasks(tasks, defaultFilters, defaultSort));

    expect(result.current.totalFiltered).toBe(3);
    expect(result.current.pageTasks).toHaveLength(3);
  });

  it('filters by search across title and description', () => {
    const tasks = [
      makeTask({ id: 'a', title: 'Read a book' }),
      makeTask({ id: 'b', title: 'Workout', description: 'read the manual' }),
      makeTask({ id: 'c', title: 'Sleep', description: 'unrelated' }),
    ];
    const filters = { ...defaultFilters, search: 'read' };
    const { result } = renderHook(() => useFilteredTasks(tasks, filters, defaultSort));

    expect(result.current.totalFiltered).toBe(2);
    expect(result.current.pageTasks.map((t) => t.id)).toEqual(
      expect.arrayContaining(['a', 'b']),
    );
  });

  it('filters by status', () => {
    const tasks = [
      makeTask({ id: 'a', status: 'Todo' }),
      makeTask({ id: 'b', status: 'In Progress' }),
      makeTask({ id: 'c', status: 'Done' }),
    ];
    const filters = { ...defaultFilters, status: 'In Progress' as const };
    const { result } = renderHook(() => useFilteredTasks(tasks, filters, defaultSort));

    expect(result.current.totalFiltered).toBe(1);
    expect(result.current.pageTasks[0]?.id).toBe('b');
  });

  it('filters by due date range inclusively', () => {
    const tasks = [
      makeTask({ id: 'a', dueDate: '2026-01-15' }),
      makeTask({ id: 'b', dueDate: '2026-02-15' }),
      makeTask({ id: 'c', dueDate: '2026-03-15' }),
    ];
    const filters = { ...defaultFilters, dueFrom: '2026-02-01', dueTo: '2026-02-28' };
    const { result } = renderHook(() => useFilteredTasks(tasks, filters, defaultSort));

    expect(result.current.totalFiltered).toBe(1);
    expect(result.current.pageTasks[0]?.id).toBe('b');
  });

  it('sorts by priority descending (high first)', () => {
    const tasks = [
      makeTask({ id: 'a', priority: 'Low' }),
      makeTask({ id: 'b', priority: 'High' }),
      makeTask({ id: 'c', priority: 'Medium' }),
    ];
    const sort: TaskSort = { field: 'priority', direction: 'desc' };
    const { result } = renderHook(() => useFilteredTasks(tasks, defaultFilters, sort));

    expect(result.current.pageTasks.map((t) => t.priority)).toEqual(['High', 'Medium', 'Low']);
  });

  it('paginates to the requested page', () => {
    const tasks = Array.from({ length: 12 }, (_, i) => makeTask({ id: `task-${i}` }));
    const filters = { ...defaultFilters, page: 2, pageSize: 5 };
    const { result } = renderHook(() => useFilteredTasks(tasks, filters, defaultSort));

    expect(result.current.totalFiltered).toBe(12);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.pageTasks).toHaveLength(5);
  });

  it('clamps page to totalPages when filters reduce results', () => {
    const tasks = [makeTask({ id: 'only-one' })];
    const filters = { ...defaultFilters, page: 5, pageSize: 10 };
    const { result } = renderHook(() => useFilteredTasks(tasks, filters, defaultSort));

    expect(result.current.totalPages).toBe(1);
    expect(result.current.pageTasks).toHaveLength(1);
  });
});