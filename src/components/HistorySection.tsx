import React, { useState } from 'react';
import { InspectionReport } from '../types';
import {
  History,
  Building2,
  Calendar,
  User,
  CheckCircle2,
  Send,
  Eye,
  Trash2,
  Share2,
  Search,
  Printer,
  Sparkles,
} from 'lucide-react';
import { formatDateBR, generateWhatsAppMessage } from '../utils/helpers';

interface HistorySectionProps {
  reportsHistory: InspectionReport[];
  onViewReport: (report: InspectionReport) => void;
  onDeleteReport: (id: string) => void;
  onReopenReport: (report: InspectionReport) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  reportsHistory,
  onViewReport,
  onDeleteReport,
  onReopenReport,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredHistory = reportsHistory.filter((rep) => {
    const matchesSearch =
      rep.propertyName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rep.cleanerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rep.propertyAddress.toLowerCase().includes(searchFilter.toLowerCase());

    if (statusFilter === 'todos') return matchesSearch;
    return matchesSearch && rep.status === statusFilter;
  });

  const handleShareWhatsApp = (report: InspectionReport) => {
    const msg = generateWhatsAppMessage(report);
    const cleanerPhone = report.cleanerPhone ? report.cleanerPhone.replace(/\D/g, '') : '';
    const url = cleanerPhone ? `https://wa.me/${cleanerPhone}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 mb-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-900 text-emerald-400 rounded-xl">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Histórico de Limpezas e Vistorias</h2>
            <p className="text-xs text-slate-500">
              {reportsHistory.length} relatório(s) arquivado(s) e registrados no sistema.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por imóvel ou colaborador..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 w-48 sm:w-60"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-semibold text-slate-700"
          >
            <option value="todos">Todos os Status</option>
            <option value="concluido">Concluídos</option>
            <option value="enviado_proprietario">Enviados ao Proprietário</option>
            <option value="em_andamento">Em Andamento</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3.5 pt-5">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">Nenhum relatório encontrado no histórico.</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Conclua um checklist de limpeza para salvar e visualizar os dados aqui.
            </p>
          </div>
        ) : (
          filteredHistory.map((rep) => {
            const isSent = rep.status === 'enviado_proprietario';
            const isDone = rep.status === 'concluido';

            return (
              <div
                key={rep.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        isSent
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : isDone
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {isSent ? '✓ Enviado ao Proprietário' : isDone ? '✓ Concluído' : '⏳ Em Andamento'}
                    </span>

                    <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">{rep.propertyName}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                    <span className="flex items-center space-x-1 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Data: {formatDateBR(rep.inspectionDate)}</span>
                    </span>

                    <span className="flex items-center space-x-1">
                      <span className="font-bold text-slate-700">Horário:</span>
                      <span>Início {rep.startTime}{rep.endTime ? ` | Fim ${rep.endTime}` : ''}</span>
                    </span>

                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rep.cleanerName} ({rep.cleanerPhone})</span>
                    </span>

                    {rep.damageReports.length > 0 && (
                      <span className="text-rose-600 font-bold">
                        ⚠️ {rep.damageReports.length} avaria(s)
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => onViewReport(rep)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>Visualizar</span>
                  </button>

                  <button
                    onClick={() => handleShareWhatsApp(rep)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                    title="Reenviar por WhatsApp"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>

                  <button
                    onClick={() => onDeleteReport(rep.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Excluir do histórico"
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
