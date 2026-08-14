import { useState, useEffect } from 'react';
import { UserPlus, Loader2, X, Check, Power, PowerOff, KeyRound, Filter } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const ROLES = [
  { value: 'STUDENT', label: 'Alumno', icon: '🎓', color: 'bg-blue-50 text-blue-700' },
  { value: 'TEACHER', label: 'Profesor', icon: '👩‍🏫', color: 'bg-purple-50 text-purple-700' },
  { value: 'ADMIN', label: 'Administrador', icon: '⚙️', color: 'bg-amber-50 text-amber-700' },
];

export function UsersManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'error' | 'success' } | null>(null);

  const showToast = (message: string, type: 'error' | 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'STUDENT',
    currentLevelId: ''
  });

  const [levels, setLevels] = useState<any[]>([]);

  const session = useAuthStore(state => state.session);

  const fetchUsersAndLevels = async () => {
    setLoading(true);
    try {
      const [usersRes, levelsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/admin/users`, { headers: { 'Authorization': `Bearer ${session?.access_token}` } }),
        fetch(`${import.meta.env.VITE_API_URL}/admin/levels`, { headers: { 'Authorization': `Bearer ${session?.access_token}` } })
      ]);
      
      if (usersRes.ok) setUsers(await usersRes.json());
      if (levelsRes.ok) setLevels(await levelsRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchUsersAndLevels();
  }, [session]);

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`, {
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

  const handleAssignLevel = async (userId: string, levelId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentLevelId: levelId || null })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, currentLevelId: levelId || null } : u));
      }
    } catch (e) {
      console.error('Error assigning level', e);
    }
  };

  const handleResetPassword = async (userId: string, email: string) => {
    const newPassword = prompt(`Nueva contraseña para ${email}:`, 'LesRois2026!');
    if (!newPassword) return;
    
    setResettingId(userId);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
      });
      if (res.ok) {
        showToast(`Contraseña actualizada para ${email}`, 'success');
      } else {
        const err = await res.json();
        showToast(`Error: ${err.message}`, 'error');
      }
    } catch (e) {
      console.error('Error resetting password', e);
      showToast('Error de conexión', 'error');
    } finally {
      setResettingId(null);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          currentLevelId: formData.role === 'STUDENT' ? formData.currentLevelId : undefined,
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'STUDENT', currentLevelId: '' });
        fetchUsersAndLevels();
        showToast('Usuario creado exitosamente', 'success');
      } else {
        const error = await res.json();
        if (error.message && (error.message.includes('already') || error.message.includes('existe'))) {
          showToast(`El correo ${formData.email} ya está registrado en el sistema.`, 'error');
        } else {
          showToast(`Error al crear usuario: ${error.message}`, 'error');
        }
      }
    } catch (e) {
      console.error('Error creating user', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = roleFilter === 'ALL' ? users : users.filter(u => u.role === roleFilter);

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-6 right-6 p-4 rounded-xl shadow-2xl border text-sm font-semibold flex items-center gap-3 z-[60] animate-in slide-in-from-top-5 duration-300 ${
          toast.type === 'error' ? 'bg-[#b91c1c] text-white border-red-800' : 'bg-[#1D3A8A] text-white border-blue-900'
        }`}>
          {toast.type === 'error' ? <X className="w-5 h-5 opacity-90" /> : <Check className="w-5 h-5 opacity-90" />}
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-2 p-1 hover:bg-white/20 rounded-md transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Gestión de Usuarios</h1>
          <p className="text-slate-500 text-sm">Agrega alumnos, profesores o administradores. Resetea contraseñas.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1D3A8A] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold hover:bg-blue-800 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo Usuario
        </button>
      </div>

      {/* Role Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        <div className="flex gap-1">
          <button onClick={() => setRoleFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${roleFilter === 'ALL' ? 'bg-[#1D3A8A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            Todos ({users.length})
          </button>
          {ROLES.map(r => {
            const count = users.filter(u => u.role === r.value).length;
            return (
              <button key={r.value} onClick={() => setRoleFilter(r.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${roleFilter === r.value ? 'bg-[#1D3A8A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {r.icon} {r.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-gray-100">
            <tr>
              <th className="p-4">Nombre / Correo</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Grupo</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#1D3A8A]"/></td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No hay usuarios {roleFilter !== 'ALL' ? `con rol ${ROLES.find(r => r.value === roleFilter)?.label}` : 'registrados'}.</td>
              </tr>
            ) : (
              filteredUsers.map(u => {
                const roleInfo = ROLES.find(r => r.value === u.role);
                return (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                      {u.phone && <p className="text-xs text-slate-400">{u.phone}</p>}
                    </td>
                    <td className="p-4">
                      <span className={`${roleInfo?.color || 'bg-slate-100 text-slate-600'} px-2 py-1 rounded text-xs font-bold`}>
                        {roleInfo?.icon} {roleInfo?.label || u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.role === 'STUDENT' ? (
                        <select 
                          value={u.currentLevelId || ''} 
                          onChange={(e) => handleAssignLevel(u.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-sm rounded-lg p-1.5 focus:ring-2 focus:ring-[#1D3A8A]/20"
                        >
                          <option value="">Sin Asignar</option>
                          {levels.map(l => (
                            <option key={l.id} value={l.id}>{l.name}{l.levelCode ? ` (${l.levelCode})` : ''}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      {u.isActive ? 
                        <span className="text-emerald-600 flex items-center gap-1 text-xs font-bold"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Activo</span> :
                        <span className="text-slate-500 flex items-center gap-1 text-xs font-bold"><span className="w-2 h-2 rounded-full bg-slate-300" /> Inactivo</span>
                      }
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        {/* Reset password */}
                        <button 
                          onClick={() => handleResetPassword(u.id, u.email)}
                          disabled={resettingId === u.id}
                          title="Resetear contraseña"
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          {resettingId === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                        </button>
                        {/* Toggle active */}
                        <button 
                          onClick={() => handleToggleStatus(u.id, u.isActive)}
                          title={u.isActive ? "Desactivar usuario" : "Activar usuario"}
                          className={`p-2 transition-colors rounded-lg ${u.isActive ? 'text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                        >
                          {u.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Nuevo Usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#1D3A8A]" />
                Crear Nuevo Usuario
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {/* Role selector */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo de Usuario</label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map(r => (
                    <button key={r.value} type="button" onClick={() => setFormData({...formData, role: r.value})}
                      className={`py-2 px-1 rounded-xl text-center transition-all text-sm border-2 ${
                        formData.role === r.value
                          ? 'border-[#1D3A8A] bg-[#1D3A8A]/5 text-[#1D3A8A] font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                      }`}>
                      <span className="text-lg">{r.icon}</span>
                      <p className="text-xs font-semibold">{r.label}</p>
                    </button>
                  ))}
                </div>
              </div>

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
                <p className="text-xs text-slate-500 mt-1">Mínimo 6 caracteres. El usuario puede cambiarla después.</p>
              </div>

              {/* Group assignment - only for STUDENT */}
              {formData.role === 'STUDENT' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Asignar Grupo (Opcional)</label>
                  <select value={formData.currentLevelId} onChange={e => setFormData({...formData, currentLevelId: e.target.value})} className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50">
                    <option value="">Sin Asignar</option>
                    {levels.map(l => (
                      <option key={l.id} value={l.id}>{l.name}{l.levelCode ? ` (${l.levelCode})` : ''}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                  Cancelar
                </button>
                <button disabled={isSubmitting} type="submit" className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-[#1D3A8A] hover:bg-blue-800 transition-colors flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Crear {ROLES.find(r => r.value === formData.role)?.label}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
