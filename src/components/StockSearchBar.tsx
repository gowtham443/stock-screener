import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Plus, Sparkles, Building2 } from 'lucide-react';
import { StockData, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface StockSearchBarProps {
  availableStocks: StockData[];
  activeStock: StockData;
  onSelectStock: (stock: StockData) => void;
  onAddNewCustomStock?: (ticker: string) => void;
  language: Language;
}

export const StockSearchBar: React.FC<StockSearchBarProps> = ({
  availableStocks,
  activeStock,
  onSelectStock,
  onAddNewCustomStock,
  language
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = getTranslation(language);
  const isTamil = language === 'tamil';

  // Filter stocks based on query
  const filtered = availableStocks.filter(s => 
    s.symbol.toLowerCase().includes(query.toLowerCase()) ||
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.sector.toLowerCase().includes(query.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (stock: StockData) => {
    onSelectStock(stock);
    setQuery('');
    setIsOpen(false);
  };

  const handleAddCustom = () => {
    if (query.trim() && onAddNewCustomStock) {
      onAddNewCustomStock(query.trim().toUpperCase());
      setQuery('');
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={t.searchPlaceholder}
          className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 text-xs rounded-lg pl-9 pr-8 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 max-h-80 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{isTamil ? 'பங்குகள் பட்டியல் (NSE/BSE)' : 'Screener Stock Directory'}</span>
            <span>{filtered.length} {isTamil ? 'முடிவுகள்' : 'results'}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.slice(0, 10).map((stock) => {
              const isActive = stock.symbol === activeStock.symbol;
              return (
                <div
                  key={stock.symbol}
                  onClick={() => handleSelect(stock)}
                  className={`px-3.5 py-2.5 hover:bg-emerald-50/60 transition-colors cursor-pointer flex items-center justify-between ${
                    isActive ? 'bg-emerald-50 font-bold' : ''
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-900 font-bold truncate">
                      <span>{stock.name}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {stock.exchange}: <span className="text-slate-600 font-semibold">{stock.symbol}</span> • {stock.sector}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs font-bold text-slate-900">
                      ₹{stock.ratios.cmp.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] font-mono text-emerald-600">
                      ROCE: {stock.ratios.roce}%
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-xs text-slate-500 mb-2">
                  {isTamil ? `"${query}" என்ற பங்கு கண்டறியப்படவில்லை.` : `No stock found matching "${query}".`}
                </p>
                {onAddNewCustomStock && query.trim() && (
                  <button
                    onClick={handleAddCustom}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isTamil ? `"${query.toUpperCase()}" பங்கை ஆய்வில் சேர்க்க` : `Add "${query.toUpperCase()}" to Analyzer`}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
