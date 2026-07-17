import { Navigate } from 'react-router-dom';
import { useApp } from '../providers/AppProvider';

export function RequireAuth({ children }) {
  const { isLoggedIn } = useApp();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

export function RequireSuperAdmin({ children }) {
  const { isLoggedIn, isSuperAdmin } = useApp();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!isSuperAdmin) return <Navigate to="/" replace />;
  return children;
}
