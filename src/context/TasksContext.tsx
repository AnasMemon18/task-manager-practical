import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import type { Task } from "../types";
import * as taskService from "../services/taskService";
import { useAuth } from "../hooks/useAuth";

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

type TasksAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; tasks: Task[] }
  | { type: "LOAD_ERROR"; error: string }
  | { type: "TASK_ADDED"; task: Task }
  | { type: "TASK_UPDATED"; task: Task }
  | { type: "TASK_DELETED"; id: string }
  | { type: "ROLLBACK"; tasks: Task[] }
  | { type: "CLEAR" };

export function tasksReducer(
  state: TasksState,
  action: TasksAction,
): TasksState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, loading: true, error: null };
    case "LOAD_SUCCESS":
      return { tasks: action.tasks, loading: false, error: null };
    case "LOAD_ERROR":
      return { ...state, loading: false, error: action.error };
    case "TASK_ADDED":
      return { ...state, tasks: [action.task, ...state.tasks] };
    case "TASK_UPDATED":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.task.id ? action.task : t,
        ),
      };
    case "TASK_DELETED":
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) };
    case "ROLLBACK":
      return { ...state, tasks: action.tasks };
    case "CLEAR":
      return { tasks: [], loading: false, error: null };
  }
}

interface TasksContextValue extends TasksState {
  loadTasks: () => void;
  addTask: (input: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  editTask: (
    id: string,
    updates: Partial<Omit<Task, "id" | "createdAt">>,
  ) => void;
  removeTask: (id: string) => void;
  setTaskStatus: (id: string, status: Task["status"]) => void;
}

export const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [state, dispatch] = useReducer(tasksReducer, {
    tasks: [],
    loading: false,
    error: null,
  });

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const loadTasks = useCallback((): void => {
    if (!user) {
      dispatch({ type: "CLEAR" });
      return;
    }
    dispatch({ type: "LOAD_START" });
    try {
      const tasks = taskService.fetchTasks(user.id);
      dispatch({ type: "LOAD_SUCCESS", tasks });
    } catch (err) {
      dispatch({ type: "LOAD_ERROR", error: (err as Error).message });
    }
  }, [user]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = useCallback(
    (input: Omit<Task, "id" | "createdAt" | "updatedAt">): void => {
      if (!user) throw new Error("Cannot add task: no user is logged in.");
      const previous = stateRef.current.tasks;
      try {
        const task = taskService.createTask(user.id, input);
        dispatch({ type: "TASK_ADDED", task });
      } catch (err) {
        dispatch({ type: "ROLLBACK", tasks: previous });
        throw err;
      }
    },
    [user],
  );

  const editTask = useCallback(
    (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>): void => {
      if (!user) throw new Error("Cannot edit task: no user is logged in.");
      const previous = stateRef.current.tasks;
      try {
        const updated = taskService.updateTask(user.id, id, updates);
        dispatch({ type: "TASK_UPDATED", task: updated });
      } catch (err) {
        dispatch({ type: "ROLLBACK", tasks: previous });
        throw err;
      }
    },
    [user],
  );

  const removeTask = useCallback(
    (id: string): void => {
      if (!user) throw new Error("Cannot remove task: no user is logged in.");
      const previous = stateRef.current.tasks;
      dispatch({ type: "TASK_DELETED", id });
      try {
        taskService.deleteTask(user.id, id);
      } catch (err) {
        dispatch({ type: "ROLLBACK", tasks: previous });
        throw err;
      }
    },
    [user],
  );

  const setTaskStatus = useCallback(
    (id: string, status: Task["status"]): void => {
      editTask(id, { status });
    },
    [editTask],
  );

  return (
    <TasksContext.Provider
      value={{
        ...state,
        loadTasks,
        addTask,
        editTask,
        removeTask,
        setTaskStatus,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
