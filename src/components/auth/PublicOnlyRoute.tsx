import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

export function PublicOnlyRoute() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (user) {
    return <Navigate to="/tasks" replace />;
  }

  return <Outlet />;
}