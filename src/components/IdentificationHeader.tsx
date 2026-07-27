import React from 'react';
import { Property, CleanerInfo } from '../types';
import { Building2, User, Calendar, Clock, MapPin, Phone, Wifi, ShieldCheck } from 'lucide-react';

interface IdentificationHeaderProps {
  properties: Property[];
  selectedPropertyId: string;
  onSelectProperty: (propertyId: string) => void;
  inspectionDate: string;
  setInspectionDate: (date: string) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  cleanerInfo: CleanerInfo;
  setCleanerInfo: (info: CleanerInfo) => void;
  onOpenPropertyManager: () => void;
}

export const IdentificationHeader: React.FC<IdentificationHeaderProps> = ({
  properties,
  selectedPropertyId,
  onSelectProperty,
  inspectionDate,
  setInspectionDate,
  startTime,
  setStartTime,
  cleanerInfo,
  setCleanerInfo,
  onOpenPropertyManager,
}) => {
  const selectedProp = properties.find((p) => p.id === selectedPropertyId);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 mb-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Identificação do Imóvel e Serviço</h2>
            <p className="text-xs text-slate-500">Dados essenciais da higienização no celular</p>
          </div>
        </div>

        <button
          onClick={onOpenPropertyManager}
          className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl transition-colors min-h-[38px]"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Gerenciar Imóveis</span>
          <span className="sm:hidden">Imóveis</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Imóvel (Nome, Endereço Completo, Wi-Fi / Senha) */}
        <div className="space-y-2.5 bg-slate-50/90 p-3.5 rounded-xl border border-slate-200/70">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Nome do Imóvel</span>
          </label>

          <select
            value={selectedPropertyId}
            onChange={(e) => onSelectProperty(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500 min-h-[42px] shadow-xs"
          >
            {properties.map((prop) => (
              <option key={prop.id} value={prop.id}>
                {prop.name}
              </option>
            ))}
          </select>

          {selectedProp && (
            <div className="space-y-2 pt-1 text-xs text-slate-600">
              <div className="flex items-start space-x-1.5 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="font-medium text-xs leading-snug">{selectedProp.address}</span>
              </div>
              {selectedProp.wifiName && (
                <div className="flex items-center space-x-2 text-xs text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/80 font-medium">
                  <Wifi className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Wi-Fi: <strong>{selectedProp.wifiName}</strong> / Senha: <strong>{selectedProp.wifiPass || 'Sem senha'}</strong></span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Colaborador (Nome e Telefone) */}
        <div className="space-y-2.5 bg-slate-50/90 p-3.5 rounded-xl border border-slate-200/70">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Colaborador</span>
          </label>

          <div className="space-y-2">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Nome:</span>
              <input
                type="text"
                placeholder="Nome do Colaborador"
                value={cleanerInfo.name}
                onChange={(e) => setCleanerInfo({ ...cleanerInfo, name: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Telefone / WhatsApp:</span>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="(11) 99999-8888"
                  value={cleanerInfo.phone}
                  onChange={(e) => setCleanerInfo({ ...cleanerInfo, phone: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 min-h-[42px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data e Horário de Início */}
        <div className="space-y-2.5 bg-slate-50/90 p-3.5 rounded-xl border border-slate-200/70">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>Data e Horário de Início</span>
          </label>

          <div className="space-y-2">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Data:</span>
              <input
                type="date"
                value={inspectionDate}
                onChange={(e) => setInspectionDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 flex items-center space-x-1 mb-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Horário de Início:</span>
              </span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
