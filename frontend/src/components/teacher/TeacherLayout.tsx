import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Calendar, Users, Layers, ClipboardCheck, Award, BookOpen } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

export function TeacherLayout() {
  const navigate = useNavigate();
  const setSession = useAuthStore(state => state.setSession);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive ? 'bg-white/10 font-bold' : 'hover:bg-white/5'}`;

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-gradient-to-b from-[#b91c1c] to-[#7f1d1d] text-white p-6 flex flex-col">
        <div className="mb-10">
          <img
            src="https://lesroisdufrancais.com/wp-content/uploads/2024/06/Copia-de-LogoFinal-01-scaled-1-2048x1151.webp"
            alt="Les Rois"
            className="w-32 object-contain filter brightness-0 invert mb-2"
          />
          <p className="text-xs text-red-200">Portal del Profesor</p>
        </div>

        <nav className="flex-1 space-y-2">
          <NavLink to="/teacher" end className={linkClass}>
            <LayoutDashboard className="w-5 h-5" />
            Mi Panel
          </NavLink>
          <NavLink to="/teacher/groups" className={linkClass}>
            <Layers className="w-5 h-5" />
            Mis Grupos
          </NavLink>
          <NavLink to="/teacher/schedule" className={linkClass}>
            <Calendar className="w-5 h-5" />
            Mi Horario
          </NavLink>
          <NavLink to="/teacher/logs" className={linkClass}>
            <BookOpen className="w-5 h-5" />
            Bitácora
          </NavLink>
          <NavLink to="/teacher/students" className={linkClass}>
            <Users className="w-5 h-5" />
            Mis Alumnos
          </NavLink>
          <NavLink to="/teacher/attendance" className={linkClass}>
            <ClipboardCheck className="w-5 h-5" />
            Asistencia
          </NavLink>
          <NavLink to="/teacher/evaluations" className={linkClass}>
            <Award className="w-5 h-5" />
            Evaluaciones
          </NavLink>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-red-300 hover:text-red-200 transition-colors mt-auto">
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
