import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { calculateScreenerFundamentalScore, buildComprehensiveAnalysis } from './src/utils/fundamentalEngine';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// 1. Stock Analysis Route (Gemini with real-time prompt + mathematical fallback)
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { stock, language = 'tamil' } = req.body;
    if (!stock || !stock.symbol) {
      return res.status(400).json({ error: 'Stock data with symbol is required' });
    }

    const { ratios, symbol, name, sector } = stock;
    // Calculate mathematically exact Screener score
    const fundamentalResult = calculateScreenerFundamentalScore(ratios);
    const gemini = getGeminiClient();

    let analysisData = null;

    if (gemini) {
      const prompt = `You are a top Indian Stock Market Analyst specializing in Screener.in balance sheet metrics and NSE/BSE price action.
Analyze this Indian stock:
Company Name: ${name}
NSE/BSE Symbol: ${symbol}
Sector: ${sector}
Calculated Fundamental Mathematical Score: ${fundamentalResult.score}/10 (Verdict: ${fundamentalResult.verdict}, Valuation: ${fundamentalResult.valuationStatus})

Screener Financial Ratios:
- Current Market Price (CMP): Rs. ${ratios.cmp}
- 52-Week High / Low: Rs. ${ratios.high52Week} / Rs. ${ratios.low52Week}
- Market Cap: Rs. ${ratios.marketCapCr} Cr
- Stock P/E: ${ratios.pe} (Industry P/E: ${ratios.industryPe})
- ROCE: ${ratios.roce}% | ROE: ${ratios.roe}%
- Debt to Equity: ${ratios.debtToEquity}
- 3-Yr Sales Growth CAGR: ${ratios.salesGrowth3Yr}%
- 3-Yr Profit Growth CAGR: ${ratios.profitGrowth3Yr}%
- Promoter Holding: ${ratios.promoterHolding}% (Pledged: ${ratios.promoterPledged}%)

Target language: "${language}" (Strictly output in either pure 'tamil' script or professional 'english' as requested).

Provide the 4 core decisions:
1. Vangalama? (Buy Verdict & 1-sentence executive summary)
2. Ipa Vangalama? (Entry timing: BUY NOW vs ACCUMULATE ON DIPS with specific price support and buy range)
3. En Vanganum? (3 distinct strengths based on ROCE, balance sheet and growth)
4. En Vanga Kudathu? (3 key risks and red flags)

Respond STRICTLY in valid JSON matching this schema:
{
  "verdict": "${fundamentalResult.verdict}",
  "score": ${fundamentalResult.score},
  "technicalTrend": "Bullish" | "Neutral" | "Bearish",
  "newsSentiment": "Positive" | "Neutral" | "Cautious" | "Negative",
  "verdictSummary": "string in ${language}",
  "ipaVangalama": {
    "timing": "BUY NOW" | "ACCUMULATE ON DIPS" | "WAIT / OVERBOUGHT",
    "title": "string",
    "actionableAdvice": "string in ${language}",
    "idealBuyRange": "Rs. X - Rs. Y",
    "supportLevel": number,
    "resistanceLevel": number,
    "suggestedAllocation": "string"
  },
  "enVanganum": {
    "points": ["string", "string", "string"],
    "highlightQuote": "string"
  },
  "enVangaKudathu": {
    "points": ["string", "string", "string"],
    "riskLevel": "Low" | "Moderate" | "High" | "Very High"
  },
  "valuationStatus": "${fundamentalResult.valuationStatus}",
  "valuationNote": "string in ${language}",
  "marketDepth": {
    "buyQty": number,
    "sellQty": number,
    "deliveryPercentage": number,
    "deliveryInsight": "string"
  }
}`;

      try {
        const response = await gemini.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        });

        const text = response.text?.trim();
        if (text) {
          analysisData = JSON.parse(text);
          // Ensure exact mathematical score is preserved
          analysisData.score = fundamentalResult.score;
          analysisData.verdict = fundamentalResult.verdict;
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, using high-precision mathematical engine:', geminiErr);
      }
    }

    // Mathematical analysis as primary source of truth
    const baseAnalysis = buildComprehensiveAnalysis(stock, language);

    if (analysisData) {
      // Overlay AI text insights while preserving exact mathematical score and breakdown
      baseAnalysis.verdictSummary = analysisData.verdictSummary || baseAnalysis.verdictSummary;
      if (analysisData.ipaVangalama?.actionableAdvice) {
        baseAnalysis.ipaVangalama.actionableAdvice = analysisData.ipaVangalama.actionableAdvice;
      }
      if (Array.isArray(analysisData.enVanganum?.points) && analysisData.enVanganum.points.length > 0) {
        baseAnalysis.enVanganum.points = analysisData.enVanganum.points;
      }
      if (Array.isArray(analysisData.enVangaKudathu?.points) && analysisData.enVangaKudathu.points.length > 0) {
        baseAnalysis.enVangaKudathu.points = analysisData.enVangaKudathu.points;
      }
    }

    return res.json(baseAnalysis);
  } catch (err: any) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message || 'Internal server error during analysis' });
  }
});

