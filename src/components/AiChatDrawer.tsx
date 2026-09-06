import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, RefreshCw } from 'lucide-react';
import { StockData, Language, ChatMessage } from '../types';

interface AiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeStock: StockData;
  language: Language;
}

export const AiChatDrawer: React.FC<AiChatDrawerProps> = ({
  isOpen,
  onClose,
  activeStock,
  language
}) => {
  const isTamil = language === 'tamil';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: isTamil
        ? `வணக்கம்! நான் உங்கள் Screener AI முதலீட்டு ஆலோசகர். தற்போது ${activeStock.name} (${activeStock.symbol}) குறித்த உங்கள் கேள்விகளை கேட்கலாம். "இதை 1 வருடம் வைத்திருக்கலாமா?", "இலக்கு விலை என்ன?", "ஆதரவு விலை எங்குள்ளது?" போன்ற கேள்விகளை கேளுங்கள்!`
        : `Hello! I am your Screener AI Analyst. You are analyzing ${activeStock.name} (${activeStock.symbol}). Ask me about target valuation, support levels, margin of safety, or competitive moat.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stock: activeStock,
          message: text,
          history: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text
          })),
          language
        })
      });

      const data = await res.json();
      const replyText = data.text || (isTamil ? 'பதிலை பெறுவதில் தாமதம் ஏற்பட்டுள்ளது. மீண்டும் முயற்சிக்கவும்.' : 'I analyzed the metrics, but could not fetch the live response. Please check again.');

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: isTamil ? 'மன்னிக்கவும், சேவையகத்துடன் இணைக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.' : 'Connection error occurred while querying AI. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 bg-[#1E293B] text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-none flex items-center gap-1.5">
              <span>{isTamil ? 'AI பங்கு வழிகாட்டி' : 'Screener AI Mentor'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {isTamil ? 'பங்கு:' : 'Active:'} <b className="text-white">{activeStock.symbol}</b> ({activeStock.exchange})
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                m.sender === 'user'
                  ? 'bg-slate-800 text-white'
                  : 'bg-emerald-600 text-white shadow-xs'
              }`}
            >
              {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div
              className={`max-w-[80%] rounded-xl p-3 text-xs leading-relaxed shadow-xs ${
                m.sender === 'user'
                  ? 'bg-[#1E293B] text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
              <div
                className={`text-[9px] mt-1 text-right font-mono ${
                  m.sender === 'user' ? 'text-slate-400' : 'text-slate-400'
                }`}
              >
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>{isTamil ? 'Screener தரவுகளை ஆராய்கிறது...' : 'Analyzing Screener balance sheet & NSE trends...'}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px]">
        <button
          onClick={() => handleSendMessage(isTamil ? 'இந்த பங்கின் இலக்கு விலை (Target Price) என்ன?' : 'What is the projected 1-year target price?')}
          className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer"
        >
          {isTamil ? 'இலக்கு விலை?' : 'Target Price?'}
        </button>
        <button
          onClick={() => handleSendMessage(isTamil ? 'கடன் மற்றும் ROCE நிலை எவ்வளவு பாதுகாப்பானது?' : 'Is the balance sheet and ROCE safe for long-term?')}
          className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer"
        >
          {isTamil ? 'கடன் & ROCE பாதுகாப்பு?' : 'Balance Sheet Safe?'}
        </button>
        <button
          onClick={() => handleSendMessage(isTamil ? 'ஸ்டாப் லாஸ் (Stop Loss) எங்கு வைக்கலாம்?' : 'Where should I place the stop-loss level?')}
          className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer"
        >
          {isTamil ? 'ஸ்டாப் லாஸ்?' : 'Stop Loss Level?'}
        </button>
      </div>

      {/* Input bar */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder={isTamil ? 'உங்கள் கேள்வியை தமிழில் அல்லது ஆங்கிலத்தில் தட்டச்சு செய்க...' : 'Ask your investment question...'}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!input.trim() || isSending}
          className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
