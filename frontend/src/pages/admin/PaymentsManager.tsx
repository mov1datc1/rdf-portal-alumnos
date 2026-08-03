import { useState, useEffect } from 'react';
import { Loader2, Plus, X, DollarSign, CreditCard, Check, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const PLAN_TYPES = [
  'Grupal Regular', 'Grupal Sabatino', 'Grupal Intensivo',
  'Individual 1x/sem', 'Individual 2x/sem', 'Individual 3x/sem',
  'Part Duo',
];

const METHODS = ['PayPal', 'Transferencia', 'Efectivo', 'Tarjeta'];

export function PaymentsManager() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [showPayForm, setShowPayForm] = useState<string | null>(null);
  const session = useAuthStore(state => state.session);

  const apiUrl = import.meta.env.VITE_API_URL;
  const headers: any = { 'Authorization': `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' };

  const [enrollForm, setEnrollForm] = useState({
    userId: '', levelId: '', planType: 'Grupal Regular', monthlyFee: '', startDate: '',
  });

  const [payForm, setPayForm] = useState({
    enrollmentId: '', amount: '', method: 'PayPal', reference: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eRes, sRes, lRes] = await Promise.all([
        fetch(`${apiUrl}/admin/enrollments`, { headers }),
        fetch(`${apiUrl}/admin/users`, { headers }),
        fetch(`${apiUrl}/admin/levels`, { headers }),
      ]);
      if (eRes.ok) setEnrollments(await eRes.json());
      if (sRes.ok) setStudents(await sRes.json());
      if (lRes.ok) setLevels(await lRes.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (session) fetchData(); }, [session]);

  const handleCreateEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${apiUrl}/admin/enrollments`, { method: 'POST', headers, body: JSON.stringify(enrollForm) });
    setShowEnrollForm(false);
    setEnrollForm({ userId: '', levelId: '', planType: 'Grupal Regular', monthlyFee: '', startDate: '' });
    fetchData();
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${apiUrl}/admin/payments`, { method: 'POST', headers, body: JSON.stringify({ ...payForm, enrollmentId: showPayForm }) });
    setShowPayForm(null);
    setPayForm({ enrollmentId: '', amount: '', method: 'PayPal', reference: '' });
    fetchData();
  };

  const handleDeleteEnrollment = async (id: string) => {
    if (!confirm('¿Eliminar esta inscripción y todos sus pagos?')) return;
    await fetch(`${apiUrl}/admin/enrollments/${id}`, { method: 'DELETE', headers });
    fetchData();
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#1D3A8A]" /></div>;

  const totalRevenue = enrollments.reduce((sum: number, e: any) => sum + (e.payments?.reduce((s: number, p: any) => s + (p.amount || 0), 0) || 0), 0);
  const pendingCount = enrollments.filter((e: any) => e.isActive && (!e.payments || e.payments.length === 0)).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Facturación y Pagos</h1>
          <p className="text-slate-500 text-sm">Inscripciones, pagos y planes de los alumnos.</p>
        </div>
        <button onClick={() => setShowEnrollForm(true)}
          className="flex items-center gap-2 bg-[#1D3A8A] text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-800 transition-colors"
        >
          <Plus className="w-5 h-5" /> Nueva Inscripción
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs text-slate-500">Inscripciones Activas</p>
          <p className="text-2xl font-bold text-slate-800">{enrollments.filter((e: any) => e.isActive).length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs text-slate-500">Revenue Total</p>
          <p className="text-2xl font-bold text-emerald-600">${totalRevenue.toLocaleString()} MXN</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs text-slate-500">Pendientes de Pago</p>
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Inscripciones</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
              <tr>
                <th className="p-3">Alumno</th>
                <th className="p-3">Grupo</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Mensualidad</th>
                <th className="p-3">Inicio</th>
                <th className="p-3">Pagos</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enrollments.map((e: any) => {
                const totalPaid = e.payments?.reduce((s: number, p: any) => s + (p.amount || 0), 0) || 0;
                return (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold">{e.user?.firstName} {e.user?.lastName}</td>
                    <td className="p-3">{e.level?.name} <span className="text-xs text-slate-400">({e.level?.levelCode})</span></td>
                    <td className="p-3 text-xs">{e.planType}</td>
                    <td className="p-3 font-bold">${e.monthlyFee?.toLocaleString()}</td>
                    <td className="p-3 text-xs">{new Date(e.startDate).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className="text-xs font-bold text-emerald-600">${totalPaid.toLocaleString()}</span>
                      <span className="text-xs text-slate-400 ml-1">({e.payments?.length || 0})</span>
                    </td>
                    <td className="p-3">
                      {e.isActive ? (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                          <Check className="w-3 h-3" /> Activo
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Inactivo</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => { setPayForm({ ...payForm, amount: String(e.monthlyFee) }); setShowPayForm(e.id); }}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <DollarSign className="w-3.5 h-3.5" /> Pago
                        </button>
                        <button onClick={() => handleDeleteEnrollment(e.id)}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal: New Enrollment ── */}
      {showEnrollForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowEnrollForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Nueva Inscripción</h2>
              <button onClick={() => setShowEnrollForm(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateEnrollment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Alumno</label>
                <select required value={enrollForm.userId} onChange={e => setEnrollForm({...enrollForm, userId: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl py-2 px-3 text-sm bg-slate-50">
                  <option value="">Selecciona...</option>
                  {students.filter((s: any) => s.role === 'STUDENT').map((s: any) => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Grupo / Nivel</label>
                <select required value={enrollForm.levelId} onChange={e => setEnrollForm({...enrollForm, levelId: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl py-2 px-3 text-sm bg-slate-50">
                  <option value="">Selecciona...</option>
                  {levels.map((l: any) => (
                    <option key={l.id} value={l.id}>{l.name} ({l.levelCode})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Plan</label>
                  <select value={enrollForm.planType} onChange={e => setEnrollForm({...enrollForm, planType: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl py-2 px-3 text-sm bg-slate-50">
                    {PLAN_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Mensualidad (MXN)</label>
                  <input required type="number" min="0" value={enrollForm.monthlyFee}
                    onChange={e => setEnrollForm({...enrollForm, monthlyFee: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl py-2 px-3 text-sm bg-slate-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Fecha de Inicio</label>
                <input required type="date" value={enrollForm.startDate}
                  onChange={e => setEnrollForm({...enrollForm, startDate: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl py-2 px-3 text-sm bg-slate-50"
                />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl font-bold text-white bg-[#1D3A8A] hover:bg-blue-800 transition-colors">
                Crear Inscripción
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Record Payment ── */}
      {showPayForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowPayForm(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" /> Registrar Pago
              </h2>
              <button onClick={() => setShowPayForm(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreatePayment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Monto (MXN)</label>
                <input required type="number" min="0" value={payForm.amount}
                  onChange={e => setPayForm({...payForm, amount: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl py-2 px-3 text-sm bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Método</label>
                <select value={payForm.method} onChange={e => setPayForm({...payForm, method: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl py-2 px-3 text-sm bg-slate-50">
                  {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Referencia / Transaction ID</label>
                <input type="text" value={payForm.reference}
                  onChange={e => setPayForm({...payForm, reference: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl py-2 px-3 text-sm bg-slate-50"
                  placeholder="PayPal transaction ID..."
                />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                <DollarSign className="w-5 h-5" /> Registrar Pago
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
