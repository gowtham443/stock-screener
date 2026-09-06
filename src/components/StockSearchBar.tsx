import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Sparkles, Building2, TrendingUp } from 'lucide-react';
import { StockData, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { generateIndianStockData } from '../data/indianStocksData';

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
  const [apiResults, setApiResults] = useState<StockData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = getTranslation(language);
  const isTamil = language === 'tamil';

  // Filter existing stocks
  const localMatches = availableStocks.filter(s => 
    s.symbol.toLowerCase().includes(query.toLowerCase()) ||
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.sector.toLowerCase().includes(query.toLowerCase())
  );

  // Debounced API search for all Indian stocks
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setApiResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data: StockData[] = await res.json();
          // Merge results not already in availableStocks
          const external = data.filter(d => !availableStocks.some(a => a.symbol === d.symbol));
          setApiResults(external);
        }
      } catch (err) {
        console.warn('Live API search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, availableStocks]);

  // Combined results
  const allResults = [...localMatches, ...apiResults];

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

  const handleEnterOrAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    // If matches exist, pick top one
    if (allResults.length > 0) {
      handleSelect(allResults[0]);
      return;
    }

    // Otherwise synthesize stock data for this Indian ticker
    const generated = generateIndianStockData(query.trim().toUpperCase());
    onSelectStock(generated);
    if (onAddNewCustomStock) {
      onAddNewCustomStock(query.trim().toUpperCase());
    }
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleEnterOrAdd} className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 sm:top-2.5 text-slate-400" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={isTamil ? 'அனைத்து இந்திய பங்குகள் தேடுக (Tata, HDFC, HAL)...' : 'Search Indian stocks (Tata, HDFC, HAL, Zomato)...'}
          className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 text-sm sm:text-xs rounded-xl sm:rounded-lg pl-10 pr-10 py-2.5 sm:py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setApiResults([]); }}
            className="absolute right-2.5 top-2 sm:top-1.5 text-slate-400 hover:text-slate-600 text-sm p-1.5 cursor-pointer"
          >
            ✕
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 max-h-96 overflow-y-auto">
          <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-2">
            <span>{isTamil ? 'NSE / BSE இந்திய பங்குத்தள முடிவுகள்' : 'NSE / BSE Indian Stocks'}</span>
            <span className="text-emerald-600">
              {isSearching ? (isTamil ? 'தேடுகிறது...' : 'Searching live...') : `${allResults.length} ${isTamil ? 'பங்குகள்' : 'stocks'}`}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {allResults.slice(0, 12).map((stock) => {
              const isActive = stock.symbol === activeStock.symbol;
              return (
                <div
                  key={stock.symbol}
                  onClick={() => handleSelect(stock)}
                  className={`px-3.5 py-2.5 hover:bg-emerald-50/70 transition-colors cursor-pointer flex items-center justify-between group ${
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
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                      <span className="text-emerald-700 bg-emerald-50 px-1 rounded font-bold">{stock.exchange}</span>
                      <span className="text-slate-700 font-bold">{stock.symbol}</span>
                      <span>•</span>
                      <span className="truncate">{stock.sector}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs font-bold text-slate-900">
                      ₹{stock.ratios.cmp.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] font-mono text-emerald-600 font-semibold">
                      ROCE: {stock.ratios.roce}% | P/E: {stock.ratios.pe}x
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Custom stock addition fallback */}
            {query.trim().length > 0 && (
              <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleEnterOrAdd()}
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {isTamil 
                      ? `"${query.toUpperCase()}" பங்கை Screener-ல் ஆய்வு செய்க` 
                      : `Analyze "${query.toUpperCase()}" via Screener Engine`}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
