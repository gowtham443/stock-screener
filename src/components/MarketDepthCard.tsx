import React from 'react';
import { AnalysisResponse, Language } from '../types';
import { BarChart2, TrendingUp } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface MarketDepthCardProps {
  analysis: AnalysisResponse;
  language: Language;
}

export const MarketDepthCard: React.FC<MarketDepthCardProps> = ({ analysis, language }) => {
  const { marketDepth, ratios } = analysis;
  const t = getTranslation(language);
  const isTamil = language === 'tamil';

  const totalOrders = marketDepth.buyQty + marketDepth.sellQty;
  const buyRatio = totalOrders > 0 ? Math.round((marketDepth.buyQty / totalOrders) * 100) : 60;
  const sellRatio = 100 - buyRatio;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {/* 1. NSE Market Depth */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{isTamil ? 'NSE நேரலை சந்தை ஆழம்' : 'NSE Live Market Depth'}</span>
            </h4>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {buyRatio >= 50 ? t.buyerPressure : t.sellerPressure} ({buyRatio}%)
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between text-xs border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">{t.totalBuyQty}</span>
              <span className="font-mono text-emerald-600 font-bold text-sm">
                {marketDepth.buyQty.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between text-xs border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">{t.totalSellQty}</span>
              <span className="font-mono text-rose-600 font-bold text-sm">
                {marketDepth.sellQty.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Depth ratio bar */}
            <div className="pt-1">
              <div className="w-full bg-rose-100 h-2 rounded-full overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full rounded-l-full" 
                  style={{ width: `${buyRatio}%` }}
                ></div>
                <div 
                  className="bg-rose-500 h-full rounded-r-full" 
                  style={{ width: `${sellRatio}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>{isTamil ? 'வாங்குவோர்' : 'Bid'} {buyRatio}%</span>
                <span>{isTamil ? 'விற்போர்' : 'Ask'} {sellRatio}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>{isTamil ? 'பணப்புழக்கம் (Liquidity):' : 'Spread & Liquidity:'}</span>
          <span className="text-emerald-700 font-semibold">{isTamil ? 'உயர் நிறுவன வர்த்தகம்' : 'High Institutional Volume'}</span>
        </div>
      </div>

      {/* 2. BSE Delivery Insight */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
              <span>{isTamil ? 'BSE டெலிவரி & சேகரிப்பு' : 'BSE Delivery & Accumulation'}</span>
            </h4>
            <span className="text-[10px] font-mono text-slate-400">T+1 Settlement</span>
          </div>

          <div className="flex items-center gap-4 my-2">
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <div 
                className="w-14 h-14 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" 
                style={{ animationDuration: '4s' }}
              ></div>
              <span className="absolute text-xs font-bold text-slate-900">
                {marketDepth.deliveryPercentage}%
              </span>
            </div>

            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900">
                {marketDepth.deliveryPercentage}% {t.deliveryVolume}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                {isTamil && marketDepth.deliveryInsight.includes('Smart money')
                  ? 'நீண்ட கால முதலீட்டாளர்கள் மற்றும் நிறுவனங்கள் பங்குகளை தங்கள் டீமேட் கணக்கில் டெலிவரியாக எடுத்துச் செல்கின்றனர்.'
                  : marketDepth.deliveryInsight}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">{isTamil ? 'இலவச பணப்புழக்கம் (FCF):' : 'Free Cash Flow:'}</span>
          <span className="font-mono text-slate-800 font-bold">
            ₹{ratios.freeCashFlowCr ? `${ratios.freeCashFlowCr.toLocaleString('en-IN')} Cr` : 'Positive'}
          </span>
        </div>
      </div>
    </div>
  );
};
