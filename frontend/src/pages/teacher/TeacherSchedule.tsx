import { useState, useEffect } from 'react';
import { Loader2, Calendar as CalendarIcon, Clock, Layers, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function TeacherSchedule() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useAuthStore(state => state.session);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (!session) return;
    fetch(`${import.meta.env.VITE_API_URL}/teacher/schedule`, {
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    })
      .then(res => res.json())
      .then(setClasses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#b91c1c]" /></div>;

  // Calendar logic
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const weekDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

  // Check if a day has classes
  const hasClasses = (date: Date) => {
    return classes.some(cls => {
      const clsDate = new Date(cls.scheduledAt);
      return clsDate.getDate() === date.getDate() &&
             clsDate.getMonth() === date.getMonth() &&
             clsDate.getFullYear() === date.getFullYear();
    });
  };

  // Get classes for selected date
  const selectedClasses = classes.filter(cls => {
    const clsDate = new Date(cls.scheduledAt);
    return clsDate.getDate() === selectedDate.getDate() &&
           clsDate.getMonth() === selectedDate.getMonth() &&
           clsDate.getFullYear() === selectedDate.getFullYear();
  });

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const isToday = (d: Date) => isSameDay(d, new Date());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Mi Horario</h1>
        <p className="text-slate-500 text-sm">Organiza y visualiza tus clases programadas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lado Izquierdo: Calendario */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 capitalize">
                {currentMonth.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextMonth} className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-bold text-slate-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {paddingDays.map(i => (
                <div key={`padding-${i}`} className="p-3" />
              ))}
              {days.map(day => {
                const hasClass = hasClasses(day);
                const isSelected = isSameDay(day, selectedDate);
                const today = isToday(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`relative p-3 rounded-2xl flex flex-col items-center justify-center min-h-[4rem] transition-all
                      ${isSelected ? 'bg-[#b91c1c] text-white shadow-lg shadow-red-900/20' : 'hover:bg-slate-50 text-slate-700'}
                      ${today && !isSelected ? 'ring-2 ring-[#b91c1c]/30 font-bold' : ''}
                    `}
                  >
                    <span className={`text-lg ${isSelected ? 'font-bold' : ''}`}>{day.getDate()}</span>
                    {hasClass && (
                      <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-[#b91c1c]'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lado Derecho: Clases del Día */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-6">
            <h3 className="font-bold text-slate-800 text-lg mb-1 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#b91c1c]" />
              {selectedDate.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              {selectedClasses.length === 0 
                ? 'No tienes clases este día.' 
                : `Tienes ${selectedClasses.length} clase${selectedClasses.length > 1 ? 's' : ''} programada${selectedClasses.length > 1 ? 's' : ''}.`}
            </p>

            <div className="space-y-4">
              {selectedClasses.map(cls => (
                <div key={cls.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-[#b91c1c]/30 transition-colors group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-slate-800 leading-tight">{cls.title}</p>
                      <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-[#b91c1c] bg-red-50 px-2 py-1 rounded-md">
                        <Layers className="w-3 h-3" />
                        {cls.module?.level?.name}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-4">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {new Date(cls.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>

                  {cls.url ? (
                    <a href={cls.url} target="_blank" rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#1D3A8A] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors"
                    >
                      <Video className="w-4 h-4" /> Unirse a Zoom
                    </a>
                  ) : (
                    <button disabled className="w-full flex items-center justify-center gap-2 bg-slate-200 text-slate-400 py-2.5 rounded-xl text-sm font-semibold">
                      <Video className="w-4 h-4" /> Sin link de Zoom
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
