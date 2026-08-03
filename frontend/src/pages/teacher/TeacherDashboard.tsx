import { useState, useEffect } from 'react';
import { Loader2, Layers, Users, Calendar, Clock, Video } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function TeacherDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const session = useAuthStore(state => state.session);

  useEffect(() => {
    if (!session) return;
    fetch(`${import.meta.env.VITE_API_URL}/teacher/dashboard`, {
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    })
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Bienvenido, Profesor 🎓</h1>
        <p className="text-slate-500 text-sm">Aquí tienes un resumen de tus grupos, alumnos y próximas clases.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D32]/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#2E7D32]" />
            </div>
            <p className="text-sm text-slate-500">Mis Grupos</p>
          </div>
          <p className="text-3xl font-bold text-slate-800">{data?.totalGroups || 0}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-slate-500">Mis Alumnos</p>
          </div>
          <p className="text-3xl font-bold text-slate-800">{data?.totalStudents || 0}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-sm text-slate-500">Clases Próximas</p>
          </div>
          <p className="text-3xl font-bold text-slate-800">{data?.upcomingClasses || 0}</p>
        </div>
      </div>

      {/* Next Class Card */}
      {data?.nextClass && (
        <div className="bg-gradient-to-r from-[#2E7D32] to-[#388E3C] rounded-2xl p-6 text-white shadow-lg">
          <p className="text-sm text-green-200 mb-1">Tu próxima clase</p>
          <h3 className="text-xl font-bold mb-2">{data.nextClass.title}</h3>
          <div className="flex items-center gap-4 text-green-100 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(data.nextClass.scheduledAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(data.nextClass.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex items-center gap-1">
              <Layers className="w-4 h-4" />
              {data.nextClass.module?.level?.name}
            </div>
          </div>
          {data.nextClass.url && (
            <a href={data.nextClass.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              <Video className="w-4 h-4" /> Ir a Zoom
            </a>
          )}
        </div>
      )}
    </div>
  );
}
