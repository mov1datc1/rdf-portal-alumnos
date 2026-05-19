import { FileText, Download, Search } from 'lucide-react';

export function Recursos() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#1D3A8A] rounded-3xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Biblioteca de Recursos</h1>
        <p className="text-blue-200 text-sm max-w-2xl">
          Encuentra todos los PDFs, guías de gramática y material de apoyo.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar materiales por nombre o tema..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D3A8A] transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((item) => (
            <div key={item} className="group border border-slate-200 rounded-2xl p-5 hover:border-blue-500 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-red-50 text-[#EF4444] rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 mb-1 group-hover:text-[#1D3A8A] transition-colors">Guía Gramatical B1</h3>
              <p className="text-xs text-slate-500 mb-4">Módulo 2 • 2.5 MB</p>
              <button className="flex items-center gap-2 text-sm font-semibold text-[#1D3A8A] bg-blue-50 w-full justify-center py-2 rounded-xl group-hover:bg-[#1D3A8A] group-hover:text-white transition-colors">
                <Download className="w-4 h-4" />
                Descargar PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
