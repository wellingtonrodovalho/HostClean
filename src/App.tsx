import React, { useState, useEffect } from 'react';
import {
  InspectionReport,
  Property,
  CleanerInfo,
  RoomChecklist,
  InventoryItem,
  LinenItem,
  DamageReport,
} from './types';
import {
  INITIAL_PROPERTIES,
  DEFAULT_ROOM_TEMPLATES,
  DEFAULT_INVENTORY_ITEMS,
  DEFAULT_LINEN_ITEMS,
} from './data/defaultTemplates';
import {
  LOCAL_STORAGE_KEY_CURRENT,
  LOCAL_STORAGE_KEY_HISTORY,
  LOCAL_STORAGE_KEY_PROPERTIES,
} from './utils/helpers';

import { HeaderNavbar } from './components/HeaderNavbar';
import { IdentificationHeader } from './components/IdentificationHeader';
import { RoomChecklistSection } from './components/RoomChecklistSection';
import { InventorySection } from './components/InventorySection';
import { LinenSection } from './components/LinenSection';
import { DamageSection } from './components/DamageSection';
import { DigitalSignaturePad } from './components/DigitalSignaturePad';
import { PhotoGalleryModal } from './components/PhotoGalleryModal';
import { SummaryAndExportModal } from './components/SummaryAndExportModal';
import { HistorySection } from './components/HistorySection';
import { PropertyManagerModal } from './components/PropertyManagerModal';

import { CheckCircle2, Send, Sparkles, AlertTriangle, ShieldCheck, FileCheck } from 'lucide-react';

