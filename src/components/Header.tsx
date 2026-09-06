import React from 'react';
import { 
  Download, 
  Upload, 
  RefreshCw, 
  Sparkles,
  Menu,
  Sliders,
  User,
  ShieldCheck,
  TrendingUp,
  Search
} from 'lucide-react';
import { Language, StockData, UserProfile } from '../types';
import { StockSearchBar } from './StockSearchBar';
import { getTranslation } from '../utils/translations';

interface HeaderProps {
  activeStock: StockData;
  availableStocks: StockData[];
  onSelectStock: (stock: StockData) => void;
  onAddNewStock?: (ticker: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onExportExcel: () => void;
  onOpenUpload: () => void;
  onRefreshAnalysis: () => void;
  isLoading: boolean;
  onOpenChat: () => void;
  onOpenMobileMenu?: () => void;
  onOpenEditRatios?: () => void;
  user?: UserProfile | null;
  onOpenLogin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeStock,
  availableStocks,
  onSelectStock,
  onAddNewStock,
  language,
  onLanguageChange,
  onExportExcel,
  onOpenUpload,
  onRefreshAnalysis,
  isLoading,
  onOpenChat,
  onOpenMobileMenu,
  onOpenEditRatios,
  user,
  onOpenLogin
}) => {
  const t = getTranslation(language);
  const isTamil = language === 'tamil';

  return (
    <header className="bg-white border-b border-slate-200 shrink-0 z-30 shadow-xs">
      {/* 1. Main Navigation Row */}
      <div className="h-14 md:h-16 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Mobile Hamburger & App Branding */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 text-slate-700 hover:text-slate-950 lg:hidden rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* App Brand & Active Stock Ticker Chip */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                SL
              </div>
              <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight hidden xs:inline">
                StockLogic
              </span>
            </div>

            {/* Active Stock Badge on Mobile */}
            <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold text-emerald-800">
              <span className="truncate max-w-[90px] sm:max-w-none">{activeStock.symbol}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-900">₹{activeStock.ratios.cmp}</span>
            </div>
          </div>
        </div>

        {/* Desktop Search Bar (Hidden on mobile, shown in row 2 below) */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <StockSearchBar
            availableStocks={availableStocks}
            activeStock={activeStock}
            onSelectStock={onSelectStock}
            onAddNewCustomStock={onAddNewStock}
            language={language}
          />
        </div>

        {/* Right Side Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => onLanguageChange('tamil')}
              title="Tamil script"
              className={`px-2 py-1 rounded-md transition-all cursor-pointer text-xs ${
                language === 'tamil' 
                  ? 'bg-white text-emerald-700 shadow-xs font-bold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => onLanguageChange('english')}
              title="English"
              className={`px-2 py-1 rounded-md transition-all cursor-pointer text-xs ${
                language === 'english' 
                  ? 'bg-white text-emerald-700 shadow-xs font-bold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ENG
            </button>
          </div>

          {/* Edit Stock Ratios (Desktop & Tablet) */}
          {onOpenEditRatios && (
            <button
              onClick={onOpenEditRatios}
              className="hidden sm:flex bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-100 text-slate-700 items-center gap-1.5 transition-colors cursor-pointer"
              title={t.editRatios}
            >
              <Sliders className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden lg:inline">{t.editRatios}</span>
            </button>
          )}

          {/* Upload Excel (Desktop only) */}
          <button
            onClick={onOpenUpload}
            className="hidden lg:flex bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-50 text-slate-700 items-center gap-1.5 transition-colors cursor-pointer"
            title={t.uploadExcel}
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.uploadExcel}</span>
          </button>

          {/* Export Excel (Desktop only) */}
          <button
            onClick={onExportExcel}
            className="hidden lg:flex bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-50 text-slate-700 items-center gap-1.5 transition-colors cursor-pointer"
            title={t.exportExcel}
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>{t.exportExcel}</span>
          </button>

          {/* AI Stock Mentor button */}
          <button
            onClick={onOpenChat}
            className="bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg text-xs font-bold text-emerald-700 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors cursor-pointer"
            title={t.askAi}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">{t.askAi}</span>
          </button>

          {/* Scan Refresh button (Desktop & Tablet) */}
          <button
            onClick={onRefreshAnalysis}
            disabled={isLoading}
            className="hidden sm:flex bg-[#1E293B] text-white px-2.5 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 items-center gap-1.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            title={t.runScan}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{isLoading ? t.analyzing : t.runScan}</span>
          </button>

          {/* Pro Access Login button */}
          {onOpenLogin && (
            <button
              onClick={onOpenLogin}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                user?.isLoggedIn
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              title={user?.isLoggedIn ? user.role : (isTamil ? 'தொழில்முறை உள்நுழைவு' : 'Pro Login')}
            >
              {user?.isLoggedIn ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden md:inline">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1 py-0.2 rounded font-mono font-bold">PRO</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isTamil ? 'ப்ரோ அணுகல்' : 'Pro Access'}</span>
                  <span className="sm:hidden font-mono text-[11px]">PRO</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 2. Mobile Search Bar Row (Dedicated full width on small screens) */}
      <div className="md:hidden px-3 pb-2.5 pt-0.5">
        <StockSearchBar
          availableStocks={availableStocks}
          activeStock={activeStock}
          onSelectStock={onSelectStock}
          onAddNewCustomStock={onAddNewStock}
          language={language}
        />
      </div>
    </header>
  );
};
