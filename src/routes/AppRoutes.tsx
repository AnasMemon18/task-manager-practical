import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { PublicOnlyRoute } from '../components/auth/PublicOnlyRoute';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { TasksPage } from '../pages/TasksPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Root — let the guards decide where to send the user */}
      <Route path="/" element={<Navigate to="/tasks" replace />} />

      {/* Public-only: logged-in users get redirected away */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Protected: unauthenticated users get redirected to /login */}
      <Route element={<ProtectedRoute />}>
        <Route path="/tasks" element={<TasksPage />} />
      </Route>

      {/* Catch-all, anything unknown goes to root, which then routes correctly */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}