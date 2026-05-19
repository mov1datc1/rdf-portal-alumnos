import { CheckCircle2, Circle } from 'lucide-react';

export function Progreso() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-[#1D3A8A] to-blue-800 rounded-3xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Progreso Académico</h1>
        <p className="text-blue-200 text-sm max-w-2xl">
          Visualiza tu avance detallado por módulo y nivel.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1D3A8A]">Nivel B1 · Intermedio</h2>
            <p className="text-sm text-slate-500 mt-1">Estás a un paso de dominar el nivel.</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-extrabold text-[#EF4444]">60%</span>
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-3 mb-10">
          <div className="bg-yellow-400 h-3 rounded-full relative" style={{ width: '60%' }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-yellow-400 rounded-full shadow-md"></div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-bold text-slate-800 text-lg">Módulos del Nivel</h3>
          
          {[
            { title: 'Módulo 1: Presentaciones complejas', completed: true },
            { title: 'Módulo 2: Tiempos verbales compuestos', completed: true },
            { title: 'Módulo 3: Vocabulario profesional', completed: false },
            { title: 'Módulo 4: Comprensión auditiva avanzada', completed: false },
          ].map((mod, i) => (
            <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border ${mod.completed ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-200'}`}>
              {mod.completed ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              ) : (
                <Circle className="w-6 h-6 text-slate-300" />
              )}
              <span className={`font-semibold ${mod.completed ? 'text-emerald-900' : 'text-slate-600'}`}>
                {mod.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
