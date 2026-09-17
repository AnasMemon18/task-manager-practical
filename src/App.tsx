import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { TasksProvider } from './context/TasksContext';
import { AppRoutes } from './routes/AppRoutes';
import { theme } from './theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <TasksProvider>
          <AppRoutes />
        </TasksProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}