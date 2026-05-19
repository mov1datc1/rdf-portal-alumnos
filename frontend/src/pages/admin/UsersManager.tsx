import { useState, useEffect } from 'react';
import { UserPlus, MoreVertical, Loader2 } from 'lucide-react';

export function UsersManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Todo: Fetch users from backend
  useEffect(() => {
    // mock fetch
    setUsers([
      { id: '1', email: 'andrea@example.com', firstName: 'Andrea', role: 'STUDENT', isActive: true },
      { id: '2', email: 'juan@example.com', firstName: 'Juan', role: 'STUDENT', isActive: false },
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Gestión de Alumnos</h1>
          <p className="text-slate-500 text-sm">Agrega, edita o desactiva accesos al portal.</p>
        </div>
        <button className="bg-[#1D3A8A] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold hover:bg-blue-800 transition-colors">
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
            ) : (
              users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{u.firstName}</p>
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
                    <button className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
