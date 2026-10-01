import { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Loader2, Plus, Clock, Link as LinkIcon, BookOpen, Search, 
  Trash2, Edit2, X, Check, Video, AlertTriangle, AlertCircle, Users,
  Repeat, Sparkles, CheckCircle2, CalendarDays, Layers, Zap, Eye, EyeOff, CheckSquare,
  User, Settings, ArrowLeft, ArrowRight
} from 'lucide-react';
import { ScheduleCalendar } from './components/ScheduleCalendar';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';

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

  // Mode: Single class vs Recurring series
  const [scheduleMode, setScheduleMode] = useState<'single' | 'recurring'>('recurring');

  // Recurring series state
  const [recurringPreset, setRecurringPreset] = useState<'LMV' | 'MJV' | 'LV' | 'SAT' | 'CUSTOM'>('LMV');
  const [selectedRecurrenceDays, setSelectedRecurrenceDays] = useState<number[]>([1, 3, 5]); // 1=Lun, 3=Mié, 5=Vie
  const [recurringStartDate, setRecurringStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [endCondition, setEndCondition] = useState<'weeks' | 'count' | 'endDate'>('weeks');
  const [repeatWeeks, setRepeatWeeks] = useState(4);
  const [totalSessions, setTotalSessions] = useState(12);
  const [recurringEndDate, setRecurringEndDate] = useState('');
  const [hasManualEndDate, setHasManualEndDate] = useState(false);
  const [recurringStartTime, setRecurringStartTime] = useState('10:00');
  const [isManualTime, setIsManualTime] = useState(false);
  const [recurringDuration, setRecurringDuration] = useState(3000); // 50 min
  const [recurringTitleTemplate, setRecurringTitleTemplate] = useState('Clase {n}');
  const [recurringModuleName, setRecurringModuleName] = useState('Unidad 1');
  const [excludedDates, setExcludedDates] = useState<string[]>([]);
  const [showPreviewList, setShowPreviewList] = useState(true);

  // Batch deletion of classes
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [batchDeleteConfirm, setBatchDeleteConfirm] = useState(false);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);

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
      // 1. Direct Supabase fetch for Level (guarantees real startDate)
      const sbLevelsMap = new Map<string, any>();
      try {
        const { data: sbLevels, error: sbErr } = await supabase
          .from('Level')
          .select('*');
        if (!sbErr && sbLevels && Array.isArray(sbLevels)) {
          sbLevels.forEach((sl: any) => sbLevelsMap.set(sl.id, sl));
        }
      } catch (_) {}

      const [levelsRes, scheduleRes, hostsRes, teachersRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/admin/levels`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        }).catch(() => null),
        fetch(`${import.meta.env.VITE_API_URL}/admin/schedule`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        }).catch(() => null),
        fetch(`${import.meta.env.VITE_API_URL}/admin/zoom/hosts`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        }).catch(() => null),
        fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        }).catch(() => null),
      ]);
      
      if (levelsRes && levelsRes.ok) {
        const rawLevels = await levelsRes.json();
        const enrichedLevels = rawLevels.map((lvl: any) => {
          const sbMatch = sbLevelsMap.get(lvl.id);
          return {
            ...lvl,
            startDate: lvl.startDate || sbMatch?.startDate || null,
          };
        });
        setLevels(enrichedLevels);
      } else if (sbLevelsMap.size > 0) {
        setLevels(Array.from(sbLevelsMap.values()));
      }

      if (scheduleRes && scheduleRes.ok) setScheduledClasses(await scheduleRes.json());
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
        const cHostId = c.zoomHostId || c.zoomHost?.id || c.module?.level?.zoomHostId;
        if (cHostId !== zoomToUse || c.id === editingId) return false;
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

      // Include either zoomHostId, group's permanent link, or manual URL
      const selectedLevelData = levels.find((l: any) => l.id === formData.levelId);
      const targetHostId = formData.zoomHostId || (!isZoomOverridden ? selectedLevelData?.zoomHostId : null);
      const selectedHost = zoomHosts.find((h: any) => h.id === targetHostId);
      const groupZoomLink = selectedLevelData?.zoomLink || selectedLevelData?.zoomHostGroup?.permanentLink || selectedHost?.permanentLink || null;

      if (targetHostId) {
        body.zoomHostId = targetHostId;
      }
      if (formData.url) {
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
    // Instant optimistic UI feedback: remove immediately from list
    setDeleteConfirm({ show: false, id: null });
    setSelectedClassIds(prev => prev.filter(x => x !== id));
    setScheduledClasses(prev => prev.filter(x => x.id !== id));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/schedule/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (!res.ok) {
        fetchData();
        setCustomAlert({ show: true, message: 'No se pudo eliminar la clase.', type: 'error' });
      }
    } catch (e) {
      console.error(e);
      fetchData();
      setCustomAlert({ show: true, message: 'Error de conexión al eliminar la clase.', type: 'error' });
    }
  };

  const handleBatchDelete = async () => {
    if (selectedClassIds.length === 0) return;
    const idsToDelete = [...selectedClassIds];
    const count = idsToDelete.length;

    // Instant optimistic removal from UI
    setBatchDeleteConfirm(false);
    setSelectedClassIds([]);
    setIsSelectionMode(false);
    setScheduledClasses(prev => prev.filter(x => !idsToDelete.includes(x.id)));

    setIsBatchDeleting(true);
    try {
      let res = await fetch(`${import.meta.env.VITE_API_URL}/admin/schedule/batch-delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: idsToDelete })
      });

      // Fallback resiliente si el backend remoto aún no tiene desplegado batch-delete
      if (res.status === 404) {
        await Promise.all(
          idsToDelete.map(id =>
            fetch(`${import.meta.env.VITE_API_URL}/admin/schedule/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${session?.access_token}` }
            })
          )
        );
        setCustomAlert({
          show: true,
          message: `¡Listo! Se han eliminado ${count} clases exitosamente.`,
          type: 'success'
        });
        return;
      }

      if (res.ok) {
        setCustomAlert({
          show: true,
          message: `¡Listo! Se han eliminado ${count} clases exitosamente.`,
          type: 'success'
        });
      } else {
        fetchData();
        const error = await res.json().catch(() => ({}));
        setCustomAlert({
          show: true,
          message: error.message || 'Error al eliminar las clases seleccionadas.',
          type: 'error'
        });
      }
    } catch (e) {
      console.error(e);
      fetchData();
      setCustomAlert({
        show: true,
        message: 'Error de conexión al eliminar clases en lote.',
        type: 'error'
      });
    } finally {
      setIsBatchDeleting(false);
    }
  };

  const handleEdit = (cls: any) => {
    const dt = new Date(cls.scheduledAt);
    const dateStr = dt.toISOString().split('T')[0];
    const timeStr = dt.toTimeString().substring(0, 5);
    const resolvedZoomHostId = cls.zoomHostId || cls.zoomHost?.id || cls.module?.level?.zoomHostId || '';
    const resolvedTeacherId = cls.teacherId || cls.teacher?.id || cls.module?.level?.teacherId || '';

    setFormData({
      levelId: cls.module?.levelId || '',
      moduleId: cls.moduleId || '',
      moduleName: cls.module?.title || '',
      title: cls.title || '',
      url: cls.url || '',
      zoomHostId: resolvedZoomHostId,
      teacherId: resolvedTeacherId,
      scheduledAtDate: dateStr,
      scheduledAtTime: timeStr,
      durationExpected: cls.durationExpected || 3600
    });
    setEditingId(cls.id);
    setActiveTab('form');
    setIsZoomOverridden(!!cls.zoomHostId && cls.zoomHostId !== cls.module?.level?.zoomHostId);
    setIsTeacherOverridden(!!cls.teacherId && cls.teacherId !== cls.module?.level?.teacherId);
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
      const cHostId = c.zoomHostId || c.zoomHost?.id || c.module?.level?.zoomHostId;
      if (cHostId !== hostId || c.id === editingId) return false;
      const start1 = new Date(c.scheduledAt).getTime();
      const end1 = start1 + (c.durationExpected || 3600) * 1000;
      return start1 < end2 && end1 > start2;
    });
  };

  // Group selection with auto-detection of presets, hours, start date and duration
  const handleGroupSelect = (levelId: string) => {
    const lvl = levels.find((l: any) => l.id === levelId);
    setFormData((prev: any) => ({
      ...prev,
      levelId,
      moduleId: '',
      teacherId: lvl?.teacherId || '',
      zoomHostId: lvl?.zoomHostId || ''
    }));
    setIsTeacherOverridden(false);
    setIsZoomOverridden(false);

    if (!lvl) return;

    const sched = (lvl.schedule || '').toLowerCase();
    
    // 1. Intensivo (Lunes a Viernes - 5 días)
    if (
      lvl.rhythm === 'INTENSIVE' ||
      sched.includes('intensiv') ||
      (sched.includes('mar') && sched.includes('jue') && sched.includes('lun')) ||
      (sched.includes('lun') && sched.includes('vier') && sched.includes('mar'))
    ) {
      setRecurringPreset('LV');
      setSelectedRecurrenceDays([1, 2, 3, 4, 5]);
      setTotalSessions(20);
    } 
    // 2. Sabatino (Sábado - 1 día)
    else if (lvl.rhythm === 'SATURDAY' || sched.includes('sab') || sched.includes('sáb')) {
      setRecurringPreset('SAT');
      setSelectedRecurrenceDays([6]);
      setTotalSessions(4);
    } 
    // 3. Miércoles, Jueves y Viernes (3 días)
    else if (sched.includes('jue') && !sched.includes('lun') && (sched.includes('mie') || sched.includes('mié'))) {
      setRecurringPreset('MJV');
      setSelectedRecurrenceDays([3, 4, 5]);
      setTotalSessions(12);
    } 
    // 4. Lunes, Miércoles y Viernes (3 días por defecto)
    else {
      setRecurringPreset('LMV');
      setSelectedRecurrenceDays([1, 3, 5]);
      setTotalSessions(12);
    }

    const timeMatch = lvl.schedule?.match(/\d{2}:\d{2}/);
    if (timeMatch) {
      setRecurringStartTime(timeMatch[0]);
    }
    setIsManualTime(false);

    if (lvl.rhythm === 'SATURDAY') {
      setRecurringDuration(10200); // 2h50
    } else {
      setRecurringDuration(3000); // 50 min
    }

    if (lvl.startDate) {
      const sDate = new Date(lvl.startDate).toISOString().substring(0, 10);
      setRecurringStartDate(sDate);
    }

    setHasManualEndDate(false);
    const groupTitle = lvl.name || lvl.levelCode || 'Clase';
    setRecurringTitleTemplate(`${groupTitle} - Clase {n}`);
  };

  const generatedSessions = useMemo(() => {
    if (scheduleMode !== 'recurring' || !formData.levelId || !recurringStartDate || !recurringStartTime) {
      return [];
    }

    const [y, m, d] = recurringStartDate.split('-').map(Number);
    if (!y || !m || !d) return [];

    const sessions: Array<{
      index: number;
      dateStr: string;
      isoString: string;
      dayName: string;
      formattedDate: string;
      isExcluded: boolean;
      hasConflict: boolean;
      conflictMessage: string;
    }> = [];

    const current = new Date(y, m - 1, d);
    const maxIterations = 365;
    let count = 0;
    let iteration = 0;

    const endDateLimit = endCondition === 'endDate' && recurringEndDate ? new Date(`${recurringEndDate}T23:59:59`) : null;
    const maxWeeksLimit = endCondition === 'weeks' ? repeatWeeks : null;
    const startDateTimestamp = current.getTime();

    const selectedLvl = levels.find((l: any) => l.id === formData.levelId);
    const targetTeacherId = isTeacherOverridden ? formData.teacherId : (formData.teacherId || selectedLvl?.teacherId || null);
    const targetZoomId = isZoomOverridden ? formData.zoomHostId : (formData.zoomHostId || selectedLvl?.zoomHostId || null);

    while (iteration < maxIterations) {
      iteration++;
      const dayOfWeek = current.getDay();

      if (selectedRecurrenceDays.includes(dayOfWeek)) {
        const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
        const [timeH, timeM] = recurringStartTime.split(':').map(Number);
        const sessionDate = new Date(current.getFullYear(), current.getMonth(), current.getDate(), timeH || 0, timeM || 0, 0);
        const sessionIso = sessionDate.toISOString();

        if (endDateLimit && sessionDate > endDateLimit) break;
        if (maxWeeksLimit) {
          const diffDays = Math.floor((current.getTime() - startDateTimestamp) / (1000 * 60 * 60 * 24));
          if (diffDays >= maxWeeksLimit * 7) break;
        }

        const isExcluded = excludedDates.includes(dateStr);

        const sStart = sessionDate.getTime();
        const sEnd = sStart + Number(recurringDuration) * 1000;

        let hasConflict = false;
        let conflictMsg = '';

        if (targetTeacherId) {
          const teacherClash = scheduledClasses.some((c: any) => {
            const cTid = c.teacherId || c.module?.level?.teacherId;
            if (cTid !== targetTeacherId) return false;
            const c1 = new Date(c.scheduledAt).getTime();
            const c2 = c1 + (c.durationExpected || 3600) * 1000;
            return sStart < c2 && sEnd > c1;
          });
          if (teacherClash) {
            hasConflict = true;
            conflictMsg = 'Profesor ocupado';
          }
        }

        if (!hasConflict && targetZoomId) {
          const zoomClash = scheduledClasses.some((c: any) => {
            const cHostId = c.zoomHostId || c.zoomHost?.id || c.module?.level?.zoomHostId;
            if (cHostId !== targetZoomId) return false;
            const c1 = new Date(c.scheduledAt).getTime();
            const c2 = c1 + (c.durationExpected || 3600) * 1000;
            return sStart < c2 && sEnd > c1;
          });
          if (zoomClash) {
            hasConflict = true;
            conflictMsg = 'Zoom ocupado';
          }
        }

        count++;
        sessions.push({
          index: count,
          dateStr,
          isoString: sessionIso,
          dayName: sessionDate.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase(),
          formattedDate: sessionDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
          isExcluded,
          hasConflict,
          conflictMessage: conflictMsg
        });

        if (endCondition === 'count' && count >= totalSessions) break;
      }

      current.setDate(current.getDate() + 1);
    }

    return sessions;
  }, [
    scheduleMode,
    formData.levelId,
    recurringStartDate,
    recurringStartTime,
    selectedRecurrenceDays,
    endCondition,
    repeatWeeks,
    totalSessions,
    excludedDates,
    recurringDuration,
    levels,
    formData.teacherId,
    formData.zoomHostId,
    isTeacherOverridden,
    isZoomOverridden,
    scheduledClasses
  ]);

  // Auto-sync suggested coverage deadline when classes are generated
  useEffect(() => {
    if (!hasManualEndDate && generatedSessions.length > 0) {
      const active = generatedSessions.filter(s => !s.isExcluded);
      if (active.length > 0) {
        const lastDateStr = active[active.length - 1].dateStr;
        const [ly, lm, ld] = lastDateStr.split('-').map(Number);
        const dt = new Date(ly, lm - 1, ld);
        dt.setDate(dt.getDate() + 7); // + 1 semana de tolerancia para cubrir/reponer
        const yy = dt.getFullYear();
        const mm = String(dt.getMonth() + 1).padStart(2, '0');
        const dd = String(dt.getDate()).padStart(2, '0');
        setRecurringEndDate(`${yy}-${mm}-${dd}`);
      }
    }
  }, [generatedSessions, hasManualEndDate]);

  const lastActiveSession = useMemo(() => {
    const active = generatedSessions.filter(s => !s.isExcluded);
    return active.length > 0 ? active[active.length - 1] : null;
  }, [generatedSessions]);

  const isEndDateBeforeLastClass = Boolean(
    lastActiveSession && recurringEndDate && recurringEndDate < lastActiveSession.dateStr
  );

  // Helper para contar cuántas clases de la serie recurrente chocan con un Zoom específico
  const getRecurringZoomConflicts = (hostId: string) => {
    if (!generatedSessions.length) return 0;
    const active = generatedSessions.filter(s => !s.isExcluded);
    let conflictCount = 0;
    for (const session of active) {
      const sStart = new Date(session.isoString).getTime();
      const sEnd = sStart + Number(recurringDuration || 3600) * 1000;
      const clash = scheduledClasses.some((c: any) => {
        const cHostId = c.zoomHostId || c.zoomHost?.id || c.module?.level?.zoomHostId;
        if (cHostId !== hostId) return false;
        const c1 = new Date(c.scheduledAt).getTime();
        const c2 = c1 + (c.durationExpected || 3600) * 1000;
        return sStart < c2 && sEnd > c1;
      });
      if (clash) conflictCount++;
    }
    return conflictCount;
  };

  // Helper para contar cuántas clases de la serie recurrente chocan con un Profesor específico
  const getRecurringTeacherConflicts = (teacherId: string) => {
    if (!generatedSessions.length) return 0;
    const active = generatedSessions.filter(s => !s.isExcluded);
    let conflictCount = 0;
    for (const session of active) {
      const sStart = new Date(session.isoString).getTime();
      const sEnd = sStart + Number(recurringDuration || 3600) * 1000;
      const clash = scheduledClasses.some((c: any) => {
        const cTid = c.teacherId || c.module?.level?.teacherId;
        if (cTid !== teacherId) return false;
        const c1 = new Date(c.scheduledAt).getTime();
        const c2 = c1 + (c.durationExpected || 3600) * 1000;
        return sStart < c2 && sEnd > c1;
      });
      if (clash) conflictCount++;
    }
    return conflictCount;
  };

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.levelId) {
      setCustomAlert({ show: true, message: 'Por favor selecciona un grupo para programar sus clases.', type: 'error' });
      return;
    }

    if (!recurringEndDate) {
      setCustomAlert({ show: true, message: 'Por favor define la Fecha Límite de cobertura para el grupo.', type: 'error' });
      return;
    }

    if (isEndDateBeforeLastClass && lastActiveSession) {
      setCustomAlert({
        show: true,
        message: `La Fecha Límite (${recurringEndDate}) no puede ser anterior a la última clase calculada (${lastActiveSession.formattedDate}). Por favor amplía la fecha límite.`,
        type: 'error'
      });
      return;
    }

    const activeSessions = generatedSessions.filter(s => !s.isExcluded);
    if (activeSessions.length === 0) {
      setCustomAlert({ show: true, message: 'No hay ninguna sesión activa para programar. Revisa los días y rango seleccionados.', type: 'error' });
      return;
    }

    const conflictingSessions = activeSessions.filter(s => s.hasConflict);
    if (conflictingSessions.length > 0) {
      const dates = conflictingSessions.map(s => `• ${s.dayName} ${s.formattedDate} (${s.conflictMessage})`).join('\n');
      setCustomAlert({
        show: true,
        message: `No se pueden programar las clases porque hay ${conflictingSessions.length} fecha(s) que chocan con otra clase:\n\n${dates}\n\nSugerencia: En la lista de fechas de abajo, haz clic en el botón "Excluir" en esa fecha para saltarla y crear las demás, o cambia el horario/Zoom.`,
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedLvl = levels.find((l: any) => l.id === formData.levelId);
      const zoomToUse = isZoomOverridden ? (formData.zoomHostId || null) : (formData.zoomHostId || selectedLvl?.zoomHostId || null);
      const teacherToUse = isTeacherOverridden ? (formData.teacherId || null) : (formData.teacherId || selectedLvl?.teacherId || null);

      const payload = {
        levelId: formData.levelId,
        moduleName: recurringModuleName || 'Unidad 1',
        teacherId: teacherToUse,
        zoomHostId: zoomToUse,
        url: formData.url || null,
        durationExpected: Number(recurringDuration),
        classes: activeSessions.map((s, idx) => ({
          title: recurringTitleTemplate.includes('{n}')
            ? recurringTitleTemplate.replace('{n}', (idx + 1).toString())
            : `${recurringTitleTemplate.trim()} ${idx + 1}`,
          scheduledAt: s.isoString,
          moduleName: recurringModuleName || 'Unidad 1'
        }))
      };

      let res = await fetch(`${import.meta.env.VITE_API_URL}/admin/schedule/batch`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      // Fallback resiliente si el backend remoto responde 404 (endpoint batch aún no desplegado)
      if (res.status === 404) {
        let successCount = 0;
        let lastErrorMsg = '';
        for (const s of payload.classes) {
          const singleRes = await fetch(`${import.meta.env.VITE_API_URL}/admin/schedule`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session?.access_token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              levelId: payload.levelId,
              teacherId: payload.teacherId,
              zoomHostId: payload.zoomHostId,
              durationExpected: payload.durationExpected,
              url: payload.url,
              title: s.title,
              scheduledAt: s.scheduledAt,
              moduleName: s.moduleName
            })
          });
          if (singleRes.ok) {
            successCount++;
          } else {
            const errData = await singleRes.json().catch(() => ({}));
            if (errData.message) lastErrorMsg = errData.message;
          }
        }

        if (successCount > 0) {
          setCustomAlert({
            show: true,
            message: `¡Éxito! Se han programado ${successCount} clases recurrentes exitosamente para el grupo "${selectedLvl?.name}".`,
            type: 'success'
          });
          await fetchData();
          setActiveTab('calendar');
          return;
        } else {
          setCustomAlert({
            show: true,
            message: lastErrorMsg || 'Error al programar las clases recurrentes en el servidor.',
            type: 'error'
          });
          return;
        }
      }

      if (res.ok) {
        const data = await res.json();
        setCustomAlert({
          show: true,
          message: `¡Éxito! Se han programado ${data.count} clases recurrentes exitosamente para el grupo "${selectedLvl?.name}".`,
          type: 'success'
        });
        await fetchData();
        setActiveTab('calendar');
      } else {
        const error = await res.json().catch(() => ({}));
        setCustomAlert({
          show: true,
          message: error.message || 'Error al programar clases en lote',
          type: 'error'
        });
      }
    } catch (err: any) {
      console.error(err);
      setCustomAlert({ show: true, message: 'Error de conexión con el servidor', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      {/* Alert Modal */}
      {customAlert.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center border border-slate-100">
            {customAlert.type === 'success' ? (
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-rose-50 text-rose-500 border border-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs">
                <AlertCircle className="w-8 h-8 text-rose-500" />
              </div>
            )}
            
            <h3 className="text-xl font-black text-slate-800 mb-2">
              {customAlert.type === 'success' ? '¡Operación Exitosa!' : 'Atención'}
            </h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed whitespace-pre-wrap font-medium">
              {customAlert.message}
            </p>

            <button 
              onClick={() => setCustomAlert({show: false, message: '', type: 'error'})}
              className={`w-full py-3.5 rounded-2xl font-bold text-white transition-all shadow-md ${
                customAlert.type === 'success'
                  ? 'bg-gradient-to-r from-[#1D3A8A] to-[#1e40af] hover:from-blue-900 hover:to-blue-800'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {customAlert.type === 'success' ? 'Excelente, Continuar' : 'Entendido'}
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

      {/* Batch Delete Confirm Modal */}
      {batchDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center border border-slate-100">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 border border-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Trash2 className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">¿Eliminar {selectedClassIds.length} clases?</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">
              ¿Estás seguro de que deseas eliminar estas <strong>{selectedClassIds.length} clases</strong> de un jalón? Esta acción liberará los horarios en el calendario.
            </p>
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setBatchDeleteConfirm(false)}
                disabled={isBatchDeleting}
                className="flex-1 py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleBatchDelete}
                disabled={isBatchDeleting}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                {isBatchDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Eliminar todas</span>
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
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#1D3A8A]" />
              {editingId ? 'Editar Clase' : (scheduleMode === 'recurring' ? 'Programar Clases Recurrentes' : 'Nueva Clase Única')}
            </h2>
            {editingId && (
              <button onClick={cancelEdit} className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1">
                <X className="w-4 h-4" /> Cancelar
              </button>
            )}
          </div>

          {/* Mode Switcher: Single vs Recurring */}
          {!editingId && (
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-6 border border-slate-200/60">
              <button
                type="button"
                onClick={() => setScheduleMode('recurring')}
                className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  scheduleMode === 'recurring'
                    ? 'bg-[#1D3A8A] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Clases Recurrentes</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${scheduleMode === 'recurring' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>Serie</span>
              </button>
              <button
                type="button"
                onClick={() => setScheduleMode('single')}
                className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  scheduleMode === 'single'
                    ? 'bg-white text-[#1D3A8A] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Clase Única</span>
              </button>
            </div>
          )}

          {loading && !levels.length ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 text-[#1D3A8A] animate-spin" />
            </div>
          ) : scheduleMode === 'recurring' && !editingId ? (
            /* =========================================================================
               FORMULARIO DE CLASES RECURRENTES (SERIE)
               ========================================================================= */
            <form onSubmit={handleBatchSubmit} className="space-y-5">
              {/* 1. Selector de Grupo con detección automática */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Grupo (Nivel) <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.levelId}
                  onChange={e => handleGroupSelect(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50 font-medium text-slate-800"
                >
                  <option value="">Selecciona un grupo...</option>
                  {levels.map((l: any) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.levelCode}) {l.schedule ? `· ${l.schedule}` : ''}
                    </option>
                  ))}
                </select>

                {selectedLevel && (
                  <div className="mt-2.5 p-3 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-[#1D3A8A] flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" /> Horario: {selectedLevel.schedule || 'No definido'}
                    </span>
                    {selectedLevel.startDate && (
                      <span className="text-slate-600">
                        • Inicio: {new Date(selectedLevel.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                    {selectedLevel.teacher && (
                      <span className="text-slate-600">
                        • Profesor: {selectedLevel.teacher.firstName} {selectedLevel.teacher.lastName}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Presets Rápidos de Días de Clase */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#1D3A8A]" />
                    Días de Clase (Presets Rápidos)
                  </label>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    {selectedRecurrenceDays.length} días/sem
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => { setRecurringPreset('LMV'); setSelectedRecurrenceDays([1, 3, 5]); }}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all ${
                      recurringPreset === 'LMV'
                        ? 'bg-[#1D3A8A] text-white border-[#1D3A8A] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>L-Mi-V</span>
                    <span className={`text-[10px] ${recurringPreset === 'LMV' ? 'text-blue-100' : 'text-slate-500'}`}>3x / semana</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setRecurringPreset('MJV'); setSelectedRecurrenceDays([3, 4, 5]); }}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all ${
                      recurringPreset === 'MJV'
                        ? 'bg-[#1D3A8A] text-white border-[#1D3A8A] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>Mié-Jue-Vie</span>
                    <span className={`text-[10px] ${recurringPreset === 'MJV' ? 'text-blue-100' : 'text-slate-500'}`}>3x / semana</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setRecurringPreset('SAT'); setSelectedRecurrenceDays([6]); }}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all ${
                      recurringPreset === 'SAT'
                        ? 'bg-[#1D3A8A] text-white border-[#1D3A8A] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>Sabatino</span>
                    <span className={`text-[10px] ${recurringPreset === 'SAT' ? 'text-blue-100' : 'text-slate-500'}`}>1x (Sábado)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setRecurringPreset('LV'); setSelectedRecurrenceDays([1, 2, 3, 4, 5]); }}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all ${
                      recurringPreset === 'LV'
                        ? 'bg-[#1D3A8A] text-white border-[#1D3A8A] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>L a V</span>
                    <span className={`text-[10px] ${recurringPreset === 'LV' ? 'text-blue-100' : 'text-slate-500'}`}>5x / intensivo</span>
                  </button>
                </div>

                {/* Botón de preset personalizado */}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setRecurringPreset('CUSTOM')}
                    className={`w-full py-1.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      recurringPreset === 'CUSTOM'
                        ? 'bg-[#001D5C] text-white border-[#001D5C]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Días Personalizados (Selección libre)</span>
                  </button>

                  {recurringPreset === 'CUSTOM' && (
                    <div className="flex gap-1.5 pt-2.5 justify-center">
                      {[
                        { day: 1, label: 'Lun' },
                        { day: 2, label: 'Mar' },
                        { day: 3, label: 'Mié' },
                        { day: 4, label: 'Jue' },
                        { day: 5, label: 'Vie' },
                        { day: 6, label: 'Sáb' },
                        { day: 0, label: 'Dom' },
                      ].map(d => {
                        const active = selectedRecurrenceDays.includes(d.day);
                        return (
                          <button
                            key={d.day}
                            type="button"
                            onClick={() => {
                              setSelectedRecurrenceDays(prev =>
                                prev.includes(d.day) ? prev.filter(x => x !== d.day) : [...prev, d.day]
                              );
                            }}
                            className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                              active
                                ? 'bg-[#1D3A8A] text-white shadow-xs'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {d.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Duración de la Serie: Por Tiempo vs Por Clases */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  ¿Cómo deseas definir la cantidad de clases?
                </label>
                <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                  <button
                    type="button"
                    onClick={() => setEndCondition('weeks')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      endCondition === 'weeks' ? 'bg-white text-[#1D3A8A] shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Por Tiempo (Meses)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEndCondition('count')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      endCondition === 'count' ? 'bg-white text-[#1D3A8A] shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Por Paquete de Clases
                  </button>
                </div>

                {endCondition === 'weeks' && (
                  <div className="pt-2">
                    <div className="flex flex-wrap gap-2 items-center">
                      {[
                        { w: 4, label: '1 Mes (4 sem)' },
                        { w: 8, label: '2 Meses (8 sem)' },
                        { w: 12, label: '3 Meses (12 sem)' },
                        { w: 16, label: '4 Meses (16 sem)' },
                      ].map(item => (
                        <button
                          key={item.w}
                          type="button"
                          onClick={() => {
                            setRepeatWeeks(item.w);
                            setHasManualEndDate(false);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            repeatWeeks === item.w
                              ? 'bg-blue-50 text-[#1D3A8A] border-[#1D3A8A] shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      Genera automáticamente las clases que caigan en los días oficiales del grupo durante ese periodo.
                    </p>
                  </div>
                )}

                {endCondition === 'count' && (
                  <div className="pt-2">
                    <div className="flex flex-wrap gap-2 items-center">
                      {(() => {
                        const daysCount = selectedRecurrenceDays.length || 1;
                        const presets = [
                          { count: daysCount * 4, label: `${daysCount * 4} clases (1 mes)` },
                          { count: daysCount * 8, label: `${daysCount * 8} clases (2 meses)` },
                          { count: daysCount * 12, label: `${daysCount * 12} clases (3 meses)` },
                          { count: daysCount * 16, label: `${daysCount * 16} clases (4 meses)` },
                        ];
                        return presets.map(p => (
                          <button
                            key={p.count}
                            type="button"
                            onClick={() => {
                              setTotalSessions(p.count);
                              setHasManualEndDate(false);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                              totalSessions === p.count
                                ? 'bg-blue-50 text-[#1D3A8A] border-[#1D3A8A] shadow-xs'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {p.label}
                          </button>
                        ));
                      })()}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-slate-600 font-medium">O cantidad exacta:</span>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={totalSessions}
                        onChange={e => {
                          setTotalSessions(Math.max(1, Number(e.target.value)));
                          setHasManualEndDate(false);
                        }}
                        className="w-20 border border-slate-200 rounded-lg px-2 py-1 text-xs bg-slate-50 font-bold text-center"
                      />
                      <span className="text-xs text-slate-500">clases</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Fechas, Vigencia y Horario */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Fecha de Inicio <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="date"
                      value={recurringStartDate}
                      onChange={e => {
                        setRecurringStartDate(e.target.value);
                        setHasManualEndDate(false);
                      }}
                      className="w-full border border-slate-200 rounded-xl py-2 px-3 text-xs bg-slate-50 font-medium"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        Fecha Límite para Cubrir Clases <span className="text-red-500">*</span>
                      </label>
                      {hasManualEndDate && (
                        <button
                          type="button"
                          onClick={() => setHasManualEndDate(false)}
                          className="text-[10px] text-blue-600 hover:underline font-bold"
                        >
                          Auto (+1 sem)
                        </button>
                      )}
                    </div>
                    <input
                      required
                      type="date"
                      value={recurringEndDate}
                      onChange={e => {
                        setRecurringEndDate(e.target.value);
                        setHasManualEndDate(true);
                      }}
                      className={`w-full border rounded-xl py-2 px-3 text-xs bg-slate-50 font-medium ${
                        isEndDateBeforeLastClass ? 'border-amber-400 bg-amber-50/40 text-amber-900' : 'border-slate-200'
                      }`}
                    />
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Plazo máximo oficial para completar o reponer estas sesiones.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        Horario de Inicio <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsManualTime(!isManualTime)}
                        className="text-[10px] text-blue-600 hover:underline font-bold"
                      >
                        {isManualTime ? 'Horarios Sugeridos' : 'Ingreso manual'}
                      </button>
                    </div>

                    {!isManualTime ? (
                      <select
                        value={recurringStartTime}
                        onChange={e => {
                          if (e.target.value === 'manual') {
                            setIsManualTime(true);
                          } else {
                            setRecurringStartTime(e.target.value);
                          }
                        }}
                        className="w-full border border-slate-200 rounded-xl py-2 px-3 text-xs bg-slate-50 font-semibold text-slate-800 focus:ring-2 focus:ring-[#1D3A8A]/20"
                      >
                        <option value="">Selecciona un horario sugerido...</option>
                        {recurringPreset === 'SAT' ? (
                          <optgroup label="Horarios Sabatinos (2h 50min)">
                            <option value="08:00">08:00 a 10:50 (08:00 AM)</option>
                            <option value="11:00">11:00 a 13:50 (11:00 AM)</option>
                            <option value="14:00">14:00 a 16:50 (02:00 PM)</option>
                          </optgroup>
                        ) : (
                          <optgroup label="Horarios Regulares / Intensivos (50 min)">
                            {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map(h => {
                              const s = `${String(h).padStart(2, '0')}:00`;
                              const eTime = `${String(h).padStart(2, '0')}:50`;
                              const ampm = h >= 12 ? (h === 12 ? '12:00 PM' : `${h - 12}:00 PM`) : `${h}:00 AM`;
                              return (
                                <option key={s} value={s}>
                                  {s} a {eTime} ({ampm})
                                </option>
                              );
                            })}
                          </optgroup>
                        )}
                        <option value="manual">Otro horario (Ingresar manualmente)...</option>
                      </select>
                    ) : (
                      <div className="flex gap-1.5 items-center">
                        <input
                          type="time"
                          required
                          value={recurringStartTime}
                          onChange={e => setRecurringStartTime(e.target.value)}
                          className="flex-1 border border-slate-200 rounded-xl py-2 px-3 text-xs bg-slate-50 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setIsManualTime(false)}
                          className="px-2.5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 whitespace-nowrap"
                        >
                          Sugeridos
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Duración
                    </label>
                    <select
                      value={recurringDuration}
                      onChange={e => setRecurringDuration(Number(e.target.value))}
                      className="w-full border border-slate-200 rounded-xl py-2 px-2.5 text-xs bg-slate-50 font-medium"
                    >
                      <option value={3000}>50 min (Regular / Intensivo)</option>
                      <option value={3600}>60 min (1 hora)</option>
                      <option value={5400}>1h 30 min</option>
                      <option value={10200}>2h 50 min (Sabatino)</option>
                    </select>
                  </div>
                </div>

                {isEndDateBeforeLastClass && lastActiveSession && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 animate-in fade-in duration-150">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 leading-tight">
                      <strong>Atención:</strong> Las clases programadas terminan el <strong>{lastActiveSession.formattedDate}</strong>, pero la fecha límite fijada es anterior ({recurringEndDate}). Por favor amplía la fecha límite para cubrir el periodo.
                    </p>
                  </div>
                )}
              </div>

              {/* 5. Título Dinámico y Módulo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Título o Nombre de la Clase
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Números o Clase {n}"
                    value={recurringTitleTemplate}
                    onChange={e => setRecurringTitleTemplate(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl py-2 px-3 text-xs bg-slate-50 font-medium text-slate-800"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Se generará como: <span className="font-bold text-[#1D3A8A]">{
                      recurringTitleTemplate.trim()
                        ? (recurringTitleTemplate.includes('{n}')
                            ? `${recurringTitleTemplate.replace('{n}', '1')}, ${recurringTitleTemplate.replace('{n}', '2')}...`
                            : `${recurringTitleTemplate.trim()} 1, ${recurringTitleTemplate.trim()} 2...`)
                        : 'Clase 1, Clase 2...'
                    }</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Módulo / Unidad
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Unidad 1"
                    value={recurringModuleName}
                    onChange={e => setRecurringModuleName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl py-2 px-3 text-xs bg-slate-50 font-medium"
                  />
                </div>
              </div>

              {/* 6. Enlace de Zoom y Profesor asignado */}
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-blue-600" />
                    Zoom & Profesor
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsZoomOverridden(!isZoomOverridden);
                      setIsTeacherOverridden(!isTeacherOverridden);
                    }}
                    className="text-blue-600 hover:underline text-[11px] font-semibold"
                  >
                    {isZoomOverridden ? 'Usar valores del grupo' : 'Personalizar Zoom / Profesor'}
                  </button>
                </div>

                {isZoomOverridden ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Cuenta Zoom</label>
                      <select
                        value={formData.zoomHostId}
                        onChange={e => setFormData({ ...formData, zoomHostId: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl py-1.5 px-2.5 text-xs bg-slate-50 font-medium"
                      >
                        <option value="">Por defecto del grupo</option>
                        {(() => {
                          const sortedHosts = [...activeHosts].sort((a, b) => {
                            return getRecurringZoomConflicts(a.id) - getRecurringZoomConflicts(b.id);
                          });
                          return sortedHosts.map((h: any) => {
                            const conflicts = getRecurringZoomConflicts(h.id);
                            const isFree = conflicts === 0;
                            return (
                              <option 
                                key={h.id} 
                                value={h.id} 
                                className={isFree ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-medium'}
                              >
                                {h.displayName} {isFree ? '(100% Libre - 0 cruces)' : `(Ocupado en ${conflicts} clase${conflicts > 1 ? 's' : ''})`}
                              </option>
                            );
                          });
                        })()}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Profesor</label>
                      <select
                        value={formData.teacherId}
                        onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl py-1.5 px-2.5 text-xs bg-slate-50 font-medium"
                      >
                        <option value="">Por defecto del grupo</option>
                        {(() => {
                          const sortedTeachers = [...teachers].sort((a, b) => {
                            return getRecurringTeacherConflicts(a.id) - getRecurringTeacherConflicts(b.id);
                          });
                          return sortedTeachers.map((t: any) => {
                            const conflicts = getRecurringTeacherConflicts(t.id);
                            const isFree = conflicts === 0;
                            return (
                              <option 
                                key={t.id} 
                                value={t.id} 
                                className={isFree ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-medium'}
                              >
                                {t.firstName} {t.lastName} {isFree ? '(100% Libre - 0 cruces)' : `(Ocupado en ${conflicts} clase${conflicts > 1 ? 's' : ''})`}
                              </option>
                            );
                          });
                        })()}
                      </select>
                    </div>
                  </div>
                ) : (
                  (() => {
                    const defaultTeacherId = selectedLevel?.teacherId;
                    const defaultZoomId = selectedLevel?.zoomHostId;
                    const teacherConflicts = defaultTeacherId ? getRecurringTeacherConflicts(defaultTeacherId) : 0;
                    const zoomConflicts = defaultZoomId ? getRecurringZoomConflicts(defaultZoomId) : 0;
                    const hasAnyConflict = teacherConflicts > 0 || zoomConflicts > 0;

                    return (
                      <div className={`rounded-xl p-2.5 text-xs border transition-all ${
                        hasAnyConflict ? 'bg-amber-50/70 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-100 text-slate-600'
                      } flex flex-col sm:flex-row sm:items-center justify-between gap-2`}>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <strong>{selectedLevel?.teacher ? `${selectedLevel.teacher.firstName} ${selectedLevel.teacher.lastName}` : 'Sin profesor asignado'}</strong>
                            {defaultTeacherId && (
                              teacherConflicts > 0 ? (
                                <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-red-600 inline shrink-0" /> {teacherConflicts} cruce{teacherConflicts > 1 ? 's' : ''}
                                </span>
                              ) : (
                                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-600 inline shrink-0" /> 100% Libre
                                </span>
                              )
                            )}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Video className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <strong>{selectedLevel?.zoomHostGroup?.displayName || zoomHosts.find((h: any) => h.id === selectedLevel?.zoomHostId)?.displayName || 'Zoom del grupo'}</strong>
                            {defaultZoomId && (
                              zoomConflicts > 0 ? (
                                <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-red-600 inline shrink-0" /> {zoomConflicts} cruce{zoomConflicts > 1 ? 's' : ''}
                                </span>
                              ) : (
                                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-600 inline shrink-0" /> 100% Libre
                                </span>
                              )
                            )}
                          </span>
                        </div>

                        {hasAnyConflict && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsZoomOverridden(true);
                              setIsTeacherOverridden(true);
                            }}
                            className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-white border border-blue-200 px-2.5 py-1 rounded-lg shadow-2xs self-start sm:self-auto cursor-pointer flex items-center gap-1"
                          >
                            <span>Elegir Zoom o Profesor disponible</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })()
                )}
              </div>

              {/* 7. Previsualización Interactiva en Vivo (Live Preview) */}
              <div className="border border-blue-100 rounded-2xl bg-gradient-to-br from-blue-50/50 to-slate-50 overflow-hidden shadow-xs">
                <div className="p-3.5 bg-blue-50/80 border-b border-blue-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#1D3A8A]" />
                    <span className="text-xs font-black text-[#1D3A8A]">
                      {generatedSessions.filter(s => !s.isExcluded).length} clases a generar
                    </span>
                    {generatedSessions.length > 0 && (
                      <span className="text-[11px] text-slate-500 hidden sm:inline">
                        (Clases: {generatedSessions[0]?.formattedDate} → {generatedSessions[generatedSessions.length - 1]?.formattedDate})
                      </span>
                    )}
                    {recurringEndDate && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isEndDateBeforeLastClass ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-[#1D3A8A]'
                      }`}>
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>Límite: {new Date(recurringEndDate + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPreviewList(!showPreviewList)}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                  >
                    {showPreviewList ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {showPreviewList ? 'Ocultar lista' : 'Ver lista'}
                  </button>
                </div>

                {showPreviewList && (
                  <div className="p-3 max-h-56 overflow-y-auto space-y-1.5 divide-y divide-slate-100">
                    {generatedSessions.length === 0 ? (
                      <p className="text-center py-4 text-xs text-slate-400">
                        Selecciona un grupo para calcular las fechas automáticas.
                      </p>
                    ) : (
                      generatedSessions.map(sessionItem => (
                        <div
                          key={sessionItem.dateStr}
                          className={`pt-1.5 flex items-center justify-between text-xs transition-opacity ${
                            sessionItem.isExcluded ? 'opacity-40 line-through bg-slate-100/50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-[11px] w-6 text-[#1D3A8A]">
                              #{sessionItem.index}
                            </span>
                            <span className="font-bold text-slate-700">
                              {sessionItem.dayName} {sessionItem.formattedDate}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {recurringStartTime}
                            </span>
                            {sessionItem.hasConflict && !sessionItem.isExcluded && (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                                {sessionItem.conflictMessage}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setExcludedDates(prev =>
                                prev.includes(sessionItem.dateStr)
                                    ? prev.filter(d => d !== sessionItem.dateStr)
                                    : [...prev, sessionItem.dateStr]
                              );
                            }}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-colors ${
                              sessionItem.isExcluded
                                ? 'bg-slate-200 text-slate-700 border-slate-300'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                            }`}
                            title={sessionItem.isExcluded ? 'Incluir esta fecha' : 'Excluir día por feriado o vacaciones'}
                          >
                            {sessionItem.isExcluded ? 'Excluida (Feriado)' : 'Excluir'}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Botón de Submit Recurrente */}
              <button
                type="submit"
                disabled={isSubmitting || generatedSessions.filter(s => !s.isExcluded).length === 0 || isEndDateBeforeLastClass}
                className="w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-[#1D3A8A] via-[#1e40af] to-[#001D5C] hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Repeat className="w-5 h-5 text-blue-200" />
                )}
                <span>
                  Programar {generatedSessions.filter(s => !s.isExcluded).length} Clases Recurrentes
                </span>
              </button>
            </form>
          ) : (
            /* =========================================================================
               FORMULARIO DE CLASE ÚNICA / EDICIÓN PUNTUAL
               ========================================================================= */
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
                const groupZoomName = selectedLevel?.zoomHostGroup?.displayName || zoomHosts.find((h: any) => h.id === selectedLevel?.zoomHostId)?.displayName || null;
                const groupZoomLink = selectedLevel?.zoomLink || selectedLevel?.zoomHostGroup?.permanentLink || zoomHosts.find((h: any) => h.id === selectedLevel?.zoomHostId)?.permanentLink || null;
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
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="text-sm font-semibold text-[#1D3A8A]">
                                {groupZoomName ? `Zoom: ${groupZoomName}` : 'Enlace permanente asignado'}
                              </p>
                              <p className="text-xs text-slate-500 truncate max-w-xs">{groupZoomLink}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setIsZoomOverridden(true); setFormData({...formData, zoomHostId: '', url: ''}); }}
                            className="text-xs text-blue-600 hover:text-blue-800 underline ml-2 whitespace-nowrap"
                          >
                            Cambiar enlace
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-[#2D8CFF]" />
                        Cuenta Zoom (Reunión Automática)
                      </label>
                      {hasGroupZoom && overrideZoom && (
                        <button
                          type="button"
                          onClick={() => { setIsZoomOverridden(false); setFormData({...formData, zoomHostId: '', url: ''}); }}
                          className="text-xs text-blue-600 hover:text-blue-800 mb-2 underline flex items-center gap-1"
                        >
                          <ArrowLeft className="w-3 h-3" /> Volver al enlace del grupo
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
                        <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> El link de Zoom se generará automáticamente al crear la clase.
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
                            {groupTeacherName} está ocupado en este horario
                          </p>
                          <p className="text-xs text-red-600 mt-1">Ya tiene otra clase asignada en este mismo bloque. Por favor asigna a otro profesor.</p>
                          <button
                            type="button"
                            onClick={() => { setIsTeacherOverridden(true); setFormData({...formData, teacherId: ''}); }}
                            className="text-xs font-bold text-red-700 hover:text-red-800 mt-3 underline"
                          >
                            Asignar otro profesor
                          </button>
                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-600" />
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{groupTeacherName}</p>
                              <p className="text-xs text-slate-500">Profesor asignado al grupo</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setIsTeacherOverridden(true); setFormData({...formData, teacherId: ''}); }}
                            className="text-xs text-blue-600 hover:text-blue-800 underline ml-2 whitespace-nowrap"
                          >
                            Cambiar profesor
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center justify-between">
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
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#1D3A8A]" />
              <h2 className="text-xl font-bold text-slate-800">Clases Programadas</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                {filteredClasses.length} {filteredClasses.length === 1 ? 'clase' : 'clases'}
              </span>
              {filteredClasses.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (isSelectionMode) {
                      setIsSelectionMode(false);
                      setSelectedClassIds([]);
                    } else {
                      setIsSelectionMode(true);
                    }
                  }}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelectionMode
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-[#1D3A8A]/10 text-[#1D3A8A] hover:bg-[#1D3A8A]/20'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>{isSelectionMode ? 'Cancelar' : 'Seleccionar'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative mb-3">
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

          {/* Selection Toolbar (Only visible when user activates Seleccionar) */}
          {isSelectionMode && (
            <div className="mb-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedClassIds.length === filteredClasses.length) {
                      setSelectedClassIds([]);
                    } else {
                      setSelectedClassIds(filteredClasses.map((c: any) => c.id));
                    }
                  }}
                  className="text-xs font-bold text-slate-700 hover:text-[#1D3A8A] px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-[#1D3A8A]" />
                  <span>
                    {selectedClassIds.length === filteredClasses.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
                  </span>
                </button>
                {selectedClassIds.length > 0 && (
                  <span className="text-xs font-bold text-slate-500">
                    ({selectedClassIds.length} seleccionadas)
                  </span>
                )}
              </div>

              {selectedClassIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setBatchDeleteConfirm(true)}
                  className="text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 px-3.5 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer animate-in fade-in zoom-in-95 duration-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar todas</span>
                </button>
              )}
            </div>
          )}

          <div className="overflow-y-auto flex-1 pr-2">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-gray-100 sticky top-0 z-10">
                <tr>
                  {isSelectionMode && (
                    <th className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={filteredClasses.length > 0 && selectedClassIds.length === filteredClasses.length}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedClassIds(filteredClasses.map((c: any) => c.id));
                          } else {
                            setSelectedClassIds([]);
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-[#1D3A8A] focus:ring-[#1D3A8A] cursor-pointer"
                        title="Seleccionar todas"
                      />
                    </th>
                  )}
                  <th className="p-3">Clase / Grupo</th>
                  <th className="p-3">Fecha y Hora</th>
                  <th className="p-3">Zoom</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && !scheduledClasses.length ? (
                  <tr>
                    <td colSpan={isSelectionMode ? 5 : 4} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#1D3A8A]"/></td>
                  </tr>
                ) : filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan={isSelectionMode ? 5 : 4} className="p-8 text-center text-slate-500">No hay clases que coincidan con la búsqueda.</td>
                  </tr>
                ) : (
                  filteredClasses.map(cls => (
                    <tr 
                      key={cls.id} 
                      className={`hover:bg-slate-50 transition-colors ${
                        isSelectionMode && selectedClassIds.includes(cls.id) ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      {isSelectionMode && (
                        <td className="p-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={selectedClassIds.includes(cls.id)}
                            onChange={() => {
                              setSelectedClassIds(prev =>
                                prev.includes(cls.id) ? prev.filter(x => x !== cls.id) : [...prev, cls.id]
                              );
                            }}
                            className="w-4 h-4 rounded border-slate-300 text-[#1D3A8A] focus:ring-[#1D3A8A] cursor-pointer"
                          />
                        </td>
                      )}
                      <td className="p-3">
                        <p className="font-bold text-slate-800">{cls.title}</p>
                        <p className="text-xs text-slate-500">{cls.module?.level?.name || 'Sin grupo'}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-slate-700">{new Date(cls.scheduledAt).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-500">{new Date(cls.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="p-3">
                        {(() => {
                          const hostDisplay = cls.zoomHost?.displayName || cls.module?.level?.zoomHostGroup?.displayName || zoomHosts.find((h: any) => h.id === (cls.zoomHostId || cls.module?.level?.zoomHostId))?.displayName;
                          if (hostDisplay) {
                            return (
                              <div className="flex items-center gap-1.5">
                                <Video className="w-3.5 h-3.5 text-[#2D8CFF]" />
                                <span className="text-xs text-[#2D8CFF] font-medium">{hostDisplay}</span>
                              </div>
                            );
                          }
                          if (cls.url) {
                            return (
                              <a href={cls.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                <LinkIcon className="w-3 h-3" /> Manual
                              </a>
                            );
                          }
                          return <span className="text-xs text-slate-400">—</span>;
                        })()}
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
        <ScheduleCalendar 
          classes={scheduledClasses} 
          teachers={teachers} 
          levels={levels}
          zoomHosts={zoomHosts}
          onClassUpdated={fetchData} 
        />
      )}
    </div>
  );
}
