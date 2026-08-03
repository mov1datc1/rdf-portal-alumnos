import { useState, useEffect } from 'react';
import { Loader2, ClipboardCheck, Check, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function TeacherAttendance() {
  const [, setGroups] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const session = useAuthStore(state => state.session);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [attendees, setAttendees] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!session) return;
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/teacher/groups`, { headers: { 'Authorization': `Bearer ${session.access_token}` } }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/teacher/schedule`, { headers: { 'Authorization': `Bearer ${session.access_token}` } }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/teacher/students`, { headers: { 'Authorization': `Bearer ${session.access_token}` } }).then(r => r.json()),
    ])
      .then(([g, s, st]) => { setGroups(g); setSchedule(s); setStudents(st); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  // When a class is selected, find its level and pre-populate students
  useEffect(() => {
    if (!selectedClass) return;
    const cls = schedule.find(c => c.id === selectedClass);
    if (!cls) return;
    const levelId = cls.module?.level?.id;
    setSelectedLevel(levelId || '');

    // Get students for this group
    const groupStudents = students.filter(s => s.currentLevel?.id === levelId);
    const initial: Record<string, boolean> = {};
    groupStudents.forEach(s => { initial[s.id] = true; }); // Default: all present
    setAttendees(initial);
  }, [selectedClass, schedule, students]);

  const handleSave = async () => {
    if (!selectedClass || !selectedLevel) return;
    setSaving(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/teacher/attendance`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: selectedClass,
          levelId: selectedLevel,
          attendees: Object.entries(attendees).map(([userId, attended]) => ({ userId, attended })),
        }),
      });
      alert('Asistencia registrada ✅');
    } catch (err) {
      console.error(err);
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" /></div>;

  const groupStudentsForSelected = students.filter(s => s.currentLevel?.id === selectedLevel);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Asistencia</h1>
        <p className="text-slate-500 text-sm">Selecciona una clase y marca la asistencia de tus alumnos.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm max-w-2xl">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Clase</label>
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
            className="w-full border border-slate-200 rounded-xl py-2 px-3 bg-slate-50">
            <option value="">Selecciona una clase...</option>
            {schedule.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.title} — {cls.module?.level?.name} — {new Date(cls.scheduledAt).toLocaleDateString()} {new Date(cls.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </option>
            ))}
          </select>
        </div>

        {selectedClass && groupStudentsForSelected.length > 0 && (
          <>
            <div className="space-y-2 mb-4">
              {groupStudentsForSelected.map(s => (
                <label key={s.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    attendees[s.id] ? 'border-emerald-300 bg-emerald-50' : 'border-red-200 bg-red-50'
                  }`}
                  onClick={() => setAttendees(prev => ({...prev, [s.id]: !prev[s.id]}))}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      attendees[s.id] ? 'bg-emerald-500 text-white' : 'bg-red-400 text-white'
                    }`}>
                      {attendees[s.id] ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </div>
                    <span className="font-semibold text-sm text-slate-800">{s.firstName} {s.lastName}</span>
                  </div>
                  <span className={`text-xs font-bold ${attendees[s.id] ? 'text-emerald-600' : 'text-red-500'}`}>
                    {attendees[s.id] ? 'Presente' : 'Ausente'}
                  </span>
                </label>
              ))}
            </div>

            <button onClick={handleSave} disabled={saving}
              className="w-full py-3 rounded-xl font-bold text-white bg-[#2E7D32] hover:bg-green-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <ClipboardCheck className="w-5 h-5" />}
              Guardar Asistencia
            </button>
          </>
        )}

        {selectedClass && groupStudentsForSelected.length === 0 && (
          <p className="text-slate-500 text-sm text-center py-4">No hay alumnos en este grupo.</p>
        )}
      </div>
    </div>
  );
}
