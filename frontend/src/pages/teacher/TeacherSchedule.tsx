import { useState, useEffect } from 'react';
import { Loader2, Calendar, Clock, Layers, Video } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function TeacherSchedule() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useAuthStore(state => state.session);

  useEffect(() => {
    if (!session) return;
    fetch(`${import.meta.env.VITE_API_URL}/teacher/schedule`, {
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    })
      .then(res => res.json())
      .then(setClasses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" /></div>;

  // Group classes by date
  const byDate: Record<string, any[]> = {};
  classes.forEach(cls => {
    const dateKey = new Date(cls.scheduledAt).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
    if (!byDate[dateKey]) byDate[dateKey] = [];
    byDate[dateKey].push(cls);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Mi Horario</h1>
        <p className="text-slate-500 text-sm">Tus próximas clases programadas, organizadas por día.</p>
      </div>

      {Object.keys(byDate).length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No tienes clases próximas programadas.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(byDate).map(([date, dateClasses]) => (
            <div key={date}>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">{date}</h3>
              <div className="space-y-3">
                {dateClasses.map(cls => (
                  <div key={cls.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#2E7D32]/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-[#2E7D32]" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{cls.title}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(cls.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            {cls.module?.level?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    {cls.url && (
                      <a href={cls.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-[#2D8CFF] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors"
                      >
                        <Video className="w-4 h-4" /> Zoom
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
