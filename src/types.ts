export type Language = 'tamil' | 'english';

export type Verdict = 'STRONG BUY' | 'BUY' | 'HOLD' | 'AVOID';

export type EntryTiming = 'BUY NOW' | 'ACCUMULATE ON DIPS' | 'WAIT / OVERBOUGHT';

export interface FinancialRatios {
  cmp: number; // Current Market Price
  marketCapCr: number;
  pe: number;
  industryPe: number;
  medianPe5Yr?: number;
  pb: number;
  roce: number; // %
  roe: number; // %
  debtToEquity: number;
  salesGrowth3Yr: number; // %
  profitGrowth3Yr: number; // %
  promoterHolding: number; // %
  promoterPledged: number; // %
  freeCashFlowCr?: number;
  dividendYield?: number; // %
  high52Week: number;
  low52Week: number;
  bookValue?: number;
}

export interface StockData {
  symbol: string;
  name: string;
  sector: string;
  exchange: 'NSE' | 'BSE' | 'NSE/BSE';
  ratios: FinancialRatios;
  quarterlyResults?: {
    quarter: string;
    salesCr: number;
    profitCr: number;
    opmPercent: number;
  }[];
  notes?: string;
  isCustom?: boolean;
}

export interface ScorePillar {
  name: string;
  score: number;
  maxScore: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
  summary: string;
}

export interface ScoreBreakdown {
  capitalEfficiency: ScorePillar; // ROCE & ROE (Max 2.8)
  solvencyDebt: ScorePillar;      // Debt/Equity & Solvency (Max 2.5)
  growthTrack: ScorePillar;       // 3Y Sales & Profit Growth (Max 2.2)
  governance: ScorePillar;        // Promoter Holding & Pledge (Max 1.5)
  valuationSafety: ScorePillar;   // P/E vs Industry (Max 1.0)
  totalScore: number;
}

export interface AnalysisResponse {
  symbol: string;
  name: string;
  sector: string;
  exchange: string;
  cmp: number;
  verdict: Verdict;
  score: number; // 0 - 10
  scorePercentage: number; // 0 - 100
  scoreBreakdown: ScoreBreakdown;
  technicalTrend: 'Bullish' | 'Neutral' | 'Bearish';
  newsSentiment: 'Positive' | 'Neutral' | 'Negative' | 'Cautious';
  
  // 1. Vangalama? (Buy Verdict)
  verdictSummary: string;
  
  // 2. Ipa Vangalama? (Entry Timing)
  ipaVangalama: {
    timing: EntryTiming;
    title: string;
    actionableAdvice: string;
    idealBuyRange: string;
    supportLevel: number;
    resistanceLevel: number;
    suggestedAllocation: string;
  };
  
  // 3. En Vanganum? (Why Buy)
  enVanganum: {
    points: string[];
    highlightQuote: string;
  };
  
  // 4. En Vanga Kudathu? (Why NOT Buy / Red Flags)
  enVangaKudathu: {
    points: string[];
    riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  };

  // Fundamental & valuation breakdown
  valuationStatus: 'Undervalued' | 'Fairly Valued' | 'Overvalued' | 'Bubble Territory';
  valuationNote: string;
  debtHealth: 'Zero Debt / Negligible' | 'Manageable Debt' | 'High Debt Risk' | string;
  promoterConfidence: string;

  // Live Market Depth
  marketDepth: {
    buyQty: number;
    sellQty: number;
    deliveryPercentage: number;
    deliveryInsight: string;
  };

  // Screener Key Ratios
  ratios: FinancialRatios;
  
  // Audit log timestamp
  analyzedAt: string;
  sourcesUsed: string[];
}

export interface PortfolioItem {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  buyDate?: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'SEBI Research Analyst' | 'Institutional Trader' | 'Pro Portfolio Manager' | 'Retail Pro Investor';
  firmName?: string;
  licenseNumber?: string;
  tier: 'Pro Enterprise' | 'Institutional' | 'Standard Pro';
  avatar?: string;
  isLoggedIn: boolean;
  loginTime?: string;
}

