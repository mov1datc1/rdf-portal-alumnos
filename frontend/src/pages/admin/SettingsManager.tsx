import { useState, useEffect } from 'react';
import { Loader2, Save, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { showSuccess, showError } from '../../utils/alerts';

export function SettingsManager() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const session = useAuthStore(state => state.session);

  const apiUrl = import.meta.env.VITE_API_URL;
  const headers = { 'Authorization': `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' };

  useEffect(() => {
    if (!session) return;
    fetch(`${apiUrl}/admin/settings`, { headers })
      .then(r => r.json())
      .then(setSettings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/admin/settings`, {
        method: 'PATCH', headers,
        body: JSON.stringify({
          googleAdsBudget: settings.googleAdsBudget,
          metaAdsBudget: settings.metaAdsBudget,
          schoolName: settings.schoolName,
        }),
      });
      if (res.ok) showSuccess('Configuración guardada');
      else showError('Error al guardar');
    } catch (e) { showError('Error de conexión'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#1D3A8A]" /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Configuración</h1>
        <p className="text-slate-500 text-sm">Ajustes globales de la plataforma y presupuestos publicitarios.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#1D3A8A]" /> General
        </h2>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre de la Escuela</label>
          <input type="text" value={settings?.schoolName || ''}
            onChange={e => setSettings({...settings, schoolName: e.target.value})}
            className="w-full border border-slate-200 rounded-xl py-2 px-3 bg-slate-50"
          />
        </div>

        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-sm font-bold text-slate-700 mb-3">💰 Presupuesto de Ads Mensual (MXN)</h3>
          <p className="text-xs text-slate-400 mb-3">Estos valores se usan para calcular el costo por lead en el CRM.</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">🔵 Google Ads</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input type="number" min={0}
                  value={settings?.googleAdsBudget || 0}
                  onChange={e => setSettings({...settings, googleAdsBudget: Number(e.target.value)})}
                  className="w-full border border-slate-200 rounded-xl py-2 pl-7 pr-3 bg-slate-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">🟣 Meta Ads</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input type="number" min={0}
                  value={settings?.metaAdsBudget || 0}
                  onChange={e => setSettings({...settings, metaAdsBudget: Number(e.target.value)})}
                  className="w-full border border-slate-200 rounded-xl py-2 pl-7 pr-3 bg-slate-50"
                />
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full py-3 rounded-xl font-bold text-white bg-[#1D3A8A] hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Guardar Configuración
        </button>
      </div>
    </div>
  );
}
