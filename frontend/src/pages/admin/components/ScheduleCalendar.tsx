import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Clock, 
  X, 
  Video, 
  Activity, 
  Sparkles, 
  Layers, 
  Calendar as CalendarIcon, 
  Zap, 
  Users, 
  ExternalLink,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Crown,
  Plus,
  GripVertical,
  BookOpen,
  Copy,
  Check,
  Mail,
  Phone,
  Trash2
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { showSuccess, showError } from '../../../utils/alerts';

interface ScheduleCalendarProps {
  classes: any[];
  teachers: any[];
  levels?: any[];
  zoomHosts?: any[];
  onClassUpdated: () => void;
}

export function ScheduleCalendar({ classes, teachers, levels = [], zoomHosts: _zoomHosts = [], onClassUpdated }: ScheduleCalendarProps) {
  const session = useAuthStore(state => state.session);
  const [viewType, setViewType] = useState<'day' | 'week'>('day');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacherFilter, setSelectedTeacherFilter] = useState<string>('ALL');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('ALL');
  const [editingClass, setEditingClass] = useState<any | null>(null);
  const [isStressTestActive, setIsStressTestActive] = useState<boolean>(false);
  const [simulatedClasses, setSimulatedClasses] = useState<any[]>([]);
  const [highlightedHour, setHighlightedHour] = useState<number | null>(null);

  // Estado para la creación rápida al hacer clic en un slot disponible
  const [creatingSlot, setCreatingSlot] = useState<{
    teacherId: string;
    date: Date;
    hour: number;
  } | null>(null);

  const [createFormData, setCreateFormData] = useState({
    levelId: '',
    title: '',
    teacherId: '',
    date: '',
    time: '',
    durationExpected: 3000,
    url: '',
    zoomHostId: ''
  });
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const [draggedClassId, setDraggedClassId] = useState<string | null>(null);
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);
  const [weekLayoutMode, setWeekLayoutMode] = useState<'timegrid' | 'teachers'>('timegrid');
  const [simultaneousModalSlot, setSimultaneousModalSlot] = useState<{
    day: Date;
    hour: number;
    classes: any[];
  } | null>(null);

  // Estado para el modal de detalle de clase enriquecido (Paso 5: Bitácora & Alumnos)
  const [classDetailTab, setClassDetailTab] = useState<'session' | 'students'>('session');
  const [copiedZoom, setCopiedZoom] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [asyncGroupStudents, setAsyncGroupStudents] = useState<any[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSavingClass, setIsSavingClass] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const START_HOUR = 8;
  const END_HOUR = 21;
  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  // Pool de profesores activos (si la prueba de estrés requiere demostrar 5 simultáneas, asegura al menos 5 columnas)
  const displayTeachers = useMemo(() => {
    if (!isStressTestActive || teachers.length >= 5) {
      return teachers;
    }
    const mockExtras = [
      { id: 'mock-t-sarah', firstName: 'Sarah', lastName: 'Bernard' },
      { id: 'mock-t-etienne', firstName: 'Étienne', lastName: 'Laurent' },
      { id: 'mock-t-claire', firstName: 'Claire', lastName: 'Dubois' }
    ];
    return [...teachers, ...mockExtras].slice(0, Math.max(teachers.length, 5));
  }, [teachers, isStressTestActive]);

  // Función constructora de las 37 clases de prueba de estrés
  const buildStressSessions = (baseDate: Date, teacherList: any[]) => {
    const syntheticGroups = [
      { name: 'Burdeos A1', rhythm: 'INTENSIVE', levelCode: 'A1-101', colorLevel: 'A1' },
      { name: 'Toulouse B1', rhythm: 'REGULAR', levelCode: 'B1-201', colorLevel: 'B1' },
      { name: 'Niza A2', rhythm: 'REGULAR', levelCode: 'A2-102', colorLevel: 'A2' },
      { name: 'París B2', rhythm: 'REGULAR', levelCode: 'B2-301', colorLevel: 'B2' },
      { name: 'Lyon C1', rhythm: 'ADVANCED', levelCode: 'C1-401', colorLevel: 'C1' },
      { name: 'Marsella A1', rhythm: 'INTENSIVE', levelCode: 'A1-102', colorLevel: 'A1' },
      { name: 'Estrasburgo B1', rhythm: 'REGULAR', levelCode: 'B1-202', colorLevel: 'B1' },
      { name: 'Mónaco A1', rhythm: 'REGULAR', levelCode: 'A1-103', colorLevel: 'A1' },
      { name: 'Lille B2', rhythm: 'REGULAR', levelCode: 'B2-302', colorLevel: 'B2' },
      { name: 'Cannes A2', rhythm: 'INTENSIVE', levelCode: 'A2-103', colorLevel: 'A2' },
      { name: 'Montpellier B1', rhythm: 'REGULAR', levelCode: 'B1-203', colorLevel: 'B1' },
      { name: 'Nantes A1', rhythm: 'REGULAR', levelCode: 'A1-104', colorLevel: 'A1' },
    ];

    const teacherIds = teacherList.map(t => t.id);
    const mockSessions: any[] = [];
    let idCounter = 1;

    const hourDistribution: Record<number, number> = {
      8: 2,
      9: 3,
      10: 4,
      11: 3, // A las 11:00 forzamos 2 clases en el profesor 0 para demostrar solapamiento
      12: 2,
      13: 2,
      14: 2,
      15: 2,
      16: 3,
      17: 4,
      18: 5, // A las 18:00 hay 5 clases simultáneas
      19: 3,
      20: 2,
    };

    Object.entries(hourDistribution).forEach(([hStr, count]) => {
      const h = Number(hStr);
      for (let i = 0; i < count; i++) {
        const group = syntheticGroups[(idCounter - 1) % syntheticGroups.length];
        const teacherId = (h === 11 && i === 1) 
          ? teacherIds[0] 
          : teacherIds[i % teacherIds.length];

        const d = new Date(baseDate);
        d.setHours(h, 0, 0, 0);

        mockSessions.push({
          id: `stress-test-${idCounter}`,
          title: `${group.name} · Sesión ${((idCounter * 3) % 24) + 1}`,
          scheduledAt: d.toISOString(),
          durationExpected: 3000,
          teacherId: teacherId,
          url: `https://zoom.us/j/999888777${(i % 5) + 1}`,
          zoomHostName: `Zoom Sala ${(i % 5) + 1}`,
          isStressTest: true,
          colorLevel: group.colorLevel,
          module: {
            name: `Unidad ${((idCounter - 1) % 4) + 1}`,
            level: {
              id: `lvl-${group.name}`,
              name: group.name,
              levelCode: group.levelCode,
              teacherId: teacherId
            }
          }
        });
        idCounter++;
      }
    });

    return mockSessions.slice(0, 37);
  };

  // Activar / Desactivar prueba de estrés poblando las sesiones
  const toggleStressTest = () => {
    if (!isStressTestActive) {
      setSimulatedClasses(buildStressSessions(currentDate, displayTeachers));
      setIsStressTestActive(true);
    } else {
      setSimulatedClasses([]);
      setIsStressTestActive(false);
    }
  };

  // Lista activa de clases (reales o sintéticas interactivas)
  const activeClassesList = useMemo(() => {
    if (isStressTestActive) {
      return simulatedClasses;
    }
    return classes;
  }, [isStressTestActive, simulatedClasses, classes]);

  // ---------------------------------------------------------------------------
  // DISPONIBILIDAD EN TIEMPO REAL PARA LA HORA DE LA CLASE EN EDICIÓN
  // ---------------------------------------------------------------------------
  const teacherAvailability = useMemo(() => {
    if (!editingClass || !editingClass.scheduledAt) return [];

    const classDate = new Date(editingClass.scheduledAt);
    const targetHour = classDate.getHours();
    const targetDateStr = classDate.toDateString();

    return displayTeachers.map(teacher => {
      // Buscar si este maestro ya tiene otra clase en esa misma fecha y hora
      const conflictingClass = activeClassesList.find(c => {
        if (c.id === editingClass.id) return false;
        const tId = c.teacherId || c.module?.level?.teacherId;
        if (tId !== teacher.id) return false;
        const d = new Date(c.scheduledAt);
        return d.toDateString() === targetDateStr && d.getHours() === targetHour;
      });

      return {
        teacher,
        isAvailable: !conflictingClass,
        conflictingClassTitle: conflictingClass 
          ? (conflictingClass.module?.level?.name || conflictingClass.title) 
          : null
      };
    });
  }, [editingClass, displayTeachers, activeClassesList]);

  // ---------------------------------------------------------------------------
  // NAVEGACIÓN Y RANGOS DE FECHA
  // ---------------------------------------------------------------------------
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const currentWeekStart = getWeekStart(currentDate);

  const sliderDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(currentWeekStart.getDate() + i);
      const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
      const dayNumber = d.getDate();
      days.push({ dayName, dayNumber, date: d });
    }
    return days;
  }, [currentWeekStart]);

  const weekDays = useMemo(() => sliderDays.map(d => d.date), [sliderDays]);

  // ---------------------------------------------------------------------------
  // LISTA DE TODOS LOS GRUPOS REGISTRADOS EN LA ESCUELA
  // ---------------------------------------------------------------------------
  const availableGroups = useMemo(() => {
    const map = new Map<string, string>();

    // 1. Todos los grupos reales registrados en la escuela
    if (levels && levels.length > 0) {
      levels.forEach((l: any) => {
        if (l?.id && (l?.name || l?.levelCode)) {
          map.set(l.id, l.name || l.levelCode);
        }
      });
    }

    // 2. Grupos de las sesiones activas (o simulación de prueba de estrés)
    activeClassesList.forEach(c => {
      const lvl = c.module?.level;
      if (lvl?.id && lvl?.name) {
        map.set(lvl.id, lvl.name);
      }
    });

    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [levels, activeClassesList]);

  // ---------------------------------------------------------------------------
  // FILTRADO REACTIVO
  // ---------------------------------------------------------------------------
  const currentViewClasses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return activeClassesList.filter(c => {
      const classDate = new Date(c.scheduledAt);
      
      // Filtro de rango de fecha
      if (viewType === 'day') {
        if (classDate.toDateString() !== currentDate.toDateString()) return false;
      } else {
        const start = new Date(currentWeekStart);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        if (classDate < start || classDate > end) return false;
      }

      // Filtro por Profesor
      const tId = c.teacherId || c.module?.level?.teacherId;
      if (selectedTeacherFilter !== 'ALL' && tId !== selectedTeacherFilter) {
        return false;
      }

      // Filtro por Grupo / Nivel
      const lvlId = c.module?.level?.id;
      if (selectedGroupFilter !== 'ALL' && lvlId !== selectedGroupFilter) {
        return false;
      }

      // Búsqueda por texto libre
      if (term) {
        const matchTitle = c.title?.toLowerCase().includes(term);
        const matchLevel = c.module?.level?.name?.toLowerCase().includes(term);
        const matchTeacher = displayTeachers.some(t => 
          (t.id === tId) && 
          (t.firstName?.toLowerCase().includes(term) || t.lastName?.toLowerCase().includes(term))
        );
        if (!matchTitle && !matchLevel && !matchTeacher) return false;
      }

      return true;
    });
  }, [activeClassesList, currentDate, viewType, currentWeekStart, searchTerm, selectedTeacherFilter, selectedGroupFilter, displayTeachers]);

  // ---------------------------------------------------------------------------
  // ÍNDICE O(1) PARA ACCESO ULTRA-RÁPIDO EN CADA CELDA
  // ---------------------------------------------------------------------------
  const dayViewIndex = useMemo(() => {
    const map = new Map<string, any[]>();
    currentViewClasses.forEach(cls => {
      const h = new Date(cls.scheduledAt).getHours();
      const tId = cls.teacherId || cls.module?.level?.teacherId || 'unassigned';
      const key = `${h}_${tId}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(cls);
    });
    return map;
  }, [currentViewClasses]);

  const weekViewIndex = useMemo(() => {
    const map = new Map<string, any[]>();
    currentViewClasses.forEach(cls => {
      const dStr = new Date(cls.scheduledAt).toDateString();
      const tId = cls.teacherId || cls.module?.level?.teacherId || 'unassigned';
      const key = `${dStr}_${tId}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(cls);
    });
    return map;
  }, [currentViewClasses]);

  // Índice O(1) para la vista semanal por Tiempo (Día + Hora)
  const weekTimeGridIndex = useMemo(() => {
    const map = new Map<string, any[]>();
    currentViewClasses.forEach(cls => {
      const d = new Date(cls.scheduledAt);
      const dStr = d.toDateString();
      const h = d.getHours();
      const key = `${dStr}_${h}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(cls);
    });
    return map;
  }, [currentViewClasses]);

  // Totales de clases por día de la semana (para los badges de la cabecera)
  const weekDayTotalsMap = useMemo(() => {
    const counts: Record<string, number> = {};
    weekDays.forEach(d => { counts[d.toDateString()] = 0; });
    currentViewClasses.forEach(cls => {
      const dStr = new Date(cls.scheduledAt).toDateString();
      if (counts[dStr] !== undefined) {
        counts[dStr] = (counts[dStr] || 0) + 1;
      }
    });
    return counts;
  }, [currentViewClasses, weekDays]);

  // Mapa de clases agrupadas por hora (para saber cuántas clases simultáneas hay en cada bloque)
  const hourTotalsMap = useMemo(() => {
    const counts: Record<number, number> = {};
    hours.forEach(h => { counts[h] = 0; });
    currentViewClasses.forEach(cls => {
      const h = new Date(cls.scheduledAt).getHours();
      counts[h] = (counts[h] || 0) + 1;
    });
    return counts;
  }, [currentViewClasses, hours]);

  // ---------------------------------------------------------------------------
  // MÉTRICAS DE ALTA DENSIDAD DEL DÍA
  // ---------------------------------------------------------------------------
  const dayMetrics = useMemo(() => {
    if (viewType !== 'day') return null;

    const total = currentViewClasses.length;
    let peakHour = 0;
    let peakCount = 0;
    const activeTeacherSet = new Set<string>();

    currentViewClasses.forEach(cls => {
      const tId = cls.teacherId || cls.module?.level?.teacherId;
      if (tId) activeTeacherSet.add(tId);
    });

    Object.entries(hourTotalsMap).forEach(([hStr, count]) => {
      if (count > peakCount) {
        peakCount = count;
        peakHour = Number(hStr);
      }
    });

    return {
      totalClasses: total,
      peakHour,
      peakCount,
      activeTeachersCount: activeTeacherSet.size
    };
  }, [currentViewClasses, hourTotalsMap, viewType]);

  // ---------------------------------------------------------------------------
  // ESTILOS Y TEMATIZACIÓN FRANCESA POR NIVEL / GRUPO
  // ---------------------------------------------------------------------------
  const getLevelBadgeStyle = (name: string = '') => {
    const upper = name.toUpperCase();
    if (upper.includes('A1') || upper.includes('BURDEOS') || upper.includes('BÁSICO 1') || upper.includes('BASICO 1')) {
      return 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white border-blue-600/40';
    }
    if (upper.includes('A2') || upper.includes('NIZA') || upper.includes('BÁSICO 2')) {
      return 'bg-gradient-to-r from-sky-600 to-blue-700 text-white border-sky-500/40';
    }
    if (upper.includes('B1') || upper.includes('TOULOUSE') || upper.includes('INTERMEDIO')) {
      return 'bg-gradient-to-r from-[#D59B28] to-amber-700 text-white border-amber-500/40 shadow-xs';
    }
    if (upper.includes('B2') || upper.includes('PARÍS') || upper.includes('PARIS')) {
      return 'bg-gradient-to-r from-emerald-600 to-teal-800 text-white border-emerald-500/40';
    }
    if (upper.includes('C1') || upper.includes('LYON') || upper.includes('AVANZADO')) {
      return 'bg-gradient-to-r from-purple-700 to-indigo-900 text-white border-purple-500/40';
    }
    return 'bg-gradient-to-r from-[#1D3A8A] to-[#254ab5] text-white border-blue-400/40';
  };

  const getLevelCardTheme = (name: string = '') => {
    const upper = name.toUpperCase();
    if (upper.includes('A1') || upper.includes('BURDEOS') || upper.includes('BÁSICO 1') || upper.includes('BASICO 1')) {
      return {
        bg: 'bg-white hover:bg-blue-50/40 border-blue-200/90 hover:border-blue-400',
        badge: 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-xs',
        borderLeft: 'border-l-[5px] border-l-blue-600',
        accentText: 'text-blue-700',
        zoomBg: 'bg-blue-50 text-blue-700 border border-blue-200/80 hover:bg-blue-100'
      };
    }
    if (upper.includes('A2') || upper.includes('NIZA') || upper.includes('BÁSICO 2') || upper.includes('BASICO 2')) {
      return {
        bg: 'bg-white hover:bg-sky-50/40 border-sky-200/90 hover:border-sky-400',
        badge: 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-xs',
        borderLeft: 'border-l-[5px] border-l-sky-500',
        accentText: 'text-sky-700',
        zoomBg: 'bg-sky-50 text-sky-700 border border-sky-200/80 hover:bg-sky-100'
      };
    }
    if (upper.includes('B1') || upper.includes('TOULOUSE') || upper.includes('INTERMEDIO')) {
      return {
        bg: 'bg-white hover:bg-amber-50/40 border-amber-200/90 hover:border-[#D59B28]',
        badge: 'bg-gradient-to-r from-[#D59B28] to-amber-700 text-white shadow-xs',
        borderLeft: 'border-l-[5px] border-l-[#D59B28]',
        accentText: 'text-[#855807]',
        zoomBg: 'bg-amber-50 text-[#855807] border border-amber-200/80 hover:bg-amber-100'
      };
    }
    if (upper.includes('B2') || upper.includes('PARÍS') || upper.includes('PARIS')) {
      return {
        bg: 'bg-white hover:bg-emerald-50/40 border-emerald-200/90 hover:border-emerald-400',
        badge: 'bg-gradient-to-r from-emerald-600 to-teal-800 text-white shadow-xs',
        borderLeft: 'border-l-[5px] border-l-emerald-600',
        accentText: 'text-emerald-700',
        zoomBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100'
      };
    }
    if (upper.includes('C1') || upper.includes('LYON') || upper.includes('AVANZADO')) {
      return {
        bg: 'bg-white hover:bg-purple-50/40 border-purple-200/90 hover:border-purple-400',
        badge: 'bg-gradient-to-r from-purple-700 to-indigo-900 text-white shadow-xs',
        borderLeft: 'border-l-[5px] border-l-purple-600',
        accentText: 'text-purple-700',
        zoomBg: 'bg-purple-50 text-purple-700 border border-purple-200/80 hover:bg-purple-100'
      };
    }
    return {
      bg: 'bg-white hover:bg-slate-50 border-slate-200 hover:border-[#1D3A8A]',
      badge: 'bg-gradient-to-r from-[#1D3A8A] to-[#254ab5] text-white shadow-xs',
      borderLeft: 'border-l-[5px] border-l-[#1D3A8A]',
      accentText: 'text-[#1D3A8A]',
      zoomBg: 'bg-blue-50 text-[#1D3A8A] border border-blue-200/80 hover:bg-blue-100'
    };
  };

  const getTeacherColor = (index: number) => {
    const colors = [
      { bg: 'bg-[#1D3A8A]', border: 'border-[#1D3A8A]', lightBg: 'bg-blue-50 text-[#1D3A8A]', badge: 'bg-[#1D3A8A] text-white' },
      { bg: 'bg-[#D92534]', border: 'border-[#D92534]', lightBg: 'bg-rose-50 text-[#D92534]', badge: 'bg-[#D92534] text-white' },
      { bg: 'bg-[#D59B28]', border: 'border-[#D59B28]', lightBg: 'bg-amber-50 text-[#92400e]', badge: 'bg-[#D59B28] text-white' },
      { bg: 'bg-[#0284C7]', border: 'border-[#0284C7]', lightBg: 'bg-sky-50 text-[#0369a1]', badge: 'bg-[#0284C7] text-white' },
      { bg: 'bg-[#059669]', border: 'border-[#059669]', lightBg: 'bg-emerald-50 text-[#065f46]', badge: 'bg-[#059669] text-white' },
      { bg: 'bg-[#7C3AED]', border: 'border-[#7C3AED]', lightBg: 'bg-purple-50 text-[#6d28d9]', badge: 'bg-[#7C3AED] text-white' }
    ];
    return colors[index % colors.length];
  };

  // ---------------------------------------------------------------------------
  // DRAG & DROP Y ACCIONES
  // ---------------------------------------------------------------------------
  const handleDragStart = (e: React.DragEvent, classItem: any) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', classItem.id);
    e.dataTransfer.setData('classId', classItem.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedClassId(classItem.id);
  };

  const handleDragEnd = () => {
    setDraggedClassId(null);
    setDragOverCell(null);
  };

  const handleDragOver = (e: React.DragEvent, cellKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCell !== cellKey) {
      setDragOverCell(cellKey);
    }
  };

  const handleDragLeave = (e: React.DragEvent, cellKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverCell === cellKey) {
      setDragOverCell(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetTeacherId: string, targetHour?: number, targetDateStr?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverCell(null);

    const classId = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('classId') || draggedClassId;
    setDraggedClassId(null);
    if (!classId) return;

    const classItem = activeClassesList.find(c => c.id === classId);
    if (!classItem) return;

    let newScheduledAt = new Date(classItem.scheduledAt);
    const finalTeacherId = targetTeacherId || classItem.teacherId;
    
    if (viewType === 'day' && targetHour !== undefined) {
      newScheduledAt.setHours(targetHour, 0, 0, 0);
    } else if (viewType === 'week') {
      if (targetDateStr) {
        const targetDate = new Date(targetDateStr);
        newScheduledAt.setFullYear(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      }
      if (targetHour !== undefined) {
        newScheduledAt.setHours(targetHour, 0, 0, 0);
      }
    }

    const targetTeacher = displayTeachers.find(t => t.id === finalTeacherId);
    const hourLabel = `${newScheduledAt.getHours().toString().padStart(2, '0')}:00 hrs`;
    const dayLabel = newScheduledAt.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
    const teacherLabel = targetTeacher ? `${targetTeacher.firstName}` : 'Profesor';

    // Si es una clase de simulación (o prueba de estrés activa)
    if (classItem.isStressTest || classId.startsWith('stress-test')) {
      setSimulatedClasses(prev => prev.map(c => {
        if (c.id === classId) {
          return {
            ...c,
            teacherId: finalTeacherId,
            scheduledAt: newScheduledAt.toISOString(),
            module: {
              ...c.module,
              level: {
                ...c.module?.level,
                teacherId: finalTeacherId
              }
            }
          };
        }
        return c;
      }));
      showSuccess(`¡Clase asignada a ${teacherLabel} el ${dayLabel} a las ${hourLabel}!`);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/schedule/${classId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teacherId: finalTeacherId,
          scheduledAt: newScheduledAt.toISOString(),
          moduleId: classItem.moduleId,
          title: classItem.title,
          url: classItem.url
        })
      });

      if (res.ok) {
        showSuccess(`¡Clase movida al ${dayLabel} a las ${hourLabel}!`);
        onClassUpdated();
      } else {
        const err = await res.json().catch(() => ({}));
        showError('Error', err.message || 'No se pudo reasignar la clase');
      }
    } catch (err: any) {
      showError('Error', err.message || 'Error de conexión');
    }
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('stress-test')) {
      if (!window.confirm('¿Eliminar esta clase simulada?')) return;
      setSimulatedClasses(prev => prev.filter(c => c.id !== id));
      showSuccess('Clase eliminada de la simulación');
      setEditingClass(null);
      return;
    }
    if (!window.confirm('¿Eliminar esta clase?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/schedule/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) {
        showSuccess('Clase eliminada');
        setEditingClass(null);
        onClassUpdated();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Carga reactiva de alumnos del grupo al abrir cualquier clase en edición (Paso 5)
  useEffect(() => {
    if (!editingClass) {
      setClassDetailTab('session');
      setStudentSearch('');
      setAsyncGroupStudents([]);
      return;
    }

    const targetLevelId = editingClass.module?.levelId || editingClass.module?.level?.id;
    const directUsers = editingClass.module?.level?.users;

    // 1. Usuarios incluidos directamente
    if (directUsers && directUsers.length > 0) {
      setAsyncGroupStudents(directUsers);
      return;
    }

    // 2. Buscar en el listado de levels
    if (targetLevelId && levels && levels.length > 0) {
      const foundLevel = levels.find((l: any) => l.id === targetLevelId);
      if (foundLevel && foundLevel.users && foundLevel.users.length > 0) {
        setAsyncGroupStudents(foundLevel.users);
        return;
      }
    }

    // 3. Mock realista de alumnos si es clase de prueba de estrés
    if (editingClass.isStressTest || editingClass.id?.startsWith('stress-test')) {
      setAsyncGroupStudents([
        { id: 'mock-s-1', firstName: 'Mariana (Amiga)', lastName: 'Prueba WhatsApp', email: 'amiga.prueba@gmail.com', phone: '+52 347 110 0049' },
        { id: 'mock-s-2', firstName: 'Alexandre', lastName: 'Dupont', email: 'alex.dupont@outlook.com', phone: '+525598765432' },
        { id: 'mock-s-3', firstName: 'Élodie', lastName: 'Leroy', email: 'elodie.leroy@yahoo.fr', phone: '+525545678901' },
        { id: 'mock-s-4', firstName: 'Lucas', lastName: 'Moreau', email: 'lucas.moreau@gmail.com', phone: '+525578901234' }
      ]);
      return;
    }

    // 4. Consulta a la API en segundo plano
    if (targetLevelId) {
      setIsLoadingStudents(true);
      fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      })
      .then(res => res.ok ? res.json() : [])
      .then((allUsers: any[]) => {
        const matching = allUsers.filter((u: any) => 
          u.currentLevelId === targetLevelId || 
          u.levelId === targetLevelId || 
          u.level?.id === targetLevelId ||
          u.enrollments?.some((e: any) => e.levelId === targetLevelId)
        );
        setAsyncGroupStudents(matching);
      })
      .catch(() => {})
      .finally(() => setIsLoadingStudents(false));
    }
  }, [editingClass, levels, session?.access_token]);

  // Filtrado reactivo de los alumnos de la clase
  const displayedStudents = useMemo(() => {
    if (!studentSearch.trim()) return asyncGroupStudents;
    const term = studentSearch.toLowerCase().trim();
    return asyncGroupStudents.filter((st: any) => {
      const full = `${st.firstName || ''} ${st.lastName || ''}`.toLowerCase();
      const em = (st.email || '').toLowerCase();
      const ph = (st.phone || '').toLowerCase();
      return full.includes(term) || em.includes(term) || ph.includes(term);
    });
  }, [asyncGroupStudents, studentSearch]);

  const handleCopyZoomLink = (url: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedZoom(true);
    showSuccess('¡Enlace de Zoom copiado al portapapeles!');
    setTimeout(() => setCopiedZoom(false), 2500);
  };

  const getWhatsAppMessage = (studentFirstName?: string, includeEmojis: boolean = true) => {
    if (!editingClass) return '';
    const sName = studentFirstName || 'estimado alumno';
    const cTitle = editingClass.title || 'Clase de Francés';
    const cTime = editingClass.scheduledAt ? new Date(editingClass.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    const zoomUrl = editingClass.url || 'https://zoom.us/j/9876543210';

    if (includeEmojis) {
      return `¡Bonjour ${sName}! 🥐\n\nTe comparto el acceso a nuestra clase de francés "${cTitle}" de hoy${cTime ? ` a las ${cTime} hrs` : ''}:\n\n👉 Enlace de Zoom: ${zoomUrl}\n\n¡Te esperamos! 🇫🇷✨`;
    }

    // Versión limpia para URL de WhatsApp (evita que el servidor de Meta convierta emojis en ??)
    return `¡Bonjour ${sName}!\n\nTe comparto el acceso a nuestra clase de francés *"${cTitle}"* de hoy${cTime ? ` a las *${cTime} hrs*` : ''}:\n\n* Enlace de Zoom: ${zoomUrl}\n\n¡Te esperamos en clase!`;
  };

  const handleCopyMessage = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    showSuccess('¡Mensaje con emojis copiado al portapapeles!');
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  const getWhatsAppUrl = (student: any) => {
    if (!editingClass) return '#';
    let rawPhone = (student.phone || student.whatsapp || '').replace(/[^0-9]/g, '');
    // Soporte para números de México de 10 dígitos (añadir lada país 52)
    if (rawPhone.length === 10) {
      rawPhone = '52' + rawPhone;
    }
    // En el enlace web enviamos el texto limpio sin emojis para que no aparezcan los signos de interrogación ??
    const text = getWhatsAppMessage(student.firstName, false);
    return `https://api.whatsapp.com/send?phone=${rawPhone}&text=${encodeURIComponent(text)}`;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;

    setIsSavingClass(true);

    if (editingClass.id?.startsWith('stress-test')) {
      setSimulatedClasses(prev => prev.map(c => c.id === editingClass.id ? { ...editingClass } : c));
      showSuccess('¡Clase y bitácora actualizadas con éxito!');
      setIsSavingClass(false);
      setEditingClass(null);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/schedule/${editingClass.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teacherId: editingClass.teacherId,
          scheduledAt: editingClass.scheduledAt,
          moduleId: editingClass.moduleId,
          title: editingClass.title,
          description: editingClass.description,
          url: editingClass.url
        })
      });

      if (res.ok) {
        showSuccess('¡Clase y bitácora guardadas con éxito!');
        setEditingClass(null);
        onClassUpdated();
      } else {
        const err = await res.json().catch(() => ({}));
        showError('Error', err.message || 'No se pudo actualizar la clase');
      }
    } catch (err: any) {
      showError('Error', err.message || 'Error de conexión');
    } finally {
      setIsSavingClass(false);
    }
  };

  const updateEditingTime = (timeStr: string) => {
    if (!editingClass) return;
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date(editingClass.scheduledAt);
    d.setHours(h, m, 0, 0);
    setEditingClass({ ...editingClass, scheduledAt: d.toISOString() });
  };

  // ---------------------------------------------------------------------------
  // MANEJADORES DE CREACIÓN RÁPIDA EN SLOT VACÍO
  // ---------------------------------------------------------------------------
  const handleOpenCreateSlot = (teacherId: string, date: Date, hour: number) => {
    const dStr = date.toISOString().split('T')[0];
    const tStr = `${hour.toString().padStart(2, '0')}:00`;
    
    // Seleccionar grupo por defecto (si hay filtro activo o el primero disponible)
    const defaultLevel = levels.find(l => l.id === selectedGroupFilter) || levels[0];
    const targetTeacher = displayTeachers.find(t => t.id === teacherId) || displayTeachers[0];

    const initialLevelId = defaultLevel?.id || '';
    const initialTitle = defaultLevel ? `${defaultLevel.name} · Sesión 1` : 'Nueva Clase';
    const initialDuration = defaultLevel?.rhythm === 'SATURDAY' ? 10200 : 3000;
    const initialUrl = defaultLevel?.zoomLink || defaultLevel?.zoomHostGroup?.permanentLink || '';
    const initialZoomHostId = defaultLevel?.zoomHostId || '';

    setCreatingSlot({ teacherId, date, hour });
    setCreateFormData({
      levelId: initialLevelId,
      title: initialTitle,
      teacherId: targetTeacher?.id || teacherId,
      date: dStr,
      time: tStr,
      durationExpected: initialDuration,
      url: initialUrl,
      zoomHostId: initialZoomHostId
    });
  };

  const handleCreateLevelChange = (lvlId: string) => {
    const selectedLevel = levels.find(l => l.id === lvlId);
    if (selectedLevel) {
      setCreateFormData(prev => ({
        ...prev,
        levelId: lvlId,
        title: `${selectedLevel.name} · Sesión 1`,
        durationExpected: selectedLevel.rhythm === 'SATURDAY' ? 10200 : 3000,
        url: selectedLevel.zoomLink || selectedLevel.zoomHostGroup?.permanentLink || prev.url,
        zoomHostId: selectedLevel.zoomHostId || prev.zoomHostId,
        teacherId: prev.teacherId || selectedLevel.teacherId || ''
      }));
    } else {
      setCreateFormData(prev => ({ ...prev, levelId: lvlId }));
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createFormData.levelId) {
      showError('Faltan Datos', 'Por favor selecciona un grupo o nivel para la clase');
      return;
    }

    setIsCreatingClass(true);
    const scheduledDate = new Date(`${createFormData.date}T${createFormData.time}`);
    const chosenLevel = levels.find(l => l.id === createFormData.levelId);

    // Si está en modo prueba de estrés, crear en memoria interactiva
    if (isStressTestActive) {
      const newMockClass = {
        id: `stress-test-custom-${Date.now()}`,
        title: createFormData.title || `${chosenLevel?.name || 'Grupo'} · Sesión Especial`,
        scheduledAt: scheduledDate.toISOString(),
        durationExpected: createFormData.durationExpected,
        teacherId: createFormData.teacherId,
        url: createFormData.url || 'https://zoom.us/j/9998887771',
        zoomHostName: 'Zoom Sala 1',
        isStressTest: true,
        colorLevel: chosenLevel?.levelCode || 'A1',
        module: {
          name: 'Unidad 1',
          level: {
            id: chosenLevel?.id || 'lvl-custom',
            name: chosenLevel?.name || 'Grupo',
            levelCode: chosenLevel?.levelCode || 'A1',
            teacherId: createFormData.teacherId
          }
        }
      };

      setSimulatedClasses(prev => [...prev, newMockClass]);
      showSuccess('¡Clase creada y programada en la agenda!');
      setCreatingSlot(null);
      setIsCreatingClass(false);
      return;
    }

    // Modo real: Guardar en Base de Datos vía API
    try {
      const body: any = {
        levelId: createFormData.levelId,
        title: createFormData.title,
        teacherId: createFormData.teacherId,
        scheduledAt: scheduledDate.toISOString(),
        durationExpected: Number(createFormData.durationExpected),
        url: createFormData.url || null
      };

      if (createFormData.zoomHostId) {
        body.zoomHostId = createFormData.zoomHostId;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/schedule`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        showSuccess('¡Clase programada y guardada con éxito en clases!');
        setCreatingSlot(null);
        onClassUpdated();
      } else {
        const err = await res.json().catch(() => ({}));
        showError('No se pudo programar', err.message || 'Error al guardar la clase');
      }
    } catch (err: any) {
      showError('Error', err.message || 'Error de conexión');
    } finally {
      setIsCreatingClass(false);
    }
  };

  const handlePrevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const handleNextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const formattedSelectedDate = currentDate.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  // Lista de profesores visibles según filtro
  const visibleTeachers = useMemo(() => {
    if (selectedTeacherFilter === 'ALL') return displayTeachers;
    return displayTeachers.filter(t => t.id === selectedTeacherFilter);
  }, [displayTeachers, selectedTeacherFilter]);

  // Hora actual del día
  const currentHourNow = new Date().getHours();
  const isTodaySelected = currentDate.toDateString() === new Date().toDateString();

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl flex flex-col min-h-[920px] overflow-hidden animate-in fade-in duration-300">
      
      {/* ------------------------------------------------------------------- */}
      {/* CABECERA PRINCIPAL CON ESTILO OFICIAL LES ROIS DU FRANÇAIS          */}
      {/* ------------------------------------------------------------------- */}
      <div className="p-6 border-b border-white/15 bg-gradient-to-r from-[#1D3A8A] via-[#1e40af] to-[#1D3A8A] text-white rounded-t-3xl shadow-xl relative overflow-hidden">
        {/* Glows y Acentos de Luz */}
        <div className="absolute -top-12 -right-12 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 left-1/4 w-64 h-64 bg-[#D59B28]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-widest bg-white/10 text-blue-200 px-3 py-1 rounded-full border border-white/15 flex items-center gap-1.5 shadow-xs">
                <Crown className="w-3.5 h-3.5 text-[#D59B28]" />
                Centro de Operaciones & Horarios
              </span>
              {isStressTestActive && (
                <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-rose-500 to-rose-600 text-white px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm animate-pulse">
                  <Activity className="w-3 h-3 text-amber-200" />
                  Prueba de Estrés (37 Clases)
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white capitalize drop-shadow-md flex items-center gap-2">
              <span>{viewType === 'day' ? formattedSelectedDate : `Semana del ${currentWeekStart.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}`}</span>
            </h2>
            <p className="text-blue-200/90 text-xs sm:text-sm font-medium mt-0.5 flex items-center gap-2">
              <span>Control horario en tiempo real y asignación concurrente de salas.</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Botón Prueba de Estrés */}
            <button
              type="button"
              onClick={toggleStressTest}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 border shadow-sm ${
                isStressTestActive
                  ? 'bg-rose-600 text-white border-rose-500 shadow-rose-900/40 ring-2 ring-rose-400'
                  : 'bg-white/10 hover:bg-white/20 text-blue-100 hover:text-white border-white/20'
              }`}
              title="Activar o desactivar simulación de 37 clases para verificar alta densidad sin solapamientos"
            >
              <Zap className={`w-4 h-4 ${isStressTestActive ? 'text-amber-300 fill-amber-300' : 'text-amber-300'}`} />
              <span>{isStressTestActive ? 'Quitar Estrés' : '🧪 Simular 37 Clases'}</span>
            </button>

            {/* Selector de Densidad */}
            <div className="bg-white/10 p-1 rounded-xl flex items-center backdrop-blur-md border border-white/15 shadow-xs">
              <button
                type="button"
                onClick={() => setDensity('comfortable')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  density === 'comfortable' 
                    ? 'bg-white text-[#1D3A8A] shadow-md font-black' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                Estándar
              </button>
              <button
                type="button"
                onClick={() => setDensity('compact')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  density === 'compact' 
                    ? 'bg-[#D59B28] text-white shadow-md font-black' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-200" />
                Alta Densidad
              </button>
            </div>

            {/* Selector Día / Semana */}
            <div className="bg-white/10 p-1 rounded-xl flex items-center backdrop-blur-md border border-white/15 shadow-xs">
              <button 
                onClick={() => setViewType('day')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewType === 'day' 
                    ? 'bg-white text-[#1D3A8A] shadow-md font-black' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                Día
              </button>
              <button 
                onClick={() => setViewType('week')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewType === 'week' 
                    ? 'bg-white text-[#1D3A8A] shadow-md font-black' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                Semana
              </button>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* BARRA DE FILTROS AVANZADOS (Profesor, Grupo, Buscador)             */}
        {/* ------------------------------------------------------------------- */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/15">
          {/* Filtro por Profesor */}
          <div className="relative">
            <select
              value={selectedTeacherFilter}
              onChange={e => setSelectedTeacherFilter(e.target.value)}
              className="w-full bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl py-2 px-3 text-xs text-white outline-none focus:ring-2 focus:ring-[#D59B28] transition-all font-semibold backdrop-blur-md [&>option]:text-slate-800"
            >
              <option value="ALL">👨‍🏫 Todos los Profesores ({displayTeachers.length})</option>
              {displayTeachers.map(t => (
                <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Grupo / Nivel */}
          <div className="relative">
            <select
              value={selectedGroupFilter}
              onChange={e => setSelectedGroupFilter(e.target.value)}
              className="w-full bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl py-2 px-3 text-xs text-white outline-none focus:ring-2 focus:ring-[#D59B28] transition-all font-semibold backdrop-blur-md [&>option]:text-slate-800"
            >
              <option value="ALL">🏛️ Todos los Grupos / Niveles ({availableGroups.length})</option>
              {availableGroups.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-200" />
            <input 
              type="text" 
              placeholder="Buscar clase, tema, sala o profesor..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-blue-200/70 outline-none focus:ring-2 focus:ring-[#D59B28] transition-all backdrop-blur-md"
            />
          </div>
        </div>

        </div>

      {/* ------------------------------------------------------------------- */}
      {/* BARRA DE ESTADO / INFORMACIÓN RÁPIDA (DÍA Y SEMANA)                 */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-4 flex-wrap">
          {viewType === 'day' && dayMetrics && (
            <>
              <span className="flex items-center gap-1.5 font-black text-[#1D3A8A]">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>{dayMetrics.totalClasses} Clases Hoy</span>
              </span>

              {dayMetrics.peakCount > 1 && (
                <span className="flex items-center gap-1 font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-lg">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span>Hora Pico: {dayMetrics.peakHour}:00 hrs ({dayMetrics.peakCount} simultáneas)</span>
                </span>
              )}

              {highlightedHour !== null && (
                <span className="flex items-center gap-1.5 font-bold bg-[#D59B28]/15 text-[#855807] border border-[#D59B28]/40 px-2.5 py-0.5 rounded-lg shadow-xs animate-in fade-in">
                  <Crown className="w-3.5 h-3.5 text-[#D59B28]" />
                  <span>Fila de las {highlightedHour}:00 hrs resaltada ({hourTotalsMap[highlightedHour]} clases)</span>
                  <button 
                    type="button"
                    onClick={() => setHighlightedHour(null)} 
                    className="ml-1 text-[#855807] hover:text-black font-black"
                    title="Quitar resalte"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              <span className="hidden sm:flex items-center gap-1 text-slate-500">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{dayMetrics.activeTeachersCount} Profesores hoy</span>
              </span>
            </>
          )}

          {viewType === 'week' && (
            <>
              <span className="flex items-center gap-1.5 font-black text-[#1D3A8A]">
                <CalendarIcon className="w-4 h-4 text-[#1D3A8A]" />
                <span>{currentViewClasses.length} Clases en la Semana</span>
              </span>

              <span className="hidden sm:flex items-center gap-1 text-slate-500">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{visibleTeachers.length} Profesores disponibles</span>
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {viewType === 'week' ? (
            <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setWeekLayoutMode('timegrid')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  weekLayoutMode === 'timegrid'
                    ? 'bg-white text-[#1D3A8A] shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📅 Horario Semanal (Horas × Días)
              </button>
              <button
                type="button"
                onClick={() => setWeekLayoutMode('teachers')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  weekLayoutMode === 'teachers'
                    ? 'bg-white text-[#1D3A8A] shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                👨‍🏫 Por Profesor
              </button>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 font-semibold hidden md:inline">
              💡 Tip: Haz clic en cualquier hora de la izquierda para resaltar toda esa fila en Dorado Real.
            </span>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* ÁREA DE LA GRILLA DEL CALENDARIO                                    */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex-1 overflow-auto bg-slate-100/60 relative custom-scrollbar">
        {viewType === 'day' ? (
          /* =============================================================== */
          /* VISTA DÍA (ALTA DENSIDAD: COLUMNAS DE PROFESORES + HORAS)        */
          /* =============================================================== */
          <div className="min-w-[950px] h-full flex flex-col">
            {/* Cabecera pegajosa con los profesores */}
            <div className="flex sticky top-0 bg-white border-b border-slate-200 z-20 shadow-xs">
              <div className="w-24 shrink-0 border-r border-slate-200 bg-slate-100/80 flex items-center justify-center p-3">
                <span className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#1D3A8A]" />
                  Hora
                </span>
              </div>
              <div 
                className="flex-1 grid" 
                style={{ gridTemplateColumns: `repeat(${visibleTeachers.length || 1}, minmax(210px, 1fr))` }}
              >
                {visibleTeachers.map((teacher, i) => {
                  const color = getTeacherColor(i);
                  return (
                    <div key={teacher.id} className="p-3 border-r border-slate-200 flex items-center justify-between gap-2 bg-white">
                      <div className="flex items-center gap-2.5 truncate">
                        <div className={`w-8 h-8 rounded-xl ${color.bg} shadow-xs flex items-center justify-center font-black text-xs text-white shrink-0`}>
                          {teacher.firstName?.charAt(0)}{teacher.lastName?.charAt(0)}
                        </div>
                        <div className="truncate">
                          <h4 className="font-black text-slate-800 text-xs truncate">
                            {teacher.firstName} {teacher.lastName}
                          </h4>
                          <span className="text-[10px] text-slate-400 block font-semibold">Profesor Asignado</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grilla de Horarios */}
            <div className="flex-1 relative pb-16">
              {hours.map(hour => {
                const hourStr = `${hour.toString().padStart(2, '0')}:00`;
                const nextHourStr = `${(hour + 1).toString().padStart(2, '0')}:00`;
                const isHighlighted = highlightedHour === hour;
                const isCurrentHour = isTodaySelected && hour === currentHourNow;
                const totalInThisHour = hourTotalsMap[hour] || 0;

                return (
                  <div 
                    key={hour} 
                    className={`flex border-b border-slate-200/80 transition-all duration-150 group ${
                      isHighlighted 
                        ? 'bg-gradient-to-r from-[#D59B28]/15 via-[#D59B28]/8 to-[#D59B28]/5 ring-2 ring-[#D59B28] border-y border-[#D59B28]/60 z-10 shadow-sm' 
                        : isCurrentHour 
                          ? 'bg-blue-50/30' 
                          : 'bg-white'
                    } ${density === 'compact' ? 'min-h-[85px]' : 'min-h-[115px]'}`}
                  >
                    {/* Columna de Hora (Clickable para resaltar la fila en Dorado Real #D59B28) */}
                    <button
                      type="button"
                      onClick={() => setHighlightedHour(isHighlighted ? null : hour)}
                      className={`w-24 shrink-0 border-r border-slate-200 flex flex-col items-center justify-start pt-3 px-1 select-none transition-all cursor-pointer text-center group/hbtn ${
                        isHighlighted 
                          ? 'bg-gradient-to-b from-[#D59B28] to-[#b88219] text-white font-black shadow-md shadow-[#D59B28]/25' 
                          : 'bg-slate-50/80 hover:bg-[#D59B28]/10 text-slate-800'
                      }`}
                      title={isHighlighted ? 'Click para quitar resalte' : `Click para resaltar todas las clases de las ${hourStr}`}
                    >
                      <div className="flex items-center gap-1">
                        <span className={`text-xs font-black ${isHighlighted ? 'text-white font-extrabold drop-shadow-xs' : 'text-slate-800 group-hover/hbtn:text-[#855807]'}`}>
                          {hourStr}
                        </span>
                        {isHighlighted && <Crown className="w-3 h-3 text-amber-200 animate-pulse" />}
                      </div>
                      <span className={`text-[10px] font-medium ${isHighlighted ? 'text-amber-100' : 'text-slate-400'}`}>
                        a {nextHourStr}
                      </span>
                      
                      {/* Indicador de concurrencia en la hora */}
                      {totalInThisHour > 0 && (
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full mt-2 flex items-center gap-0.5 ${
                          isHighlighted
                            ? 'bg-white/20 text-white font-black backdrop-blur-xs'
                            : totalInThisHour >= 4 
                              ? 'bg-amber-100 text-amber-800 border border-amber-200 font-black' 
                              : 'bg-slate-200/70 text-slate-600'
                        }`}>
                          {totalInThisHour >= 4 && <Flame className="w-2.5 h-2.5 text-amber-600" />}
                          {totalInThisHour} {totalInThisHour === 1 ? 'clase' : 'simultáneas'}
                        </span>
                      )}

                      <span className={`text-[8px] font-black uppercase tracking-wider mt-1.5 transition-all ${
                        isHighlighted 
                          ? 'text-white bg-black/20 px-1.5 py-0.5 rounded shadow-2xs' 
                          : 'text-[#855807] opacity-0 group-hover/hbtn:opacity-100'
                      }`}>
                        {isHighlighted ? 'Enfocada' : 'Resaltar'}
                      </span>
                    </button>

                    {/* Columnas por Profesor */}
                    <div 
                      className="flex-1 grid" 
                      style={{ gridTemplateColumns: `repeat(${visibleTeachers.length || 1}, minmax(210px, 1fr))` }}
                    >
                      {visibleTeachers.map((teacher) => {
                        const cellKey = `${hour}_${teacher.id}`;
                        const cellClasses = dayViewIndex.get(cellKey) || [];
                        const hasMultipleInSameCell = cellClasses.length > 1;

                        return (
                          <div
                            key={cellKey}
                            className={`border-r border-slate-200/60 p-1.5 transition-all duration-150 flex flex-col gap-1.5 relative ${
                              dragOverCell === cellKey
                                ? 'bg-[#D59B28]/15 border-2 border-dashed border-[#D59B28] ring-2 ring-[#D59B28]/30 scale-[1.01] z-10 rounded-xl' 
                                : hasMultipleInSameCell 
                                  ? 'bg-amber-50/20' 
                                  : 'hover:bg-blue-50/20'
                            }`}
                            onDragOver={e => handleDragOver(e, cellKey)}
                            onDragLeave={e => handleDragLeave(e, cellKey)}
                            onDrop={e => handleDrop(e, teacher.id, hour)}
                          >
                            {dragOverCell === cellKey && (
                              <div className="p-2 border-2 border-dashed border-[#D59B28] bg-white/90 rounded-xl text-center text-[10px] font-black text-[#855807] shadow-sm animate-pulse flex items-center justify-center gap-1">
                                <span>📥 Soltar a las {hourStr} con {teacher.firstName}</span>
                              </div>
                            )}

                            {cellClasses.length === 0 ? (
                              <button
                                type="button"
                                onClick={() => handleOpenCreateSlot(teacher.id, currentDate, hour)}
                                className="w-full h-full min-h-[55px] border border-dashed border-slate-200/90 hover:border-[#1D3A8A] hover:bg-blue-50/70 rounded-xl flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-[#1D3A8A] transition-all group/slot cursor-pointer"
                                title={`Click para programar clase a las ${hourStr} con ${teacher.firstName}`}
                              >
                                <Plus className="w-3.5 h-3.5 text-slate-400 group-hover/slot:text-[#1D3A8A] group-hover/slot:scale-125 transition-all" />
                                <span>+ Disponible</span>
                              </button>
                            ) : (
                              <>
                                {/* Banner de advertencia si un mismo profesor tiene 2 clases al mismo tiempo */}
                                {hasMultipleInSameCell && (
                                  <div className="p-1 px-2 rounded-lg bg-amber-100/90 border border-amber-300 text-amber-950 text-[10px] font-black flex items-center gap-1.5 shadow-xs">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    <span>{cellClasses.length} clases asignadas a la misma hora (Solapamiento)</span>
                                  </div>
                                )}

                                {cellClasses.map((cls: any) => {
                                  const classTime = new Date(cls.scheduledAt);
                                  const timeFormatted = classTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                  const levelBadge = getLevelBadgeStyle(cls.module?.level?.name || cls.title);
                                  const isBeingDragged = draggedClassId === cls.id;

                                  if (density === 'compact') {
                                    /* ======================================= */
                                    /* MODO ALTA DENSIDAD: MICRO-CHIPS          */
                                    /* ======================================= */
                                    return (
                                      <div
                                        key={cls.id}
                                        draggable={true}
                                        onDragStart={e => handleDragStart(e, cls)}
                                        onDragEnd={handleDragEnd}
                                        onClick={() => setEditingClass(cls)}
                                        className={`rounded-xl p-2 shadow-xs cursor-grab active:cursor-grabbing select-none border transition-all duration-150 hover:scale-[1.01] hover:shadow-md bg-white border-slate-200 hover:border-[#D59B28] flex flex-col justify-between group/card ${
                                          isBeingDragged ? 'opacity-30 scale-95 border-2 border-dashed border-[#D59B28]' : ''
                                        }`}
                                      >
                                        <div className="flex items-center justify-between gap-1">
                                          <div className="flex items-center gap-1 truncate">
                                            <GripVertical className="w-3 h-3 text-slate-300 group-hover/card:text-[#D59B28] shrink-0" />
                                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md truncate ${levelBadge}`}>
                                              {cls.module?.level?.name || 'Grupo'}
                                            </span>
                                          </div>
                                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md shrink-0">
                                            {timeFormatted}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-1 mt-1">
                                          <span className="text-[10px] text-slate-700 truncate font-bold">
                                            {cls.title}
                                          </span>
                                          {cls.url && (
                                            <span className="w-4 h-4 rounded-full bg-blue-100 text-[#1D3A8A] flex items-center justify-center shrink-0" title="Enlace de Zoom">
                                              <Video className="w-2.5 h-2.5" />
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  }

                                  /* ======================================= */
                                  /* MODO ESTÁNDAR: TARJETA RICA CON COLOR   */
                                  /* DE GRUPO/NIVEL (NO TODO AZUL)           */
                                  /* ======================================= */
                                  const groupTheme = getLevelCardTheme(cls.module?.level?.name || cls.title);

                                  return (
                                    <div
                                      key={cls.id}
                                      draggable={true}
                                      onDragStart={e => handleDragStart(e, cls)}
                                      onDragEnd={handleDragEnd}
                                      onClick={() => setEditingClass(cls)}
                                      className={`rounded-2xl p-3 shadow-xs cursor-grab active:cursor-grabbing select-none border transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg group/card ${groupTheme.bg} ${groupTheme.borderLeft} ${
                                        isBeingDragged ? 'opacity-30 scale-95 border-2 border-dashed border-[#D59B28]' : ''
                                      } flex flex-col justify-between`}
                                    >
                                      <div>
                                        <div className="flex items-start justify-between gap-1.5">
                                          <div className="flex items-center gap-1.5 truncate">
                                            <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover/card:text-[#D59B28] shrink-0" />
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md truncate ${groupTheme.badge}`}>
                                              {cls.module?.level?.name || 'Nivel'}
                                            </span>
                                          </div>
                                          <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                                            <Clock className="w-2.5 h-2.5 text-slate-500" />
                                            {timeFormatted}
                                          </span>
                                        </div>
                                        <h4 className="font-black text-xs sm:text-sm mt-2 leading-snug line-clamp-1 text-slate-800 group-hover/card:text-[#1D3A8A] transition-colors">
                                          {cls.title}
                                        </h4>
                                        <p className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">
                                          {cls.module?.name || 'Unidad de Estudio'}
                                        </p>
                                      </div>

                                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                                        <span className="text-[10px] text-slate-400 font-bold">
                                          {cls.durationExpected ? `${cls.durationExpected / 60} min` : '50 min'}
                                        </span>
                                        {cls.url && (
                                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors ${groupTheme.zoomBg}`}>
                                            <Video className="w-3 h-3" />
                                            <span>{cls.zoomHostName || 'Zoom'}</span>
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : weekLayoutMode === 'timegrid' ? (
          /* =============================================================== */
          /* VISTA SEMANA: HORARIO SEMANAL REAL (HORAS × 7 DÍAS)              */
          /* =============================================================== */
          <div className="min-w-[1100px] h-full flex flex-col">
            {/* Cabecera de los 7 Días */}
            <div className="flex sticky top-0 bg-white border-b border-slate-200 z-20 shadow-xs">
              <div className="w-24 shrink-0 border-r border-slate-200 bg-slate-100/80 flex items-center justify-center p-3">
                <span className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#1D3A8A]" />
                  Hora
                </span>
              </div>
              <div className="flex-1 grid grid-cols-7">
                {weekDays.map(day => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  const isSelected = day.toDateString() === currentDate.toDateString();
                  const count = weekDayTotalsMap[day.toDateString()] || 0;
                  const dayShort = day.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
                  const dayNumber = day.getDate();
                  const monthShort = day.toLocaleDateString('es-ES', { month: 'short' });

                  return (
                    <div 
                      key={day.toISOString()} 
                      onClick={() => {
                        setCurrentDate(day);
                        setViewType('day');
                      }}
                      className={`p-3 border-r border-slate-200 text-center cursor-pointer transition-all duration-150 group/dheader ${
                        isToday 
                          ? 'bg-gradient-to-b from-blue-50 to-blue-100/50 border-b-2 border-b-[#1D3A8A]' 
                          : isSelected 
                            ? 'bg-amber-50/70 border-b-2 border-b-[#D59B28]' 
                            : 'bg-white hover:bg-slate-50'
                      }`}
                      title={`Click para abrir la vista diaria del ${dayNumber} de ${monthShort}`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 group-hover/dheader:text-[#1D3A8A]">
                          {dayShort}
                        </span>
                        {isToday && (
                          <span className="text-[9px] font-black bg-[#1D3A8A] text-white px-1.5 py-0.2 rounded-full uppercase">
                            Hoy
                          </span>
                        )}
                      </div>
                      <p className={`text-xl font-black mt-0.5 ${isToday ? 'text-[#1D3A8A]' : 'text-slate-800'}`}>
                        {dayNumber}
                      </p>
                      <div className="mt-1 flex items-center justify-center">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          count > 0 
                            ? 'bg-blue-100 text-[#1D3A8A]' 
                            : 'text-slate-400 bg-slate-100'
                        }`}>
                          {count} {count === 1 ? 'clase' : 'clases'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grilla Semanal Horas × Días */}
            <div className="flex-1 relative pb-16">
              {hours.map(hour => {
                const hourStr = `${hour.toString().padStart(2, '0')}:00`;
                const nextHourStr = `${(hour + 1).toString().padStart(2, '0')}:00`;
                const isHighlighted = highlightedHour === hour;
                const isCurrentHour = isTodaySelected && hour === currentHourNow;

                return (
                  <div 
                    key={hour} 
                    className={`flex border-b border-slate-200/80 transition-all duration-150 group ${
                      isHighlighted 
                        ? 'bg-gradient-to-r from-[#D59B28]/15 via-[#D59B28]/8 to-[#D59B28]/5 ring-2 ring-[#D59B28] border-y border-[#D59B28]/60 z-10 shadow-sm' 
                        : isCurrentHour 
                          ? 'bg-blue-50/30' 
                          : 'bg-white'
                    } min-h-[105px]`}
                  >
                    {/* Columna de Hora */}
                    <button
                      type="button"
                      onClick={() => setHighlightedHour(isHighlighted ? null : hour)}
                      className={`w-24 shrink-0 border-r border-slate-200 flex flex-col items-center justify-start pt-3 px-1 select-none transition-all cursor-pointer text-center group/hbtn ${
                        isHighlighted 
                          ? 'bg-gradient-to-b from-[#D59B28] to-[#b88219] text-white font-black shadow-md shadow-[#D59B28]/25' 
                          : 'bg-slate-50/80 hover:bg-[#D59B28]/10 text-slate-800'
                      }`}
                      title={isHighlighted ? 'Click para quitar resalte' : `Click para resaltar todas las clases de las ${hourStr}`}
                    >
                      <div className="flex items-center gap-1">
                        <span className={`text-xs font-black ${isHighlighted ? 'text-white font-extrabold drop-shadow-xs' : 'text-slate-800 group-hover/hbtn:text-[#855807]'}`}>
                          {hourStr}
                        </span>
                        {isHighlighted && <Crown className="w-3 h-3 text-amber-200 animate-pulse" />}
                      </div>
                      <span className={`text-[10px] font-medium ${isHighlighted ? 'text-amber-100' : 'text-slate-400'}`}>
                        a {nextHourStr}
                      </span>
                    </button>

                    {/* 7 Celdas por Día */}
                    <div className="flex-1 grid grid-cols-7">
                      {weekDays.map(day => {
                        const cellKey = `${day.toDateString()}_${hour}`;
                        const slotClasses = weekTimeGridIndex.get(cellKey) || [];
                        const isDragOver = dragOverCell === cellKey;
                        const isToday = day.toDateString() === new Date().toDateString();

                        return (
                          <div
                            key={cellKey}
                            className={`border-r border-slate-200/70 p-1.5 flex flex-col gap-1.5 transition-all duration-150 relative min-h-[100px] ${
                              isDragOver
                                ? 'bg-[#D59B28]/15 border-2 border-dashed border-[#D59B28] ring-2 ring-[#D59B28]/30 scale-[1.01] z-10 rounded-xl'
                                : isToday
                                  ? 'bg-blue-50/15'
                                  : 'hover:bg-slate-50/50'
                            }`}
                            onDragOver={e => handleDragOver(e, cellKey)}
                            onDragLeave={e => handleDragLeave(e, cellKey)}
                            onDrop={e => handleDrop(e, slotClasses[0]?.teacherId || displayTeachers[0]?.id, hour, day.toISOString())}
                          >
                            {isDragOver && (
                              <div className="p-1.5 border-2 border-dashed border-[#D59B28] bg-white/95 rounded-lg text-center text-[9px] font-black text-[#855807] shadow-sm animate-pulse flex items-center justify-center gap-1">
                                <span>📥 Soltar a las {hourStr}</span>
                              </div>
                            )}

                            {slotClasses.length === 0 ? (
                              <button
                                type="button"
                                onClick={() => handleOpenCreateSlot(displayTeachers[0]?.id || '', day, hour)}
                                className="w-full h-full min-h-[60px] border border-dashed border-slate-200 hover:border-[#1D3A8A] hover:bg-blue-50/60 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-300 hover:text-[#1D3A8A] opacity-0 hover:opacity-100 transition-all cursor-pointer group/wslot"
                                title={`Click para programar clase el ${day.toLocaleDateString()} a las ${hourStr}`}
                              >
                                <Plus className="w-3.5 h-3.5 group-hover/wslot:scale-125 transition-transform" />
                              </button>
                            ) : (
                              <>
                                {/* Mostramos un máximo de 2 tarjetas para mantener la grilla semanal simétrica y sin desbordes */}
                                {slotClasses.slice(0, 2).map((cls: any) => {
                                  const groupTheme = getLevelCardTheme(cls.module?.level?.name || cls.title);
                                  const teacherObj = displayTeachers.find(t => t.id === (cls.teacherId || cls.module?.level?.teacherId));
                                  const isBeingDragged = draggedClassId === cls.id;
                                  const timeStr = new Date(cls.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                  return (
                                    <div
                                      key={cls.id}
                                      draggable={true}
                                      onDragStart={e => handleDragStart(e, cls)}
                                      onDragEnd={handleDragEnd}
                                      onClick={() => setEditingClass(cls)}
                                      className={`rounded-xl p-2 shadow-2xs border cursor-grab active:cursor-grabbing select-none transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between group/card ${groupTheme.bg} ${groupTheme.borderLeft} ${
                                        isBeingDragged ? 'opacity-30 scale-95 border-2 border-dashed border-[#D59B28]' : ''
                                      }`}
                                    >
                                      <div>
                                        <div className="flex items-center justify-between gap-1">
                                          <div className="flex items-center gap-1 truncate">
                                            <GripVertical className="w-3 h-3 text-slate-300 group-hover/card:text-[#D59B28] shrink-0" />
                                            <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded truncate ${groupTheme.badge}`}>
                                              {cls.module?.level?.name || 'Grupo'}
                                            </span>
                                          </div>
                                          <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded shrink-0">
                                            {timeStr}
                                          </span>
                                        </div>

                                        <h5 className="font-black text-xs text-slate-800 mt-1 leading-snug truncate group-hover/card:text-[#1D3A8A] transition-colors">
                                          {cls.title}
                                        </h5>
                                      </div>

                                      <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-slate-100 text-[10px]">
                                        <div className="flex items-center gap-1 text-slate-600 truncate">
                                          <div className="w-3.5 h-3.5 rounded-full bg-[#1D3A8A] text-white font-black text-[7.5px] flex items-center justify-center shrink-0">
                                            {teacherObj?.firstName?.charAt(0) || 'P'}
                                          </div>
                                          <span className="truncate font-semibold text-[9.5px]">{teacherObj?.firstName || 'Profesor'}</span>
                                        </div>

                                        {cls.url && (
                                          <span className={`p-0.5 px-1 rounded ${groupTheme.zoomBg}`} title="Enlace de Zoom disponible">
                                            <Video className="w-2.5 h-2.5" />
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}

                                {/* Si hay más de 2 clases en este bloque: Botón Dorado con Corona Imperial */}
                                {slotClasses.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSimultaneousModalSlot({
                                        day,
                                        hour,
                                        classes: slotClasses
                                      });
                                    }}
                                    className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-amber-50 via-amber-100/70 to-amber-50 border border-[#D59B28]/60 hover:border-[#D59B28] text-[#855807] hover:text-[#5a3a02] text-[10px] font-black flex items-center justify-between gap-1.5 transition-all shadow-2xs hover:shadow-xs group/more cursor-pointer"
                                    title="Click para ver todas las clases simultáneas de esta hora"
                                  >
                                    <div className="flex items-center gap-1 truncate">
                                      <Crown className="w-3 h-3 text-[#D59B28] group-hover/more:scale-125 transition-transform shrink-0" />
                                      <span className="truncate">+{slotClasses.length - 2} clases más</span>
                                    </div>
                                    <span className="text-[9px] font-extrabold bg-[#D59B28] text-white px-1.5 py-0.2 rounded-md shadow-2xs group-hover/more:bg-[#b88219] transition-colors shrink-0">
                                      Ver {slotClasses.length}
                                    </span>
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* =============================================================== */
          /* VISTA SEMANA: MATRIZ POR PROFESOR (PROFESORES × DÍAS)            */
          /* =============================================================== */
          <div className="min-w-[980px] h-full flex flex-col">
            {/* Cabecera de días de la semana */}
            <div className="flex sticky top-0 bg-white border-b border-slate-200 z-20 shadow-xs">
              <div className="w-56 shrink-0 border-r border-slate-200 bg-slate-100/80 flex items-center justify-center p-3">
                <span className="text-xs font-black text-slate-600 uppercase tracking-wider">Profesores</span>
              </div>
              <div className="flex-1 grid grid-cols-7">
                {weekDays.map(day => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  const isSelected = day.toDateString() === currentDate.toDateString();

                  return (
                    <div 
                      key={day.toISOString()} 
                      onClick={() => {
                        setCurrentDate(day);
                        setViewType('day');
                      }}
                      className={`p-3 border-r border-slate-200 text-center cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-amber-50 text-[#855807]' 
                          : isToday 
                            ? 'bg-blue-50/50 text-[#1D3A8A]' 
                            : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <p className="text-[11px] font-black uppercase tracking-wider">
                        {day.toLocaleDateString('es-ES', { weekday: 'short' })}
                      </p>
                      <p className={`text-base font-black mt-0.5 ${isSelected ? 'text-[#D59B28]' : 'text-slate-800'}`}>
                        {day.getDate()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filas por Profesor */}
            <div className="flex-1 flex flex-col pb-16">
              {visibleTeachers.map((teacher, i) => {
                const teacherColor = getTeacherColor(i);

                return (
                  <div key={teacher.id} className="flex border-b border-slate-200 min-h-[140px] group bg-white">
                    {/* Columna Profesor */}
                    <div className="w-56 shrink-0 border-r border-slate-200 bg-white flex items-center p-4 gap-3 shadow-xs z-10">
                      <div className={`w-10 h-10 rounded-2xl ${teacherColor.bg} shadow-md flex items-center justify-center font-black text-sm text-white shrink-0 ring-2 ring-slate-100`}>
                        {teacher.firstName?.charAt(0)}{teacher.lastName?.charAt(0)}
                      </div>
                      <div className="truncate">
                        <h4 className="font-black text-slate-800 text-xs truncate">
                          {teacher.firstName} {teacher.lastName}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold block">Profesor Asignado</span>
                      </div>
                    </div>

                    {/* 7 Días */}
                    <div className="flex-1 grid grid-cols-7">
                      {weekDays.map(day => {
                        const cellKey = `${day.toDateString()}_${teacher.id}`;
                        const dayClasses = weekViewIndex.get(cellKey) || [];

                        return (
                          <div 
                            key={cellKey} 
                            className={`border-r border-slate-200/60 p-1.5 flex flex-col gap-1.5 transition-all duration-150 relative ${
                              dragOverCell === cellKey
                                ? 'bg-[#D59B28]/15 border-2 border-dashed border-[#D59B28] ring-2 ring-[#D59B28]/30 scale-[1.01] z-10 rounded-xl'
                                : day.toDateString() === new Date().toDateString() 
                                  ? 'bg-blue-50/20' 
                                  : 'hover:bg-blue-50/20'
                            }`}
                            onDragOver={e => handleDragOver(e, cellKey)}
                            onDragLeave={e => handleDragLeave(e, cellKey)}
                            onDrop={e => handleDrop(e, teacher.id, undefined, day.toISOString())}
                          >
                            {dragOverCell === cellKey && (
                              <div className="p-1.5 border-2 border-dashed border-[#D59B28] bg-white/90 rounded-lg text-center text-[9px] font-black text-[#855807] shadow-xs animate-pulse">
                                📥 Soltar aquí
                              </div>
                            )}

                            {dayClasses.map((cls: any) => {
                              const startTime = new Date(cls.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              const isBeingDragged = draggedClassId === cls.id;
                              const groupTheme = getLevelCardTheme(cls.module?.level?.name || cls.title);

                              return (
                                <div 
                                  key={cls.id}
                                  draggable={true}
                                  onDragStart={e => handleDragStart(e, cls)}
                                  onDragEnd={handleDragEnd}
                                  onClick={() => setEditingClass(cls)}
                                  className={`p-2 rounded-xl border cursor-grab active:cursor-grabbing select-none hover:scale-[1.02] hover:shadow-md transition-all w-full text-left shadow-2xs group/wcard ${groupTheme.bg} ${groupTheme.borderLeft} ${
                                    isBeingDragged ? 'opacity-30 scale-95 border-2 border-dashed border-[#D59B28]' : ''
                                  }`}
                                >
                                  <div className="flex justify-between items-center gap-1">
                                    <div className="flex items-center gap-1 truncate">
                                      <GripVertical className="w-2.5 h-2.5 text-slate-400 group-hover/wcard:text-[#D59B28] shrink-0" />
                                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded truncate ${groupTheme.badge}`}>
                                        {cls.module?.level?.name || 'Clase'}
                                      </span>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-1 rounded shrink-0">{startTime}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-800 font-bold truncate mt-1">{cls.title}</p>
                                </div>
                              );
                            })}
                            {dayClasses.length === 0 && (
                              <button
                                type="button"
                                onClick={() => handleOpenCreateSlot(teacher.id, day, 10)}
                                className="w-full h-full min-h-[60px] border border-dashed border-slate-200/90 hover:border-[#1D3A8A] hover:bg-blue-50/50 rounded-xl flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400 hover:text-[#1D3A8A] transition-all cursor-pointer group/wslot"
                                title={`Programar clase para ${teacher.firstName}`}
                              >
                                <Plus className="w-3 h-3 text-slate-400 group-hover/wslot:scale-125 transition-transform" />
                                <span>+ Disponible</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SLIDER INFERIOR DE SEMANAS                                          */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white border-t border-slate-200 p-4 shrink-0 shadow-lg z-10 relative">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button 
            onClick={handlePrevWeek} 
            className="p-2.5 text-slate-500 hover:text-[#1D3A8A] hover:bg-blue-50 rounded-2xl transition-all font-bold flex items-center gap-1.5 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline text-xs">Semana Anterior</span>
          </button>
          
          <div className="flex-1 flex justify-center gap-1 sm:gap-2 overflow-x-auto px-1 hide-scrollbar">
            {sliderDays.map(dayInfo => {
              const isSelected = viewType === 'day' ? dayInfo.date.toDateString() === currentDate.toDateString() : false;
              const isToday = dayInfo.date.toDateString() === new Date().toDateString();
              
              return (
                <button
                  key={dayInfo.date.toISOString()}
                  onClick={() => {
                    setCurrentDate(dayInfo.date);
                    if (viewType === 'week') setViewType('day');
                  }}
                  className={`flex flex-col items-center justify-center min-w-[50px] sm:min-w-[65px] py-2.5 rounded-2xl border-2 transition-all duration-200
                    ${isSelected 
                      ? 'border-[#D92534] bg-rose-50 shadow-md shadow-rose-100 scale-105' 
                      : isToday 
                        ? 'border-[#1D3A8A] bg-blue-50/50 hover:bg-blue-50'
                        : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-[#D92534]' : isToday ? 'text-[#1D3A8A]' : 'text-slate-400'}`}>
                    {dayInfo.dayName}
                  </span>
                  <span className={`text-base sm:text-lg font-black ${isSelected ? 'text-[#D92534]' : isToday ? 'text-[#1D3A8A]' : 'text-slate-700'}`}>
                    {dayInfo.dayNumber}
                  </span>
                  <div className={`w-6 h-1 rounded-full mt-1.5 transition-colors ${isSelected ? 'bg-[#D59B28]' : isToday ? 'bg-[#1D3A8A]/30' : 'bg-transparent'}`}></div>
                </button>
              );
            })}
          </div>

          <button 
            onClick={handleNextWeek} 
            className="p-2.5 text-slate-500 hover:text-[#1D3A8A] hover:bg-blue-50 rounded-2xl transition-all font-bold flex items-center gap-1.5 group"
          >
            <span className="hidden sm:inline text-xs">Semana Siguiente</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* MODAL / PANEL EJECUTIVO DE DETALLE DE CLASE CON BITÁCORA Y ALUMNOS */}
      {/* ------------------------------------------------------------------- */}
      {editingClass && (
        <div 
          onClick={() => setEditingClass(null)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 cursor-pointer"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 cursor-default flex flex-col max-h-[92vh]"
          >
            {/* CABECERA REAL FRANCESA */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#1D3A8A] via-[#1e40af] to-[#1D3A8A] text-white relative overflow-hidden flex flex-col gap-4 border-b border-white/10 shrink-0">
              {/* Glows y Acentos de Luz */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#D59B28]/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-8 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

              {/* Fila Superior */}
              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#D59B28] to-[#b88219] flex items-center justify-center shadow-lg shadow-[#D59B28]/30 shrink-0">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/15 text-amber-200 px-2.5 py-0.5 rounded-full border border-white/20">
                        {editingClass.module?.level?.name || editingClass.title}
                      </span>
                      {editingClass.isStressTest && (
                        <span className="text-[9px] font-bold bg-rose-500/80 text-white px-2 py-0.5 rounded-full">
                          Simulación
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-lg sm:text-xl text-white tracking-tight mt-0.5 drop-shadow-sm">
                      {editingClass.title || 'Detalles de la Clase'}
                    </h3>
                    <p className="text-blue-100/80 text-xs font-medium flex items-center gap-1.5 mt-0.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>
                        {editingClass.scheduledAt ? new Date(editingClass.scheduledAt).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : ''} · {editingClass.scheduledAt ? new Date(editingClass.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''} hrs
                      </span>
                    </p>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => setEditingClass(null)} 
                  className="p-2 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer shrink-0"
                  title="Cerrar ventana"
                >
                  <X className="w-5 h-5"/>
                </button>
              </div>

              {/* Selector de Pestañas Ejecutivo */}
              <div className="relative z-10 flex items-center gap-2 bg-black/20 p-1 rounded-2xl backdrop-blur-md border border-white/15 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setClassDetailTab('session')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                    classDetailTab === 'session'
                      ? 'bg-white text-[#1D3A8A] shadow-md'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#D59B28]" />
                  <span>Sesión & Bitácora</span>
                </button>

                <button
                  type="button"
                  onClick={() => setClassDetailTab('students')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                    classDetailTab === 'students'
                      ? 'bg-white text-[#1D3A8A] shadow-md'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>Alumnos del Grupo</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    classDetailTab === 'students'
                      ? 'bg-blue-100 text-[#1D3A8A]'
                      : 'bg-white/20 text-white'
                  }`}>
                    {asyncGroupStudents.length}
                  </span>
                </button>
              </div>
            </div>

            {/* CONTENIDO SCROLLABLE */}
            <form onSubmit={handleUpdate} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">

                {/* ========================================================= */}
                {/* PESTAÑA 1: SESIÓN & BITÁCORA                             */}
                {/* ========================================================= */}
                {classDetailTab === 'session' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    
                    {/* Tarjeta de Zoom */}
                    <div className="bg-gradient-to-br from-blue-50/80 to-slate-50 p-4 rounded-2xl border border-blue-100/80 shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Video className="w-4 h-4 text-blue-600" />
                          Sala Virtual de Zoom
                        </label>
                        {editingClass.url && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Enlace Configurado
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="relative flex-1">
                          <input 
                            type="url" 
                            placeholder="https://zoom.us/j/..."
                            value={editingClass.url || ''} 
                            onChange={e => setEditingClass({...editingClass, url: e.target.value})}
                            className="w-full border border-slate-200 rounded-xl py-2.5 px-3 text-xs bg-white text-slate-700 font-medium focus:ring-2 focus:ring-[#1D3A8A] outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {editingClass.url && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleCopyZoomLink(editingClass.url)}
                                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-xs ${
                                  copiedZoom
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                                }`}
                                title="Copiar enlace de Zoom al portapapeles"
                              >
                                {copiedZoom ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                                <span>{copiedZoom ? '¡Copiado!' : 'Copiar'}</span>
                              </button>

                              <a 
                                href={editingClass.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                                title="Abrir sala de Zoom"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Entrar</span>
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Fila Título y Maestro */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                          Título de la Clase
                        </label>
                        <input 
                          type="text" 
                          value={editingClass.title || ''} 
                          onChange={e => setEditingClass({...editingClass, title: e.target.value})}
                          className="w-full border border-slate-200 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#1D3A8A] outline-none font-bold text-slate-700 bg-white text-xs shadow-xs" 
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                            Maestro Asignado
                          </label>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {teacherAvailability.filter(t => t.isAvailable).length} libres
                          </span>
                        </div>

                        <select 
                          value={editingClass.teacherId || editingClass.module?.level?.teacherId || ''}
                          onChange={e => setEditingClass({...editingClass, teacherId: e.target.value})}
                          className="w-full border border-slate-200 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#1D3A8A] outline-none font-bold text-slate-700 bg-white text-xs shadow-xs"
                        >
                          <option value="">Seleccionar Maestro</option>
                          <optgroup label="🟢 PROFESORES DISPONIBLES A ESTA HORA">
                            {teacherAvailability.filter(t => t.isAvailable).map(({ teacher }) => (
                              <option key={teacher.id} value={teacher.id}>
                                🟢 {teacher.firstName} {teacher.lastName} (Disponible)
                              </option>
                            ))}
                          </optgroup>
                          {teacherAvailability.some(t => !t.isAvailable) && (
                            <optgroup label="🔴 PROFESORES OCUPADOS A ESTA HORA">
                              {teacherAvailability.filter(t => !t.isAvailable).map(({ teacher, conflictingClassTitle }) => (
                                <option key={teacher.id} value={teacher.id}>
                                  🔴 {teacher.firstName} {teacher.lastName} (Ocupado con {conflictingClassTitle})
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </select>
                      </div>
                    </div>

                    {/* Alerta interactiva de solapamiento */}
                    {(() => {
                      const currentTId = editingClass.teacherId || editingClass.module?.level?.teacherId;
                      const currentAvail = teacherAvailability.find(t => t.teacher.id === currentTId);
                      if (currentAvail && !currentAvail.isAvailable) {
                        return (
                          <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-2.5 shadow-xs">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div className="text-xs text-amber-950 leading-relaxed">
                              <strong className="block font-black text-amber-900">⚠️ Solapamiento Detectado</strong>
                              Este maestro ya tiene asignada la clase <em>"{currentAvail.conflictingClassTitle}"</em> a esta misma hora.
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* Fila Fecha y Horario */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Día</label>
                        <input 
                          type="date" 
                          value={editingClass.scheduledAt ? new Date(editingClass.scheduledAt).toISOString().split('T')[0] : ''}
                          onChange={e => {
                            const newDate = new Date(editingClass.scheduledAt);
                            const [y, m, d] = e.target.value.split('-').map(Number);
                            newDate.setFullYear(y, m - 1, d);
                            setEditingClass({...editingClass, scheduledAt: newDate.toISOString()});
                          }}
                          className="w-full border border-slate-200 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#1D3A8A] outline-none font-bold text-slate-700 bg-white text-xs shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Horario</label>
                        <input 
                          type="time" 
                          value={editingClass.scheduledAt ? new Date(editingClass.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false}) : ''}
                          onChange={e => updateEditingTime(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#1D3A8A] outline-none font-bold text-slate-700 bg-white text-xs shadow-xs"
                        />
                      </div>
                    </div>

                    {/* ========================================================= */}
                    {/* BITÁCORA OFICIAL DE LA SESIÓN EN TIEMPO REAL             */}
                    {/* ========================================================= */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-[#D59B28]" />
                          Bitácora & Notas Pedagógicas de la Sesión
                        </label>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          Persistencia en BD
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={editingClass.description || ''}
                        onChange={e => setEditingClass({...editingClass, description: e.target.value})}
                        placeholder="Escribe aquí los temas vistos, vocabulario francés trabajado, tareas para la próxima sesión u observaciones generales del grupo..."
                        className="w-full border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 font-medium placeholder-slate-400 focus:ring-2 focus:ring-[#1D3A8A] outline-none bg-slate-50/50 resize-none transition-all shadow-xs leading-relaxed"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        💡 Las notas de la bitácora quedan vinculadas a esta clase para consulta de profesores y administradores.
                      </p>
                    </div>

                  </div>
                )}

                {/* ========================================================= */}
                {/* PESTAÑA 2: ALUMNOS DEL GRUPO                             */}
                {/* ========================================================= */}
                {classDetailTab === 'students' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    
                    {/* Buscador de alumnos */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={studentSearch}
                          onChange={e => setStudentSearch(e.target.value)}
                          placeholder="Buscar alumno por nombre, correo o teléfono..."
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1D3A8A] outline-none font-medium text-slate-700"
                        />
                        {studentSearch && (
                          <button
                            type="button"
                            onClick={() => setStudentSearch('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl shrink-0">
                        {displayedStudents.length} de {asyncGroupStudents.length} alumnos
                      </span>
                    </div>

                    {/* Lista de Alumnos */}
                    {isLoadingStudents ? (
                      <div className="py-12 text-center">
                        <div className="w-8 h-8 border-3 border-[#1D3A8A] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-xs text-slate-500 font-medium">Cargando alumnos inscritos en este grupo...</p>
                      </div>
                    ) : displayedStudents.length === 0 ? (
                      <div className="py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-600">No se encontraron alumnos para este grupo</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {studentSearch ? 'Intenta con otro término de búsqueda' : 'Puedes inscribir alumnos a este grupo desde el módulo de Grupos.'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                        {displayedStudents.map((student: any) => {
                          const initials = `${(student.firstName || '')[0] || ''}${(student.lastName || '')[0] || ''}`.toUpperCase() || 'AL';
                          const whatsAppUrl = getWhatsAppUrl(student);

                          return (
                            <div 
                              key={student.id} 
                              className="p-3 bg-white rounded-2xl border border-slate-200/80 hover:border-blue-200 hover:shadow-sm transition-all flex items-center justify-between gap-3 group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1D3A8A] to-[#1e40af] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                                  {initials}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-bold text-xs text-slate-800 truncate">
                                    {student.firstName} {student.lastName}
                                  </h4>
                                  <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                                    <Mail className="w-3 h-3 text-slate-400" />
                                    <span>{student.email || 'Sin correo'}</span>
                                  </p>
                                  {student.phone && (
                                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                      <Phone className="w-2.5 h-2.5 text-slate-400" />
                                      <span>{student.phone}</span>
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {/* Botón Copiar con Emojis */}
                                <button
                                  type="button"
                                  onClick={() => handleCopyMessage(getWhatsAppMessage(student.firstName, true))}
                                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-bold text-xs transition-colors"
                                  title="Copiar mensaje con emojis para pegar en WhatsApp"
                                >
                                  {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>

                                {/* Botón WhatsApp Oficial (enlace directo limpio sin ??) */}
                                <a
                                  href={whatsAppUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 group"
                                  title="Abrir WhatsApp directo con mensaje limpio (sin signos de interrogación)"
                                >
                                  <svg className="w-3.5 h-3.5 fill-white shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.488-8.413z"/>
                                  </svg>
                                  <span>WhatsApp</span>
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* FOOTER ACCIONES */}
              <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
                <button 
                  type="button" 
                  onClick={() => handleDelete(editingClass.id)}
                  className="px-4 py-2.5 bg-rose-50 text-[#D92534] hover:bg-rose-100 font-bold rounded-xl transition-colors shadow-xs text-xs flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Eliminar Clase</span>
                </button>

                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => setEditingClass(null)}
                    className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-600 font-bold rounded-xl transition-colors text-xs border border-slate-200"
                  >
                    Cancelar
                  </button>

                  <button 
                    type="submit" 
                    disabled={isSavingClass}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#1D3A8A] to-[#1e40af] text-white font-black rounded-xl hover:opacity-95 transition-all shadow-md text-xs flex items-center gap-2"
                  >
                    {isSavingClass ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                        <span>Guardar Cambios & Bitácora</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL DE CREACIÓN RÁPIDA DE CLASE EN SLOT DISPONIBLE                */}
      {/* ------------------------------------------------------------------- */}
      {creatingSlot && (
        <div 
          onClick={() => setCreatingSlot(null)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 cursor-default"
          >
            {/* Cabecera */}
            <div className="p-6 bg-gradient-to-r from-[#1D3A8A] via-[#1e40af] to-[#1D3A8A] text-white relative overflow-hidden flex justify-between items-start">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D59B28]/20 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative z-10">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#D59B28] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Programación Instantánea
                </span>
                <h3 className="font-black text-lg sm:text-xl text-white mt-0.5">
                  Programar Nueva Clase
                </h3>
                <p className="text-xs text-blue-200 mt-0.5">
                  {displayTeachers.find(t => t.id === createFormData.teacherId)?.firstName || 'Profesor'} · {createFormData.time} hrs
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setCreatingSlot(null)} 
                className="p-2 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-colors relative z-20 cursor-pointer"
                title="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {/* Grupo / Nivel */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Grupo / Nivel <span className="text-[#D92534]">*</span>
                </label>
                <select
                  value={createFormData.levelId}
                  onChange={e => handleCreateLevelChange(e.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#1D3A8A] outline-none font-bold text-slate-800 bg-slate-50/60 text-xs shadow-xs"
                >
                  <option value="">-- Seleccionar Grupo --</option>
                  {levels.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.schedule || l.rhythm || 'Regular'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Título de la clase */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Título de la Clase <span className="text-[#D92534]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={createFormData.title}
                  onChange={e => setCreateFormData({ ...createFormData, title: e.target.value })}
                  placeholder="ej. Toulouse B1 · Sesión 1"
                  className="w-full border border-slate-200 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#1D3A8A] outline-none font-bold text-slate-800 bg-white text-xs shadow-xs"
                />
              </div>

              {/* Profesor Responsable (Pre-Asignado y Fijado de la Columna) */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#1D3A8A] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                    {displayTeachers.find(t => t.id === createFormData.teacherId)?.firstName?.charAt(0)}
                    {displayTeachers.find(t => t.id === createFormData.teacherId)?.lastName?.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block leading-none">
                      Profesor Responsable
                    </span>
                    <p className="text-xs font-black text-slate-800 mt-1">
                      {displayTeachers.find(t => t.id === createFormData.teacherId)?.firstName} {displayTeachers.find(t => t.id === createFormData.teacherId)?.lastName}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-slate-200/80 text-slate-600 rounded-md text-[10px] font-black flex items-center gap-1 shrink-0 select-none">
                  🔒 Fijado
                </span>
              </div>

              {/* Fecha y Horario Automáticos (Fijados por la Celda del Calendario) */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#1D3A8A] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block leading-none">
                      Fecha y Horario de Sesión
                    </span>
                    <p className="text-xs font-black text-slate-800 mt-1 capitalize">
                      {new Date(`${createFormData.date}T12:00:00`).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })} · {createFormData.time} hrs
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-slate-200/80 text-slate-600 rounded-md text-[10px] font-black flex items-center gap-1 shrink-0 select-none">
                  🔒 Fijado
                </span>
              </div>

              {/* Duración */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Duración de la Sesión
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCreateFormData({ ...createFormData, durationExpected: 3000 })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      createFormData.durationExpected === 3000
                        ? 'bg-[#1D3A8A] text-white border-[#1D3A8A] shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    50 minutos (Regular)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateFormData({ ...createFormData, durationExpected: 10200 })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      createFormData.durationExpected === 10200
                        ? 'bg-[#D59B28] text-white border-[#D59B28] shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    2h 50min (Sabatino)
                  </button>
                </div>
              </div>

              {/* Enlace de Zoom */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Enlace de Zoom (Opcional)
                </label>
                <input
                  type="url"
                  value={createFormData.url}
                  onChange={e => setCreateFormData({ ...createFormData, url: e.target.value })}
                  placeholder="https://zoom.us/j/..."
                  className="w-full border border-slate-200 rounded-xl py-2 px-3 text-xs bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-[#1D3A8A] shadow-xs"
                />
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreatingSlot(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreatingClass}
                  className="flex-[2] py-3 bg-gradient-to-r from-[#1D3A8A] to-[#1e40af] text-white font-black rounded-xl hover:opacity-95 transition-all shadow-md text-xs flex items-center justify-center gap-2"
                >
                  {isCreatingClass ? (
                    <span>Guardando...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Crear y Guardar Clase</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL / POPOVER DE CLASES SIMULTÁNEAS EN VISTA SEMANAL              */}
      {/* ------------------------------------------------------------------- */}
      {simultaneousModalSlot && (
        <div 
          onClick={() => setSimultaneousModalSlot(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh] cursor-default"
          >
            {/* Cabecera Real */}
            <div className="bg-gradient-to-r from-[#1D3A8A] via-[#1e40af] to-[#1D3A8A] p-5 text-white relative flex items-center justify-between border-b border-[#D59B28]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D59B28] to-[#b88219] flex items-center justify-center shadow-lg shadow-[#D59B28]/30 shrink-0">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                      {simultaneousModalSlot.day.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
                      {simultaneousModalSlot.hour.toString().padStart(2, '0')}:00 hrs
                    </span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-white mt-0.5">
                    {simultaneousModalSlot.classes.length} Clases Simultáneas en este Horario
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSimultaneousModalSlot(null)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
                title="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido con lista de clases */}
            <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-3 custom-scrollbar bg-slate-50/50">
              {simultaneousModalSlot.classes.map((cls: any) => {
                const groupTheme = getLevelCardTheme(cls.module?.level?.name || cls.title);
                const teacherObj = displayTeachers.find(t => t.id === (cls.teacherId || cls.module?.level?.teacherId));
                const timeStr = new Date(cls.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div
                    key={cls.id}
                    onClick={() => {
                      setSimultaneousModalSlot(null);
                      setEditingClass(cls);
                    }}
                    className={`p-4 rounded-2xl border bg-white shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 group hover:-translate-y-0.5 ${groupTheme.borderLeft}`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-xs text-slate-700 shrink-0 border border-slate-200">
                        {teacherObj?.firstName?.charAt(0)}{teacherObj?.lastName?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${groupTheme.badge}`}>
                            {cls.module?.level?.name || 'Grupo'}
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            {timeStr}
                          </span>
                        </div>
                        <h4 className="font-black text-sm text-slate-800 mt-1 truncate group-hover:text-[#1D3A8A] transition-colors">
                          {cls.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          Profesor: <strong className="text-slate-700">{teacherObj?.firstName} {teacherObj?.lastName}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {cls.url && (
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${groupTheme.zoomBg}`}>
                          <Video className="w-3.5 h-3.5" />
                          <span>Zoom</span>
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-400 group-hover:text-[#D59B28] transition-colors flex items-center gap-1">
                        <span>Editar</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer del Modal */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const currentSlot = simultaneousModalSlot;
                  setSimultaneousModalSlot(null);
                  handleOpenCreateSlot('', currentSlot.day, currentSlot.hour);
                }}
                className="px-4 py-2 rounded-xl bg-blue-50 text-[#1D3A8A] hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Programar Otra Clase a esta Hora</span>
              </button>

              <button
                type="button"
                onClick={() => setSimultaneousModalSlot(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 7px;
          height: 7px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
