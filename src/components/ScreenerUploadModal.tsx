import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, X, Download, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { parseScreenerFile, generateScreenerSampleWorkbook } from '../utils/screenerParser';
import { StockData, Language } from '../types';

interface ScreenerUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStocksLoaded: (stocks: StockData[]) => void;
  onLoadPreset: (stockSymbol: string) => void;
  language: Language;
}

export const ScreenerUploadModal: React.FC<ScreenerUploadModalProps> = ({
  isOpen,
  onClose,
  onStocksLoaded,
  onLoadPreset,
  language
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;
  const isTamil = language === 'tamil';

  const handleFileProcess = async (file: File) => {
    setError(null);
    setSuccessMsg(null);
    try {
      const buffer = await file.arrayBuffer();
      const parsedStocks = parseScreenerFile(buffer);
      if (parsedStocks.length === 0) {
        throw new Error(isTamil ? 'கோப்பில் சரியான பங்கு நிதிநிலை தரவுகள் கண்டறியப்படவில்லை.' : 'No valid stock data found in the Excel/CSV file.');
      }
      setSuccessMsg(isTamil ? `"${file.name}" கோப்பிலிருந்து ${parsedStocks.length} பங்குகள் வெற்றிகரமாக பெறப்பட்டன!` : `Successfully parsed ${parsedStocks.length} stock(s) from "${file.name}"!`);
      setTimeout(() => {
        onStocksLoaded(parsedStocks);
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || (isTamil ? 'கோப்பை படிப்பதில் பிழை. தயவுசெய்து Screener.in எக்செல் (.xlsx, .xls) அல்லது CSV கோப்பை பதிவேற்றவும்.' : 'Failed to parse file. Make sure it is an Excel (.xlsx, .xls) or CSV from Screener.in'));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadSample = () => {
    const data = generateScreenerSampleWorkbook();
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Screener_Sample_Export.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isTamil ? 'Screener.in எக்செல் கோப்பை பதிவேற்றவும்' : 'Upload Screener.in Excel File'}
              </h3>
              <p className="text-xs text-slate-500">
                {isTamil ? 'Screener-லிருந்து பதிவிறக்கிய கோப்பை பதிவேற்றி உடனடி பகுப்பாய்வு பெறலாம்' : 'Automate fundamental analysis for your Screener exports'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-5 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
              : 'border-slate-300 hover:border-emerald-400 bg-slate-50/70 hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileProcess(e.target.files[0]);
              }
            }}
            accept=".xlsx,.xls,.csv"
            className="hidden"
          />
          <Upload className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-800">
            {isTamil ? 'Screener எக்செல் அல்லது CSV கோப்பை இங்கு இழுத்து விடவும்' : 'Drag & drop your Screener Excel or CSV here'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {isTamil ? 'Screener 10 ஆண்டு இருப்புநிலை அல்லது தனிப்பயன் ஸ்கிரீன் முடிவுகள் (.xlsx, .xls, .csv)' : 'Supports Screener Company 10-Year Exports or Screen Query Results (.xlsx, .xls, .csv)'}
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors">
            {isTamil ? 'கோப்பை தேர்வு செய்' : 'Browse File'}
          </div>
        </div>

        {/* Feedback messages */}
        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1-Click Sample Testing */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              {isTamil ? 'உடனடி சோதனைக்கான மாதிரி பங்குகள்:' : 'Quick Test with Verified Screener Samples:'}
            </span>
            <button
              onClick={handleDownloadSample}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {isTamil ? 'மாதிரி எக்செல் பதிவிறக்கு' : 'Download Template'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { symbol: 'TATAMOTORS', label: isTamil ? 'டாடா மோட்டார்ஸ்' : 'Tata Motors (Auto/EV)' },
              { symbol: 'RELIANCE', label: isTamil ? 'ரிலையன்ஸ்' : 'Reliance (Large Cap)' },
              { symbol: 'CDSL', label: isTamil ? 'சிடிஎஸ்எல் (கடன் இல்லை)' : 'CDSL (Zero Debt)' },
              { symbol: 'TRENT', label: isTamil ? 'டிரென்ட் (ஜூடியோ)' : 'Trent (Zudio)' },
              { symbol: 'SUZLON', label: isTamil ? 'சுஸ்லான்' : 'Suzlon (Turnaround)' },
              { symbol: 'ITC', label: isTamil ? 'ஐடிசி (டிவிடெண்ட்)' : 'ITC (Dividend)' }
            ].map((item) => (
              <button
                key={item.symbol}
                onClick={() => {
                  onLoadPreset(item.symbol);
                  onClose();
                }}
                className="p-2 bg-slate-100 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-lg text-left transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 font-mono">
                  {item.symbol}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {item.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Screener instructions */}
        <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-800 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            {isTamil ? 'Screener.in-லிருந்து Export செய்வது எப்படி?' : 'How to export from Screener.in'}
          </div>
          <ol className="list-decimal pl-4 space-y-0.5 text-[11px] text-slate-500">
            <li>{isTamil ? 'Screener.in சென்று ஒரு பங்கை தேடவும் (எ.கா: Tata Motors).' : 'Search any stock on Screener.in (e.g. Tata Motors).'}</li>
            <li>{isTamil ? 'மேல் வலது மூலையில் உள்ள "Export to Excel" பட்டனை அழுத்தவும்.' : 'Click "Export to Excel" in top right.'}</li>
            <li>{isTamil ? 'பதிவிறக்கிய கோப்பை இங்கு பதிவேற்றவும்.' : 'Upload the downloaded file here.'}</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
