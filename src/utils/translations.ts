import { Language } from '../types';

export const TRANSLATIONS = {
  tamil: {
    // Navigation
    appName: 'Screener Stock Analyzer',
    appSub: 'Screener.in & NSE/BSE நேரலை அனாலிசிஸ்',
    dashboard: 'டாஷ்போர்டு',
    screenerHub: 'ஸ்கிரீனர் ஹப்',
    analysisEngine: 'அனாலிசிஸ் எஞ்சின்',
    portfolio: 'தனிப்பட்ட போர்ட்ஃபோலியோ',
    excelUpload: 'எக்செல் பதிவேற்றம்',
    aiMentor: 'AI பங்கு வழிகாட்டி',
    guide: 'வழிகாட்டுதல்',
    marketFeedLive: 'சந்தை நேரலை',

    // Header & Actions
    activeAnalysis: 'தேர்ந்தெடுக்கப்பட்ட பங்கு:',
    searchPlaceholder: 'பங்கு பெயர் அல்லது குறியீடு தட்டச்சு செய்க (எ.கா: TCS, Tata Motors, HDFC, CDSL)...',
    uploadExcel: 'எக்செல் பதிவேற்று',
    exportExcel: 'எக்செல் ஏற்றுமதி',
    askAi: 'AI வழிகாட்டி',
    runScan: 'மீண்டும் ஆய்வு செய்',
    analyzing: 'ஆய்வு செய்யப்படுகிறது...',
    editRatios: 'தரவு திருத்துதல்',
    scoreBreakdown: 'மதிப்பெண் விளக்கம்',

    // 4 Core Questions
    coreDecisionsTitle: 'உங்களுக்கான 4 முக்கிய முதலீட்டு முடிவுகள்',
    q1Title: '1. வாங்கலாமா? (Buy Verdict)',
    q2Title: '2. இப்போதே வாங்கலாமா? (Entry Timing)',
    q3Title: '3. ஏன் வாங்க வேண்டும்? (Why to Buy)',
    q4Title: '4. ஏன் வாங்கக் கூடாது / அபாயங்கள் (Risks & Red Flags)',

    // Ratings & Badges
    strongBuy: 'உடனடி வாங்கல் (STRONG BUY)',
    buy: 'வாங்கலாம் (BUY)',
    hold: 'பொறுத்திருக்கவும் (HOLD)',
    avoid: 'தவிர்க்கவும் (AVOID)',
    fundamentalScore: 'அடிப்படை மதிப்பெண்',
    technicalTrend: 'தொழில்நுட்ப போக்கு',
    newsSentiment: 'சந்தை உணர்வு',
    idealRange: 'வாங்குவதற்கான சிறந்த விலை:',
    support: 'ஆதரவு விலை (Support):',
    resistance: 'தடை விலை (Resistance):',
    allocationStrategy: 'வாங்கும் உத்தி:',
    rangePosition: '52 வார வரம்பில் நிலை:',

    // Screener Matrix Ratios
    financialHealth: 'Screener.in நிதிநிலை மேட்ரிக்ஸ் (10 ஆண்டு தரவு)',
    roceLabel: 'ROCE (மூலதன வருவாய்)',
    roeLabel: 'ROE (பங்கு வருவாய்)',
    peLabel: 'பங்கு P/E',
    debtToEquityLabel: 'கடன் / பங்கு விகிதம் (D/E)',
    salesGrowthLabel: '3 ஆண்டு விற்பனை CAGR',
    profitGrowthLabel: '3 ஆண்டு லாப CAGR',
    promoterHoldLabel: 'நிறுவனர்கள் பங்கு',
    promoterPledgedLabel: 'அடமானம் வைக்கப்பட்ட பங்கு',
    cmpLabel: 'தற்போதைய சந்தை விலை',
    marketCapLabel: 'சந்தை மூலதனம் (Market Cap)',
    highLow52Label: '52 வார உச்சம் / வீழ்ச்சி',

    // Market Depth
    marketDepthTitle: 'NSE / BSE நேரலை சந்தை ஆழம் (Market Depth)',
    totalBuyQty: 'மொத்த வாங்குவோர் அளவு',
    totalSellQty: 'மொத்த விற்போர் அளவு',
    deliveryVolume: 'டெலிவரி சதவீதம் (Delivery %)',
    buyerPressure: 'வாங்குவோர் அழுத்தம் அதிகம்',
    sellerPressure: 'விற்போர் அழுத்தம் அதிகம்',

    // Portfolio
    portfolioTitle: 'தனிப்பட்ட போர்ட்ஃபோலியோ மேலாளர் (Personal Portfolio)',
    portfolioSub: 'உங்கள் பங்குகளை சேர்த்து Screener அடிப்படை மதிப்பெண் மற்றும் நேரலை லாப/நஷ்டத்தை கண்காணிக்கவும்',
    addHolding: 'புதிய பங்கைச் சேர்க்க',
    importCsvExcel: 'CSV / எக்செல் இறக்குமதி',
    exportPortfolioCsv: 'போர்ட்ஃபோலியோ CSV ஏற்றுமதி',
    exportPortfolioExcel: 'போர்ட்ஃபோலியோ Excel ஏற்றுமதி',
    totalInvested: 'மொத்த முதலீடு',
    currentValue: 'தற்போதைய மதிப்பு',
    totalPnl: 'மொத்த லாபம் / நஷ்டம்',
    portfolioHealthScore: 'போர்ட்ஃபோலியோ ஆரோக்கியக் குறியீடு',
    noHoldingsYet: 'இன்னும் பங்குகள் எதுவும் சேர்க்கப்படவில்லை.',
    addYourFirstStock: 'உங்கள் முதல் பங்கை மேலே உள்ள "புதிய பங்கைச் சேர்க்க" பட்டனை அழுத்தி சேர்க்கவும், அல்லது Zerodha/Groww CSV கோப்பை பதிவேற்றவும்.',
    holdingStock: 'பங்கு & குறியீடு',
    quantity: 'அளவு (Qty)',
    avgBuyPrice: 'வாங்கிய விலை (₹)',
    liveCmp: 'நேரலை விலை (₹)',
    pnl: 'லாபம் / நஷ்டம்',
    action: 'செயல்பாடு',
    delete: 'நீக்கு',
    edit: 'திருத்து',

    // Edit Stock Modal
    editModalTitle: 'பங்கு நிதிநிலை தரவுகளை திருத்த (Edit Stock Ratios)',
    editModalSub: 'உங்கள் சொந்த மதிப்பீடுகள் அல்லது சமீபத்திய காலாண்டு எண்களை உள்ளிட்டு உடனடி மதிப்பெண்ணை பார்க்கவும்',
    saveAndRecompute: 'சேமி & மறுஆய்வு செய்',
    resetToDefault: 'இயல்பு நிலைக்கு மீட்டமை',
    cancel: 'ரத்து செய்',

    // Multi-stock Screener Table
    screenerTableTitle: 'Screener பல-பங்கு அட்டவணை (Multi-Stock Hub)',
    screenerTableSub: 'நிறுவனங்களின் இருப்புநிலை விகிதங்களை ஒப்பிட்டு ஆழ்ந்த ஆய்வு செய்க',
    quickVerdict: 'விரைவு முடிவு',
    deepScan: 'ஆழ்ந்த ஆய்வு',
    searchStock: 'பங்கு தேடுக...'
  },
  english: {
    // Navigation
    appName: 'Screener Stock Analyzer',
    appSub: 'Screener.in & NSE/BSE Live Intelligence',
    dashboard: 'Dashboard',
    screenerHub: 'Screener Hub',
    analysisEngine: 'Analysis Engine',
    portfolio: 'Personal Portfolio',
    excelUpload: 'Excel Sync / Upload',
    aiMentor: 'AI Stock Mentor',
    guide: 'Screener Guide',
    marketFeedLive: 'Market Feed LIVE',

    // Header & Actions
    activeAnalysis: 'Active Analysis:',
    searchPlaceholder: 'Search stock symbol or name (e.g., TCS, Tata Motors, HDFC, CDSL)...',
    uploadExcel: 'Upload Excel',
    exportExcel: 'Export Excel',
    askAi: 'Ask AI',
    runScan: 'Run Global Scan',
    analyzing: 'Analyzing...',
    editRatios: 'Edit Ratios',
    scoreBreakdown: 'Score Breakdown',

    // 4 Core Questions
    coreDecisionsTitle: 'The 4 Core Investment Decisions',
    q1Title: '1. Vangalama? (Buy Verdict & Score)',
    q2Title: '2. Ipa Vangalama? (Entry Timing & Levels)',
    q3Title: '3. En Vanganum? (Why to Buy / Strengths)',
    q4Title: '4. En Vanga Kudathu? (Risks & Red Flags)',

    // Ratings & Badges
    strongBuy: 'STRONG BUY',
    buy: 'BUY',
    hold: 'HOLD',
    avoid: 'AVOID',
    fundamentalScore: 'Fundamental Score',
    technicalTrend: 'Technical Trend',
    newsSentiment: 'News Sentiment',
    idealRange: 'Ideal Entry Range:',
    support: 'Support Level:',
    resistance: 'Resistance Level:',
    allocationStrategy: 'Allocation Strategy:',
    rangePosition: '52-Week Range Position:',

    // Screener Matrix Ratios
    financialHealth: 'Screener.in Financial Health Matrix (10-Year Track Record)',
    roceLabel: 'ROCE (Capital Efficiency)',
    roeLabel: 'ROE (Equity Returns)',
    peLabel: 'Stock P/E',
    debtToEquityLabel: 'Debt / Equity (D/E)',
    salesGrowthLabel: '3Y Sales CAGR',
    profitGrowthLabel: '3Y Profit CAGR',
    promoterHoldLabel: 'Promoter Holding',
    promoterPledgedLabel: 'Promoter Pledged',
    cmpLabel: 'Current Market Price',
    marketCapLabel: 'Market Cap',
    highLow52Label: '52W High / Low',

    // Market Depth
    marketDepthTitle: 'NSE / BSE Live Market Depth Order Book',
    totalBuyQty: 'Total Buy Quantity',
    totalSellQty: 'Total Sell Quantity',
    deliveryVolume: 'Delivery Percentage',
    buyerPressure: 'Strong Buyer Accumulation',
    sellerPressure: 'Distribution Pressure',

    // Portfolio
    portfolioTitle: 'Personal Portfolio Manager',
    portfolioSub: 'Track your holdings with live Screener fundamental scores and instant P&L metrics',
    addHolding: 'Add Stock to Portfolio',
    importCsvExcel: 'Import Broker CSV / Excel',
    exportPortfolioCsv: 'Export Portfolio CSV',
    exportPortfolioExcel: 'Export Portfolio Excel',
    totalInvested: 'Total Invested',
    currentValue: 'Current Value',
    totalPnl: 'Overall P&L',
    portfolioHealthScore: 'Portfolio Fundamental Health',
    noHoldingsYet: 'No holdings in your portfolio yet.',
    addYourFirstStock: 'Click "Add Stock to Portfolio" above or import your Zerodha / Groww / AngelOne CSV file.',
    holdingStock: 'Stock & Symbol',
    quantity: 'Quantity',
    avgBuyPrice: 'Buy Price (₹)',
    liveCmp: 'Live CMP (₹)',
    pnl: 'P&L (₹ & %)',
    action: 'Action',
    delete: 'Delete',
    edit: 'Edit',

    // Edit Stock Modal
    editModalTitle: 'Edit / Fine-Tune Stock Ratios',
    editModalSub: 'Adjust any ratio to recalculate fundamental score and the 4 core decisions immediately',
    saveAndRecompute: 'Save & Recalculate',
    resetToDefault: 'Reset to Screener Defaults',
    cancel: 'Cancel',

    // Multi-stock Screener Table
    screenerTableTitle: 'Screener Multi-Stock Hub',
    screenerTableSub: 'Compare key balance sheet metrics and select any stock for deep scan',
    quickVerdict: 'Quick Verdict',
    deepScan: 'Deep Scan',
    searchStock: 'Search stocks...'
  }
};

export function getTranslation(lang: Language) {
  return TRANSLATIONS[lang] || TRANSLATIONS.english;
}
