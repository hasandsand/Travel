import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
  FileSpreadsheet,
  Download,
  Info,
  Calendar,
  Building2,
  Plane,
  ShieldCheck,
  CheckCircle2,
  Sliders
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

interface FinancePLProps {
  bookings: BookingRecord[];
  packages: UmrahPackage[];
  onUpdatePackageCost?: (packageId: string, newCostBreakdown: PackageCostBreakdown) => void;
}

// Default fallback cost breakdown if not set in package
const DEFAULT_COST_BREAKDOWN: PackageCostBreakdown = {
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

export const TravelFinancePL: React.FC<FinancePLProps> = ({
  bookings,
  packages
}) => {
  const [selectedPackageFilter, setSelectedPackageFilter] = useState<string>('all');
  const [selectedPeriodFilter, setSelectedPeriodFilter] = useState<'all' | 'verified_only'>('all');
  const [activeViewMode, setActiveViewMode] = useState<'overview' | 'breakdown' | 'simulation'>('overview');

  // Interactive simulation adjustments (in percentage +/-)
  const [costMultiplier, setCostMultiplier] = useState<number>(100); // 100% = normal
  const [simulatedAviationCostShift, setSimulatedAviationCostShift] = useState<number>(0); // e.g. +Rp 1jt / -Rp 1jt

  // Helper to calculate total HPP per pax for a package
  const getPackageHppPerPax = (pkg?: UmrahPackage): number => {
    if (!pkg) return 26900000;
    const cb = pkg.costBreakdown || DEFAULT_COST_BREAKDOWN;
    const baseHpp =
      cb.tiketPesawatPerPax +
      cb.visaTasrehPerPax +
      cb.hotelMakkahPerPax +
      cb.hotelMadinahPerPax +
      cb.busTransportPerPax +
      cb.handlingPerlengkapanPerPax +
      cb.cateringPerPax +
      cb.muthawwifTourLeaderPerPax +
      cb.operationalTravelPerPax;

    // Apply simulation if any
    const flightAdjusted = baseHpp + simulatedAviationCostShift;
    return Math.round((flightAdjusted * costMultiplier) / 100);
  };

  // Filtered bookings
  const relevantBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (selectedPeriodFilter === 'verified_only' && b.paymentStatus === 'Menunggu DP') {
        return false;
      }
      if (selectedPackageFilter !== 'all' && b.packageId !== selectedPackageFilter) {
        return false;
      }
      return true;
    });
  }, [bookings, selectedPackageFilter, selectedPeriodFilter]);

  // Aggregate Financials
  const financialSummary = useMemo(() => {
    let totalRevenue = 0;
    let totalPaidCashIn = 0;
    let totalHpp = 0;
    let totalPilgrimsCount = 0;

    const packageStatsMap = new Map<
      string,
      {
        pkg: UmrahPackage;
        pilgrimsCount: number;
        revenue: number;
        paidIn: number;
        hpp: number;
        grossProfit: number;
      }
    >();

    // Initialize map
    packages.forEach((pkg) => {
      packageStatsMap.set(pkg.id, {
        pkg,
        pilgrimsCount: 0,
        revenue: 0,
        paidIn: 0,
        hpp: 0,
        grossProfit: 0
      });
    });

    relevantBookings.forEach((b) => {
      const pCount = b.pilgrims.length;
      totalPilgrimsCount += pCount;
      totalRevenue += b.totalPriceIdr;
      totalPaidCashIn += b.paidAmountIdr || (b.paymentStatus === 'Lunas' ? b.totalPriceIdr : 0);

      const pkg = packages.find((p) => p.id === b.packageId);
      const hppPerPax = getPackageHppPerPax(pkg);
      const bookingHpp = hppPerPax * pCount;
      totalHpp += bookingHpp;

      if (b.packageId && packageStatsMap.has(b.packageId)) {
        const item = packageStatsMap.get(b.packageId)!;
        item.pilgrimsCount += pCount;
        item.revenue += b.totalPriceIdr;
        item.paidIn += b.paidAmountIdr || (b.paymentStatus === 'Lunas' ? b.totalPriceIdr : 0);
        item.hpp += bookingHpp;
        item.grossProfit = item.revenue - item.hpp;
      }
    });

    const grossProfit = totalRevenue - totalHpp;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    const netCashFlowProfit = totalPaidCashIn - totalHpp;

    return {
      totalRevenue,
      totalPaidCashIn,
      totalHpp,
      grossProfit,
      profitMargin,
      netCashFlowProfit,
      totalPilgrimsCount,
      packageStats: Array.from(packageStatsMap.values())
    };
  }, [relevantBookings, packages, costMultiplier, simulatedAviationCostShift]);

  // Aggregate HPP Component Breakdown across all filtered bookings
  const hppComponentsAggregated = useMemo(() => {
    const compTotals = {
      tiketPesawat: 0,
      hotelMakkah: 0,
      hotelMadinah: 0,
      visaTasreh: 0,
      catering: 0,
      busTransport: 0,
      handlingPerlengkapan: 0,
      muthawwifTourLeader: 0,
      operationalOverhead: 0
    };

    relevantBookings.forEach((b) => {
      const pkg = packages.find((p) => p.id === b.packageId);
      const cb = pkg?.costBreakdown || DEFAULT_COST_BREAKDOWN;
      const count = b.pilgrims.length;

      compTotals.tiketPesawat += (cb.tiketPesawatPerPax + simulatedAviationCostShift) * count;
      compTotals.hotelMakkah += cb.hotelMakkahPerPax * count;
      compTotals.hotelMadinah += cb.hotelMadinahPerPax * count;
      compTotals.visaTasreh += cb.visaTasrehPerPax * count;
      compTotals.catering += cb.cateringPerPax * count;
      compTotals.busTransport += cb.busTransportPerPax * count;
      compTotals.handlingPerlengkapan += cb.handlingPerlengkapanPerPax * count;
      compTotals.muthawwifTourLeader += cb.muthawwifTourLeaderPerPax * count;
      compTotals.operationalOverhead += cb.operationalTravelPerPax * count;
    });

    const mult = costMultiplier / 100;
    const chartData = [
      { name: 'Tiket Pesawat PP', value: Math.round(compTotals.tiketPesawat * mult), color: '#3b82f6', icon: Plane },
      { name: 'Hotel Makkah (Nol/Dekat)', value: Math.round(compTotals.hotelMakkah * mult), color: '#10b981', icon: Building2 },
      { name: 'Hotel Madinah (Dekat Nabawi)', value: Math.round(compTotals.hotelMadinah * mult), color: '#059669', icon: Building2 },
      { name: 'Visa Umrah & Tasreh', value: Math.round(compTotals.visaTasreh * mult), color: '#f59e0b', icon: ShieldCheck },
      { name: 'Katering Fullboard 3x', value: Math.round(compTotals.catering * mult), color: '#8b5cf6', icon: Info },
      { name: 'Transportasi Bus/Kereta', value: Math.round(compTotals.busTransport * mult), color: '#06b6d4', icon: Info },
      { name: 'Perlengkapan & Handling', value: Math.round(compTotals.handlingPerlengkapan * mult), color: '#ec4899', icon: Info },
      { name: 'Muthawwif & Tour Leader', value: Math.round(compTotals.muthawwifTourLeader * mult), color: '#64748b', icon: Info },
      { name: 'Operasional & Manasik', value: Math.round(compTotals.operationalOverhead * mult), color: '#94a3b8', icon: Info }
    ].filter((item) => item.value > 0);

    return chartData;
  }, [relevantBookings, packages, costMultiplier, simulatedAviationCostShift]);

  // Chart data: Per-package comparison (Revenue vs HPP vs Gross Profit)
  const packageComparisonChartData = useMemo(() => {
    return financialSummary.packageStats
      .filter((item) => item.pilgrimsCount > 0)
      .map((item) => {
        const shortName = item.pkg.name.replace('Paket Umrah ', '').split('(')[0].trim();
        return {
          name: shortName,
          fullName: item.pkg.name,
          jamaah: item.pilgrimsCount,
          pendapatan: Math.round(item.revenue / 1000000), // in Millions
          hpp: Math.round(item.hpp / 1000000),
          labaKotor: Math.round(item.grossProfit / 1000000),
          marginPersen: item.revenue > 0 ? Math.round((item.grossProfit / item.revenue) * 100) : 0
        };
      });
  }, [financialSummary]);

  // Format currency helper (IDR)
  const formatIdr = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatJuta = (amount: number) => {
    return `Rp ${(amount / 1000000).toFixed(1)} Jt`;
  };

  // Export report to CSV
  const exportFinancialReport = () => {
    const headers = [
      'Kode/Nama Paket',
      'Kategori',
      'Jumlah Jamaah',
      'Total Pendapatan (Gross IDR)',
      'Kas Masuk (DP/Lunas)',
      'Total HPP (COGS IDR)',
      'Laba Kotor (Gross Profit IDR)',
      'Margin Laba (%)'
    ];

    const rows = financialSummary.packageStats.map((item) => [
      `"${item.pkg.name}"`,
      item.pkg.category.toUpperCase(),
      item.pilgrimsCount,
      item.revenue,
      item.paidIn,
      item.hpp,
      item.grossProfit,
      `${item.revenue > 0 ? ((item.grossProfit / item.revenue) * 100).toFixed(1) : 0}%`
    ]);

    // Add total row
    rows.push([
      '"TOTAL KESELURUHAN"',
      '"SEMUA"',
      financialSummary.totalPilgrimsCount,
      financialSummary.totalRevenue,
      financialSummary.totalPaidCashIn,
      financialSummary.totalHpp,
      financialSummary.grossProfit,
      `${financialSummary.profitMargin.toFixed(1)}%`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_HPP_Laba_Rugi_KareemTravel_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 sm:p-7 rounded-3xl border border-emerald-900/50 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
              Modul Finansial & Akuntansi
            </span>
            <span className="text-xs text-emerald-300 font-mono">Musim 1448H</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-amber-400" />
            Laporan HPP & Analisis Laba Rugi (P&L)
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Perhitungan Harga Pokok Penjualan (HPP) per jamaah (Tiket Pesawat, Hotel Makkah/Madinah, Visa, Handling & Katering),
            estimasi Gross Revenue, realisasi Margin Keuntungan, dan simulasi sensitivitas biaya.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={exportFinancialReport}
            className="px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-extrabold rounded-xl transition-all shadow flex items-center gap-1.5 border border-emerald-500/40"
            title="Download file CSV Laba Rugi & HPP"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-300" />
            <span>Ekspor Laporan CSV</span>
          </button>
        </div>
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <FilterIcon className="w-3.5 h-3.5" /> Filter Paket:
          </span>
          <select
            value={selectedPackageFilter}
            onChange={(e) => setSelectedPackageFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          >
            <option value="all">Semua Program Paket</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name}
              </option>
            ))}
          </select>

          <select
            value={selectedPeriodFilter}
            onChange={(e) => setSelectedPeriodFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          >
            <option value="all">Semua Status Booking</option>
            <option value="verified_only">Hanya Terverifikasi DP / Lunas</option>
          </select>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start lg:self-auto">
          {[
            { key: 'overview', label: 'Ringkasan Laba Rugi', icon: BarChart3 },
            { key: 'breakdown', label: 'Rincian Komponen HPP', icon: PieChartIcon },
            { key: 'simulation', label: 'Simulasi Margin', icon: Sliders }
          ].map((mode) => {
            const Icon = mode.icon;
            const active = activeViewMode === mode.key;
            return (
              <button
                key={mode.key}
                onClick={() => setActiveViewMode(mode.key as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  active ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-700' : 'text-slate-400'}`} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Big Key Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Pendapatan Kotor (Gross Revenue) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Pendapatan (Gross)
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              Rp
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 truncate">
            {formatJuta(financialSummary.totalRevenue)}
          </p>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>Dari {financialSummary.totalPilgrimsCount} Jamaah</span>
            <span className="text-emerald-700 font-bold">
              Masuk: {formatJuta(financialSummary.totalPaidCashIn)}
            </span>
          </div>
        </div>

        {/* 2. Total HPP (Cost of Goods Sold) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total HPP (Beban Paket)
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-700 truncate">
            {formatJuta(financialSummary.totalHpp)}
          </p>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>Rata-rata /pax</span>
            <span className="font-mono font-bold text-slate-700">
              {financialSummary.totalPilgrimsCount > 0
                ? formatJuta(financialSummary.totalHpp / financialSummary.totalPilgrimsCount)
                : 'Rp 0'}
            </span>
          </div>
        </div>

        {/* 3. Laba Kotor (Gross Profit) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Laba Kotor (Gross Profit)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-800 truncate">
            {formatJuta(financialSummary.grossProfit)}
          </p>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>Selisih Omzet - HPP</span>
            <span className="text-emerald-800 font-extrabold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Surplus
            </span>
          </div>
        </div>

        {/* 4. Margin Keuntungan (%) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Margin Laba (Profit Margin)
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
              %
            </div>
          </div>
          <p className="text-2xl font-black text-purple-900 truncate">
            {financialSummary.profitMargin.toFixed(1)}%
          </p>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>Target Industri: 10 - 20%</span>
            <span className={`font-bold ${financialSummary.profitMargin >= 10 ? 'text-emerald-700' : 'text-amber-600'}`}>
              {financialSummary.profitMargin >= 10 ? 'Sehat (Optimal)' : 'Perlu Efisiensi'}
            </span>
          </div>
        </div>
      </div>

      {/* VIEW 1: OVERVIEW TAB */}
      {activeViewMode === 'overview' && (
        <div className="space-y-6">
          {/* Charts Row: Per-package comparison + Cost structure donut */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bar Chart: Pendapatan vs HPP vs Laba per Paket */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-700" />
                    Perbandingan Pendapatan vs HPP per Paket (Juta IDR)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Nilai omzet bruto, total beban HPP, dan hasil laba kotor untuk setiap program umrah.
                  </p>
                </div>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={packageComparisonChartData}
                    margin={{ top: 15, right: 15, left: -10, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
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
                      content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null;
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[200px]">
                            <p className="font-extrabold text-amber-400 border-b border-slate-700 pb-1">
                              {data.fullName}
                            </p>
                            <p className="text-slate-300">
                              Jumlah Jamaah: <span className="text-white font-bold">{data.jamaah} orang</span>
                            </p>
                            <div className="space-y-0.5 pt-1">
                              <p className="flex justify-between text-blue-300">
                                <span>Pendapatan:</span>
                                <span className="font-mono font-bold">Rp {data.pendapatan} Jt</span>
                              </p>
                              <p className="flex justify-between text-amber-300">
                                <span>Beban HPP:</span>
                                <span className="font-mono font-bold">Rp {data.hpp} Jt</span>
                              </p>
                              <p className="flex justify-between text-emerald-400 border-t border-slate-700 pt-1 font-bold">
                                <span>Laba Kotor:</span>
                                <span className="font-mono">Rp {data.labaKotor} Jt ({data.marginPersen}%)</span>
                              </p>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ paddingBottom: 10, fontSize: 11 }}
                    />
                    <Bar dataKey="pendapatan" name="Pendapatan (Omzet)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="hpp" name="Beban HPP" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="labaKotor" name="Laba Kotor" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donut Chart: Komposisi Komponen HPP */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-amber-600" />
                  Struktur Biaya HPP
                </h3>
                <p className="text-xs text-slate-500">
                  Proporsi komponen biaya terbesar dari seluruh paket berjalan.
                </p>
              </div>

              <div className="h-[210px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={hppComponentsAggregated}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {hppComponentsAggregated.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => [`${formatJuta(val)}`, 'Total Biaya']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12, color: '#fff', fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Badge */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-slate-400">Total HPP</span>
                  <span className="text-xs font-black text-slate-900">{formatJuta(financialSummary.totalHpp)}</span>
                </div>
              </div>

              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 text-xs">
                {hppComponentsAggregated.slice(0, 4).map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="font-semibold text-slate-700 truncate">{c.name}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 shrink-0">
                      {financialSummary.totalHpp > 0
                        ? `${Math.round((c.value / financialSummary.totalHpp) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table: Rincian P&L per Program Paket */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-black text-slate-900">Tabel Neraca Laba Rugi per Program Paket</h3>
                <p className="text-xs text-slate-500">
                  Data aktual terintegrasi dengan manifest pemesanan jamaah dan alokasi biaya HPP standar.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl">
                {financialSummary.packageStats.length} Paket Terdaftar
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/75 text-slate-700 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Program Paket</th>
                    <th className="py-3 px-3 text-center">Seat Terisi</th>
                    <th className="py-3 px-3 text-right">Pendapatan Bruto</th>
                    <th className="py-3 px-3 text-right">Kas Diterima</th>
                    <th className="py-3 px-3 text-right">HPP / Pax</th>
                    <th className="py-3 px-3 text-right">Total HPP</th>
                    <th className="py-3 px-4 text-right">Laba Kotor</th>
                    <th className="py-3 px-3 text-center">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {financialSummary.packageStats.map((item) => {
                    const hppPerPax = getPackageHppPerPax(item.pkg);
                    const margin = item.revenue > 0 ? (item.grossProfit / item.revenue) * 100 : 0;
                    return (
                      <tr key={item.pkg.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-black text-slate-900">{item.pkg.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {item.pkg.durationDays} Hari • Keberangkatan {item.pkg.departureDate}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg">
                            {item.pilgrimsCount} Pax
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-800">
                          {formatIdr(item.revenue)}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono text-emerald-700 font-bold">
                          {formatIdr(item.paidIn)}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono text-slate-600">
                          {formatIdr(hppPerPax)}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-700">
                          {formatIdr(item.hpp)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-800">
                          {formatIdr(item.grossProfit)}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-md font-extrabold text-[11px] ${
                              margin >= 15
                                ? 'bg-emerald-100 text-emerald-800'
                                : margin >= 8
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {margin.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Grand Total Row */}
                  <tr className="bg-slate-900 text-white font-black text-xs">
                    <td className="py-4 px-4">
                      <div className="font-black uppercase tracking-wider text-amber-400">
                        TOTAL KESELURUHAN (KONSOLIDASI)
                      </div>
                      <div className="text-[10px] text-slate-300 font-normal">
                        Semua rombongan booking musim 1448H
                      </div>
                    </td>
                    <td className="py-4 px-3 text-center text-amber-400 font-mono text-sm">
                      {financialSummary.totalPilgrimsCount} Pax
                    </td>
                    <td className="py-4 px-3 text-right font-mono text-white text-sm">
                      {formatIdr(financialSummary.totalRevenue)}
                    </td>
                    <td className="py-4 px-3 text-right font-mono text-emerald-400 text-sm">
                      {formatIdr(financialSummary.totalPaidCashIn)}
                    </td>
                    <td className="py-4 px-3 text-right font-mono text-slate-400 text-xs">
                      -
                    </td>
                    <td className="py-4 px-3 text-right font-mono text-amber-300 text-sm">
                      {formatIdr(financialSummary.totalHpp)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-emerald-300 text-base font-black">
                      {formatIdr(financialSummary.grossProfit)}
                    </td>
                    <td className="py-4 px-3 text-center">
                      <span className="bg-emerald-500 text-slate-950 font-black px-2.5 py-1 rounded-lg text-xs">
                        {financialSummary.profitMargin.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: BREAKDOWN KOMPONEN HPP */}
      {activeViewMode === 'breakdown' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {packages.map((pkg) => {
              const cb = pkg.costBreakdown || DEFAULT_COST_BREAKDOWN;
              const hppPax = getPackageHppPerPax(pkg);
              const quadSellingPrice = pkg.priceQuad;
              const unitGrossProfit = quadSellingPrice - hppPax;
              const unitMargin = (unitGrossProfit / quadSellingPrice) * 100;

              return (
                <div
                  key={pkg.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded uppercase">
                        {pkg.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {pkg.durationDays} Hari
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 text-base leading-tight">
                      {pkg.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Harga Jual Quad: <span className="font-bold text-slate-900">{formatIdr(quadSellingPrice)}</span>
                    </p>
                  </div>

                  {/* Cost Items Grid */}
                  <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Plane className="w-3 h-3 text-blue-500" /> Tiket Pesawat PP:
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {formatIdr(cb.tiketPesawatPerPax)}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-amber-500" /> Visa & Tasreh:
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {formatIdr(cb.visaTasrehPerPax)}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-emerald-600" /> Hotel Makkah:
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {formatIdr(cb.hotelMakkahPerPax)}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-emerald-500" /> Hotel Madinah:
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {formatIdr(cb.hotelMadinahPerPax)}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Transport Bus / Kereta:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {formatIdr(cb.busTransportPerPax)}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Koper & Handling Bandara:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {formatIdr(cb.handlingPerlengkapanPerPax)}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Katering Fullboard 3x:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {formatIdr(cb.cateringPerPax)}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Muthawwif & Tour Leader:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {formatIdr(cb.muthawwifTourLeaderPerPax)}
                      </span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Operasional Travel & Manasik:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {formatIdr(cb.operationalTravelPerPax)}
                      </span>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-3.5 bg-slate-900 text-white rounded-2xl space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-amber-400 font-bold">Total HPP per Pax:</span>
                      <span className="font-mono font-black">{formatIdr(hppPax)}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-1 border-t border-slate-700">
                      <span className="text-slate-300">Estimasi Laba per Pax:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        +{formatIdr(unitGrossProfit)} ({unitMargin.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: SIMULASI & STRESS TEST MARGIN */}
      {activeViewMode === 'simulation' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-700" />
              Simulasi Sensitivitas Biaya & Fluktuasi Valuta
            </h3>
            <p className="text-xs text-slate-500">
              Gunakan penggeser di bawah untuk melihat dampak kenaikan harga tiket avtur pesawat atau pelemahan kurs SAR terhadap laba bersih travel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            {/* Slider 1: Avtur Shift */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Penyesuaian Biaya Tiket Pesawat:</span>
                <span className={`font-mono ${simulatedAviationCostShift >= 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {simulatedAviationCostShift >= 0 ? `+${formatIdr(simulatedAviationCostShift)}` : formatIdr(simulatedAviationCostShift)} /pax
                </span>
              </div>
              <input
                type="range"
                min="-3000000"
                max="5000000"
                step="250000"
                value={simulatedAviationCostShift}
                onChange={(e) => setSimulatedAviationCostShift(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Diskon Tiket (-Rp 3Jt)</span>
                <span>Normal (Rp 0)</span>
                <span>Lonjakan Avtur (+Rp 5Jt)</span>
              </div>
            </div>

            {/* Slider 2: Overall Inflation Multiplier */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Faktor Inflasi / Kurs SAR Hotel & Operasional:</span>
                <span className={`font-mono ${costMultiplier > 100 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {costMultiplier}% (Deviasi {costMultiplier - 100 > 0 ? `+${costMultiplier - 100}%` : `${costMultiplier - 100}%`})
                </span>
              </div>
              <input
                type="range"
                min="85"
                max="130"
                step="1"
                value={costMultiplier}
                onChange={(e) => setCostMultiplier(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Efisiensi Biaya (85%)</span>
                <span>Standar (100%)</span>
                <span>Puncak Musim/Inflasi (130%)</span>
              </div>
            </div>
          </div>

          {/* Simulation Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">Proyeksi Beban HPP Baru</span>
              <p className="text-xl font-black text-amber-700">{formatJuta(financialSummary.totalHpp)}</p>
              <p className="text-[11px] text-slate-500">
                Rata-rata: {financialSummary.totalPilgrimsCount > 0 ? formatJuta(financialSummary.totalHpp / financialSummary.totalPilgrimsCount) : '0'} /pax
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">Proyeksi Laba Bersih Kotor</span>
              <p className={`text-xl font-black ${financialSummary.grossProfit >= 0 ? 'text-emerald-800' : 'text-rose-600'}`}>
                {formatJuta(financialSummary.grossProfit)}
              </p>
              <p className="text-[11px] text-slate-500">
                {financialSummary.grossProfit >= 0 ? 'Surplus Operasional' : 'Defisit (Perlu revisi harga jual)'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">Proyeksi Margin Laba</span>
              <p className={`text-xl font-black ${financialSummary.profitMargin >= 10 ? 'text-purple-800' : 'text-amber-600'}`}>
                {financialSummary.profitMargin.toFixed(1)}%
              </p>
              <p className="text-[11px] text-slate-500">
                {financialSummary.profitMargin >= 10 ? 'Margin Aman untuk Kas Cadangan' : 'Margin di bawah batas aman (10%)'}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                setCostMultiplier(100);
                setSimulatedAviationCostShift(0);
              }}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              Reset ke Biaya Standar (100%)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}
