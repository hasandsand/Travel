import React, { useState, useEffect, useRef } from 'react';
import { 
  RefreshCw, 
  TrendingUp, 
  ArrowRightLeft, 
  Check, 
  X, 
  Info, 
  ExternalLink,
  Coins,
  ChevronDown
} from 'lucide-react';
import { LiveExchangeRates, fetchLiveExchangeRates } from '../services/currencyService';
import { formatRupiah, formatSar } from '../utils/formatters';

interface HeaderCurrencyWidgetProps {
  rates: LiveExchangeRates | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const HeaderCurrencyWidget: React.FC<HeaderCurrencyWidgetProps> = ({
  rates,
  isLoading,
  onRefresh
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sarInput, setSarInput] = useState<string>('100');
  const [idrInput, setIdrInput] = useState<string>('');
  const [activeDirection, setActiveDirection] = useState<'sar_to_idr' | 'idr_to_sar'>('sar_to_idr');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentRate = rates?.sarToIdr || 4300;

  // Sync inputs based on current rate
  useEffect(() => {
    if (activeDirection === 'sar_to_idr') {
      const sar = parseFloat(sarInput) || 0;
      setIdrInput(Math.round(sar * currentRate).toString());
    } else {
      const idr = parseFloat(idrInput) || 0;
      setSarInput((idr / currentRate).toFixed(1));
    }
  }, [currentRate, sarInput, idrInput, activeDirection]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSarChange = (val: string) => {
    setActiveDirection('sar_to_idr');
    setSarInput(val);
    const num = parseFloat(val) || 0;
    setIdrInput(Math.round(num * currentRate).toString());
  };

  const handleIdrChange = (val: string) => {
    setActiveDirection('idr_to_sar');
    setIdrInput(val);
    const num = parseFloat(val) || 0;
    setSarInput(num > 0 ? (num / currentRate).toFixed(1) : '0');
  };

  const quickPillAmounts = [50, 100, 300, 500, 1000, 2500];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Top Bar Widget Trigger */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          id="btn-header-currency-modal"
          onClick={() => setIsOpen(!isOpen)}
          className="group inline-flex items-center gap-1.5 bg-emerald-900/90 hover:bg-emerald-850 px-2.5 py-1 rounded-lg border border-amber-400/40 text-[11px] font-semibold text-emerald-100 transition-all shadow-xs cursor-pointer"
          title="Klik untuk membuka kalkulator konversi kurs real-time"
        >
          {/* Live pulsing indicator */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>

          <span className="text-emerald-300">Kurs Live:</span>
          <span className="font-bold text-amber-300">
            1 SAR = Rp {currentRate.toLocaleString('id-ID')}
          </span>

          <ChevronDown className={`w-3 h-3 text-amber-300/80 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Quick Refresh Button */}
        <button
          type="button"
          id="btn-refresh-currency-header"
          onClick={(e) => {
            e.stopPropagation();
            onRefresh();
          }}
          disabled={isLoading}
          className="p-1 rounded text-emerald-300 hover:text-amber-300 hover:bg-emerald-800 transition-colors disabled:opacity-50"
          title="Muat ulang kurs dari API pasar keuangan"
          aria-label="Refresh kurs real-time"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-amber-300' : ''}`} />
        </button>
      </div>

      {/* Floating Interactive Conversion Dropdown / Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-4">
          {/* Dropdown Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Konversi Kurs Real-Time</h4>
                <p className="text-[10px] text-slate-500">
                  Integrasi API Pasar Keuangan Global
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Rate Highlights Card */}
          <div className="bg-emerald-950 text-white rounded-xl p-3 text-xs space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-emerald-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-amber-400" />
                Benchmark Pasar Valuta Asing
              </span>
              <span className="text-[10px] bg-emerald-800/80 px-1.5 py-0.5 rounded text-amber-300 font-mono">
                {rates?.isLive ? 'LIVE DATA' : 'CACHED'}
              </span>
            </div>
            
            <div className="text-xl font-black text-amber-300 pt-1">
              1 SAR = Rp {currentRate.toLocaleString('id-ID')}
            </div>

            <div className="flex items-center justify-between text-[10px] text-emerald-300/80 pt-1 border-t border-emerald-900">
              <span>Update: {rates?.lastUpdatedLocal || 'Baru saja'}</span>
              <span>Sumber: {rates?.provider || 'Financial API'}</span>
            </div>
          </div>

          {/* Interactive Live Converter Inputs */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Kalkulator Uang Saku Jamaah
            </span>

            <div className="grid grid-cols-1 gap-2.5 text-xs">
              {/* SAR Input */}
              <div className="bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus-within:ring-2 focus-within:ring-emerald-700 focus-within:border-emerald-700">
                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center justify-between">
                  <span>Riyal Saudi (SAR)</span>
                  <span className="text-emerald-800 font-bold">Mata Uang Saudi</span>
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-slate-700 text-sm">SAR</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={sarInput}
                    onChange={(e) => handleSarChange(e.target.value)}
                    placeholder="0"
                    className="w-full text-base font-extrabold text-slate-900 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Conversion direction icon */}
              <div className="flex justify-center -my-1">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                  <ArrowRightLeft className="w-3 h-3" />
                </div>
              </div>

              {/* IDR Input */}
              <div className="bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus-within:ring-2 focus-within:ring-emerald-700 focus-within:border-emerald-700">
                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center justify-between">
                  <span>Rupiah Indonesia (IDR)</span>
                  <span className="text-emerald-800 font-bold">Setara Rupiah</span>
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-slate-700 text-sm">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={idrInput}
                    onChange={(e) => handleIdrChange(e.target.value)}
                    placeholder="0"
                    className="w-full text-base font-extrabold text-emerald-950 bg-transparent focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Quick Amount Pills */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-slate-500 font-semibold block">
                Nominal Cepat Uang Saku & Belanja:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickPillAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleSarChange(amt.toString())}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      parseFloat(sarInput) === amt
                        ? 'bg-emerald-800 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {amt} SAR
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Multi-currency reference */}
          <div className="border-t border-slate-100 pt-3 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Referensi Mata Uang Terkait:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[10px]">1 USD (Dolar AS)</span>
                <span className="font-bold text-slate-900">
                  Rp {(rates?.usdToIdr || 16200).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[10px]">1 TRY (Lira Turki)</span>
                <span className="font-bold text-slate-900">
                  Rp {(rates?.tryToIdr || 450).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Tips Penukaran Uang di Tanah Suci */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 text-[11px] text-amber-950 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-tight">
              <strong>Tips Hemat Jamaah:</strong> Anda bisa langsung tarik tunai Riyal di mesin ATM Al-Rajhi atau SNB Al-Ahli di Makkah & Madinah dengan kartu debit bank Indonesia (kurs resmi lebih bersahabat).
            </p>
          </div>

          {/* Bottom Action */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Perbarui Data API
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
