import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Calendar, Clock, BarChart2, Headphones, Video, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { icon: Home, label: 'Inicio', path: '/' },
  { icon: Calendar, label: 'Mis Clases', path: '/clases' },
  { icon: Clock, label: 'Progreso', path: '/progreso' },
  { icon: BarChart2, label: 'Estadísticas', path: '/estadisticas' },
  { icon: Headphones, label: 'Recursos', path: '/recursos' },
  { icon: Video, label: 'Video Francés', path: '/video' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const setSession = useAuthStore(state => state.setSession);
  const user = useAuthStore(state => state.user);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white min-h-screen border-r border-gray-100 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-3">
          {/* Placeholder for Logo */}
          <div className="w-8 h-8 bg-[#1D3A8A] rounded-md flex items-center justify-center text-white font-bold text-xs">
            RDF
          </div>
          <div>
            <h1 className="text-[#1D3A8A] font-bold leading-tight">Les Rois<br/>Du Français</h1>
            <p className="text-[#EF4444] text-[10px] font-bold uppercase tracking-wider mt-1">Portal de Alumnos</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors',
                isActive
                  ? 'bg-red-50 text-[#EF4444]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mb-4 mt-auto space-y-4">
        <div className="bg-[#1D3A8A] rounded-2xl p-5 text-white shadow-lg">
          <p className="text-xs text-blue-200 mb-1">Experiencia digital moderna</p>
          <h3 className="font-bold mb-2">Portal Académico</h3>
          <p className="text-xs text-blue-100/80 leading-relaxed">
            Clases en vivo, grabadas, recursos, chatbot y seguimiento real del alumno.
          </p>
        </div>
        
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between px-2">
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.user_metadata?.firstName || 'Alumno'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
