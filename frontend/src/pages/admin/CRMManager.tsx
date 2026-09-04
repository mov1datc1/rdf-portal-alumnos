import { useState, useEffect, useRef } from 'react';
import { Loader2, Plus, X, Phone, Mail, MessageSquare, TrendingUp, Search, Edit2, Trash2, ShieldCheck, AlertTriangle, Table, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { showSuccess, showError, confirmDelete } from '../../utils/alerts';

const SOURCES = [
  { value: 'GOOGLE_ADS', label: 'Google Ads', color: '#4285F4', icon: '🔵' },
  { value: 'META_ADS', label: 'Meta Ads', color: '#0668E1', icon: '🟣' },
  { value: 'INSTAGRAM', label: 'Instagram', color: '#E1306C', icon: '📸' },
  { value: 'FACEBOOK', label: 'Facebook', color: '#1877F2', icon: '📘' },
  { value: 'WHATSAPP_ORGANIC', label: 'WhatsApp', color: '#25D366', icon: '💬' },
  { value: 'REFERRAL', label: 'Referido', color: '#FF9800', icon: '🤝' },
  { value: 'WEBSITE', label: 'Website', color: '#607D8B', icon: '🌐' },
];

const renderSourceIcon = (sourceValue: string, className = "w-4 h-4 inline-block align-middle") => {
  switch (sourceValue) {
    case 'WHATSAPP_ORGANIC':
    case 'WHATSAPP':
      return (
        <img
          src="/imagenes-lp/whatsapp_official_meta.svg"
          alt="WhatsApp"
          className={`${className} object-contain inline-block align-middle`}
        />
      );
    case 'FACEBOOK':
      return (
        <svg className={`${className} inline-block align-middle flex-shrink-0`} viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case 'INSTAGRAM':
      return (
        <svg className={`${className} inline-block align-middle flex-shrink-0`} viewBox="0 0 24 24" fill="#E1306C">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      );
    case 'GOOGLE_ADS':
      return (
        <svg className={`${className} inline-block align-middle flex-shrink-0`} viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
      );
    case 'META_ADS':
      return (
        <svg className={`${className} inline-block align-middle flex-shrink-0`} viewBox="0 0 24 24" fill="#0668E1">
          <path d="M16.924 5.31c-1.488 0-2.858.625-3.924 1.688A5.556 5.556 0 0 0 9.076 5.31C6.273 5.31 4 7.583 4 10.386c0 4.148 5.618 8.304 8.536 10.154.286.182.642.182.928 0C16.382 18.69 22 14.534 22 10.386c0-2.803-2.273-5.076-5.076-5.076zM13 10.386c0-2.206 1.794-4 4-4s4 1.794 4 4c0 2.946-4.306 6.425-7 8.163V10.386z"/>
        </svg>
      );
    case 'REFERRAL':
      return (
        <svg className={`${className} inline-block align-middle flex-shrink-0`} viewBox="0 0 24 24" fill="none" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      );
    case 'WEBSITE':
      return (
        <svg className={`${className} inline-block align-middle flex-shrink-0`} viewBox="0 0 24 24" fill="none" stroke="#607D8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      );
    default:
      return <span className={className}>🌐</span>;
  }
};

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
  const [tab, setTab] = useState<'kanban' | 'table' | 'analytics'>('kanban');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const pageSize = 10;

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
      if (res.ok) { showSuccess('Prospecto guardado'); resetForm(); fetchData(); }
      else showError('Error al guardar', (await res.json()).message);
    } catch (e) { console.error(e); showError('Error de conexión'); }
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
    if (!(await confirmDelete('¿Eliminar este prospecto?'))) return;
    await fetch(`${apiUrl}/admin/leads/${id}`, { method: 'DELETE', headers });
    fetchData();
  };

  const handleDragStart = (leadId: string) => { dragRef.current = leadId; };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    if (newStatus === 'ENROLLED') {
      const lead = leads.find(l => l.id === leadId);
      if (lead && lead.status !== 'ENROLLED') {
        setEnrollConfirm({ leadId, leadName: lead.name, leadEmail: lead.email });
        return;
      }
    }
    await fetch(`${apiUrl}/admin/leads/${leadId}/status`, {
      method: 'PATCH', headers, body: JSON.stringify({ status: newStatus }),
    });
    fetchData();
  };

  const handleDrop = async (newStatus: string) => {
    if (!dragRef.current) return;
    const leadId = dragRef.current;
    dragRef.current = null;
    handleStatusChange(leadId, newStatus);
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
        showError('Error al inscribir', err.message);
      }
    } catch (e) {
      console.error(e);
      showError('Error de conexión');
    } finally {
      setEnrolling(false);
    }
  };

  const filtered = leads.filter(l => {
    const t = search.toLowerCase();
    const matchesSearch = l.name?.toLowerCase().includes(t) || l.phone?.includes(t) || l.email?.toLowerCase().includes(t);
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedLeads = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

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
          className="flex items-center gap-2 bg-[#1D3A8A] text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-800 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> Nuevo Lead
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        <button onClick={() => setTab('kanban')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${tab === 'kanban' ? 'bg-[#1D3A8A] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Pipeline Kanban
        </button>
        <button onClick={() => setTab('table')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${tab === 'table' ? 'bg-[#1D3A8A] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          <Table className="w-4 h-4" /> Vista Tabla
        </button>
        <button onClick={() => setTab('analytics')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${tab === 'analytics' ? 'bg-[#1D3A8A] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          <TrendingUp className="w-4 h-4" /> Analytics
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Buscar por nombre, teléfono o email..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-[#1D3A8A]/20 text-sm shadow-sm"
          />
        </div>

        {tab === 'table' && (
          <div className="flex items-center gap-3">
            {/* Filter Status */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500">Estado:</span>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer">
                <option value="ALL">Todos los prospectos ({leads.length})</option>
                {STATUSES.map(s => (
                  <option key={s.value} value={s.value}>
                    {s.label} ({leads.filter(l => l.status === s.value).length})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
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
                          <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 flex items-center gap-1" title={src?.label}>
                            {renderSourceIcon(lead.source, "w-3.5 h-3.5")} {src?.label}
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

      {tab === 'table' && (
        /* ── Centralized Table View ── */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>
              Mostrando <strong className="text-slate-800">{paginatedLeads.length}</strong> de <strong className="text-slate-800">{filtered.length}</strong> prospectos encontrados
            </span>
            <span>Página {currentPage} de {totalPages}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Nombre del Prospecto</th>
                  <th className="p-3.5">Correo Electrónico</th>
                  <th className="p-3.5">Teléfono / WhatsApp</th>
                  <th className="p-3.5">Estado del Prospecto</th>
                  <th className="p-3.5">Fecha Registro</th>
                  <th className="p-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      No se encontraron prospectos con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  paginatedLeads.map(lead => {
                    const src = SOURCES.find(s => s.value === lead.source);
                    const st = STATUSES.find(s => s.value === lead.status);
                    const cleanPhone = lead.phone?.replace(/\D/g, '') || '';
                    const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : null;
                    const createdDate = lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-sm">{lead.name}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-600 flex items-center gap-1.5 w-fit">
                                {renderSourceIcon(lead.source, "w-3.5 h-3.5")} {src?.label}
                              </span>
                              {lead.interestedIn && (
                                <span className="text-xs text-slate-400 font-medium">• {lead.interestedIn}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          {lead.email ? (
                            <a href={`mailto:${lead.email}`} className="text-slate-600 hover:text-blue-600 flex items-center gap-1.5 text-xs font-medium">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              {lead.email}
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-700">{lead.phone}</span>
                            {whatsappUrl && (
                              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-full transition-colors" title="Abrir WhatsApp">
                                <MessageSquare className="w-3 h-3" /> Chat
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={lead.status}
                            onChange={e => handleStatusChange(lead.id, e.target.value)}
                            className="text-xs font-bold py-1 px-2.5 rounded-full border cursor-pointer transition-colors focus:ring-2 focus:ring-blue-500/20"
                            style={{
                              backgroundColor: st?.color ? `${st.color}15` : '#f1f5f9',
                              borderColor: st?.color ? `${st.color}40` : '#e2e8f0',
                              color: st?.color || '#334155'
                            }}
                          >
                            {STATUSES.map(s => (
                              <option key={s.value} value={s.value} className="bg-white text-slate-800 font-normal">
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3.5 text-xs text-slate-500 font-medium">
                          {createdDate}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex justify-end items-center gap-1">
                            <button onClick={() => handleEdit(lead)} title="Editar prospecto"
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(lead.id)} title="Eliminar prospecto"
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
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

          {/* Table Pagination Footer */}
          {totalPages > 1 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors flex items-center gap-1"
                >
                  Siguiente <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
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
                      <span className="text-base flex items-center justify-center w-6 h-6">{renderSourceIcon(s.source, "w-5 h-5")}</span>
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
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowSourceDropdown(!showSourceDropdown)}
                      className="w-full border border-slate-200 rounded-xl py-2 px-3 text-sm bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors text-left"
                    >
                      <span className="flex items-center gap-2 font-medium text-slate-800">
                        {renderSourceIcon(form.source, "w-4 h-4")}
                        {SOURCES.find(s => s.value === form.source)?.label}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showSourceDropdown ? 'rotate-90' : ''}`} />
                    </button>
                    {showSourceDropdown && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1 max-h-56 overflow-y-auto">
                        {SOURCES.map(s => (
                          <button
                            key={s.value}
                            type="button"
                            onClick={() => {
                              setForm({ ...form, source: s.value });
                              setShowSourceDropdown(false);
                            }}
                            className={`w-full px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 transition-colors text-left font-medium ${form.source === s.value ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'}`}
                          >
                            <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">{renderSourceIcon(s.value, "w-4 h-4")}</span>
                            <span>{s.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
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
