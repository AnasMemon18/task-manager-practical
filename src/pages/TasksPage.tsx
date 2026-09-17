import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export function TasksPage() {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
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
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your task dashboard will appear here.
        </Typography>
      </Container>
    </Box>
  );
}