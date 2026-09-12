import React, { useState } from 'react';
import { 
  BookOpen, 
  Volume2, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  MapPin, 
  ChevronDown, 
  ChevronUp,
  Info
} from 'lucide-react';
import { MANASIK_STEPS } from '../data/umrahData';
import { speakText } from '../utils/formatters';

export const ManasikGuide: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState<string>(MANASIK_STEPS[0].id);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  const activeStep = MANASIK_STEPS.find(s => s.id === activeStepId) || MANASIK_STEPS[0];

  const handlePlayAudio = (stepId: string, arabicText?: string) => {
    if (!arabicText) return;
    setIsPlayingAudio(stepId);
    speakText(arabicText, 'ar-SA');
    setTimeout(() => {
      setIsPlayingAudio(null);
    }, 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3.5 py-1 rounded-full text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
          Panduan Ibadah Umrah Sesuai Sunnah Rasulullah ﷺ
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Tata Cara Manasik, Doa, & Rukun Umrah Interaktif
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Pelajari urutan tata cara pelaksanaan ibadah umrah mulai dari Miqat, Thawaf, Sa’i hingga Tahallul dilengkapi lafaz doa Arab, transliterasi Latin, audio pelafalan, dan larangan ihram.
        </p>
      </div>

      {/* Quick Step Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {MANASIK_STEPS.map((step) => {
          const isActive = step.id === activeStepId;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStepId(step.id)}
              className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                isActive
                  ? 'border-emerald-700 bg-emerald-800 text-white shadow-md'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                  isActive ? 'bg-amber-400 text-emerald-950' : 'bg-slate-100 text-slate-700'
                }`}>
                  {step.stepNumber}
                </span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-emerald-950 text-amber-300' : 'bg-slate-100 text-slate-600'
                }`}>
                  {step.category.replace(' Umrah', '')}
                </span>
              </div>
              <p className="text-xs font-bold line-clamp-2 leading-tight">
                {step.title}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Active Step Detail Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        {/* Step Top Bar */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Langkah Ke-{activeStep.stepNumber} dari 6
              </span>
              <span className="bg-amber-100 text-amber-900 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {activeStep.category}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {activeStep.title}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              Lokasi Pelaksanaan: <strong className="text-slate-700">{activeStep.location}</strong>
            </p>
          </div>

          <div className="text-right">
            <span className="font-arabic text-2xl text-emerald-950 font-bold block">
              {activeStep.arabicTitle}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <p>{activeStep.description}</p>
        </div>

        {/* Doa / Recitation Box */}
        {activeStep.doaArab && (
          <div className="bg-emerald-950 text-white rounded-2xl p-6 space-y-4 relative overflow-hidden border border-amber-400/40">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
              <span className="text-xs text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Lafaz Doa / Bacaan {activeStep.title}
              </span>
              <button
                onClick={() => handlePlayAudio(activeStep.id, activeStep.doaArab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isPlayingAudio === activeStep.id
                    ? 'bg-amber-300 text-emerald-950 animate-pulse'
                    : 'bg-emerald-800 hover:bg-emerald-700 text-amber-300'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                {isPlayingAudio === activeStep.id ? 'Memutar Audio...' : 'Dengarkan Lafadz'}
              </button>
            </div>

            {/* Arabic Big Text */}
            <div className="py-2 text-right">
              <p className="font-arabic text-2xl sm:text-3xl text-amber-100 leading-loose">
                {activeStep.doaArab}
              </p>
            </div>

            {/* Latin Transliteration */}
            {activeStep.doaLatin && (
              <div className="pt-2 border-t border-emerald-900">
                <span className="text-[11px] text-emerald-300 font-semibold block uppercase">Transliterasi Latin:</span>
                <p className="text-xs sm:text-sm text-emerald-100 italic mt-0.5">
                  "{activeStep.doaLatin}"
                </p>
              </div>
            )}

            {/* Indonesian Translation */}
            {activeStep.doaArti && (
              <div className="pt-2 border-t border-emerald-900">
                <span className="text-[11px] text-emerald-300 font-semibold block uppercase">Artinya:</span>
                <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                  {activeStep.doaArti}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Practical Guidelines & Sunnah Tips */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-700" />
            Ketentuan Penting & Sunnah Ibadah:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeStep.guidelines.map((guide, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{guide}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Pillars: Larangan Ihram & Adab Ibadah */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Larangan Ihram */}
        <div className="bg-rose-50/50 border border-rose-200 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Larangan Selama Berihram (Dam & Dosa)
          </div>
          <p className="text-xs text-slate-600">
            Sejak berniat Ihram di Miqat hingga Tahallul, jamaah dilarang keras melakukan hal-hal berikut:
          </p>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-rose-100">
              <span className="text-rose-600 font-bold">✕</span>
              <span><strong>Pakaian (Khusus Pria):</strong> Dilarang memakai pakaian berjahit, celana dalam, dan menutup kepala dengan topi/peci.</span>
            </div>
            <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-rose-100">
              <span className="text-rose-600 font-bold">✕</span>
              <span><strong>Pakaian (Khusus Wanita):</strong> Dilarang memakai penutup muka (cadar/niqab) dan sarung tangan menutupi jari.</span>
            </div>
            <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-rose-100">
              <span className="text-rose-600 font-bold">✕</span>
              <span><strong>Wewangian:</strong> Dilarang menggunakan parfum atau sabun berwangi menyengat pada badan maupun pakaian ihram.</span>
            </div>
            <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-rose-100">
              <span className="text-rose-600 font-bold">✕</span>
              <span><strong>Fisik & Alam:</strong> Dilarang memotong kuku, mencabut/mencukur rambut, dan membunuh hewan liar atau mencabut pohon di Tanah Haram.</span>
            </div>
          </div>
        </div>

        {/* Tips Khusyuk di Tanah Suci */}
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-sm uppercase tracking-wider">
            <Info className="w-4 h-4 text-emerald-700" />
            Tips Praktis Jamaah di Masjidil Haram & Nabawi
          </div>
          <p className="text-xs text-slate-600">
            Panduan teknis agar ibadah lebih lancar dan nyaman:
          </p>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-emerald-100">
              <span className="text-emerald-700 font-bold">✓</span>
              <span><strong>Aplikasi Nusuk:</strong> Ziarah Raudhah Syarifah di Madinah wajib memiliki jadwal resmi tasreh via Nusuk (diurus oleh tim Muthawwif).</span>
            </div>
            <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-emerald-100">
              <span className="text-emerald-700 font-bold">✓</span>
              <span><strong>Kantong Sandal:</strong> Selalu bawa tas serut kecil untuk menyimpan sandal Anda ke dalam masjid agar tidak tertukar atau hilang saat keluar pintu berbeda.</span>
            </div>
            <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-emerald-100">
              <span className="text-emerald-700 font-bold">✓</span>
              <span><strong>Hidrasi & Zamzam:</strong> Udara di Tanah Suci sangat kering. Minumlah air zamzam minimal 2-3 liter per hari tanpa menunggu rasa haus.</span>
            </div>
            <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-emerald-100">
              <span className="text-emerald-700 font-bold">✓</span>
              <span><strong>Kartu Hotel & Gelang Jamaah:</strong> Selalu kenakan gelang identitas dari Kemenag dan simpan kartu hotel di tas leher saat keluar kamar.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
