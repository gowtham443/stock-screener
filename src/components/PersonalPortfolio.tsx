import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Upload, 
  Download, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  PieChart, 
  Search, 
  FileSpreadsheet,
  X,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { PortfolioItem, StockData, Language } from '../types';
import { calculateScreenerFundamentalScore } from '../utils/fundamentalEngine';
import { getTranslation } from '../utils/translations';

interface PersonalPortfolioProps {
  portfolio: PortfolioItem[];
  onUpdatePortfolio: (items: PortfolioItem[]) => void;
  availableStocks: StockData[];
  onSelectStockToScan: (stock: StockData) => void;
  language: Language;
}

export const PersonalPortfolio: React.FC<PersonalPortfolioProps> = ({
  portfolio,
  onUpdatePortfolio,
  availableStocks,
  onSelectStockToScan,
  language
}) => {
  const t = getTranslation(language);
  const isTamil = language === 'tamil';

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New holding form state
  const [newSymbol, setNewSymbol] = useState('');
  const [newQty, setNewQty] = useState<string>('');
  const [newPrice, setNewPrice] = useState<string>('');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newNotes, setNewNotes] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Map stock data for quick lookup
  const stockMap = new Map<string, StockData>();
  availableStocks.forEach(s => {
    stockMap.set(s.symbol.toUpperCase(), s);
  });

  // Calculations
  let totalInvested = 0;
  let totalCurrentValue = 0;
  let weightedScoreSum = 0;

  const enrichedHoldings = portfolio.map(item => {
    const stock = stockMap.get(item.symbol.toUpperCase());
    const cmp = stock ? stock.ratios.cmp : item.buyPrice;
    const invested = item.quantity * item.buyPrice;
    const currentVal = item.quantity * cmp;
    const pnl = currentVal - invested;
    const pnlPercent = invested > 0 ? (pnl / invested) * 100 : 0;
    
    // Fundamental score
    const scoreData = stock ? calculateScreenerFundamentalScore(stock.ratios) : null;
    const score = scoreData ? scoreData.score : 7.0;
    const verdict = scoreData ? scoreData.verdict : 'HOLD';

    totalInvested += invested;
    totalCurrentValue += currentVal;
    weightedScoreSum += score * (currentVal || 1);

    return {
      ...item,
      cmp,
      invested,
      currentVal,
      pnl,
      pnlPercent,
      score,
      verdict,
      stock
    };
  });

  const totalPnl = totalCurrentValue - totalInvested;
  const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
  const portfolioHealth = totalCurrentValue > 0 ? Number((weightedScoreSum / totalCurrentValue).toFixed(1)) : 0;

  // Add stock handler
  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    const sym = newSymbol.trim().toUpperCase();
    const qty = parseInt(newQty, 10);
    const price = parseFloat(newPrice);

    if (!sym || isNaN(qty) || qty <= 0 || isNaN(price) || price <= 0) {
      alert(isTamil ? 'சரியான பங்கு குறியீடு, அளவு மற்றும் வாங்கிய விலையை உள்ளிடவும்.' : 'Please enter valid stock symbol, quantity and buy price.');
      return;
    }

    const matchedStock = stockMap.get(sym);
    const name = matchedStock ? matchedStock.name : sym;

    const newItem: PortfolioItem = {
      id: `${sym}-${Date.now()}`,
      symbol: sym,
      name,
      quantity: qty,
      buyPrice: price,
      buyDate: newDate,
      notes: newNotes
    };

    onUpdatePortfolio([newItem, ...portfolio]);
    setNewSymbol('');
    setNewQty('');
    setNewPrice('');
    setNewNotes('');
    setIsAddOpen(false);
  };

  // Delete holding
  const handleDelete = (id: string) => {
    if (confirm(isTamil ? 'இந்த பங்கை போர்ட்ஃபோலியோவிலிருந்து நீக்க விரும்புகிறீர்களா?' : 'Delete this holding from portfolio?')) {
      onUpdatePortfolio(portfolio.filter(p => p.id !== id));
    }
  };

  // Export Portfolio to CSV
  const handleExportCSV = () => {
    const csvRows = [
      ['Symbol', 'Company Name', 'Quantity', 'Buy Price (INR)', 'Invested (INR)', 'CMP (INR)', 'Current Value (INR)', 'P&L (INR)', 'P&L (%)', 'Fundamental Score', 'Verdict']
    ];

    enrichedHoldings.forEach(h => {
      csvRows.push([
        h.symbol,
        h.name.replace(/,/g, ''),
        h.quantity.toString(),
        h.buyPrice.toFixed(2),
        h.invested.toFixed(2),
        h.cmp.toFixed(2),
        h.currentVal.toFixed(2),
        h.pnl.toFixed(2),
        h.pnlPercent.toFixed(2) + '%',
        h.score.toString(),
        h.verdict
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `My_Portfolio_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Portfolio to Excel
  const handleExportExcel = () => {
    const wsData = [
      ['Symbol', 'Company Name', 'Quantity', 'Buy Price (INR)', 'Invested (INR)', 'Live CMP (INR)', 'Current Value (INR)', 'P&L (INR)', 'P&L (%)', 'Screener Score', 'AI Verdict']
    ];

    enrichedHoldings.forEach(h => {
      wsData.push([
        h.symbol,
        h.name,
        h.quantity,
        h.buyPrice,
        h.invested,
        h.cmp,
        h.currentVal,
        h.pnl,
        Number(h.pnlPercent.toFixed(2)),
        h.score,
        h.verdict
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Portfolio');
    XLSX.writeFile(wb, `Portfolio_Screener_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Import CSV / Excel (Zerodha, Groww, or generic CSV)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (rows.length < 2) {
          alert(isTamil ? 'கோப்பில் தரவுகள் இல்லை.' : 'File appears to be empty.');
          return;
        }

        const headers = rows[0].map((h: any) => String(h).trim().toLowerCase());
        
        // Find indices for Symbol, Quantity, Buy Price
        let symIdx = headers.findIndex(h => h.includes('symbol') || h.includes('instrument') || h.includes('stock') || h.includes('ticker'));
        let qtyIdx = headers.findIndex(h => h.includes('qty') || h.includes('quantity') || h.includes('shares'));
        let priceIdx = headers.findIndex(h => h.includes('buy price') || h.includes('avg price') || h.includes('price') || h.includes('avg. cost') || h.includes('cost'));

        if (symIdx === -1) symIdx = 0;
        if (qtyIdx === -1) qtyIdx = 1;
        if (priceIdx === -1) priceIdx = 2;

        const imported: PortfolioItem[] = [];

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          const rawSym = String(row[symIdx] || '').trim().toUpperCase();
          const rawQty = parseInt(String(row[qtyIdx] || '0').replace(/,/g, ''), 10);
          const rawPrice = parseFloat(String(row[priceIdx] || '0').replace(/,/g, '').replace(/₹/g, ''));

          if (rawSym && !isNaN(rawQty) && rawQty > 0 && !isNaN(rawPrice) && rawPrice > 0) {
            const matched = stockMap.get(rawSym);
            imported.push({
              id: `${rawSym}-${Date.now()}-${i}`,
              symbol: rawSym,
              name: matched ? matched.name : rawSym,
              quantity: rawQty,
              buyPrice: rawPrice,
              buyDate: new Date().toISOString().split('T')[0]
            });
          }
        }

        if (imported.length > 0) {
          onUpdatePortfolio([...imported, ...portfolio]);
          alert(isTamil ? `${imported.length} பங்குகள் வெற்றிகரமாக இறக்குமதி செய்யப்பட்டன!` : `Successfully imported ${imported.length} holdings!`);
        } else {
          alert(isTamil ? 'பங்குகள் கண்டறியப்படவில்லை. தயவுசெய்து Symbol, Quantity, Buy Price கொண்ட கோப்பை பயன்படுத்தவும்.' : 'No valid stock rows found. Make sure file has Symbol, Quantity, and Buy Price.');
        }
      } catch (err) {
        console.error('Import error:', err);
        alert(isTamil ? 'கோப்பை படிப்பதில் பிழை ஏற்பட்டது.' : 'Failed to parse portfolio file.');
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filtered = enrichedHoldings.filter(h => 
    h.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-600" />
            <span>{t.portfolioTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t.portfolioSub}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Add Stock button */}
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addHolding}</span>
          </button>

          {/* Import CSV / Excel */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Import Zerodha, Groww or broker CSV/Excel"
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.importCsvExcel}</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv, .xlsx, .xls"
            className="hidden"
          />

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            disabled={portfolio.length === 0}
            className="px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Download as CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>CSV</span>
          </button>

          {/* Export Excel */}
          <button
            onClick={handleExportExcel}
            disabled={portfolio.length === 0}
            className="px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Download as Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Invested */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">{t.totalInvested}</div>
          <div className="text-lg sm:text-2xl font-bold text-slate-900 font-mono">
            ₹{totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{portfolio.length} {isTamil ? 'பங்குகள்' : 'Holdings'}</div>
        </div>

        {/* Current Value */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">{t.currentValue}</div>
          <div className="text-lg sm:text-2xl font-bold text-slate-900 font-mono">
            ₹{totalCurrentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{isTamil ? 'Screener நேரலை விலை' : 'Screener Live CMP'}</div>
        </div>

        {/* Overall P&L */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">{t.totalPnl}</div>
          <div className={`text-lg sm:text-2xl font-bold font-mono flex items-center gap-1 ${
            totalPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {totalPnl >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>₹{Math.abs(totalPnl).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
          <div className={`text-[11px] font-bold ${totalPnl >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {totalPnl >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}%
          </div>
        </div>

        {/* Portfolio Health Score */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">{t.portfolioHealthScore}</div>
          <div className="text-lg sm:text-2xl font-bold text-slate-900 flex items-baseline gap-1">
            <span className="text-emerald-600">{portfolioHealth > 0 ? portfolioHealth : 'N/A'}</span>
            <span className="text-xs text-slate-400">/ 10</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {portfolioHealth >= 7.8 ? (isTamil ? 'உயர்தர போர்ட்ஃபோலியோ' : 'Strong Conviction') : (isTamil ? 'சமநிலையான தரம்' : 'Balanced Quality')}
          </div>
        </div>
      </div>

      {/* 3. Holdings List Table & Mobile Card View */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="text-sm font-bold text-slate-900">
            {isTamil ? 'உங்கள் பங்குகள் பட்டியல்' : 'Your Holdings List'} ({portfolio.length})
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchStock}
              className="bg-slate-50 border border-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-52"
            />
          </div>
        </div>

        {portfolio.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <PieChart className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">{t.noHoldingsYet}</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              {t.addYourFirstStock}
            </p>
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addHolding}</span>
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">{t.holdingStock}</th>
                    <th className="py-2.5 px-3 text-right">{t.quantity}</th>
                    <th className="py-2.5 px-3 text-right">{t.avgBuyPrice}</th>
                    <th className="py-2.5 px-3 text-right">{t.liveCmp}</th>
                    <th className="py-2.5 px-3 text-right">{t.totalInvested}</th>
                    <th className="py-2.5 px-3 text-right">{t.currentValue}</th>
                    <th className="py-2.5 px-3 text-right">{t.pnl}</th>
                    <th className="py-2.5 px-3 text-center">{t.fundamentalScore}</th>
                    <th className="py-2.5 px-3 text-center">{t.quickVerdict}</th>
                    <th className="py-2.5 px-3 text-right">{t.action}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{item.symbol}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-800">{item.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-700">₹{item.buyPrice.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">₹{item.cmp.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-700">₹{Math.round(item.invested).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">₹{Math.round(item.currentVal).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-right">
                        <div className={`font-mono font-bold ${item.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {item.pnl >= 0 ? '+' : ''}₹{Math.round(item.pnl).toLocaleString('en-IN')}
                        </div>
                        <div className={`text-[10px] ${item.pnl >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {item.pnl >= 0 ? '+' : ''}{item.pnlPercent.toFixed(1)}%
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-block font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                          {item.score}/10
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.verdict === 'STRONG BUY' ? 'bg-emerald-100 text-emerald-800' :
                          item.verdict === 'BUY' ? 'bg-emerald-50 text-emerald-700' :
                          item.verdict === 'HOLD' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {item.verdict}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.stock && (
                            <button
                              onClick={() => onSelectStockToScan(item.stock!)}
                              className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                              title={t.deepScan}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title={t.delete}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden space-y-3">
              {filtered.map((item) => (
                <div key={item.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{item.symbol} • Qty: {item.quantity}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.verdict === 'STRONG BUY' ? 'bg-emerald-100 text-emerald-800' :
                      item.verdict === 'BUY' ? 'bg-emerald-50 text-emerald-700' :
                      item.verdict === 'HOLD' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {item.verdict} ({item.score}/10)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60 font-mono">
                    <div>
                      <span className="text-slate-500 text-[10px] block">{t.avgBuyPrice}:</span>
                      <span className="font-bold text-slate-800">₹{item.buyPrice}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">{t.liveCmp}:</span>
                      <span className="font-bold text-slate-900">₹{item.cmp}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">{t.currentValue}:</span>
                      <span className="font-bold text-slate-900">₹{Math.round(item.currentVal).toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">{t.pnl}:</span>
                      <span className={`font-bold ${item.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {item.pnl >= 0 ? '+' : ''}₹{Math.round(item.pnl)} ({item.pnlPercent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                    {item.stock ? (
                      <button
                        onClick={() => onSelectStockToScan(item.stock!)}
                        className="text-emerald-600 font-bold text-xs flex items-center gap-1 hover:underline"
                      >
                        <span>{t.deepScan}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : <div></div>}

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.delete}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add Stock Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>{t.addHolding}</span>
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStock} className="space-y-3.5 mt-4 text-xs">
              {/* Stock Symbol selection or custom */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {isTamil ? 'பங்கு குறியீடு (Stock Symbol)' : 'Stock Symbol (NSE/BSE)'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TATAMOTORS, CDSL, ITC, RELIANCE"
                  value={newSymbol}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    setNewSymbol(val);
                    const matched = stockMap.get(val);
                    if (matched && !newPrice) {
                      setNewPrice(matched.ratios.cmp.toString());
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono text-slate-900 uppercase focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {availableStocks.slice(0, 5).map(s => (
                    <button
                      type="button"
                      key={s.symbol}
                      onClick={() => {
                        setNewSymbol(s.symbol);
                        setNewPrice(s.ratios.cmp.toString());
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-mono cursor-pointer"
                    >
                      {s.symbol}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {isTamil ? 'பங்குகளின் எண்ணிக்கை (Quantity)' : 'Quantity (Shares)'}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 50"
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono text-slate-900 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Buy Price */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {isTamil ? 'வாங்கிய விலை (Buy Price ₹)' : 'Buy Price per share (₹)'}
                </label>
                <input
                  type="number"
                  step="0.05"
                  required
                  placeholder="e.g. 965.00"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono text-slate-900 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {isTamil ? 'குறிப்புகள் (விருப்பத்தேர்வு)' : 'Notes / Target (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Long term SIP, EV growth theme"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                >
                  {t.addHolding}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
