import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  Building, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  UserCheck,
  Award,
  AlertCircle
} from 'lucide-react';
import { UserProfile, Language } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  language: Language;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  language
}) => {
  const isTamil = language === 'tamil';
  const [activeTab, setActiveTab] = useState<'quick' | 'credentials'>('quick');
  const [email, setEmail] = useState('gowthamvz49@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [tradingPin, setTradingPin] = useState('4949');
  const [role, setRole] = useState<UserProfile['role']>('SEBI Research Analyst');
  const [firmName, setFirmName] = useState('StockLogic Capital Institutional Research');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleQuickDemoLogin = (selectedRole: UserProfile['role']) => {
    setIsLoading(true);
    setTimeout(() => {
      const user: UserProfile = {
        id: 'usr_pro_' + Date.now(),
        name: selectedRole === 'SEBI Research Analyst' ? 'Gowtham VZ (SEBI RA)' : 'Pro Institutional Trader',
        email: email || 'gowthamvz49@gmail.com',
        role: selectedRole,
        firmName: firmName || 'StockLogic Capital Research',
        licenseNumber: 'INH000014892 / NSE-PRO-782',
        tier: 'Pro Enterprise',
        isLoggedIn: true,
        loginTime: new Date().toLocaleTimeString('en-IN')
      };
      if (rememberMe) {
        localStorage.setItem('stocklogic_user_session', JSON.stringify(user));
      }
      setIsLoading(false);
      onLoginSuccess(user);
      onClose();
    }, 400);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg(isTamil ? 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்' : 'Please enter a valid email address');
      return;
    }
    if (tradingPin.length < 4) {
      setErrorMsg(isTamil ? '4 இலக்க டிரேடிங் பின் (Trading PIN) உள்ளிடவும்' : 'Please enter your 4-digit Trading Terminal PIN');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const user: UserProfile = {
        id: 'usr_' + Date.now(),
        name: email.split('@')[0].toUpperCase(),
        email: email,
        role: role,
        firmName: firmName || 'Institutional Equities Desk',
        licenseNumber: 'SEBI-RA-2026-9941',
        tier: 'Pro Enterprise',
        isLoggedIn: true,
        loginTime: new Date().toLocaleTimeString('en-IN')
      };

      if (rememberMe) {
        localStorage.setItem('stocklogic_user_session', JSON.stringify(user));
      }

      setIsLoading(false);
      onLoginSuccess(user);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-linear-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {isTamil ? 'தொழில்முறை அணுகல்' : 'Institutional Access'}
              </span>
              <h2 className="text-lg font-extrabold text-white">
                {isTamil ? 'ப்ரோ டிரேடர் / ஆய்வாளர் உள்நுழைவு' : 'Professional Terminal Login'}
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isTamil 
              ? 'Screener.in மற்றும் NSE/BSE நேரலை தரவுத்தளத்தின் முழுமையான அணுகல்.' 
              : 'Full analytical access to verified Screener.in balance sheets and NSE order book depth.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'quick'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isTamil ? 'உடனடி 1-கிளிக் அணுகல்' : 'Instant 1-Click Pro Access'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'credentials'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isTamil ? 'கணக்கு மூலம் உள்நுழை' : 'Terminal Credentials'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'quick' ? (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 font-medium leading-relaxed bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                <p className="font-bold text-emerald-900 mb-1">
                  {isTamil ? 'உடனடி ஆய்வு பயன்பாட்டிற்கு:' : 'Ready for Instant Testing & Research:'}
                </p>
                <p className="text-slate-600">
                  {isTamil
                    ? 'கீழே உள்ள எந்த தொழில்முறை சுயவிவரத்தையும் தேர்ந்தெடுத்து உடனடியாக முழு அம்சங்களை பயன்படுத்தவும்.'
                    : 'Choose your desired institutional role to unlock unlimited stock scans, Excel exports, and real-time Screener scoring.'}
                </p>
              </div>

              {/* Fast 1-Click Role Profiles */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickDemoLogin('SEBI Research Analyst')}
                  className="w-full p-3.5 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50/80 hover:border-emerald-400 transition-all flex items-center justify-between group cursor-pointer text-left shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                        {isTamil ? 'SEBI பதிவுபெற்ற ஆய்வாளர் (SEBI RA)' : 'SEBI Research Analyst Tier'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {isTamil ? 'முழுமையான நிதி மற்றும் பங்கு முடிவு அனுமதிகள்' : 'Full fundamental verdicts & allocation formulas'}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickDemoLogin('Institutional Trader')}
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-between group cursor-pointer text-left shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-slate-950">
                        {isTamil ? 'நிறுவன வர்த்தகர் (Institutional Trader)' : 'Institutional Equities Desk'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {isTamil ? 'NSE ஆர்டர் புக் ஆழம் மற்றும் விநியோக ஆய்வு' : 'NSE live depth & delivery accumulation'}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickDemoLogin('Pro Portfolio Manager')}
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-between group cursor-pointer text-left shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-900">
                        {isTamil ? 'போர்ட்ஃபோலியோ மேலாளர் (PMS / Wealth Manager)' : 'Pro Portfolio & PMS Manager'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {isTamil ? 'CSV/Excel இறக்குமதி மற்றும் பல பங்கு ஒப்பீடு' : 'CSV/Excel broker sync & risk scoring'}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{isTamil ? 'அமர்வை நினைவில் வைத்திரு' : 'Remember my session'}</span>
                </label>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isTamil ? 'உடனடி சரிபார்ப்பு' : 'Instant Verification'}
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isTamil ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@firm.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isTamil ? 'கடவுச்சொல்' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isTamil ? 'டிரேடிங் பின் (4-இலக்கம்)' : 'Terminal PIN (4-digit)'}
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      maxLength={4}
                      required
                      value={tradingPin}
                      onChange={(e) => setTradingPin(e.target.value)}
                      placeholder="4949"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isTamil ? 'ஆய்வாளர் பதவி / பங்கு' : 'Professional Role'}
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserProfile['role'])}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                >
                  <option value="SEBI Research Analyst">SEBI Research Analyst</option>
                  <option value="Institutional Trader">Institutional Trader</option>
                  <option value="Pro Portfolio Manager">Pro Portfolio Manager (PMS)</option>
                  <option value="Retail Pro Investor">Retail Pro Investor</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{isTamil ? 'நினைவில் வை' : 'Remember me'}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>{isTamil ? 'சரிபார்க்கிறது...' : 'Authenticating...'}</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isTamil ? 'டெர்மினலில் நுழைக' : 'Authorize & Enter Terminal'}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-400">
          🔒 256-bit Encrypted Session • Standard for SEBI RA & Institutional Indian Desks
        </div>
      </div>
    </div>
  );
};
