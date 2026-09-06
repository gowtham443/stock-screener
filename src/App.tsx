/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StockAnalysisCard } from './components/StockAnalysisCard';
import { MarketDepthCard } from './components/MarketDepthCard';
import { AnalysisLogSidebar } from './components/AnalysisLogSidebar';
import { ScreenerUploadModal } from './components/ScreenerUploadModal';
import { AiChatDrawer } from './components/AiChatDrawer';
import { ScreenerGuideModal } from './components/ScreenerGuideModal';
import { ScoreBreakdownModal } from './components/ScoreBreakdownModal';
import { EditStockModal } from './components/EditStockModal';
import { PersonalPortfolio } from './components/PersonalPortfolio';
import { MultiStockTable } from './components/MultiStockTable';
import { MarketPulseBar } from './components/MarketPulseBar';
import { LoginModal } from './components/LoginModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ALL_INDIAN_STOCKS, generateIndianStockData } from './data/indianStocksData';
import { StockData, AnalysisResponse, Language, UserProfile, PortfolioItem } from './types';
import { exportAnalysisToExcel } from './utils/excelExporter';
import { calculateScreenerFundamentalScore, buildComprehensiveAnalysis } from './utils/fundamentalEngine';
import { getTranslation } from './utils/translations';
import { RefreshCw, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [stocks, setStocks] = useState<StockData[]>(ALL_INDIAN_STOCKS);
  const [activeStock, setActiveStock] = useState<StockData>(ALL_INDIAN_STOCKS[0]);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [analyzedHistory, setAnalyzedHistory] = useState<Record<string, AnalysisResponse>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('tamil');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');

  // Professional User Session
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('stocklogic_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  // Personal Portfolio state
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem('stocklogic_portfolio');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'hold_1',
        symbol: 'TATAMOTORS',
        name: 'Tata Motors Ltd',
        quantity: 50,
        buyPrice: 910.00,
        buyDate: '2024-04-15',
        notes: 'EV commercial vehicle leadership'
      },
      {
        id: 'hold_2',
        symbol: 'HDFCBANK',
        name: 'HDFC Bank Ltd',
        quantity: 40,
        buyPrice: 1580.00,
        buyDate: '2024-05-10',
        notes: 'Long term core banking'
      },
      {
        id: 'hold_3',
        symbol: 'HAL',
        name: 'Hindustan Aeronautics Ltd',
        quantity: 15,
        buyPrice: 4250.00,
        buyDate: '2024-06-01',
        notes: 'Defence modernization order book'
      }
    ];
  });

  const handleUpdatePortfolio = (items: PortfolioItem[]) => {
    setPortfolioItems(items);
    try {
      localStorage.setItem('stocklogic_portfolio', JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to persist portfolio', e);
    }
  };
  
  // Modals & Drawers
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState<boolean>(false);
  const [stockToEdit, setStockToEdit] = useState<StockData | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const t = getTranslation(language);

  const handleAddNewStock = useCallback((ticker: string) => {
    const newStock = generateIndianStockData(ticker);
    setStocks(prev => {
      if (prev.some(s => s.symbol.toUpperCase() === newStock.symbol.toUpperCase())) return prev;
      return [newStock, ...prev];
    });
    setActiveStock(newStock);
    setCurrentTab('dashboard');
  }, []);

  // Fetch or mathematically compute analysis for a given stock
  const runStockAnalysis = useCallback(async (stockToAnalyze: StockData, targetLang: Language) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stock: stockToAnalyze,
          language: targetLang
        })
      });

      if (!response.ok) {
        throw new Error('Analysis API request failed');
      }

      const data: AnalysisResponse = await response.json();
      setAnalysis(data);
      setAnalyzedHistory(prev => ({ ...prev, [stockToAnalyze.symbol]: data }));
    } catch (err) {
      console.warn('Backend API error, computing with client-side Screener Mathematical Engine:', err);
      const fallback = buildComprehensiveAnalysis(stockToAnalyze, targetLang);
      setAnalysis(fallback);
      setAnalyzedHistory(prev => ({ ...prev, [stockToAnalyze.symbol]: fallback }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run analysis when active stock or language changes
  useEffect(() => {
    runStockAnalysis(activeStock, language);
  }, [activeStock, language, runStockAnalysis]);

  // Handle user uploaded Screener stocks
  const handleStocksLoaded = (newStocks: StockData[]) => {
    setStocks(prev => {
      const existingSymbols = new Set(prev.map(s => s.symbol));
      const filteredNew = newStocks.filter(s => !existingSymbols.has(s.symbol));
      return [...filteredNew, ...prev];
    });
    if (newStocks.length > 0) {
      setActiveStock(newStocks[0]);
    }
  };

  const handleSelectPreset = (symbol: string) => {
    const found = stocks.find(s => s.symbol === symbol);
    if (found) {
      setActiveStock(found);
      setCurrentTab('dashboard');
    }
  };

  const handleExportAllToExcel = () => {
    const listToExport: AnalysisResponse[] = [];
    if (analysis) {
      listToExport.push(analysis);
    }
    Object.values(analyzedHistory).forEach((a: AnalysisResponse) => {
      if (a.symbol !== analysis?.symbol) {
        listToExport.push(a);
      }
    });

    exportAnalysisToExcel(
      listToExport.length > 0 ? listToExport : (analysis ? [analysis] : []),
      `Screener_Stock_Analysis_${activeStock.symbol}.xlsx`
    );
  };

  const handleAskQuestionFromLog = (questionText: string) => {
    setIsChatOpen(true);
  };

  // Stock edit handler
  const handleSaveEditedStock = (updatedStock: StockData) => {
    setStocks(prev => prev.map(s => s.symbol === updatedStock.symbol ? updatedStock : s));
    if (activeStock.symbol === updatedStock.symbol) {
      setActiveStock(updatedStock);
    }
    setStockToEdit(null);
  };

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      {/* 1. Sidebar - Professional Polish dark navy (#1E293B) */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenHelp={() => setIsGuideOpen(true)}
        stocksCount={stocks.length}
        portfolioCount={portfolioItems.length}
        language={language}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          activeStock={activeStock}
          availableStocks={stocks}
          onSelectStock={(stk) => {
            setActiveStock(stk);
            if (currentTab === 'screener') setCurrentTab('dashboard');
          }}
          onAddNewStock={handleAddNewStock}
          language={language}
          onLanguageChange={setLanguage}
          onExportExcel={handleExportAllToExcel}
          onOpenUpload={() => setIsUploadOpen(true)}
          onRefreshAnalysis={() => runStockAnalysis(activeStock, language)}
          isLoading={isLoading}
          onOpenChat={() => setIsChatOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
          onOpenEditRatios={() => setStockToEdit(activeStock)}
          user={user}
          onOpenLogin={() => setIsLoginOpen(true)}
        />

        {/* Market Indices Pulse Bar & Pro Session Status */}
        <MarketPulseBar
          language={language}
          user={user}
          onOpenLogin={() => setIsLoginOpen(true)}
          onLogout={() => {
            localStorage.removeItem('stocklogic_user_session');
            setUser(null);
          }}
        />

        {/* View Switching */}
        <div className="flex-1 overflow-y-auto pb-20 lg:pb-8">
          {/* Quick Sector Selector & Popular Indian Stock Carousel */}
          <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-semibold shrink-0">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mr-1 shrink-0 flex items-center gap-1">
                <Layers className="w-3 h-3 text-emerald-600" />
                {language === 'tamil' ? 'துறை தேர்வு:' : 'Sector:'}
              </span>
              {[
                { id: 'ALL', name: language === 'tamil' ? 'அனைத்தும்' : 'All' },
                { id: 'Automobile', name: language === 'tamil' ? 'வாகனங்கள்' : 'Auto' },
                { id: 'Banking', name: language === 'tamil' ? 'வங்கிகள்' : 'Banking' },
                { id: 'IT', name: language === 'tamil' ? 'ஐடி' : 'IT' },
                { id: 'Energy', name: language === 'tamil' ? 'ஆற்றல்' : 'Energy' },
                { id: 'FMCG', name: language === 'tamil' ? 'நுகர்வோர்' : 'FMCG' },
                { id: 'Defence', name: language === 'tamil' ? 'பாதுகாப்பு/ரயில்' : 'Defence/Rail' }
              ].map(sec => (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSector(sec.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                    selectedSector === sec.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sec.name}
                </button>
              ))}
            </div>

            {/* Quick Stock Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1 hidden md:inline">
                {language === 'tamil' ? 'விரைவு தேர்வுகள்:' : 'Quick Select:'}
              </span>
              {stocks
                .filter(s => selectedSector === 'ALL' || s.sector.toLowerCase().includes(selectedSector.toLowerCase()))
                .slice(0, 8)
                .map(s => {
                  const isCur = s.symbol === activeStock.symbol;
                  return (
                    <button
                      key={s.symbol}
                      onClick={() => {
                        setActiveStock(s);
                        if (currentTab === 'screener') setCurrentTab('dashboard');
                      }}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all shrink-0 cursor-pointer ${
                        isCur
                          ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-300'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      {s.symbol} <span className="text-[9px] opacity-80">₹{s.ratios.cmp}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {currentTab === 'portfolio' ? (
            /* Personal Portfolio Management with CSV/Excel & P&L tracking */
            <div className="p-4 sm:p-8 max-w-7xl mx-auto">
              <PersonalPortfolio
                portfolio={portfolioItems}
                onUpdatePortfolio={handleUpdatePortfolio}
                availableStocks={stocks}
                language={language}
                onSelectStockToScan={(stock) => {
                  setActiveStock(stock);
                  setCurrentTab('dashboard');
                }}
              />
            </div>
          ) : currentTab === 'screener' ? (
            /* Screener Hub Multi-stock View with dynamic scoring */
            <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
              <MultiStockTable
                stocks={stocks}
                onSelectStock={(stk) => {
                  setActiveStock(stk);
                  setCurrentTab('dashboard');
                }}
                activeSymbol={activeStock.symbol}
                language={language}
                onOpenEditStock={(stk) => setStockToEdit(stk)}
              />
            </div>
          ) : currentTab === 'analysis' ? (
            /* Dedicated In-depth Analysis View */
            <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
              {analysis && (
                <>
                  <StockAnalysisCard
                    analysis={analysis}
                    language={language}
                    onOpenScoreBreakdown={() => setIsScoreModalOpen(true)}
                    onOpenEditStock={() => setStockToEdit(activeStock)}
                  />
                  <MarketDepthCard analysis={analysis} language={language} />
                </>
              )}
            </div>
          ) : (
            /* Primary Dashboard */
            <div className="p-4 sm:p-8 grid grid-cols-12 gap-6 max-w-7xl mx-auto">
              {/* Left Column (8 cols on lg): Primary Stock Analysis & Market Depth */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                {isLoading && !analysis ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
                    <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
                    <h3 className="font-bold text-slate-800 text-base">
                      {language === 'tamil' ? `${activeStock.name} பங்கு ஆய்வு செய்யப்படுகிறது...` : `Analyzing ${activeStock.name}...`}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {language === 'tamil' ? 'Screener நிதிநிலை விகிதங்கள் மற்றும் NSE சந்தை ஆழம் கணக்கிடப்படுகிறது' : 'Extracting Screener ratios, Google sentiment & NSE/BSE market depth'}
                    </p>
                  </div>
                ) : analysis ? (
                  <>
                    <StockAnalysisCard
                      analysis={analysis}
                      language={language}
                      onOpenScoreBreakdown={() => setIsScoreModalOpen(true)}
                      onOpenEditStock={() => setStockToEdit(activeStock)}
                    />
                    <MarketDepthCard analysis={analysis} language={language} />
                  </>
                ) : null}
              </div>

              {/* Right Column (4 cols on lg): Auto-Analysis Log & Sync Export */}
              <div className="col-span-12 lg:col-span-4">
                <AnalysisLogSidebar
                  analysis={analysis}
                  activeStock={activeStock}
                  language={language}
                  onExport={handleExportAllToExcel}
                  onAskQuestion={handleAskQuestionFromLog}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals & Drawers */}
      <ScreenerUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onStocksLoaded={handleStocksLoaded}
        onLoadPreset={handleSelectPreset}
        language={language}
      />

      <AiChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        activeStock={activeStock}
        language={language}
      />

      <ScreenerGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        language={language}
      />

      {/* 5-Pillar Score Breakdown Modal */}
      <ScoreBreakdownModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        stockName={activeStock.name}
        symbol={activeStock.symbol}
        ratios={activeStock.ratios}
        language={language}
      />

      {/* Edit Ratios Modal */}
      {stockToEdit && (
        <EditStockModal
          isOpen={!!stockToEdit}
          onClose={() => setStockToEdit(null)}
          stock={stockToEdit}
          onSave={handleSaveEditedStock}
          language={language}
        />
      )}

      {/* Professional Access & Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
        language={language}
      />

      {/* Mobile Bottom Navigation Bar (Persistent on mobile devices) */}
      <MobileBottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenEditRatios={() => setStockToEdit(activeStock)}
        language={language}
      />
    </div>
  );
}
