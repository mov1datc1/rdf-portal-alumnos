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
import { Perfil } from './pages/Perfil';

import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UsersManager } from './pages/admin/UsersManager';
import { GroupsManager } from './pages/admin/GroupsManager';
import { ResourcesManager } from './pages/admin/ResourcesManager';
import { ScheduleManager } from './pages/admin/ScheduleManager';
import { ZoomHostsManager } from './pages/admin/ZoomHostsManager';
import { CRMManager } from './pages/admin/CRMManager';
import { SettingsManager } from './pages/admin/SettingsManager';
import { PaymentsManager } from './pages/admin/PaymentsManager';
import { Analytics360 } from './pages/admin/Analytics360';

import { TeacherLayout } from './components/teacher/TeacherLayout';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TeacherGroups } from './pages/teacher/TeacherGroups';
import { TeacherSchedule } from './pages/teacher/TeacherSchedule';
import { TeacherStudents } from './pages/teacher/TeacherStudents';
import { TeacherAttendance } from './pages/teacher/TeacherAttendance';
import { TeacherEvaluations } from './pages/teacher/TeacherEvaluations';

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
            <Route path="perfil" element={<Perfil />} />
          </Route>
        </Route>

        {/* Rutas Protegidas para Administradores */}
        <Route element={<ProtectedRoute requireAdmin={true} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersManager />} />
            <Route path="groups" element={<GroupsManager />} />
            <Route path="resources" element={<ResourcesManager />} />
            <Route path="schedule" element={<ScheduleManager />} />
            <Route path="zoom" element={<ZoomHostsManager />} />
            <Route path="crm" element={<CRMManager />} />
            <Route path="payments" element={<PaymentsManager />} />
            <Route path="analytics" element={<Analytics360 />} />
            <Route path="settings" element={<SettingsManager />} />
          </Route>
        </Route>

        {/* Rutas Protegidas para Profesores */}
        <Route element={<ProtectedRoute requireTeacher={true} />}>
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="groups" element={<TeacherGroups />} />
            <Route path="schedule" element={<TeacherSchedule />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="evaluations" element={<TeacherEvaluations />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
