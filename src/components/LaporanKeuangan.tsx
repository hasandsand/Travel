import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  FileSpreadsheet,
  Building2,
  Plane,
  ShieldCheck,
  Percent,
  Sliders,
  Wallet,
  Clock,
  CheckCircle2,
  ChevronDown,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Receipt,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BookingRecord, UmrahPackage, PackageCostBreakdown } from '../types';

interface LaporanKeuanganProps {
  bookings: BookingRecord[];
  packages: UmrahPackage[];
}

// Biaya operasional standar per jamaah jika paket belum memiliki rincian khusus
const DEFAULT_BIAYA_OPERASIONAL: PackageCostBreakdown = {
  tiketPesawatPerPax: 13500000,
  visaTasrehPerPax: 3200000,
  hotelMakkahPerPax: 3800000,
  hotelMadinahPerPax: 2500000,
  busTransportPerPax: 850000,
  handlingPerlengkapanPerPax: 1200000,
  cateringPerPax: 1100000,
  muthawwifTourLeaderPerPax: 500000,
  operationalTravelPerPax: 450000
};

// Default biaya overhead kantor & operasional bulanan travel
const DEFAULT_OVERHEAD_KANTOR_BULANAN = 22500000; // Rp 22.500.000 / bulan (gaji staf, lisensi PPIU, sewa, listrik, promosi)

