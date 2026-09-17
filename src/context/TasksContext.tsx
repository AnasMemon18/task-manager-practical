import { createContext, useReducer, type ReactNode } from 'react';
import type { Task } from '../types';
import * as taskService from '../services/taskService';

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

type TasksAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; tasks: Task[] }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'TASK_ADDED'; task: Task }
  | { type: 'TASK_UPDATED'; task: Task }
  | { type: 'TASK_DELETED'; id: string }
  | { type: 'ROLLBACK'; tasks: Task[] };

export function tasksReducer(state: TasksState, action: TasksAction): TasksState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };

    case 'LOAD_SUCCESS':
      return { tasks: action.tasks, loading: false, error: null };

    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.error };

    case 'TASK_ADDED':
      return { ...state, tasks: [action.task, ...state.tasks] };

    case 'TASK_UPDATED':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.task.id ? action.task : t)),
      };

    case 'TASK_DELETED':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) };

    case 'ROLLBACK':
      return { ...state, tasks: action.tasks };
  }
}

interface TasksContextValue extends TasksState {
  loadTasks: () => void;
  addTask: (input: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  removeTask: (id: string) => void;
  setTaskStatus: (id: string, status: Task['status']) => void;
}

export const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tasksReducer, {
    tasks: [],
    loading: false,
    error: null,
  });

  function loadTasks(): void {
    dispatch({ type: 'LOAD_START' });
    try {
      const tasks = taskService.fetchTasks();
      dispatch({ type: 'LOAD_SUCCESS', tasks });
    } catch (err) {
      dispatch({ type: 'LOAD_ERROR', error: (err as Error).message });
    }
  }

  function addTask(input: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): void {
    const previous = state.tasks;
    try {
      const task = taskService.createTask(input);
      dispatch({ type: 'TASK_ADDED', task });
    } catch (err) {
      dispatch({ type: 'ROLLBACK', tasks: previous });
      throw err;
    }
  }

  function editTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): void {
    const previous = state.tasks;
    try {
      const updated = taskService.updateTask(id, updates);
      dispatch({ type: 'TASK_UPDATED', task: updated });
    } catch (err) {
      dispatch({ type: 'ROLLBACK', tasks: previous });
      throw err;
    }
  }

  function removeTask(id: string): void {
    const previous = state.tasks;
    dispatch({ type: 'TASK_DELETED', id });
    try {
      taskService.deleteTask(id);
    } catch (err) {
      dispatch({ type: 'ROLLBACK', tasks: previous });
      throw err;
    }
  }

  function setTaskStatus(id: string, status: Task['status']): void {
    editTask(id, { status });
  }

  return (
    <TasksContext.Provider
      value={{ ...state, loadTasks, addTask, editTask, removeTask, setTaskStatus }}
    >
      {children}
    </TasksContext.Provider>
  );
}