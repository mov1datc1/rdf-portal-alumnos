import { useState, useEffect } from 'react';
import { Loader2, BookOpen, Save, Layers, Clock, CheckCircle2, Edit2, Trash2, X, AlertTriangle, Check, Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Undo, Redo } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import React, { useRef } from 'react';

const MiniRichTextEditor = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const exec = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    handleInput();
    editorRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-1.5 p-2.5 border-b border-slate-200 bg-slate-50 flex-wrap shadow-sm">
        <button type="button" onClick={() => exec('undo')} className="p-1.5 hover:bg-slate-200 text-slate-700 rounded transition-colors" title="Deshacer">
          <Undo className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => exec('redo')} className="p-1.5 hover:bg-slate-200 text-slate-700 rounded transition-colors" title="Rehacer">
          <Redo className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1"></div>

        <select onChange={(e) => exec('fontName', e.target.value)} className="bg-white border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer" title="Fuente">
          <option value="Inter">Inter (Defecto)</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
        </select>

        <select onChange={(e) => exec('formatBlock', e.target.value)} className="bg-white border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer" title="Estilo de texto">
          <option value="P">Párrafo normal</option>
          <option value="H1">Título Grande (H1)</option>
          <option value="H2">Subtítulo (H2)</option>
          <option value="H3">Encabezado (H3)</option>
        </select>

        <div className="w-px h-5 bg-slate-300 mx-1"></div>

        <input type="color" onChange={(e) => exec('foreColor', e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-transparent" title="Color de texto" />

        <div className="w-px h-5 bg-slate-300 mx-1"></div>

        <button type="button" onClick={() => exec('bold')} className="p-1.5 hover:bg-slate-200 text-slate-700 rounded transition-colors" title="Negrita">
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => exec('italic')} className="p-1.5 hover:bg-slate-200 text-slate-700 rounded transition-colors" title="Cursiva">
          <Italic className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => exec('underline')} className="p-1.5 hover:bg-slate-200 text-slate-700 rounded transition-colors" title="Subrayado">
          <Underline className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => exec('strikeThrough')} className="p-1.5 hover:bg-slate-200 text-slate-700 rounded transition-colors" title="Tachado">
          <Strikethrough className="w-4 h-4" />
        </button>
        
        <div className="w-px h-5 bg-slate-300 mx-1"></div>

        <button type="button" onClick={() => exec('justifyLeft')} className="p-1.5 hover:bg-slate-200 text-slate-700 rounded transition-colors" title="Alinear a la izquierda">
          <AlignLeft className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => exec('justifyCenter')} className="p-1.5 hover:bg-slate-200 text-slate-700 rounded transition-colors" title="Centrar">
          <AlignCenter className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => exec('justifyRight')} className="p-1.5 hover:bg-slate-200 text-slate-700 rounded transition-colors" title="Alinear a la derecha">
          <AlignRight className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => exec('justifyFull')} className="p-1.5 hover:bg-slate-200 text-slate-700 rounded transition-colors" title="Justificar">
          <AlignJustify className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1"></div>

        <button type="button" onClick={() => exec('insertUnorderedList')} className="p-1.5 hover:bg-slate-200 text-slate-700 rounded transition-colors" title="Viñetas">
          <List className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => exec('insertOrderedList')} className="p-1.5 hover:bg-slate-200 text-slate-700 rounded transition-colors" title="Lista numerada">
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>
      {/* Editor Area */}
      <div 
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        className="flex-1 p-5 outline-none overflow-y-auto prose prose-sm max-w-none prose-slate"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
};

