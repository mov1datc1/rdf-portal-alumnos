import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Users, FileText, LayoutDashboard, LogOut, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

export function AdminLayout() {
  const navigate = useNavigate();
  const setSession = useAuthStore(state => state.setSession);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-[#1D3A8A] text-white p-6 flex flex-col">
        <div className="mb-10">
          <h2 className="text-2xl font-bold">Admin RDF</h2>
          <p className="text-xs text-blue-300">Panel de Control</p>
        </div>

        <nav className="flex-1 space-y-2">
          <NavLink to="/admin" end className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive ? 'bg-white/10 font-bold' : 'hover:bg-white/5'}`}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive ? 'bg-white/10 font-bold' : 'hover:bg-white/5'}`}>
            <Users className="w-5 h-5" />
            Alumnos
          </NavLink>
          <NavLink to="/admin/resources" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive ? 'bg-white/10 font-bold' : 'hover:bg-white/5'}`}>
            <FileText className="w-5 h-5" />
            Recursos
          </NavLink>
          <NavLink to="/admin/schedule" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive ? 'bg-white/10 font-bold' : 'hover:bg-white/5'}`}>
            <Calendar className="w-5 h-5" />
            Programación
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
