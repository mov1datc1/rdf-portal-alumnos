import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, Clock, X, Video } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { showSuccess, showError } from '../../../utils/alerts';

interface ScheduleCalendarProps {
  classes: any[];
  teachers: any[];
  onClassUpdated: () => void;
}

export function ScheduleCalendar({ classes, teachers, onClassUpdated }: ScheduleCalendarProps) {
  const session = useAuthStore(state => state.session);
  const [viewType, setViewType] = useState<'day' | 'week'>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [editingClass, setEditingClass] = useState<any | null>(null);

  const START_HOUR = 8;
  const END_HOUR = 21;
  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  const formatDateForSlider = (date: Date) => {
    const d = new Date(date);
    const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
    const dayNumber = d.getDate();
    return { dayName, dayNumber, date: d };
  };

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
      days.push(formatDateForSlider(d));
    }
    return days;
  }, [currentWeekStart]);

  const currentViewClasses = useMemo(() => {
        return classes.filter(c => {
      const term = searchTerm.toLowerCase();
      const matchTitle = c.title?.toLowerCase().includes(term);
      const matchLevel = c.module?.level?.name?.toLowerCase().includes(term);
      const matchTeacher = teachers.some(t => 
        (t.id === c.teacherId || t.id === c.module?.level?.teacherId) && 
        (t.firstName?.toLowerCase().includes(term) || t.lastName?.toLowerCase().includes(term))
      );
      
      const matchSearch = !term || matchTitle || matchLevel || matchTeacher;

      const classDate = new Date(c.scheduledAt);
      if (viewType === 'day') {
        return classDate.toDateString() === currentDate.toDateString() && matchSearch;
      } else {
        const start = new Date(currentWeekStart);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        return classDate >= start && classDate <= end && matchSearch;
      }
    });
  }, [classes, currentDate, viewType, currentWeekStart]);

  const handleDragStart = (e: React.DragEvent, classItem: any) => {
    e.dataTransfer.setData('classId', classItem.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetTeacherId: string, targetHour?: number, targetDateStr?: string) => {
    e.preventDefault();
    const classId = e.dataTransfer.getData('classId');
    const classItem = classes.find(c => c.id === classId);
    if (!classItem) return;

    let newScheduledAt = new Date(classItem.scheduledAt);
    
    if (viewType === 'day' && targetHour !== undefined) {
      newScheduledAt.setHours(targetHour, 0, 0, 0);
    } else if (viewType === 'week' && targetDateStr) {
      const targetDate = new Date(targetDateStr);
      newScheduledAt.setFullYear(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/schedule/${classId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teacherId: targetTeacherId,
          scheduledAt: newScheduledAt.toISOString(),
          moduleId: classItem.moduleId,
          title: classItem.title,
          url: classItem.url
        })
      });

      if (res.ok) {
        onClassUpdated();
        // showSuccess('Clase reasignada exitosamente'); // Removed as requested
      } else {
        showError('Error', 'No se pudo reasignar la clase');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;

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
          url: editingClass.url
        })
      });

      if (res.ok) {
        showSuccess('Clase actualizada');
        setEditingClass(null);
        onClassUpdated();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getTeacherColor = (index: number) => {
    const colors = [
      { bg: 'bg-[#1D3A8A]', hover: 'hover:bg-[#152c6e]', text: 'text-white' }, // Navy Blue
      { bg: 'bg-[#E11D48]', hover: 'hover:bg-[#be123c]', text: 'text-white' }, // Crimson Red
      { bg: 'bg-[#DE9D2E]', hover: 'hover:bg-[#c28620]', text: 'text-white' }, // Gold
      { bg: 'bg-[#0369A1]', hover: 'hover:bg-[#075985]', text: 'text-white' }, // Ocean Blue
      { bg: 'bg-[#059669]', hover: 'hover:bg-[#047857]', text: 'text-white' }  // Emerald
    ];
    return colors[index % colors.length];
  };

  const weekDays = sliderDays.map(d => d.date);

  const updateEditingTime = (timeStr: string) => {
    if (!editingClass) return;
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date(editingClass.scheduledAt);
    d.setHours(h, m, 0, 0);
    setEditingClass({ ...editingClass, scheduledAt: d.toISOString() });
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

  const formattedSelectedDate = currentDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl flex flex-col h-[850px] overflow-hidden animate-in fade-in duration-300">
      
      {/* Top Bar with Branding */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-[#1D3A8A]/20 bg-gradient-to-r from-[#1D3A8A] to-[#1e40af] text-white rounded-t-3xl shadow-md relative overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#E11D48] to-transparent opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-gradient-to-tr from-[#DE9D2E] to-transparent opacity-20 rounded-full blur-2xl translate-y-1/2"></div>

        <div className="relative z-10 flex flex-col items-start gap-1 w-full sm:w-auto mb-4 sm:mb-0">
          <h2 className="text-2xl font-black text-white capitalize drop-shadow-md">
            {viewType === 'day' ? formattedSelectedDate : `Semana del ${currentWeekStart.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}`}
          </h2>
          <p className="text-blue-200 text-sm font-medium">Gestiona los horarios de los profesores arrastrando las clases</p>
        </div>

        <div className="relative z-10 flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200" />
            <input 
              type="text" 
              placeholder="Buscar maestro o grupo..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-[#DE9D2E] transition-all placeholder:text-blue-200 outline-none backdrop-blur-sm"
            />
          </div>

          <div className="bg-white/10 p-1 rounded-xl flex items-center backdrop-blur-sm border border-white/10">
            <button 
              onClick={() => setViewType('day')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${viewType === 'day' ? 'bg-[#DE9D2E] text-white shadow-lg shadow-[#DE9D2E]/20 scale-105' : 'text-blue-100 hover:text-white'}`}
            >
              Día
            </button>
            <button 
              onClick={() => setViewType('week')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${viewType === 'week' ? 'bg-[#DE9D2E] text-white shadow-lg shadow-[#DE9D2E]/20 scale-105' : 'text-blue-100 hover:text-white'}`}
            >
              Semana
            </button>
          </div>
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 overflow-auto bg-slate-50 relative custom-scrollbar">
        {viewType === 'day' ? (
          <div className="min-w-[800px] h-full flex flex-col">
            {/* Headers (Teachers) */}
            <div className="flex sticky top-0 bg-white border-b border-gray-200 z-20 shadow-sm">
              <div className="w-20 shrink-0 border-r border-gray-100 bg-slate-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#1D3A8A]/50" />
              </div>
              <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${teachers.length}, minmax(180px, 1fr))` }}>
                {teachers.map((teacher, i) => (
                  <div key={teacher.id} className="p-4 border-r border-gray-100 flex items-center gap-3 justify-center bg-white">
                    <div className={`w-8 h-8 rounded-full ${getTeacherColor(i).bg} shadow-md flex items-center justify-center font-bold text-xs text-white ring-2 ring-white`}>
                      {teacher.firstName?.charAt(0)}{teacher.lastName?.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-700">{teacher.firstName} {teacher.lastName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 relative pb-10">
              {hours.map(hour => (
                <div key={hour} className="flex h-24 border-b border-slate-100 group">
                  <div className="w-20 shrink-0 border-r border-gray-100 bg-slate-50/50 flex items-start justify-center pt-2">
                    <span className="text-xs font-bold text-slate-400">{hour.toString().padStart(2, '0')}:00</span>
                  </div>
                  <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${teachers.length}, minmax(180px, 1fr))` }}>
                    {teachers.map((teacher, i) => {
                      const cellClasses = currentViewClasses.filter(c => {
                        const h = new Date(c.scheduledAt).getHours();
                        const tId = c.teacherId || c.module?.level?.teacherId;
                        return h === hour && tId === teacher.id;
                      });

                      return (
                        <div 
                          key={`${hour}-${teacher.id}`} 
                          className="border-r border-slate-50 relative p-1 hover:bg-[#1D3A8A]/5 transition-colors duration-200"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, teacher.id, hour)}
                        >
                          {cellClasses.map(cls => (
                            <div 
                              key={cls.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, cls)}
                              onClick={() => setEditingClass(cls)}
                              className={`absolute inset-x-2 top-1 bottom-1 rounded-xl p-3 shadow-md cursor-pointer border border-white/20 transition-all duration-200 hover:scale-[1.02] active:scale-95 hover:shadow-lg ${getTeacherColor(i).bg} text-white flex flex-col justify-between`}
                            >
                              <div>
                                <h4 className="font-black text-sm leading-tight line-clamp-1">{cls.module?.level?.name || cls.title}</h4>
                                <p className="text-[11px] opacity-90 mt-0.5 line-clamp-1 font-medium">{cls.title}</p>
                              </div>
                              {cls.url && <div className="mt-2 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"><Video className="w-3 h-3" /></div>}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Week View */
          <div className="min-w-[800px] h-full flex flex-col">
             <div className="flex sticky top-0 bg-white border-b border-gray-200 z-20 shadow-sm">
                <div className="w-56 shrink-0 border-r border-gray-100 bg-slate-50 flex items-center justify-center">
                  <span className="text-sm font-bold text-slate-400">Profesores</span>
                </div>
                <div className="flex-1 grid grid-cols-7">
                  {weekDays.map(day => (
                    <div key={day.toISOString()} className={`p-4 border-r border-gray-100 text-center ${day.toDateString() === new Date().toDateString() ? 'bg-blue-50/50' : 'bg-white'}`}>
                      <p className={`text-xs font-black uppercase ${day.toDateString() === new Date().toDateString() ? 'text-[#1D3A8A]' : 'text-slate-500'}`}>{day.toLocaleDateString('es-ES', { weekday: 'short' })}</p>
                      <p className={`text-lg font-black mt-1 ${day.toDateString() === new Date().toDateString() ? 'text-[#E11D48]' : 'text-slate-800'}`}>{day.getDate()}</p>
                    </div>
                  ))}
                </div>
             </div>
             
             <div className="flex-1 flex flex-col pb-10">
                {teachers.map((teacher, i) => (
                  <div key={teacher.id} className="flex border-b border-gray-100 min-h-[120px] group">
                    <div className="w-56 shrink-0 border-r border-gray-100 bg-white flex items-center p-5 gap-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] z-10">
                      <div className={`w-10 h-10 rounded-full ${getTeacherColor(i).bg} shadow-md flex items-center justify-center font-bold text-sm text-white ring-2 ring-slate-50`}>
                        {teacher.firstName?.charAt(0)}{teacher.lastName?.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700 text-sm">{teacher.firstName} {teacher.lastName}</span>
                    </div>
                    <div className="flex-1 grid grid-cols-7">
                      {weekDays.map(day => {
                        const dayClasses = currentViewClasses.filter(c => {
                          const d = new Date(c.scheduledAt);
                          const tId = c.teacherId || c.module?.level?.teacherId;
                          return d.toDateString() === day.toDateString() && tId === teacher.id;
                        });

                        return (
                          <div 
                            key={day.toISOString()} 
                            className={`border-r border-slate-50 p-2 flex flex-col gap-2 transition-colors duration-200 hover:bg-[#1D3A8A]/5 ${day.toDateString() === new Date().toDateString() ? 'bg-blue-50/30' : ''}`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, teacher.id, undefined, day.toISOString())}
                          >
                            {dayClasses.map(cls => (
                              <div 
                                key={cls.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, cls)}
                                onClick={() => setEditingClass(cls)}
                                className={`px-3 py-2 rounded-xl shadow-sm text-white cursor-pointer hover:scale-105 hover:shadow-md transition-all w-full text-left border border-white/20 ${getTeacherColor(i).bg}`}
                              >
                                <p className="text-xs font-black line-clamp-1">{cls.module?.level?.name || 'Clase'}</p>
                                <p className="text-[8px] sm:text-[10px] opacity-90 font-medium mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(cls.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
                                </p>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Bottom Slider with Next/Prev Week */}
      <div className="bg-white border-t border-gray-200 p-4 shrink-0 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] z-10 relative">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button 
            onClick={handlePrevWeek} 
            className="p-3 text-slate-400 hover:text-[#1D3A8A] hover:bg-blue-50 rounded-xl transition-all font-bold flex items-center gap-2 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Semana Anterior</span>
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
                  className={`flex flex-col items-center justify-center min-w-[50px] sm:min-w-[65px] py-3 rounded-2xl border-2 transition-all duration-300
                    ${isSelected 
                      ? 'border-[#E11D48] bg-rose-50 shadow-md shadow-rose-100 scale-105' 
                      : isToday 
                        ? 'border-[#1D3A8A] bg-blue-50/50 hover:bg-blue-50 hover:border-[#1D3A8A]'
                        : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  <span className={`text-[8px] sm:text-[10px] font-black uppercase mb-1 tracking-wider ${isSelected ? 'text-[#E11D48]' : isToday ? 'text-[#1D3A8A]' : 'text-slate-400'}`}>
                    {dayInfo.dayName}
                  </span>
                  <span className={`text-lg sm:text-xl font-black ${isSelected ? 'text-[#E11D48]' : isToday ? 'text-[#1D3A8A]' : 'text-slate-700'}`}>
                    {dayInfo.dayNumber}
                  </span>
                  <div className={`w-8 h-1.5 rounded-full mt-2 transition-colors ${isSelected ? 'bg-[#DE9D2E]' : isToday ? 'bg-[#1D3A8A]/30' : 'bg-transparent'}`}></div>
                </button>
              );
            })}
          </div>

          <button 
            onClick={handleNextWeek} 
            className="p-3 text-slate-400 hover:text-[#1D3A8A] hover:bg-blue-50 rounded-xl transition-all font-bold flex items-center gap-2 group"
          >
            <span className="hidden sm:inline">Semana Siguiente</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Edit Modal (Pro Styling) */}
      {editingClass && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="p-6 bg-gradient-to-r from-[#1D3A8A] to-[#254ab5] flex justify-between items-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="font-black text-lg sm:text-xl relative z-10 drop-shadow-sm">Detalles de la clase</h3>
              <button onClick={() => setEditingClass(null)} className="p-2 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-colors relative z-10"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Grupo / Tema</label>
                <input 
                  type="text" 
                  disabled
                  value={editingClass.module?.level?.name || editingClass.title} 
                  className="w-full border border-slate-200 rounded-xl py-3 px-4 bg-slate-50 text-slate-700 font-bold cursor-not-allowed" 
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Maestro</label>
                <select 
                  value={editingClass.teacherId || editingClass.module?.level?.teacherId || ''}
                  onChange={e => setEditingClass({...editingClass, teacherId: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#1D3A8A] outline-none font-bold text-slate-700 bg-white"
                >
                  <option value="">Seleccionar Maestro</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#1D3A8A] outline-none font-bold text-slate-700 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Horario</label>
                  <input 
                    type="time" 
                    value={editingClass.scheduledAt ? new Date(editingClass.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false}) : ''}
                    onChange={e => updateEditingTime(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#1D3A8A] outline-none font-bold text-slate-700 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => handleDelete(editingClass.id)}
                  className="flex-1 py-3 bg-rose-50 text-[#E11D48] font-black rounded-xl hover:bg-rose-100 transition-colors shadow-sm"
                >
                  Eliminar
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-3 bg-[#DE9D2E] text-white font-black rounded-xl hover:bg-[#c28620] transition-colors shadow-lg shadow-[#DE9D2E]/30"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
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

