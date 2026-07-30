import { useState, useEffect } from 'react';
import { Loader2, Plus, Edit2, Trash2, Check, X, Layers, Clock, Calendar } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const LEVEL_CODES = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const DAYS = [
  { key: 'Lun', label: 'L' },
  { key: 'Mar', label: 'M' },
  { key: 'Mier', label: 'Mi' },
  { key: 'Jue', label: 'J' },
  { key: 'Vier', label: 'V' },
  { key: 'Sáb', label: 'S' },
];

type DaySchedule = { startTime: string; endTime: string };

/**
 * Parse schedule string into structured data.
 * Supports two formats:
 *   Uniform:   "Lun, Mier, Vier · 10:00-12:00"
 *   Per-day:   "Lun 10:00-12:00, Mier 14:00-16:00, Vier 08:00-09:00"
 */
function parseSchedule(schedule: string | null): {
  days: string[];
  sameTime: boolean;
  uniformStart: string;
  uniformEnd: string;
  perDay: Record<string, DaySchedule>;
} {
  const empty = { days: [], sameTime: true, uniformStart: '', uniformEnd: '', perDay: {} as Record<string, DaySchedule> };
  if (!schedule) return empty;

  // Uniform format: "Lun, Mier, Vier · 10:00-12:00"
  if (schedule.includes(' · ')) {
    const [daysPart, timePart] = schedule.split(' · ');
    const days = daysPart.split(', ').map(d => d.trim());
    const [start, end] = (timePart || '').split('-').map(t => t.trim());
    return { days, sameTime: true, uniformStart: start || '', uniformEnd: end || '', perDay: {} };
  }

  // Per-day format: "Lun 10:00-12:00, Mier 14:00-16:00"
  const parts = schedule.split(', ').map(p => p.trim());
  const days: string[] = [];
  const perDay: Record<string, DaySchedule> = {};
  let allSame = true;
  let firstTime = '';

  for (const part of parts) {
    const match = part.match(/^(\S+)\s+(\d{1,2}:\d{2})-(\d{1,2}:\d{2})$/);
    if (match) {
      const [, day, start, end] = match;
      days.push(day);
      perDay[day] = { startTime: start, endTime: end };
      const timeStr = `${start}-${end}`;
      if (!firstTime) firstTime = timeStr;
      else if (timeStr !== firstTime) allSame = false;
    } else {
      // Day without time
      days.push(part);
    }
  }

  if (allSame && days.length > 0 && firstTime) {
    const [start, end] = firstTime.split('-');
    return { days, sameTime: true, uniformStart: start, uniformEnd: end, perDay: {} };
  }

  return { days, sameTime: false, uniformStart: '', uniformEnd: '', perDay };
}

/**
 * Build schedule string from structured data.
 */
function buildSchedule(
  days: string[],
  sameTime: boolean,
  uniformStart: string,
  uniformEnd: string,
  perDay: Record<string, DaySchedule>
): string | null {
  if (days.length === 0) return null;

  if (sameTime) {
    const dayStr = days.join(', ');
    if (uniformStart && uniformEnd) {
      return `${dayStr} · ${uniformStart}-${uniformEnd}`;
    }
    return dayStr;
  }

  // Per-day format
  const parts = days.map(day => {
    const ds = perDay[day];
    if (ds?.startTime && ds?.endTime) {
      return `${day} ${ds.startTime}-${ds.endTime}`;
    }
    return day;
  });
  return parts.join(', ');
}

/**
 * Formats a schedule string for display in the table.
 * Makes per-day schedules more readable.
 */
function formatScheduleDisplay(schedule: string | null): React.ReactNode {
  if (!schedule) return <span className="text-slate-400 text-xs">Sin horario</span>;

  // Uniform format — show as-is
  if (schedule.includes(' · ')) {
    return schedule;
  }

  // Per-day format — show as stacked lines
  const parts = schedule.split(', ').map(p => p.trim());
  return (
    <div className="flex flex-col gap-0.5">
      {parts.map((part, i) => {
        const match = part.match(/^(\S+)\s+(.+)$/);
        if (match) {
          return (
            <span key={i} className="text-xs">
              <span className="font-semibold text-slate-700">{match[1]}</span>{' '}
              <span className="text-slate-500">{match[2]}</span>
            </span>
          );
        }
        return <span key={i} className="text-xs">{part}</span>;
      })}
    </div>
  );
}

