import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ChatbotPanel } from '../chatbot/ChatbotPanel';
import { Menu } from 'lucide-react';

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-800">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-xs z-30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-1 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>
          <img 
            src="https://lesroisdufrancais.com/wp-content/uploads/2024/06/Copia-de-LogoFinal-01-scaled-1-2048x1151.webp" 
            alt="Les Rois" 
            className="h-7 object-contain" 
          />
        </div>
        <span className="text-xs font-bold bg-red-50 text-[#EF4444] px-2.5 py-1 rounded-lg">
          Alumno
        </span>
      </header>

      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <main className="flex-1 md:ml-64 p-4 sm:p-6 md:p-8 relative overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
        <ChatbotPanel />
      </main>
    </div>
  );
}
