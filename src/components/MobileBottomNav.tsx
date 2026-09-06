import React from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Briefcase, 
  Target, 
  Sparkles,
  Sliders
} from 'lucide-react';
import { Language } from '../types';

interface MobileBottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenChat: () => void;
  onOpenEditRatios: () => void;
  language: Language;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  onOpenChat,
  onOpenEditRatios,
  language
}) => {
  const isTamil = language === 'tamil';

  const navItems = [
    {
      id: 'dashboard',
      label: isTamil ? 'முகப்பு' : 'Dashboard',
      icon: TrendingUp,
      onClick: () => setCurrentTab('dashboard')
    },
    {
      id: 'screener',
      label: isTamil ? 'ஸ்கிரீனர்' : 'Screener',
      icon: BarChart3,
      onClick: () => setCurrentTab('screener')
    },
    {
      id: 'portfolio',
      label: isTamil ? 'போர்ட்ஃபோலியோ' : 'Portfolio',
      icon: Briefcase,
      onClick: () => setCurrentTab('portfolio')
    },
    {
      id: 'analysis',
      label: isTamil ? 'ஆய்வு' : 'Analysis',
      icon: Target,
      onClick: () => setCurrentTab('analysis')
    },
    {
      id: 'chat',
      label: isTamil ? 'AI சாட்' : 'Ask AI',
      icon: Sparkles,
      onClick: onOpenChat
    }
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg safe-area-bottom"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id || (item.id === 'chat' && false);
        return (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer select-none min-w-[56px] ${
              isActive 
                ? 'text-emerald-700 font-bold' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-emerald-50 text-emerald-600' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-tight">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
