import { useContext } from "react";
import { TasksContext } from "../context/TasksContext";

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === null) {
    throw new Error("useTasks must be used inside <TasksProvider>.");
  }
  return context;
}
