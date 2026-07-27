import React, { useRef } from 'react';
import { InspectionReport } from '../types';
import {
  X,
  Printer,
  Send,
  CheckCircle2,
  Sparkles,
  Building2,
  User,
  Calendar,
  Clock,
  Package,
  Shirt,
  AlertTriangle,
  FileCheck,
  Share2,
} from 'lucide-react';
import { generateWhatsAppMessage, formatDateBR } from '../utils/helpers';

interface SummaryAndExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: InspectionReport;
  onFinalizeReport: (sentToOwner: boolean) => void;
}

export const SummaryAndExportModal: React.FC<SummaryAndExportModalProps> = ({
  isOpen,
  onClose,
  report,
  onFinalizeReport,
}) => {
  const printRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const text = generateWhatsAppMessage(report);
    const cleanerPhone = report.cleanerPhone ? report.cleanerPhone.replace(/\D/g, '') : '';
    const whatsappUrl = cleanerPhone ? `https://wa.me/${cleanerPhone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    onFinalizeReport(true);
  };

  const handleCopyText = () => {
    const text = generateWhatsAppMessage(report);
    navigator.clipboard.writeText(text);
    alert('Texto do relatório copiado para a área de transferência!');
  };

  const totalRooms = report.rooms.length;
  const completedRooms = report.rooms.filter((r) => r.completed).length;
  const totalLinenInstalled = report.linen.reduce((acc, l) => acc + l.quantityInstalled, 0);
  const lowStock = report.inventory.filter((i) => i.status === 'repor' || i.status === 'urgente');

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-auto shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-900 text-white rounded-t-3xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 rounded-xl font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Resumo do Relatório de Limpeza</h3>
              <p className="text-xs text-slate-400">Padrão Profissional de Imóvel de Temporada</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Printable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800" ref={printRef}>
          {/* Document Header Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-md border border-slate-800">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-700/80 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Relatório de Higienização
                </span>
                <h2 className="text-xl font-extrabold mt-1 text-white">{report.propertyName}</h2>
                <p className="text-xs text-slate-300 mt-1 flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{report.propertyAddress}</span>
                </p>
                {report.wifiName && (
                  <p className="text-xs text-emerald-300 font-semibold mt-1">
                    📶 Wi-Fi: {report.wifiName} (Senha: {report.wifiPass || 'Sem senha'})
                  </p>
                )}
              </div>

              <div className="text-left sm:text-right text-xs space-y-1 bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 w-full sm:w-auto">
                <p className="text-slate-200 flex items-center sm:justify-end space-x-1 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Data: <strong>{formatDateBR(report.inspectionDate)}</strong></span>
                </p>
                <p className="text-slate-200 flex items-center sm:justify-end space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Início: <strong>{report.startTime}</strong></span>
                </p>
                <p className="text-emerald-400 font-bold flex items-center sm:justify-end space-x-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Fim: <strong>{report.endTime || new Date().toTimeString().slice(0, 5)}</strong></span>
                </p>
              </div>
            </div>

            {/* Responsible Cleaner Info */}
            <div className="pt-3 flex items-center space-x-2 text-xs text-slate-300">
              <User className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Colaborador Responsável: <strong className="text-white">{report.cleanerName}</strong> ({report.cleanerPhone})</span>
            </div>
          </div>

          {/* Quick Metrics Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Ambientes</span>
              <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                {completedRooms}/{totalRooms} <span className="text-xs font-normal text-slate-500">Concluídos</span>
              </p>
            </div>

            <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200">
              <span className="text-[10px] font-bold text-purple-700 block uppercase">Enxoval Instalado</span>
              <p className="text-lg font-extrabold text-purple-900 mt-0.5">
                {totalLinenInstalled} <span className="text-xs font-normal text-purple-700">peças limpas</span>
              </p>
            </div>

            <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200">
              <span className="text-[10px] font-bold text-blue-700 block uppercase">Alertas de Estoque</span>
              <p className="text-lg font-extrabold text-blue-900 mt-0.5">
                {lowStock.length} <span className="text-xs font-normal text-blue-700">itens repor</span>
              </p>
            </div>

            <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200">
              <span className="text-[10px] font-bold text-rose-700 block uppercase">Avarias Identificadas</span>
              <p className="text-lg font-extrabold text-rose-900 mt-0.5">
                {report.damageReports.length} <span className="text-xs font-normal text-rose-700">ocorrências</span>
              </p>
            </div>
          </div>

          {/* Rooms Breakdown */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-2 border-b border-slate-200 pb-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Resumo dos Cômodos e Higienização</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.rooms.map((room) => {
                const okCount = room.items.filter((i) => i.status === 'ok' || i.status === 'na').length;
                const total = room.items.length;
                return (
                  <div key={room.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex justify-between items-center font-bold text-slate-800">
                      <span>{room.name}</span>
                      <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {okCount}/{total} OK
                      </span>
                    </div>

                    {room.photos.length > 0 && (
                      <div className="flex space-x-1 mt-2">
                        {room.photos.slice(0, 3).map((p, idx) => (
                          <img key={idx} src={p} alt="Room" className="w-10 h-10 object-cover rounded-md border border-slate-300" />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Damage Section in Summary if any */}
          {report.damageReports.length > 0 && (
            <div className="space-y-2 bg-rose-50 p-4 rounded-2xl border border-rose-200">
              <h4 className="font-bold text-rose-800 text-sm flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Ocorrências e Avarias Notificadas</span>
              </h4>

              <div className="space-y-2 text-xs">
                {report.damageReports.map((dmg, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-xl border border-rose-200">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{dmg.itemOrArea} ({dmg.roomName})</span>
                      <span className="text-rose-600 uppercase text-[10px]">{dmg.severity}</span>
                    </div>
                    <p className="text-slate-600 mt-1">{dmg.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signature Verification Block */}
          {report.signatureDataUrl && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Assinatura Digital Válida</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Assinado por <strong>{report.cleanerName}</strong> em {formatDateBR(report.inspectionDate)}
                </p>
              </div>

              <div className="bg-white p-2 rounded-xl border border-slate-300">
                <img src={report.signatureDataUrl} alt="Assinatura" className="h-12 object-contain" />
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 rounded-b-3xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleCopyText}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Share2 className="w-4 h-4 text-slate-600" />
              <span>Copiar Texto</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => onFinalizeReport(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors"
            >
              Salvar como Concluído
            </button>

            <button
              onClick={handleSendWhatsApp}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center space-x-2 transition-all transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Enviar WhatsApp ao Proprietário</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
