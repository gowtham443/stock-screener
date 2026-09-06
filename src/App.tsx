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
import { SAMPLE_STOCKS } from './data/sampleStocks';
import { StockData, AnalysisResponse, Language } from './types';
import { exportAnalysisToExcel } from './utils/excelExporter';
import { calculateScreenerFundamentalScore, buildComprehensiveAnalysis } from './utils/fundamentalEngine';
import { getTranslation } from './utils/translations';
import { RefreshCw } from 'lucide-react';

export default function App() {
  const [stocks, setStocks] = useState<StockData[]>(SAMPLE_STOCKS);
  const [activeStock, setActiveStock] = useState<StockData>(SAMPLE_STOCKS[0]);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [analyzedHistory, setAnalyzedHistory] = useState<Record<string, AnalysisResponse>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('tamil');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  
  // Modals & Drawers
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState<boolean>(false);
  const [stockToEdit, setStockToEdit] = useState<StockData | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const t = getTranslation(language);

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
          language={language}
          onLanguageChange={setLanguage}
          onExportExcel={handleExportAllToExcel}
          onOpenUpload={() => setIsUploadOpen(true)}
          onRefreshAnalysis={() => runStockAnalysis(activeStock, language)}
          isLoading={isLoading}
          onOpenChat={() => setIsChatOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        />

        {/* View Switching */}
        <div className="flex-1 overflow-y-auto">
          {currentTab === 'portfolio' ? (
            /* Personal Portfolio Management with CSV/Excel & P&L tracking */
            <div className="p-4 sm:p-8 max-w-7xl mx-auto">
              <PersonalPortfolio
                availableStocks={stocks}
                language={language}
                onSelectStock={(stock) => {
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
    </div>
  );
}
