import React from 'react';
import { X, CheckCircle, HelpCircle, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface ScreenerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ScreenerGuideModal: React.FC<ScreenerGuideModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;
  const isTamil = language === 'tamil';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">
              {isTamil ? 'Screener பங்கு ஆய்வு மற்றும் முதலீட்டு வழிகாட்டி' : 'Screener Analysis & Investment Guide'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 mt-4 text-xs text-slate-600 leading-relaxed">
          {/* 4 Core Questions */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isTamil ? 'உங்களுக்கான 4 முக்கிய விடைகள்' : 'The 4 Core Investment Decisions'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900 text-xs">
                  {isTamil ? '1. வாங்கலாமா? (Buy Verdict)' : '1. Buy Verdict & Composite Score'}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {isTamil 
                    ? 'Strong Buy / Buy / Hold / Avoid நிலை மற்றும் 0 முதல் 10 வரையிலான அடிப்படை மதிப்பெண்.' 
                    : 'Clear ratings (Strong Buy / Buy / Hold / Avoid) powered by Screener balance sheet math.'}
                </p>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <div className="font-bold text-blue-900 text-xs">
                  {isTamil ? '2. இப்போதே வாங்கலாமா? (Entry Timing)' : '2. When to Buy? (Entry Timing & Levels)'}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {isTamil
                    ? 'இப்போதே வாங்கலாமா அல்லது விலை இறங்கும் போது (Dip) வாங்கலாமா? ஆதரவு விலை (Support) மற்றும் வாங்கும் வரம்பு.'
                    : 'Immediate vs phased tranche accumulation strategy with ideal buy zones and key support/resistance levels.'}
                </p>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <div className="font-bold text-emerald-800 text-xs">
                  {isTamil ? '3. ஏன் வாங்க வேண்டும்? (Why to Buy)' : '3. Why to Buy (Core Strengths)'}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {isTamil
                    ? 'நிறுவனத்தின் சிறந்த காரணங்கள்: ROCE > 15%, கடன் இல்லா நிலை (Zero Debt), விற்பனை மற்றும் லாப வளர்ச்சி.'
                    : 'Top fundamental drivers: Industry-leading ROCE, debt-free balance sheet, sales CAGR, insider ownership.'}
                </p>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <div className="font-bold text-rose-800 text-xs">
                  {isTamil ? '4. ஏன் வாங்கக் கூடாது? (Risks & Red Flags)' : '4. Why NOT to Buy (Risks & Red Flags)'}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {isTamil
                    ? 'முக்கியமான அபாயங்கள்: பங்குகள் அடமானம் (Promoter Pledging), அதிக கடன், உச்ச மதிப்பீடு (Overvalued P/E).'
                    : 'Pledged shares warnings, high debt-to-equity leverage, earnings multiple stretch, margin compression.'}
                </p>
              </div>
            </div>
          </div>

          {/* Screener Export Step-by-Step */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              {isTamil ? 'Screener.in-லிருந்து எக்செல் ஏற்றுமதி செய்வது எப்படி?' : 'How to Export from Screener.in'}
            </h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-slate-600 text-[11px]">
              <li><b>Screener.in</b> {isTamil ? 'வலைதளத்திற்கு செல்லவும்.' : 'website.'}</li>
              <li>{isTamil ? 'நீங்கள் ஆய்வு செய்ய விரும்பும் நிறுவனத்தை தேடவும் (எ.கா: Tata Motors, CDSL, ITC).' : 'Search any company (e.g. Tata Motors, CDSL, ITC).'}</li>
              <li>{isTamil ? 'நிறுவன பக்கத்தில் உள்ள "Export to Excel" பட்டனை கிளிக் செய்யவும்.' : 'Click "Export to Excel" on the top-right of the stock page.'}</li>
              <li>{isTamil ? 'அல்லது உங்கள் சொந்த Custom Query முடிவுகளை CSV/Excel ஆக பதிவிறக்கவும்.' : 'Or export your custom Screener query results as CSV/Excel.'}</li>
              <li>{isTamil ? 'இந்த அப்ளிகேஷனில் உள்ள "Upload Excel" பட்டனை அழுத்தி கோப்பை பதிவேற்றி உடனடி முழுமையான ஆய்வை பெறவும்.' : 'Click "Upload Excel" in this app to sync real financial data instantly!'}</li>
            </ol>
          </div>

          {/* Language support */}
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
            <b>{isTamil ? 'மொழி தேர்வு:' : 'Language Toggle:'}</b> {isTamil ? 'ஹெடரில் உள்ள தமிழ் மற்றும் English பட்டன்களை பயன்படுத்தி எந்த நேரத்திலும் மொழியை மாற்றிக்கொள்ளலாம்.' : 'Toggle between pure Tamil and English seamlessly using the header buttons.'}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1E293B] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            {isTamil ? 'புரிந்தது (Got it)' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
