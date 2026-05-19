import { StatsWidget } from '../components/dashboard/StatsWidget';

export function Estadisticas() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 h-[calc(100vh-4rem)] flex flex-col">
      <div className="bg-[#1D3A8A] rounded-3xl p-8 text-white flex-shrink-0">
        <h1 className="text-3xl font-bold mb-2">Análisis de Rendimiento</h1>
        <p className="text-blue-200 text-sm max-w-2xl">
          Tus métricas detalladas de estudio y participación en la plataforma.
        </p>
      </div>

      <div className="flex-1">
        <StatsWidget />
      </div>
    </div>
  );
}
