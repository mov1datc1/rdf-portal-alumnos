import { useState, useEffect } from 'react';
import { FileText, Download, Search, Video, ClipboardList, Play, ArrowLeft, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

type Category = 'Videos' | "PDF's" | 'Tareas' | null;

interface Resource {
  id: string;
  title: string;
  url: string;
  type: string;
  durationExpected: number;
}

export function Recursos() {
  const session = useAuthStore(state => state.session);
  const [selectedCategory, setSelectedCategory] = useState<Category>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/resources/my-resources`, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(res => {
    if (selectedCategory === 'Videos' && res.type !== 'RECORDED_VIDEO') return false;
    if (selectedCategory === "PDF's" && res.type !== 'PDF') return false;
    if (selectedCategory === 'Tareas' && res.type !== 'HOMEWORK' && res.type !== 'TEST') return false;
    
    if (searchTerm && !res.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    return true;
  });

  const categories = [
    { id: 'Videos', title: 'Videos de Clase', icon: Video, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', hoverBorder: 'hover:border-blue-400', shadow: 'shadow-blue-100/50' },
    { id: "PDF's", title: 'Materiales PDF', icon: FileText, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', hoverBorder: 'hover:border-red-400', shadow: 'shadow-red-100/50' },
    { id: 'Tareas', title: 'Tareas y Asignaciones', icon: ClipboardList, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', hoverBorder: 'hover:border-emerald-400', shadow: 'shadow-emerald-100/50' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#1D3A8A] rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Biblioteca de Recursos</h1>
          <p className="text-blue-200 text-sm max-w-2xl">
            Encuentra todos los videos, guías en PDF y tareas asignadas a tu grupo.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        {!selectedCategory ? (
          <>
            <h2 className="text-xl font-bold text-slate-800 mb-6">Categorías</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as Category)}
                  className={`group flex flex-col items-center justify-center p-8 rounded-3xl border-2 ${cat.border} ${cat.hoverBorder} transition-all hover:shadow-xl ${cat.shadow} bg-white`}
                >
                  <div className={`w-20 h-20 ${cat.bg} ${cat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <cat.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-[#1D3A8A] transition-colors">{cat.title}</h3>
                  <p className="text-sm text-slate-500 mt-2">
                    {resources.filter(r => 
                      (cat.id === 'Videos' && r.type === 'RECORDED_VIDEO') ||
                      (cat.id === "PDF's" && r.type === 'PDF') ||
                      (cat.id === 'Tareas' && (r.type === 'HOMEWORK' || r.type === 'TEST'))
                    ).length} recursos
                  </p>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800">
                  {categories.find(c => c.id === selectedCategory)?.title}
                </h2>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar recursos..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D3A8A] transition-all"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3A8A]"></div>
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">No hay recursos</h3>
                <p className="text-slate-500">Aún no se han publicado materiales en esta categoría.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map((item) => (
                  <div key={item.id} className="group border border-slate-200 rounded-2xl p-5 hover:border-blue-500 hover:shadow-md transition-all flex flex-col h-full">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4
                      ${item.type === 'RECORDED_VIDEO' ? 'bg-blue-50 text-blue-500' : 
                        item.type === 'PDF' ? 'bg-red-50 text-red-500' : 
                        'bg-emerald-50 text-emerald-500'}`}
                    >
                      {item.type === 'RECORDED_VIDEO' && <Play className="w-5 h-5" />}
                      {item.type === 'PDF' && <FileText className="w-5 h-5" />}
                      {(item.type === 'HOMEWORK' || item.type === 'TEST') && <ClipboardList className="w-5 h-5" />}
                    </div>
                    
                    <h3 className="font-bold text-slate-800 mb-2 group-hover:text-[#1D3A8A] transition-colors flex-1">{item.title}</h3>
                    
                    <a 
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#1D3A8A] bg-blue-50 w-full justify-center py-3 rounded-xl hover:bg-[#1D3A8A] hover:text-white transition-colors"
                    >
                      {item.type === 'RECORDED_VIDEO' && <><Play className="w-4 h-4" /> Ver Video</>}
                      {item.type === 'PDF' && <><Download className="w-4 h-4" /> Descargar PDF</>}
                      {(item.type === 'HOMEWORK' || item.type === 'TEST') && <><ExternalLink className="w-4 h-4" /> Abrir Tarea</>}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
