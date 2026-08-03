import { useState } from 'react';
import { KeyRound, Loader2, User, Mail, Shield, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function Perfil() {
  const session = useAuthStore(state => state.session);
  const user = useAuthStore(state => state.user);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    setIsChanging(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/profile/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (res.ok) {
        setMessage({ type: 'success', text: '✅ Contraseña actualizada exitosamente.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.message || 'Error al cambiar la contraseña.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexión. Intenta de nuevo.' });
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Mi Perfil</h1>
        <p className="text-slate-500 text-sm">Administra tu cuenta y contraseña.</p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-[#1D3A8A]" />
          Información de la Cuenta
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <User className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Nombre</p>
              <p className="font-semibold text-slate-800 text-sm">
                {user?.user_metadata?.firstName || 'Alumno'} {user?.user_metadata?.lastName || ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <Mail className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Correo electrónico</p>
              <p className="font-semibold text-slate-800 text-sm">{user?.email || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#1D3A8A]" />
          Cambiar Contraseña
        </h2>

        {message && (
          <div className={`mb-4 p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
          }`}>
            {message.type === 'error' && <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña Actual</label>
            <input
              required
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="Ingresa tu contraseña actual"
              className="w-full border border-slate-200 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nueva Contraseña</label>
            <input
              required
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              className="w-full border border-slate-200 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Confirmar Nueva Contraseña</label>
            <input
              required
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repite la nueva contraseña"
              className={`w-full border rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-[#1D3A8A]/20 bg-slate-50 text-sm ${
                confirmPassword && newPassword !== confirmPassword ? 'border-red-300' : 'border-slate-200'
              }`}
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isChanging || !currentPassword || !newPassword || newPassword !== confirmPassword}
            className="w-full py-3 rounded-xl font-bold text-white bg-[#1D3A8A] hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isChanging ? <Loader2 className="w-5 h-5 animate-spin" /> : <KeyRound className="w-5 h-5" />}
            Actualizar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
}
