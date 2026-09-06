import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Flame, 
  Clock, 
  Target,
  ArrowRight,
  Sliders,
  HelpCircle,
  Award
} from 'lucide-react';
import { AnalysisResponse, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface StockAnalysisCardProps {
  analysis: AnalysisResponse;
  language: Language;
  onOpenBreakdown?: () => void;
  onOpenEditRatios?: () => void;
}

export const StockAnalysisCard: React.FC<StockAnalysisCardProps> = ({
  analysis,
  language,
  onOpenBreakdown,
  onOpenEditRatios
}) => {
  const t = getTranslation(language);
  const isTamil = language === 'tamil';

  const {
    name,
    symbol,
    sector,
    exchange,
    cmp,
    verdict,
    score,
    technicalTrend,
    newsSentiment,
    verdictSummary,
    ipaVangalama,
    enVanganum,
    enVangaKudathu,
    ratios,
    valuationStatus
  } = analysis;

  // Badge color based on verdict
  const getVerdictStyle = () => {
    switch (verdict) {
      case 'STRONG BUY':
        return {
          textColor: 'text-emerald-600',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          label: isTamil ? 'உடனடி வாங்கல் (STRONG BUY)' : 'STRONG BUY'
        };
      case 'BUY':
        return {
          textColor: 'text-emerald-600',
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: isTamil ? 'வாங்கலாம் (BUY)' : 'BUY'
        };
      case 'HOLD':
        return {
          textColor: 'text-amber-600',
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
          label: isTamil ? 'பொறுத்திருக்கவும் (HOLD)' : 'HOLD'
        };
      case 'AVOID':
      default:
        return {
          textColor: 'text-rose-600',
          badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
          label: isTamil ? 'தவிர்க்கவும் (AVOID)' : 'AVOID'
        };
    }
  };

  const verdictStyle = getVerdictStyle();

  // Price position in 52-week range (0 to 100)
  const range52w = ratios.high52Week - ratios.low52Week;
  const position52w = range52w > 0 ? Math.min(100, Math.max(0, Math.round(((cmp - ratios.low52Week) / range52w) * 100))) : 50;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm space-y-5">
      {/* 1. Header: Name, Symbol, Valuation & AI Verdict */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{name}</h2>
            <span className="text-slate-400 font-mono text-xs sm:text-sm">{exchange}: {symbol}</span>
            <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded border border-slate-200">
              {valuationStatus}
            </span>
          </div>
          <div className="text-slate-500 text-xs sm:text-sm">
            {sector} • Market Cap: ₹{(ratios.marketCapCr / 1000).toFixed(1)}K Cr • CMP: <span className="font-bold text-slate-900">₹{cmp.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Verdict Badge & Quick Edit */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
          <div className="text-left sm:text-right">
            <div className={`text-2xl sm:text-3xl font-black tracking-tight ${verdictStyle.textColor}`}>
              {verdict}
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {isTamil ? 'Screener முடிவு' : 'Screener Verdict'}
            </div>
          </div>

          {onOpenEditRatios && (
            <button
              onClick={onOpenEditRatios}
              className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{t.editRatios}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top Metric Blocks with Clickable Score Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Fundamental Score (Interactive) */}
        <div 
          onClick={onOpenBreakdown}
          className="bg-slate-50 hover:bg-emerald-50/50 p-3.5 rounded-xl border border-slate-200/80 transition-all cursor-pointer group"
          title="Click to view 5-pillar mathematical score breakdown"
        >
          <div className="text-xs text-slate-500 mb-1 flex items-center justify-between">
            <span className="font-medium group-hover:text-emerald-700 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.fundamentalScore}</span>
            </span>
            <span className="text-[10px] text-emerald-600 underline font-semibold">
              {t.scoreBreakdown}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-emerald-700">
              {score}
            </span>
            <span className="text-xs text-slate-400 font-bold">/ 10</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {score >= 7.8 ? (isTamil ? 'அதிக பலம் வாய்ந்த இருப்புநிலை' : 'Robust Balance Sheet') : (isTamil ? 'சமநிலையான நிதிநிலை' : 'Moderate Fundamentals')}
          </div>
        </div>

        {/* Technical Trend */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          <div className="text-xs text-slate-500 mb-1 flex items-center justify-between">
            <span>{t.technicalTrend}</span>
            <span className="text-[10px] text-slate-400">50/200 DMA</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 flex items-center gap-1.5">
            <TrendingUp className="w-5 h-5" />
            <span>{technicalTrend}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {isTamil ? 'சந்தை ஆதரவு நிலைக்கு மேல் உள்ளது' : 'Trading above critical moving averages'}
          </div>
        </div>

        {/* News Sentiment */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          <div className="text-xs text-slate-500 mb-1 flex items-center justify-between">
            <span>{t.newsSentiment}</span>
            <span className="text-[10px] text-slate-400">NSE / Corporate</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-blue-600 flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-blue-500" />
            <span>{newsSentiment}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {isTamil ? 'சமீபத்திய அறிவிப்புகள் சாதகமாக உள்ளன' : 'Institutional investor sentiment positive'}
          </div>
        </div>
      </div>

      {/* 3. Question 1: Vangalama? (Buy Verdict Summary) */}
      <div className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs sm:text-sm font-medium flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-emerald-400">
            {t.q1Title}:{' '}
          </span>
          {verdictSummary}
        </div>
      </div>

      {/* 4. Question 2: Ipa Vangalama? (Entry Timing, Ideal Buy Price & Strategy) */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 text-white rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-blue-950 uppercase tracking-wide">
                {t.q2Title}
              </h3>
              <p className="text-xs text-blue-800 font-semibold">{ipaVangalama.title}</p>
            </div>
          </div>

          <div className="bg-white border border-blue-200 px-3 py-1 rounded-lg text-xs font-semibold text-blue-900 shadow-2xs">
            {t.idealRange} <span className="font-bold text-blue-700">{ipaVangalama.idealBuyRange}</span>
          </div>
        </div>

        <p className="text-xs text-blue-900 leading-relaxed mb-3.5">
          {ipaVangalama.actionableAdvice}
        </p>

        {/* 52-Week Range Bar */}
        <div className="bg-white p-3 rounded-lg border border-blue-100 space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-600 font-medium">
            <span>52W Low: <b className="text-slate-800">₹{ratios.low52Week}</b></span>
            <span className="text-blue-700 font-bold">CMP: ₹{cmp} ({position52w}% of Range)</span>
            <span>52W High: <b className="text-slate-800">₹{ratios.high52Week}</b></span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden relative">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${position52w}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
            <span>{t.support} ₹{ipaVangalama.supportLevel}</span>
            <span className="font-mono text-emerald-700 font-semibold">{t.allocationStrategy} {ipaVangalama.suggestedAllocation}</span>
            <span>{t.resistance} ₹{ipaVangalama.resistanceLevel}</span>
          </div>
        </div>
      </div>

      {/* 5. Questions 3 & 4: En Vanganum vs En Vanga Kudathu */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
          {isTamil ? 'முக்கிய காரணங்கள் & அபாயங்கள்' : 'Investment Thesis & Risk Analysis'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 3: Why to Buy (En Vanganum) */}
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-800 uppercase mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.q3Title}</span>
              </div>
              <ul className="text-xs text-emerald-950 space-y-2 list-disc pl-4 leading-relaxed">
                {enVanganum.points.map((point, index) => (
                  <li key={index} className="font-medium">{point}</li>
                ))}
              </ul>
            </div>
            {enVanganum.highlightQuote && (
              <div className="mt-3 pt-2.5 border-t border-emerald-200/70 text-[11px] text-emerald-800 italic font-semibold">
                "{enVanganum.highlightQuote}"
              </div>
            )}
          </div>

          {/* Question 4: Why NOT to Buy (En Vanga Kudathu / Risks) */}
          <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-rose-800 uppercase mb-2.5 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{t.q4Title}</span>
                <span className="ml-auto text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded font-bold">
                  {enVangaKudathu.riskLevel} {isTamil ? 'அபாயம்' : 'Risk'}
                </span>
              </div>
              <ul className="text-xs text-rose-950 space-y-2 list-disc pl-4 leading-relaxed">
                {enVangaKudathu.points.map((point, index) => (
                  <li key={index} className="font-medium">{point}</li>
                ))}
              </ul>
            </div>
            <div className="mt-3 pt-2.5 border-t border-rose-200/70 text-[11px] text-rose-800 font-semibold flex items-center justify-between">
              <span>{isTamil ? 'கடன் & அடமானம் நிலை:' : 'Solvency & Pledging:'}</span>
              <span className="font-mono">{ratios.debtToEquity === 0 ? 'Zero Debt' : `D/E ${ratios.debtToEquity}`} | {ratios.promoterPledged}% Pledged</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Screener Key Financial Indicators */}
      <div className="pt-2 border-t border-slate-100">
        <div className="text-xs font-bold uppercase text-slate-400 mb-3 flex items-center justify-between">
          <span>{t.financialHealth}</span>
          <span className="text-[10px] font-normal text-slate-400">Screener.in Data</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <div className="text-[10px] text-slate-500 font-medium">{t.roceLabel}</div>
            <div className="text-sm font-bold text-slate-900">{ratios.roce}%</div>
            <div className="text-[9px] text-emerald-600 font-medium">&gt; 15% Safe</div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <div className="text-[10px] text-slate-500 font-medium">{t.roeLabel}</div>
            <div className="text-sm font-bold text-slate-900">{ratios.roe}%</div>
            <div className="text-[9px] text-emerald-600 font-medium">Equities Return</div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <div className="text-[10px] text-slate-500 font-medium">{t.peLabel}</div>
            <div className="text-sm font-bold text-slate-900">{ratios.pe}</div>
            <div className="text-[9px] text-slate-400 font-medium">Ind: {ratios.industryPe}</div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <div className="text-[10px] text-slate-500 font-medium">{t.debtToEquityLabel}</div>
            <div className={`text-sm font-bold ${ratios.debtToEquity > 1 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {ratios.debtToEquity}
            </div>
            <div className="text-[9px] text-slate-400 font-medium">&lt; 0.5 Low Debt</div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <div className="text-[10px] text-slate-500 font-medium">{t.salesGrowthLabel}</div>
            <div className="text-sm font-bold text-slate-900">{ratios.salesGrowth3Yr}%</div>
            <div className="text-[9px] text-slate-400 font-medium">CAGR</div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <div className="text-[10px] text-slate-500 font-medium">{t.profitGrowthLabel}</div>
            <div className="text-sm font-bold text-slate-900">{ratios.profitGrowth3Yr}%</div>
            <div className="text-[9px] text-slate-400 font-medium">CAGR</div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <div className="text-[10px] text-slate-500 font-medium">{t.promoterHoldLabel}</div>
            <div className="text-sm font-bold text-slate-900">{ratios.promoterHolding}%</div>
            <div className="text-[9px] text-slate-400 font-medium">{ratios.promoterPledged}% Pledged</div>
          </div>
        </div>
      </div>
    </div>
  );
};
