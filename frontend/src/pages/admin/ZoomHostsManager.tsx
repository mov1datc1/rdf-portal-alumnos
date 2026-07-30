import { useState, useEffect } from 'react';
import { Loader2, Plus, Edit2, Trash2, Check, X, Video, Wifi, WifiOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function ZoomHostsManager() {
  const [hosts, setHosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [testingId, setTestingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    accountId: '',
    clientId: '',
    clientSecret: '',
  });

  const session = useAuthStore(state => state.session);

  const fetchHosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/zoom/hosts`, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) setHosts(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchHosts();
  }, [session]);

  const resetForm = () => {
    setFormData({ email: '', displayName: '', accountId: '', clientId: '', clientSecret: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingId
        ? `${import.meta.env.VITE_API_URL}/admin/zoom/hosts/${editingId}`
        : `${import.meta.env.VITE_API_URL}/admin/zoom/hosts`;
      const method = editingId ? 'PATCH' : 'POST';

      const body: any = { ...formData };
      // On edit, don't send empty clientSecret (keep existing)
      if (editingId && !body.clientSecret) delete body.clientSecret;

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        resetForm();
        fetchHosts();
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
    if (!confirm('¿Eliminar este host de Zoom? Los meetings existentes no se cancelarán.')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/zoom/hosts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) fetchHosts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (host: any) => {
    setFormData({
      email: host.email,
      displayName: host.displayName,
      accountId: host.accountId || '',
      clientId: host.clientId || '',
      clientSecret: '', // Don't pre-fill secret
    });
    setEditingId(host.id);
  };

  const handleToggleActive = async (host: any) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/admin/zoom/hosts/${host.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !host.isActive }),
      });
      fetchHosts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleTest = async (id: string) => {
    setTestingId(id);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/zoom/hosts/${id}/test`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.ok) {
        const result = await res.json();
        setTestResults(prev => ({ ...prev, [id]: result }));
      }
    } catch (e) {
      setTestResults(prev => ({ ...prev, [id]: { success: false, message: 'Error de red' } }));
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Cuentas de Zoom</h1>
        <p className="text-slate-500 text-sm">Administra las cuentas Zoom Pro para crear reuniones automáticamente. Cada cuenta requiere credenciales Server-to-Server OAuth.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ── Formulario ── */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm lg:col-span-1 sticky top-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Video className="w-6 h-6 text-[#2D8CFF]" />
              {editingId ? 'Editar Host' : 'Agregar Cuenta Zoom'}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1">
                <X className="w-4 h-4" /> Cancelar
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre del Host</label>
              <input
                required
                type="text"
                placeholder="Ej. Zoom Cuenta 1 / Profesora Marie"
                value={formData.displayName}
                onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#2D8CFF]/20 bg-slate-50 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email de Zoom</label>
              <input
                required
                type="email"
                placeholder="profesor@lesroisdufrancais.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-[#2D8CFF]/20 bg-slate-50 text-sm"
              />
            </div>

            <div className="pt-2 border-t border-dashed border-slate-200">
              <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                🔑 Credenciales Server-to-Server OAuth
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Account ID</label>
                  <input
                    required={!editingId}
                    type="text"
                    placeholder="Account ID de Zoom"
                    value={formData.accountId}
                    onChange={e => setFormData({ ...formData, accountId: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg py-1.5 px-3 focus:ring-2 focus:ring-[#2D8CFF]/20 bg-slate-50 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Client ID</label>
                  <input
                    required={!editingId}
                    type="text"
                    placeholder="Client ID de Zoom"
                    value={formData.clientId}
                    onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg py-1.5 px-3 focus:ring-2 focus:ring-[#2D8CFF]/20 bg-slate-50 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Client Secret {editingId && <span className="text-slate-400 font-normal">(dejar vacío para mantener)</span>}
                  </label>
                  <input
                    required={!editingId}
                    type="password"
                    placeholder="Client Secret de Zoom"
                    value={formData.clientSecret}
                    onChange={e => setFormData({ ...formData, clientSecret: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg py-1.5 px-3 focus:ring-2 focus:ring-[#2D8CFF]/20 bg-slate-50 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-bold text-white bg-[#2D8CFF] hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />)}
              {editingId ? 'Guardar Cambios' : 'Agregar Cuenta'}
            </button>
          </form>
        </div>

        {/* ── Lista de Hosts ── */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Cuentas Registradas</h2>

          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[#2D8CFF]" /></div>
          ) : hosts.length === 0 ? (
            <div className="text-center py-12">
              <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No hay cuentas Zoom registradas.</p>
              <p className="text-slate-400 text-sm">Agrega tus cuentas Pro para crear reuniones automáticamente.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {hosts.map(host => (
                <div key={host.id} className={`border rounded-2xl p-5 transition-all ${host.isActive ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${host.isActive ? 'bg-[#2D8CFF]/10' : 'bg-slate-200'}`}>
                        <Video className={`w-5 h-5 ${host.isActive ? 'text-[#2D8CFF]' : 'text-slate-400'}`} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{host.displayName}</p>
                        <p className="text-xs text-slate-500">{host.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Meeting count badge */}
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                        {host._count?.meetings || 0} clases
                      </span>

                      {/* Test result */}
                      {testResults[host.id] && (
                        <span className={`text-xs px-2 py-1 rounded-lg ${testResults[host.id].success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                          {testResults[host.id].success ? '✓ Conectado' : '✗ Error'}
                        </span>
                      )}

                      {/* Test button */}
                      <button
                        onClick={() => handleTest(host.id)}
                        disabled={testingId === host.id}
                        className="p-2 text-[#2D8CFF] hover:bg-blue-50 rounded-lg transition-colors"
                        title="Probar conexión"
                      >
                        {testingId === host.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
                      </button>

                      {/* Toggle active */}
                      <button
                        onClick={() => handleToggleActive(host)}
                        className={`p-2 rounded-lg transition-colors ${host.isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`}
                        title={host.isActive ? 'Desactivar' : 'Activar'}
                      >
                        {host.isActive ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleEdit(host)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(host.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
