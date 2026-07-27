import React, { useState } from 'react';
import { Property } from '../types';
import { Building2, X, Plus, Trash2, MapPin, Wifi } from 'lucide-react';
import { savePropertyCloud, deletePropertyCloud } from '../lib/firebase';

interface PropertyManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
}

export const PropertyManagerModal: React.FC<PropertyManagerModalProps> = ({
  isOpen,
  onClose,
  properties,
  setProperties,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [wifiName, setWifiName] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleAddProperty = async () => {
    if (!name.trim() || !address.trim()) return;

    setIsSaving(true);
    const newProp: Property = {
      id: `prop-${Date.now()}`,
      name: name.trim(),
      address: address.trim(),
      wifiName: wifiName.trim(),
      wifiPass: wifiPass.trim(),
    };

    try {
      await savePropertyCloud(newProp);
      setProperties((prev) => [...prev, newProp]);

      // Reset
      setName('');
      setAddress('');
      setWifiName('');
      setWifiPass('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Erro ao salvar imóvel no banco de dados:', err);
      alert('Ocorreu um erro ao salvar o imóvel na nuvem.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (properties.length <= 1) {
      alert('Você precisa ter ao menos um imóvel cadastrado no sistema.');
      return;
    }
    if (!confirm('Deseja realmente excluir este imóvel de todos os dispositivos?')) return;

    try {
      await deletePropertyCloud(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Erro ao excluir imóvel no banco de dados:', err);
      alert('Ocorreu um erro ao excluir o imóvel na nuvem.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Cadastro de Imóveis</h3>
              <p className="text-xs text-slate-500">
                Nome do Imóvel, Endereço e dados de Wi-Fi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {properties.length} Imóvel(is) Cadastrado(s)
            </span>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition-all min-h-[38px]"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Imóvel</span>
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300 space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Dados do Novo Imóvel</h4>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Nome do Imóvel/Ap:</label>
                <input
                  type="text"
                  placeholder="Ex: Apto 302 - Vista Mar Residence"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 min-h-[40px]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Endereço Completo:</label>
                <input
                  type="text"
                  placeholder="Rua, Número, Bairro, Cidade - Estado"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 min-h-[40px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Rede Wi-Fi (Nome):</label>
                  <input
                    type="text"
                    placeholder="Ex: Wi-Fi_Apto302"
                    value={wifiName}
                    onChange={(e) => setWifiName(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 min-h-[40px]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Senha do Wi-Fi:</label>
                  <input
                    type="text"
                    placeholder="Ex: temporada2026"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 min-h-[40px]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 min-h-[38px]"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddProperty}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 min-h-[38px]"
                >
                  Salvar Imóvel
                </button>
              </div>
            </div>
          )}

          {/* List of Registered Properties */}
          <div className="space-y-3">
            {properties.map((prop) => (
              <div key={prop.id} className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 flex justify-between items-center gap-3">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-800 text-sm">{prop.name}</h4>
                  <p className="text-xs text-slate-600 flex items-start space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{prop.address}</span>
                  </p>
                  {prop.wifiName && (
                    <p className="text-xs text-emerald-800 flex items-center space-x-1 pt-0.5 font-medium">
                      <Wifi className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Wi-Fi: <strong>{prop.wifiName}</strong> / Senha: <strong>{prop.wifiPass || 'Sem senha'}</strong></span>
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteProperty(prop.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center shrink-0"
                  title="Excluir imóvel"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 min-h-[40px]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
