import { useState, useEffect } from 'react';
import { Loader2, Layers, Users, Clock, Video } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function TeacherGroups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useAuthStore(state => state.session);

  useEffect(() => {
    if (!session) return;
    fetch(`${import.meta.env.VITE_API_URL}/teacher/groups`, {
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    })
      .then(res => res.json())
      .then(setGroups)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Mis Grupos</h1>
        <p className="text-slate-500 text-sm">Los grupos que tienes asignados con sus alumnos y horarios.</p>
      </div>

      {groups.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No tienes grupos asignados aún.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groups.map(g => (
            <div key={g.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{g.name}</h3>
                  <span className="text-xs font-bold bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-0.5 rounded-full">
                    {g.levelCode}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-bold text-slate-700">{g._count?.users || 0} alumnos</span>
                </div>
              </div>

              {g.schedule && (
                <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {g.schedule}
                </div>
              )}

              {g.zoomLink && (
                <a href={g.zoomLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#2D8CFF] hover:underline">
                  <Video className="w-4 h-4" /> Abrir Zoom
                </a>
              )}

              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-400">Módulos: {g.modules?.length || 0} unidades</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
