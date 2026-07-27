import React, { useState } from 'react';
import { Camera, X, Trash2, Image as ImageIcon, ZoomIn } from 'lucide-react';

interface PhotoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  photos: string[];
  onAddPhoto: (photoDataUrl: string) => void;
  onRemovePhoto: (photoIndex: number) => void;
}

export const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({
  isOpen,
  onClose,
  roomName,
  photos,
  onAddPhoto,
  onRemovePhoto,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAddPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Registro Fotográfico - {roomName}</h3>
              <p className="text-xs text-slate-500">
                {photos.length} foto(s) cadastradas para comprovação de limpeza e estado do cômodo.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4">
          {/* Add Photo Button */}
          <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-700">Tirar foto na câmera ou selecionar arquivo:</span>
            <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-xs transition-all">
              <Camera className="w-4 h-4" />
              <span>Capturar / Adicionar Foto</span>
              <input type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Photos Grid */}
          {photos.length === 0 ? (
            <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">Nenhuma foto registrada para {roomName}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Fotografe as condições do ambiente limpo para garantir o padrão Superhost.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((photo, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                  <img src={photo} alt={`Foto ${idx + 1}`} className="w-full h-32 object-cover" />

                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 p-2">
                    <button
                      onClick={() => setSelectedPhoto(photo)}
                      className="p-2 bg-white text-slate-800 rounded-full shadow-md hover:bg-slate-100"
                      title="Visualizar ampliada"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemovePhoto(idx)}
                      className="p-2 bg-rose-600 text-white rounded-full shadow-md hover:bg-rose-700"
                      title="Excluir foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fullscreen Photo Zoom Overlay */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black/90 z-60 flex items-center justify-center p-4">
            <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-2 right-2 p-2 bg-white/20 text-white hover:bg-white/40 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
              <img src={selectedPhoto} alt="Ampliada" className="max-w-full max-h-[80vh] object-contain rounded-xl" />
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-xs"
          >
            Concluído
          </button>
        </div>
      </div>
    </div>
  );
};
