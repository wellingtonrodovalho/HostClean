import React, { useState } from 'react';
import { DamageReport, DamageSeverity } from '../types';
import { AlertTriangle, Plus, Trash2, Send, Camera, ShieldAlert, DollarSign, Image as ImageIcon } from 'lucide-react';
import { generateWhatsAppDamageAlert } from '../utils/helpers';

interface DamageSectionProps {
  damageReports: DamageReport[];
  setDamageReports: React.Dispatch<React.SetStateAction<DamageReport[]>>;
  roomNames: string[];
  reportContext: any; // For WhatsApp message formatting
}

export const DamageSection: React.FC<DamageSectionProps> = ({
  damageReports,
  setDamageReports,
  roomNames,
  reportContext,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [itemOrArea, setItemOrArea] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(roomNames[0] || 'Cozinha');
  const [severity, setSeverity] = useState<DamageSeverity>('media');
  const [description, setDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');

  const handleAddDamage = () => {
    if (!itemOrArea.trim() || !description.trim()) return;

    const newDamage: DamageReport = {
      id: `damage-${Date.now()}`,
      itemOrArea: itemOrArea.trim(),
      roomName: selectedRoom,
      severity,
      description: description.trim(),
      photos: photoUrl ? [photoUrl] : [],
      estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
      requiresImmediateNotice: severity === 'grave' || severity === 'media',
    };

    setDamageReports((prev) => [newDamage, ...prev]);

    // Reset form
    setItemOrArea('');
    setDescription('');
    setEstimatedCost('');
    setPhotoUrl('');
    setShowForm(false);
  };

  const handleRemoveDamage = (id: string) => {
    setDamageReports((prev) => prev.filter((d) => d.id !== id));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNotifyOwnerWhatsApp = (damage: DamageReport) => {
    const message = generateWhatsAppDamageAlert(reportContext, damage);
    const ownerPhone = reportContext.ownerPhone ? reportContext.ownerPhone.replace(/\D/g, '') : '';
    const whatsappUrl = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-800">Relatório de Avarias e Danos no Imóvel</h2>
              {damageReports.length > 0 && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-600 text-white">
                  {damageReports.length} avaria(s)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Registre itens quebrados, manchados, rasgados ou problemas de infraestrutura para notificação do proprietário.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Relatar Nova Avaria</span>
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="mt-5 p-5 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Cadastrar Ocorrência / Avaria Identificada</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Item / Equipamento Danificado:</label>
              <input
                type="text"
                placeholder="Ex: Copo de Cristal Quebrado, Cadeira Manchada"
                value={itemOrArea}
                onChange={(e) => setItemOrArea(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Ambiente / Cômodo:</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium"
              >
                {roomNames.map((r, idx) => (
                  <option key={idx} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Nível de Gravidade:</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as DamageSeverity)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-bold text-rose-800"
              >
                <option value="leve">ℹ️ Leve (Superficial)</option>
                <option value="media">⚠️ Média (Requer Atenção/Substituição)</option>
                <option value="grave">🚨 Grave (Urgente / Impede Hospedagem)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Descrição Detalhada do Problema:</label>
            <textarea
              rows={2}
              placeholder="Descreva o dano com precisão, marcas aparentes ou causas prováveis..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Estimativa de Valor / Custo (R$) (Opcional):
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="number"
                  placeholder="0,00"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-2 text-slate-800 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Foto da Avaria:</label>
              <div className="flex items-center space-x-2">
                <label className="cursor-pointer bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 shadow-2xs">
                  <Camera className="w-3.5 h-3.5 text-rose-600" />
                  <span>Anexar Foto</span>
                  <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="hidden" />
                </label>
                {photoUrl && (
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center space-x-1">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Foto carregada</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {photoUrl && (
            <div className="mt-2">
              <img src={photoUrl} alt="Avaria preview" className="w-24 h-24 object-cover rounded-xl border border-slate-300" />
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2 border-t border-rose-200/60">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddDamage}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs"
            >
              Salvar Registro de Avaria
            </button>
          </div>
        </div>
      )}

      {/* List of Registered Damages */}
      <div className="space-y-3 pt-5">
        {damageReports.length === 0 ? (
          <div className="text-center py-8 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm font-semibold text-slate-600">Nenhuma avaria registrada para este imóvel.</p>
            <p className="text-xs text-slate-400 mt-0.5">Se tudo estiver em ordem, continue para a assinatura digital.</p>
          </div>
        ) : (
          damageReports.map((dmg) => {
            return (
              <div
                key={dmg.id}
                className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3">
                  {dmg.photos.length > 0 ? (
                    <img
                      src={dmg.photos[0]}
                      alt="Dano"
                      className="w-16 h-16 object-cover rounded-xl border border-rose-300 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-rose-200 text-rose-800 rounded-xl flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-600 text-white">
                        {dmg.severity}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{dmg.itemOrArea}</span>
                      <span className="text-xs text-slate-500">({dmg.roomName})</span>
                    </div>

                    <p className="text-xs text-slate-700 mt-1">{dmg.description}</p>

                    {dmg.estimatedCost && (
                      <p className="text-xs font-extrabold text-slate-900 mt-1">
                        Custo Estimado: R$ {dmg.estimatedCost.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleNotifyOwnerWhatsApp(dmg)}
                    className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-xs transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Notificar via WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handleRemoveDamage(dmg.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
