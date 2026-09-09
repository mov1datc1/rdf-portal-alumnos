import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  Calendar,
  Users,
  Layers,
  ClipboardCheck,
  Award,
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

export function TeacherLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const setSession = useAuthStore(state => state.setSession);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate('/login');
  };

  const navLinks = [
    { to: '/teacher', end: true, icon: LayoutDashboard, label: 'Mi Panel' },
    { to: '/teacher/groups', end: false, icon: Layers, label: 'Mis Grupos' },
    { to: '/teacher/schedule', end: false, icon: Calendar, label: 'Mi Horario' },
    { to: '/teacher/logs', end: false, icon: BookOpen, label: 'Bitácora' },
    { to: '/teacher/students', end: false, icon: Users, label: 'Mis Alumnos' },
    { to: '/teacher/attendance', end: false, icon: ClipboardCheck, label: 'Asistencia' },
    { to: '/teacher/evaluations', end: false, icon: Award, label: 'Evaluaciones' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <img
            src="https://lesroisdufrancais.com/wp-content/uploads/2024/06/Copia-de-LogoFinal-01-scaled-1-2048x1151.webp"
            alt="Les Rois"
            className="w-32 object-contain filter brightness-0 invert mb-2"
          />
          <p className="text-xs text-red-200">Portal del Profesor</p>
        </div>
        {mobileMenuOpen && (
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10"
            aria-label="Cerrar menú"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl text-sm transition-colors ${
                  isActive ? 'bg-white/15 font-bold text-white shadow-xs' : 'text-red-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 p-3 text-red-200 hover:text-white transition-colors mt-auto border-t border-white/15 pt-4 text-sm font-semibold"
      >
        <LogOut className="w-5 h-5 flex-shrink-0" />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Top Navigation Bar */}
      <header className="md:hidden bg-[#b91c1c] text-white px-4 py-3 flex items-center justify-between shadow-md z-30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-1 text-white hover:bg-white/10 rounded-xl transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>
          <img
            src="https://lesroisdufrancais.com/wp-content/uploads/2024/06/Copia-de-LogoFinal-01-scaled-1-2048x1151.webp"
            alt="Les Rois"
            className="h-7 object-contain filter brightness-0 invert"
          />
        </div>
        <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-lg text-red-100">
          Profesor
        </span>
      </header>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-gradient-to-b from-[#b91c1c] to-[#7f1d1d] text-white p-6 flex-col flex-shrink-0 shadow-lg z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-gradient-to-b from-[#b91c1c] to-[#7f1d1d] text-white p-6 flex flex-col z-10 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
