import React, { useState, useMemo } from 'react';
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
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  Users,
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
  DollarSign,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { BookingRecord, UmrahPackage } from '../types';

interface TravelAnalyticsDashboardProps {
  bookings: BookingRecord[];
  packages: UmrahPackage[];
}

// Color palette matching refined Islamic Green, Amber Gold, Slate, and Sapphire
const CATEGORY_COLORS: Record<string, { fill: string; border: string; bg: string; text: string; label: string }> = {
  reguler: {
    fill: '#059669', // emerald-600
    border: '#047857',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    label: 'Reguler Berkah'
  },
  vip: {
    fill: '#d97706', // amber-600
    border: '#b45309',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    label: 'VIP Sultan'
  },
  plus: {
    fill: '#2563eb', // blue-600
    border: '#1d4ed8',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    label: 'Plus Wisata (Turki/Dubai)'
  },
  ramadhan: {
    fill: '#7c3aed', // violet-600
    border: '#6d28d9',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    label: 'Ramadhan & Lailatul Qadar'
  }
};

const MONTH_NAMES: Record<string, string> = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'Mei',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Agu',
  '09': 'Sep',
  '10': 'Okt',
  '11': 'Nov',
  '12': 'Des'
};

export const TravelAnalyticsDashboard: React.FC<TravelAnalyticsDashboardProps> = ({
  bookings,
  packages
}) => {
  const [timeframe, setTimeframe] = useState<'departure' | 'booking'>('departure');
  const [chartType, setChartType] = useState<'stacked' | 'bar'>('stacked');

  // Map packageId to package info for fast lookup
  const packageMap = useMemo(() => {
    const map = new Map<string, UmrahPackage>();
    packages.forEach(p => map.set(p.id, p));
    return map;
  }, [packages]);

  // 1. STATISTIK PER BULAN (Monthly Breakdown)
  const monthlyData = useMemo(() => {
    // Collect all months from bookings
    const monthStatsMap: Record<
      string,
      {
        monthKey: string;
        monthLabel: string;
        totalJamaah: number;
        reguler: number;
        vip: number;
        plus: number;
        ramadhan: number;
        totalGrossIdr: number;
        rombonganCount: number;
      }
    > = {};

    // Helper to format date YYYY-MM
    const getMonthKey = (dateStr: string) => {
      if (!dateStr) return '2026-10';
      const parts = dateStr.split('-');
      if (parts.length >= 2) {
        return `${parts[0]}-${parts[1]}`;
      }
      return '2026-10';
    };

    // Initialize with standard upcoming seasons 2026-2027 so charts look continuous
    const defaultMonths = ['2026-09', '2026-10', '2026-11', '2026-12', '2027-01', '2027-02', '2027-03', '2027-04'];
    defaultMonths.forEach(m => {
      const [year, month] = m.split('-');
      const label = `${MONTH_NAMES[month] || month} ${year}`;
      monthStatsMap[m] = {
        monthKey: m,
        monthLabel: label,
        totalJamaah: 0,
        reguler: 0,
        vip: 0,
        plus: 0,
        ramadhan: 0,
        totalGrossIdr: 0,
        rombonganCount: 0
      };
    });

    bookings.forEach(b => {
      const dateToUse = timeframe === 'departure' ? b.departureDate : b.createdAt;
      const mKey = getMonthKey(dateToUse);

      if (!monthStatsMap[mKey]) {
        const [year, month] = mKey.split('-');
        monthStatsMap[mKey] = {
          monthKey: mKey,
          monthLabel: `${MONTH_NAMES[month] || month} ${year}`,
          totalJamaah: 0,
          reguler: 0,
          vip: 0,
          plus: 0,
          ramadhan: 0,
          totalGrossIdr: 0,
          rombonganCount: 0
        };
      }

      const pkg = packageMap.get(b.packageId);
      const category = (pkg?.category || 'reguler') as 'reguler' | 'vip' | 'plus' | 'ramadhan';
      const count = b.pilgrims.length;

      monthStatsMap[mKey].totalJamaah += count;
      monthStatsMap[mKey].rombonganCount += 1;
      monthStatsMap[mKey].totalGrossIdr += b.totalPriceIdr;

      if (category in monthStatsMap[mKey]) {
        monthStatsMap[mKey][category] += count;
      } else {
        monthStatsMap[mKey].reguler += count;
      }
    });

    return Object.values(monthStatsMap).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  }, [bookings, packageMap, timeframe]);

  // 2. STATISTIK PER KATEGORI PAKET (Category Breakdown)
  const categoryData = useMemo(() => {
    const counts: Record<string, { jamaah: number; bookings: number; gross: number; remainingQuota: number; totalQuota: number }> = {
      reguler: { jamaah: 0, bookings: 0, gross: 0, remainingQuota: 0, totalQuota: 0 },
      vip: { jamaah: 0, bookings: 0, gross: 0, remainingQuota: 0, totalQuota: 0 },
      plus: { jamaah: 0, bookings: 0, gross: 0, remainingQuota: 0, totalQuota: 0 },
      ramadhan: { jamaah: 0, bookings: 0, gross: 0, remainingQuota: 0, totalQuota: 0 }
    };

    // Calculate quotas from packages
    packages.forEach(p => {
      if (counts[p.category]) {
        counts[p.category].remainingQuota += p.quotaRemaining;
        counts[p.category].totalQuota += p.quotaTotal;
      }
    });

    bookings.forEach(b => {
      const pkg = packageMap.get(b.packageId);
      const cat = (pkg?.category || 'reguler') as keyof typeof counts;
      if (counts[cat]) {
        counts[cat].jamaah += b.pilgrims.length;
        counts[cat].bookings += 1;
        counts[cat].gross += b.totalPriceIdr;
      }
    });

    const totalAllJamaah = Object.values(counts).reduce((sum, item) => sum + item.jamaah, 0) || 1;

    return Object.entries(counts).map(([key, item]) => {
      const config = CATEGORY_COLORS[key] || CATEGORY_COLORS.reguler;
      const percentage = Math.round((item.jamaah / totalAllJamaah) * 100);
      return {
        key,
        name: config.label,
        jamaah: item.jamaah,
        bookings: item.bookings,
        gross: item.gross,
        percentage,
        remainingQuota: item.remainingQuota,
        totalQuota: item.totalQuota,
        fill: config.fill
      };
    });
  }, [bookings, packages, packageMap]);

  // Total Summary Metrics
  const totalJamaah = useMemo(() => bookings.reduce((sum, b) => sum + b.pilgrims.length, 0), [bookings]);
  const totalOmzet = useMemo(() => bookings.reduce((sum, b) => sum + b.totalPriceIdr, 0), [bookings]);
  const peakMonth = useMemo(() => {
    if (monthlyData.length === 0) return { monthLabel: '-', totalJamaah: 0 };
    return [...monthlyData].sort((a, b) => b.totalJamaah - a.totalJamaah)[0];
  }, [monthlyData]);

  // Top category by volume
  const topCategory = useMemo(() => {
    if (categoryData.length === 0) return { name: '-', jamaah: 0, percentage: 0 };
    return [...categoryData].sort((a, b) => b.jamaah - a.jamaah)[0];
  }, [categoryData]);

  // Custom Tooltip for Monthly Bar Chart
  const CustomMonthlyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-2 min-w-[200px]">
          <div className="border-b border-slate-800 pb-1 flex items-center justify-between">
            <span className="font-bold text-amber-400">{label}</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
              {dataPoint?.rombonganCount || 0} Rombongan
            </span>
          </div>
          <p className="font-extrabold text-sm text-white">
            Total: {dataPoint?.totalJamaah || 0} Jamaah
          </p>
          <div className="space-y-1 pt-1 border-t border-slate-800/80 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Reguler:
              </span>
              <span className="font-mono font-bold">{dataPoint?.reguler || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                VIP Sultan:
              </span>
              <span className="font-mono font-bold">{dataPoint?.vip || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Plus Wisata:
              </span>
              <span className="font-mono font-bold">{dataPoint?.plus || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Ramadhan:
              </span>
              <span className="font-mono font-bold">{dataPoint?.ramadhan || 0}</span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between">
            <span>Estimasi Omzet:</span>
            <span className="font-mono text-emerald-400 font-bold">
              Rp {((dataPoint?.totalGrossIdr || 0) / 1000000).toFixed(1)} Jt
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Category Pie Chart
  const CustomCategoryTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[180px]">
          <span className="font-black text-amber-400 block">{data.name}</span>
          <p className="font-bold text-sm text-white">
            {data.jamaah} Jamaah ({data.percentage}%)
          </p>
          <div className="text-[11px] text-slate-300 space-y-0.5 pt-1 border-t border-slate-800">
            <p>Pendaftaran: <span className="font-semibold text-white">{data.bookings} Rombongan</span></p>
            <p>Transaksi: <span className="font-mono font-semibold text-emerald-400">Rp {(data.gross / 1000000).toFixed(1)} Jt</span></p>
            <p>Sisa Kuota Tersedia: <span className="font-semibold text-amber-300">{data.remainingQuota} Seat</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Analytics KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Jamaah Terdata
            </span>
            <p className="text-3xl font-black text-slate-900">{totalJamaah}</p>
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Dari {bookings.length} Rombongan Aktif
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Bulan Terpadat (Peak Season)
            </span>
            <p className="text-2xl font-black text-slate-900">{peakMonth.monthLabel}</p>
            <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {peakMonth.totalJamaah} Jamaah Terjadwal
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Kategori Terlaris
            </span>
            <p className="text-xl font-black text-slate-900 truncate max-w-[170px]">{topCategory.name}</p>
            <span className="text-[11px] font-semibold text-blue-700 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              {topCategory.jamaah} Jamaah ({topCategory.percentage}%)
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
            <PieIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Akumulasi Nilai Paket
            </span>
            <p className="text-2xl font-black text-slate-900">
              Rp {(totalOmzet / 1000000).toFixed(1)} <span className="text-sm font-bold text-slate-500">Juta</span>
            </p>
            <span className="text-[11px] font-semibold text-purple-700 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              PPIU Wisata Islami Kareem
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Charts Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CHART 1: Statistik Jamaah Per Bulan (Bar/Stacked Chart) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Statistik Jumlah Jamaah per Bulan
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribusi kuota jamaah terjadwal berdasarkan periode musim keberangkatan atau tanggal pendaftaran.
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setTimeframe('departure')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    timeframe === 'departure' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Jadwal Berangkat
                </button>
                <button
                  onClick={() => setTimeframe('booking')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    timeframe === 'booking' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Tgl Pendaftaran
                </button>
              </div>

              <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setChartType('stacked')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    chartType === 'stacked' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Tampilan Kategori Bertumpuk"
                >
                  Stacked
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    chartType === 'bar' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Tampilan Total Jamaah"
                >
                  Total
                </button>
              </div>
            </div>
          </div>

          {/* Recharts Bar Container */}
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="monthLabel" 
                  tickLine={false} 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                  dy={8}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomMonthlyTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '16px', fontSize: '11px', fontWeight: 'bold' }}
                />

                {chartType === 'stacked' ? (
                  <>
                    <Bar dataKey="reguler" name="Reguler Berkah" stackId="a" fill="#059669" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="vip" name="VIP Sultan" stackId="a" fill="#d97706" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="plus" name="Plus Wisata" stackId="a" fill="#2563eb" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="ramadhan" name="Ramadhan" stackId="a" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  </>
                ) : (
                  <Bar 
                    dataKey="totalJamaah" 
                    name="Total Jamaah" 
                    fill="#0f172a" 
                    radius={[6, 6, 0, 0]} 
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Insights Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3 text-xs text-emerald-900">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Insight Operasional:</strong> Lonjakan pemesanan terbesar terkonsentrasi pada{' '}
              <strong>Oktober - November 2026</strong> (Reguler & VIP) dan{' '}
              <strong>Maret 2027</strong> (Umrah Ramadhan 10 Hari Terakhir). Disarankan untuk segera menyelesaikan pengumpulan paspor dan reservasi tiket Saudia Airlines / Garuda Indonesia sebelum batas <em>cut-off</em> Kemenag.
            </p>
          </div>
        </div>

        {/* CHART 2: Statistik Jamaah Per Kategori Paket (Pie / Donut Chart) */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-amber-600" />
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Komposisi per Kategori Paket
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Porsi jamaah berdasarkan jenis program paket umrah.
              </p>
            </div>

            {/* Recharts Pie Container */}
            <div className="h-56 w-full relative flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="jamaah"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomCategoryTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900 leading-none">{totalJamaah}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  Jamaah
                </span>
              </div>
            </div>

            {/* Category Breakdown Table/List */}
            <div className="space-y-2.5 pt-2">
              {categoryData.map((cat) => (
                <div 
                  key={cat.key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs hover:bg-slate-100/80 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: cat.fill }} 
                    />
                    <div>
                      <span className="font-bold text-slate-900 block leading-tight">{cat.name}</span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {cat.bookings} Rombongan • Sisa {cat.remainingQuota} Seat
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-900 block text-xs">{cat.jamaah} Org</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Standar PPIU Kemenag RI</span>
            <span className="font-bold text-slate-700">Akreditasi A</span>
          </div>
        </div>

      </div>

      {/* CHART 3: Analisis Kapasitas Kuota & Realisasi Pendaftaran */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Monitoring Utilisasi Kuota per Paket Program
            </h4>
            <p className="text-xs text-slate-500">
              Perbandingan seat yang terisi (booked) terhadap total kuota maskapai & hotel.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
            {packages.length} Paket Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((pkg) => {
            const bookedSeat = pkg.quotaTotal - pkg.quotaRemaining;
            const bookedPercent = Math.min(100, Math.round((bookedSeat / pkg.quotaTotal) * 100));
            const catColor = CATEGORY_COLORS[pkg.category] || CATEGORY_COLORS.reguler;

            return (
              <div key={pkg.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${catColor.bg} ${catColor.text}`}>
                    {catColor.label}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 font-bold">
                    {pkg.departureDate}
                  </span>
                </div>

                <div>
                  <h5 className="font-extrabold text-slate-900 text-xs line-clamp-1" title={pkg.name}>
                    {pkg.name}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {pkg.durationDays} Hari • {pkg.airline.name}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Keterisian Kuota:</span>
                    <span className="font-bold text-slate-800">
                      {bookedSeat} / {pkg.quotaTotal} Seat ({bookedPercent}%)
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${bookedPercent}%`,
                        backgroundColor: bookedPercent > 80 ? '#dc2626' : catColor.fill
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-0.5">
                    <span>Tersisa: <strong className="text-amber-700">{pkg.quotaRemaining} Seat</strong></span>
                    <span>{bookedPercent >= 85 ? '🔥 Kuota Kritis' : 'Tersedia'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
