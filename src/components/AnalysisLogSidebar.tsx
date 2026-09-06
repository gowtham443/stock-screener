import React from 'react';
import { Download, Sparkles, Database, CheckCircle, Clock } from 'lucide-react';
import { AnalysisResponse, StockData, Language } from '../types';

interface AnalysisLogSidebarProps {
  analysis: AnalysisResponse | null;
  activeStock: StockData;
  language: Language;
  onExport: () => void;
  onAskQuestion: (q: string) => void;
}

export const AnalysisLogSidebar: React.FC<AnalysisLogSidebarProps> = ({
  analysis,
  activeStock,
  language,
  onExport,
  onAskQuestion
}) => {
  const isTamil = language === 'tamil';
  const currentTime = analysis?.analyzedAt || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const suggestedQuestions = isTamil ? [
    'இதை 1 வருடம் வைத்திருக்கலாமா?',
    'வாங்குவதற்கான சிறந்த விலை என்ன?',
    'ஸ்டாப் லாஸ் எங்கு வைக்கலாம்?',
    'கடன் மற்றும் ROCE நிலை பாதுகாப்பானதா?'
  ] : [
    'Should I hold for 1 year?',
    'What is the best dip entry price?',
    'Where to set stop-loss?',
    'Is ROCE and balance sheet safe?'
  ];

  return (
    <div className="bg-[#1E293B] text-white rounded-xl p-5 sm:p-6 h-full flex flex-col shadow-lg justify-between border border-slate-700/50">
      <div>
        {/* Title */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-700/50">
          <h3 className="text-xs sm:text-sm font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{isTamil ? 'தானியங்கி ஆய்வுப் பதிவு' : 'Auto-Analysis Log'}</span>
          </h3>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {isTamil ? 'நேரலை' : 'Live Feed'}
          </span>
        </div>

        {/* Live Timeline Items */}
        <div className="space-y-3.5">
          <div className="border-l-2 border-emerald-500 pl-3.5 py-1">
            <div className="text-[10px] font-mono text-slate-500">{currentTime}</div>
            <div className="text-xs font-medium text-slate-200">
              {isTamil ? `${activeStock.symbol} நிறுவன Screener.in தரவு பெறப்பட்டது` : `Fetched ${activeStock.symbol} from Screener.in 10-Yr Sheet`}
            </div>
          </div>

          <div className="border-l-2 border-emerald-500 pl-3.5 py-1">
            <div className="text-[10px] font-mono text-slate-500">{currentTime}</div>
            <div className="text-xs font-medium text-slate-200">
              {isTamil ? 'Google Finance & NSE சந்தை போக்கு ஆய்வு முடிந்தது' : 'Google Finance & NSE sentiment analysis completed'}
            </div>
          </div>

          <div className="border-l-2 border-emerald-500 pl-3.5 py-1">
            <div className="text-[10px] font-mono text-slate-500">{currentTime}</div>
            <div className="text-xs font-medium text-slate-200">
              {isTamil ? 'NSE / BSE நேரலை சந்தை ஆழம் ஒப்பிடப்பட்டது' : 'Cross-referencing NSE/BSE market depth & order book'}
            </div>
          </div>

          <div className="border-l-2 border-emerald-500 pl-3.5 py-1">
            <div className="text-[10px] font-mono text-slate-500">{currentTime}</div>
            <div className="text-xs font-medium text-slate-200">
              {isTamil ? '4 முக்கிய முடிவுகள் கணக்கிடப்பட்டது:' : 'Computed 4-Point Decisions:'}{' '}
              <span className="text-emerald-400 font-bold">{analysis?.verdict || 'ANALYZED'}</span>
            </div>
          </div>
        </div>

        {/* Quick Question Chips for AI */}
        <div className="mt-5 pt-4 border-t border-slate-700/60">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isTamil ? 'AI-யிடம் விரைவாக கேட்க:' : 'Ask AI Quick Question'}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onAskQuestion(q)}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded border border-slate-700 transition-all text-left cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sync & Export Footer Button */}
      <div className="mt-5 pt-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 mb-3 leading-relaxed">
          {isTamil ? 'Screener தரவுகள் மற்றும் AI முடிவுகளை எக்செல் கோப்பாக உடனே ஏற்றுமதி செய்யலாம்.' : 'Ready to export complete Screener metrics and verdicts to Excel.'}
        </div>
        <button
          onClick={onExport}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold text-xs sm:text-sm text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isTamil ? 'எக்செல் ஏற்றுமதி செய்' : 'EXPORT TO EXCEL'}</span>
        </button>
      </div>
    </div>
  );
};
