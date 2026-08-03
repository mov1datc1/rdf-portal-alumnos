import { useState, useEffect } from 'react';
import { Loader2, Users, Mail, Phone, Layers } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function TeacherStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const session = useAuthStore(state => state.session);

  useEffect(() => {
    if (!session) return;
    fetch(`${import.meta.env.VITE_API_URL}/teacher/students`, {
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    })
      .then(res => res.json())
      .then(setStudents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  const filtered = students.filter(s => {
    const term = search.toLowerCase();
    return (s.firstName?.toLowerCase().includes(term) || s.lastName?.toLowerCase().includes(term) || s.email?.toLowerCase().includes(term));
  });

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Mis Alumnos</h1>
        <p className="text-slate-500 text-sm">Todos los alumnos de tus grupos asignados.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <input
          type="text" placeholder="Buscar alumno..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full border border-slate-200 rounded-xl py-2 px-4 mb-4 bg-slate-50 focus:ring-2 focus:ring-[#2E7D32]/20"
        />

        {filtered.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No se encontraron alumnos.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(s => (
              <div key={s.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2E7D32]/10 flex items-center justify-center">
                    <span className="text-[#2E7D32] font-bold text-sm">
                      {(s.firstName?.[0] || '') + (s.lastName?.[0] || '')}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{s.firstName} {s.lastName}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{s.email}</span>
                      {s.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{s.phone}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {s.currentLevel && (
                    <span className="text-xs font-bold bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      {s.currentLevel.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
