import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  requireTeacher?: boolean;
}

export function ProtectedRoute({ requireAdmin = false, requireTeacher = false }: ProtectedRouteProps) {
  const session = useAuthStore((state) => state.session);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const isTeacher = useAuthStore((state) => state.isTeacher);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Admin-required route
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Teacher-required route
  if (requireTeacher && !isTeacher) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect admins to admin panel if they hit student routes
  if (!requireAdmin && !requireTeacher && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Redirect teachers to teacher panel if they hit student routes
  if (!requireAdmin && !requireTeacher && isTeacher) {
    return <Navigate to="/teacher" replace />;
  }

  return <Outlet />;
}
