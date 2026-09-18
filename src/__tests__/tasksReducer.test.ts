import { tasksReducer } from "../context/TasksContext";
import type { Task } from "../types";

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: "task-1",
  title: "Test task",
  description: "",
  status: "Todo",
  priority: "Medium",
  dueDate: "2026-12-31",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

const emptyState = { tasks: [], loading: false, error: null };

describe("tasksReducer", () => {
  it("LOAD_START sets loading and clears error", () => {
    const state = tasksReducer(
      { tasks: [makeTask()], loading: false, error: "old error" },
      { type: "LOAD_START" },
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.tasks).toHaveLength(1);
  });

  it("LOAD_SUCCESS replaces tasks and stops loading", () => {
    const newTasks = [makeTask({ id: "a" }), makeTask({ id: "b" })];
    const state = tasksReducer(emptyState, {
      type: "LOAD_SUCCESS",
      tasks: newTasks,
    });
    expect(state.tasks).toEqual(newTasks);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("LOAD_ERROR keeps tasks and sets error", () => {
    const existing = makeTask({ id: "existing" });
    const state = tasksReducer(
      { tasks: [existing], loading: true, error: null },
      { type: "LOAD_ERROR", error: "Network failed" },
    );
    expect(state.tasks).toEqual([existing]);
    expect(state.loading).toBe(false);
    expect(state.error).toBe("Network failed");
  });

  it("TASK_ADDED prepends the new task", () => {
    const existing = makeTask({ id: "existing" });
    const newTask = makeTask({ id: "new" });
    const state = tasksReducer(
      { tasks: [existing], loading: false, error: null },
      { type: "TASK_ADDED", task: newTask },
    );
    expect(state.tasks).toEqual([newTask, existing]);
  });

  it("TASK_UPDATED replaces the matching task only", () => {
    const a = makeTask({ id: "a", title: "Original A" });
    const b = makeTask({ id: "b", title: "Original B" });
    const updatedA = makeTask({ id: "a", title: "Updated A" });

    const state = tasksReducer(
      { tasks: [a, b], loading: false, error: null },
      { type: "TASK_UPDATED", task: updatedA },
    );

    expect(state.tasks[0]).toEqual(updatedA);
    expect(state.tasks[1]).toEqual(b);
  });

  it("TASK_DELETED removes the matching task", () => {
    const a = makeTask({ id: "a" });
    const b = makeTask({ id: "b" });
    const state = tasksReducer(
      { tasks: [a, b], loading: false, error: null },
      { type: "TASK_DELETED", id: "a" },
    );
    expect(state.tasks).toEqual([b]);
  });

  it("ROLLBACK restores the previous task list", () => {
    const original = [makeTask({ id: "a" }), makeTask({ id: "b" })];
    const state = tasksReducer(
      { tasks: [makeTask({ id: "a" })], loading: false, error: null },
      { type: "ROLLBACK", tasks: original },
    );
    expect(state.tasks).toEqual(original);
  });

  it("CLEAR empties the task list and resets flags", () => {
    const state = tasksReducer(
      { tasks: [makeTask()], loading: true, error: "boom" },
      { type: "CLEAR" },
    );
    expect(state).toEqual({ tasks: [], loading: false, error: null });
  });
});
