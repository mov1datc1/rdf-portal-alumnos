import { useState, useEffect } from 'react';
import { Upload, Link as LinkIcon, Check, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function ResourcesManager() {
  const session = useAuthStore(state => state.session);
  const [formData, setFormData] = useState({ title: '', url: '', type: 'RECORDED_VIDEO', levelId: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [levels, setLevels] = useState<any[]>([]);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/levels`, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLevels(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, levelId: data[0].id }));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url || !formData.levelId) {
      alert('Por favor completa todos los campos (Título, URL, y Grupo)');
      return;
    }

    const selectedLevel = levels.find(l => l.id === formData.levelId);
    const moduleId = selectedLevel?.modules?.[0]?.id;

    if (!moduleId) {
      alert('El grupo seleccionado no tiene un módulo válido asignado.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/resources`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          url: formData.url,
          type: formData.type,
          moduleId: moduleId
        })
      });
      
      if (res.ok) {
        alert('¡Recurso creado exitosamente!');
        setFormData(prev => ({ ...prev, title: '', url: '' }));
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <button type="button" onClick={() => alert('Función de subida de archivos físicos en desarrollo. Usa los enlaces externos.')} className="w-full bg-[#1D3A8A] text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors">
              Subir
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-emerald-500" /> 
            Vincular Link Externo (Zoom/Drive)
          </h2>
          <form onSubmit={handleCreateResource} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Título</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20" placeholder="Ej. Clase 1 en Vivo" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Grupo Asignado</label>
              <select value={formData.levelId} onChange={e => setFormData({...formData, levelId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20">
                {levels.length === 0 && <option value="">Cargando grupos...</option>}
                {levels.map(level => (
                  <option key={level.id} value={level.id}>{level.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tipo de Recurso</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20">
                <option value="LIVE_CLASS">Clase en Vivo (Zoom)</option>
                <option value="RECORDED_VIDEO">Video Externo (YouTube)</option>
                <option value="PDF">Documento PDF</option>
                <option value="HOMEWORK">Tareas (Word/Doc)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">URL del Link</label>
              <input type="url" required value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20" placeholder="https://" />
            </div>
            <button disabled={isSubmitting} type="submit" className="w-full bg-white border border-slate-300 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors flex justify-center items-center gap-2">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
              Guardar Enlace
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
