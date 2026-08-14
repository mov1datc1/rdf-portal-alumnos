import { useState, useEffect } from 'react';
import { Loader2, Users, Layers, DollarSign, UserPlus, BarChart3, Clock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const MODALITY_LABELS: Record<string, string> = { GROUP: 'Grupal', INDIVIDUAL: 'Individual', PART_DUO: 'Part Duo' };
const RHYTHM_LABELS: Record<string, string> = { REGULAR: 'Regular', SATURDAY: 'Sabatino', INTENSIVE: 'Intensivo' };

export function Analytics360() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const session = useAuthStore(state => state.session);

  useEffect(() => {
    if (!session) return;
    fetch(`${import.meta.env.VITE_API_URL}/admin/analytics360`, {
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    })
      .then(r => r.json())
      .then(setData)
      .catch(e => {
        console.error(e);
        setData({ statusCode: 503, message: 'No se pudo conectar con el servidor (backend apagado o red fallando).' });
      })
      .finally(() => setLoading(false));
  }, [session]);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#1D3A8A]" /></div>;
  if (!data) return null;

  const { summary, revenue, distribution, occupancy, recent, adBudgets } = data;

  if (data.statusCode || !summary) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-500 font-bold text-lg mb-2">Error cargando analytics.</p>
        <p className="text-slate-500 text-sm">{data.message || 'Respuesta inválida del servidor.'}</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Analytics 360°</h1>
        <p className="text-slate-500 text-sm">Visión ejecutiva de toda la operación de la escuela.</p>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Alumnos', value: summary.totalStudents, icon: Users, color: '#1D3A8A', bg: 'bg-blue-50' },
          { label: 'Profesores', value: summary.totalTeachers, icon: Users, color: '#2E7D32', bg: 'bg-green-50' },
          { label: 'Grupos', value: summary.totalGroups, icon: Layers, color: '#7C3AED', bg: 'bg-purple-50' },
          { label: 'Leads Totales', value: summary.totalLeads, icon: UserPlus, color: '#F59E0B', bg: 'bg-amber-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
                <c.icon className="w-4 h-4" style={{ color: c.color }} />
              </div>
              <p className="text-xs text-slate-500">{c.label}</p>
            </div>
            <p className="text-2xl font-bold text-slate-800">{c.value}</p>
          </div>
        ))}
      </div>

      {/* ── Revenue Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-200" />
            <p className="text-sm text-emerald-200">Revenue Este Mes</p>
          </div>
          <p className="text-3xl font-bold">${(revenue.thisMonth || 0).toLocaleString()}</p>
          {revenue.monthOverMonth && (
            <p className={`text-sm mt-1 ${parseFloat(revenue.monthOverMonth) >= 0 ? 'text-emerald-200' : 'text-red-200'}`}>
              {parseFloat(revenue.monthOverMonth) >= 0 ? '↑' : '↓'} {revenue.monthOverMonth}% vs mes anterior
            </p>
          )}
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Revenue Mes Anterior</p>
          <p className="text-2xl font-bold text-slate-800">${(revenue.lastMonth || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Revenue Acumulado</p>
          <p className="text-2xl font-bold text-slate-800">${(revenue.allTime || 0).toLocaleString()}</p>
        </div>
      </div>

      {/* ── Conversion + Ad ROI ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Tasa de Conversión</p>
          <p className="text-3xl font-bold text-[#1D3A8A]">{summary.conversionRate}</p>
          <p className="text-xs text-slate-400">{summary.enrolledLeads} inscritos de {summary.totalLeads} leads</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Costo por Alumno</p>
          <p className="text-3xl font-bold text-amber-600">{summary.costPerStudent ? `$${summary.costPerStudent}` : '—'}</p>
          <p className="text-xs text-slate-400">Inversión Ads: ${adBudgets.total.toLocaleString()}/mes</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Inscripciones Activas</p>
          <p className="text-3xl font-bold text-emerald-600">{summary.activeEnrollments}</p>
        </div>
      </div>

      {/* ── Distributions ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Groups by Modality */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#1D3A8A]" /> Grupos por Modalidad
          </h3>
          <div className="space-y-3">
            {distribution.groupsByModality?.map((g: any) => (
              <div key={g.modality} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">{MODALITY_LABELS[g.modality] || g.modality}</span>
                <span className="text-sm font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">{g.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Groups by Rhythm */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1D3A8A]" /> Grupos por Ritmo
          </h3>
          <div className="space-y-3">
            {distribution.groupsByRhythm?.map((g: any) => (
              <div key={g.rhythm} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">{RHYTHM_LABELS[g.rhythm] || g.rhythm}</span>
                <span className="text-sm font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">{g.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payments by Method */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" /> Pagos por Método
          </h3>
          <div className="space-y-3">
            {distribution.paymentsByMethod?.map((p: any) => (
              <div key={p.method} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">{p.method || 'Sin método'}</span>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-600">${(p.total || 0).toLocaleString()}</span>
                  <span className="text-xs text-slate-400 ml-2">({p.count} pagos)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enrollments by Plan */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#7C3AED]" /> Inscripciones por Plan
          </h3>
          <div className="space-y-3">
            {distribution.enrollmentsByPlan?.map((e: any) => (
              <div key={e.plan} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">{e.plan}</span>
                <span className="text-sm font-bold text-slate-800 bg-purple-50 text-purple-700 px-3 py-1 rounded-lg">{e.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Occupancy / Capacity ── */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4">📊 Ocupación de Grupos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {occupancy?.map((g: any) => (
            <div key={g.id} className="border border-slate-100 rounded-xl p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-slate-700">{g.name}</span>
                <span className="text-xs text-slate-400">{MODALITY_LABELS[g.modality]}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 mb-1">
                <div
                  className={`h-3 rounded-full transition-all ${g.pct >= 90 ? 'bg-red-500' : g.pct >= 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(g.pct, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">{g.current}/{g.max} alumnos ({g.pct}%)</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">💰 Últimos Pagos</h3>
          {recent.payments?.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">Sin pagos registrados.</p>
          ) : (
            <div className="space-y-2">
              {recent.payments?.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between text-sm border-b border-slate-50 pb-2">
                  <div>
                    <p className="font-semibold text-slate-700">{p.enrollment?.user?.firstName} {p.enrollment?.user?.lastName}</p>
                    <p className="text-xs text-slate-400">{p.method} · {p.enrollment?.level?.name}</p>
                  </div>
                  <span className="font-bold text-emerald-600">${(p.amount || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">🆕 Últimos Leads</h3>
          {recent.leads?.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">Sin leads recientes.</p>
          ) : (
            <div className="space-y-2">
              {recent.leads?.map((l: any) => (
                <div key={l.id} className="flex items-center justify-between text-sm border-b border-slate-50 pb-2">
                  <div>
                    <p className="font-semibold text-slate-700">{l.name}</p>
                    <p className="text-xs text-slate-400">{l.phone} · {l.source}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    l.status === 'ENROLLED' ? 'bg-emerald-50 text-emerald-600' :
                    l.status === 'LOST' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
