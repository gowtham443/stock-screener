import React from 'react';
import { TrendingUp, TrendingDown, Activity, Globe2, ShieldCheck, User } from 'lucide-react';
import { Language, UserProfile } from '../types';

interface MarketPulseBarProps {
  language: Language;
  user: UserProfile | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const MarketPulseBar: React.FC<MarketPulseBarProps> = ({
  language,
  user,
  onOpenLogin,
  onLogout
}) => {
  const isTamil = language === 'tamil';

  const indices = [
    { name: 'NIFTY 50', value: '24,852.15', change: '+112.40 (+0.45%)', isUp: true },
    { name: 'SENSEX', value: '81,385.20', change: '+310.80 (+0.38%)', isUp: true },
    { name: 'BANK NIFTY', value: '51,210.60', change: '+318.50 (+0.62%)', isUp: true },
    { name: 'NIFTY MIDCAP', value: '58,450.10', change: '+420.15 (+0.72%)', isUp: true },
    { name: 'INDIA VIX', value: '12.82', change: '-0.35 (-2.65%)', isUp: false },
    { name: 'USD/INR', value: '₹84.12', change: '+0.03 (+0.04%)', isUp: true }
  ];

  return (
    <div className="bg-slate-900 text-slate-300 border-b border-slate-800 text-[11px] px-4 py-1.5 flex items-center justify-between overflow-x-auto no-scrollbar gap-4 shrink-0 select-none">
      {/* Left: Market Status Tag & Indices Ticker */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="uppercase text-[10px] font-mono tracking-wider">
            {isTamil ? 'NSE/BSE நேரலை' : 'NSE/BSE LIVE'}
          </span>
        </div>

        <div className="h-3 w-px bg-slate-700 hidden sm:block"></div>

        <div className="flex items-center gap-3.5 shrink-0 overflow-x-auto">
          {indices.map((idx, i) => (
            <div key={i} className="flex items-center gap-1.5 font-mono text-[11px] shrink-0">
              <span className="text-slate-400 font-semibold">{idx.name}</span>
              <span className="text-slate-100 font-bold">{idx.value}</span>
              <span className={`flex items-center gap-0.5 text-[10px] font-bold ${idx.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {idx.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {idx.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: User Login & Session Status (Desktop only, as mobile Header already shows it) */}
      <div className="hidden md:flex items-center gap-3 shrink-0 ml-auto">
        {user && user.isLoggedIn ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-emerald-300 text-[10px] font-bold">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>{user.name}</span>
              <span className="text-slate-400 hidden md:inline">({user.role})</span>
            </div>
            <button
              onClick={onLogout}
              className="text-slate-400 hover:text-rose-300 text-[10px] font-semibold transition-colors cursor-pointer"
              title={isTamil ? 'வெளியேறு' : 'Logout session'}
            >
              {isTamil ? 'வெளியேறு' : 'Logout'}
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all shadow-xs cursor-pointer"
          >
            <User className="w-3 h-3" />
            <span>{isTamil ? 'ப்ரோ உள்நுழைவு' : 'Pro Login'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
