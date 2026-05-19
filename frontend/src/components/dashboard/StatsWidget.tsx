import { TrendingUp } from 'lucide-react';

export function StatsWidget() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#1D3A8A] text-white p-4 flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
          Estadísticas Académicas
        </h3>
        <TrendingUp className="w-5 h-5 opacity-80" />
      </div>

      <div className="p-6 flex-1 flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col border-r border-gray-100 pr-4">
            <p className="text-xs text-slate-500 mb-2 h-8">Horas de estudio</p>
            <p className="text-3xl font-bold text-[#1D3A8A] mb-2">24 h</p>
            <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">↑ +18% este mes</p>
          </div>
          <div className="flex flex-col border-r border-gray-100 px-4">
            <p className="text-xs text-slate-500 mb-2 h-8">Videos completados</p>
            <p className="text-3xl font-bold text-[#1D3A8A] mb-2">16</p>
            <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">↑ +5 nuevos</p>
          </div>
          <div className="flex flex-col border-r border-gray-100 px-4">
            <p className="text-xs text-slate-500 mb-2 h-8">Material PDF revisado</p>
            <p className="text-3xl font-bold text-[#1D3A8A] mb-2">72%</p>
            <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">↑ constancia saludable</p>
          </div>
          <div className="flex flex-col pl-4">
            <p className="text-xs text-slate-500 mb-2 h-8">Score general</p>
            <p className="text-3xl font-bold text-[#1D3A8A] mb-2">88%</p>
            <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">↑ desempeño sólido</p>
          </div>
        </div>

        {/* Lower section with charts (Placeholder) */}
        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-4">Horas de estudio por semana</h4>
            <div className="h-24 flex items-end justify-between gap-2">
              <div className="w-1/5 bg-blue-200 rounded-t-md h-1/3"></div>
              <div className="w-1/5 bg-blue-300 rounded-t-md h-1/2"></div>
              <div className="w-1/5 bg-blue-400 rounded-t-md h-3/4"></div>
              <div className="w-1/5 bg-[#1D3A8A] rounded-t-md h-full relative">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-[#1D3A8A]">8h</span>
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-semibold">
              <span>S1</span><span>S2</span><span>S3</span><span>S4</span>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center">
            <h4 className="text-xs font-bold text-slate-800 mb-4 w-full text-left">Progreso del nivel actual</h4>
            <div className="relative w-24 h-24">
              {/* Fake Donut Chart */}
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                <path className="text-yellow-400" strokeDasharray="60, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-[#1D3A8A]">60%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
