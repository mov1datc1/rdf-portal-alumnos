import { Upload, Link as LinkIcon } from 'lucide-react';

export function ResourcesManager() {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Recursos y Clases</h1>
        <p className="text-slate-500 text-sm">Publica material de estudio o agenda sesiones en Zoom.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#EF4444]" /> 
            Subir Archivo (PDF/Video)
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Título</label>
              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20" placeholder="Ej. Guía B1" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Archivo</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-600">Arrastra tu archivo aquí</p>
                <p className="text-xs text-slate-400 mt-1">PDF o MP4 (Máx 50MB)</p>
              </div>
            </div>
            <button type="button" className="w-full bg-[#1D3A8A] text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors">
              Subir a Supabase Storage
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-emerald-500" /> 
            Vincular Link Externo (Zoom/Drive)
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tipo de Recurso</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20">
                <option>Clase en Vivo (Zoom)</option>
                <option>Video Externo (YouTube)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">URL del Link</label>
              <input type="url" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20" placeholder="https://" />
            </div>
            <button type="button" className="w-full bg-white border border-slate-300 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors">
              Guardar Enlace
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
