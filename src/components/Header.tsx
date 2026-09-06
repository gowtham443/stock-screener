import React from 'react';
import { 
  Download, 
  Upload, 
  RefreshCw, 
  Sparkles,
  Menu,
  PieChart,
  Sliders
} from 'lucide-react';
import { Language, StockData } from '../types';
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
  onOpenEditRatios
}) => {
  const t = getTranslation(language);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20 gap-3">
      {/* Left: Mobile hamburger + Stock Search Bar */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="p-2 text-slate-600 hover:text-slate-900 lg:hidden rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Universal Search Bar */}
        <StockSearchBar
          availableStocks={availableStocks}
          activeStock={activeStock}
          onSelectStock={onSelectStock}
          onAddNewCustomStock={onAddNewStock}
          language={language}
        />
      </div>

      {/* Right: Language switch + Quick Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Language selector: Tamil & English ONLY */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => onLanguageChange('tamil')}
            title="Tamil script"
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
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
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              language === 'english' 
                ? 'bg-white text-emerald-700 shadow-xs font-bold' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            English
          </button>
        </div>

        {/* Edit Stock Ratios button */}
        {onOpenEditRatios && (
          <button
            onClick={onOpenEditRatios}
            className="hidden sm:flex bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-100 text-slate-700 items-center gap-1.5 transition-colors cursor-pointer"
            title={t.editRatios}
          >
            <Sliders className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden md:inline">{t.editRatios}</span>
          </button>
        )}

        {/* Upload Screener Excel */}
        <button
          onClick={onOpenUpload}
          className="hidden md:flex bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-50 text-slate-700 items-center gap-1.5 transition-colors cursor-pointer"
          title={t.uploadExcel}
        >
          <Upload className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.uploadExcel}</span>
        </button>

        {/* Export to Excel */}
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

        {/* Scan Refresh button */}
        <button
          onClick={onRefreshAnalysis}
          disabled={isLoading}
          className="bg-[#1E293B] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          title={t.runScan}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isLoading ? t.analyzing : t.runScan}</span>
        </button>
      </div>
    </header>
  );
};
