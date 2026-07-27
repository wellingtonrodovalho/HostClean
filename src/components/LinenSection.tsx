import React from 'react';
import { LinenItem } from '../types';
import { Shirt, CheckCircle2, AlertOctagon, Sparkles, Plus, AlertTriangle } from 'lucide-react';

interface LinenSectionProps {
  linen: LinenItem[];
  setLinen: React.Dispatch<React.SetStateAction<LinenItem[]>>;
}

export const LinenSection: React.FC<LinenSectionProps> = ({ linen, setLinen }) => {
  const updateLinenCount = (
    id: string,
    field: 'quantityInstalled' | 'quantityLaundry' | 'stainedOrDamagedQty',
    delta: number
  ) => {
    setLinen((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const currentVal = item[field];
          const nextVal = Math.max(0, currentVal + delta);
          return { ...item, [field]: nextVal };
        }
        return item;
      })
    );
  };

  const updateCondition = (id: string, condition: 'excelente' | 'bom' | 'requer_substituicao') => {
    setLinen((prev) =>
      prev.map((item) => (item.id === id ? { ...item, condition } : item))
    );
  };

  const updateNotes = (id: string, notes: string) => {
    setLinen((prev) => prev.map((item) => (item.id === id ? { ...item, notes } : item)));
  };

  const totalInstalled = linen.reduce((acc, l) => acc + l.quantityInstalled, 0);
  const totalDamaged = linen.reduce((acc, l) => acc + l.stainedOrDamagedQty, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
            <Shirt className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-800">Higienização de Roupas de Cama e Toalhas</h2>
              {totalDamaged > 0 && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center space-x-1">
                  <AlertOctagon className="w-3 h-3 text-rose-600" />
                  <span>{totalDamaged} danificados/manchados</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Controle de jogos de cama, toalhas de banho/rosto, protetores e envio para lavanderia.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 text-xs font-semibold text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Total instalado limpo: <strong className="text-slate-900">{totalInstalled} peças</strong></span>
        </div>
      </div>

      {/* Linen List */}
      <div className="space-y-3.5 pt-5">
        {linen.map((item) => {
          const hasStained = item.stainedOrDamagedQty > 0;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                hasStained ? 'bg-rose-50/60 border-rose-300' : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Item Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded uppercase">
                      {item.category.replace('_', ' ')}
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                  </div>

                  <input
                    type="text"
                    placeholder="Observações do enxoval (ex: guardado na gaveta da suíte)"
                    value={item.notes || ''}
                    onChange={(e) => updateNotes(item.id, e.target.value)}
                    className="mt-2 text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 w-full max-w-md focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                {/* Counters for Installed, Laundry, Stained */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
                  {/* Clean & Installed */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-emerald-700 block uppercase">Instalado Limpo</span>
                    <div className="flex items-center justify-center space-x-2 mt-1">
                      <button
                        onClick={() => updateLinenCount(item.id, 'quantityInstalled', -1)}
                        className="w-6 h-6 rounded bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-sm text-slate-900 w-6">{item.quantityInstalled}</span>
                      <button
                        onClick={() => updateLinenCount(item.id, 'quantityInstalled', 1)}
                        className="w-6 h-6 rounded bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Sent to Laundry */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-600 block uppercase">P/ Lavanderia</span>
                    <div className="flex items-center justify-center space-x-2 mt-1">
                      <button
                        onClick={() => updateLinenCount(item.id, 'quantityLaundry', -1)}
                        className="w-6 h-6 rounded bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-sm text-slate-900 w-6">{item.quantityLaundry}</span>
                      <button
                        onClick={() => updateLinenCount(item.id, 'quantityLaundry', 1)}
                        className="w-6 h-6 rounded bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Stained / Damaged */}
                  <div className={`p-2.5 rounded-xl border text-center ${hasStained ? 'bg-rose-100 border-rose-300' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] font-bold text-rose-700 block uppercase">Manchado / Danificado</span>
                    <div className="flex items-center justify-center space-x-2 mt-1">
                      <button
                        onClick={() => updateLinenCount(item.id, 'stainedOrDamagedQty', -1)}
                        className="w-6 h-6 rounded bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-sm text-rose-900 w-6">{item.stainedOrDamagedQty}</span>
                      <button
                        onClick={() => updateLinenCount(item.id, 'stainedOrDamagedQty', 1)}
                        className="w-6 h-6 rounded bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
