import { useState, useEffect } from 'react';
import { Calendar, Loader2, Plus, Clock, Link as LinkIcon, BookOpen, Search, Trash2, Edit2, X, Check, Video } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function ScheduleManager() {
  const [levels, setLevels] = useState<any[]>([]);
  const [scheduledClasses, setScheduledClasses] = useState<any[]>([]);
  const [zoomHosts, setZoomHosts] = useState<any[]>([]);
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
    zoomHostId: '',
    scheduledAtDate: '',
    scheduledAtTime: '',
    durationExpected: 3600
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [levelsRes, scheduleRes, hostsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/admin/levels`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/admin/schedule`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/admin/zoom/hosts`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        }).catch(() => null),
      ]);
      
      if (levelsRes.ok) setLevels(await levelsRes.json());
      if (scheduleRes.ok) setScheduledClasses(await scheduleRes.json());
      if (hostsRes?.ok) setZoomHosts(await hostsRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchData();
  }, [session]);

  const defaultForm = {
    levelId: '',
    moduleId: '',
    title: '',
    url: '',
    zoomHostId: '',
    scheduledAtDate: '',
    scheduledAtTime: '',
    durationExpected: 3600
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const scheduledAt = new Date(`${formData.scheduledAtDate}T${formData.scheduledAtTime}`);

    try {
      const url = editingId 
        ? `${import.meta.env.VITE_API_URL}/admin/schedule/${editingId}`
        : `${import.meta.env.VITE_API_URL}/admin/schedule`;
      const method = editingId ? 'PATCH' : 'POST';

      const body: any = {
        title: formData.title,
        moduleId: formData.moduleId,
        scheduledAt: scheduledAt.toISOString(),
        durationExpected: Number(formData.durationExpected),
      };

      // Include either zoomHostId (for auto-create), group's permanent link, or manual URL
      const selectedLevelData = levels.find((l: any) => l.id === formData.levelId);
      const groupZoomLink = selectedLevelData?.zoomLink || selectedLevelData?.zoomHostGroup?.permanentLink || null;
      
      if (formData.zoomHostId && formData.zoomHostId !== '__override__') {
        body.zoomHostId = formData.zoomHostId;
      } else if (formData.url) {
        body.url = formData.url;
      } else if (groupZoomLink && formData.zoomHostId !== '__override__') {
        // Auto-use the group's permanent link
        body.url = groupZoomLink;
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setFormData(defaultForm);
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
    if (!confirm('¿Estás seguro de que quieres eliminar esta clase? Si fue creada con Zoom, la reunión también se cancelará.')) return;
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
      zoomHostId: cls.zoomHost?.id || '',
      scheduledAtDate: dateStr,
      scheduledAtTime: timeStr,
      durationExpected: cls.durationExpected || 3600
    });
    setEditingId(cls.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(defaultForm);
  };

  const selectedLevel = levels.find(l => l.id === formData.levelId);
  const availableModules = selectedLevel ? selectedLevel.modules : [];
  const activeHosts = zoomHosts.filter((h: any) => h.isActive);

  const filteredClasses = scheduledClasses.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchTitle = c.title?.toLowerCase().includes(term);
    const matchLevel = c.module?.level?.name?.toLowerCase().includes(term);
    return matchTitle || matchLevel;
  });

  // Determine if using Zoom auto-create or manual URL
  const isZoomMode = !!formData.zoomHostId;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Programación de Clases</h1>
        <p className="text-slate-500 text-sm">Agenda sesiones en vivo para grupos específicos. Selecciona un host de Zoom para crear la reunión automáticamente.</p>
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
                    <option key={l.id} value={l.id}>{l.name} ({l.levelCode})</option>
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

              {/* ── Zoom: Auto-detect from Group or Manual ── */}
              {(() => {
                // Check if the selected group has a Zoom link already assigned
                const groupZoomLink = selectedLevel?.zoomLink || selectedLevel?.zoomHostGroup?.permanentLink || null;
                const groupZoomName = selectedLevel?.zoomHostGroup?.displayName || null;
                const hasGroupZoom = !!groupZoomLink;
                // If the admin hasn't explicitly chosen to override, use the group's link
                const overrideZoom = formData.zoomHostId === '__override__';

                if (hasGroupZoom && !overrideZoom && !editingId) {
                  return (
                    <div className="border-t border-dashed border-slate-200 pt-4">
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-[#2D8CFF]" />
                        Enlace Zoom del Grupo
                      </label>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                        <p className="text-sm text-emerald-700 font-medium flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          Este grupo ya tiene un enlace Zoom asignado:
                        </p>
                        <a href={groupZoomLink} target="_blank" rel="noopener noreferrer" 
                           className="text-xs text-blue-600 hover:underline mt-1 block truncate">
                          {groupZoomName ? `${groupZoomName} — ` : ''}{groupZoomLink}
                        </a>
                        <p className="text-xs text-emerald-600 mt-1">Se usará automáticamente para esta clase.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, zoomHostId: '__override__', url: ''})}
                        className="text-xs text-slate-500 hover:text-slate-700 mt-2 underline"
                      >
                        ¿Usar otro enlace para esta clase?
                      </button>
                    </div>
                  );
                }

                // Fallback: show the full zoom host selector + manual URL (no group zoom or overriding)
                return (
                  <>
                    <div className="border-t border-dashed border-slate-200 pt-4">
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-[#2D8CFF]" />
                        Cuenta Zoom (Reunión Automática)
                      </label>
                      {hasGroupZoom && overrideZoom && (
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, zoomHostId: '', url: ''})}
                          className="text-xs text-blue-600 hover:text-blue-800 mb-2 underline"
                        >
                          ← Volver al enlace del grupo
                        </button>
                      )}
                      <select
                        value={formData.zoomHostId === '__override__' ? '' : formData.zoomHostId}
                        onChange={e => setFormData({...formData, zoomHostId: e.target.value, url: e.target.value ? '' : formData.url})}
                        className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#2D8CFF]/20 bg-slate-50"
                      >
                        <option value="">Sin Zoom — usar enlace manual</option>
                        {activeHosts.map((h: any) => (
                          <option key={h.id} value={h.id}>
                            {h.displayName} ({h.email}) — {h._count?.meetings || 0} clases
                          </option>
                        ))}
                      </select>

                      {isZoomMode && formData.zoomHostId !== '__override__' && (
                        <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                          ✓ El link de Zoom se generará automáticamente al crear la clase.
                        </p>
                      )}
                    </div>

                    {/* Manual URL — only if no Zoom host selected */}
                    {!isZoomMode && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Enlace manual (Zoom/Meet)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LinkIcon className="w-4 h-4 text-slate-400" />
                          </div>
                          <input 
                            type="url" 
                            placeholder="https://zoom.us/j/..."
                            value={formData.url} 
                            onChange={e => setFormData({...formData, url: e.target.value})}
                            className="w-full border border-slate-200 rounded-xl py-2 pl-10 pr-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50" 
                          />
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}

              <button 
                type="submit" 
                disabled={isSubmitting || !formData.moduleId}
                className="w-full py-3 rounded-xl font-bold text-white bg-[#1D3A8A] hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />)}
                {editingId ? 'Guardar Cambios' : (isZoomMode ? 'Crear Clase + Zoom' : 'Programar Clase')}
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
                  <th className="p-3">Zoom</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && !scheduledClasses.length ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#1D3A8A]"/></td>
                  </tr>
                ) : filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">No hay clases que coincidan con la búsqueda.</td>
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
                      <td className="p-3">
                        {cls.zoomHost ? (
                          <div className="flex items-center gap-1.5">
                            <Video className="w-3.5 h-3.5 text-[#2D8CFF]" />
                            <span className="text-xs text-[#2D8CFF] font-medium">{cls.zoomHost.displayName}</span>
                          </div>
                        ) : cls.url ? (
                          <a href={cls.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                            <LinkIcon className="w-3 h-3" /> Manual
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
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
