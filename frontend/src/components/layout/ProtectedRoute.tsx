import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function ProtectedRoute({ requireAdmin = false }: { requireAdmin?: boolean }) {
  const session = useAuthStore((state) => state.session);
  const isAdmin = useAuthStore((state) => state.isAdmin);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
