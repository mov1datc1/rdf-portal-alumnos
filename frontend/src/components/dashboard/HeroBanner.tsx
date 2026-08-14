import { useAuthStore } from '../../store/authStore';
import { Users, UserCircle } from 'lucide-react';

export function HeroBanner({ dashboardData }: { dashboardData?: any }) {
  const user = useAuthStore(state => state.user);
  const firstName = user?.user_metadata?.firstName || 'Alumno';

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1D3A8A] to-[#EF4444] text-white p-10 shadow-lg">
      <div className="absolute inset-0 bg-black/10" /> {/* Overlay */}
      <div className="relative z-10 flex justify-between items-center">
        <div className="max-w-xl">
          <p className="text-xs font-bold tracking-widest flex items-center gap-2 mb-4 text-blue-100">
            🇲🇽 MÉXICO - PORTAL ACADÉMICO PREMIUM
          </p>
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">
            Bonjour, {firstName} 👋<br />
            Tu aprendizaje del francés<br />
            ahora vive en un solo lugar.
          </h2>
          <p className="text-white/80 mb-8 leading-relaxed text-sm max-w-lg">
            Una experiencia diseñada para que cada alumno entre, encuentre su clase, consulte
            materiales en PDF, vea lecciones grabadas, hable con un asistente virtual y dé
            seguimiento real a su avance.
          </p>
          <div className="flex gap-6 mt-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 min-w-[200px] border border-white/10">
              <div className="bg-[#EF4444]/20 p-2.5 rounded-xl">
                <Users className="w-6 h-6 text-[#EF4444]" />
              </div>
              <div>
                <p className="text-xs text-white/60 font-medium uppercase tracking-wider">Tu Grupo</p>
                <p className="font-bold text-white text-lg">{dashboardData?.groupName || 'Cargando...'}</p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 min-w-[200px] border border-white/10">
              <div className="bg-blue-400/20 p-2.5 rounded-xl">
                <UserCircle className="w-6 h-6 text-blue-200" />
              </div>
              <div>
                <p className="text-xs text-white/60 font-medium uppercase tracking-wider">Profesor(a)</p>
                <p className="font-bold text-white text-lg">{dashboardData?.teacherName || 'Cargando...'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Glassmorphism Progress Card */}
        <div className="bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-[320px] shadow-2xl flex flex-col justify-center items-center h-[160px]">
          <h3 className="text-sm font-semibold text-white/80 mb-2 uppercase tracking-widest">Nivel actual</h3>
          <div>
            <p className="font-extrabold text-4xl text-white">{dashboardData?.levelCode || '...'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
