import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { Package, AlertTriangle, Plus, CheckCircle2, ShieldAlert, Sparkles, Coffee, Bath, Utensils, Brush } from 'lucide-react';

interface InventorySectionProps {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

export const InventorySection: React.FC<InventorySectionProps> = ({ inventory, setInventory }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'banheiro' | 'cozinha' | 'boas_vindas' | 'limpeza'>('banheiro');
  const [newItemMin, setNewItemMin] = useState(2);
  const [newItemUnit, setNewItemUnit] = useState('unidades');

  const updateQty = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextQty = Math.max(0, item.currentQty + delta);
          let nextStatus: 'suficiente' | 'repor' | 'urgente' = 'suficiente';
          if (nextQty === 0) nextStatus = 'urgente';
          else if (nextQty < item.minimumQty) nextStatus = 'repor';

          return { ...item, currentQty: nextQty, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const newItem: InventoryItem = {
      id: `inv-custom-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      currentQty: newItemMin,
      minimumQty: newItemMin,
      unit: newItemUnit.trim() || 'unidades',
      status: 'suficiente',
    };

    setInventory((prev) => [...prev, newItem]);
    setNewItemName('');
  };

  const filteredItems = inventory.filter((item) => {
    if (selectedCategory === 'todos') return true;
    return item.category === selectedCategory;
  });

  const lowStockCount = inventory.filter((i) => i.status === 'repor' || i.status === 'urgente').length;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'banheiro':
        return <Bath className="w-3.5 h-3.5" />;
      case 'cozinha':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'boas_vindas':
        return <Coffee className="w-3.5 h-3.5" />;
      case 'limpeza':
        return <Brush className="w-3.5 h-3.5" />;
      default:
        return <Package className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 mb-6">
      {/* Title & Badge Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-800">Verificação de Estoque e Amenities</h2>
              {lowStockCount > 0 && (
                <span className="flex items-center space-x-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{lowStockCount} repor</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Controle de suprimentos do imóvel (sacos de lixo, papel higiênico, sachês, produtos de limpeza)
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'banheiro', label: 'Banheiro' },
            { id: 'cozinha', label: 'Cozinha' },
            { id: 'boas_vindas', label: 'Boas-Vindas' },
            { id: 'limpeza', label: 'Limpeza' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-5">
        {filteredItems.map((item) => {
          const isUrgent = item.status === 'urgente';
          const isLow = item.status === 'repor';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                isUrgent
                  ? 'bg-rose-50/80 border-rose-300'
                  : isLow
                  ? 'bg-amber-50/80 border-amber-300'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                    isUrgent
                      ? 'bg-rose-200 text-rose-800'
                      : isLow
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {getCategoryIcon(item.category)}
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 text-xs sm:text-sm">{item.name}</h4>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                    <span>Mínimo exigido: <strong>{item.minimumQty} {item.unit}</strong></span>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-1.5">
                    {isUrgent && (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white">
                        <ShieldAlert className="w-3 h-3" />
                        <span>ESTOQUE ZERADO</span>
                      </span>
                    )}
                    {isLow && (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-600 text-white">
                        <AlertTriangle className="w-3 h-3" />
                        <span>NECESSITA REPOSIÇÃO</span>
                      </span>
                    )}
                    {!isUrgent && !isLow && (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Suficiente</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Counter Controls */}
              <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs shrink-0">
                <button
                  onClick={() => updateQty(item.id, -1)}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center transition-colors active:scale-95"
                >
                  -
                </button>
                <span className="w-8 text-center font-extrabold text-sm text-slate-800">{item.currentQty}</span>
                <button
                  onClick={() => updateQty(item.id, 1)}
                  className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center transition-colors active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Stock Item */}
      <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Cadastrar Novo Item de Suprimento</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="Nome do item (ex: Cápsula Três Corações)"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="sm:col-span-2 text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value as any)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 font-medium"
          >
            <option value="banheiro">Banheiro</option>
            <option value="cozinha">Cozinha</option>
            <option value="boas_vindas">Boas-Vindas</option>
            <option value="limpeza">Limpeza</option>
          </select>

          <button
            onClick={handleAddItem}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-lg text-xs flex items-center justify-center space-x-1 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar ao Estoque</span>
          </button>
        </div>
      </div>
    </div>
  );
};
