import React, { useState } from 'react';
import { 
  Calculator, 
  Users, 
  Bed, 
  Check, 
  Plus, 
  ArrowRight, 
  DollarSign, 
  RefreshCw, 
  Sparkles,
  Info
} from 'lucide-react';
import { UmrahPackage, RoomType } from '../types';
import { formatRupiah, formatSar } from '../utils/formatters';
import { KURS_SAR_TO_IDR } from '../data/umrahData';

interface CostCalculatorProps {
  packages: UmrahPackage[];
  onProceedBooking: (pkg: UmrahPackage, roomType: RoomType, pilgrimCount: number) => void;
  liveKursSar?: number;
}

interface AddOn {
  id: string;
  name: string;
  priceIdr: number;
  desc: string;
  perPerson: boolean;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({
  packages,
  onProceedBooking,
  liveKursSar
}) => {
  const [selectedPkgId, setSelectedPkgId] = useState<string>(packages[0]?.id || '');
  const [roomType, setRoomType] = useState<RoomType>('quad');
  const [adultCount, setAdultCount] = useState<number>(2);
  const [childCount, setChildCount] = useState<number>(0);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [customKurs, setCustomKurs] = useState<number>(liveKursSar || KURS_SAR_TO_IDR);

  React.useEffect(() => {
    if (liveKursSar) {
      setCustomKurs(liveKursSar);
    }
  }, [liveKursSar]);

  const availableAddons: AddOn[] = [
    {
      id: 'haramain-train',
      name: 'Upgrade Kereta Cepat Haramain (Madinah - Makkah)',
      priceIdr: 1500000,
      desc: 'Pangkas waktu tempuh 6 jam bus menjadi hanya 2 jam perjalanan nyaman',
      perPerson: true
    },
    {
      id: 'wheelchair',
      name: 'Pendamping & Jasa Kursi Roda Tawaf & Sa’i',
      priceIdr: 950000,
      desc: 'Sangat direkomendasikan untuk lansia atau jamaah dengan keterbatasan fisik',
      perPerson: true
    },
    {
      id: 'saudi-sim',
      name: 'SIM Card Saudi STC / Mobily 5G Unlimited (15 Hari)',
      priceIdr: 350000,
      desc: 'Langsung aktif setibanya di bandara untuk internet dan video call keluarga',
      perPerson: true
    },
    {
      id: 'tour-thaif',
      name: 'Eksplorasi Sejarah Kota Sejuk Thaif & Cable Car',
      priceIdr: 850000,
      desc: 'Wisata ziarah Masjid Ibnu Abbas, pabrik mawar Thaif, dan makan nasi mandi',
      perPerson: true
    },
    {
      id: 'extra-zamzam',
      name: 'Kargo Kirim Zamzam Tambahan ke Alamat Rumah (5L)',
      priceIdr: 450000,
      desc: 'Dikirim resmi langsung ke alamat rumah di Indonesia',
      perPerson: false
    }
  ];

  const currentPkg = packages.find(p => p.id === selectedPkgId) || packages[0];

  const getBasePrice = () => {
    if (roomType === 'quad') return currentPkg.priceQuad;
    if (roomType === 'triple') return currentPkg.priceTriple;
    return currentPkg.priceDouble;
  };

  const totalAdultPrice = getBasePrice() * adultCount;
  // Child price discount (discount 15% if no extra bed)
  const totalChildPrice = Math.round(getBasePrice() * 0.85) * childCount;
  const totalPilgrims = adultCount + childCount;

  // Addons total
  const addonsTotal = selectedAddons.reduce((sum, addId) => {
    const item = availableAddons.find(a => a.id === addId);
    if (!item) return sum;
    return sum + (item.perPerson ? item.priceIdr * totalPilgrims : item.priceIdr);
  }, 0);

  const grandTotalIdr = totalAdultPrice + totalChildPrice + addonsTotal;
  const grandTotalSar = Math.round(grandTotalIdr / customKurs);
  const dpEstimate = totalPilgrims * 5000000;

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter(item => item !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold">
          <Calculator className="w-3.5 h-3.5 text-emerald-700" />
          Kalkulator Simulasi Biaya Umrah Transparan
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Hitung Estimasi Biaya Umrah Sesuai Kebutuhan Anda
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Kombinasikan tipe kamar, jumlah anggota keluarga, dan layanan tambahan. Dapatkan rincian anggaran jelas dalam Rupiah (IDR) dan Riyal Saudi (SAR) tanpa biaya tersembunyi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Package Selection */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Pilih Paket Umrah
            </label>
            <select
              value={selectedPkgId}
              onChange={(e) => setSelectedPkgId(e.target.value)}
              className="w-full text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            >
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} ({pkg.durationDays} Hari) - Mulai {formatRupiah(pkg.priceQuad)}
                </option>
              ))}
            </select>
          </div>

          {/* Card 2: Room Type Selection */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>2. Pilih Tipe Kamar</span>
              <span className="text-emerald-700 font-semibold normal-case text-xs">Termasuk Hotel Bintang 5</span>
            </label>
            
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setRoomType('quad')}
                className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                  roomType === 'quad'
                    ? 'border-emerald-700 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="block text-xs font-bold text-slate-900">Quad (Ber-4)</span>
                <span className="block text-sm font-black text-emerald-900 mt-1">{formatRupiah(currentPkg.priceQuad)}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Paling Hemat</span>
              </button>

              <button
                type="button"
                onClick={() => setRoomType('triple')}
                className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                  roomType === 'triple'
                    ? 'border-emerald-700 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="block text-xs font-bold text-slate-900">Triple (Ber-3)</span>
                <span className="block text-sm font-black text-slate-900 mt-1">{formatRupiah(currentPkg.priceTriple)}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Keluarga 3 Orang</span>
              </button>

              <button
                type="button"
                onClick={() => setRoomType('double')}
                className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                  roomType === 'double'
                    ? 'border-emerald-700 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="block text-xs font-bold text-slate-900">Double (Ber-2)</span>
                <span className="block text-sm font-black text-slate-900 mt-1">{formatRupiah(currentPkg.priceDouble)}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Suami Istri / Privat</span>
              </button>
            </div>
          </div>

          {/* Card 3: Passenger Count */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              3. Jumlah Jamaah
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Dewasa (≥ 12 Tahun)</span>
                  <span className="text-slate-500 text-[11px]">Tarif Kamar Penuh</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                    className="w-7 h-7 bg-white border border-slate-300 rounded-lg flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-slate-900">{adultCount}</span>
                  <button
                    type="button"
                    onClick={() => setAdultCount(adultCount + 1)}
                    className="w-7 h-7 bg-white border border-slate-300 rounded-lg flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Anak (2 - 11 Tahun)</span>
                  <span className="text-slate-500 text-[11px]">Diskon 15%</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setChildCount(Math.max(0, childCount - 1))}
                    className="w-7 h-7 bg-white border border-slate-300 rounded-lg flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-slate-900">{childCount}</span>
                  <button
                    type="button"
                    onClick={() => setChildCount(childCount + 1)}
                    className="w-7 h-7 bg-white border border-slate-300 rounded-lg flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Optional Addons */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                4. Layanan Tambahan (Opsional)
              </label>
              <span className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Rekomendasi Jamaah
              </span>
            </div>

            <div className="space-y-2.5">
              {availableAddons.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`cursor-pointer p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/60'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 text-white ${
                        isSelected ? 'bg-emerald-800' : 'border border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{addon.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{addon.desc}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 text-xs">
                      <span className="font-bold text-emerald-950 block">+{formatRupiah(addon.priceIdr)}</span>
                      <span className="text-[10px] text-slate-400">{addon.perPerson ? '/ orang' : '/ booking'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Invoice Calculation Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white border-2 border-emerald-800/40 rounded-3xl p-6 shadow-lg space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider block">
                Ringkasan Estimasi Biaya
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                {currentPkg.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Kamar: <strong className="capitalize text-slate-800">{roomType}</strong> • Total {totalPilgrims} Jamaah
              </p>
            </div>

            {/* Line Items Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-600 border-b border-slate-200 pb-4">
              <div className="flex justify-between">
                <span>Dewasa ({adultCount} x {formatRupiah(getBasePrice())}):</span>
                <span className="font-bold text-slate-900">{formatRupiah(totalAdultPrice)}</span>
              </div>

              {childCount > 0 && (
                <div className="flex justify-between">
                  <span>Anak ({childCount} x diskon 15%):</span>
                  <span className="font-bold text-slate-900">{formatRupiah(totalChildPrice)}</span>
                </div>
              )}

              {selectedAddons.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-dashed border-slate-200">
                  <span className="font-semibold text-slate-700 block">Layanan Tambahan Terpilih:</span>
                  {selectedAddons.map((addId) => {
                    const add = availableAddons.find(a => a.id === addId)!;
                    const subCost = add.perPerson ? add.priceIdr * totalPilgrims : add.priceIdr;
                    return (
                      <div key={add.id} className="flex justify-between text-[11px] text-emerald-800 pl-2">
                        <span>• {add.name}</span>
                        <span>{formatRupiah(subCost)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Grand Total */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-700">Total Biaya Keseluruhan:</span>
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-950">{formatRupiah(grandTotalIdr)}</div>
                  <div className="text-xs font-semibold text-amber-600">≈ {formatSar(grandTotalSar)}</div>
                </div>
              </div>

              {/* Kurs Simulator input */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 text-slate-400" />
                  Kurs Konversi:
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-slate-700">1 SAR = Rp</span>
                  <input
                    type="number"
                    value={customKurs}
                    onChange={(e) => setCustomKurs(Number(e.target.value) || KURS_SAR_TO_IDR)}
                    className="w-16 p-1 text-center font-bold bg-white border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Down Payment Info */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 space-y-1">
              <div className="flex justify-between font-bold">
                <span>DP Booking Kursi ({totalPilgrims} Jamaah):</span>
                <span>{formatRupiah(dpEstimate)}</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Sisa pelunasan dapat diangsur secara bertahap hingga 30 hari sebelum keberangkatan.
              </p>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => onProceedBooking(currentPkg, roomType, totalPilgrims)}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-emerald-950 font-extrabold text-sm rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              Lanjutkan Booking dengan Simulasi Ini
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
