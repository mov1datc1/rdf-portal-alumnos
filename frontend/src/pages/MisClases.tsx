import { useState, useEffect } from 'react';
import { CalendarWidget } from '../components/dashboard/CalendarWidget';
import { Video, Calendar, Clock, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function MisClases() {
  const [clases, setClases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useAuthStore(state => state.session);

  useEffect(() => {
    if (!session?.access_token) return;

    fetch('http://localhost:3000/classes/upcoming', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setClases(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching classes:', err);
        setLoading(false);
      });
  }, [session]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#1D3A8A] rounded-3xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Mis Clases</h1>
        <p className="text-blue-200 text-sm max-w-2xl">
          Gestiona tus sesiones en vivo y repasa el historial de clases pasadas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-gray-100 pb-4">
            Próximas Sesiones (Desde Backend)
          </h2>
          
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 text-[#1D3A8A] animate-spin" />
              </div>
            ) : clases.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No hay clases programadas.</div>
            ) : (
              clases.map((clase) => (
                <div key={clase.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 text-[#EF4444] rounded-xl flex items-center justify-center">
                      <Video className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#EF4444] uppercase tracking-wider">Clase en Vivo</span>
                      <h3 className="font-bold text-slate-800">{clase.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3"/> 
                          {new Date(clase.scheduledAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3"/> 
                          {new Date(clase.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <a 
                    href={clase.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-[#1D3A8A] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-800 transition-colors"
                  >
                    Unirse
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <CalendarWidget />
        </div>
      </div>
    </div>
  );
}
