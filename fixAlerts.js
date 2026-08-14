const fs = require('fs');
const file = 'C:\\Users\\Mariana\\OneDrive\\Desktop\\MOVIDATCI\\portalrdf_temp\\frontend\\src\\pages\\admin\\ScheduleManager.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('AlertTriangle')) {
  code = code.replace('import { Calendar, Loader2, Plus, Clock, Link as LinkIcon, BookOpen, Search, Trash2, Edit2, X, Check, Video } from \'lucide-react\';', 'import { Calendar, Loader2, Plus, Clock, Link as LinkIcon, BookOpen, Search, Trash2, Edit2, X, Check, Video, AlertTriangle, AlertCircle } from \'lucide-react\';');
}

const stateStr =   const [customAlert, setCustomAlert] = useState<{show: boolean; message: string; type: 'error' | 'success'}>({show: false, message: '', type: 'error'});\n  const [deleteConfirm, setDeleteConfirm] = useState<{show: boolean; id: string | null}>({show: false, id: null});;
code = code.replace(/  const \[editingId, setEditingId\] = useState<string \| null>\(null\);/,   const [editingId, setEditingId] = useState<string | null>(null);\n);

code = code.replace(/alert\(\El día seleccionado no coincide con los días de clase del grupo \(\$\{selectedLevelData\?\.schedule\}\)\.\\);/, setCustomAlert({show: true, message: \El día seleccionado no coincide con los días de clase del grupo (\).\, type: 'error'}););
code = code.replace(/alert\('Esa cuenta de Zoom ya está ocupada en ese mismo horario por otra clase. No se pueden cruzar.'\);/, setCustomAlert({show: true, message: 'Esa cuenta de Zoom ya está ocupada en ese mismo horario por otra clase. No se pueden cruzar.', type: 'error'}););
code = code.replace(/alert\(\Error: \$\{error\.message\}\\);/, setCustomAlert({show: true, message: \Error: \\, type: 'error'}););
code = code.replace(/alert\('Error de conexión'\);/, setCustomAlert({show: true, message: 'Error de conexión', type: 'error'}););

const oldHandleDelete =   const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta clase? Si fue creada con Zoom, la reunión también se cancelará.')) return;
    try {
      const res = await fetch(\\/admin/schedule/\\, {
        method: 'DELETE',
        headers: { 'Authorization': \Bearer \\ }
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };;

const newHandleDelete =   const handleDelete = async (id: string) => {
    try {
      const res = await fetch(\\/admin/schedule/\\, {
        method: 'DELETE',
        headers: { 'Authorization': \Bearer \\ }
      });
      if (res.ok) {
        fetchData();
        setDeleteConfirm({show: false, id: null});
      }
    } catch (e) {
      console.error(e);
    }
  };;

code = code.replace(oldHandleDelete, newHandleDelete);

code = code.replace(/onClick=\{\(\) => handleDelete\(cls\.id\)\}/g, onClick={() => setDeleteConfirm({show: true, id: cls.id})});

const modalsJSX = 
      {/* Alert Modal */}
      {customAlert.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Aviso</h3>
            <p className="text-slate-500 text-sm mb-8">{customAlert.message}</p>
            <button 
              onClick={() => setCustomAlert({show: false, message: '', type: 'error'})}
              className="w-full py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">¿Estás seguro?</h3>
            <p className="text-slate-500 text-sm mb-8">
              ¿Quieres eliminar esta clase? Si fue creada con Zoom, la reunión también se cancelará.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirm({show: false, id: null})}
                className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => deleteConfirm.id && handleDelete(deleteConfirm.id)}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
;

code = code.replace('<div className="p-8 max-w-7xl mx-auto min-h-screen">', '<div className="p-8 max-w-7xl mx-auto min-h-screen">\n' + modalsJSX);

fs.writeFileSync(file, code);
