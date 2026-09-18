import type { Task } from "../types";

export function isOverdue(task: Task): boolean {
  if (task.status === "Done") return false;

  const due = new Date(task.dueDate);
  due.setHours(23, 59, 59, 999); // end of due day

  return Date.now() > due.getTime();
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
