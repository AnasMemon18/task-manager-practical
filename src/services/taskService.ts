import type { Task } from "../types";
import { getItem, setItem } from "./storage";

function tasksKey(userId: string): string {
  return `tasks:${userId}`;
}

function getTasks(userId: string): Task[] {
  return getItem<Task[]>(tasksKey(userId)) ?? [];
}

function saveTasks(userId: string, tasks: Task[]): void {
  setItem(tasksKey(userId), tasks);
}

export function fetchTasks(userId: string): Task[] {
  return getTasks(userId);
}

export function createTask(
  userId: string,
  input: Omit<Task, "id" | "createdAt" | "updatedAt">,
): Task {
  const now = new Date().toISOString();

  const task: Task = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  saveTasks(userId, [...getTasks(userId), task]);
  return task;
}

export function updateTask(
  userId: string,
  id: string,
  updates: Partial<Omit<Task, "id" | "createdAt">>,
): Task {
  const tasks = getTasks(userId);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new Error("Task not found.");
  }

  const existing = tasks[index]!;

  const updated: Task = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const next = [...tasks];
  next[index] = updated;
  saveTasks(userId, next);

  return updated;
}

export function deleteTask(userId: string, id: string): void {
  const tasks = getTasks(userId);
  const next = tasks.filter((t) => t.id !== id);

  if (next.length === tasks.length) {
    throw new Error("Task not found.");
  }

  saveTasks(userId, next);
}
