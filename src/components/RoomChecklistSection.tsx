import React, { useState } from 'react';
import { RoomChecklist, ItemStatus, ChecklistItem } from '../types';
import {
  UtensilsCrossed,
  Tv,
  BedDouble,
  Bath,
  Sun,
  Shirt,
  Plus,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Camera,
  MessageSquare,
  Sparkles,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';

interface RoomChecklistSectionProps {
  rooms: RoomChecklist[];
  setRooms: React.Dispatch<React.SetStateAction<RoomChecklist[]>>;
  onAddDamageQuick: (roomName: string, itemDescription: string) => void;
  onOpenPhotoModal: (roomIndex: number) => void;
}

export const RoomChecklistSection: React.FC<RoomChecklistSectionProps> = ({
  rooms,
  setRooms,
  onAddDamageQuick,
  onOpenPhotoModal,
}) => {
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);

  const activeRoom = rooms[activeRoomIndex] || rooms[0];

  // Helper for room icon
  const getRoomIcon = (iconName: string) => {
    switch (iconName) {
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-4 h-4" />;
      case 'Tv':
        return <Tv className="w-4 h-4" />;
      case 'BedDouble':
        return <BedDouble className="w-4 h-4" />;
      case 'Bath':
        return <Bath className="w-4 h-4" />;
      case 'Sun':
        return <Sun className="w-4 h-4" />;
      case 'Shirt':
        return <Shirt className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const handleStatusChange = (roomIdx: number, itemId: string, status: ItemStatus) => {
    setRooms((prev) => {
      const next = [...prev];
      const room = { ...next[roomIdx] };
      const items = room.items.map((item) => {
        if (item.id === itemId) {
          return { ...item, status };
        }
        return item;
      });
      room.items = items;

      // Auto check if all items are addressed (ok, attention, na)
      const allDone = items.every((i) => i.status !== 'attention' || i.notes !== undefined);
      room.completed = allDone;

      next[roomIdx] = room;
      return next;
    });

    if (status === 'damaged') {
      const item = activeRoom.items.find((i) => i.id === itemId);
      if (item) {
        onAddDamageQuick(activeRoom.name, item.label);
      }
    }
  };

  const handleNotesChange = (roomIdx: number, itemId: string, notes: string) => {
    setRooms((prev) => {
      const next = [...prev];
      const room = { ...next[roomIdx] };
      room.items = room.items.map((item) => (item.id === itemId ? { ...item, notes } : item));
      next[roomIdx] = room;
      return next;
    });
  };

  const handleAddItem = () => {
    if (!newItemLabel.trim()) return;
    const newItem: ChecklistItem = {
      id: `custom-item-${Date.now()}`,
      label: newItemLabel.trim(),
      status: 'ok',
    };

    setRooms((prev) => {
      const next = [...prev];
      const room = { ...next[activeRoomIndex] };
      room.items = [...room.items, newItem];
      next[activeRoomIndex] = room;
      return next;
    });

    setNewItemLabel('');
  };

  const handleAddRoom = () => {
    if (!newRoomName.trim()) return;
    const newRoom: RoomChecklist = {
      id: `room-custom-${Date.now()}`,
      name: newRoomName.trim(),
      iconName: 'Sparkles',
      completed: false,
      photos: [],
      items: [
        { id: `item-c1-${Date.now()}`, label: 'Limpeza geral das superfícies e móveis', status: 'ok' },
        { id: `item-c2-${Date.now()}`, label: 'Verificação de lixeiras e organização', status: 'ok' },
      ],
    };

    setRooms((prev) => [...prev, newRoom]);
    setActiveRoomIndex(rooms.length);
    setNewRoomName('');
    setShowAddRoomModal(false);
  };

  const handleRemoveItem = (itemId: string) => {
    setRooms((prev) => {
      const next = [...prev];
      const room = { ...next[activeRoomIndex] };
      room.items = room.items.filter((i) => i.id !== itemId);
      next[activeRoomIndex] = room;
      return next;
    });
  };

  // Overall progress
  const totalItemsCount = rooms.reduce((acc, r) => acc + r.items.length, 0);
  const okItemsCount = rooms.reduce(
    (acc, r) => acc + r.items.filter((i) => i.status === 'ok' || i.status === 'na').length,
    0
  );
  const progressPercent = totalItemsCount > 0 ? Math.round((okItemsCount / totalItemsCount) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 mb-6">
      {/* Title & Overall Progress Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-slate-800">Verificação de Ambientes (Cômodos)</h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {okItemsCount} de {totalItemsCount} ok
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspecione item por item. Marque conforme, grave observações e anexe fotos do ambiente.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-64 bg-slate-100 rounded-xl p-3 border border-slate-200/60">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
            <span>Progresso da Higienização</span>
            <span className="text-emerald-700">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Room Tabs Scrollable Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto py-4 scrollbar-none border-b border-slate-100">
        {rooms.map((room, idx) => {
          const roomOkCount = room.items.filter((i) => i.status === 'ok' || i.status === 'na').length;
          const roomHasIssues = room.items.some((i) => i.status === 'damaged' || i.status === 'attention');
          const isActive = idx === activeRoomIndex;

          return (
            <button
              key={room.id}
              onClick={() => setActiveRoomIndex(idx)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/30'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span className={isActive ? 'text-emerald-400' : 'text-slate-500'}>
                {getRoomIcon(room.iconName)}
              </span>
              <span>{room.name}</span>

              {roomHasIssues ? (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              ) : roomOkCount === room.items.length && room.items.length > 0 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span className="text-[10px] opacity-75 font-normal">
                  ({roomOkCount}/{room.items.length})
                </span>
              )}
            </button>
          );
        })}

        <button
          onClick={() => setShowAddRoomModal(true)}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Cômodo</span>
        </button>
      </div>

      {/* Active Room Content */}
      {activeRoom && (
        <div className="pt-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-slate-900 text-emerald-400 rounded-lg">
                {getRoomIcon(activeRoom.iconName)}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">{activeRoom.name}</h3>
                <p className="text-xs text-slate-500">
                  {activeRoom.items.length} itens no checklist do cômodo • {activeRoom.photos.length} fotos anexadas
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenPhotoModal(activeRoomIndex)}
                className="flex items-center space-x-1.5 bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 font-semibold px-3 py-1.5 rounded-lg text-xs shadow-2xs transition-all"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fotos do Cômodo ({activeRoom.photos.length})</span>
              </button>
            </div>
          </div>

          {/* Photos Thumbnails preview if any */}
          {activeRoom.photos.length > 0 && (
            <div className="flex items-center space-x-2 overflow-x-auto py-2">
              {activeRoom.photos.map((photo, pIdx) => (
                <div key={pIdx} className="relative group shrink-0">
                  <img
                    src={photo}
                    alt={`Foto ${pIdx + 1}`}
                    className="w-16 h-16 object-cover rounded-lg border border-slate-200 shadow-2xs"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-1">
                    <button
                      onClick={() => onOpenPhotoModal(activeRoomIndex)}
                      className="p-1 bg-white rounded-full text-slate-800"
                    >
                      <ImageIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Checklist Items List */}
          <div className="space-y-2.5 mt-2">
            {activeRoom.items.map((item) => {
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    item.status === 'damaged'
                      ? 'bg-rose-50/70 border-rose-200'
                      : item.status === 'attention'
                      ? 'bg-amber-50/70 border-amber-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="mt-0.5 shrink-0">
                        {item.status === 'ok' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                        {item.status === 'attention' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                        {item.status === 'damaged' && <XCircle className="w-5 h-5 text-rose-600" />}
                        {item.status === 'na' && <HelpCircle className="w-5 h-5 text-slate-400" />}
                      </div>

                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium text-slate-800 leading-snug">{item.label}</p>

                        {/* Item note if added */}
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder="Observação (opcional, ex: marcas leves de desgaste)"
                            value={item.notes || ''}
                            onChange={(e) => handleNotesChange(activeRoomIndex, item.id, e.target.value)}
                            className="w-full text-xs bg-slate-50/80 border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 placeholder:text-slate-400 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Status Buttons */}
                    <div className="grid grid-cols-4 sm:flex sm:items-center gap-1.5 shrink-0 w-full sm:w-auto mt-2.5 sm:mt-0">
                      <button
                        onClick={() => handleStatusChange(activeRoomIndex, item.id, 'ok')}
                        className={`py-2 sm:py-1 px-2 rounded-xl sm:rounded-lg text-xs font-bold transition-all border flex items-center justify-center min-h-[38px] sm:min-h-[32px] ${
                          item.status === 'ok'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-100 text-slate-700 border-slate-200 active:bg-slate-200'
                        }`}
                        title="Conforme / Limpo"
                      >
                        ✅ OK
                      </button>

                      <button
                        onClick={() => handleStatusChange(activeRoomIndex, item.id, 'attention')}
                        className={`py-2 sm:py-1 px-2 rounded-xl sm:rounded-lg text-xs font-bold transition-all border flex items-center justify-center min-h-[38px] sm:min-h-[32px] ${
                          item.status === 'attention'
                            ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                            : 'bg-slate-100 text-slate-700 border-slate-200 active:bg-slate-200'
                        }`}
                        title="Atenção / Ressalva"
                      >
                        ⚠️ Atenção
                      </button>

                      <button
                        onClick={() => handleStatusChange(activeRoomIndex, item.id, 'damaged')}
                        className={`py-2 sm:py-1 px-2 rounded-xl sm:rounded-lg text-xs font-bold transition-all border flex items-center justify-center min-h-[38px] sm:min-h-[32px] ${
                          item.status === 'damaged'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-slate-100 text-slate-700 border-slate-200 active:bg-slate-200'
                        }`}
                        title="Avaria / Danificado"
                      >
                        ❌ Avaria
                      </button>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleStatusChange(activeRoomIndex, item.id, 'na')}
                          className={`flex-1 py-2 sm:py-1 px-2 rounded-xl sm:rounded-lg text-xs font-bold transition-all border flex items-center justify-center min-h-[38px] sm:min-h-[32px] ${
                            item.status === 'na'
                              ? 'bg-slate-700 text-white border-slate-700'
                              : 'bg-slate-100 text-slate-500 border-slate-200 active:bg-slate-200'
                          }`}
                          title="Não se aplica"
                        >
                          N/A
                        </button>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                          title="Remover este item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add custom item form */}
          <div className="flex items-center space-x-2 pt-3">
            <input
              type="text"
              placeholder={`Adicionar item personalizado para ${activeRoom.name}...`}
              value={newItemLabel}
              onChange={(e) => setNewItemLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleAddItem}
              className="bg-slate-900 text-white hover:bg-slate-800 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center space-x-1 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {showAddRoomModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-1">Adicionar Novo Cômodo</h3>
            <p className="text-xs text-slate-500 mb-4">
              Digite o nome do novo ambiente para incluir no checklist de limpeza.
            </p>

            <input
              type="text"
              placeholder="Ex: Suíte Master, Churrasqueira, Garagem..."
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 mb-5"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddRoomModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddRoom}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
              >
                Criar Cômodo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
