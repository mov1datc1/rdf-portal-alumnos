import { useState, useEffect } from 'react';
import { Loader2, Award, Check, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { showSuccess, showError } from '../../utils/alerts';

export function TeacherEvaluations() {
  const [groups, setGroups] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useAuthStore(state => state.session);

  const [formData, setFormData] = useState({
    userId: '', levelId: '', oralScore: '', writtenScore: '', notes: '',
  });

  useEffect(() => {
    if (!session) return;
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/teacher/groups`, { headers: { 'Authorization': `Bearer ${session.access_token}` } }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/teacher/students`, { headers: { 'Authorization': `Bearer ${session.access_token}` } }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/teacher/evaluations`, { headers: { 'Authorization': `Bearer ${session.access_token}` } }).then(r => r.json()),
    ])
      .then(([g, s, e]) => { setGroups(g); setStudents(s); setEvaluations(e); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/teacher/evaluations`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ userId: '', levelId: '', oralScore: '', writtenScore: '', notes: '' });
        const updated = await fetch(`${import.meta.env.VITE_API_URL}/teacher/evaluations`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        }).then(r => r.json());
        setEvaluations(updated);
        showSuccess('Evaluación guardada exitosamente');
      } else {
        const error = await res.json();
        showError('Error al guardar', error.message);
      }
    } catch (err) {
      console.error(err);
      showError('Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Evaluaciones</h1>
        <p className="text-slate-500 text-sm">Registra los scores de exámenes orales y escritos de tus alumnos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#2E7D32]" /> Nueva Evaluación
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Alumno</label>
              <select required value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})}
                className="w-full border border-slate-200 rounded-xl py-2 px-3 bg-slate-50">
                <option value="">Selecciona alumno...</option>
                {students.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.email})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Grupo / Nivel</label>
              <select required value={formData.levelId} onChange={e => setFormData({...formData, levelId: e.target.value})}
                className="w-full border border-slate-200 rounded-xl py-2 px-3 bg-slate-50">
                <option value="">Selecciona grupo...</option>
                {groups.map((g: any) => (
                  <option key={g.id} value={g.id}>{g.name} ({g.levelCode})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Score Oral (0-100)</label>
                <input required type="number" min="0" max="100"
                  value={formData.oralScore} onChange={e => setFormData({...formData, oralScore: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl py-2 px-3 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Score Escrito <span className="text-slate-400 text-xs">(opcional)</span></label>
                <input type="number" min="0" max="100"
                  value={formData.writtenScore} onChange={e => setFormData({...formData, writtenScore: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl py-2 px-3 bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Notas</label>
              <textarea rows={2}
                value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
                className="w-full border border-slate-200 rounded-xl py-2 px-3 bg-slate-50 text-sm"
                placeholder="Comentarios sobre el desempeño..."
              />
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-bold text-white bg-[#2E7D32] hover:bg-green-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Award className="w-5 h-5" />}
              Registrar Evaluación
            </button>
          </form>
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Historial</h2>

          {evaluations.length === 0 ? (
            <p className="text-slate-500 text-center py-8 text-sm">No hay evaluaciones registradas aún.</p>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {evaluations.map((ev: any) => (
                <div key={ev.id} className="border border-slate-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-slate-800 text-sm">{ev.user?.firstName} {ev.user?.lastName}</p>
                    {ev.passed ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Aprobado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                        <X className="w-3 h-3" /> No Aprobado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{ev.level?.name} ({ev.level?.levelCode})</p>
                  <div className="flex gap-4 mt-2 text-xs text-slate-600">
                    <span>Oral: <strong>{ev.oralScore ?? '—'}</strong></span>
                    <span>Escrito: <strong>{ev.writtenScore ?? '—'}</strong></span>
                  </div>
                  {ev.notes && <p className="text-xs text-slate-400 mt-1 italic">"{ev.notes}"</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
