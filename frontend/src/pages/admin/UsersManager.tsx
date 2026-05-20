import { useState, useEffect } from 'react';
import { UserPlus, MoreVertical, Loader2, X, Check, Power, PowerOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function UsersManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const session = useAuthStore(state => state.session);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/admin/users', {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchUsers();
  }, [session]);

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`http://localhost:3000/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u));
      }
    } catch (e) {
      console.error('Error toggling status', e);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:3000/admin/users', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ firstName: '', lastName: '', email: '', password: '' });
        fetchUsers();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (e) {
      console.error('Error creating user', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Gestión de Alumnos</h1>
          <p className="text-slate-500 text-sm">Agrega, edita o desactiva accesos al portal.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1D3A8A] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold hover:bg-blue-800 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo Alumno
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-gray-100">
            <tr>
              <th className="p-4">Nombre / Correo</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#1D3A8A]"/></td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">No hay usuarios registrados.</td>
              </tr>
            ) : (
              users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{u.firstName} {u.lastName}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </td>
                  <td className="p-4"><span className="bg-blue-50 text-[#1D3A8A] px-2 py-1 rounded text-xs font-bold">{u.role}</span></td>
                  <td className="p-4">
                    {u.isActive ? 
                      <span className="text-emerald-600 flex items-center gap-1 text-xs font-bold"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Activo</span> :
                      <span className="text-slate-500 flex items-center gap-1 text-xs font-bold"><span className="w-2 h-2 rounded-full bg-slate-300" /> Inactivo</span>
                    }
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleToggleStatus(u.id, u.isActive)}
                      title={u.isActive ? "Desactivar usuario" : "Activar usuario"}
                      className={`p-2 transition-colors rounded-lg ${u.isActive ? 'text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                    >
                      {u.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Nuevo Alumno */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#1D3A8A]" />
                Crear Nuevo Alumno
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre</label>
                  <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Apellido</label>
                  <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña Temporal</label>
                <input required type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Ej. LesRois2026!" className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50" />
                <p className="text-xs text-slate-500 mt-1">Mínimo 6 caracteres.</p>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                  Cancelar
                </button>
                <button disabled={isSubmitting} type="submit" className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-[#1D3A8A] hover:bg-blue-800 transition-colors flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Crear Cuenta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
