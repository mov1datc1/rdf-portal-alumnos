import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Calendar, Clock, BarChart2, Headphones, Video, LogOut, Settings, X } from 'lucide-react';
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
  { icon: Settings, label: 'Mi Perfil', path: '/perfil' },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const navigate = useNavigate();
  const setSession = useAuthStore(state => state.setSession);
  const user = useAuthStore(state => state.user);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate('/login');
  };

  const content = (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center justify-between">
        <img 
          src="https://lesroisdufrancais.com/wp-content/uploads/2024/06/Copia-de-LogoFinal-01-scaled-1-2048x1151.webp" 
          alt="Les Rois Du Français" 
          className="w-40 object-contain" 
        />
        {mobileOpen && onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 mt-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onCloseMobile}
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

      <div className="p-4 mb-2 mt-auto space-y-4">
        <div className="bg-[#1D3A8A] rounded-2xl p-4 text-white shadow-md">
          <p className="text-[11px] text-blue-200 mb-0.5 font-medium">Experiencia digital moderna</p>
          <h3 className="font-bold text-sm mb-1">Portal Académico</h3>
          <p className="text-[11px] text-blue-100/80 leading-relaxed">
            Clases en vivo, grabadas, recursos y seguimiento real.
          </p>
        </div>
        
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between px-2">
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.user_metadata?.firstName || 'Alumno'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-white min-h-screen border-r border-gray-100 flex-col fixed left-0 top-0 z-20 shadow-xs">
        {content}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile} 
          />
          <aside className="relative w-72 max-w-[85vw] bg-white text-slate-800 flex flex-col z-10 shadow-2xl h-full">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
