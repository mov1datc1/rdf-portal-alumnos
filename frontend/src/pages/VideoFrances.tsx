import { PlayCircle, Clock } from 'lucide-react';

export function VideoFrances() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#1D3A8A] rounded-3xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Video Francés</h1>
        <p className="text-blue-200 text-sm max-w-2xl">
          Biblioteca completa de lecciones grabadas para repasar a tu ritmo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map((item) => (
          <div key={item} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="aspect-video bg-slate-800 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <img 
                src={`https://picsum.photos/seed/${item}/600/400`} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                alt="Thumbnail"
              />
              <PlayCircle className="w-12 h-12 text-white/80 z-20 group-hover:scale-110 group-hover:text-white transition-all" />
              <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded text-xs text-white font-bold z-20 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 45:00
              </div>
            </div>
            <div className="p-5">
              <p className="text-[10px] font-bold text-[#EF4444] uppercase tracking-wider mb-1">Módulo 1</p>
              <h3 className="font-bold text-slate-800 text-lg mb-2 leading-tight">Lección: Los pasados compuestos</h3>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${item * 15}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
