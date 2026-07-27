import React, { useRef, useState, useEffect } from 'react';
import { FileSignature, RotateCcw, Check, ShieldCheck } from 'lucide-react';

interface DigitalSignaturePadProps {
  signerName: string;
  signatureDataUrl?: string;
  onSaveSignature: (dataUrl: string) => void;
  onClearSignature: () => void;
}

export const DigitalSignaturePad: React.FC<DigitalSignaturePadProps> = ({
  signerName,
  signatureDataUrl,
  onSaveSignature,
  onClearSignature,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set line styles
    ctx.strokeStyle = '#0f172a'; // slate-900
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawn(false);
    onClearSignature();
  };

  const handleConfirm = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;

    const dataUrl = canvas.toDataURL('image/png');
    onSaveSignature(dataUrl);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <FileSignature className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-800">Assinatura Digital do Responsável</h2>
              {signatureDataUrl ? (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Assinado</span>
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Pendente
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              O colaborador deve assinar na tela abaixo para validar o término e padrão do serviço prestado.
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
          Signatário: <strong className="text-slate-900">{signerName || 'Colaborador não informado'}</strong>
        </div>
      </div>

      {/* Signature Canvas Area */}
      <div className="pt-5 space-y-3">
        {signatureDataUrl ? (
          <div className="bg-slate-50 p-4 rounded-2xl border border-emerald-300 text-center space-y-2">
            <p className="text-xs font-bold text-emerald-800 flex items-center justify-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Assinatura Digital Registrada no Sistema</span>
            </p>

            <div className="inline-block bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <img src={signatureDataUrl} alt="Assinatura" className="max-h-24 mx-auto" />
            </div>

            <div>
              <button
                onClick={handleClear}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline mt-1"
              >
                Refazer Assinatura
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl bg-slate-50/50 p-2 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={600}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-40 bg-white rounded-xl touch-none cursor-crosshair shadow-inner"
              />
              <span className="absolute bottom-3 right-4 text-[10px] font-medium text-slate-400 pointer-events-none">
                Assine com o dedo ou mouse aqui ✍️
              </span>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleClear}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar Tela</span>
              </button>

              <button
                onClick={handleConfirm}
                disabled={!hasDrawn}
                className={`flex items-center space-x-2 font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-all ${
                  hasDrawn
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Confirmar Assinatura</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
