import { useEffect, useState } from 'react';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import type { Task } from '../types';
import type { TaskFormValues } from '../utils/validation';

type FormState =
  | { open: false }
  | { open: true; mode: 'create' }
  | { open: true; mode: 'edit'; task: Task };

export function TasksPage() {
  const { user, logout } = useAuth();
  const { tasks, loading, error, loadTasks, addTask, editTask, removeTask } = useTasks();

  const [formState, setFormState] = useState<FormState>({ open: false });
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  function handleFormSubmit(values: TaskFormValues): void {
    if (formState.open && formState.mode === 'edit') {
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Tasks
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormState({ open: true, mode: 'create' })}
          >
            New Task
          </Button>
        </Box>

        {loading && <LoadingState message="Loading tasks…" />}

        {!loading && error && <ErrorState message={error} onRetry={loadTasks} />}

        {!loading && !error && tasks.length === 0 && (
          <EmptyState
            title="No tasks yet"
            description="Create your first task to get started."
            action={
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setFormState({ open: true, mode: 'create' })}
              >
                New Task
              </Button>
            }
          />
        )}

        {!loading && !error && tasks.length > 0 && (
          <TaskList
            tasks={tasks}
            onEdit={(task) => setFormState({ open: true, mode: 'edit', task })}
            onDelete={(task) => setTaskToDelete(task)}
          />
        )}
      </Container>

      <TaskForm
        open={formState.open}
        mode={formState.open ? formState.mode : 'create'}
        task={formState.open && formState.mode === 'edit' ? formState.task : undefined}
        onSubmit={handleFormSubmit}
        onClose={() => setFormState({ open: false })}
      />

      <ConfirmDialog
        open={taskToDelete !== null}
        title="Delete this task?"
        message={
          taskToDelete
            ? `"${taskToDelete.title}" will be permanently deleted.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setTaskToDelete(null)}
      />
    </Box>
  );
}