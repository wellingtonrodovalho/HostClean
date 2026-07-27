import React from 'react';
import { ClipboardCheck, History, Home, PlusCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HeaderNavbarProps {
  activeTab: 'active_checklist' | 'history' | 'properties';
  setActiveTab: (tab: 'active_checklist' | 'history' | 'properties') => void;
  onNewChecklistClick: () => void;
  activePropertyName?: string;
  isReportInProgress: boolean;
  completionPercentage: number;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  activeTab,
  setActiveTab,
  onNewChecklistClick,
  activePropertyName,
  isReportInProgress,
  completionPercentage,
}) => {
  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-30">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('active_checklist')}>
            <div className="p-1 bg-white rounded-xl shadow-md border border-slate-200/80 flex items-center justify-center shrink-0">
              <BrandLogo className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  HostClean
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Checklist de Limpeza de Temporada
              </p>
            </div>
          </div>

          {/* Desktop Center Navigation Tabs */}
          <nav className="hidden sm:flex items-center space-x-1 sm:space-x-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('active_checklist')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'active_checklist'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Checklist</span>
              {isReportInProgress && (
                <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-400 text-slate-950 font-bold">
                  {completionPercentage}%
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Histórico</span>
            </button>

            <button
              onClick={() => setActiveTab('properties')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'properties'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Imóveis</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {activePropertyName && (
              <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-slate-800 rounded-lg border border-slate-700/60 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-medium truncate max-w-[160px]">{activePropertyName}</span>
              </div>
            )}

            <button
              onClick={onNewChecklistClick}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl shadow-md text-xs sm:text-sm transition-all transform active:scale-95 min-h-[38px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Limpeza</span>
              <span className="sm:hidden font-extrabold text-xs">Novo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Cell Phone Navigation) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 z-40 shadow-2xl flex items-center justify-around">
        <button
          onClick={() => setActiveTab('active_checklist')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'active_checklist'
              ? 'text-emerald-400 font-bold bg-slate-800/80'
              : 'text-slate-400 font-medium hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <ClipboardCheck className="w-5 h-5" />
            {isReportInProgress && (
              <span className="absolute -top-1 -right-2 bg-emerald-500 text-slate-950 font-extrabold text-[9px] px-1 rounded-full">
                {completionPercentage}%
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'history'
              ? 'text-emerald-400 font-bold bg-slate-800/80'
              : 'text-slate-400 font-medium hover:text-slate-200'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Histórico</span>
        </button>

        <button
          onClick={() => setActiveTab('properties')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'properties'
              ? 'text-emerald-400 font-bold bg-slate-800/80'
              : 'text-slate-400 font-medium hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Imóveis</span>
        </button>
      </div>
    </header>
  );
};
