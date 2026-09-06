import * as XLSX from 'xlsx';
import { AnalysisResponse } from '../types';

export function exportAnalysisToExcel(analyses: AnalysisResponse[], filename = 'StockLogic_Pro_Analysis.xlsx') {
  const rows = analyses.map((a, idx) => ({
    'S.No': idx + 1,
    'Symbol': a.symbol,
    'Company Name': a.name,
    'Sector': a.sector,
    'CMP (Rs.)': a.cmp,
    'Verdict (Vangalama?)': a.verdict,
    'AI Score (/10)': a.score,
    'Score %': `${a.scorePercentage}%`,
    'Ipa Vangalama?': a.ipaVangalama.timing,
    'Ideal Buy Range': a.ipaVangalama.idealBuyRange,
    'Support Level (Rs.)': a.ipaVangalama.supportLevel,
    'Resistance Level (Rs.)': a.ipaVangalama.resistanceLevel,
    'Buying Strategy': a.ipaVangalama.suggestedAllocation,
    'Why to Buy (En Vanganum)': a.enVanganum.points.join(' | '),
    'Why NOT to Buy / Risks (En Vanga Kudathu)': a.enVangaKudathu.points.join(' | '),
    'Valuation Status': a.valuationStatus,
    'P/E': a.ratios.pe,
    'ROCE (%)': `${a.ratios.roce}%`,
    'ROE (%)': `${a.ratios.roe}%`,
    'Debt to Equity': a.ratios.debtToEquity,
    'Sales Growth 3Y (%)': `${a.ratios.salesGrowth3Yr}%`,
    'Profit Growth 3Y (%)': `${a.ratios.profitGrowth3Yr}%`,
    'Promoter Holding (%)': `${a.ratios.promoterHolding}%`,
    'Promoter Pledged (%)': `${a.ratios.promoterPledged}%`,
    'Delivery % (NSE/BSE)': `${a.marketDepth.deliveryPercentage}%`,
    'Google News Sentiment': a.newsSentiment,
    'Analyzed At': a.analyzedAt
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Stock Verdicts & Decisions');
  
  XLSX.writeFile(wb, filename);
}