// 2. Interactive AI Stock Chat Route (Gemini multi-turn assistant)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { stock, message, history = [], language = 'tamil' } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const gemini = getGeminiClient();
    const isTamil = language === 'tamil';

    if (!gemini) {
      const fallbackReply = isTamil
        ? `பங்கு: ${stock?.name || 'தேர்வு செய்யப்பட்ட பங்கு'}. உங்கள் கேள்வி: "${message}". Screener தரவுகளின்படி இந்நிறுவனத்தின் ROCE: ${stock?.ratios?.roce || 18}%, P/E: ${stock?.ratios?.pe || 24}x, கடன் விகிதம்: ${stock?.ratios?.debtToEquity || 0.1}. ஆதரவு விலையில் (Support Level) தவணை முறையில் முதலீடு செய்வது உகந்தது.`
        : `Regarding ${stock?.name || 'this stock'}: According to Screener ratios, ROCE is ${stock?.ratios?.roce || 18}%, PE is ${stock?.ratios?.pe || 24}x, and Debt-to-Equity is ${stock?.ratios?.debtToEquity || 0.1}. Accumulate in tranches near support levels.`;
      return res.json({ text: fallbackReply });
    }

    const systemInstruction = `You are a friendly, highly knowledgeable Indian Stock Market Mentor and Screener.in expert named "Screener AI Analyst".
Current Stock context:
- Name: ${stock?.name} (${stock?.symbol})
- Sector: ${stock?.sector}
- CMP: Rs. ${stock?.ratios?.cmp}
- P/E: ${stock?.ratios?.pe}, Industry P/E: ${stock?.ratios?.industryPe}
- ROCE: ${stock?.ratios?.roce}%, ROE: ${stock?.ratios?.roe}%
- Debt to Equity: ${stock?.ratios?.debtToEquity}
- 52-Week High: Rs. ${stock?.ratios?.high52Week}, 52-Week Low: Rs. ${stock?.ratios?.low52Week}

User Language preference: "${language}".
- If 'tamil', respond strictly in clear, refined, polite Tamil script.
- If 'english', respond strictly in professional financial English.

Answer questions directly regarding:
1. Should I buy now or wait for dips?
2. Target valuation and resistance.
3. Stop-loss levels and risk factors.
4. Business moat and balance sheet health.
Never output marketing fluff. Give concise, actionable advice.`;

    const chat = gemini.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
        temperature: 0.3
      }
    });

    const reply = await chat.sendMessage({
      message: message
    });

    return res.json({ text: reply.text });
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Setup Vite development middleware or static production serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Screener Pro Server running at http://0.0.0.0:${PORT}`);
  });
}

start();
