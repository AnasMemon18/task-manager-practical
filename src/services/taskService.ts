import type { Task } from '../types';
import { getItem, setItem } from './storage';

const TASKS_KEY = 'tasks';

function getTasks(): Task[] {
  return getItem<Task[]>(TASKS_KEY) ?? [];
}

function saveTasks(tasks: Task[]): void {
  setItem(TASKS_KEY, tasks);
}

export function fetchTasks(): Task[] {
  return getTasks();
}

export function createTask(input: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
  const now = new Date().toISOString();

  const task: Task = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  saveTasks([...getTasks(), task]);
  return task;
}

export function updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new Error('Task not found.');
  }

  const existing = tasks[index]!;

  const updated: Task = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const next = [...tasks];
  next[index] = updated;
  saveTasks(next);

  return updated;
}

export function deleteTask(id: string): void {
  const tasks = getTasks();
  const next = tasks.filter((t) => t.id !== id);

  if (next.length === tasks.length) {
    throw new Error('Task not found.');
  }

  saveTasks(next);
}