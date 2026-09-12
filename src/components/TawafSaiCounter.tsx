import React, { useState } from 'react';
import { 
  RotateCw, 
  RotateCcw, 
  Volume2, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Compass, 
  Info,
  ChevronRight
} from 'lucide-react';
import { TAWAF_ROUNDS, SAI_ROUNDS } from '../data/umrahData';
import { playChimeSound, speakText } from '../utils/formatters';

export const TawafSaiCounter: React.FC = () => {
  const [mode, setMode] = useState<'tawaf' | 'sai'>('tawaf');
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const roundsData = mode === 'tawaf' ? TAWAF_ROUNDS : SAI_ROUNDS;
  const currentData = roundsData[currentRound - 1] || roundsData[0];

  const handleNextRound = () => {
    if (navigator.vibrate) {
      navigator.vibrate(80);
    }
    playChimeSound('click');

    if (currentRound < 7) {
      setCurrentRound(currentRound + 1);
    } else {
      setIsCompleted(true);
      playChimeSound('complete');
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      }
    }
  };

  const handleReset = () => {
    setCurrentRound(1);
    setIsCompleted(false);
  };

  const handlePlayDoa = () => {
    if (!currentData?.doaArab) return;
    setIsSpeaking(true);
    speakText(currentData.doaArab, 'ar-SA');
    setTimeout(() => setIsSpeaking(false), 4000);
  };

  const handleSwitchMode = (newMode: 'tawaf' | 'sai') => {
    setMode(newMode);
    setCurrentRound(1);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3.5 py-1 rounded-full text-xs font-bold">
          <RotateCw className="w-3.5 h-3.5 text-emerald-700" />
          Smart Digital Counter Jamaah
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Penghitung Putaran Thawaf & Sa’i
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Gunakan saat berada di pelataran Ka’bah (Mataf) atau jalur Sa’i (Mas’a). Dilengkapi doa berganti otomatis di setiap putaran.
        </p>
      </div>

      {/* Mode Switcher Buttons */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex max-w-md mx-auto border border-slate-200">
        <button
          onClick={() => handleSwitchMode('tawaf')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            mode === 'tawaf'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className="w-4 h-4 text-amber-300" />
          Thawaf Ka’bah (7 Putaran)
        </button>
        <button
          onClick={() => handleSwitchMode('sai')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            mode === 'sai'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <RotateCw className="w-4 h-4 text-amber-300" />
          Sa’i Shafa-Marwah (7 Putaran)
        </button>
      </div>

      {/* Main Counter Stage */}
      <div className="bg-white border-2 border-emerald-900/20 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Progress Bar 1 to 7 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Progress Putaran</span>
            <span className="text-emerald-800 font-extrabold">
              {isCompleted ? '7 dari 7 Selesai (100%)' : `Putaran ke-${currentRound} dari 7 (${Math.round((currentRound / 7) * 100)}%)`}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => {
              const isPast = isCompleted || num < currentRound;
              const isCurrent = !isCompleted && num === currentRound;
              return (
                <div
                  key={num}
                  className={`h-2.5 rounded-full transition-all ${
                    isPast
                      ? 'bg-emerald-600'
                      : isCurrent
                      ? 'bg-amber-400 ring-2 ring-amber-400 ring-offset-1'
                      : 'bg-slate-200'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Counter Circle & Tap Trigger */}
        {!isCompleted ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-5">
            {/* Big Interactive Touch Target */}
            <button
              onClick={handleNextRound}
              className="group relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-b from-emerald-700 via-emerald-800 to-emerald-950 text-white shadow-2xl shadow-emerald-900/40 flex flex-col items-center justify-center border-4 border-amber-400/80 active:scale-95 transition-all cursor-pointer select-none"
            >
              <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
                {mode === 'tawaf' ? 'PUTARAN THAWAF' : 'PERJALANAN SA’I'}
              </span>
              <span className="text-6xl sm:text-7xl font-black text-white my-1 font-mono">
                {currentRound}
              </span>
              <span className="text-xs bg-amber-400 text-emerald-950 font-bold px-3 py-1 rounded-full shadow-xs group-hover:bg-amber-300">
                + Tekan Selesai Putaran
              </span>
            </button>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>Mulai: {mode === 'tawaf' ? 'Garis Hajar Aswad' : (currentRound % 2 === 1 ? 'Bukit Shafa' : 'Bukit Marwah')}</span>
              <span>•</span>
              <button
                onClick={handleReset}
                className="text-slate-500 hover:text-rose-600 flex items-center gap-1 font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Ulangi dari Awal
              </button>
            </div>
          </div>
        ) : (
          /* Completion Congratulations Screen */
          <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 text-center space-y-4 animate-in zoom-in-95 duration-300 border border-amber-400/50">
            <div className="w-16 h-16 bg-amber-400 text-emerald-950 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Award className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">
                Alhamdulillah! 7 Putaran {mode === 'tawaf' ? 'Thawaf' : 'Sa’i'} Telah Lengkap
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-md mx-auto">
                Semoga Allah SWT menerima ibadah Anda dan mencatatnya sebagai amalan yang mabrur.
              </p>
            </div>

            {/* Next Step Guideline */}
            <div className="bg-emerald-900/80 border border-emerald-700 rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-1.5">
              <span className="text-amber-300 font-bold uppercase tracking-wider block">Langkah Berikutnya:</span>
              {mode === 'tawaf' ? (
                <p className="text-emerald-100">
                  Tutup kembali bahu kanan, lalu lakukan <strong>Shalat Sunnah Thawaf 2 Rakaat</strong> di belakang Maqam Ibrahim, berdoa mustajab, dan minum Air Zamzam sebelum menuju ke Bukit Shafa untuk Sa’i.
                </p>
              ) : (
                <p className="text-emerald-100">
                  Berdiri di Bukit Marwah, menghadap Ka’bah dan berdoa, lalu lakukan <strong>Tahallul</strong> (mencukur rambut kepala). Ibadah umrah Anda kini telah sempurna!
                </p>
              )}
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Mulai Penghitungan Baru
            </button>
          </div>
        )}

        {/* Dynamic Prayer Box for Current Round */}
        {!isCompleted && currentData && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-900 block">
                  {mode === 'tawaf' ? `Doa Putaran ke-${currentRound}` : `Doa Perjalanan Sa’i ke-${currentRound}`}
                </span>
                <span className="text-[11px] text-slate-500">
                  {mode === 'sai' && 'from' in currentData && `Dari Bukit ${currentData.from} menuju ${currentData.to}`}
                </span>
              </div>

              <button
                onClick={handlePlayDoa}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isSpeaking
                    ? 'bg-amber-400 text-emerald-950 animate-pulse'
                    : 'bg-emerald-800 text-white hover:bg-emerald-700'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                {isSpeaking ? 'Mendengarkan...' : 'Putar Audio'}
              </button>
            </div>

            {/* Arabic */}
            <div className="text-right py-1">
              <p className="font-arabic text-xl sm:text-2xl text-slate-900 leading-loose">
                {currentData.doaArab}
              </p>
            </div>

            {/* Latin */}
            {currentData.doaLatin && (
              <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-emerald-900 block text-[10px] uppercase">Lafaz Latin:</span>
                <p className="italic mt-0.5">"{currentData.doaLatin}"</p>
              </div>
            )}

            {/* Arti */}
            {currentData.arti && (
              <div className="text-xs text-slate-700">
                <span className="font-bold text-slate-900 block text-[10px] uppercase">Artinya:</span>
                <p className="mt-0.5">{currentData.arti}</p>
              </div>
            )}
          </div>
        )}

        {/* Sapu Jagad info reminder for Tawaf */}
        {mode === 'tawaf' && !isCompleted && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Sunnah Doa Sapu Jagad:</p>
              <p className="text-[11px] text-amber-900 mt-0.5">
                Setiap kali melintasi sudut antara <strong>Rukun Yamani</strong> menuju <strong>Hajar Aswad</strong>, perbanyak doa: <em>"Rabbana aatina fiddunya hasanah wa fil akhirati hasanah wa qina 'adzabannar"</em>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
