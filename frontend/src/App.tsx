import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/authStore';

import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { MisClases } from './pages/MisClases';
import { Progreso } from './pages/Progreso';
import { Estadisticas } from './pages/Estadisticas';
import { Recursos } from './pages/Recursos';
import { VideoFrances } from './pages/VideoFrances';

import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UsersManager } from './pages/admin/UsersManager';
import { ResourcesManager } from './pages/admin/ResourcesManager';
import { ScheduleManager } from './pages/admin/ScheduleManager';

function App() {
  const setSession = useAuthStore((state) => state.setSession);
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setSession, setUser]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Cargando...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Rutas Protegidas para Alumnos */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="clases" element={<MisClases />} />
            <Route path="progreso" element={<Progreso />} />
            <Route path="estadisticas" element={<Estadisticas />} />
            <Route path="recursos" element={<Recursos />} />
            <Route path="video" element={<VideoFrances />} />
          </Route>
        </Route>

        {/* Rutas Protegidas para Administradores */}
        <Route element={<ProtectedRoute requireAdmin={true} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersManager />} />
            <Route path="resources" element={<ResourcesManager />} />
            <Route path="schedule" element={<ScheduleManager />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