export function TeacherLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const session = useAuthStore(state => state.session);

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'error' | 'success' } | null>(null);

  const showToast = (message: string, type: 'error' | 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const [levelId, setLevelId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    if (!session) return;
    
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/teacher/logs`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      }).then(r => r.ok ? r.json() : []),
      fetch(`${import.meta.env.VITE_API_URL}/teacher/groups`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      }).then(r => r.ok ? r.json() : [])
    ])
      .then(([logsData, groupsData]) => {
        const safeLogs = Array.isArray(logsData) ? logsData : [];
        const safeGroups = Array.isArray(groupsData) ? groupsData : [];
        setLogs(safeLogs);
        setGroups(safeGroups);
        if (safeGroups.length > 0) setLevelId(safeGroups[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  const handleEdit = (log: any) => {
    setEditingId(log.id);
    setLevelId(log.module?.levelId || '');
    setTitle(log.title);
    setDescription(log.description);
    setDate(new Date(log.scheduledAt).toISOString().split('T')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId || isDeleting) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/teacher/logs/${deleteConfirmId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (!res.ok) {
        if (res.status === 404) {
          // Si ya no existe, lo quitamos de todos modos
          setLogs(logs.filter(l => l.id !== deleteConfirmId));
          showToast('Bitácora eliminada correctamente', 'success');
          return;
        }
        throw new Error('Error al eliminar');
      }
      setLogs(logs.filter(l => l.id !== deleteConfirmId));
      showToast('Bitácora eliminada correctamente', 'success');
    } catch (e) {
      showToast('Error al eliminar la bitácora', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || (!levelId && !editingId) || !title || !description) return;

    setSubmitting(true);
    setSuccess(false);

    try {
      if (editingId) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/teacher/logs/${editingId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ title, description, date })
        });
        if (!res.ok) throw new Error('Error al actualizar');
        const updatedLog = await res.json();
        setLogs(logs.map(l => l.id === editingId ? updatedLog : l));
        handleCancelEdit();
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/teacher/logs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ levelId, title, description, date })
        });
        if (!res.ok) throw new Error('Error al guardar la bitácora');
        const newLog = await res.json();
        setLogs([newLog, ...logs]);
        setTitle('');
        setDescription('');
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      showToast('Hubo un error al guardar la bitácora.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#b91c1c]" /></div>;

  return (
    <div className="space-y-8">
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

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[50]">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-[#b91c1c]" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">¿Eliminar bitácora?</h2>
            <p className="text-slate-500 mb-8">
              Esta acción no se puede deshacer. Se eliminará el registro de la clase permanentemente.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 flex justify-center items-center px-4 py-3 rounded-xl font-bold text-white bg-[#b91c1c] hover:bg-red-800 transition-colors shadow-lg shadow-red-900/20 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-slate-800">Bitácora de Clases</h1>
        <p className="text-slate-500 text-sm">Registra lo que enseñaste hoy en cada uno de tus grupos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulario */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-6">
            <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              {editingId ? <Edit2 className="w-5 h-5 text-[#b91c1c]" /> : <BookOpen className="w-5 h-5 text-[#b91c1c]" />}
              {editingId ? 'Editar Bitácora' : 'Nueva Bitácora'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Grupo
                </label>
                <select
                  value={levelId}
                  onChange={(e) => setLevelId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b91c1c]/20 focus:border-[#b91c1c] transition-colors"
                  required
                  disabled={!!editingId}
                >
                  {(!Array.isArray(groups) || groups.length === 0) && <option value="">No tienes grupos asignados</option>}
                  {Array.isArray(groups) && groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name} ({g.levelCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Fecha de la Clase
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b91c1c]/20 focus:border-[#b91c1c] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Título del Tema
                </label>
                <input
                  type="text"
                  placeholder="Ej. Passé composé con être"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b91c1c]/20 focus:border-[#b91c1c] transition-colors"
                  required
                />
              </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Resumen / Actividades (Bitácora)
                  </label>
                  <button 
                    type="button"
                    onClick={() => setIsEditorOpen(true)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-left text-sm text-slate-500 hover:bg-slate-100 hover:border-[#b91c1c] transition-colors flex items-center justify-between"
                  >
                    {description ? (
                      <span className="truncate text-slate-700 block max-h-5 overflow-hidden" dangerouslySetInnerHTML={{ __html: description.replace(/<[^>]*>?/gm, '').substring(0, 50) + '...' }} />
                    ) : (
                      <span>Haz clic aquí para redactar el resumen con formato...</span>
                    )}
                    <Edit2 className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

              <div className="flex gap-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting || groups.length === 0}
                  className="flex-1 bg-[#b91c1c] text-white py-3 rounded-xl font-bold hover:bg-red-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : success ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" /> Guardado
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" /> {editingId ? 'Guardar Cambios' : 'Guardar Bitácora'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Historial */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <h2 className="font-bold text-slate-800 mb-2">Historial de Clases</h2>
            
            {(!Array.isArray(logs) || logs.length === 0) ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Aún no has registrado ninguna bitácora.</p>
              </div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm transition-hover hover:shadow-md">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{log.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3 text-[#b91c1c]" />
                          {log.module?.level?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(log.scheduledAt).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(log)} className="p-2 text-slate-400 hover:text-[#1D3A8A] hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(log.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div 
                    className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 whitespace-normal prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: log.description }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Editor Lateral Drawer */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-[70] overflow-hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in" 
            onClick={() => setIsEditorOpen(false)} 
          />
          
          {/* Side panel */}
          <div className="absolute inset-y-0 right-0 w-full max-w-2xl bg-slate-50 shadow-2xl animate-in slide-in-from-right flex flex-col border-l border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <Edit2 className="w-5 h-5 text-[#b91c1c]" />
                Redactar Resumen de la Clase
              </h2>
              <button 
                onClick={() => setIsEditorOpen(false)} 
                className="p-2 hover:bg-slate-100 text-slate-500 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-[400px]">
                <MiniRichTextEditor 
                  value={description}
                  onChange={setDescription}
                />
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-white">
              <button 
                onClick={() => {
                  setIsEditorOpen(false);
                  showToast('Borrador listo. Presiona "Guardar Bitácora" para finalizar y subir a la base de datos.', 'success');
                }}
                className="w-full py-3.5 bg-[#b91c1c] text-white font-bold rounded-xl hover:bg-[#991b1b] transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Confirmar Borrador
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
