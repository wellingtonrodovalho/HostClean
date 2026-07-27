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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('active_checklist')}>
            <div className="p-1.5 bg-white rounded-xl shadow-md border border-slate-200/80 flex items-center justify-center shrink-0">
              <BrandLogo className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  HostClean
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Checklist de Limpeza de Temporada
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
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
              <span className="hidden md:inline">Imóveis</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {activePropertyName && (
              <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-slate-800 rounded-lg border border-slate-700/60 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-medium truncate max-w-[160px]">{activePropertyName}</span>
              </div>
            )}

            <button
              onClick={onNewChecklistClick}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl shadow-md text-xs sm:text-sm transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Limpeza</span>
              <span className="sm:hidden">Novo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
