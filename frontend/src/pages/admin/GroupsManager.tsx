import { useState, useEffect } from 'react';
import { Loader2, Plus, Edit2, Trash2, Check, X, Layers, Clock, Calendar, Users, Video, User, Link as LinkIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { showSuccess, showError, confirmDelete } from '../../utils/alerts';
import { buildScheduleString, parseSchedule } from '../../utils/schedule';

const LEVEL_CODES = ['Basico1', 'Basico2', 'Inter1', 'Inter2', 'Avanz1', 'Avanz2'];
const MODALITIES = [
  { value: 'GROUP', label: 'Grupal', icon: '👥', desc: 'Máx 8 alumnos' },
  { value: 'INDIVIDUAL', label: 'Individual', icon: '👤', desc: '1 alumno' },
  { value: 'PART_DUO', label: 'Part Duo', icon: '👥', desc: '2 alumnos' },
];
const RHYTHMS = [
  { value: 'REGULAR', label: 'Regular', desc: '3x/sem · 50min (L-Mi-V)' },
  { value: 'SATURDAY', label: 'Sabatino', desc: '1x/sem · 2h50 (Sáb)' },
  { value: 'INTENSIVE', label: 'Intensivo', desc: '5x/sem · 50min (L-V)' },
];

const DAYS = [
  { key: 'Lun', label: 'L' },
  { key: 'Mar', label: 'M' },
  { key: 'Mier', label: 'Mi' },
  { key: 'Jue', label: 'J' },
  { key: 'Vier', label: 'V' },
  { key: 'Sáb', label: 'S' },
];

type DaySchedule = { startTime: string; endTime: string };

export function GroupsManager() {
  const [levels, setLevels] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [zoomHosts, setZoomHosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddZoom, setShowAddZoom] = useState(false);
  const [addingZoom, setAddingZoom] = useState(false);
  const [newZoom, setNewZoom] = useState({ displayName: '', email: '', permanentLink: '' });
  const session = useAuthStore(state => state.session);

  // Form state
  const [name, setName] = useState('');
  const [levelCode, setLevelCode] = useState('Basico1');
  const [modality, setModality] = useState('GROUP');
  const [rhythm, setRhythm] = useState<string>('REGULAR');
  const [maxStudents, setMaxStudents] = useState(8);
  const [teacherId, setTeacherId] = useState('');
  const [zoomHostId, setZoomHostId] = useState('');
  const [zoomLink, setZoomLink] = useState('');
  const [zoomMode, setZoomMode] = useState<'host' | 'manual'>('host');

  // Schedule
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [sameTime, setSameTime] = useState(true);
  const [uniformStart, setUniformStart] = useState('');
  const [uniformEnd, setUniformEnd] = useState('');
  const [showManualTime, setShowManualTime] = useState(false);
  const [perDay, setPerDay] = useState<Record<string, DaySchedule>>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [levelsRes, teachersRes, zoomRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/admin/levels`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/admin/teachers`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/admin/zoom/permanent-links`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        }),
      ]);
      if (levelsRes.ok) setLevels(await levelsRes.json());
      if (teachersRes.ok) setTeachers(await teachersRes.json());
      if (zoomRes.ok) setZoomHosts(await zoomRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchData();
  }, [session]);

  const resetForm = () => {
    setName(''); setLevelCode('Basico1'); setModality('GROUP'); setRhythm('REGULAR');
    setMaxStudents(8); setTeacherId(''); setZoomHostId(''); setZoomLink(''); setZoomMode('host');
    setSelectedDays([]); setSameTime(true); setUniformStart(''); setUniformEnd('');
    setPerDay({}); setEditingId(null); setShowManualTime(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const schedule = buildScheduleString(selectedDays, sameTime, uniformStart, uniformEnd, perDay);

    try {
      const url = editingId
        ? `${import.meta.env.VITE_API_URL}/admin/levels/${editingId}`
        : `${import.meta.env.VITE_API_URL}/admin/levels`;
      const method = editingId ? 'PATCH' : 'POST';

      const body: any = {
          name, levelCode, modality, schedule: schedule || null,
          rhythm: modality === 'GROUP' ? rhythm : null,
          maxStudents: modality === 'GROUP' ? maxStudents : (modality === 'PART_DUO' ? 2 : 1),
          teacherId: teacherId || null,
        };

        // Zoom: if using a host, send zoomHostId and sync the link; if manual, just send zoomLink
        if (zoomMode === 'host' && zoomHostId) {
          const selectedHost = zoomHosts.find(h => h.id === zoomHostId);
          body.zoomHostId = zoomHostId;
          body.zoomLink = selectedHost?.permanentLink || null;
        } else if (zoomMode === 'manual' && zoomLink) {
          body.zoomLink = zoomLink;
          body.zoomHostId = null;
        } else {
          body.zoomLink = null;
          body.zoomHostId = null;
        }

        const res = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body),
        });

      if (res.ok) { showSuccess('Grupo guardado'); resetForm(); fetchData(); }
      else {
        const error = await res.json();
        showError('Error al guardar', error.message);
      }
    } catch (e) { console.error(e); showError('Error de conexión'); }
    finally { setIsSubmitting(false); }
  };

  const handleEdit = (level: any) => {
    setName(level.name);
    setLevelCode(level.levelCode);
    setModality(level.modality || 'GROUP');
    setRhythm(level.rhythm || 'REGULAR');
    setMaxStudents(level.maxStudents || 8);
    setTeacherId(level.teacherId || '');
    setZoomHostId(level.zoomHostId || '');
    setZoomLink(level.zoomLink || '');
    setZoomMode(level.zoomHostId ? 'host' : (level.zoomLink ? 'manual' : 'host'));
    setEditingId(level.id);

    const parsed = parseSchedule(level.schedule);
    setSelectedDays(parsed.days);
    setSameTime(parsed.sameTime);
    setUniformStart(parsed.uniformStart);
    setUniformEnd(parsed.uniformEnd);
    setPerDay(parsed.perDay);
  };

  const handleDelete = async (id: string) => {
    if (!(await confirmDelete('¿Eliminar este grupo?', 'Se eliminarán todos sus recursos.'))) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/levels/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) fetchData();
    } catch (e) { console.error(e); }
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  // Auto-set maxStudents based on modality
  useEffect(() => {
    if (modality === 'INDIVIDUAL') setMaxStudents(1);
    else if (modality === 'PART_DUO') setMaxStudents(2);
    else if (modality === 'GROUP') setMaxStudents(8);
  }, [modality]);



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Gestión de Grupos</h1>
        <p className="text-slate-500 text-sm">Crea y administra grupos, clases individuales y Part Duo. Asigna profesores, horarios y enlaces de Zoom.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ── Formulario ── */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm lg:col-span-1 sticky top-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#1D3A8A]" />
              {editingId ? 'Editar Grupo' : 'Nuevo Grupo'}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1">
                <X className="w-4 h-4" /> Cancelar
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre del Grupo</label>
              <input
                required type="text" placeholder="Ej. Grupo París, Grupo Lyon..."
                value={name} onChange={e => setName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50"
              />
            </div>

            {/* Modality selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Modalidad</label>
              <div className="grid grid-cols-3 gap-2">
                {MODALITIES.map(m => (
                  <button
                    key={m.value} type="button"
                    onClick={() => setModality(m.value)}
                    className={`py-2 px-1 rounded-xl text-center transition-all text-sm border-2 ${
                      modality === m.value
                        ? 'border-[#1D3A8A] bg-[#1D3A8A]/5 text-[#1D3A8A] font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-lg">{m.icon}</span>
                    <p className="text-xs font-semibold">{m.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Level Code */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nivel</label>
                <select value={levelCode} onChange={e => setLevelCode(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl py-2 px-3 bg-slate-50">
                  {LEVEL_CODES.map(c => <option key={c} value={c}>{c.replace('Basico', 'Básico ').replace('Inter', 'Intermedio ').replace('Avanz', 'Avanzado ')}</option>)}
                </select>
              </div>

              {/* Max students */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Capacidad</label>
                <input
                  type="number" min={1} max={20}
                  value={maxStudents} onChange={e => setMaxStudents(Number(e.target.value))}
                  disabled={modality !== 'GROUP'}
                  className="w-full border border-slate-200 rounded-xl py-2 px-3 bg-slate-50 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Rhythm (only for GROUP) */}
            {modality === 'GROUP' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Ritmo de Estudio</label>
                <div className="space-y-1.5">
                  {RHYTHMS.map(r => (
                    <label key={r.value}
                      className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer border transition-all ${
                        rhythm === r.value ? 'border-[#1D3A8A] bg-[#1D3A8A]/5' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input type="radio" name="rhythm" value={r.value}
                        checked={rhythm === r.value}
                        onChange={() => {
                          setRhythm(r.value);
                          if (r.value === 'SATURDAY') {
                            setSelectedDays(['Sáb']);
                          } else if (r.value === 'INTENSIVE') {
                            setSelectedDays(['Lun', 'Mar', 'Mié', 'Jue', 'Vie']);
                          } else if (r.value === 'REGULAR') {
                            setSelectedDays(['Lun', 'Mié', 'Vie']);
                          } else {
                            setSelectedDays([]);
                          }
                        }}
                        className="accent-[#1D3A8A]"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{r.label}</p>
                        <p className="text-xs text-slate-500">{r.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Teacher */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Profesor Asignado
              </label>
              <select value={teacherId} onChange={e => setTeacherId(e.target.value)}
                className="w-full border border-slate-200 rounded-xl py-2 px-3 bg-slate-50">
                <option value="">Sin profesor asignado</option>
                {teachers.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.firstName} {t.lastName} ({t.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Zoom Link - Dropdown with Add inline */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-[#2D8CFF]" /> Enlace Fijo de Zoom
              </label>

              {/* Mode toggle */}
              <div className="flex gap-1 mb-2">
                <button type="button" onClick={() => setZoomMode('host')}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${zoomMode === 'host' ? 'bg-[#2D8CFF] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  Seleccionar Cuenta
                </button>
                <button type="button" onClick={() => setZoomMode('manual')}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${zoomMode === 'manual' ? 'bg-[#2D8CFF] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  Link Manual
                </button>
              </div>

              {zoomMode === 'host' ? (
                <>
                  <select value={zoomHostId} onChange={e => setZoomHostId(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl py-2 px-3 bg-slate-50 text-sm">
                    <option value="">Sin enlace de Zoom</option>
                    {zoomHosts.map((h: any) => (
                      <option key={h.id} value={h.id}>
                        🟢 {h.displayName} ({h.email.split('@')[0]})
                        {h._count?.assignedGroups > 0 ? ` · ${h._count.assignedGroups} grupo(s)` : ''}
                      </option>
                    ))}
                  </select>

                  {/* Add new zoom link inline */}
                  {!showAddZoom ? (
                    <button type="button" onClick={() => setShowAddZoom(true)}
                      className="mt-2 text-xs text-[#2D8CFF] hover:text-blue-700 flex items-center gap-1 font-semibold">
                      <Plus className="w-3 h-3" /> Agregar nuevo enlace Zoom
                    </button>
                  ) : (
                    <div className="mt-2 p-3 border border-[#2D8CFF]/30 rounded-xl bg-blue-50/50 space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-bold text-[#2D8CFF]">Nuevo Enlace Zoom</p>
                        <button type="button" onClick={() => { setShowAddZoom(false); setNewZoom({ displayName: '', email: '', permanentLink: '' }); }}
                          className="text-slate-400 hover:text-slate-600">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input type="text" placeholder="Nombre (Ej. Zoom 7)" value={newZoom.displayName}
                        onChange={e => setNewZoom({ ...newZoom, displayName: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs bg-white" />
                      <input type="email" placeholder="Email de Zoom" value={newZoom.email}
                        onChange={e => setNewZoom({ ...newZoom, email: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs bg-white" />
                      <input type="url" placeholder="https://zoom.us/j/..." value={newZoom.permanentLink}
                        onChange={e => setNewZoom({ ...newZoom, permanentLink: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs bg-white font-mono" />
                      <button type="button" disabled={addingZoom || !newZoom.displayName || !newZoom.email || !newZoom.permanentLink}
                        onClick={async () => {
                          setAddingZoom(true);
                          try {
                            const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/zoom/hosts`, {
                              method: 'POST',
                              headers: { 'Authorization': `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' },
                              body: JSON.stringify(newZoom),
                            });
                            if (res.ok) {
                              const created = await res.json();
                              setZoomHostId(created.id);
                              setShowAddZoom(false);
                              setNewZoom({ displayName: '', email: '', permanentLink: '' });
                              // Refresh zoom hosts
                              const zoomRes = await fetch(`${import.meta.env.VITE_API_URL}/admin/zoom/permanent-links`, {
                                headers: { 'Authorization': `Bearer ${session?.access_token}` }
                              });
                              if (zoomRes.ok) setZoomHosts(await zoomRes.json());
                            } else {
                              const err = await res.json();
                              showError('Error al guardar', err.message);
                            }
                          } catch { showError('Error de conexión'); }
                          finally { setAddingZoom(false); }
                        }}
                        className="w-full py-1.5 rounded-lg text-xs font-bold bg-[#2D8CFF] text-white hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 disabled:opacity-50">
                        {addingZoom ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                        Guardar Enlace
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <input type="url" placeholder="https://zoom.us/j/..."
                    value={zoomLink} onChange={e => setZoomLink(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl py-2 px-3 bg-slate-50 text-sm" />
                  <p className="text-xs text-slate-400 mt-1">Pega un enlace de Zoom manualmente.</p>
                </>
              )}
            </div>

            {/* Schedule */}
            <div className="border-t border-dashed border-slate-200 pt-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Horario
              </label>

              {/* Day picker */}
              {modality === 'GROUP' && rhythm === 'REGULAR' ? (
                <div className="flex gap-2 mb-3">
                  <button type="button" onClick={() => setSelectedDays(['Lun', 'Mié', 'Vie'])}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${JSON.stringify(selectedDays) === JSON.stringify(['Lun', 'Mié', 'Vie']) ? 'bg-[#1D3A8A] text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                    Lunes, Miércoles y Viernes
                  </button>
                  <button type="button" onClick={() => setSelectedDays(['Mié', 'Jue', 'Vie'])}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${JSON.stringify(selectedDays) === JSON.stringify(['Mié', 'Jue', 'Vie']) ? 'bg-[#1D3A8A] text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                    Miércoles, Jueves y Viernes
                  </button>
                </div>
              ) : modality === 'GROUP' ? (
                <div className="flex gap-2 mb-3">
                  {selectedDays.map(day => (
                    <div key={day} className="w-9 h-9 rounded-full font-bold text-sm bg-[#1D3A8A] text-white shadow-md flex items-center justify-center cursor-default">
                      {DAYS.find(d => d.key === day)?.label || day}
                    </div>
                  ))}
                  <p className="text-xs text-slate-500 self-center ml-2">(Días fijos por modalidad)</p>
                </div>
              ) : (
                <div className="flex gap-2 mb-3">
                  {DAYS.map(d => (
                    <button key={d.key} type="button" 
                      onClick={() => toggleDay(d.key)}
                      className={`w-9 h-9 rounded-full font-bold text-sm transition-all ${
                        selectedDays.includes(d.key)
                          ? 'bg-[#1D3A8A] text-white shadow-md'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              )}

              {selectedDays.length > 0 && (
                <>
                  <label className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input type="checkbox" checked={sameTime}
                      onChange={() => setSameTime(!sameTime)}
                      className="accent-[#1D3A8A] w-4 h-4"
                    />
                    <span className="text-xs text-slate-600">Misma hora todos los días</span>
                  </label>

                  {sameTime ? (
                    <div>
                      {!showManualTime ? (
                        <select 
                          value={`${uniformStart}-${uniformEnd}`}
                          onChange={e => {
                            if (e.target.value === 'manual') {
                              setShowManualTime(true);
                              setUniformStart('');
                              setUniformEnd('');
                            } else {
                              const [s, eTime] = e.target.value.split('-');
                              if (s && eTime) {
                                setUniformStart(s);
                                setUniformEnd(eTime);
                              }
                            }
                          }}
                          className="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm bg-slate-50 focus:ring-2 focus:ring-[#1D3A8A]/20"
                        >
                          <option value="-">Selecciona un horario sugerido...</option>
                          {rhythm === 'SATURDAY' ? (
                            <>
                              <option value="08:00-10:50">08:00 a 10:50</option>
                              <option value="11:00-13:50">11:00 a 13:50</option>
                              <option value="14:00-16:50">14:00 a 16:50</option>
                            </>
                          ) : (
                            Array.from({ length: 14 }).map((_, i) => {
                              const hour = i + 8;
                              const start = `${hour.toString().padStart(2, '0')}:00`;
                              const end = `${hour.toString().padStart(2, '0')}:50`;
                              return <option key={start} value={`${start}-${end}`}>{start} a {end}</option>;
                            })
                          )}
                          <option value="manual">Otro (Ingreso manual)</option>
                        </select>
                      ) : (
                        <div>
                          <div className="flex gap-2 items-center">
                            <input type="time" value={uniformStart}
                              onChange={e => setUniformStart(e.target.value)}
                              className="flex-1 border border-slate-200 rounded-lg py-1.5 px-2 text-sm bg-slate-50"
                            />
                            <span className="text-slate-400 text-sm">a</span>
                            <input type="time" value={uniformEnd}
                              onChange={e => setUniformEnd(e.target.value)}
                              className="flex-1 border border-slate-200 rounded-lg py-1.5 px-2 text-sm bg-slate-50"
                            />
                          </div>
                          <button type="button" onClick={() => setShowManualTime(false)} className="text-xs text-blue-600 mt-1 hover:underline">
                            Volver a sugerencias
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedDays.map(day => (
                        <div key={day} className="flex items-center gap-2">
                          <span className="w-10 text-xs font-bold text-slate-600">{day}</span>
                          <input type="time"
                            value={perDay[day]?.startTime || ''}
                            onChange={e => setPerDay(prev => ({...prev, [day]: {...(prev[day] || {}), startTime: e.target.value}}))}
                            className="flex-1 border border-slate-200 rounded-lg py-1 px-2 text-xs bg-slate-50"
                          />
                          <span className="text-slate-400 text-xs">a</span>
                          <input type="time"
                            value={perDay[day]?.endTime || ''}
                            onChange={e => setPerDay(prev => ({...prev, [day]: {...(prev[day] || {}), endTime: e.target.value}}))}
                            className="flex-1 border border-slate-200 rounded-lg py-1 px-2 text-xs bg-slate-50"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-bold text-white bg-[#1D3A8A] hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />)}
              {editingId ? 'Guardar Cambios' : 'Crear Grupo'}
            </button>
          </form>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#1D3A8A]" /> Grupos Activos
          </h2>

          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 text-[#1D3A8A] animate-spin" /></div>
          ) : levels.length === 0 ? (
            <div className="text-center py-12">
              <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No hay grupos creados aún.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="p-3">Grupo</th>
                    <th className="p-3">Nivel</th>
                    <th className="p-3">Modalidad</th>
                    <th className="p-3">Profesor</th>
                    <th className="p-3">Alumnos</th>
                    <th className="p-3">Horario</th>
                    <th className="p-3">Zoom</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {levels.map(level => {
                    const mod = MODALITIES.find(m => m.value === level.modality);
                    const rhy = RHYTHMS.find(r => r.value === level.rhythm);
                    return (
                      <tr key={level.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <p className="font-bold text-slate-800">{level.name}</p>
                        </td>
                        <td className="p-3">
                          <span className="text-xs font-bold bg-[#1D3A8A]/10 text-[#1D3A8A] px-2 py-0.5 rounded-full">
                            {level.levelCode?.replace('Basico', 'Bás ').replace('Inter', 'Int ').replace('Avanz', 'Av ')}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <span>{mod?.icon || '👥'}</span>
                            <span className="text-xs text-slate-600">{mod?.label || 'Grupal'}</span>
                          </div>
                          {rhy && <p className="text-xs text-slate-400">{rhy.label}</p>}
                        </td>
                        <td className="p-3">
                          {level.teacher ? (
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-xs font-medium text-slate-700">
                                {level.teacher.firstName} {level.teacher.lastName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs font-bold text-slate-700">
                              {level._count?.users || 0}/{level.maxStudents || 8}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          {level.schedule ? (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-xs text-slate-600">{level.schedule}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="p-3">
                          {level.zoomHostGroup ? (
                            <a href={level.zoomHostGroup.permanentLink || level.zoomLink} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-[#2D8CFF] hover:underline flex items-center gap-1" title={level.zoomHostGroup.permanentLink}>
                              <Video className="w-3.5 h-3.5" /> {level.zoomHostGroup.displayName}
                            </a>
                          ) : level.zoomLink ? (
                            <a href={level.zoomLink} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-[#2D8CFF] hover:underline flex items-center gap-1">
                              <LinkIcon className="w-3.5 h-3.5" /> Manual
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEdit(level)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(level.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
