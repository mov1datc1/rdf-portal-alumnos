import { useState, useEffect } from 'react';
import { Users, FileText, Activity, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function AdminDashboard() {
  const [metrics, setMetrics] = useState({ activeStudents: 0, totalResources: 0, newStudents: 0 });
  const [loading, setLoading] = useState(true);
  const session = useAuthStore(state => state.session);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('http://localhost:3000/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch (error) {
        console.error('Error fetching metrics', error);
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchMetrics();
  }, [session]);
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Vista General</h1>
        <p className="text-slate-500">Bienvenido al panel de control de Les Rois.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 text-[#1D3A8A] rounded-2xl flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Alumnos Activos</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mt-1" /> : metrics.activeStudents}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-red-50 text-[#EF4444] rounded-2xl flex items-center justify-center">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Recursos Totales</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mt-1" /> : metrics.totalResources}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Nuevos (Mes)</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mt-1" /> : `+${metrics.newStudents}`}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