export default function App() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'active_checklist' | 'history' | 'properties'>('active_checklist');

  // Properties State
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PROPERTIES);
      return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
    } catch {
      return INITIAL_PROPERTIES;
    }
  });

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(() => {
    return properties[0]?.id || 'prop-1';
  });

  // Today's Date & Time defaults
  const todayIso = new Date().toISOString().split('T')[0];
  const nowTime = new Date().toTimeString().slice(0, 5);

  const [inspectionDate, setInspectionDate] = useState<string>(todayIso);
  const [startTime, setStartTime] = useState<string>(nowTime);

  // Responsible Cleaner Info
  const [cleanerInfo, setCleanerInfo] = useState<CleanerInfo>({
    name: 'Ana Cláudia Silva',
    phone: '5511998877665',
  });

  // Rooms Checklist State
  const [rooms, setRooms] = useState<RoomChecklist[]>(() => {
    return DEFAULT_ROOM_TEMPLATES.map((tmpl) => ({
      ...tmpl,
      completed: false,
    }));
  });

  // Inventory State
  const [inventory, setInventory] = useState<InventoryItem[]>(DEFAULT_INVENTORY_ITEMS);

  // Linen State
  const [linen, setLinen] = useState<LinenItem[]>(DEFAULT_LINEN_ITEMS);

  // Damage Reports State
  const [damageReports, setDamageReports] = useState<DamageReport[]>([]);

  // Signature State
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | undefined>();

  // Reports History State
  const [reportsHistory, setReportsHistory] = useState<InspectionReport[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals
  const [photoModalRoomIndex, setPhotoModalRoomIndex] = useState<number | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showPropertyManagerModal, setShowPropertyManagerModal] = useState(false);
  const [viewingHistoryReport, setViewingHistoryReport] = useState<InspectionReport | null>(null);

  // Sync properties to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PROPERTIES, JSON.stringify(properties));
    } catch (e) {
      console.error(e);
    }
  }, [properties]);

  // Sync reportsHistory to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_HISTORY, JSON.stringify(reportsHistory));
    } catch (e) {
      console.error(e);
    }
  }, [reportsHistory]);

  const activeProp = properties.find((p) => p.id === selectedPropertyId) || properties[0];

  // Helper to start new clean
  const handleStartNewChecklist = () => {
    if (confirm('Deseja iniciar um novo checklist de limpeza? Os dados atuais não salvos serão redefinidos.')) {
      setRooms(
        DEFAULT_ROOM_TEMPLATES.map((tmpl) => ({
          ...tmpl,
          completed: false,
        }))
      );
      setInventory(DEFAULT_INVENTORY_ITEMS);
      setLinen(DEFAULT_LINEN_ITEMS);
      setDamageReports([]);
      setSignatureDataUrl(undefined);
      setStartTime(new Date().toTimeString().slice(0, 5));
      setActiveTab('active_checklist');
    }
  };

  // Quick add damage from room item click
  const handleAddDamageQuick = (roomName: string, itemDescription: string) => {
    const newDamage: DamageReport = {
      id: `damage-quick-${Date.now()}`,
      itemOrArea: itemDescription,
      roomName,
      severity: 'media',
      description: `Identificado durante a vistoria de ${roomName}. Requer atenção do proprietário.`,
      photos: [],
      requiresImmediateNotice: true,
    };
    setDamageReports((prev) => [newDamage, ...prev]);
  };

  // Photos management for rooms
  const handleAddPhotoToRoom = (roomIdx: number, photoUrl: string) => {
    setRooms((prev) => {
      const next = [...prev];
      const room = { ...next[roomIdx] };
      room.photos = [...room.photos, photoUrl];
      next[roomIdx] = room;
      return next;
    });
  };

  const handleRemovePhotoFromRoom = (roomIdx: number, photoIdx: number) => {
    setRooms((prev) => {
      const next = [...prev];
      const room = { ...next[roomIdx] };
      room.photos = room.photos.filter((_, i) => i !== photoIdx);
      next[roomIdx] = room;
      return next;
    });
  };

  // Current report assembly
  const currentReport: InspectionReport = {
    id: `rep-${Date.now()}`,
    propertyId: activeProp?.id || 'prop-1',
    propertyName: activeProp?.name || 'Imóvel sem nome',
    propertyAddress: activeProp?.address || 'Endereço não informado',
    wifiName: activeProp?.wifiName,
    wifiPass: activeProp?.wifiPass,
    inspectionDate,
    startTime,
    cleanerName: cleanerInfo.name,
    cleanerPhone: cleanerInfo.phone,
    rooms,
    inventory,
    linen,
    damageReports,
    generalPhotos: [],
    signatureDataUrl,
    signatureTimestamp: signatureDataUrl ? new Date().toISOString() : undefined,
    status: 'em_andamento',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Calculate overall progress percentage
  const totalChecklistItems = rooms.reduce((acc, r) => acc + r.items.length, 0);
  const okChecklistItems = rooms.reduce(
    (acc, r) => acc + r.items.filter((i) => i.status === 'ok' || i.status === 'na').length,
    0
  );
  const completionPercentage =
    totalChecklistItems > 0 ? Math.round((okChecklistItems / totalChecklistItems) * 100) : 0;

  // Finalize report handler
  const handleFinalizeReport = (sentToOwner: boolean) => {
    const finalReport: InspectionReport = {
      ...currentReport,
      status: sentToOwner ? 'enviado_proprietario' : 'concluido',
      endTime: new Date().toTimeString().slice(0, 5),
    };

    setReportsHistory((prev) => [finalReport, ...prev]);
    setShowSummaryModal(false);
    alert('Relatório de limpeza finalizado e salvo com sucesso no histórico!');
    setActiveTab('history');
  };

  const handleDeleteHistoryReport = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este relatório do histórico?')) {
      setReportsHistory((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <HeaderNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewChecklistClick={handleStartNewChecklist}
        activePropertyName={activeProp?.name}
        isReportInProgress={true}
        completionPercentage={completionPercentage}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 sm:pb-8">
        {activeTab === 'active_checklist' && (
          <div className="space-y-5">
            {/* Header Identification */}
            <IdentificationHeader
              properties={properties}
              selectedPropertyId={selectedPropertyId}
              onSelectProperty={setSelectedPropertyId}
              inspectionDate={inspectionDate}
              setInspectionDate={setInspectionDate}
              startTime={startTime}
              setStartTime={setStartTime}
              cleanerInfo={cleanerInfo}
              setCleanerInfo={setCleanerInfo}
              onOpenPropertyManager={() => setShowPropertyManagerModal(true)}
            />

            {/* Room by Room Inspection */}
            <RoomChecklistSection
              rooms={rooms}
              setRooms={setRooms}
              onAddDamageQuick={handleAddDamageQuick}
              onOpenPhotoModal={(roomIdx) => setPhotoModalRoomIndex(roomIdx)}
            />

            {/* Inventory & Amenities Tracker */}
            <InventorySection inventory={inventory} setInventory={setInventory} />

            {/* Linen & Towels Management */}
            <LinenSection linen={linen} setLinen={setLinen} />

            {/* Damage & Incident Reports */}
            <DamageSection
              damageReports={damageReports}
              setDamageReports={setDamageReports}
              roomNames={rooms.map((r) => r.name)}
              reportContext={currentReport}
            />

            {/* Digital Signature Pad */}
            <DigitalSignaturePad
              signerName={cleanerInfo.name}
              signatureDataUrl={signatureDataUrl}
              onSaveSignature={(dataUrl) => setSignatureDataUrl(dataUrl)}
              onClearSignature={() => setSignatureDataUrl(undefined)}
            />

            {/* Bottom Finalize Floating Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                  <h3 className="font-extrabold text-base sm:text-lg">Finalizar e Emitir Relatório</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Gera o relatório com fotos, horários (início e fim) e assinatura digital do colaborador.
                </p>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowSummaryModal(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-extrabold px-6 py-3.5 rounded-2xl shadow-lg flex items-center justify-center space-x-2 transition-all transform active:scale-95 text-sm min-h-[48px]"
                >
                  <FileCheck className="w-5 h-5" />
                  <span>Concluir e Ver Relatório</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <HistorySection
            reportsHistory={reportsHistory}
            onViewReport={(rep) => {
              setViewingHistoryReport(rep);
            }}
            onDeleteReport={handleDeleteHistoryReport}
            onReopenReport={(rep) => {
              setSelectedPropertyId(rep.propertyId);
              setInspectionDate(rep.inspectionDate);
              setStartTime(rep.startTime);
              setCleanerInfo({
                name: rep.cleanerName,
                phone: rep.cleanerPhone,
              });
              setRooms(rep.rooms);
              setInventory(rep.inventory);
              setLinen(rep.linen);
              setDamageReports(rep.damageReports);
              setSignatureDataUrl(rep.signatureDataUrl);
              setActiveTab('active_checklist');
            }}
          />
        )}

        {/* Properties Manager Tab */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Gestão dos Imóveis de Temporada</h2>
            <PropertyManagerModal
              isOpen={true}
              onClose={() => setActiveTab('active_checklist')}
              properties={properties}
              setProperties={setProperties}
            />
          </div>
        )}
      </main>

      {/* Mobile Sticky Bottom Action Bar for Cell Phone Users */}
      {activeTab === 'active_checklist' && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 sm:hidden z-40 flex items-center justify-between shadow-2xl">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Progresso Limpeza</span>
            <span className="text-sm font-extrabold text-emerald-400">{completionPercentage}% Concluído</span>
          </div>

          <button
            onClick={() => setShowSummaryModal(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl shadow-md text-xs flex items-center space-x-1.5 active:scale-95 transition-all min-h-[44px]"
          >
            <FileCheck className="w-4 h-4" />
            <span>Finalizar Checklist</span>
          </button>
        </div>
      )}

      {/* Photo Gallery Modal */}
      {photoModalRoomIndex !== null && rooms[photoModalRoomIndex] && (
        <PhotoGalleryModal
          isOpen={true}
          onClose={() => setPhotoModalRoomIndex(null)}
          roomName={rooms[photoModalRoomIndex].name}
          photos={rooms[photoModalRoomIndex].photos}
          onAddPhoto={(url) => handleAddPhotoToRoom(photoModalRoomIndex, url)}
          onRemovePhoto={(pIdx) => handleRemovePhotoFromRoom(photoModalRoomIndex, pIdx)}
        />
      )}

      {/* Summary & Export Modal */}
      <SummaryAndExportModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        report={currentReport}
        onFinalizeReport={handleFinalizeReport}
      />

      {/* Viewing History Report Modal */}
      {viewingHistoryReport && (
        <SummaryAndExportModal
          isOpen={true}
          onClose={() => setViewingHistoryReport(null)}
          report={viewingHistoryReport}
          onFinalizeReport={() => setViewingHistoryReport(null)}
        />
      )}

      {/* Property Manager Modal trigger */}
      {showPropertyManagerModal && (
        <PropertyManagerModal
          isOpen={showPropertyManagerModal}
          onClose={() => setShowPropertyManagerModal(false)}
          properties={properties}
          setProperties={setProperties}
        />
      )}
    </div>
  );
}
