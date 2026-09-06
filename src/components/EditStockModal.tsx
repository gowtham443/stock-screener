import React, { useState } from 'react';
import { X, Save, RotateCcw, Sliders, AlertCircle } from 'lucide-react';
import { FinancialRatios, Language, StockData } from '../types';
import { getTranslation } from '../utils/translations';

interface EditStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: StockData;
  onSave: (updatedStock: StockData) => void;
  language: Language;
}

export const EditStockModal: React.FC<EditStockModalProps> = ({
  isOpen,
  onClose,
  stock,
  onSave,
  language
}) => {
  if (!isOpen) return null;

  const t = getTranslation(language);
  const isTamil = language === 'tamil';

  const [formData, setFormData] = useState<FinancialRatios>({ ...stock.ratios });

  const handleChange = (field: keyof FinancialRatios, value: string) => {
    const num = parseFloat(value);
    setFormData(prev => ({
      ...prev,
      [field]: isNaN(num) ? 0 : num
    }));
  };

  const handleSave = () => {
    const updated: StockData = {
      ...stock,
      ratios: formData
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t.editModalTitle}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {stock.exchange}: {stock.symbol} • {stock.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 my-3">
          {t.editModalSub}
        </p>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* CMP */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              {isTamil ? 'தற்போதைய சந்தை விலை (CMP ₹)' : 'Current Market Price (CMP ₹)'}
            </label>
            <input
              type="number"
              value={formData.cmp}
              onChange={(e) => handleChange('cmp', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Stock P/E */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              {isTamil ? 'பங்கு P/E (Stock P/E)' : 'Stock P/E Ratio'}
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.pe}
              onChange={(e) => handleChange('pe', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Industry P/E */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              {isTamil ? 'துறை P/E (Industry P/E)' : 'Industry P/E Benchmark'}
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.industryPe}
              onChange={(e) => handleChange('industryPe', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* ROCE */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              {isTamil ? 'ROCE (%) மூலதன வருவாய்' : 'ROCE (%) Return on Capital'}
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.roce}
              onChange={(e) => handleChange('roce', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* ROE */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              {isTamil ? 'ROE (%) பங்கு மூலதன வருவாய்' : 'ROE (%) Return on Equity'}
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.roe}
              onChange={(e) => handleChange('roe', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Debt to Equity */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              {isTamil ? 'கடன் / பங்கு விகிதம் (Debt to Equity)' : 'Debt to Equity Ratio (0 = Zero Debt)'}
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.debtToEquity}
              onChange={(e) => handleChange('debtToEquity', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* 3Y Sales Growth */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              {isTamil ? '3 ஆண்டு விற்பனை CAGR (%)' : '3-Year Sales Growth CAGR (%)'}
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.salesGrowth3Yr}
              onChange={(e) => handleChange('salesGrowth3Yr', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* 3Y Profit Growth */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              {isTamil ? '3 ஆண்டு லாப CAGR (%)' : '3-Year Profit Growth CAGR (%)'}
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.profitGrowth3Yr}
              onChange={(e) => handleChange('profitGrowth3Yr', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Promoter Holding */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              {isTamil ? 'நிறுவனர்கள் பங்கு (%)' : 'Promoter Holding (%)'}
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.promoterHolding}
              onChange={(e) => handleChange('promoterHolding', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Promoter Pledged */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              {isTamil ? 'அடமானம் வைக்கப்பட்ட பங்கு (%)' : 'Promoter Pledged Shares (%)'}
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.promoterPledged}
              onChange={(e) => handleChange('promoterPledged', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* 52W High */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              {isTamil ? '52 வார உச்சம் (52W High ₹)' : '52-Week High (₹)'}
            </label>
            <input
              type="number"
              value={formData.high52Week}
              onChange={(e) => handleChange('high52Week', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* 52W Low */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">
              {isTamil ? '52 வார வீழ்ச்சி (52W Low ₹)' : '52-Week Low (₹)'}
            </label>
            <input
              type="number"
              value={formData.low52Week}
              onChange={(e) => handleChange('low52Week', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            {t.cancel}
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t.saveAndRecompute}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
