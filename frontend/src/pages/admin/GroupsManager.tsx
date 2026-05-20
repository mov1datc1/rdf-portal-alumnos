import { useState, useEffect } from 'react';
import { Loader2, Plus, Edit2, Trash2, Check, X, Layers } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function GroupsManager() {
  const [levels, setLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState('');
  
  const session = useAuthStore(state => state.session);

  const fetchLevels = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/levels`, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) setLevels(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchLevels();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    setIsSubmitting(true);

    try {
      const url = editingId 
        ? `${import.meta.env.VITE_API_URL}/admin/levels/${editingId}`
        : `${import.meta.env.VITE_API_URL}/admin/levels`;
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: groupName.trim() })
      });

      if (res.ok) {
        setGroupName('');
        setEditingId(null);
        fetchLevels();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este grupo? Esto eliminará también los módulos, clases y progresos asociados a este grupo.')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/levels/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) {
        fetchLevels();
      } else {
        alert('Hubo un error al eliminar el grupo.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (level: any) => {
    setGroupName(level.name);
    setEditingId(level.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setGroupName('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Gestión de Grupos</h1>
        <p className="text-slate-500 text-sm">Crea o edita los grupos (niveles) como A1, B1, etc. Al crear un grupo, se le asignará automáticamente un módulo por defecto para que puedas programar clases de inmediato.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm lg:col-span-1 sticky top-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#1D3A8A]" />
              {editingId ? 'Editar Grupo' : 'Nuevo Grupo'}
            </h2>
            {editingId && (
              <button onClick={cancelEdit} className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1">
                <X className="w-4 h-4" /> Cancelar
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre del Grupo</label>
              <input 
                required 
                type="text" 
                placeholder="Ej. B1 · Intermedio"
                value={groupName} 
                onChange={e => setGroupName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || !groupName.trim()}
              className="w-full py-3 rounded-xl font-bold text-white bg-[#1D3A8A] hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />)}
              {editingId ? 'Guardar Cambios' : 'Crear Grupo'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
            Grupos Existentes
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="p-4">Nombre del Grupo</th>
                  <th className="p-4 text-center">ID Interno</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#1D3A8A]"/></td>
                  </tr>
                ) : levels.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-500">No hay grupos creados todavía.</td>
                  </tr>
                ) : (
                  levels.map(level => (
                    <tr key={level.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-800">{level.name}</td>
                      <td className="p-4 text-xs text-slate-400 text-center font-mono">{level.id.split('-')[0]}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(level)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar grupo"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(level.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar grupo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
