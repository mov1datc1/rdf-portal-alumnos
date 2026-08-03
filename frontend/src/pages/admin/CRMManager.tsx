import { useState, useEffect, useRef } from 'react';
import { Loader2, Plus, X, Phone, Mail, MessageSquare, TrendingUp, Search, Edit2, Trash2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const SOURCES = [
  { value: 'GOOGLE_ADS', label: 'Google Ads', color: '#4285F4', icon: '🔵' },
  { value: 'META_ADS', label: 'Meta Ads', color: '#0668E1', icon: '🟣' },
  { value: 'INSTAGRAM', label: 'Instagram', color: '#E1306C', icon: '📸' },
  { value: 'FACEBOOK', label: 'Facebook', color: '#1877F2', icon: '📘' },
  { value: 'WHATSAPP_ORGANIC', label: 'WhatsApp', color: '#25D366', icon: '💬' },
  { value: 'REFERRAL', label: 'Referido', color: '#FF9800', icon: '🤝' },
  { value: 'WEBSITE', label: 'Website', color: '#607D8B', icon: '🌐' },
];

const STATUSES = [
  { value: 'NEW', label: 'Nuevo', color: '#3B82F6', bg: 'bg-blue-50', border: 'border-blue-200' },
  { value: 'CONTACTED', label: 'Contactado', color: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-200' },
  { value: 'TRIAL_CLASS', label: 'Clase Prueba', color: '#8B5CF6', bg: 'bg-purple-50', border: 'border-purple-200' },
  { value: 'ENROLLED', label: 'Inscrito ✅', color: '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { value: 'LOST', label: 'No Inscrito', color: '#EF4444', bg: 'bg-red-50', border: 'border-red-200' },
];

const INTERESTS = [
  'Grupal Regular', 'Grupal Sabatino', 'Grupal Intensivo',
  'Individual 1x/sem', 'Individual 2x/sem', 'Individual 3x/sem',
  'Part Duo', 'No definido',
];

export function CRMManager() {
  const [leads, setLeads] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'kanban' | 'analytics'>('kanban');
  const session = useAuthStore(state => state.session);
  const dragRef = useRef<string | null>(null);

  // Enrollment confirmation modal
  const [enrollConfirm, setEnrollConfirm] = useState<{ leadId: string; leadName: string; leadEmail: string | null } | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  const [form, setForm] = useState({
    name: '', phone: '', email: '', source: 'WHATSAPP_ORGANIC',
    interestedIn: '', notes: '', sourceDetail: '',
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const headers = { 'Authorization': `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, analyticsRes] = await Promise.all([
        fetch(`${apiUrl}/admin/leads`, { headers }),
        fetch(`${apiUrl}/admin/leads/analytics`, { headers }),
      ]);
      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (session) fetchData(); }, [session]);

  const resetForm = () => {
    setForm({ name: '', phone: '', email: '', source: 'WHATSAPP_ORGANIC', interestedIn: '', notes: '', sourceDetail: '' });
    setEditingLead(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingLead ? `${apiUrl}/admin/leads/${editingLead.id}` : `${apiUrl}/admin/leads`;
      const method = editingLead ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      if (res.ok) { resetForm(); fetchData(); }
      else alert(`Error: ${(await res.json()).message}`);
    } catch (e) { console.error(e); alert('Error de conexión'); }
  };

  const handleEdit = (lead: any) => {
    setForm({
      name: lead.name, phone: lead.phone, email: lead.email || '',
      source: lead.source, interestedIn: lead.interestedIn || '',
      notes: lead.notes || '', sourceDetail: lead.sourceDetail || '',
    });
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este prospecto?')) return;
    await fetch(`${apiUrl}/admin/leads/${id}`, { method: 'DELETE', headers });
    fetchData();
  };

  const handleDragStart = (leadId: string) => { dragRef.current = leadId; };

  const handleDrop = async (newStatus: string) => {
    if (!dragRef.current) return;
    const leadId = dragRef.current;
    dragRef.current = null;

    // Intercept drops to ENROLLED — show confirmation modal
    if (newStatus === 'ENROLLED') {
      const lead = leads.find(l => l.id === leadId);
      if (lead && lead.status !== 'ENROLLED') {
        setEnrollConfirm({ leadId, leadName: lead.name, leadEmail: lead.email });
        return;
      }
    }

    // All other status changes: apply immediately
    await fetch(`${apiUrl}/admin/leads/${leadId}/status`, {
      method: 'PATCH', headers, body: JSON.stringify({ status: newStatus }),
    });
    fetchData();
  };

  const confirmEnrollment = async () => {
    if (!enrollConfirm) return;
    setEnrolling(true);
    try {
      const res = await fetch(`${apiUrl}/admin/leads/${enrollConfirm.leadId}/status`, {
        method: 'PATCH', headers, body: JSON.stringify({ status: 'ENROLLED' }),
      });
      if (res.ok) {
        setEnrollConfirm(null);
        fetchData();
      } else {
        const err = await res.json();
        alert(`Error: ${err.message}`);
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión');
    } finally {
      setEnrolling(false);
    }
  };

  const filtered = leads.filter(l => {
    const t = search.toLowerCase();
    return l.name?.toLowerCase().includes(t) || l.phone?.includes(t) || l.email?.toLowerCase().includes(t);
  });

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#1D3A8A]" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">CRM — Prospectos</h1>
          <p className="text-slate-500 text-sm">Pipeline de leads desde Google Ads, Meta Ads y WhatsApp.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#1D3A8A] text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-800 transition-colors"
        >
          <Plus className="w-5 h-5" /> Nuevo Lead
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab('kanban')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === 'kanban' ? 'bg-[#1D3A8A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Pipeline Kanban
        </button>
        <button onClick={() => setTab('analytics')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === 'analytics' ? 'bg-[#1D3A8A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          <TrendingUp className="w-4 h-4 inline mr-1" /> Analytics
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input type="text" placeholder="Buscar por nombre, teléfono o email..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-[#1D3A8A]/20 text-sm"
        />
      </div>

      {tab === 'kanban' && (
        /* ── Kanban Board ── */
        <div className="grid grid-cols-5 gap-4 overflow-x-auto pb-4">
          {STATUSES.map(status => {
            const columnLeads = filtered.filter(l => l.status === status.value);
            return (
              <div key={status.value}
                className={`${status.bg} ${status.border} border rounded-2xl p-3 min-h-[400px]`}
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDrop(status.value)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold" style={{ color: status.color }}>{status.label}</h3>
                  <span className="text-xs font-bold bg-white/70 px-2 py-0.5 rounded-full" style={{ color: status.color }}>
                    {columnLeads.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {columnLeads.map(lead => {
                    const src = SOURCES.find(s => s.value === lead.source);
                    return (
                      <div key={lead.id}
                        draggable
                        onDragStart={() => handleDragStart(lead.id)}
                        className="bg-white rounded-xl p-3 shadow-sm border border-white hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-bold text-sm text-slate-800 leading-tight">{lead.name}</p>
                          <div className="flex gap-1">
                            <button onClick={() => handleEdit(lead)} className="p-1 text-slate-400 hover:text-blue-600">
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleDelete(lead.id)} className="p-1 text-slate-400 hover:text-red-500">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-0.5 text-xs text-slate-500">
                          <p className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</p>
                          {lead.email && <p className="flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</p>}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100" title={src?.label}>
                            {src?.icon} {src?.label}
                          </span>
                          {lead.interestedIn && (
                            <span className="text-xs text-slate-400 truncate max-w-[80px]">{lead.interestedIn}</span>
                          )}
                        </div>

                        {lead.notes && (
                          <p className="text-xs text-slate-400 mt-1.5 italic line-clamp-2 flex items-start gap-1">
                            <MessageSquare className="w-3 h-3 mt-0.5 flex-shrink-0" />{lead.notes}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'analytics' && analytics && (
        /* ── Analytics Dashboard ── */
        <div className="space-y-6">
          {/* Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">Total Leads</p>
              <p className="text-2xl font-bold text-slate-800">{analytics.total}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">Este Mes</p>
              <p className="text-2xl font-bold text-blue-600">{analytics.thisMonth}</p>
              {analytics.lastMonth > 0 && (
                <p className="text-xs text-slate-400">vs {analytics.lastMonth} mes anterior</p>
              )}
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">Inscritos</p>
              <p className="text-2xl font-bold text-emerald-600">{analytics.enrolled}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">Tasa de Conversión</p>
              <p className="text-2xl font-bold text-[#1D3A8A]">{analytics.conversionRate}</p>
            </div>
          </div>

          {/* Leads by Source + Cost per Lead */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Leads por Canal</h3>
              <div className="space-y-3">
                {analytics.bySource?.map((s: any) => {
                  const src = SOURCES.find(x => x.value === s.source);
                  const pct = analytics.total > 0 ? ((s.count / analytics.total) * 100).toFixed(0) : 0;
                  return (
                    <div key={s.source} className="flex items-center gap-3">
                      <span className="text-lg">{src?.icon}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="font-semibold text-slate-700">{src?.label || s.source}</span>
                          <span className="text-slate-500">{s.count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: src?.color || '#94a3b8' }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Costo por Lead</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div>
                    <p className="text-xs text-slate-500">Google Ads</p>
                    <p className="text-sm font-semibold text-slate-700">Presupuesto: ${analytics.adBudgets?.google?.toLocaleString()} MXN</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#4285F4]">
                      {analytics.costPerLead?.google ? `$${analytics.costPerLead.google}` : '—'}
                    </p>
                    <p className="text-xs text-slate-400">por lead</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <div>
                    <p className="text-xs text-slate-500">Meta Ads</p>
                    <p className="text-sm font-semibold text-slate-700">Presupuesto: ${analytics.adBudgets?.meta?.toLocaleString()} MXN</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#0668E1]">
                      {analytics.costPerLead?.meta ? `$${analytics.costPerLead.meta}` : '—'}
                    </p>
                    <p className="text-xs text-slate-400">por lead</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-100 rounded-xl">
                  <p className="text-sm font-bold text-slate-700">Total Combinado</p>
                  <p className="text-lg font-bold text-slate-800">
                    {analytics.costPerLead?.total ? `$${analytics.costPerLead.total} MXN` : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Distribución por Etapa</h3>
            <div className="flex gap-2">
              {analytics.byStatus?.map((s: any) => {
                const st = STATUSES.find(x => x.value === s.status);
                const pct = analytics.total > 0 ? ((s.count / analytics.total) * 100).toFixed(0) : 0;
                return (
                  <div key={s.status} className="flex-1 text-center">
                    <div className={`${st?.bg} ${st?.border} border rounded-xl p-3`}>
                      <p className="text-2xl font-bold" style={{ color: st?.color }}>{s.count}</p>
                      <p className="text-xs font-semibold mt-1" style={{ color: st?.color }}>{st?.label || s.status}</p>
                      <p className="text-xs text-slate-400">{pct}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: New/Edit Lead ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => resetForm()}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-[scaleIn_0.2s_ease]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">
                {editingLead ? 'Editar Prospecto' : 'Nuevo Prospecto'}
              </h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre *</label>
                  <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl py-2 px-3 text-sm bg-slate-50"
                    placeholder="María López"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">WhatsApp *</label>
                  <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl py-2 px-3 text-sm bg-slate-50"
                    placeholder="+52 33 1234 5678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl py-2 px-3 text-sm bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Canal de Origen</label>
                  <select value={form.source} onChange={e => setForm({...form, source: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl py-2 px-3 text-sm bg-slate-50">
                    {SOURCES.map(s => (
                      <option key={s.value} value={s.value}>{s.icon} {s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Interesado en</label>
                  <select value={form.interestedIn} onChange={e => setForm({...form, interestedIn: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl py-2 px-3 text-sm bg-slate-50">
                    <option value="">Sin definir</option>
                    {INTERESTS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">UTM / Campaña / Detalle</label>
                <input type="text" value={form.sourceDetail} onChange={e => setForm({...form, sourceDetail: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl py-2 px-3 text-sm bg-slate-50"
                  placeholder="frances_grupal_gdl, remarketing_ig..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Notas</label>
                <textarea rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl py-2 px-3 text-sm bg-slate-50"
                  placeholder="Quiere comenzar en agosto, presupuesto limitado..."
                />
              </div>

              <button type="submit"
                className="w-full py-3 rounded-xl font-bold text-white bg-[#1D3A8A] hover:bg-blue-800 transition-colors"
              >
                {editingLead ? 'Guardar Cambios' : 'Crear Prospecto'}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* ── Modal: Confirm Enrollment ── */}
      {enrollConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-[scaleIn_0.15s_ease]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Confirmar Inscripción</h2>
                <p className="text-xs text-slate-500">Esta acción genera acceso automático</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
              <p className="text-sm text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Al confirmar, se creará <strong>automáticamente</strong> una cuenta de acceso al portal para <strong>{enrollConfirm.leadName}</strong>
                  {enrollConfirm.leadEmail && <> con el correo <strong>{enrollConfirm.leadEmail}</strong></>}.
                </span>
              </p>
            </div>

            <div className="space-y-2 mb-4 text-xs text-slate-500">
              <p>• Se generará usuario y contraseña temporal <code className="bg-slate-100 px-1 py-0.5 rounded">LesRois2026!</code></p>
              <p>• El alumno podrá acceder al portal inmediatamente</p>
              <p>• Podrás asignarle un grupo después en "Usuarios"</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEnrollConfirm(null)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmEnrollment}
                disabled={enrolling}
                className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {enrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Confirmar Inscripción
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
