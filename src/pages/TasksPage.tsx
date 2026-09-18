import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { TaskList } from "../components/tasks/TaskList";
import { TaskBoard } from "../components/tasks/TaskBoard";
import { TaskForm } from "../components/tasks/TaskForm";
import { LoadingState } from "../components/ui/LoadingState";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import type { Task } from "../types";
import type { TaskFormValues } from "../utils/validation";

type ViewMode = "list" | "board";

type FormState =
  | { open: false }
  | { open: true; mode: "create" }
  | { open: true; mode: "edit"; task: Task };

export function TasksPage() {
  const { user, logout } = useAuth();
  const {
    tasks,
    loading,
    error,
    loadTasks,
    addTask,
    editTask,
    removeTask,
    setTaskStatus,
  } = useTasks();

  const [view, setView] = useState<ViewMode>("list");
  const [formState, setFormState] = useState<FormState>({ open: false });
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  function handleFormSubmit(values: TaskFormValues): void {
    if (formState.open && formState.mode === "edit") {
      editTask(formState.task.id, values);
    } else {
      addTask(values);
    }
    setFormState({ open: false });
  }

  function handleDeleteConfirm(): void {
    if (taskToDelete) {
      removeTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  }

  const openCreateForm = (): void =>
    setFormState({ open: true, mode: "create" });
  const openEditForm = (task: Task): void =>
    setFormState({ open: true, mode: "edit", task });
  const openDeleteDialog = (task: Task): void => setTaskToDelete(task);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
            {user?.name}
          </Typography>
          <Button color="inherit" onClick={logout}>
            Log out
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h1">
            Tasks
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_e, nextView: ViewMode | null) => {
                if (nextView !== null) setView(nextView);
              }}
              size="small"
              aria-label="View mode"
            >
              <ToggleButton value="list" aria-label="List view">
                <ViewListIcon fontSize="small" sx={{ mr: 1 }} />
                List
              </ToggleButton>
              <ToggleButton value="board" aria-label="Board view">
                <ViewKanbanIcon fontSize="small" sx={{ mr: 1 }} />
                Board
              </ToggleButton>
            </ToggleButtonGroup>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreateForm}
            >
              New Task
            </Button>
          </Box>
        </Box>

        {loading && <LoadingState message="Loading tasks…" />}

        {!loading && error && (
          <ErrorState message={error} onRetry={loadTasks} />
        )}

        {!loading && !error && tasks.length === 0 && (
          <EmptyState
            title="No tasks yet"
            description="Click the “New Task” button to create your first task."
          />
        )}

        {!loading && !error && tasks.length > 0 && view === "list" && (
          <TaskList
            tasks={tasks}
            onEdit={openEditForm}
            onDelete={openDeleteDialog}
          />
        )}

        {!loading && !error && tasks.length > 0 && view === "board" && (
          <TaskBoard
            tasks={tasks}
            onEdit={openEditForm}
            onDelete={openDeleteDialog}
            onStatusChange={setTaskStatus}
          />
        )}
      </Container>

      <TaskForm
        open={formState.open}
        mode={formState.open ? formState.mode : "create"}
        task={
          formState.open && formState.mode === "edit"
            ? formState.task
            : undefined
        }
        onSubmit={handleFormSubmit}
        onClose={() => setFormState({ open: false })}
      />

      <ConfirmDialog
        open={taskToDelete !== null}
        title="Delete this task?"
        message={
          taskToDelete
            ? `"${taskToDelete.title}" will be permanently deleted.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setTaskToDelete(null)}
      />
    </Box>
  );
}
