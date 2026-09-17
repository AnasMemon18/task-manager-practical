import { useEffect, useState } from 'react';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';

export function TasksPage() {
  const { user, logout } = useAuth();
  const { tasks, loading, error, loadTasks } = useTasks();
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top bar */}
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

      {/* Main content */}
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
            onClick={() => setFormOpen(true)}
          >
            New Task
          </Button>
        </Box>

        {/* Placeholder — this will become the task list */}
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderRadius: 1,
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <Typography color="text.secondary">
            Task list will appear here.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {loading ? 'Loading…' : `Total tasks: ${tasks.length}`}
            {error ? ` — Error: ${error}` : ''}
          </Typography>
        </Box>
      </Container>

      {/* Form dialog placeholder — will be replaced in the next file */}
      {formOpen && (
        <Box sx={{ display: 'none' }} data-testid="form-dialog-placeholder" />
      )}
    </Box>
  );
}