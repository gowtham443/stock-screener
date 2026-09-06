import React from 'react';
import { X, Award, CheckCircle2, AlertCircle, Info, BarChart3 } from 'lucide-react';
import { ScoreBreakdown, Language } from '../types';

interface ScoreBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  breakdown: ScoreBreakdown;
  stockName: string;
  symbol: string;
  totalScore: number;
  language: Language;
}

export const ScoreBreakdownModal: React.FC<ScoreBreakdownModalProps> = ({
  isOpen,
  onClose,
  breakdown,
  stockName,
  symbol,
  totalScore,
  language
}) => {
  if (!isOpen) return null;

  const isTamil = language === 'tamil';

  const pillars = [
    {
      title: isTamil ? '1. மூலதன வருவாய் திறன் (Capital Efficiency)' : '1. Capital Efficiency (ROCE & ROE)',
      pillar: breakdown.capitalEfficiency,
      weight: '2.8 Pts'
    },
    {
      title: isTamil ? '2. கடன் நிலை & பாதுகாப்பு (Solvency & Debt Health)' : '2. Solvency & Debt Health (Debt to Equity)',
      pillar: breakdown.solvencyDebt,
      weight: '2.5 Pts'
    },
    {
      title: isTamil ? '3. கூட்டு வளர்ச்சி (3Y Growth Compounding)' : '3. 3-Year Compounding Growth (Sales & Profit)',
      pillar: breakdown.growthTrack,
      weight: '2.2 Pts'
    },
    {
      title: isTamil ? '4. நிர்வாகம் & பங்குகள் அடமானம் (Corporate Governance)' : '4. Promoter Governance & Share Pledge',
      pillar: breakdown.governance,
      weight: '1.5 Pts'
    },
    {
      title: isTamil ? '5. மதிப்பீடு & பாதுகாப்பு வரம்பு (Valuation & Safety)' : '5. Valuation & Margin of Safety (P/E Multiple)',
      pillar: breakdown.valuationSafety,
      weight: '1.0 Pt'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isTamil ? 'அடிப்படை மதிப்பெண் விளக்கம் (Score Breakdown)' : 'Fundamental Score Math Breakdown'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {symbol} • {stockName}
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

        {/* Total Score Banner */}
        <div className="my-4 p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              {isTamil ? 'Screener மொத்த மதிப்பெண்' : 'Screener Composite Score'}
            </div>
            <div className="text-xs text-emerald-400 mt-0.5">
              {totalScore >= 7.8 ? (isTamil ? 'வலுவான தேர்வு (Strong Buy)' : 'Strong Buy Threshold') : totalScore >= 6.5 ? (isTamil ? 'சாதகமான தேர்வு (Buy)' : 'Buy Threshold') : (isTamil ? 'பொறுத்திருக்கவும் / தவிர்க்கவும்' : 'Hold / Avoid Threshold')}
            </div>
          </div>
          <div className="flex items-baseline gap-1 bg-white/10 px-4 py-2 rounded-lg border border-white/10">
            <span className="text-3xl font-black text-emerald-400">{totalScore}</span>
            <span className="text-xs text-slate-300">/ 10.0</span>
          </div>
        </div>

        {/* 5 Pillars Breakdown */}
        <div className="space-y-3">
          {pillars.map((item, idx) => {
            const p = item.pillar;
            const pct = Math.min(100, Math.round((p.score / p.maxScore) * 100));

            return (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.title}</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {p.score} / {p.maxScore}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {p.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Note */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-2 text-blue-900 text-xs">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            {isTamil 
              ? 'இந்த மதிப்பெண் Screener.in இருப்புநிலைக் குறிப்பு (Balance Sheet), ROCE, லாப வளர்ச்சி மற்றும் கடன் விகிதங்களை அடிப்படையாகக் கொண்டு துல்லியமாக கணக்கிடப்படுகிறது. எண்களை நீங்கள் திருத்தினால் மதிப்பெண் உடனடியாக மாறும்.'
              : 'This score is dynamically computed from Screener balance sheet metrics (ROCE, D/E, 3Y growth CAGR, Promoter Pledge). Editing any ratio live updates this score.'}
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isTamil ? 'மூடு (Close)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
