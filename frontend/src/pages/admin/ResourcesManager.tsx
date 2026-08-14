import { useState, useEffect } from 'react';
import { Link as LinkIcon, Check, Loader2, ArrowLeft, Video, FileText, ClipboardList, Trash2, Edit2, X, History, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { showSuccess, showError } from '../../utils/alerts';

type Category = 'Videos' | "PDF's" | 'Tareas' | null;

export function ResourcesManager() {
  const session = useAuthStore(state => state.session);
  const [selectedCategory, setSelectedCategory] = useState<Category>(null);
  
  const [formData, setFormData] = useState<{ title: string, url: string, levelIds: string[] }>({ title: '', url: '', levelIds: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [levels, setLevels] = useState<any[]>([]);
  
  const [resources, setResources] = useState<any[]>([]);
  const [editResource, setEditResource] = useState<any | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // New states for batch delete and custom confirmation
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean, resourceId: string | null }>({ show: false, resourceId: null });

  useEffect(() => {
    fetchLevels();
    fetchResources();
  }, []);

  const fetchLevels = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/levels`, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLevels(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/resources`, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) setResources(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url || formData.levelIds.length === 0) {
      showError('Faltan campos', 'Por favor completa Título, URL, y selecciona al menos un Grupo');
      return;
    }

    const moduleIds = formData.levelIds.map(levelId => {
      const lvl = levels.find(l => l.id === levelId);
      return lvl?.modules?.[0]?.id;
    }).filter(Boolean);

    if (moduleIds.length === 0) {
      showError('Error de grupo', 'Ninguno de los grupos seleccionados tiene módulos válidos.');
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
          moduleIds: moduleIds
        })
      });
      
      if (res.ok) {
        showSuccess('¡Recurso creado exitosamente!');
        setFormData({ title: '', url: '', levelIds: [] });
        fetchResources();
      } else {
        const error = await res.json();
        showError('Error al crear', error.message);
      }
    } catch (error) {
      console.error(error);
      showError('Error de conexión', 'Ocurrió un error al contactar el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeDelete = async () => {
    try {
      if (deleteConfirm.resourceId) {
        // Single delete
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/resources/${deleteConfirm.resourceId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        });
        if (res.ok) {
          showSuccess('Recurso eliminado');
          setSelectedResources(prev => prev.filter(id => id !== deleteConfirm.resourceId));
          fetchResources();
        }
      } else if (selectedResources.length > 0) {
        // Batch delete
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/resources/batch-delete`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ids: selectedResources })
        });
        if (res.ok) {
          showSuccess('Recursos eliminados');
          setSelectedResources([]);
          fetchResources();
        }
      }
    } catch (error) {
      showError('Error', 'No se pudo eliminar');
    } finally {
      setDeleteConfirm({ show: false, resourceId: null });
    }
  };

  const handleUpdateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editResource) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/resources/${editResource.id}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editResource.title,
          url: editResource.url
        })
      });
      if (res.ok) {
        showSuccess('Recurso actualizado');
        setEditResource(null);
        fetchResources();
      }
    } catch (error) {
      showError('Error', 'No se pudo actualizar el recurso');
    }
  };

  const categories = [
    { id: 'Videos', title: 'Videos de Clase', icon: Video, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', hoverBorder: 'hover:border-blue-400', desc: 'Sube enlaces de YouTube/Vimeo' },
    { id: "PDF's", title: 'Materiales PDF', icon: FileText, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', hoverBorder: 'hover:border-red-400', desc: 'Vincular PDFs de Google Drive' },
    { id: 'Tareas', title: 'Tareas y Asignaciones', icon: ClipboardList, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', hoverBorder: 'hover:border-emerald-400', desc: 'Vincular Docs para rellenar' }
  ];

  const getFilteredResources = () => {
    let type = 'RECORDED_VIDEO';
    if (selectedCategory === "PDF's") type = 'PDF';
    if (selectedCategory === 'Tareas') type = 'HOMEWORK';
    return resources.filter(r => r.type === type);
  };

  const currentResources = getFilteredResources();
  const isAllSelected = currentResources.length > 0 && selectedResources.length === currentResources.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedResources([]);
    } else {
      setSelectedResources(currentResources.map(r => r.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedResources.includes(id)) {
      setSelectedResources(prev => prev.filter(rId => rId !== id));
    } else {
      setSelectedResources(prev => [...prev, id]);
    }
  };

  return (
    <div className="space-y-6 relative">
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
                  onClick={() => {
                    setSelectedCategory(cat.id as Category);
                    setSelectedResources([]); // Reset selection when changing category
                  }}
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
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    {selectedCategory === 'Videos' && <Video className="w-6 h-6 text-blue-500" />}
                    {selectedCategory === "PDF's" && <FileText className="w-6 h-6 text-red-500" />}
                    {selectedCategory === 'Tareas' && <ClipboardList className="w-6 h-6 text-emerald-500" />}
                    Subir {categories.find(c => c.id === selectedCategory)?.title}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Completa los datos para publicar el recurso en uno o más grupos.</p>
                </div>
                <button 
                  onClick={() => setShowHistory(true)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm transition-colors"
                >
                  <History className="w-4 h-4" />
                  Ver Historial
                </button>
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
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-slate-700">Selecciona los Grupos Destino</label>
                  <button type="button" onClick={() => {
                    if (formData.levelIds.length === levels.length) setFormData({...formData, levelIds: []});
                    else setFormData({...formData, levelIds: levels.map(l => l.id)});
                  }} className="text-xs text-[#1D3A8A] font-bold hover:underline">
                    {formData.levelIds.length === levels.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {levels.map(level => (
                    <label key={level.id} className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${formData.levelIds.includes(level.id) ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                      <input 
                        type="checkbox" 
                        checked={formData.levelIds.includes(level.id)}
                        onChange={(e) => {
                          if (e.target.checked) setFormData({...formData, levelIds: [...formData.levelIds, level.id]});
                          else setFormData({...formData, levelIds: formData.levelIds.filter(id => id !== level.id)});
                        }}
                        className="w-4 h-4 text-[#1D3A8A] rounded focus:ring-[#1D3A8A]"
                      />
                      <span className="text-sm font-semibold text-slate-700">{level.name}</span>
                    </label>
                  ))}
                </div>
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
                  {selectedCategory === 'Videos' && "Pega el enlace de YouTube o Vimeo."}
                  {selectedCategory === "PDF's" && "Pega el enlace público de Google Drive para visualizar o descargar el PDF."}
                  {selectedCategory === 'Tareas' && "Pega el enlace público del documento en Word para que el alumno lo complete."}
                </p>
              </div>

              <button 
                disabled={isSubmitting} 
                type="submit" 
                className="w-full bg-[#1D3A8A] text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-colors flex justify-center items-center gap-2 mt-8"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                Publicar Recurso en {formData.levelIds.length} {formData.levelIds.length === 1 ? 'Grupo' : 'Grupos'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── Modal: Historial de Recursos ── */}
      {showHistory && selectedCategory && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowHistory(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                  <History className="w-6 h-6 text-slate-500" /> Historial de {selectedCategory}
                </h2>
                <p className="text-slate-500 text-sm mt-1">Administra los recursos previamente publicados</p>
              </div>
              <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400 hover:text-slate-600" /></button>
            </div>
            
            {/* Batch Actions Bar */}
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-t-2xl border border-b-0 border-slate-200">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-[#1D3A8A] rounded focus:ring-[#1D3A8A] ml-2"
                />
                <span className="text-sm font-semibold text-slate-700">Seleccionar Todos</span>
              </div>
              {selectedResources.length > 0 && (
                <button 
                  onClick={() => setDeleteConfirm({ show: true, resourceId: null })}
                  className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-xl font-bold text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar ({selectedResources.length})
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-b-2xl bg-white relative">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0 border-b border-slate-200 shadow-sm z-10">
                  <tr>
                    <th className="p-4 w-12"></th>
                    <th className="p-4">Título</th>
                    <th className="p-4">Grupo Destino</th>
                    <th className="p-4">Fecha</th>
                    <th className="p-4 text-right pr-6">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentResources.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-400">No hay {selectedCategory.toLowerCase()} publicados aún.</td>
                    </tr>
                  ) : currentResources.map(res => (
                    <tr key={res.id} className={`hover:bg-slate-50 transition-colors ${selectedResources.includes(res.id) ? 'bg-blue-50/50' : ''}`}>
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox"
                          checked={selectedResources.includes(res.id)}
                          onChange={() => toggleSelect(res.id)}
                          className="w-4 h-4 text-[#1D3A8A] rounded focus:ring-[#1D3A8A]"
                        />
                      </td>
                      <td className="p-4 font-semibold text-slate-700">
                        <a href={res.url} target="_blank" rel="noreferrer" className="hover:text-[#1D3A8A] hover:underline flex items-center gap-2">
                          {res.title}
                          <LinkIcon className="w-3 h-3 text-slate-400" />
                        </a>
                      </td>
                      <td className="p-4 font-semibold text-slate-600">{res.module?.level?.name || 'Global'}</td>
                      <td className="p-4 text-slate-500 text-xs">{new Date(res.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right pr-4">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => setEditResource(res)} className="p-2 text-amber-500 hover:bg-amber-50 hover:scale-110 transition-all rounded-lg" title="Editar">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteConfirm({ show: true, resourceId: res.id })} className="p-2 text-red-400 hover:bg-red-50 hover:scale-110 transition-all rounded-lg" title="Eliminar">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Custom de Confirmación de Eliminación ── */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">¿Estás seguro?</h3>
            <p className="text-slate-500 text-sm mb-8">
              {deleteConfirm.resourceId 
                ? "Este recurso se eliminará permanentemente y los alumnos ya no podrán verlo." 
                : `Estás a punto de eliminar ${selectedResources.length} recursos permanentemente.`}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirm({ show: false, resourceId: null })}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={executeDelete}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Editar Recurso ── */}
      {editResource && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-in fade-in zoom-in duration-200" onClick={() => setEditResource(null)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Editar Recurso</h2>
              <button onClick={() => setEditResource(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleUpdateResource} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Título</label>
                <input 
                  type="text" required value={editResource.title} 
                  onChange={e => setEditResource({...editResource, title: e.target.value})} 
                  className="w-full border border-slate-200 bg-slate-50 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#1D3A8A]/20" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Enlace / URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LinkIcon className="w-5 h-5 text-slate-400" />
                  </div>
                  <input 
                    type="url" required value={editResource.url} 
                    onChange={e => setEditResource({...editResource, url: e.target.value})} 
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#1D3A8A]/20" 
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#1D3A8A] text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-colors flex justify-center items-center gap-2 mt-4">
                <Check className="w-5 h-5" /> Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
