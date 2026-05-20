import { useState, useEffect } from 'react';
import { Calendar, Loader2, Plus, Clock, Link as LinkIcon, BookOpen, Search, Trash2, Edit2, X, Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function ScheduleManager() {
  const [levels, setLevels] = useState<any[]>([]);
  const [scheduledClasses, setScheduledClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const [levelsRes, scheduleRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/admin/levels`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/admin/schedule`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        })
      ]);
      
      if (levelsRes.ok) setLevels(await levelsRes.json());
      if (scheduleRes.ok) setScheduledClasses(await scheduleRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchData();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const scheduledAt = new Date(`${formData.scheduledAtDate}T${formData.scheduledAtTime}`);

    try {
      const url = editingId 
        ? `${import.meta.env.VITE_API_URL}/admin/schedule/${editingId}`
        : `${import.meta.env.VITE_API_URL}/admin/schedule`;
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
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
        setFormData({
          levelId: '',
          moduleId: '',
          title: '',
          url: '',
          scheduledAtDate: '',
          scheduledAtTime: '',
          durationExpected: 3600
        });
        setEditingId(null);
        fetchData();
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

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta clase?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/schedule/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (cls: any) => {
    const dt = new Date(cls.scheduledAt);
    const dateStr = dt.toISOString().split('T')[0];
    const timeStr = dt.toTimeString().substring(0, 5);

    setFormData({
      levelId: cls.module?.levelId || '',
      moduleId: cls.moduleId || '',
      title: cls.title || '',
      url: cls.url || '',
      scheduledAtDate: dateStr,
      scheduledAtTime: timeStr,
      durationExpected: cls.durationExpected || 3600
    });
    setEditingId(cls.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      levelId: '',
      moduleId: '',
      title: '',
      url: '',
      scheduledAtDate: '',
      scheduledAtTime: '',
      durationExpected: 3600
    });
  };

  const selectedLevel = levels.find(l => l.id === formData.levelId);
  const availableModules = selectedLevel ? selectedLevel.modules : [];

  const filteredClasses = scheduledClasses.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchTitle = c.title?.toLowerCase().includes(term);
    const matchLevel = c.module?.level?.name?.toLowerCase().includes(term);
    return matchTitle || matchLevel;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Programación de Clases</h1>
        <p className="text-slate-500 text-sm">Agenda sesiones en vivo para grupos específicos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#1D3A8A]" />
              {editingId ? 'Editar Clase' : 'Nueva Clase'}
            </h2>
            {editingId && (
              <button onClick={cancelEdit} className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1">
                <X className="w-4 h-4" /> Cancelar
              </button>
            )}
          </div>

          {loading && !levels.length ? (
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
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />)}
                {editingId ? 'Guardar Cambios' : 'Programar Clase'}
              </button>
            </form>
          )}
        </div>

        {/* Tabla Resumen de Clases Programadas */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col h-[700px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#1D3A8A]" />
              Clases Programadas
            </h2>
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Buscar por título o grupo..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full border border-slate-200 rounded-xl py-2 pl-10 pr-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50 text-sm" 
            />
          </div>

          <div className="overflow-y-auto flex-1 pr-2">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-3">Clase / Grupo</th>
                  <th className="p-3">Fecha y Hora</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && !scheduledClasses.length ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#1D3A8A]"/></td>
                  </tr>
                ) : filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-500">No hay clases que coincidan con la búsqueda.</td>
                  </tr>
                ) : (
                  filteredClasses.map(cls => (
                    <tr key={cls.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <p className="font-bold text-slate-800">{cls.title}</p>
                        <p className="text-xs text-slate-500">{cls.module?.level?.name || 'Sin grupo'}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-slate-700">{new Date(cls.scheduledAt).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-500">{new Date(cls.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(cls)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar clase"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(cls.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar clase"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
