import { useState, useEffect } from 'react';
import { Calendar, Loader2, Plus, Clock, Link as LinkIcon, BookOpen } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function ScheduleManager() {
  const [levels, setLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useAuthStore(state => state.session);

  const [formData, setFormData] = useState({
    levelId: '',
    moduleId: '',
    title: '',
    url: '',
    scheduledAtDate: '',
    scheduledAtTime: '',
    durationExpected: 3600
  });

  useEffect(() => {
    if (!session) return;
    const fetchLevels = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/levels`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        if (res.ok) setLevels(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLevels();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const scheduledAt = new Date(`${formData.scheduledAtDate}T${formData.scheduledAtTime}`);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/schedule`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          url: formData.url,
          moduleId: formData.moduleId,
          scheduledAt: scheduledAt.toISOString(),
          durationExpected: Number(formData.durationExpected)
        })
      });

      if (res.ok) {
        alert('Clase programada exitosamente');
        setFormData({
          levelId: '',
          moduleId: '',
          title: '',
          url: '',
          scheduledAtDate: '',
          scheduledAtTime: '',
          durationExpected: 3600
        });
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedLevel = levels.find(l => l.id === formData.levelId);
  const availableModules = selectedLevel ? selectedLevel.modules : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Programación de Clases</h1>
        <p className="text-slate-500 text-sm">Agenda sesiones en vivo para grupos específicos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#1D3A8A]" />
            Nueva Clase
          </h2>

          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 text-[#1D3A8A] animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Grupo (Nivel)</label>
                <select 
                  required
                  value={formData.levelId} 
                  onChange={e => setFormData({...formData, levelId: e.target.value, moduleId: ''})}
                  className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50"
                >
                  <option value="">Selecciona un grupo...</option>
                  {levels.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Módulo correspondiente</label>
                <select 
                  required
                  disabled={!formData.levelId}
                  value={formData.moduleId} 
                  onChange={e => setFormData({...formData, moduleId: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50 disabled:opacity-50"
                >
                  <option value="">Selecciona un módulo...</option>
                  {availableModules.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Título de la Clase</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                  </div>
                  <input 
                    required 
                    type="text" 
                    placeholder="Ej. Taller de Conversación A1"
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl py-2 pl-10 pr-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Fecha</label>
                  <input 
                    required 
                    type="date" 
                    value={formData.scheduledAtDate} 
                    onChange={e => setFormData({...formData, scheduledAtDate: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Hora</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    <input 
                      required 
                      type="time" 
                      value={formData.scheduledAtTime} 
                      onChange={e => setFormData({...formData, scheduledAtTime: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl py-2 pl-10 pr-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Enlace de la sesión (Zoom/Meet)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="w-4 h-4 text-slate-400" />
                  </div>
                  <input 
                    required 
                    type="url" 
                    placeholder="https://zoom.us/j/..."
                    value={formData.url} 
                    onChange={e => setFormData({...formData, url: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl py-2 pl-10 pr-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !formData.moduleId}
                className="w-full py-3 rounded-xl font-bold text-white bg-[#1D3A8A] hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Programar Clase
              </button>
            </form>
          )}
        </div>

        {/* Podríamos poner otra sección aquí con las clases programadas próximamente */}
        <div className="bg-[#1D3A8A]/5 rounded-3xl p-8 border border-blue-100 flex items-center justify-center text-center">
          <div>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Calendar className="w-10 h-10 text-[#1D3A8A]" />
            </div>
            <h3 className="text-xl font-bold text-[#1D3A8A] mb-2">Sincronización Automática</h3>
            <p className="text-slate-600 max-w-sm mx-auto">
              Al programar una clase para un Grupo, ésta aparecerá automáticamente en la vista "Mis Clases" y en el Calendario de todos los alumnos asignados a ese nivel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
