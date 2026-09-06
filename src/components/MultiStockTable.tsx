import React, { useState } from 'react';
import { StockData, Verdict, Language } from '../types';
import { ArrowUpDown, ChevronRight, Filter, Search, Sparkles, Sliders } from 'lucide-react';
import { calculateScreenerFundamentalScore } from '../utils/fundamentalEngine';
import { getTranslation } from '../utils/translations';

interface MultiStockTableProps {
  stocks: StockData[];
  onSelectStock: (stock: StockData) => void;
  activeSymbol: string;
  language: Language;
  onOpenEditStock?: (stock: StockData) => void;
}

export const MultiStockTable: React.FC<MultiStockTableProps> = ({
  stocks,
  onSelectStock,
  activeSymbol,
  language,
  onOpenEditStock
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'roce' | 'pe' | 'cmp' | 'sales'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const t = getTranslation(language);
  const isTamil = language === 'tamil';

  // Compute scores for each stock
  const scoredStocks = stocks.map(s => {
    const calculation = calculateScreenerFundamentalScore(s.ratios);
    return {
      ...s,
      calculatedScore: calculation.score,
      calculatedVerdict: calculation.verdict,
      valuationStatus: calculation.valuationStatus
    };
  });

  const filtered = scoredStocks
    .filter(s => {
      return s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
             s.sector.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortBy === 'score') {
        valA = a.calculatedScore;
        valB = b.calculatedScore;
      } else if (sortBy === 'roce') {
        valA = a.ratios.roce;
        valB = b.ratios.roce;
      } else if (sortBy === 'pe') {
        valA = a.ratios.pe;
        valB = b.ratios.pe;
      } else if (sortBy === 'cmp') {
        valA = a.ratios.cmp;
        valB = b.ratios.cmp;
      } else if (sortBy === 'sales') {
        valA = a.ratios.salesGrowth3Yr;
        valB = b.ratios.salesGrowth3Yr;
      }
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>{t.screenerTableTitle}</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-mono font-semibold px-2 py-0.5 rounded">
              {stocks.length} {isTamil ? 'நிறுவனங்கள்' : 'Companies'}
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.screenerTableSub}
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchStock}
              className="bg-slate-50 border border-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Company & Ticker</th>
              <th 
                onClick={() => {
                  if (sortBy === 'cmp') setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
                  else { setSortBy('cmp'); setSortOrder('desc'); }
                }}
                className="py-2.5 px-3 cursor-pointer hover:text-slate-900"
              >
                CMP (₹) <ArrowUpDown className="w-2.5 h-2.5 inline" />
              </th>
              <th 
                onClick={() => {
                  if (sortBy === 'score') setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
                  else { setSortBy('score'); setSortOrder('desc'); }
                }}
                className="py-2.5 px-3 cursor-pointer hover:text-slate-900 text-emerald-700"
              >
                Score / 10 <ArrowUpDown className="w-2.5 h-2.5 inline" />
              </th>
              <th 
                onClick={() => {
                  if (sortBy === 'pe') setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
                  else { setSortBy('pe'); setSortOrder('asc'); }
                }}
                className="py-2.5 px-3 cursor-pointer hover:text-slate-900"
              >
                P/E <ArrowUpDown className="w-2.5 h-2.5 inline" />
              </th>
              <th 
                onClick={() => {
                  if (sortBy === 'roce') setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
                  else { setSortBy('roce'); setSortOrder('desc'); }
                }}
                className="py-2.5 px-3 cursor-pointer hover:text-slate-900 text-emerald-700"
              >
                ROCE (%) <ArrowUpDown className="w-2.5 h-2.5 inline" />
              </th>
              <th className="py-2.5 px-3">ROE (%)</th>
              <th className="py-2.5 px-3">Debt / Eq</th>
              <th 
                onClick={() => {
                  if (sortBy === 'sales') setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
                  else { setSortBy('sales'); setSortOrder('desc'); }
                }}
                className="py-2.5 px-3 cursor-pointer hover:text-slate-900"
              >
                3Y Sales Gr <ArrowUpDown className="w-2.5 h-2.5 inline" />
              </th>
              <th className="py-2.5 px-3">Promoter %</th>
              <th className="py-2.5 px-3 text-center">{t.quickVerdict}</th>
              <th className="py-2.5 px-3 text-right">{t.action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((stock) => {
              const isActive = stock.symbol === activeSymbol;
              const r = stock.ratios;

              return (
                <tr 
                  key={stock.symbol}
                  className={`hover:bg-slate-50 transition-colors ${
                    isActive ? 'bg-emerald-50/50 font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">{stock.name}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {stock.exchange}: {stock.symbol} • {stock.sector}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    ₹{r.cmp.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono font-black text-slate-900 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                      {stock.calculatedScore}/10
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">
                    {r.pe} <span className="text-[10px] text-slate-400">({r.industryPe})</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                    {r.roce}%
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">
                    {r.roe}%
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className={r.debtToEquity > 1 ? 'text-rose-600 font-bold' : r.debtToEquity === 0 ? 'text-emerald-700 font-bold' : 'text-slate-700'}>
                      {r.debtToEquity === 0 ? 'Zero' : r.debtToEquity}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">
                    {r.salesGrowth3Yr}%
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">
                    {r.promoterHolding}%
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      stock.calculatedVerdict === 'STRONG BUY' ? 'bg-emerald-100 text-emerald-800' :
                      stock.calculatedVerdict === 'BUY' ? 'bg-emerald-50 text-emerald-700' :
                      stock.calculatedVerdict === 'HOLD' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {stock.calculatedVerdict}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onOpenEditStock && (
                        <button
                          onClick={() => onOpenEditStock(stock)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                          title={t.editRatios}
                        >
                          <Sliders className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => onSelectStock(stock)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-emerald-600 text-white rounded text-[11px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{t.deepScan}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {filtered.map((stock) => {
          const isActive = stock.symbol === activeSymbol;
          const r = stock.ratios;

          return (
            <div 
              key={stock.symbol}
              className={`p-3.5 rounded-xl border transition-all ${
                isActive ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>{stock.name}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">{stock.exchange}: {stock.symbol} • {stock.sector}</div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    stock.calculatedVerdict === 'STRONG BUY' ? 'bg-emerald-100 text-emerald-800' :
                    stock.calculatedVerdict === 'BUY' ? 'bg-emerald-50 text-emerald-700' :
                    stock.calculatedVerdict === 'HOLD' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {stock.calculatedVerdict}
                  </span>
                  <div className="text-[10px] font-mono font-bold text-slate-900 mt-1">
                    Score: {stock.calculatedScore}/10
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-200/60 font-mono mt-2 text-center">
                <div className="bg-white p-1.5 rounded border border-slate-100">
                  <div className="text-[9px] text-slate-400">CMP</div>
                  <div className="font-bold text-slate-900">₹{r.cmp}</div>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-100">
                  <div className="text-[9px] text-slate-400">ROCE</div>
                  <div className="font-bold text-emerald-700">{r.roce}%</div>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-100">
                  <div className="text-[9px] text-slate-400">D/E</div>
                  <div className="font-bold text-slate-800">{r.debtToEquity === 0 ? '0.0' : r.debtToEquity}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-200/60 text-xs">
                {onOpenEditStock && (
                  <button
                    onClick={() => onOpenEditStock(stock)}
                    className="text-slate-500 hover:text-slate-900 text-xs font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{t.editRatios}</span>
                  </button>
                )}

                <button
                  onClick={() => onSelectStock(stock)}
                  className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-bold inline-flex items-center gap-1 hover:bg-emerald-600 transition-colors ml-auto cursor-pointer"
                >
                  <span>{t.deepScan}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
