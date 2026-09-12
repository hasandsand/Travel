import React from 'react';
import { ShieldCheck, Plane, Hotel, Calendar, Award, CheckCircle } from 'lucide-react';
import { PackageCategory } from '../types';

interface HeroBannerProps {
  selectedCategory: PackageCategory;
  onSelectCategory: (cat: PackageCategory) => void;
  searchMonth: string;
  onSearchMonthChange: (month: string) => void;
  maxBudget: number;
  onMaxBudgetChange: (budget: number) => void;
  onOpenBooking: () => void;
  onOpenCalculator: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  selectedCategory,
  onSelectCategory,
  searchMonth,
  onSearchMonthChange,
  maxBudget,
  onMaxBudgetChange,
  onOpenBooking,
  onOpenCalculator
}) => {
  const categories: { id: PackageCategory; label: string }[] = [
    { id: 'all', label: 'Semua Paket' },
    { id: 'reguler', label: 'Paket Reguler' },
    { id: 'vip', label: 'VIP Bintang 5' },
    { id: 'plus', label: 'Plus Turki / Wisata' },
    { id: 'ramadhan', label: 'Spesial Ramadhan' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white pt-8 pb-14 border-b border-amber-500/20">
      {/* Background Subtle Islamic Geometric Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" 
        aria-hidden="true" 
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-amber-400/40 px-3.5 py-1.5 rounded-full text-xs text-amber-200">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="font-semibold">Wisata Islami Kareem (سياحة إسلامي كريم) • Akreditasi A PPIU Kemenag</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs text-emerald-200/90">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Jaminan 5 Pasti Umrah</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Plane className="w-4 h-4 text-emerald-400" /> Penerbangan Direct Saudia & Garuda</span>
          </div>
        </div>

        {/* Hero Headlines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Wujudkan Ibadah Umrah Berkah bersama <span className="text-amber-300">Wisata Islami Kareem</span>
            </h1>
            <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl leading-relaxed">
              Pelayanan biro resmi bimbingan ibadah sesuai Sunnah, fasilitas hotel bintang 5 dekat pelataran Masjidil Haram & Nabawi, serta transparansi jadwal penerbangan dan e-Visa resmi.
            </p>

            {/* Quick Action Badges */}
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-emerald-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-950/20 transition-transform active:scale-95"
              >
                Daftar Jamaah Baru
              </button>
              <button
                onClick={onOpenCalculator}
                className="px-5 py-3 bg-emerald-800/80 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl border border-emerald-600/50 transition-colors"
              >
                Hitung Simulasi Biaya
              </button>
            </div>
          </div>

          {/* Quick Highlight Stats Box */}
          <div className="lg:col-span-4 bg-emerald-900/60 border border-emerald-700/50 rounded-2xl p-5 backdrop-blur-xs space-y-4">
            <div className="text-xs uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> 5 Pasti Umrah Kemenag RI
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-emerald-950/70 p-2.5 rounded-xl border border-emerald-800/80">
                <p className="text-emerald-300 font-medium">1. Pasti Travelnya</p>
                <p className="text-white font-bold mt-0.5">Izin Kemenag 912</p>
              </div>
              <div className="bg-emerald-950/70 p-2.5 rounded-xl border border-emerald-800/80">
                <p className="text-emerald-300 font-medium">2. Pasti Jadwalnya</p>
                <p className="text-white font-bold mt-0.5">Seat Block Locked</p>
              </div>
              <div className="bg-emerald-950/70 p-2.5 rounded-xl border border-emerald-800/80">
                <p className="text-emerald-300 font-medium">3. Pasti Terbangnya</p>
                <p className="text-white font-bold mt-0.5">Direct Non-Stop</p>
              </div>
              <div className="bg-emerald-950/70 p-2.5 rounded-xl border border-emerald-800/80">
                <p className="text-emerald-300 font-medium">4. Pasti Hotelnya</p>
                <p className="text-white font-bold mt-0.5">Dekat Pelataran</p>
              </div>
            </div>

            <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <span className="text-amber-200">5. Pasti Visanya:</span>
              <span className="font-bold text-amber-300">E-Visa Saudi Terbit Resmi</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar Floating Container */}
        <div className="mt-8 bg-white rounded-2xl p-4 sm:p-5 text-slate-800 shadow-xl border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500 font-medium hidden lg:inline">
              Menampilkan paket pilihan terverifikasi
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {/* Filter Month */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                Bulan Keberangkatan
              </label>
              <select
                value={searchMonth}
                onChange={(e) => onSearchMonthChange(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              >
                <option value="all">Semua Bulan Keberangkatan</option>
                <option value="2026-10">Oktober 2026</option>
                <option value="2026-11">November 2026</option>
                <option value="2026-12">Desember 2026 (Liburan Akhir Tahun)</option>
                <option value="2027-03">Maret 2027 (Spesial Ramadhan)</option>
              </select>
            </div>

            {/* Filter Budget */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Hotel className="w-3.5 h-3.5 text-emerald-700" />
                Maksimal Budget ({maxBudget >= 60000000 ? 'Semua Budget' : `s/d Rp ${(maxBudget/1000000).toFixed(0)} Juta`})
              </label>
              <input
                type="range"
                min="28000000"
                max="60000000"
                step="1000000"
                value={maxBudget}
                onChange={(e) => onMaxBudgetChange(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Rp 28 Jt</span>
                <span>Rp 40 Jt</span>
                <span>Rp 60 Jt+</span>
              </div>
            </div>

            {/* Hotel distance assurance */}
            <div className="flex items-center gap-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-emerald-950">Garansi Fasilitas Pasti</p>
                <p className="text-slate-600 text-[11px]">Semua paket termasuk Muthawwif, Handling & Visa resmi.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
