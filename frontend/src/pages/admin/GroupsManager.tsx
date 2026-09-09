import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, Plus, Edit2, Trash2, Check, X, Layers, Clock, Calendar, Users, Video, User, Link as LinkIcon, UserCheck, Search, Mail, Phone, ExternalLink, Copy, GraduationCap, Info } from 'lucide-react';
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

const formatStartDate = (dateVal?: string | null) => {
  if (!dateVal) return '—';
  try {
    const dateStr = typeof dateVal === 'string' ? dateVal : new Date(dateVal).toISOString();
    const cleanDate = dateStr.split('T')[0];
    const parts = cleanDate.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
  } catch (e) {
    console.error('Error formatting startDate', e);
  }
  return '—';
};

export function GroupsManager() {
  const [levels, setLevels] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [zoomHosts, setZoomHosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [showAddZoom, setShowAddZoom] = useState(false);
  const [addingZoom, setAddingZoom] = useState(false);
  const [newZoom, setNewZoom] = useState({ displayName: '', email: '', permanentLink: '' });
  const session = useAuthStore(state => state.session);

  // Expanded group students state
  const [selectedGroupForStudents, setSelectedGroupForStudents] = useState<any | null>(null);
  const [groupStudents, setGroupStudents] = useState<Record<string, any[]>>({});
  const [loadingStudentsId, setLoadingStudentsId] = useState<string | null>(null);

  // Search & Detail modal states
  const [groupSearchTerm, setGroupSearchTerm] = useState('');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<any | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Form state
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
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

  // Memoized filter for Groups
  const filteredLevels = useMemo(() => {
    if (!groupSearchTerm.trim()) return levels;
    const term = groupSearchTerm.toLowerCase().trim();
    return levels.filter((lvl) => {
      const gName = (lvl.name || '').toLowerCase();
      const code = (lvl.levelCode || '').toLowerCase();
      const formattedCode = code
        .replace('basico', 'básico ')
        .replace('inter', 'intermedio ')
        .replace('avanz', 'avanzado ');
      const teacherName = lvl.teacher ? `${lvl.teacher.firstName || ''} ${lvl.teacher.lastName || ''}`.toLowerCase() : '';
      const schedule = (lvl.schedule || '').toLowerCase();
      const mod = MODALITIES.find(m => m.value === lvl.modality)?.label?.toLowerCase() || '';
      const rhy = RHYTHMS.find(r => r.value === lvl.rhythm)?.label?.toLowerCase() || '';

      return (
        gName.includes(term) ||
        code.includes(term) ||
        formattedCode.includes(term) ||
        teacherName.includes(term) ||
        schedule.includes(term) ||
        mod.includes(term) ||
        rhy.includes(term)
      );
    });
  }, [levels, groupSearchTerm]);

  // Memoized students for the active drawer
  const currentGroupStudents = useMemo(() => {
    if (!selectedGroupForStudents) return [];
    return groupStudents[selectedGroupForStudents.id] || selectedGroupForStudents.users || [];
  }, [selectedGroupForStudents, groupStudents]);

  const filteredGroupStudents = useMemo(() => {
    if (!studentSearchTerm.trim()) return currentGroupStudents;
    const term = studentSearchTerm.toLowerCase().trim();
    return currentGroupStudents.filter((st: any) => {
      const fullName = `${st.firstName || ''} ${st.lastName || ''} ${st.name || ''}`.toLowerCase();
      const email = (st.email || '').toLowerCase();
      const phone = (st.phone || st.whatsapp || '').toLowerCase();
      return fullName.includes(term) || email.includes(term) || phone.includes(term);
    });
  }, [currentGroupStudents, studentSearchTerm]);

  const openGroupStudents = async (level: any) => {
    setSelectedGroupForStudents(level);
    setStudentSearchTerm('');
    setSelectedStudentForDetail(null);
    const groupId = level.id;

    if (level.users && level.users.length > 0 && (!groupStudents[groupId] || groupStudents[groupId].length === 0)) {
      setGroupStudents(prev => ({ ...prev, [groupId]: level.users }));
    }

    if (!groupStudents[groupId] || groupStudents[groupId].length === 0) {
      setLoadingStudentsId(groupId);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        });
        if (res.ok) {
          const allUsers = await res.json();
          const filteredStudents = allUsers.filter((u: any) => 
            u.currentLevelId === groupId || 
            u.levelId === groupId || 
            u.level?.id === groupId ||
            (u.role === 'STUDENT' && (u.currentLevelId === groupId || u.levelId === groupId))
          );
          setGroupStudents(prev => ({ ...prev, [groupId]: filteredStudents }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingStudentsId(null);
      }
    }
  };

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
    setName(''); setStartDate(''); setLevelCode('Basico1'); setModality('GROUP'); setRhythm('REGULAR');
    setMaxStudents(8); setTeacherId(''); setZoomHostId(''); setZoomLink(''); setZoomMode('host');
    setSelectedDays([]); setSameTime(true); setUniformStart(''); setUniformEnd('');
    setPerDay({}); setEditingId(null); setShowManualTime(false);
  };

  const openCreateModal = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    resetForm();
    setIsFormModalOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFormModalOpen) {
        closeFormModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFormModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showError('Nombre Requerido', 'Debes ingresar un nombre para el grupo (Ej. Grupo París).');
      return;
    }
    if (!startDate) {
      showError('Fecha de Inicio Requerida', 'Debes seleccionar la fecha de inicio del grupo.');
      return;
    }
    if (!teacherId) {
      showError('Profesor Requerido', 'Debes asignar un profesor responsable para este grupo.');
      return;
    }
    if (selectedDays.length === 0) {
      showError('Horario Requerido', 'Debes seleccionar al menos un día de clase para definir el horario del grupo.');
      return;
    }
    if (sameTime && (!uniformStart || !uniformEnd)) {
      showError('Horario Incompleto', 'Por favor selecciona la hora de inicio y fin para los días de clase.');
      return;
    }
    if (zoomMode === 'host' && !zoomHostId) {
      showError('Enlace de Zoom Requerido', 'Debes seleccionar una cuenta de Zoom asignada para el grupo.');
      return;
    }
    if (zoomMode === 'manual' && !zoomLink.trim()) {
      showError('Enlace de Zoom Requerido', 'Debes ingresar el enlace de Zoom manual.');
      return;
    }

    setIsSubmitting(true);

    const schedule = buildScheduleString(selectedDays, sameTime, uniformStart, uniformEnd, perDay);

    try {
      const url = editingId
        ? `${import.meta.env.VITE_API_URL}/admin/levels/${editingId}`
        : `${import.meta.env.VITE_API_URL}/admin/levels`;
      const method = editingId ? 'PATCH' : 'POST';

      const body: any = {
        name, levelCode, modality, schedule: schedule || null,
        startDate: startDate ? new Date(`${startDate}T12:00:00Z`).toISOString() : null,
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

      if (res.ok) {
        showSuccess(editingId ? 'Grupo actualizado con éxito' : 'Grupo creado con éxito');
        closeFormModal();
        fetchData();
      } else {
        const error = await res.json();
        showError('Error al guardar', error.message);
      }
    } catch (e) {
      console.error(e);
      showError('Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (level: any) => {
    setName(level.name);
    if (level.startDate) {
      const raw = typeof level.startDate === 'string' ? level.startDate : new Date(level.startDate).toISOString();
      setStartDate(raw.split('T')[0]);
    } else {
      setStartDate('');
    }
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
    setIsFormModalOpen(true);
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

      {/* ── Table Container (100% Width) ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-[#1D3A8A]" />
            <h2 className="text-xl font-bold text-slate-800">Grupos Activos</h2>
            <span className="text-xs font-extrabold bg-blue-50 text-[#1D3A8A] px-2.5 py-1 rounded-full border border-blue-200">
              {filteredLevels.length} {filteredLevels.length === 1 ? 'grupo' : 'grupos'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Buscador de Grupos */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={groupSearchTerm}
                onChange={(e) => setGroupSearchTerm(e.target.value)}
                placeholder="Buscar grupo, nivel, profesor..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]/20 focus:border-[#1D3A8A] transition-all shadow-2xs"
              />
              {groupSearchTerm && (
                <button
                  type="button"
                  onClick={() => setGroupSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Limpiar búsqueda"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Botón Nuevo Grupo */}
            <button
              type="button"
              onClick={openCreateModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1D3A8A] hover:bg-blue-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all whitespace-nowrap cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Grupo</span>
            </button>
          </div>
        </div>

        {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 text-[#1D3A8A] animate-spin" /></div>
          ) : levels.length === 0 ? (
            <div className="text-center py-12">
              <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No hay grupos creados aún.</p>
            </div>
          ) : filteredLevels.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No se encontraron grupos</p>
              <p className="text-xs text-slate-400">
                No hay ningún grupo que coincida con <span className="font-semibold text-slate-600">"{groupSearchTerm}"</span>
              </p>
              <button
                type="button"
                onClick={() => setGroupSearchTerm('')}
                className="mt-3 px-3.5 py-1.5 text-xs font-bold text-[#1D3A8A] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200 shadow-2xs"
              >
                Limpiar filtro de búsqueda
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-100/80 text-slate-700 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 whitespace-nowrap">Grupo</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Nivel</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Modalidad</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Fecha de Inicio</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Profesor</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Alumnos</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Horario</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Enlace Zoom</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredLevels.map(level => {
                    const mod = MODALITIES.find(m => m.value === level.modality);
                    const rhy = RHYTHMS.find(r => r.value === level.rhythm);
                    const studentsList = groupStudents[level.id] || level.users || [];
                    const countUsers = level._count?.users || studentsList.length || 0;
                    const startDateFormatted = formatStartDate(level.startDate);

                    return (
                        <tr key={level.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Grupo & Button Ver Alumnos */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1.5">
                              <span
                                onClick={() => openGroupStudents(level)}
                                className="font-bold text-slate-800 text-base hover:text-[#1D3A8A] cursor-pointer transition-colors"
                              >
                                {level.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => openGroupStudents(level)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all w-fit bg-blue-50 text-[#1D3A8A] hover:bg-blue-100 border border-blue-200 shadow-2xs hover:shadow-xs"
                              >
                                <Users className="w-3.5 h-3.5" />
                                <span>Ver Alumnos ({countUsers})</span>
                              </button>
                            </div>
                          </td>

                          {/* Nivel */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className="text-xs font-extrabold bg-[#1D3A8A]/10 text-[#1D3A8A] px-3 py-1 rounded-full border border-[#1D3A8A]/20">
                              {level.levelCode?.replace('Basico', 'Básico ').replace('Inter', 'Intermedio ').replace('Avanz', 'Avanzado ')}
                            </span>
                          </td>

                          {/* Modalidad */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm">{mod?.icon || '👥'}</span>
                              <span className="text-xs font-semibold text-slate-700">{mod?.label || 'Grupal'}</span>
                            </div>
                            {rhy && <p className="text-[11px] text-slate-400 mt-0.5">{rhy.label}</p>}
                          </td>

                          {/* Fecha de Inicio */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border w-fit ${
                              startDateFormatted !== '—'
                                ? 'bg-blue-50/70 text-[#1D3A8A] border-blue-200/70 shadow-2xs'
                                : 'bg-slate-50 text-slate-400 border-slate-200'
                            }`}>
                              <Calendar className="w-3.5 h-3.5 text-[#1D3A8A]" />
                              <span>{startDateFormatted}</span>
                            </div>
                          </td>

                          {/* Profesor */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            {level.teacher ? (
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                                  {level.teacher.firstName?.charAt(0)}
                                </div>
                                <span className="text-xs font-bold text-slate-700">
                                  {level.teacher.firstName} {level.teacher.lastName}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 font-medium">— Sin asignar —</span>
                            )}
                          </td>

                          {/* Alumnos Count */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-xs font-extrabold text-slate-800">
                                {countUsers}/{level.maxStudents || 8}
                              </span>
                              <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                                <div
                                  className="bg-[#1D3A8A] h-2 rounded-full transition-all"
                                  style={{ width: `${Math.min(100, (countUsers / (level.maxStudents || 8)) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Horario */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            {level.schedule ? (
                              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 w-fit">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>{level.schedule}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>

                          {/* Enlace Zoom */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            {level.zoomHostGroup ? (
                              <a href={level.zoomHostGroup.permanentLink || level.zoomLink} target="_blank" rel="noopener noreferrer"
                                className="text-xs font-bold text-[#2D8CFF] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 inline-flex items-center gap-1.5 transition-colors" title={level.zoomHostGroup.permanentLink}>
                                <Video className="w-3.5 h-3.5" /> {level.zoomHostGroup.displayName}
                              </a>
                            ) : level.zoomLink ? (
                              <a href={level.zoomLink} target="_blank" rel="noopener noreferrer"
                                className="text-xs font-bold text-[#2D8CFF] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 inline-flex items-center gap-1.5 transition-colors">
                                <LinkIcon className="w-3.5 h-3.5" /> Manual
                              </a>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>

                          {/* Acciones */}
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <div className="flex justify-end items-center gap-1.5">
                              <button onClick={(e) => { e.stopPropagation(); handleEdit(level); }}
                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-transparent hover:border-blue-200" title="Editar grupo">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleDelete(level.id); }}
                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-200" title="Eliminar grupo">
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

      {/* ── Modal Popup: Crear / Editar Grupo ── */}
      {isFormModalOpen && (
        <div
          onClick={closeFormModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col my-auto max-h-[92vh] cursor-default animate-in zoom-in-95 duration-200 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1D3A8A] text-white flex items-center justify-center font-bold shadow-md">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    {editingId ? 'Editar Grupo' : 'Nuevo Grupo'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {editingId ? 'Modifica los parámetros y horario del grupo seleccionado.' : 'Completa la información para aperturar un nuevo grupo.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeFormModal}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                title="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(92vh-140px)]">
                {/* Name & Start Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Nombre del Grupo <span className="text-red-500">*</span>
                    </label>
                    <input
                      required type="text" placeholder="Ej. Grupo París, Grupo Lyon..."
                      value={name} onChange={e => setName(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#1D3A8A]" /> Fecha de Inicio <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="date"
                      value={startDate} onChange={e => setStartDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50 text-sm cursor-pointer"
                    />
                  </div>
                </div>

                {/* Modality selector */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Modalidad</label>
                  <div className="grid grid-cols-3 gap-2">
                    {MODALITIES.map(m => (
                      <button
                        key={m.value} type="button"
                        onClick={() => setModality(m.value)}
                        className={`py-2 px-1 rounded-xl text-center transition-all text-sm border-2 cursor-pointer ${
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Level Code */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nivel</label>
                    <select value={levelCode} onChange={e => setLevelCode(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl py-2 px-3 bg-slate-50 text-sm">
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
                      className="w-full border border-slate-200 rounded-xl py-2 px-3 bg-slate-50 text-sm disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Rhythm (only for GROUP) */}
                {modality === 'GROUP' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Ritmo de Estudio</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {RHYTHMS.map(r => (
                        <label key={r.value}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer border transition-all ${
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
                            className="accent-[#1D3A8A] mt-0.5"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-800">{r.label}</p>
                            <p className="text-[11px] text-slate-500 leading-tight">{r.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Teacher */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> Profesor Asignado <span className="text-red-500">*</span>
                    </label>
                    <select required value={teacherId} onChange={e => setTeacherId(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl py-2 px-3 bg-slate-50 text-sm">
                      <option value="">Selecciona un profesor...</option>
                      {teachers.map((t: any) => (
                        <option key={t.id} value={t.id}>
                          {t.firstName} {t.lastName} ({t.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Zoom Link */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-[#2D8CFF]" /> Enlace Zoom <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-1">
                        <button type="button" onClick={() => setZoomMode('host')}
                          className={`text-[11px] px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${zoomMode === 'host' ? 'bg-[#2D8CFF] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                          Cuenta
                        </button>
                        <button type="button" onClick={() => setZoomMode('manual')}
                          className={`text-[11px] px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${zoomMode === 'manual' ? 'bg-[#2D8CFF] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                          Manual
                        </button>
                      </div>
                    </div>

                    {zoomMode === 'host' ? (
                      <>
                        <select required={zoomMode === 'host'} value={zoomHostId} onChange={e => setZoomHostId(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl py-2 px-3 bg-slate-50 text-sm">
                          <option value="">Selecciona cuenta de Zoom...</option>
                          {zoomHosts.map((h: any) => (
                            <option key={h.id} value={h.id}>
                              🟢 {h.displayName} ({h.email.split('@')[0]})
                              {h._count?.assignedGroups > 0 ? ` · ${h._count.assignedGroups} grupo(s)` : ''}
                            </option>
                          ))}
                        </select>

                        {!showAddZoom ? (
                          <button type="button" onClick={() => setShowAddZoom(true)}
                            className="mt-1.5 text-xs text-[#2D8CFF] hover:text-blue-700 flex items-center gap-1 font-semibold cursor-pointer">
                            <Plus className="w-3 h-3" /> Agregar nueva cuenta Zoom
                          </button>
                        ) : (
                          <div className="mt-2 p-3 border border-[#2D8CFF]/30 rounded-xl bg-blue-50/50 space-y-2">
                            <div className="flex justify-between items-center">
                              <p className="text-xs font-bold text-[#2D8CFF]">Nueva Cuenta Zoom</p>
                              <button type="button" onClick={() => { setShowAddZoom(false); setNewZoom({ displayName: '', email: '', permanentLink: '' }); }}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer">
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
                              className="w-full py-1.5 rounded-lg text-xs font-bold bg-[#2D8CFF] text-white hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 cursor-pointer">
                              {addingZoom ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                              Guardar Enlace
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <input type="url" required={zoomMode === 'manual'} placeholder="https://zoom.us/j/..."
                          value={zoomLink} onChange={e => setZoomLink(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl py-2 px-3 bg-slate-50 text-sm" />
                        <p className="text-xs text-slate-400 mt-1">Pega un enlace de Zoom manualmente.</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Schedule */}
                <div className="border-t border-dashed border-slate-200 pt-3">
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#1D3A8A]" /> Horario de Clases <span className="text-red-500">*</span>
                  </label>

                  {/* Day picker */}
                  {modality === 'GROUP' && rhythm === 'REGULAR' ? (
                    <div className="flex flex-wrap gap-2 mb-3">
                      <button type="button" onClick={() => setSelectedDays(['Lun', 'Mié', 'Vie'])}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${JSON.stringify(selectedDays) === JSON.stringify(['Lun', 'Mié', 'Vie']) ? 'bg-[#1D3A8A] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        Lunes, Miércoles y Viernes
                      </button>
                      <button type="button" onClick={() => setSelectedDays(['Mié', 'Jue', 'Vie'])}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${JSON.stringify(selectedDays) === JSON.stringify(['Mié', 'Jue', 'Vie']) ? 'bg-[#1D3A8A] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        Miércoles, Jueves y Viernes
                      </button>
                    </div>
                  ) : modality === 'GROUP' ? (
                    <div className="flex items-center gap-2 mb-3">
                      {selectedDays.map(day => (
                        <div key={day} className="w-8 h-8 rounded-full font-bold text-xs bg-[#1D3A8A] text-white shadow-xs flex items-center justify-center cursor-default">
                          {DAYS.find(d => d.key === day)?.label || day}
                        </div>
                      ))}
                      <span className="text-xs text-slate-500 ml-1">(Días predefinidos por ritmo)</span>
                    </div>
                  ) : (
                    <div className="flex gap-2 mb-3">
                      {DAYS.map(d => (
                        <button key={d.key} type="button" 
                          onClick={() => toggleDay(d.key)}
                          className={`w-8 h-8 rounded-full font-bold text-xs transition-all cursor-pointer ${
                            selectedDays.includes(d.key)
                              ? 'bg-[#1D3A8A] text-white shadow-xs'
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
                          className="accent-[#1D3A8A] w-4 h-4 cursor-pointer"
                        />
                        <span className="text-xs font-medium text-slate-600">Misma hora todos los días seleccionados</span>
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
                              <button type="button" onClick={() => setShowManualTime(false)} className="text-xs text-blue-600 mt-1 hover:underline cursor-pointer">
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
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 flex justify-end items-center gap-3 sticky bottom-0">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#1D3A8A] hover:bg-blue-800 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 active:scale-98 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : editingId ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Guardar Cambios</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Crear Grupo</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Slide-Over Modal: Alumnos del Grupo ── */}
      {selectedGroupForStudents && (
        <div 
          onClick={() => setSelectedGroupForStudents(null)}
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300 cursor-default"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1D3A8A] text-white flex items-center justify-center font-bold shadow-md">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                    Alumnos de <span className="text-[#1D3A8A]">{selectedGroupForStudents.name}</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedGroupForStudents.levelCode} · Profesor: {selectedGroupForStudents.teacher ? `${selectedGroupForStudents.teacher.firstName} ${selectedGroupForStudents.teacher.lastName}` : 'Sin asignar'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGroupForStudents(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1D3A8A]">
                  <Users className="w-4 h-4" /> Capacidad del Grupo
                </div>
                <span className="text-xs font-extrabold bg-white text-[#1D3A8A] px-3 py-1 rounded-full border border-blue-200 shadow-xs">
                  {currentGroupStudents.length}/{selectedGroupForStudents.maxStudents || 8} Alumnos
                </span>
              </div>

              {/* Buscador de Alumnos en el Grupo */}
              {currentGroupStudents.length > 0 && (
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    placeholder="Buscar alumno por nombre, correo o WhatsApp..."
                    className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]/20 focus:border-[#1D3A8A] transition-all shadow-2xs"
                  />
                  {studentSearchTerm && (
                    <button
                      type="button"
                      onClick={() => setStudentSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                      title="Limpiar búsqueda"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {loadingStudentsId === selectedGroupForStudents.id ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500 text-sm font-semibold">
                  <Loader2 className="w-8 h-8 text-[#1D3A8A] animate-spin" />
                  <span>Obteniendo alumnos asignados...</span>
                </div>
              ) : currentGroupStudents.length === 0 ? (
                <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                  <Users className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-600">No hay alumnos asignados aún</p>
                  <p className="text-xs text-slate-400">Puedes asignar alumnos desde el módulo CRM o desde la gestión de Usuarios.</p>
                </div>
              ) : filteredGroupStudents.length === 0 ? (
                <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                  <Search className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-600">No se encontraron alumnos para "{studentSearchTerm}"</p>
                  <button
                    type="button"
                    onClick={() => setStudentSearchTerm('')}
                    className="px-3 py-1 rounded-lg text-xs font-bold text-[#1D3A8A] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                  >
                    Limpiar búsqueda
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredGroupStudents.map((st: any) => {
                    const fullName = `${st.firstName || st.name?.split(' ')[0] || 'Alumno'} ${st.lastName || st.name?.split(' ').slice(1).join(' ') || ''}`.trim();
                    const enrolledDate = st.createdAt || st.enrollmentDate 
                      ? new Date(st.createdAt || st.enrollmentDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
                      : '—';
                    const phone = st.phone || st.whatsapp;

                    return (
                      <div
                        key={st.id || st.email}
                        onClick={() => setSelectedStudentForDetail(st)}
                        className="group/card bg-slate-50/80 hover:bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#1D3A8A] shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3 relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 bottom-0 w-1 bg-transparent group-hover/card:bg-[#1D3A8A] transition-colors" />

                        {/* Header Student Info: Nombre Completo & Estado */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#1D3A8A] group-hover/card:bg-blue-800 text-white flex items-center justify-center font-extrabold text-sm shadow-sm flex-shrink-0 transition-colors">
                              {fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Alumno</span>
                                <span className="text-[9px] font-bold text-[#1D3A8A] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 opacity-80 group-hover/card:opacity-100 transition-opacity flex items-center gap-0.5">
                                  Ver Ficha ➔
                                </span>
                              </div>
                              <p className="font-extrabold text-slate-800 text-sm group-hover/card:text-[#1D3A8A] transition-colors">{fullName}</p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                            st.isActive === false 
                              ? 'bg-rose-50 text-rose-700 border-rose-200' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {st.isActive === false ? 'Inactivo ❌' : 'Activo / Inscrito ✅'}
                          </span>
                        </div>

                        {/* Details grid: Correo & Fecha de Inscripción */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                          <div>
                            <span className="text-slate-400 font-semibold block text-[11px]">Correo Electrónico:</span>
                            <span className="font-bold text-slate-700 hover:text-blue-600 truncate block">
                              {st.email || '— Sin correo registrado —'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold block text-[11px]">Fecha de Inscripción:</span>
                            <span className="font-bold text-slate-700 block">
                              🗓️ {enrolledDate}
                            </span>
                          </div>
                        </div>

                        {/* Card action footer: Click instruction + WhatsApp link */}
                        <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 text-xs">
                          <span className="text-[11px] font-semibold text-slate-400 group-hover/card:text-[#1D3A8A] flex items-center gap-1 transition-colors">
                            <Info className="w-3 h-3 text-[#1D3A8A]" /> Clic para abrir ficha completa
                          </span>
                          {phone && (
                            <a
                              href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1 text-[11px] font-bold shadow-2xs"
                              title="Chatear por WhatsApp"
                            >
                              💬 WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedGroupForStudents(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
              >
                Cerrar Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Ficha Detallada del Alumno ── */}
      {selectedStudentForDetail && (
        <div 
          onClick={() => setSelectedStudentForDetail(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200 cursor-default flex flex-col max-h-[90vh]"
          >
            {/* Header con estilo Real francés */}
            <div className="bg-gradient-to-br from-[#1D3A8A] via-[#1e40af] to-[#0f172a] p-6 text-white relative">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D92534] to-[#B81B28] text-white font-black text-2xl flex items-center justify-center shadow-lg border-2 border-white/30 flex-shrink-0">
                    {((selectedStudentForDetail.firstName || selectedStudentForDetail.name || 'A')[0]).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/15 px-2 py-0.5 rounded-md text-white border border-white/20">
                        🎓 Alumno
                      </span>
                      <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md border ${
                        selectedStudentForDetail.isActive === false
                          ? 'bg-rose-500/20 text-rose-200 border-rose-400/30'
                          : 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
                      }`}>
                        {selectedStudentForDetail.isActive === false ? 'Inactivo' : 'Inscrito / Activo'}
                      </span>
                    </div>
                    <h3 className="text-xl font-black tracking-tight leading-snug">
                      {`${selectedStudentForDetail.firstName || selectedStudentForDetail.name?.split(' ')[0] || ''} ${selectedStudentForDetail.lastName || selectedStudentForDetail.name?.split(' ').slice(1).join(' ') || ''}`.trim() || 'Alumno'}
                    </h3>
                    <p className="text-xs text-blue-200 font-medium">
                      Portal Les Rois du Français
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStudentForDetail(null)}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  title="Cerrar ficha"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              {/* Sección 1: Información de Contacto */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#1D3A8A]" /> Información de Contacto
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Correo */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mb-1">
                      <Mail className="w-3 h-3 text-[#1D3A8A]" /> Correo Electrónico
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-800 text-xs truncate" title={selectedStudentForDetail.email}>
                        {selectedStudentForDetail.email || '—'}
                      </span>
                      {selectedStudentForDetail.email && (
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedStudentForDetail.email, 'email')}
                          className="p-1 text-slate-400 hover:text-[#1D3A8A] rounded-md transition-colors flex-shrink-0"
                          title="Copiar correo"
                        >
                          {copiedText === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Teléfono / WhatsApp */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mb-1">
                      <Phone className="w-3 h-3 text-[#1D3A8A]" /> Teléfono / WhatsApp
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-800 text-xs">
                        {selectedStudentForDetail.phone || selectedStudentForDetail.whatsapp || '— Sin registrar —'}
                      </span>
                      {(selectedStudentForDetail.phone || selectedStudentForDetail.whatsapp) && (
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedStudentForDetail.phone || selectedStudentForDetail.whatsapp, 'phone')}
                          className="p-1 text-slate-400 hover:text-[#1D3A8A] rounded-md transition-colors flex-shrink-0"
                          title="Copiar teléfono"
                        >
                          {copiedText === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Fecha de Registro */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">Fecha de Registro</span>
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {selectedStudentForDetail.createdAt || selectedStudentForDetail.enrollmentDate
                        ? new Date(selectedStudentForDetail.createdAt || selectedStudentForDetail.enrollmentDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
                        : '—'}
                    </span>
                  </div>

                  {/* ID de Usuario */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">ID de Sistema</span>
                    <span className="font-mono text-slate-600 text-xs truncate block" title={selectedStudentForDetail.id}>
                      {selectedStudentForDetail.id?.substring(0, 8)}...
                    </span>
                  </div>
                </div>
              </div>

              {/* Sección 2: Información Académica del Grupo */}
              {selectedGroupForStudents && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#1D3A8A]" /> Asignación de Grupo
                  </h4>
                  <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-800 text-sm">
                        {selectedGroupForStudents.name}
                      </span>
                      <span className="text-xs font-extrabold bg-[#1D3A8A] text-white px-2.5 py-0.5 rounded-full">
                        {selectedGroupForStudents.levelCode?.replace('Basico', 'Básico ').replace('Inter', 'Intermedio ').replace('Avanz', 'Avanzado ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div>
                        <span className="text-slate-400 block text-[11px] font-medium">Profesor:</span>
                        <span className="font-bold text-slate-700">
                          {selectedGroupForStudents.teacher 
                            ? `${selectedGroupForStudents.teacher.firstName} ${selectedGroupForStudents.teacher.lastName}` 
                            : '— Sin asignar —'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px] font-medium">Horario:</span>
                        <span className="font-bold text-slate-700">
                          {selectedGroupForStudents.schedule || '— Sin horario —'}
                        </span>
                      </div>
                    </div>

                    {(selectedGroupForStudents.zoomHostGroup?.permanentLink || selectedGroupForStudents.zoomLink) && (
                      <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                          <Video className="w-3.5 h-3.5 text-[#2D8CFF]" /> Enlace de Zoom
                        </span>
                        <a
                          href={selectedGroupForStudents.zoomHostGroup?.permanentLink || selectedGroupForStudents.zoomLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-extrabold text-[#2D8CFF] hover:underline flex items-center gap-1"
                        >
                          Abrir Zoom <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer con Acciones Rápidas */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {(selectedStudentForDetail.phone || selectedStudentForDetail.whatsapp) && (
                  <a
                    href={`https://wa.me/${(selectedStudentForDetail.phone || selectedStudentForDetail.whatsapp).replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    💬 WhatsApp
                  </a>
                )}
                {selectedStudentForDetail.email && (
                  <a
                    href={`mailto:${selectedStudentForDetail.email}`}
                    className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" /> Enviar Correo
                  </a>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentForDetail(null)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
