import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function CalendarWidget({ clases = [] }: { clases?: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  // Adjust so Monday is 0
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // Find next class
  const nextClass = clases.find(c => new Date(c.scheduledAt) >= new Date());

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#1D3A8A] text-white p-4 flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
          Calendario
        </h3>
        <CalendarIcon className="w-5 h-5 opacity-80" />
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Month Selector */}
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-slate-800 capitalize">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <div className="flex gap-2 text-slate-400">
            <button onClick={prevMonth} className="hover:text-slate-800 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={nextMonth} className="hover:text-slate-800 transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2 text-center">
          {['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'].map((day) => (
            <div key={day} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-4 gap-x-1 text-center text-sm font-semibold text-slate-700 mb-6">
          {Array(startDay).fill(null).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {daysArray.map((day) => {
            const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
            const hasClass = clases.some(c => new Date(c.scheduledAt).toDateString() === dateStr);
            
            return (
              <div key={day} className="flex justify-center">
                <span className={`w-8 h-8 flex items-center justify-center rounded-full ${hasClass ? 'bg-[#EF4444] text-white shadow-md shadow-red-500/30' : 'hover:bg-slate-100 cursor-pointer transition-colors'}`}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Upcoming Class Card */}
        {nextClass ? (
          <div className="mt-auto bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-[#EF4444] uppercase tracking-wider mb-1">Próxima Clase</p>
            <div className="flex justify-between items-end">
              <div className="truncate pr-4">
                <p className="font-bold text-sm text-slate-800 truncate" title={nextClass.title}>
                  {new Date(nextClass.scheduledAt).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })} · {nextClass.title}
                </p>
              </div>
              <a 
                href={nextClass.url}
                target="_blank"
                rel="noreferrer"
                className="bg-[#1D3A8A] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-blue-800 transition-colors shrink-0"
              >
                Entrar
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-auto bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
            <p className="text-sm font-bold text-slate-500">No hay clases próximas</p>
          </div>
        )}
      </div>
    </div>
  );
}