export const LaporanKeuangan: React.FC<LaporanKeuanganProps> = ({
  bookings,
  packages
}) => {
  // Period filter mode: 'departure' (berdasarkan tanggal berangkat) vs 'booking' (berdasarkan tanggal daftar)
  const [basisPeriode, setBasisPeriode] = useState<'departure' | 'booking'>('departure');

  // Time grouping: 'bulanan' | 'triwulan' | 'semua'
  const [modePeriode, setModePeriode] = useState<'bulanan' | 'triwulan' | 'semua'>('bulanan');

  // Selected specific period filter
  const [selectedPeriode, setSelectedPeriode] = useState<string>('all');

  // Filter paket
  const [selectedPackageId, setSelectedPackageId] = useState<string>('all');

  // Biaya overhead kantor bulanan yang dapat disesuaikan travel
  const [biayaOverheadBulanan, setBiayaOverheadBulanan] = useState<number>(DEFAULT_OVERHEAD_KANTOR_BULANAN);

  // Helper formatting IDR
  const formatIdr = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatJuta = (amount: number): string => {
    return `Rp ${(amount / 1000000).toFixed(1)} Jt`;
  };

  // Helper untuk mengekstrak periode dari tanggal YYYY-MM-DD
  const getPeriodKey = (dateStr: string, mode: 'bulanan' | 'triwulan'): { key: string; label: string } => {
    if (!dateStr) return { key: 'unknown', label: 'Tidak Diketahui' };
    const parts = dateStr.split('-');
    const year = parts[0] || '2026';
    const month = parseInt(parts[1] || '1', 10);

    if (mode === 'triwulan') {
      const q = Math.ceil(month / 3);
      return {
        key: `${year}-Q${q}`,
        label: `Kuartal ${q} ${year} (Q${q} ${year})`
      };
    }

    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return {
      key: `${year}-${String(month).padStart(2, '0')}`,
      label: `${monthNames[month - 1] || 'Bulan'} ${year}`
    };
  };

  // Helper menghitung biaya operasional langsung (HPP) per pax untuk suatu paket
  const getBiayaOperasionalPerPax = (pkg?: UmrahPackage): number => {
    if (!pkg) return 26900000;
    const cb = pkg.costBreakdown || DEFAULT_BIAYA_OPERASIONAL;
    return (
      cb.tiketPesawatPerPax +
      cb.visaTasrehPerPax +
      cb.hotelMakkahPerPax +
      cb.hotelMadinahPerPax +
      cb.busTransportPerPax +
      cb.handlingPerlengkapanPerPax +
      cb.cateringPerPax +
      cb.muthawwifTourLeaderPerPax +
      cb.operationalTravelPerPax
    );
  };

  // List opsi periode yang tersedia dari data booking
  const availablePeriods = useMemo(() => {
    const periodMap = new Map<string, string>();
    bookings.forEach((b) => {
      const dateToUse = basisPeriode === 'departure' ? b.departureDate : b.createdAt;
      const { key, label } = getPeriodKey(dateToUse, modePeriode === 'triwulan' ? 'triwulan' : 'bulanan');
      if (!periodMap.has(key)) {
        periodMap.set(key, label);
      }
    });

    // Urutkan key secara kronologis
    return Array.from(periodMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, label]) => ({ key, label }));
  }, [bookings, basisPeriode, modePeriode]);

  // Filter booking berdasarkan periode dan paket yang dipilih
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (selectedPackageId !== 'all' && b.packageId !== selectedPackageId) {
        return false;
      }
      if (selectedPeriode !== 'all') {
        const dateToUse = basisPeriode === 'departure' ? b.departureDate : b.createdAt;
        const { key } = getPeriodKey(dateToUse, modePeriode === 'triwulan' ? 'triwulan' : 'bulanan');
        if (key !== selectedPeriode) {
          return false;
        }
      }
      return true;
    });
  }, [bookings, selectedPackageId, selectedPeriode, basisPeriode, modePeriode]);

  // Kalkulasi Utama Laba Rugi untuk Booking Terfilter
  const financialMetrics = useMemo(() => {
    let estimasiPendapatanKotor = 0;
    let kasDiterima = 0;
    let totalPax = 0;

    // Komponen Biaya Operasional Paket Terinci
    const biayaOperasionalDetail = {
      tiketPesawat: 0,
      visaTasrehAsuransi: 0,
      hotelMakkah: 0,
      hotelMadinah: 0,
      transportBusKereta: 0,
      handlingPerlengkapan: 0,
      cateringFullboard: 0,
      muthawwifTourLeader: 0,
      manasikOperasionalPaket: 0
    };

    let countLunas = 0;
    let countDp = 0;
    let countMenunggu = 0;
    let nominalLunas = 0;
    let nominalDp = 0;
    let nominalMenunggu = 0;

    filteredBookings.forEach((b) => {
      const paxCount = b.pilgrims.length;
      totalPax += paxCount;
      estimasiPendapatanKotor += b.totalPriceIdr;

      const paid = b.paidAmountIdr || (b.paymentStatus === 'Lunas' ? b.totalPriceIdr : 0);
      kasDiterima += paid;

      if (b.paymentStatus === 'Lunas') {
        countLunas += paxCount;
        nominalLunas += b.totalPriceIdr;
      } else if (b.paymentStatus === 'DP Terverifikasi') {
        countDp += paxCount;
        nominalDp += b.totalPriceIdr;
      } else {
        countMenunggu += paxCount;
        nominalMenunggu += b.totalPriceIdr;
      }

      const pkg = packages.find((p) => p.id === b.packageId);
      const cb = pkg?.costBreakdown || DEFAULT_BIAYA_OPERASIONAL;

      biayaOperasionalDetail.tiketPesawat += cb.tiketPesawatPerPax * paxCount;
      biayaOperasionalDetail.visaTasrehAsuransi += cb.visaTasrehPerPax * paxCount;
      biayaOperasionalDetail.hotelMakkah += cb.hotelMakkahPerPax * paxCount;
      biayaOperasionalDetail.hotelMadinah += cb.hotelMadinahPerPax * paxCount;
      biayaOperasionalDetail.transportBusKereta += cb.busTransportPerPax * paxCount;
      biayaOperasionalDetail.handlingPerlengkapan += cb.handlingPerlengkapanPerPax * paxCount;
      biayaOperasionalDetail.cateringFullboard += cb.cateringPerPax * paxCount;
      biayaOperasionalDetail.muthawwifTourLeader += cb.muthawwifTourLeaderPerPax * paxCount;
      biayaOperasionalDetail.manasikOperasionalPaket += cb.operationalTravelPerPax * paxCount;
    });

    const totalBiayaOperasionalPaket = Object.values(biayaOperasionalDetail).reduce((a, b) => a + b, 0);
    const piutangJamaah = estimasiPendapatanKotor - kasDiterima;

    // Laba Kotor (Gross Profit)
    const labaKotor = estimasiPendapatanKotor - totalBiayaOperasionalPaket;
    const marginLabaKotor = estimasiPendapatanKotor > 0 ? (labaKotor / estimasiPendapatanKotor) * 100 : 0;

    // Alokasi Biaya Overhead Kantor & Umum Perusahaan berdasarkan periode
    // Jika melihat periode spesifik 1 bulan, gunakan biaya bulanan; jika semua/triwulan sesuaikan faktor pengali
    const faktorBulan = selectedPeriode === 'all' ? Math.max(availablePeriods.length, 1) : modePeriode === 'triwulan' ? 3 : 1;
    const totalOverheadKantor = biayaOverheadBulanan * faktorBulan;

    // Laba Bersih Operasional (Net Profit)
    const labaBersih = labaKotor - totalOverheadKantor;
    const marginLabaBersih = estimasiPendapatanKotor > 0 ? (labaBersih / estimasiPendapatanKotor) * 100 : 0;

    return {
      estimasiPendapatanKotor,
      kasDiterima,
      piutangJamaah,
      totalPax,
      biayaOperasionalDetail,
      totalBiayaOperasionalPaket,
      labaKotor,
      marginLabaKotor,
      totalOverheadKantor,
      labaBersih,
      marginLabaBersih,
      statusBreakdown: {
        countLunas,
        countDp,
        countMenunggu,
        nominalLunas,
        nominalDp,
        nominalMenunggu
      }
    };
  }, [filteredBookings, packages, biayaOverheadBulanan, selectedPeriode, availablePeriods.length, modePeriode]);

  // Data perbandingan berkala untuk Grafik Tren Periodik
  const periodicTrendData = useMemo(() => {
    const groups = new Map<
      string,
      {
        key: string;
        label: string;
        pendapatan: number;
        biayaOperasional: number;
        labaKotor: number;
        pax: number;
      }
    >();

    availablePeriods.forEach((p) => {
      groups.set(p.key, {
        key: p.key,
        label: p.label.split('(')[0].trim(),
        pendapatan: 0,
        biayaOperasional: 0,
        labaKotor: 0,
        pax: 0
      });
    });

    bookings.forEach((b) => {
      if (selectedPackageId !== 'all' && b.packageId !== selectedPackageId) return;

      const dateToUse = basisPeriode === 'departure' ? b.departureDate : b.createdAt;
      const { key } = getPeriodKey(dateToUse, modePeriode === 'triwulan' ? 'triwulan' : 'bulanan');

      if (groups.has(key)) {
        const item = groups.get(key)!;
        const pax = b.pilgrims.length;
        const pkg = packages.find((p) => p.id === b.packageId);
        const costPerPax = getBiayaOperasionalPerPax(pkg);

        item.pendapatan += b.totalPriceIdr;
        item.biayaOperasional += costPerPax * pax;
        item.pax += pax;
        item.labaKotor = item.pendapatan - item.biayaOperasional;
      }
    });

    return Array.from(groups.values()).map((g) => ({
      ...g,
      pendapatanJt: Math.round(g.pendapatan / 1000000),
      biayaJt: Math.round(g.biayaOperasional / 1000000),
      labaJt: Math.round(g.labaKotor / 1000000)
    }));
  }, [bookings, packages, selectedPackageId, availablePeriods, basisPeriode, modePeriode]);

  // Komposisi Komponen Biaya untuk Pie Chart
  const pieChartBiayaData = useMemo(() => {
    const d = financialMetrics.biayaOperasionalDetail;
    const list = [
      { name: 'Tiket Pesawat PP', value: d.tiketPesawat, color: '#2563eb' },
      { name: 'Hotel Makkah (Bintang 5)', value: d.hotelMakkah, color: '#059669' },
      { name: 'Hotel Madinah (Dekat Nabawi)', value: d.hotelMadinah, color: '#10b981' },
      { name: 'Visa & Asuransi Saudi', value: d.visaTasrehAsuransi, color: '#d97706' },
      { name: 'Katering Fullboard 3x', value: d.cateringFullboard, color: '#7c3aed' },
      { name: 'Transport Bus & Kereta Cepat', value: d.transportBusKereta, color: '#0891b2' },
      { name: 'Perlengkapan & Handling', value: d.handlingPerlengkapan, color: '#db2777' },
      { name: 'Muthawwif & Tour Leader', value: d.muthawwifTourLeader, color: '#475569' },
      { name: 'Manasik & Operasional Lapangan', value: d.manasikOperasionalPaket, color: '#64748b' }
    ];
    return list.filter((i) => i.value > 0);
  }, [financialMetrics.biayaOperasionalDetail]);

  // Ekspor Laporan Laba Rugi ke CSV / Excel
  const handleExportCsv = () => {
    const titlePeriode =
      selectedPeriode === 'all'
        ? 'Seluruh Periode 1448H'
        : availablePeriods.find((p) => p.key === selectedPeriode)?.label || selectedPeriode;

    const csvRows = [
      ['LAPORAN LABA RUGI PERUSAHAAN (PROFIT & LOSS STATEMENT)'],
      ['PT KAREEM MANDIRI SYARIAH - BIRO PERJALANAN WISATA UMRAH & HAJI KHUSUS'],
      ['Izin Kemenag RI No: 812/PPIU/2022 • Terakreditasi A'],
      [`Periode: ${titlePeriode}`],
      [`Basis Perhitungan: Berdasarkan Tanggal ${basisPeriode === 'departure' ? 'Keberangkatan' : 'Pendaftaran Booking'}`],
      [`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`],
      [''],
      ['KODE AKUN', 'URAIAN AKUN KEUANGAN', 'JUMLAH (IDR)', 'CATATAN'],
      ['4-0000', 'PENDAPATAN USAHA (REVENUE)', '', ''],
      ['4-1000', 'Estimasi Pendapatan Penjualan Paket Umrah', financialMetrics.estimasiPendapatanKotor, `Dari ${financialMetrics.totalPax} Jamaah Terdaftar`],
      ['4-1100', ' - Kas Realisasi Diterima (DP & Pelunasan)', financialMetrics.kasDiterima, 'Dana masuk rekening'],
      ['4-1200', ' - Piutang Belum Tertagih', financialMetrics.piutangJamaah, 'Sisa pelunasan sebelum berangkat'],
      ['', 'TOTAL PENDAPATAN KOTOR (GROSS REVENUE)', financialMetrics.estimasiPendapatanKotor, '100.0%'],
      [''],
      ['5-0000', 'BIAYA OPERASIONAL LANGSUNG PAKET (HPP)', '', ''],
      ['5-1000', 'Tiket Pesawat Maskapai PP', financialMetrics.biayaOperasionalDetail.tiketPesawat, 'Garuda / Saudia / Turkish'],
      ['5-2000', 'Akomodasi Hotel Makkah', financialMetrics.biayaOperasionalDetail.hotelMakkah, 'Bintang 5 Nol Meter'],
      ['5-2100', 'Akomodasi Hotel Madinah', financialMetrics.biayaOperasionalDetail.hotelMadinah, 'Depan Pelataran Masjid Nabawi'],
      ['5-3000', 'Visa Umrah, Tasreh Raudhah & Asuransi Saudi', financialMetrics.biayaOperasionalDetail.visaTasrehAsuransi, 'E-Visa KSA'],
      ['5-4000', 'Konsumsi & Katering Fullboard 3x', financialMetrics.biayaOperasionalDetail.cateringFullboard, 'Menu Masakan Nusantara'],
      ['5-5000', 'Transportasi Bus Antar-Kota & Kereta Cepat Haramain', financialMetrics.biayaOperasionalDetail.transportBusKereta, 'VIP AC Executive'],
      ['5-6000', 'Perlengkapan Koper Fiber, Seragam & Handling Bandara', financialMetrics.biayaOperasionalDetail.handlingPerlengkapan, 'Handling Soetta & Saudi'],
      ['5-7000', 'Honorarium Muthawwif & Tour Leader BNSP', financialMetrics.biayaOperasionalDetail.muthawwifTourLeader, 'Asatidz Berpengalaman'],
      ['5-8000', 'Manasik Haji/Umrah & Operasional Lapangan Paket', financialMetrics.biayaOperasionalDetail.manasikOperasionalPaket, 'Bimbingan Teori & Praktik'],
      ['', 'TOTAL BIAYA OPERASIONAL PAKET', financialMetrics.totalBiayaOperasionalPaket, `${financialMetrics.estimasiPendapatanKotor > 0 ? ((financialMetrics.totalBiayaOperasionalPaket / financialMetrics.estimasiPendapatanKotor) * 100).toFixed(1) : 0}%`],
      [''],
      ['', 'LABA KOTOR OPERASIONAL (GROSS PROFIT)', financialMetrics.labaKotor, `Margin: ${financialMetrics.marginLabaKotor.toFixed(1)}%`],
      [''],
      ['6-0000', 'BIAYA OPERASIONAL KANTOR & UMUM (OVERHEAD OPEX)', '', ''],
      ['6-1000', 'Gaji Pegawai, Staf Administrasi & Customer Service', Math.round(financialMetrics.totalOverheadKantor * 0.5), 'Alokasi bulanan operasional'],
      ['6-2000', 'Sewa Kantor, Listrik, Internet & Lisensi Siskopatuh', Math.round(financialMetrics.totalOverheadKantor * 0.3), 'Fasilitas & Sistem'],
      ['6-3000', 'Pemasaran, Brosur Cetak & Iklan Syiar Digital', Math.round(financialMetrics.totalOverheadKantor * 0.2), 'Akuisisi Jamaah'],
      ['', 'TOTAL BIAYA OVERHEAD PERUSAHAAN', financialMetrics.totalOverheadKantor, 'Beban Tetap Periode'],
      [''],
      ['', 'LABA BERSIH PERUSAHAAN (NET PROFIT)', financialMetrics.labaBersih, `Margin Bersih: ${financialMetrics.marginLabaBersih.toFixed(1)}%`]
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      csvRows.map((row) => row.map((val) => `"${val}"`).join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Laba_Rugi_KareemTravel_${selectedPeriode}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="laporan-keuangan-container" className="space-y-6">
      {/* 1. HEADER UTAMA LAPORAN KEUANGAN */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-7 rounded-3xl border border-slate-700 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 print:hidden">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
              Laporan Keuangan Resmi
            </span>
            <span className="text-xs text-amber-300 font-mono">
              PT Kareem Mandiri Syariah • Izin PPIU No. 812/2022
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2.5 text-white">
            <Receipt className="w-6 h-6 text-amber-400" />
            Laporan Keuangan & Estimasi Laba Rugi Periodik
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Menghitung estimasi total pendapatan dari daftar booking jamaah, dikurangi seluruh komponen biaya operasional langsung paket (tiket, hotel, visa, katering, muthawwif) serta biaya operasional kantor, untuk menyajikan laba kotor dan laba bersih perusahaan secara periodik.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            id="btn-export-laporan-csv"
            onClick={handleExportCsv}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow flex items-center gap-1.5 border border-emerald-500/40 cursor-pointer"
            title="Download Laporan Laba Rugi ke Excel/CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-300" />
            <span>Ekspor Excel/CSV</span>
          </button>
          <button
            id="btn-print-laporan-keuangan"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all shadow flex items-center gap-1.5 border border-slate-600 cursor-pointer"
            title="Cetak format cetak Laporan Laba Rugi"
          >
            <Printer className="w-4 h-4 text-slate-300" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* 2. FILTER PERIODIK & PARAMETER KEUANGAN */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 print:hidden">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Basis Periode & Filter Periode Spesifik */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
              <button
                id="btn-basis-departure"
                onClick={() => setBasisPeriode('departure')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  basisPeriode === 'departure'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Berdasarkan Bulan Keberangkatan
              </button>
              <button
                id="btn-basis-booking"
                onClick={() => setBasisPeriode('booking')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  basisPeriode === 'booking'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Berdasarkan Tanggal Booking
              </button>
            </div>

            {/* Mode Periode (Bulanan / Triwulan) */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
              <button
                id="btn-mode-bulanan"
                onClick={() => {
                  setModePeriode('bulanan');
                  setSelectedPeriode('all');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  modePeriode === 'bulanan'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bulanan
              </button>
              <button
                id="btn-mode-triwulan"
                onClick={() => {
                  setModePeriode('triwulan');
                  setSelectedPeriode('all');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  modePeriode === 'triwulan'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Triwulan (Kuartal)
              </button>
            </div>

            {/* Dropdown Periode Spesifik */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <select
                id="select-filter-periode"
                value={selectedPeriode}
                onChange={(e) => setSelectedPeriode(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="all">Semua Periode (Konsolidasi)</option>
                {availablePeriods.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Paket Umrah */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                id="select-filter-paket"
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="all">Semua Program Paket</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Adjustment Overhead Kantor */}
          <div className="flex items-center gap-2 self-end lg:self-auto bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200 text-xs">
            <span className="text-slate-500 font-semibold">Overhead Kantor/Bln:</span>
            <span className="font-mono font-bold text-slate-800">
              {formatIdr(biayaOverheadBulanan)}
            </span>
            <button
              id="btn-edit-overhead"
              onClick={() => {
                const newVal = prompt(
                  'Masukkan estimasi biaya operasional kantor / overhead per bulan (Rp):',
                  String(biayaOverheadBulanan)
                );
                if (newVal && !isNaN(Number(newVal))) {
                  setBiayaOverheadBulanan(Number(newVal));
                }
              }}
              className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
            >
              Ubah
            </button>
          </div>
        </div>

        {/* Informasi Periode yang Sedang Ditinjau */}
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2 rounded-2xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold uppercase">Periode Aktif:</span>
            <span className="font-semibold">
              {selectedPeriode === 'all'
                ? 'Seluruh Periode Berjalan 1448H'
                : availablePeriods.find((p) => p.key === selectedPeriode)?.label || selectedPeriode}
            </span>
            <span className="text-emerald-600 font-normal">
              ({filteredBookings.length} rombongan booking, {financialMetrics.totalPax} jamaah)
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-mono">
            Basis: {basisPeriode === 'departure' ? 'Tanggal Berangkat' : 'Tanggal Booking'}
          </span>
        </div>
      </div>

      {/* 3. KARTU RINGKASAN METRIK KEUANGAN UTAMA (4 METRIC CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Estimasi Pendapatan Kotor */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Estimasi Pendapatan
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
              IDR
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 truncate">
            {formatJuta(financialMetrics.estimasiPendapatanKotor)}
          </p>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>Kas Masuk:</span>
            <span className="font-bold text-emerald-700">{formatJuta(financialMetrics.kasDiterima)}</span>
          </div>
          <div className="text-[10px] text-amber-700 flex justify-between">
            <span>Sisa Piutang:</span>
            <span className="font-mono font-bold">{formatJuta(financialMetrics.piutangJamaah)}</span>
          </div>
        </div>

        {/* Biaya Operasional Paket (HPP) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Biaya Operasional Paket
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-700 truncate">
            {formatJuta(financialMetrics.totalBiayaOperasionalPaket)}
          </p>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>Beban per Pax:</span>
            <span className="font-mono font-bold text-slate-700">
              {financialMetrics.totalPax > 0
                ? formatJuta(financialMetrics.totalBiayaOperasionalPaket / financialMetrics.totalPax)
                : 'Rp 0'}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between">
            <span>Rasio Beban Paket:</span>
            <span className="font-bold">
              {financialMetrics.estimasiPendapatanKotor > 0
                ? `${((financialMetrics.totalBiayaOperasionalPaket / financialMetrics.estimasiPendapatanKotor) * 100).toFixed(1)}%`
                : '0%'}
            </span>
          </div>
        </div>

        {/* Laba Kotor Operasional */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Laba Kotor Operasional
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-800 truncate">
            {formatJuta(financialMetrics.labaKotor)}
          </p>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>Margin Kotor:</span>
            <span className="font-black text-emerald-700">
              {financialMetrics.marginLabaKotor.toFixed(1)}%
            </span>
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between">
            <span>Rata-rata/Pax:</span>
            <span className="font-mono font-bold text-emerald-700">
              +{financialMetrics.totalPax > 0 ? formatJuta(financialMetrics.labaKotor / financialMetrics.totalPax) : '0'}
            </span>
          </div>
        </div>

        {/* Laba Bersih Perusahaan (Net Profit) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Laba Bersih (Net Profit)
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p
            className={`text-2xl font-black truncate ${
              financialMetrics.labaBersih >= 0 ? 'text-purple-900' : 'text-rose-600'
            }`}
          >
            {formatJuta(financialMetrics.labaBersih)}
          </p>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>Setelah Overhead:</span>
            <span className="font-mono font-bold text-slate-700">
              -{formatJuta(financialMetrics.totalOverheadKantor)}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 flex justify-between">
            <span>Net Profit Margin:</span>
            <span
              className={`font-black ${
                financialMetrics.marginLabaBersih >= 8 ? 'text-emerald-700' : 'text-amber-600'
              }`}
            >
              {financialMetrics.marginLabaBersih.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* 4. GRAFIK KEUANGAN: TREN PERIODIK & KOMPOSISI BIAYA OPERASIONAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        {/* Grafik Bar: Tren Pendapatan vs Biaya vs Laba Kotor per Periode */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-700" />
                Tren Finansial Periodik (Juta Rupiah)
              </h3>
              <p className="text-xs text-slate-500">
                Perbandingan estimasi omzet, total biaya operasional paket, dan laba kotor per {modePeriode}.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
              {periodicTrendData.length} Periode
            </span>
          </div>

          <div className="h-[270px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={periodicTrendData} margin={{ top: 15, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  unit=" Jt"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[200px]">
                        <p className="font-extrabold text-amber-400 border-b border-slate-700 pb-1">
                          {data.label}
                        </p>
                        <p className="text-slate-300">
                          Total Jamaah: <span className="font-bold text-white">{data.pax} orang</span>
                        </p>
                        <div className="space-y-0.5 pt-1">
                          <p className="flex justify-between text-blue-300">
                            <span>Pendapatan:</span>
                            <span className="font-mono font-bold">Rp {data.pendapatanJt} Jt</span>
                          </p>
                          <p className="flex justify-between text-amber-300">
                            <span>Biaya Paket:</span>
                            <span className="font-mono font-bold">Rp {data.biayaJt} Jt</span>
                          </p>
                          <p className="flex justify-between text-emerald-400 font-bold border-t border-slate-700 pt-1">
                            <span>Laba Kotor:</span>
                            <span className="font-mono">Rp {data.labaJt} Jt</span>
                          </p>
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="pendapatanJt" name="Estimasi Pendapatan" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="biayaJt" name="Biaya Operasional" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="labaJt" name="Laba Kotor" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Komposisi Komponen Biaya Operasional Paket */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-amber-600" />
              Alokasi Biaya Operasional
            </h3>
            <p className="text-xs text-slate-500">
              Distribusi pengeluaran paket di periode terpilih.
            </p>
          </div>

          <div className="h-[180px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartBiayaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieChartBiayaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [formatIdr(val), 'Biaya']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: 12,
                    color: '#fff',
                    fontSize: 12
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-slate-400">Total Biaya</span>
              <span className="text-xs font-black text-slate-900">
                {formatJuta(financialMetrics.totalBiayaOperasionalPaket)}
              </span>
            </div>
          </div>

          <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1 text-xs">
            {pieChartBiayaData.slice(0, 4).map((c, idx) => (
              <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="font-semibold text-slate-700 truncate">{c.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 shrink-0">
                  {financialMetrics.totalBiayaOperasionalPaket > 0
                    ? `${Math.round((c.value / financialMetrics.totalBiayaOperasionalPaket) * 100)}%`
                    : '0%'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. LEMBAR RESMI LAPORAN LABA RUGI (FORMAL FINANCIAL STATEMENT SHEET) */}
      <div className="bg-white rounded-3xl border border-slate-300 shadow-md overflow-hidden print:border-none print:shadow-none">
        {/* Kop Surat Laporan Resmi */}
        <div className="p-6 sm:p-8 bg-slate-900 text-white border-b border-slate-800 print:bg-white print:text-black print:border-b-2 print:border-black">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-amber-400 print:text-black">
                PT KAREEM MANDIRI SYARIAH
              </h2>
              <p className="text-xs text-slate-300 print:text-gray-600 font-medium">
                Penyelenggara Perjalanan Ibadah Umrah (PPIU) Resmi Kemenag RI No. 812/2022
              </p>
              <p className="text-xs text-slate-400 print:text-gray-500">
                Menara Da’wah Lt. 9, Jl. Kramat Raya No. 45, Jakarta Pusat • Telp: (021) 390-8888
              </p>
            </div>
            <div className="text-left sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 bg-emerald-700 text-white text-xs font-black rounded-lg uppercase tracking-wide print:border print:border-black print:text-black print:bg-white">
                LAPORAN LABA RUGI PERIODIK
              </span>
              <p className="text-xs text-slate-300 print:text-black font-semibold">
                Periode:{' '}
                {selectedPeriode === 'all'
                  ? 'Seluruh Periode Musim 1448H'
                  : availablePeriods.find((p) => p.key === selectedPeriode)?.label || selectedPeriode}
              </p>
              <p className="text-[11px] text-slate-400 print:text-gray-500">
                Dicetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Tabel Laba Rugi Berstandar Akuntansi */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* I. PENDAPATAN USAHA (REVENUE) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-600 text-white rounded flex items-center justify-center text-[10px]">I</span>
                Pendapatan Usaha (Revenue)
              </h4>
              <span className="text-xs font-bold text-slate-500">Jumlah (IDR)</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800">
                    Estimasi Penjualan Paket Umrah ({financialMetrics.totalPax} Jamaah Terdaftar)
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Nilai transaksi pemesanan dari {filteredBookings.length} rombongan booking
                  </p>
                </div>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {formatIdr(financialMetrics.estimasiPendapatanKotor)}
                </span>
              </div>

              {/* Sub-item: Rincian Realisasi Kas & Piutang */}
              <div className="py-2 pl-4 flex justify-between items-center text-slate-600 bg-slate-50/50">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Realisasi Kas Diterima (DP & Pelunasan Terverifikasi)
                </span>
                <span className="font-mono font-bold text-emerald-700">
                  {formatIdr(financialMetrics.kasDiterima)}
                </span>
              </div>

              <div className="py-2 pl-4 flex justify-between items-center text-slate-600 bg-slate-50/50">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Piutang Pelunasan Jamaah (Belum Lunas)
                </span>
                <span className="font-mono font-semibold text-amber-700">
                  {formatIdr(financialMetrics.piutangJamaah)}
                </span>
              </div>

              <div className="py-3 flex justify-between items-center font-black bg-blue-50/60 px-3 rounded-xl">
                <span className="text-blue-950 uppercase tracking-wide">
                  Total Pendapatan Usaha Bruto
                </span>
                <span className="font-mono text-base text-blue-950">
                  {formatIdr(financialMetrics.estimasiPendapatanKotor)}
                </span>
              </div>
            </div>
          </div>

          {/* II. BIAYA OPERASIONAL LANGSUNG PAKET (HPP) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 bg-amber-600 text-white rounded flex items-center justify-center text-[10px]">II</span>
                Beban Pokok Operasional Paket (Direct Operating Costs / HPP)
              </h4>
              <span className="text-xs font-bold text-slate-500">Jumlah (IDR)</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Plane className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-slate-700">Tiket Pesawat Penerbangan PP (Garuda / Saudia / Turkish)</span>
                </div>
                <span className="font-mono font-semibold text-slate-800">
                  {formatIdr(financialMetrics.biayaOperasionalDetail.tiketPesawat)}
                </span>
              </div>

              <div className="py-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-slate-700">Akomodasi Hotel Makkah (Bintang 5 Nol Meter / Pelataran)</span>
                </div>
                <span className="font-mono font-semibold text-slate-800">
                  {formatIdr(financialMetrics.biayaOperasionalDetail.hotelMakkah)}
                </span>
              </div>

              <div className="py-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-slate-700">Akomodasi Hotel Madinah (Depan Pintu Masjid Nabawi)</span>
                </div>
                <span className="font-mono font-semibold text-slate-800">
                  {formatIdr(financialMetrics.biayaOperasionalDetail.hotelMadinah)}
                </span>
              </div>

              <div className="py-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-slate-700">Visa Umrah Elektronik, Tasreh Raudhah & Asuransi KSA</span>
                </div>
                <span className="font-mono font-semibold text-slate-800">
                  {formatIdr(financialMetrics.biayaOperasionalDetail.visaTasrehAsuransi)}
                </span>
              </div>

              <div className="py-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-slate-700">Konsumsi & Katering Fullboard 3x Sehari (Catering Nusantara)</span>
                </div>
                <span className="font-mono font-semibold text-slate-800">
                  {formatIdr(financialMetrics.biayaOperasionalDetail.cateringFullboard)}
                </span>
              </div>

              <div className="py-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-slate-700">Transportasi Bus Eksekutif & Kereta Cepat Haramain Express</span>
                </div>
                <span className="font-mono font-semibold text-slate-800">
                  {formatIdr(financialMetrics.biayaOperasionalDetail.transportBusKereta)}
                </span>
              </div>

              <div className="py-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-slate-700">Perlengkapan Koper Fiber, Kain Ihram/Mukena & Handling Bandara</span>
                </div>
                <span className="font-mono font-semibold text-slate-800">
                  {formatIdr(financialMetrics.biayaOperasionalDetail.handlingPerlengkapan)}
                </span>
              </div>

              <div className="py-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-slate-700">Honorarium Muthawwif Pembimbing Ibadah & Tour Leader BNSP</span>
                </div>
                <span className="font-mono font-semibold text-slate-800">
                  {formatIdr(financialMetrics.biayaOperasionalDetail.muthawwifTourLeader)}
                </span>
              </div>

              <div className="py-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-slate-700">Pelaksanaan Manasik Umrah & Operasional Lapangan Paket</span>
                </div>
                <span className="font-mono font-semibold text-slate-800">
                  {formatIdr(financialMetrics.biayaOperasionalDetail.manasikOperasionalPaket)}
                </span>
              </div>

              <div className="py-3 flex justify-between items-center font-black bg-amber-50/70 px-3 rounded-xl">
                <span className="text-amber-950 uppercase tracking-wide">
                  Total Biaya Operasional Paket (HPP)
                </span>
                <span className="font-mono text-base text-amber-900">
                  ({formatIdr(financialMetrics.totalBiayaOperasionalPaket)})
                </span>
              </div>
            </div>
          </div>

          {/* III. LABA KOTOR (GROSS PROFIT) */}
          <div className="p-4 bg-emerald-900 text-white rounded-2xl flex items-center justify-between shadow-md print:bg-gray-100 print:text-black print:border">
            <div className="space-y-0.5">
              <span className="text-xs text-emerald-300 print:text-gray-700 font-extrabold uppercase tracking-wider">
                III. Laba Kotor Operasional (Gross Profit)
              </span>
              <p className="text-xs text-emerald-100 print:text-gray-600">
                Selisih Estimasi Pendapatan dikurangi Biaya Operasional Paket
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl sm:text-2xl font-black font-mono text-amber-300 print:text-black">
                {formatIdr(financialMetrics.labaKotor)}
              </p>
              <p className="text-xs text-emerald-200 print:text-gray-700 font-bold">
                Margin Kotor: {financialMetrics.marginLabaKotor.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* IV. BIAYA OPERASIONAL KANTOR & UMUM (OVERHEAD OPEX) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 bg-purple-600 text-white rounded flex items-center justify-center text-[10px]">IV</span>
                Beban Usaha & Operasional Kantor (Operating Expenses / OPEX)
              </h4>
              <span className="text-xs font-bold text-slate-500">Jumlah (IDR)</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2 flex justify-between items-center">
                <span className="text-slate-700">Gaji Staf Administrasi, Customer Service & Tim Operasional</span>
                <span className="font-mono font-semibold text-slate-800">
                  {formatIdr(Math.round(financialMetrics.totalOverheadKantor * 0.5))}
                </span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-slate-700">Sewa Gedung Kantor, Listrik, Internet & Sistem Cloud Siskopatuh</span>
                <span className="font-mono font-semibold text-slate-800">
                  {formatIdr(Math.round(financialMetrics.totalOverheadKantor * 0.3))}
                </span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-slate-700">Pemasaran, Cetak Brosur, Dokumentasi & Iklan Syiar Jamaah</span>
                <span className="font-mono font-semibold text-slate-800">
                  {formatIdr(Math.round(financialMetrics.totalOverheadKantor * 0.2))}
                </span>
              </div>

              <div className="py-3 flex justify-between items-center font-black bg-purple-50 px-3 rounded-xl">
                <span className="text-purple-950 uppercase tracking-wide">
                  Total Biaya Operasional Kantor (Overhead)
                </span>
                <span className="font-mono text-base text-purple-900">
                  ({formatIdr(financialMetrics.totalOverheadKantor)})
                </span>
              </div>
            </div>
          </div>

          {/* V. LABA BERSIH OPERASIONAL (NET PROFIT) */}
          <div className="p-5 bg-slate-950 text-white rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-2 border-emerald-500/80 shadow-xl print:bg-white print:text-black print:border-2 print:border-black">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-black uppercase">
                  HASIL AKHIR (NETTO)
                </span>
                <span className="text-xs text-slate-400 font-mono">Musim 1448H</span>
              </div>
              <h3 className="text-lg font-black text-amber-400 print:text-black uppercase tracking-wider">
                V. Laba Bersih Perusahaan (Net Operating Profit)
              </h3>
              <p className="text-xs text-slate-300 print:text-gray-600">
                Surplus laba bersih setelah seluruh biaya operasional paket & overhead kantor dipenuhi.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 print:text-black">
                {formatIdr(financialMetrics.labaBersih)}
              </p>
              <div className="text-xs text-slate-300 print:text-gray-700 font-bold flex items-center justify-start sm:justify-end gap-2 pt-1">
                <span>Margin Laba Bersih:</span>
                <span className="px-2 py-0.5 bg-emerald-700 text-white rounded font-mono text-xs">
                  {financialMetrics.marginLabaBersih.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Lembar Pengesahan Tanda Tangan */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs">
            <div className="space-y-12">
              <span className="text-slate-500 font-semibold block">Dibuat Oleh (Finance & Akunting)</span>
              <div>
                <p className="font-bold text-slate-900 border-b border-slate-400 pb-1 inline-block min-w-[140px]">
                  Fadhilah Zahra, S.Ak.
                </p>
                <p className="text-[11px] text-slate-500">Finance & Accounting Officer</p>
              </div>
            </div>

            <div className="space-y-12">
              <span className="text-slate-500 font-semibold block">Diverifikasi (Manajer Operasional)</span>
              <div>
                <p className="font-bold text-slate-900 border-b border-slate-400 pb-1 inline-block min-w-[140px]">
                  H. Ridwan Hakim, S.E.
                </p>
                <p className="text-[11px] text-slate-500">Operation & Logistics Manager</p>
              </div>
            </div>

            <div className="space-y-12 col-span-2 sm:col-span-1">
              <span className="text-slate-500 font-semibold block">Disetujui (Direktur Utama)</span>
              <div>
                <p className="font-bold text-slate-900 border-b border-slate-400 pb-1 inline-block min-w-[140px]">
                  H. Irfan Maulana, M.M.
                </p>
                <p className="text-[11px] text-slate-500">Managing Director / Pimpinan PPIU</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. DAFTAR RINCIAN TRANSAKSI BOOKING YANG MEMBENTUK PENDAPATAN PERIODE INI */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-700" />
              Manifest Booking Kontributor Pendapatan & Beban Operasional
            </h4>
            <p className="text-xs text-slate-500">
              Daftar rombongan pemesanan jamaah yang masuk dalam perhitungan laba/rugi periode ini.
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl">
            {filteredBookings.length} Rombongan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Kode Booking</th>
                <th className="py-3 px-3">Kontak Jamaah</th>
                <th className="py-3 px-3">Program Paket</th>
                <th className="py-3 px-3 text-center">Pax</th>
                <th className="py-3 px-3 text-right">Pendapatan Bruto</th>
                <th className="py-3 px-3 text-right">Biaya Operasional (HPP)</th>
                <th className="py-3 px-3 text-right">Laba Kotor</th>
                <th className="py-3 px-3 text-center">Status Bayar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBookings.map((b) => {
                const pkg = packages.find((p) => p.id === b.packageId);
                const costPerPax = getBiayaOperasionalPerPax(pkg);
                const totalHpp = costPerPax * b.pilgrims.length;
                const labaKotor = b.totalPriceIdr - totalHpp;

                return (
                  <tr key={b.bookingCode} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {b.bookingCode}
                      <div className="text-[10px] text-slate-400 font-normal">
                        Daftar: {b.createdAt} • Berangkat: {b.departureDate}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{b.contactName}</div>
                      <div className="text-[10px] text-slate-500">{b.contactPhone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800 line-clamp-1">{b.packageName}</div>
                      <div className="text-[10px] text-slate-500 capitalize">Kamar {b.roomType}</div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">
                      {b.pilgrims.length} Org
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                      {formatIdr(b.totalPriceIdr)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-amber-700 font-semibold">
                      {formatIdr(totalHpp)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-800">
                      {formatIdr(labaKotor)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b.paymentStatus === 'Lunas'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.paymentStatus === 'DP Terverifikasi'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