export function GroupsManager() {
  const [levels, setLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [groupName, setGroupName] = useState('');
  const [levelCode, setLevelCode] = useState('A1');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [sameTime, setSameTime] = useState(true);
  const [uniformStart, setUniformStart] = useState('');
  const [uniformEnd, setUniformEnd] = useState('');
  const [perDaySchedule, setPerDaySchedule] = useState<Record<string, DaySchedule>>({});

  const session = useAuthStore(state => state.session);

  const fetchLevels = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/levels`, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) setLevels(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchLevels();
  }, [session]);

  const resetForm = () => {
    setGroupName('');
    setLevelCode('A1');
    setSelectedDays([]);
    setSameTime(true);
    setUniformStart('');
    setUniformEnd('');
    setPerDaySchedule({});
    setEditingId(null);
  };

  const toggleDay = (dayKey: string) => {
    setSelectedDays(prev => {
      if (prev.includes(dayKey)) {
        // Remove day and its per-day schedule
        const newPerDay = { ...perDaySchedule };
        delete newPerDay[dayKey];
        setPerDaySchedule(newPerDay);
        return prev.filter(d => d !== dayKey);
      }
      // Add day with empty schedule
      setPerDaySchedule(pd => ({ ...pd, [dayKey]: { startTime: '', endTime: '' } }));
      return [...prev, dayKey];
    });
  };

  const updatePerDay = (day: string, field: 'startTime' | 'endTime', value: string) => {
    setPerDaySchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  // When toggling to sameTime, pre-fill uniform from first per-day entry if available
  const handleToggleSameTime = () => {
    if (!sameTime) {
      // Switching TO sameTime: copy first day's times as uniform
      const firstDay = selectedDays[0];
      const firstSchedule = perDaySchedule[firstDay];
      if (firstSchedule?.startTime) setUniformStart(firstSchedule.startTime);
      if (firstSchedule?.endTime) setUniformEnd(firstSchedule.endTime);
    } else {
      // Switching TO perDay: prefill all days with uniform times
      const newPerDay: Record<string, DaySchedule> = {};
      for (const day of selectedDays) {
        newPerDay[day] = { startTime: uniformStart, endTime: uniformEnd };
      }
      setPerDaySchedule(newPerDay);
    }
    setSameTime(!sameTime);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    setIsSubmitting(true);

    const schedule = buildSchedule(selectedDays, sameTime, uniformStart, uniformEnd, perDaySchedule);

    try {
      const url = editingId
        ? `${import.meta.env.VITE_API_URL}/admin/levels/${editingId}`
        : `${import.meta.env.VITE_API_URL}/admin/levels`;
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: groupName.trim(),
          levelCode,
          schedule,
        })
      });

      if (res.ok) {
        resetForm();
        fetchLevels();
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
    if (!confirm('¿Estás seguro de que quieres eliminar este grupo? Esto eliminará también los módulos, clases y progresos asociados a este grupo.')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/levels/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) {
        fetchLevels();
      } else {
        alert('Hubo un error al eliminar el grupo.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (level: any) => {
    setGroupName(level.name);
    setLevelCode(level.levelCode || 'A1');
    const parsed = parseSchedule(level.schedule);
    setSelectedDays(parsed.days);
    setSameTime(parsed.sameTime);
    setUniformStart(parsed.uniformStart);
    setUniformEnd(parsed.uniformEnd);
    setPerDaySchedule(parsed.perDay);
    setEditingId(level.id);
  };

  const cancelEdit = () => {
    resetForm();
  };

  // Ordered selected days based on DAYS constant order
  const orderedSelectedDays = DAYS.filter(d => selectedDays.includes(d.key)).map(d => d.key);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Gestión de Grupos</h1>
        <p className="text-slate-500 text-sm">Crea o edita los grupos de estudio. Cada grupo tiene un nombre, nivel académico y horario. Al crear un grupo, se le asignará un módulo por defecto.</p>
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
              <button onClick={cancelEdit} className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1">
                <X className="w-4 h-4" /> Cancelar
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre del Grupo */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre del Grupo</label>
              <input
                required
                type="text"
                placeholder="Ej. Grupo París"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50"
              />
            </div>

            {/* Nivel */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nivel Académico</label>
              <select
                value={levelCode}
                onChange={e => setLevelCode(e.target.value)}
                className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50"
              >
                {LEVEL_CODES.map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>

            {/* Horario — Días */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#1D3A8A]" />
                Días de Clase
              </label>
              <div className="flex gap-2 flex-wrap">
                {DAYS.map(day => {
                  const isSelected = selectedDays.includes(day.key);
                  return (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => toggleDay(day.key)}
                      className={`
                        w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200
                        ${isSelected
                          ? 'bg-[#1D3A8A] text-white shadow-md shadow-blue-900/20 scale-105'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }
                      `}
                      title={day.key}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
              {selectedDays.length > 0 && (
                <p className="text-xs text-slate-400 mt-1.5">{orderedSelectedDays.join(', ')}</p>
              )}
            </div>

            {/* Horario — Tiempos (solo si hay días seleccionados) */}
            {selectedDays.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#1D3A8A]" />
                    Horario
                  </label>
                  {selectedDays.length > 1 && (
                    <button
                      type="button"
                      onClick={handleToggleSameTime}
                      className={`
                        text-xs px-3 py-1 rounded-lg font-medium transition-all duration-200
                        ${sameTime
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                        }
                      `}
                    >
                      {sameTime ? '✓ Misma hora todos' : 'Usar misma hora'}
                    </button>
                  )}
                </div>

                {sameTime ? (
                  /* ── Uniform time for all days ── */
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-xs text-slate-400 mb-2">
                      {orderedSelectedDays.join(', ')} — misma hora
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Inicio</label>
                        <input
                          type="time"
                          value={uniformStart}
                          onChange={e => setUniformStart(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Fin</label>
                        <input
                          type="time"
                          value={uniformEnd}
                          onChange={e => setUniformEnd(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ── Per-day individual times ── */
                  <div className="space-y-2">
                    {orderedSelectedDays.map(dayKey => {
                      const dayLabel = DAYS.find(d => d.key === dayKey)?.key || dayKey;
                      const ds = perDaySchedule[dayKey] || { startTime: '', endTime: '' };
                      return (
                        <div
                          key={dayKey}
                          className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3"
                        >
                          <span className="text-sm font-bold text-[#1D3A8A] w-10 shrink-0">{dayLabel}</span>
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <input
                              type="time"
                              value={ds.startTime}
                              onChange={e => updatePerDay(dayKey, 'startTime', e.target.value)}
                              className="w-full border border-slate-200 rounded-lg py-1.5 px-2 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-white text-xs"
                            />
                            <input
                              type="time"
                              value={ds.endTime}
                              onChange={e => updatePerDay(dayKey, 'endTime', e.target.value)}
                              className="w-full border border-slate-200 rounded-lg py-1.5 px-2 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-white text-xs"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !groupName.trim()}
              className="w-full py-3 rounded-xl font-bold text-white bg-[#1D3A8A] hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />)}
              {editingId ? 'Guardar Cambios' : 'Crear Grupo'}
            </button>
          </form>
        </div>

        {/* ── Tabla de Grupos ── */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
            Grupos Existentes
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="p-4">Nombre del Grupo</th>
                  <th className="p-4 text-center">Nivel</th>
                  <th className="p-4">Horario</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#1D3A8A]"/></td>
                  </tr>
                ) : levels.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">No hay grupos creados todavía.</td>
                  </tr>
                ) : (
                  levels.map(level => (
                    <tr key={level.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-800">{level.name}</td>
                      <td className="p-4 text-center">
                        <span className="inline-block bg-blue-50 text-[#1D3A8A] px-2.5 py-1 rounded-lg text-xs font-bold">
                          {level.levelCode || '—'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 text-sm">
                        {level.schedule ? (
                          <span className="flex items-start gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                            {formatScheduleDisplay(level.schedule)}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">Sin horario</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(level)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar grupo"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(level.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar grupo"
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
