import { useState, useEffect } from 'react';
import { HeroBanner } from '../components/dashboard/HeroBanner';
import { CalendarWidget } from '../components/dashboard/CalendarWidget';
import { StatsWidget } from '../components/dashboard/StatsWidget';
import { useAuthStore } from '../store/authStore';

const DEFAULT_DASHBOARD_DATA = {
  groupName: 'Niza · Grupo 1',
  teacherName: 'Jean-Luc · Nativo',
  levelCode: 'A1 · Básico 1'
};

export function Dashboard() {
  const [clases, setClases] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const session = useAuthStore(state => state.session);

  useEffect(() => {
    if (!session?.access_token) return;

    fetch(`${import.meta.env.VITE_API_URL}/classes/upcoming`, {
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setClases(Array.isArray(data) ? data : []))
      .catch(() => setClases([]));

    fetch(`${import.meta.env.VITE_API_URL}/profile/dashboard`, {
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => setDashboardData(data))
      .catch(console.error);
  }, [session]);

  const activeClases = clases.length > 0 ? clases : [
    { scheduledAt: new Date(Date.now() + 86400000).toISOString(), title: 'Clase en Vivo: Conversación y Fonética' },
    { scheduledAt: new Date(Date.now() + 86400000 * 3).toISOString(), title: 'Taller MRAF: Diálogo en la Vida Real' },
    { scheduledAt: new Date(Date.now() + 86400000 * 6).toISOString(), title: 'Estructuras Orales y Pronunciación' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <HeroBanner dashboardData={dashboardData || DEFAULT_DASHBOARD_DATA} />
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
        <CalendarWidget clases={activeClases} />
        <StatsWidget />
      </div>
    </div>
  );
}
