import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export function CalendarWidget() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#1D3A8A] text-white p-4 flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
          Mis Clases
        </h3>
        <CalendarIcon className="w-5 h-5 opacity-80" />
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Month Selector */}
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-slate-800">Abril 2026</span>
          <div className="flex gap-2 text-slate-400">
            <button className="hover:text-slate-800 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <button className="hover:text-slate-800 transition-colors"><ChevronRight className="w-5 h-5" /></button>
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

        {/* Calendar Grid (Simplified for demo) */}
        <div className="grid grid-cols-7 gap-y-4 gap-x-1 text-center text-sm font-semibold text-slate-700 mb-6">
          {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28].map((day) => {
            const isHighlighted = day === 12 || day === 20;
            return (
              <div key={day} className="flex justify-center">
                <span className={`w-8 h-8 flex items-center justify-center rounded-full ${isHighlighted ? 'bg-[#EF4444] text-white shadow-md shadow-red-500/30' : 'hover:bg-slate-100 cursor-pointer transition-colors'}`}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Upcoming Class Card */}
        <div className="mt-auto bg-slate-50 border border-slate-100 rounded-2xl p-4">
          <p className="text-[10px] font-bold text-[#EF4444] uppercase tracking-wider mb-1">Zoom en vivo</p>
          <div className="flex justify-between items-end">
            <div>
              <p className="font-bold text-sm text-slate-800">Lunes 22 Abr. · Clase de<br/>conversación</p>
            </div>
            <button className="bg-[#1D3A8A] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-blue-800 transition-colors">
              Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
