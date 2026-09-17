export type TaskStatus = 'Todo' | 'In Progress' | 'Done';

export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; 
  createdAt: string; 
  updatedAt: string; 
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number; 
}

export interface TaskFilters {
  search: string;
  status: TaskStatus | 'All';
  priority: TaskPriority | 'All';
  dueFrom: string | null;
  dueTo: string | null;
  page: number;
  pageSize: number;
  view: 'list' | 'board';
}

export type TaskSortField = 'dueDate' | 'priority' | 'createdAt' | 'title';
export type SortDirection = 'asc' | 'desc';

export interface TaskSort {
  field: TaskSortField;
  direction: SortDirection;
}