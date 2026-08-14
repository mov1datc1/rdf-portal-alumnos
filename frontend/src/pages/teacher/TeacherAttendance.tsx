import { useState, useEffect, useMemo } from 'react';
import { Loader2, ClipboardCheck, Check, X, History, User, Calendar as CalendarIcon, Clock, Users, ArrowDownAZ, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { showSuccess, showError } from '../../utils/alerts';

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
  const [fetchingAttendance, setFetchingAttendance] = useState(false);
  const [sortBy, setSortBy] = useState<'firstName' | 'lastName'>('firstName');

  // Individual Audit State
  const [auditStudentId, setAuditStudentId] = useState<string | null>(null);
  const [auditData, setAuditData] = useState<{ student: any, audit: any[] } | null>(null);
  const [loadingAudit, setLoadingAudit] = useState(false);

  // Group Audit State
  const [showGroupAudit, setShowGroupAudit] = useState(false);
  const [groupAuditData, setGroupAuditData] = useState<{ students: any[], classes: any[], attendanceMap: Record<string, boolean> } | null>(null);
  const [loadingGroupAudit, setLoadingGroupAudit] = useState(false);

  useEffect(() => {
    if (!session) return;
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/teacher/groups`, { headers: { 'Authorization': `Bearer ${session.access_token}` } }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/teacher/attendance/schedule`, { headers: { 'Authorization': `Bearer ${session.access_token}` } }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/teacher/students`, { headers: { 'Authorization': `Bearer ${session.access_token}` } }).then(r => r.json()),
    ])
      .then(([g, s, st]) => { setGroups(g); setSchedule(s); setStudents(st); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  // When a class is selected, find its level, get students and fetch existing attendance
  useEffect(() => {
    if (!selectedClass) return;
    const cls = schedule.find(c => c.id === selectedClass);
    if (!cls) return;
    const levelId = cls.module?.level?.id;
    setSelectedLevel(levelId || '');

    const loadAttendance = async () => {
      setFetchingAttendance(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/teacher/attendance/${selectedClass}`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        });
        const existingAttendance = res.ok ? await res.json() : [];
        
        const groupStudents = students.filter(s => s.currentLevel?.id === levelId);
        const initial: Record<string, boolean> = {};
        
        groupStudents.forEach(s => {
          const existing = existingAttendance.find((a: any) => a.userId === s.id);
          if (existing) {
            initial[s.id] = existing.attended;
          } else {
            initial[s.id] = true; // Default: all present if no record
          }
        });
        
        setAttendees(initial);
      } catch (e) {
        console.error(e);
      } finally {
        setFetchingAttendance(false);
      }
    };

    loadAttendance();
  }, [selectedClass, schedule, students, session]);

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
      showSuccess('Asistencia registrada correctamente');
    } catch (err) {
      console.error(err);
      showError('Error al guardar asistencia');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAudit = async (e: React.MouseEvent, studentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setAuditStudentId(studentId);
    setLoadingAudit(true);
    setAuditData(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/teacher/attendance/audit/${studentId}`, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) {
        setAuditData(await res.json());
      }
    } catch (err) {
      console.error(err);
      showError('Error al cargar el historial del alumno');
    } finally {
      setLoadingAudit(false);
    }
  };

  const handleOpenGroupAudit = async () => {
    if (!selectedLevel) return;
    setShowGroupAudit(true);
    setLoadingGroupAudit(true);
    setGroupAuditData(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/teacher/attendance/audit/group/${selectedLevel}`, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) {
        setGroupAuditData(await res.json());
      }
    } catch (err) {
      console.error(err);
      showError('Error al cargar el historial del grupo');
    } finally {
      setLoadingGroupAudit(false);
    }
  };

  const markAll = (status: boolean) => {
    const updated = { ...attendees };
    Object.keys(updated).forEach(k => updated[k] = status);
    setAttendees(updated);
  };

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="w-10 h-10 animate-spin text-[#1D3A8A]" /></div>;

  const groupStudentsForSelected = students
    .filter(s => s.currentLevel?.id === selectedLevel)
    .sort((a, b) => {
      if (sortBy === 'firstName') return a.firstName.localeCompare(b.firstName);
      if (sortBy === 'lastName') return a.lastName.localeCompare(b.lastName);
      return 0;
    });

  // Group schedule into "Hoy/Futuras" and "Pasadas"
  const now = new Date();
  const pastClasses = schedule.filter(c => new Date(c.scheduledAt) < now).reverse(); // newest past classes first
  const futureClasses = schedule.filter(c => new Date(c.scheduledAt) >= now);

  const selectedClassData = schedule.find(c => c.id === selectedClass);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Asistencia</h1>
        <p className="text-slate-500 mt-1">Selecciona una clase para registrar o modificar la asistencia.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Class Selector */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#1D3A8A]" />
              Clases de Hoy y Próximas
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {futureClasses.length === 0 && <p className="text-sm text-slate-500 italic">No hay clases próximas.</p>}
              {futureClasses.map(cls => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClass(cls.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all ${selectedClass === cls.id ? 'border-[#1D3A8A] bg-blue-50 ring-1 ring-[#1D3A8A] shadow-sm' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
                >
                  <p className="font-semibold text-slate-800 text-sm truncate">{cls.title}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 truncate">
                    <Users className="w-3.5 h-3.5" /> {cls.module?.level?.name}
                  </p>
                  <p className="text-xs text-[#1D3A8A] font-medium mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {new Date(cls.scheduledAt).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })} • {new Date(cls.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-500" />
              Clases Pasadas
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {pastClasses.length === 0 && <p className="text-sm text-slate-500 italic">No hay clases pasadas recientes.</p>}
              {pastClasses.map(cls => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClass(cls.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all ${selectedClass === cls.id ? 'border-[#1D3A8A] bg-blue-50 ring-1 ring-[#1D3A8A] shadow-sm' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50 opacity-80 hover:opacity-100'}`}
                >
                  <p className="font-semibold text-slate-700 text-sm truncate">{cls.title}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 truncate">
                    <Users className="w-3.5 h-3.5" /> {cls.module?.level?.name}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {new Date(cls.scheduledAt).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })} • {new Date(cls.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Attendance List */}
        <div className="lg:col-span-8">
          {selectedClass ? (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col min-h-[600px] relative overflow-hidden">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1D3A8A] text-xs font-bold mb-3 border border-blue-100">
                    <Users className="w-4 h-4" />
                    Grupo {selectedClassData?.module?.level?.name}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedClassData?.title}</h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium">
                    {new Date(selectedClassData?.scheduledAt).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} a las {new Date(selectedClassData?.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                <button onClick={handleOpenGroupAudit}
                  className="shrink-0 py-2.5 px-5 rounded-xl font-bold text-[#1D3A8A] bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 shadow-sm border border-blue-200"
                >
                  <History className="w-4 h-4" />
                  Auditor de Grupo
                </button>
              </div>

              {fetchingAttendance ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#1D3A8A] mb-3" />
                  <p className="text-sm text-slate-500">Cargando lista de alumnos...</p>
                </div>
              ) : groupStudentsForSelected.length > 0 ? (
                <>
                  {/* Actions & Filters */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5"><ArrowDownAZ className="w-4 h-4"/> Ordenar por:</span>
                      <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value as 'firstName' | 'lastName')}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-[#1D3A8A]/20 transition-all"
                      >
                        <option value="firstName">Nombre (A-Z)</option>
                        <option value="lastName">Apellido (A-Z)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => markAll(true)} className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Todos Presentes
                      </button>
                      <button onClick={() => markAll(false)} className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> Todos Ausentes
                      </button>
                    </div>
                  </div>

                  {/* Student List */}
                  <div className="space-y-3 flex-1 overflow-y-auto pr-2 pb-6 custom-scrollbar">
                    {groupStudentsForSelected.map(s => {
                      const isPresent = attendees[s.id];
                      return (
                        <div key={s.id} className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all duration-300 hover:shadow-md ${
                          isPresent ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/50'
                        }`}>
                          <div className="flex items-center gap-4 mb-4 sm:mb-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-sm ${
                              isPresent ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                            }`}>
                              {isPresent ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                            </div>
                            <div>
                              <span className="font-bold text-[15px] text-slate-800 block">{s.firstName} {s.lastName}</span>
                              <span className={`text-xs font-bold mt-0.5 inline-block ${isPresent ? 'text-emerald-600' : 'text-red-600'}`}>
                                {isPresent ? 'Asistió' : 'Faltó'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 sm:ml-auto">
                            {/* Toggle Switches */}
                            <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1 shadow-sm shrink-0">
                              <button
                                onClick={() => setAttendees(prev => ({...prev, [s.id]: true}))}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${isPresent ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                              >
                                Presente
                              </button>
                              <button
                                onClick={() => setAttendees(prev => ({...prev, [s.id]: false}))}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${!isPresent ? 'bg-red-100 text-red-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                              >
                                Ausente
                              </button>
                            </div>
                            
                            <button 
                              onClick={(e) => handleOpenAudit(e, s.id)}
                              className="p-2.5 text-slate-400 hover:text-[#1D3A8A] hover:bg-blue-50 rounded-xl transition-colors border border-transparent hover:border-blue-200 shrink-0"
                              title="Ver historial del alumno"
                            >
                              <History className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 border-t border-slate-100 mt-auto">
                    <button onClick={handleSave} disabled={saving}
                      className="w-full py-4 rounded-2xl font-bold text-white bg-[#1D3A8A] hover:bg-blue-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <ClipboardCheck className="w-6 h-6" />}
                      Guardar Asistencia
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                  <Users className="w-12 h-12 mb-3 text-slate-300" />
                  <p>No hay alumnos registrados en este grupo.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[600px] text-slate-400">
              <ClipboardCheck className="w-16 h-16 mb-4 text-slate-200" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">Ninguna clase seleccionada</h3>
              <p className="text-center max-w-sm">Selecciona una clase del panel lateral para comenzar a registrar la asistencia.</p>
            </div>
          )}
        </div>
      </div>

      {/* Auditor Individual Modal */}
      {auditStudentId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setAuditStudentId(null)}>
          <div 
            className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#1D3A8A]">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">Auditor Individual</h3>
                  {auditData && (
                    <p className="text-sm text-slate-500 font-medium">{auditData.student.firstName} {auditData.student.lastName}</p>
                  )}
                </div>
              </div>
              <button onClick={() => setAuditStudentId(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              {loadingAudit ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#1D3A8A] mb-4" />
                  <p className="text-sm text-slate-500">Cargando historial...</p>
                </div>
              ) : !auditData ? (
                <div className="text-center py-12 text-slate-500">Error al cargar datos.</div>
              ) : auditData.audit.length === 0 ? (
                <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200">
                  <History className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                  No hay clases pasadas registradas para su grupo.
                </div>
              ) : (
                <div className="space-y-3">
                  {auditData.audit.map((record: any, idx: number) => {
                    const isPresent = record.attended === true;
                    const isAbsent = record.attended === false;
                    const notTaken = record.attended === null;

                    return (
                      <div key={record.class.id || idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow gap-3">
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{record.class.title}</p>
                          <p className="text-xs font-medium text-slate-500 mt-1">
                            {new Date(record.class.scheduledAt).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })} • {new Date(record.class.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div>
                          {isPresent && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                              <Check className="w-4 h-4" /> Asistió
                            </span>
                          )}
                          {isAbsent && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-100">
                              <X className="w-4 h-4" /> Faltó
                            </span>
                          )}
                          {notTaken && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold border border-slate-200">
                              <History className="w-4 h-4" /> Sin registro
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            
            {/* Footer */}
            {auditData && (
              <div className="p-5 bg-white border-t border-gray-100 flex justify-between items-center px-6">
                <div className="text-sm text-slate-500 font-medium">
                  Total: <span className="font-bold text-slate-800">{auditData.audit.length}</span> clases
                </div>
                <div className="flex gap-4">
                  <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                    {auditData.audit.filter((a:any) => a.attended === true).length} ✓
                  </span>
                  <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                    {auditData.audit.filter((a:any) => a.attended === false).length} ✗
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auditor Grupal Modal */}
      {showGroupAudit && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowGroupAudit(false)}>
          <div 
            className="bg-white rounded-[2rem] w-full max-w-5xl shadow-2xl flex flex-col h-[85vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#1D3A8A]">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">Auditor Grupal</h3>
                  <p className="text-sm text-slate-500 font-medium">Grupo {selectedClassData?.module?.level?.name}</p>
                </div>
              </div>
              <button onClick={() => setShowGroupAudit(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto bg-slate-50/30">
              {loadingGroupAudit ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-[#1D3A8A] mb-4" />
                  <p className="text-sm text-slate-500 font-medium">Compilando auditoría...</p>
                </div>
              ) : !groupAuditData ? (
                <div className="text-center py-12 text-slate-500">Error al cargar datos.</div>
              ) : groupAuditData.classes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <History className="w-12 h-12 mb-3 text-slate-300" />
                  No hay clases pasadas registradas.
                </div>
              ) : (
                <div className="p-6">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="p-4 font-bold text-sm text-slate-700 border-b border-slate-200 bg-slate-50 sticky left-0 z-20 shadow-[1px_0_0_0_#e2e8f0]">Alumno</th>
                            {groupAuditData.classes.map(cls => (
                              <th key={cls.id} className="p-4 font-bold text-xs text-slate-500 border-b border-slate-200 min-w-[120px] text-center">
                                <div className="line-clamp-1">{cls.title}</div>
                                <div className="font-medium mt-1">{new Date(cls.scheduledAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {groupAuditData.students.map(student => (
                            <tr key={student.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 group">
                              <td className="p-4 font-semibold text-sm text-slate-800 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-10 shadow-[1px_0_0_0_#e2e8f0]">
                                {student.firstName} {student.lastName}
                              </td>
                              {groupAuditData.classes.map(cls => {
                                const attended = groupAuditData.attendanceMap[`${student.id}-${cls.id}`];
                                return (
                                  <td key={cls.id} className="p-4 text-center">
                                    {attended === true && (
                                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
                                        <Check className="w-4 h-4" />
                                      </div>
                                    )}
                                    {attended === false && (
                                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 shadow-sm">
                                        <X className="w-4 h-4" />
                                      </div>
                                    )}
                                    {attended === undefined && (
                                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-400 border border-slate-200" title="Sin registro">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
