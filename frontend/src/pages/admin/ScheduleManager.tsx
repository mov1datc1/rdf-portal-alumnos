import { useState, useEffect, useMemo } from 'react';
import { Calendar, Loader2, Plus, Clock, Link as LinkIcon, BookOpen, Search, Trash2, Edit2, X, Check, Video, AlertTriangle, AlertCircle, Users } from 'lucide-react';
import { ScheduleCalendar } from './components/ScheduleCalendar';
import { useAuthStore } from '../../store/authStore';

export function ScheduleManager() {
  const [levels, setLevels] = useState<any[]>([]);
  const [scheduledClasses, setScheduledClasses] = useState<any[]>([]);
  const [zoomHosts, setZoomHosts] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customAlert, setCustomAlert] = useState<{show: boolean; message: string; type: 'error' | 'success'}>({show: false, message: '', type: 'error'});
  const [deleteConfirm, setDeleteConfirm] = useState<{show: boolean; id: string | null}>({show: false, id: null});
  const [isZoomOverridden, setIsZoomOverridden] = useState(false);
  const [isTeacherOverridden, setIsTeacherOverridden] = useState(false);
  const session = useAuthStore(state => state.session);
  const [showManualTime, setShowManualTime] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'calendar'>('form');

  const [formData, setFormData] = useState<any>({
    levelId: '',
    moduleId: '',
    title: '',
    url: '',
    zoomHostId: '',
    teacherId: '',
    scheduledAtDate: '',
    scheduledAtTime: '',
    durationExpected: 3600
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [levelsRes, scheduleRes, hostsRes, teachersRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/admin/levels`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/admin/schedule`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/admin/zoom/hosts`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        }).catch(() => null),
        fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        }).catch(() => null),
      ]);
      
      if (levelsRes.ok) setLevels(await levelsRes.json());
      if (scheduleRes.ok) setScheduledClasses(await scheduleRes.json());
      if (hostsRes?.ok) setZoomHosts(await hostsRes.json());
      if (teachersRes?.ok) {
        const users = await teachersRes.json();
        setTeachers(users.filter((u: any) => u.role === 'TEACHER'));
      }
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
    teacherId: '',
    scheduledAtDate: '',
    scheduledAtTime: '',
    durationExpected: 3600
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const scheduledAt = new Date(`${formData.scheduledAtDate}T${formData.scheduledAtTime}`);
    
    const selectedLevelData = levels.find((l: any) => l.id === formData.levelId);
    
    // VALIDATE HORARIO
    const scheduleStr = selectedLevelData?.schedule?.toLowerCase() || '';
    const allowedDays: number[] = [];
    if (scheduleStr.includes('dom')) allowedDays.push(0);
    if (scheduleStr.includes('lun')) allowedDays.push(1);
    if (scheduleStr.includes('mar')) allowedDays.push(2);
    if (scheduleStr.includes('mie') || scheduleStr.includes('mié')) allowedDays.push(3);
    if (scheduleStr.includes('jue')) allowedDays.push(4);
    if (scheduleStr.includes('vie')) allowedDays.push(5);
    if (scheduleStr.includes('sab') || scheduleStr.includes('sáb')) allowedDays.push(6);
    if (selectedLevelData?.rhythm === 'SATURDAY') allowedDays.push(6);

    if (allowedDays.length > 0 && !allowedDays.includes(scheduledAt.getDay())) {
      setCustomAlert({show: true, message: `El día seleccionado no coincide con los días de clase del grupo (${selectedLevelData?.schedule}).`, type: 'error'});
      setIsSubmitting(false);
      return;
    }

    // ZOOM COLLISION
    const zoomToUse = isZoomOverridden ? (formData.zoomHostId || null) : (formData.zoomHostId || selectedLevelData?.zoomHostId || null);
    if (zoomToUse) {
      const zoomClash = scheduledClasses.some(c => {
        if (c.zoomHostId !== zoomToUse || c.id === editingId) return false;
        const start1 = new Date(c.scheduledAt).getTime();
        const end1 = start1 + (c.durationExpected || 3600) * 1000;
        const start2 = scheduledAt.getTime();
        const end2 = start2 + Number(formData.durationExpected || 3600) * 1000;
        return start1 < end2 && end1 > start2;
      });
      if (zoomClash) {
        setCustomAlert({show: true, message: 'Esa cuenta de Zoom ya está ocupada en ese mismo horario por otra clase. No se pueden cruzar.', type: 'error'});
        setIsSubmitting(false);
        return;
      }
    }



    try {
      const url = editingId 
        ? `${import.meta.env.VITE_API_URL}/admin/schedule/${editingId}`
        : `${import.meta.env.VITE_API_URL}/admin/schedule`;
      const method = editingId ? 'PATCH' : 'POST';

      const body: any = {
        levelId: formData.levelId,
        moduleId: formData.moduleId,
        title: formData.title,
        moduleName: formData.moduleName,
        scheduledAt: scheduledAt.toISOString(),
        durationExpected: Number(formData.durationExpected),
      };

      if (formData.teacherId) {
        body.teacherId = formData.teacherId;
      }

      // Include either zoomHostId (for API auto-create), group's permanent link, or manual URL
      const selectedLevelData = levels.find((l: any) => l.id === formData.levelId);
      const targetHostId = formData.zoomHostId || (!isZoomOverridden ? selectedLevelData?.zoomHostId : null);
      const selectedHost = zoomHosts.find((h: any) => h.id === targetHostId);
      const hasS2SCredentials = !!(selectedHost?.accountId && selectedHost?.clientId && selectedHost?.clientSecret);
      const groupZoomLink = selectedLevelData?.zoomLink || selectedLevelData?.zoomHostGroup?.permanentLink || selectedHost?.permanentLink || null;

      if (targetHostId && hasS2SCredentials) {
        body.zoomHostId = targetHostId;
      } else if (formData.url) {
        body.url = formData.url;
      } else if (groupZoomLink) {
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
        setIsZoomOverridden(false);
        setIsTeacherOverridden(false);
        fetchData();
      } else {
        const error = await res.json();
        if (res.status === 401 || error.message === 'Unauthorized') {
          setCustomAlert({show: true, message: 'Tu sesión ha expirado por inactividad. Por favor, recarga la página o vuelve a iniciar sesión.', type: 'error'});
        } else {
          setCustomAlert({show: true, message: error.message || 'Error desconocido', type: 'error'});
        }
      }
    } catch (e) {
      console.error(e);
      setCustomAlert({show: true, message: 'Error de conexión', type: 'error'});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/schedule/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) {
        fetchData();
        setDeleteConfirm({show: false, id: null});
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
      moduleName: cls.module?.title || '',
      title: cls.title || '',
      url: cls.url || '',
      zoomHostId: cls.zoomHost?.id || '',
      teacherId: cls.teacher?.id || '',
      scheduledAtDate: dateStr,
      scheduledAtTime: timeStr,
      durationExpected: cls.durationExpected || 3600
    });
    setEditingId(cls.id);
    setActiveTab('form');
    setIsZoomOverridden(!!cls.zoomHost?.id);
    setIsTeacherOverridden(!!cls.teacher?.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(defaultForm);
  };

  const selectedLevel = levels.find(l => l.id === formData.levelId);

  const timeOptions = useMemo(() => {
    let options: { value: string; label: string }[] = [];
    if (!selectedLevel) return options;

    const match = selectedLevel.schedule?.match(/\d{2}:\d{2}/);
    const suggestedTime = match ? match[0] : null;

    if (suggestedTime) {
      options.push({ value: suggestedTime, label: `${suggestedTime} (Sugerido)` });
    }

    if (selectedLevel.rhythm === 'SATURDAY') {
      ['08:00', '11:00', '14:00'].forEach(t => {
        if (t !== suggestedTime) options.push({ value: t, label: t });
      });
    } else {
      for (let h = 8; h <= 21; h++) {
        const t = `${h.toString().padStart(2, '0')}:00`;
        if (t !== suggestedTime) options.push({ value: t, label: t });
      }
    }
    return options;
  }, [selectedLevel]);

  const activeHosts = zoomHosts.filter((h) => h.isActive);

  const isTeacherOccupied = (teacherId: string) => {
    if (!formData.scheduledAtDate || !formData.scheduledAtTime) return false;
    const scheduledAt = new Date(`${formData.scheduledAtDate}T${formData.scheduledAtTime}`);
    return scheduledClasses.some(c => {
      const cTeacherId = c.teacherId || c.module?.level?.teacherId;
      if (cTeacherId !== teacherId || c.id === editingId) return false;
      const start1 = new Date(c.scheduledAt).getTime();
      const end1 = start1 + (c.durationExpected || 3600) * 1000;
      const start2 = scheduledAt.getTime();
      const end2 = start2 + Number(formData.durationExpected || 3600) * 1000;
      return start1 < end2 && end1 > start2;
    });
  };

  const filteredClasses = scheduledClasses.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchTitle = c.title?.toLowerCase().includes(term);
    const matchLevel = c.module?.level?.name?.toLowerCase().includes(term);
    return matchTitle || matchLevel;
  });

  const isZoomMode = !!formData.zoomHostId;

  // Helper para verificar si un Zoom está ocupado en la fecha/hora seleccionada
  const isZoomOccupied = (hostId: string) => {
    if (!formData.scheduledAtDate || !formData.scheduledAtTime) return false;
    const start2 = new Date(`${formData.scheduledAtDate}T${formData.scheduledAtTime}`).getTime();
    if (isNaN(start2)) return false;
    const end2 = start2 + Number(formData.durationExpected || 3600) * 1000;

    return scheduledClasses.some(c => {
      if (c.zoomHostId !== hostId || c.id === editingId) return false;
      const start1 = new Date(c.scheduledAt).getTime();
      const end1 = start1 + (c.durationExpected || 3600) * 1000;
      return start1 < end2 && end1 > start2;
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      {/* Alert Modal */}
      {customAlert.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Aviso</h3>
            <p className="text-slate-500 text-sm mb-8 whitespace-pre-wrap">{customAlert.message}</p>
            <button 
              onClick={() => setCustomAlert({show: false, message: '', type: 'error'})}
              className="w-full py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">¿Estás seguro?</h3>
            <p className="text-slate-500 text-sm mb-8">
              ¿Quieres eliminar esta clase? Si fue creada con Zoom, la reunión también se cancelará.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirm({show: false, id: null})}
                className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => deleteConfirm.id && handleDelete(deleteConfirm.id)}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Programación de Clases</h1>
        <p className="text-slate-500 text-sm">Agenda sesiones en vivo para grupos específicos. Selecciona un host de Zoom para crear la reunión automáticamente.</p>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-xl mb-6 w-max">
        <button
          onClick={() => setActiveTab('form')}
          className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'form' 
              ? 'bg-white text-[#1D3A8A] shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Nueva Clase
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'calendar' 
              ? 'bg-white text-[#1D3A8A] shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Calendario
        </button>
      </div>

      {activeTab === 'form' ? (
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

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Módulo correspondiente</label>
                <input 
                  required
                  type="text"
                  placeholder="Ej. Unidad 1 - Saludos"
                  value={formData.moduleName} 
                  onChange={e => setFormData({...formData, moduleName: e.target.value, moduleId: ''})}
                  className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50"
                />
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
                  {(() => {
                    if (formData.scheduledAtDate && formData.levelId) {
                      const selectedLvl = levels.find((l: any) => l.id === formData.levelId);
                      const schedStr = selectedLvl?.schedule?.toLowerCase() || '';
                      const allowDays: number[] = [];
                      if (schedStr.includes('dom')) allowDays.push(0);
                      if (schedStr.includes('lun')) allowDays.push(1);
                      if (schedStr.includes('mar')) allowDays.push(2);
                      if (schedStr.includes('mie') || schedStr.includes('mié')) allowDays.push(3);
                      if (schedStr.includes('jue')) allowDays.push(4);
                      if (schedStr.includes('vie')) allowDays.push(5);
                      if (schedStr.includes('sab') || schedStr.includes('sáb')) allowDays.push(6);
                      if (selectedLvl?.rhythm === 'SATURDAY') allowDays.push(6);
                      
                      const dateObj = new Date(`${formData.scheduledAtDate}T12:00`);
                      if (allowDays.length > 0 && !allowDays.includes(dateObj.getDay())) {
                        return <p className="text-red-500 text-xs mt-1">El día seleccionado está fuera del horario ({selectedLvl?.schedule}).</p>;
                      }
                    }
                    return null;
                  })()}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Hora</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    {!showManualTime ? (
                      <select 
                        required 
                        value={formData.scheduledAtTime} 
                        onChange={e => {
                          if (e.target.value === 'manual') {
                            setShowManualTime(true);
                            setFormData({...formData, scheduledAtTime: ''});
                          } else {
                            setFormData({...formData, scheduledAtTime: e.target.value});
                          }
                        }}
                        className="w-full border border-slate-200 rounded-xl py-2 pl-10 pr-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50" 
                      >
                        <option value="">Selecciona la hora...</option>
                        {timeOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                        <option value="manual">Otro (Ingreso manual)</option>
                      </select>
                    ) : (
                      <input 
                        required 
                        type="time" 
                        value={formData.scheduledAtTime} 
                        onChange={e => setFormData({...formData, scheduledAtTime: e.target.value})}
                        className="w-full border border-slate-200 rounded-xl py-2 pl-10 pr-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50" 
                      />
                    )}
                  </div>
                  {showManualTime && (
                    <button type="button" onClick={() => setShowManualTime(false)} className="text-xs text-blue-600 mt-1 hover:underline">
                      Volver a sugerencias
                    </button>
                  )}
                </div>
              </div>

              {/* — Zoom: Auto-detect from Group or Manual — */}
              {(() => {
                const groupZoomLink = selectedLevel?.zoomLink || selectedLevel?.zoomHostGroup?.permanentLink || null;
                const groupZoomName = selectedLevel?.zoomHostGroup?.displayName || null;
                const hasGroupZoom = !!groupZoomLink;
                const overrideZoom = isZoomOverridden;
                const defaultZoomOccupied = selectedLevel?.zoomHostId ? isZoomOccupied(selectedLevel.zoomHostId) : false;

                if (hasGroupZoom && !overrideZoom && !editingId) {
                  return (
                    <div className="border-t border-dashed border-slate-200 pt-4">
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-[#2D8CFF]" />
                        Enlace Zoom del Grupo
                      </label>
                      {defaultZoomOccupied ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                          <p className="text-sm text-red-700 font-medium flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Este Zoom ({groupZoomName}) está ocupado
                          </p>
                          <p className="text-xs text-red-600 mt-1">Ya hay otra clase programada en este horario. Por favor selecciona otro enlace manualmente.</p>
                          <button
                            type="button"
                            onClick={() => { setIsZoomOverridden(true); setFormData({...formData, zoomHostId: '', url: ''}); }}
                            className="text-xs font-bold text-red-700 hover:text-red-800 mt-3 underline"
                          >
                            Seleccionar otro enlace
                          </button>
                        </div>
                      ) : (
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
                          <button
                            type="button"
                            onClick={() => { setIsZoomOverridden(true); setFormData({...formData, zoomHostId: '', url: ''}); }}
                            className="text-xs text-slate-500 hover:text-slate-700 mt-3 underline"
                          >
                            ¿Usar otro enlace para esta clase?
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

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
                          onClick={() => { setIsZoomOverridden(false); setFormData({...formData, zoomHostId: '', url: ''}); }}
                          className="text-xs text-blue-600 hover:text-blue-800 mb-2 underline"
                        >
                          ← Volver al enlace del grupo
                        </button>
                      )}
                      <select
                        value={formData.zoomHostId}
                        onChange={e => setFormData({...formData, zoomHostId: e.target.value, url: e.target.value ? '' : formData.url})}
                        className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#2D8CFF]/20 bg-slate-50"
                      >
                        <option value="">Sin Zoom — usar enlace manual</option>
                        {activeHosts.map((h: any) => {
                          const occupied = isZoomOccupied(h.id);
                          return (
                            <option key={h.id} value={h.id} disabled={occupied} className={occupied ? 'text-red-500 font-semibold' : ''}>
                              {h.displayName} ({h.email}) {occupied ? '— OCUPADO EN ESTE HORARIO' : ''}
                            </option>
                          );
                        })}
                      </select>

                      {isZoomMode && (
                        <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                          ✓ El link de Zoom se generará automáticamente al crear la clase.
                        </p>
                      )}
                    </div>

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

              {/* — Teacher: Auto-detect from Group or Manual — */}
              {(() => {
                const groupTeacherId = selectedLevel?.teacherId || null;
                const groupTeacherName = selectedLevel?.teacher ? `${selectedLevel.teacher.firstName} ${selectedLevel.teacher.lastName}` : null;
                const hasGroupTeacher = !!groupTeacherId;
                const overrideTeacher = isTeacherOverridden;
                const defaultTeacherOccupied = groupTeacherId ? isTeacherOccupied(groupTeacherId) : false;

                if (hasGroupTeacher && !overrideTeacher && !editingId) {
                  return (
                    <div className="border-t border-dashed border-slate-200 pt-4">
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#2D8CFF]" />
                        Profesor del Grupo
                      </label>
                      {defaultTeacherOccupied ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                          <p className="text-sm text-red-700 font-medium flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Este profesor ({groupTeacherName}) está ocupado
                          </p>
                          <p className="text-xs text-red-600 mt-1">Ya tiene otra clase en este horario. Por favor selecciona otro profesor manualmente.</p>
                          <button
                            type="button"
                            onClick={() => { setIsTeacherOverridden(true); setFormData({...formData, teacherId: ''}); }}
                            className="text-xs font-bold text-red-700 hover:text-red-800 mt-3 underline"
                          >
                            Seleccionar otro profesor
                          </button>
                        </div>
                      ) : (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                          <p className="text-sm text-emerald-700 font-medium flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            Profesor Asignado:
                          </p>
                          <p className="text-sm text-slate-700 font-medium ml-6">{groupTeacherName}</p>
                          <p className="text-xs text-emerald-600 mt-1">Se usará automáticamente para esta clase.</p>
                          <button
                            type="button"
                            onClick={() => { setIsTeacherOverridden(true); setFormData({...formData, teacherId: ''}); }}
                            className="text-xs text-slate-500 hover:text-slate-700 mt-3 underline"
                          >
                            ¿Usar otro profesor para esta clase?
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="border-t border-dashed border-slate-200 pt-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#2D8CFF]" />
                        Profesor de la Clase
                      </span>
                      {hasGroupTeacher && (overrideTeacher || editingId) && (
                        <button
                          type="button"
                          onClick={() => { setIsTeacherOverridden(false); setFormData({...formData, teacherId: ''}); }}
                          className="text-xs font-medium text-blue-600 hover:underline"
                        >
                          Usar profesor del grupo
                        </button>
                      )}
                    </label>
                    <select
                      value={formData.teacherId}
                      onChange={e => setFormData({...formData, teacherId: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50"
                    >
                      <option value="">Selecciona un profesor (Opcional)</option>
                      {teachers.map(t => {
                        const occupied = isTeacherOccupied(t.id);
                        return (
                          <option key={t.id} value={t.id} disabled={occupied} className={occupied ? 'text-red-500 font-semibold' : ''}>
                            {t.firstName} {t.lastName} {occupied ? '(OCUPADO)' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                );
              })()}

              <button 
                type="submit" 
                disabled={isSubmitting || !formData.moduleName}
                className="w-full py-3 rounded-xl font-bold text-white bg-[#1D3A8A] hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />)}
                {editingId ? 'Guardar Cambios' : (isZoomMode ? 'Crear Clase + Zoom' : 'Programar Clase')}
              </button>
            </form>
          )}
        </div>

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
                            onClick={() => setDeleteConfirm({show: true, id: cls.id})}
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
      ) : (
        <ScheduleCalendar classes={scheduledClasses} teachers={teachers} onClassUpdated={fetchData} />
      )}
    </div>
  );
}
