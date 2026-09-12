import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Plane, 
  MapPin, 
  Check, 
  AlertCircle, 
  Building2, 
  Star, 
  Users, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { UmrahPackage } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';

interface PackageDetailModalProps {
  pkg: UmrahPackage | null;
  onClose: () => void;
  onBookNow: (pkg: UmrahPackage) => void;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  pkg,
  onClose,
  onBookNow,
}) => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'facilities' | 'rooms'>('itinerary');

  if (!pkg) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Modal Top Header with Banner */}
        <div className="relative h-48 sm:h-60 shrink-0 bg-slate-900">
          <img
            src={pkg.imageUrl}
            alt={pkg.name}
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-xs transition-colors"
            aria-label="Tutup Detail"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & tags overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-amber-400 text-emerald-950 text-xs font-extrabold px-3 py-0.5 rounded-full">
                {pkg.badge}
              </span>
              <span className="bg-emerald-900/90 text-emerald-100 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-300" />
                Durasi {pkg.durationDays} Hari
              </span>
              <span className="text-xs text-slate-200">
                Keberangkatan: {formatDateIndo(pkg.departureDate)}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black leading-tight text-white">
              {pkg.name}
            </h2>
          </div>
        </div>

        {/* Navigation Tabs inside Modal */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 shrink-0">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'itinerary'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-700" />
            Jadwal Itinerary ({pkg.itinerary.length} Hari)
          </button>
          <button
            onClick={() => setActiveTab('facilities')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'facilities'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Fasilitas & Hotel
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'rooms'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-700" />
            Pilihan Tipe Kamar
          </button>
        </div>

        {/* Modal Scrollable Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          {/* TAB 1: ITINERARY */}
          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 flex items-start gap-3">
                <Plane className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Penerbangan: {pkg.airline.name} ({pkg.airline.code})</p>
                  <p className="text-slate-600 mt-0.5">
                    Rute {pkg.departureCity} menuju Arab Saudi. Direct flight tanpa repot transit, bagasi 30kg + air zamzam 5 liter.
                  </p>
                </div>
              </div>

              <div className="relative pl-6 border-l-2 border-emerald-200 ml-3 space-y-6 py-2">
                {pkg.itinerary.map((day) => (
                  <div key={day.day} className="relative group">
                    {/* Timeline bullet dot */}
                    <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
                      {day.day}
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-emerald-300 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <h4 className="text-sm font-bold text-slate-900">
                          Hari ke-{day.day}: {day.title}
                        </h4>
                        <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                          {day.city}
                        </span>
                      </div>

                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {day.activities.map((act, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: FACILITIES & HOTELS */}
          {activeTab === 'facilities' && (
            <div className="space-y-6">
              {/* Hotel Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 uppercase">Hotel Makkah</span>
                    <div className="flex text-amber-500">
                      {[...Array(pkg.hotelMakkah.stars)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">{pkg.hotelMakkah.name}</h4>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                    {pkg.hotelMakkah.distance}
                  </p>
                  <p className="text-[11px] text-slate-500 pt-1">
                    Buffet 3x makan khas menu Indonesia lezat & higienis.
                  </p>
                </div>

                <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 uppercase">Hotel Madinah</span>
                    <div className="flex text-amber-500">
                      {[...Array(pkg.hotelMadinah.stars)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">{pkg.hotelMadinah.name}</h4>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    {pkg.hotelMadinah.distance}
                  </p>
                  <p className="text-[11px] text-slate-500 pt-1">
                    Akses sangat dekat memudahkan ibadah shalat 5 waktu di Masjid Nabawi.
                  </p>
                </div>
              </div>

              {/* Inclusions List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-700" />
                  Biaya Sudah Termasuk (Included):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {pkg.inclusions.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exclusions List */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Biaya Belum Termasuk (Excluded):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {pkg.exclusions.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-rose-50/50 p-2.5 rounded-lg border border-rose-100 text-rose-950">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ROOM TYPES & SIMULATION */}
          {activeTab === 'rooms' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Harga paket dihitung per orang berdasarkan pilihan konfigurasi kamar hotel selama di Makkah & Madinah:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Quad */}
                <div className="border-2 border-emerald-600/60 bg-emerald-50/40 rounded-2xl p-5 space-y-3 relative">
                  <span className="absolute -top-3 right-4 bg-emerald-800 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    Paling Hemat
                  </span>
                  <div className="flex items-center gap-2 text-emerald-950 font-bold">
                    <Building2 className="w-5 h-5 text-emerald-700" />
                    Kamar Quad (Ber-4)
                  </div>
                  <p className="text-xs text-slate-600">
                    Satu kamar berisi 4 tempat tidur single untuk 4 orang jamaah sesama jenis / keluarga.
                  </p>
                  <div className="text-2xl font-black text-emerald-950">
                    {formatRupiah(pkg.priceQuad)}
                    <span className="text-xs font-normal text-slate-500 block mt-0.5">per orang</span>
                  </div>
                </div>

                {/* Triple */}
                <div className="border border-slate-200 bg-white rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Building2 className="w-5 h-5 text-amber-600" />
                    Kamar Triple (Ber-3)
                  </div>
                  <p className="text-xs text-slate-600">
                    Satu kamar berisi 3 tempat tidur untuk 3 orang jamaah (cocok untuk keluarga kecil).
                  </p>
                  <div className="text-2xl font-black text-slate-900">
                    {formatRupiah(pkg.priceTriple)}
                    <span className="text-xs font-normal text-slate-500 block mt-0.5">per orang</span>
                  </div>
                </div>

                {/* Double */}
                <div className="border border-slate-200 bg-white rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    Kamar Double (Ber-2)
                  </div>
                  <p className="text-xs text-slate-600">
                    Satu kamar berisi 2 tempat tidur untuk pasangan suami-istri atau 2 orang jamaah privat.
                  </p>
                  <div className="text-2xl font-black text-slate-900">
                    {formatRupiah(pkg.priceDouble)}
                    <span className="text-xs font-normal text-slate-500 block mt-0.5">per orang</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-100 rounded-xl p-4 text-xs text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">Catatan Pemesanan Kamar:</p>
                <p>• Jamaah yang mendaftar sendiri (single traveler) akan digabungkan dalam kamar Quad dengan jamaah sesama jenis.</p>
                <p>• Permintaan kamar Double untuk suami istri wajib menyertakan foto Buku Nikah.</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Sticky Footer Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">Harga Paket Mulai</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-950">
              {formatRupiah(pkg.priceQuad)}
              <span className="text-xs font-normal text-slate-500 ml-1">/ pax (Quad)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200 font-semibold text-xs transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                onClose();
                onBookNow(pkg);
              }}
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              Pesan Paket Ini
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
