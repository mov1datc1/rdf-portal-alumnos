export function HeroBanner() {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1D3A8A] to-[#EF4444] text-white p-10 shadow-lg">
      <div className="absolute inset-0 bg-black/10" /> {/* Overlay */}
      <div className="relative z-10 flex justify-between items-center">
        <div className="max-w-xl">
          <p className="text-xs font-bold tracking-widest flex items-center gap-2 mb-4 text-blue-100">
            🇲🇽 MÉXICO - PORTAL ACADÉMICO PREMIUM
          </p>
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">
            Bonjour, Andrea 👋<br />
            Tu aprendizaje del francés<br />
            ahora vive en un solo lugar.
          </h2>
          <p className="text-white/80 mb-8 leading-relaxed text-sm max-w-lg">
            Una experiencia diseñada para que cada alumno entre, encuentre su clase, consulte
            materiales en PDF, vea lecciones grabadas, hable con un asistente virtual y dé
            seguimiento real a su avance.
          </p>
          <div className="flex gap-4">
            <button className="bg-[#EF4444] hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-full transition-colors shadow-lg shadow-red-500/30 text-sm">
              Ver alcance funcional
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold py-3 px-6 rounded-full transition-colors text-sm">
              Explorar visor PDF
            </button>
          </div>
        </div>

        {/* Glassmorphism Progress Card */}
        <div className="bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-[320px] shadow-2xl">
          <h3 className="text-sm font-semibold text-white/80 mb-1">Nivel actual</h3>
          <div className="flex justify-between items-end mb-3">
            <p className="font-bold text-lg">B1 · Intermedio</p>
            <p className="font-bold text-sm">60%</p>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mb-6">
            <div className="bg-yellow-400 h-2 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]" style={{ width: '60%' }} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/20 rounded-xl p-3 text-center">
              <p className="font-bold text-xl">12</p>
              <p className="text-[10px] text-white/70 uppercase tracking-wider mt-1">Lecciones</p>
            </div>
            <div className="bg-black/20 rounded-xl p-3 text-center">
              <p className="font-bold text-xl">8</p>
              <p className="text-[10px] text-white/70 uppercase tracking-wider mt-1">Tests</p>
            </div>
            <div className="bg-black/20 rounded-xl p-3 text-center">
              <p className="font-bold text-xl">24h</p>
              <p className="text-[10px] text-white/70 uppercase tracking-wider mt-1">Estudio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
