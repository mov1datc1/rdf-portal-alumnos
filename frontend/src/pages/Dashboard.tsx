import { useState, useEffect } from 'react';
import { HeroBanner } from '../components/dashboard/HeroBanner';
import { CalendarWidget } from '../components/dashboard/CalendarWidget';
import { StatsWidget } from '../components/dashboard/StatsWidget';
import { useAuthStore } from '../store/authStore';

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <HeroBanner dashboardData={dashboardData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
        <CalendarWidget clases={clases} />
        <StatsWidget />
      </div>
    </div>
  );
}
