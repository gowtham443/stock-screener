import React from 'react';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  Cpu, 
  Sparkles,
  Layers,
  HelpCircle,
  PieChart,
  X
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenUpload: () => void;
  onOpenChat: () => void;
  onOpenHelp: () => void;
  stocksCount: number;
  portfolioCount: number;
  language: Language;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenUpload,
  onOpenChat,
  onOpenHelp,
  stocksCount,
  portfolioCount,
  language,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const t = getTranslation(language);
  const isTamil = language === 'tamil';

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#1E293B] text-slate-300 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-xs font-black text-white shadow-sm">
            S-AI
          </div>
          <div>
            <h1 className="text-white font-bold text-base tracking-tight leading-none">
              Screener Pro
            </h1>
            <p className="text-[10px] text-slate-400 mt-1">
              {isTamil ? 'அடிப்படை & நேரலை அனாலிசிஸ்' : 'Screener & NSE/BSE Intel'}
            </p>
          </div>
        </div>

        {/* Close button on mobile */}
        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
        {/* 1. Dashboard */}
        <button
          onClick={() => {
            setCurrentTab('dashboard');
            onCloseMobile?.();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-colors text-left cursor-pointer ${
            currentTab === 'dashboard'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <span>{t.dashboard}</span>
        </button>

        {/* 2. Screener Hub */}
        <button
          onClick={() => {
            setCurrentTab('screener');
            onCloseMobile?.();
          }}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-colors text-left cursor-pointer ${
            currentTab === 'screener'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 shrink-0" />
            <span>{t.screenerHub}</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded">
            {stocksCount}
          </span>
        </button>

        {/* 3. Personal Portfolio */}
        <button
          onClick={() => {
            setCurrentTab('portfolio');
            onCloseMobile?.();
          }}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-colors text-left cursor-pointer ${
            currentTab === 'portfolio'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <PieChart className="w-4 h-4 shrink-0 text-blue-400" />
            <span>{t.portfolio}</span>
          </div>
          {portfolioCount > 0 && (
            <span className="text-[10px] bg-blue-500/20 text-blue-300 font-mono px-1.5 py-0.5 rounded">
              {portfolioCount}
            </span>
          )}
        </button>

        {/* 4. In-depth Analysis Engine */}
        <button
          onClick={() => {
            setCurrentTab('analysis');
            onCloseMobile?.();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-colors text-left cursor-pointer ${
            currentTab === 'analysis'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4 shrink-0" />
          <span>{t.analysisEngine}</span>
        </button>

        <div className="pt-2 border-t border-slate-700/50 my-2 space-y-1">
          {/* Excel Sync */}
          <button
            onClick={() => {
              onOpenUpload();
              onCloseMobile?.();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-lg text-xs sm:text-sm transition-colors text-left cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{t.excelUpload}</span>
          </button>

          {/* AI Mentor */}
          <button
            onClick={() => {
              onOpenChat();
              onCloseMobile?.();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-lg text-xs sm:text-sm transition-colors text-left cursor-pointer"
          >
            <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{t.aiMentor}</span>
          </button>

          {/* Screener Guide */}
          <button
            onClick={() => {
              onOpenHelp();
              onCloseMobile?.();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-lg text-xs sm:text-sm transition-colors text-left cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 shrink-0 text-sky-400" />
            <span>{t.guide}</span>
          </button>
        </div>
      </nav>

      {/* Market Feed Live Footer */}
      <div className="p-3.5 border-t border-slate-700/50">
        <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700/40">
          <div className="text-[9px] uppercase text-slate-400 font-bold tracking-widest mb-1 flex items-center justify-between">
            <span>{t.marketFeedLive}</span>
            <span className="text-[9px] text-emerald-400 font-mono">NSE / BSE</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-200 font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>{isTamil ? 'நேரலை சந்தை நிலவரம்' : 'Live Data Synchronized'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-700/50 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
