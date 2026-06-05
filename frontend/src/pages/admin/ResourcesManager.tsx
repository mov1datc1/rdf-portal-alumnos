import { useState, useEffect } from 'react';
import { Link as LinkIcon, Check, Loader2, ArrowLeft, Video, FileText, ClipboardList } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

type Category = 'Videos' | "PDF's" | 'Tareas' | null;

export function ResourcesManager() {
  const session = useAuthStore(state => state.session);
  const [selectedCategory, setSelectedCategory] = useState<Category>(null);
  const [formData, setFormData] = useState({ title: '', url: '', levelId: '' });
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

    let type = 'RECORDED_VIDEO';
    if (selectedCategory === "PDF's") type = 'PDF';
    if (selectedCategory === 'Tareas') type = 'HOMEWORK';

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
          type: type,
          moduleId: moduleId
        })
      });
      
      if (res.ok) {
        alert('¡Recurso creado exitosamente!');
        setFormData(prev => ({ ...prev, title: '', url: '' }));
        setSelectedCategory(null);
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

  const categories = [
    { id: 'Videos', title: 'Videos de Clase', icon: Video, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', hoverBorder: 'hover:border-blue-400', desc: 'Sube enlaces de YouTube/Vimeo' },
    { id: "PDF's", title: 'Materiales PDF', icon: FileText, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', hoverBorder: 'hover:border-red-400', desc: 'Vincular PDFs de Google Drive' },
    { id: 'Tareas', title: 'Tareas y Asignaciones', icon: ClipboardList, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', hoverBorder: 'hover:border-emerald-400', desc: 'Vincular Docs para rellenar' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Gestor de Recursos</h1>
        <p className="text-slate-500 text-sm">Publica material de estudio para los grupos.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        {!selectedCategory ? (
          <>
            <h2 className="text-xl font-bold text-slate-800 mb-6">¿Qué deseas subir?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as Category)}
                  className={`group flex flex-col items-center justify-center p-8 rounded-3xl border-2 ${cat.border} ${cat.hoverBorder} transition-all hover:shadow-xl bg-white text-center`}
                >
                  <div className={`w-16 h-16 ${cat.bg} ${cat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <cat.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#1D3A8A] transition-colors">{cat.title}</h3>
                  <p className="text-xs text-slate-500 mt-2">{cat.desc}</p>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
              <button 
                onClick={() => setSelectedCategory(null)}
                className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  {selectedCategory === 'Videos' && <Video className="w-6 h-6 text-blue-500" />}
                  {selectedCategory === "PDF's" && <FileText className="w-6 h-6 text-red-500" />}
                  {selectedCategory === 'Tareas' && <ClipboardList className="w-6 h-6 text-emerald-500" />}
                  Subir {categories.find(c => c.id === selectedCategory)?.title}
                </h2>
                <p className="text-sm text-slate-500 mt-1">Completa los datos para publicar el recurso.</p>
              </div>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Título del Recurso</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#1D3A8A]/20" 
                  placeholder={selectedCategory === 'Videos' ? "Ej. Clase de Verbos" : selectedCategory === "PDF's" ? "Ej. Guía Gramática" : "Ej. Tarea Unidad 1"} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Grupo Asignado</label>
                <select 
                  required
                  value={formData.levelId} 
                  onChange={e => setFormData({...formData, levelId: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#1D3A8A]/20"
                >
                  {levels.length === 0 && <option value="">Cargando grupos...</option>}
                  {levels.map(level => (
                    <option key={level.id} value={level.id}>{level.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">URL / Enlace Externo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LinkIcon className="w-5 h-5 text-slate-400" />
                  </div>
                  <input 
                    type="url" 
                    required 
                    value={formData.url} 
                    onChange={e => setFormData({...formData, url: e.target.value})} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#1D3A8A]/20" 
                    placeholder="https://" 
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {selectedCategory === 'Videos' && "Pega el enlace de YouTube o Vimeo. (Ej. https://youtube.com/watch?v=...)"}
                  {selectedCategory === "PDF's" && "Pega el enlace público de Google Drive para visualizar o descargar el PDF."}
                  {selectedCategory === 'Tareas' && "Pega el enlace público del documento en Word (Google Docs o Microsoft 365) para que el alumno lo complete."}
                </p>
              </div>

              <button 
                disabled={isSubmitting} 
                type="submit" 
                className="w-full bg-[#1D3A8A] text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-colors flex justify-center items-center gap-2 mt-8"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                Publicar Recurso
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
