import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  CreditCard, 
  FileCheck, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Edit3, 
  Save, 
  Sparkles, 
  ShieldCheck, 
  Plane, 
  Hotel, 
  Send, 
  Trash2, 
  ChevronRight, 
  LogOut, 
  Lock, 
  Unlock, 
  Printer, 
  ArrowUpRight,
  PackageCheck,
  Calendar,
  FileSpreadsheet,
  Copy,
  Check,
  ExternalLink,
  Info,
  ListFilter,
  BarChart3,
  DollarSign,
  Receipt
} from 'lucide-react';
import { BookingRecord, UmrahPackage, Pilgrim, PilgrimDocument, TravelAnnouncement, RoomType } from '../types';
import { TravelAnalyticsDashboard } from './TravelAnalyticsDashboard';
import { LaporanKeuangan } from './LaporanKeuangan';

interface PortalTravelProps {
  bookings: BookingRecord[];
  packages: UmrahPackage[];
  announcements: TravelAnnouncement[];
  onUpdateBooking: (updated: BookingRecord) => void;
  onAddBooking: (newBooking: BookingRecord) => void;
  onUpdatePackageQuota: (packageId: string, newRemaining: number) => void;
  onAddAnnouncement: (announcement: TravelAnnouncement) => void;
  onDeleteAnnouncement: (id: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const PortalTravel: React.FC<PortalTravelProps> = ({
  bookings,
  packages,
  announcements,
  onUpdateBooking,
  onAddBooking,
  onUpdatePackageQuota,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onNavigateToTab
}) => {
  // Authentication state for Travel Organizer
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('kareem_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Active portal sub tab
  const [activeTab, setActiveTab] = useState<'bookings' | 'analytics' | 'finance' | 'packages' | 'announcements' | 'roomlist'>('bookings');

  // Filters & search for bookings
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');

  // Modal states
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState<BookingRecord | null>(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState<boolean>(false);
  const [previewDocModal, setPreviewDocModal] = useState<PilgrimDocument | null>(null);

  // Siskopatuh Kemenag Export State
  const [isSiskopatuhModalOpen, setIsSiskopatuhModalOpen] = useState<boolean>(false);
  const [siskopatuhPackageFilter, setSiskopatuhPackageFilter] = useState<string>('all');
  const [siskopatuhStatusFilter, setSiskopatuhStatusFilter] = useState<string>('all');
  const [siskopatuhPaymentFilter, setSiskopatuhPaymentFilter] = useState<string>('all');
  const [siskopatuhDelimiter, setSiskopatuhDelimiter] = useState<',' | ';'>(';');
  const [siskopatuhExcelQuote, setSiskopatuhExcelQuote] = useState<boolean>(true);
  const [copiedSiskopatuh, setCopiedSiskopatuh] = useState<boolean>(false);

  // New Announcement Form State
  const [newAnnTitle, setNewAnnTitle] = useState<string>('');
  const [newAnnCategory, setNewAnnCategory] = useState<'Manasik' | 'Penerbangan' | 'Logistik' | 'Penting'>('Manasik');
  const [newAnnContent, setNewAnnContent] = useState<string>('');

  // Manual Booking Form State
  const [manualName, setManualName] = useState<string>('');
  const [manualPhone, setManualPhone] = useState<string>('');
  const [manualEmail, setManualEmail] = useState<string>('');
  const [manualPackageId, setManualPackageId] = useState<string>(packages[0]?.id || '');
  const [manualRoomType, setManualRoomType] = useState<RoomType>('quad');
  const [manualPilgrimCount, setManualPilgrimCount] = useState<number>(1);
  const [manualPaidAmount, setManualPaidAmount] = useState<string>('10000000');

  // Handle Login
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1991' || pinInput.toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('kareem_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('PIN Penyelenggara salah. Gunakan PIN demo: 1991');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('kareem_admin_auth');
  };

  // Quick Stats
  const totalPilgrims = bookings.reduce((acc, b) => acc + b.pilgrims.length, 0);
  const totalGrossIdr = bookings.reduce((acc, b) => acc + b.totalPriceIdr, 0);
  const totalPaidIdr = bookings.reduce((acc, b) => acc + (b.paidAmountIdr || 0), 0);
  const pendingDocsCount = bookings.reduce(
    (acc, b) => acc + b.pilgrims.reduce((pAcc, p) => pAcc + (p.documents?.filter(d => d.verificationStatus === 'Menunggu Verifikasi').length || 0), 0),
    0
  );

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchQuery = 
      !q || 
      b.bookingCode.toLowerCase().includes(q) || 
      b.contactName.toLowerCase().includes(q) || 
      b.contactPhone.toLowerCase().includes(q) || 
      b.packageName.toLowerCase().includes(q) ||
      b.pilgrims.some(p => p.fullName.toLowerCase().includes(q) || p.passportNumber.toLowerCase().includes(q));

    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchPayment = filterPayment === 'all' || b.paymentStatus === filterPayment;

    return matchQuery && matchStatus && matchPayment;
  });

  // Handle Admin Document Verification
  const handleVerifyDocument = (bookingCode: string, pilgrimId: string, docId: string, status: 'Terverifikasi' | 'Perlu Perbaikan') => {
    const targetBooking = bookings.find(b => b.bookingCode === bookingCode);
    if (!targetBooking) return;

    const updatedPilgrims = targetBooking.pilgrims.map(plg => {
      if (plg.id === pilgrimId) {
        return {
          ...plg,
          documents: plg.documents?.map(doc => {
            if (doc.id === docId) {
              return { ...doc, verificationStatus: status };
            }
            return doc;
          })
        };
      }
      return plg;
    });

    const updated = {
      ...targetBooking,
      pilgrims: updatedPilgrims
    };

    onUpdateBooking(updated);
    if (selectedBookingForDetail?.bookingCode === bookingCode) {
      setSelectedBookingForDetail(updated);
    }
  };

  // Handle Admin Booking Status Update
  const handleUpdateBookingStatus = (bookingCode: string, newStatus: BookingRecord['status']) => {
    const targetBooking = bookings.find(b => b.bookingCode === bookingCode);
    if (!targetBooking) return;

    const updated = { ...targetBooking, status: newStatus };
    onUpdateBooking(updated);
    if (selectedBookingForDetail?.bookingCode === bookingCode) {
      setSelectedBookingForDetail(updated);
    }
  };

  // Handle Admin Payment Status Update
  const handleUpdatePaymentStatus = (bookingCode: string, newPaymentStatus: BookingRecord['paymentStatus'], newAmount?: number) => {
    const targetBooking = bookings.find(b => b.bookingCode === bookingCode);
    if (!targetBooking) return;

    let finalAmount = newAmount !== undefined ? newAmount : targetBooking.paidAmountIdr || 0;
    if (newPaymentStatus === 'Lunas') {
      finalAmount = targetBooking.totalPriceIdr;
    } else if (newPaymentStatus === 'DP Terverifikasi' && finalAmount === 0) {
      finalAmount = 10000000;
    }

    const updated = {
      ...targetBooking,
      paymentStatus: newPaymentStatus,
      paidAmountIdr: finalAmount
    };

    onUpdateBooking(updated);
    if (selectedBookingForDetail?.bookingCode === bookingCode) {
      setSelectedBookingForDetail(updated);
    }
  };

  // Handle Admin Logistics Update
  const handleUpdateLogistics = (
    bookingCode: string, 
    item: 'koper' | 'seragam' | 'bukuDoa', 
    newStatus: 'Belum Diambil' | 'Siap Diambil' | 'Sudah Diterima'
  ) => {
    const targetBooking = bookings.find(b => b.bookingCode === bookingCode);
    if (!targetBooking) return;

    const currentLogistics = targetBooking.logisticsStatus || {
      koper: 'Belum Diambil',
      seragam: 'Belum Diambil',
      bukuDoa: 'Belum Diambil'
    };

    const updated = {
      ...targetBooking,
      logisticsStatus: {
        ...currentLogistics,
        [item]: newStatus
      }
    };

    onUpdateBooking(updated);
    if (selectedBookingForDetail?.bookingCode === bookingCode) {
      setSelectedBookingForDetail(updated);
    }
  };

  // Handle Create Announcement
  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnContent) return;

    const newAnn: TravelAnnouncement = {
      id: `ann-${Date.now()}`,
      title: newAnnTitle,
      category: newAnnCategory,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      content: newAnnContent,
      badge: newAnnCategory
    };

    onAddAnnouncement(newAnn);
    setNewAnnTitle('');
    setNewAnnContent('');
  };

  // Handle Manual Add Booking
  const handleSaveManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = packages.find(p => p.id === manualPackageId) || packages[0];
    const unitPrice = manualRoomType === 'double' ? pkg.priceDouble : manualRoomType === 'triple' ? pkg.priceTriple : pkg.priceQuad;
    const totalIdr = unitPrice * manualPilgrimCount;
    const paidNum = Number(manualPaidAmount.replace(/\D/g, '')) || 0;

    const generatedCode = `UMR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: BookingRecord = {
      bookingCode: generatedCode,
      createdAt: new Date().toISOString().split('T')[0],
      packageId: pkg.id,
      packageName: pkg.name,
      departureDate: pkg.departureDate,
      roomType: manualRoomType,
      contactName: manualName,
      contactEmail: manualEmail || 'jamaah@kareemtravel.id',
      contactPhone: manualPhone,
      totalPriceIdr: totalIdr,
      totalPriceSar: Math.round(totalIdr / 4300),
      status: 'Pendaftaran Diterima',
      paymentStatus: paidNum >= totalIdr ? 'Lunas' : paidNum > 0 ? 'DP Terverifikasi' : 'Menunggu DP',
      paidAmountIdr: paidNum,
      logisticsStatus: {
        koper: 'Siap Diambil',
        seragam: 'Siap Diambil',
        bukuDoa: 'Belum Diambil'
      },
      pilgrims: Array.from({ length: manualPilgrimCount }).map((_, i) => ({
        id: `plg-manual-${Date.now()}-${i}`,
        fullName: i === 0 ? manualName : `Anggota Rombongan ${i + 1} (${manualName})`,
        nikKtp: '3171' + Math.floor(100000000000 + Math.random() * 900000000000),
        passportNumber: 'C' + Math.floor(1000000 + Math.random() * 9000000),
        passportExpiry: '2031-10-15',
        gender: i % 2 === 0 ? 'L' : 'P',
        birthDate: '1985-05-20',
        clothSize: 'L',
        phone: manualPhone
      })),
      notes: 'Pendaftaran manual dimasukkan oleh staf operasional travel.'
    };

    onAddBooking(newBooking);
    setIsNewBookingModalOpen(false);
    setSelectedBookingForDetail(newBooking);

    // Reset form
    setManualName('');
    setManualPhone('');
    setManualEmail('');
  };

  // Siskopatuh Kemenag Filtered Pilgrims Data Extractor
  const getSiskopatuhPilgrims = () => {
    return bookings.flatMap((b) => {
      // Filter by Package
      if (siskopatuhPackageFilter !== 'all' && b.packageId !== siskopatuhPackageFilter) {
        return [];
      }
      // Filter by Document Status
      if (siskopatuhStatusFilter !== 'all' && b.status !== siskopatuhStatusFilter) {
        return [];
      }
      // Filter by Payment Status
      if (siskopatuhPaymentFilter === 'Lunas' && b.paymentStatus !== 'Lunas') {
        return [];
      }
      if (siskopatuhPaymentFilter === 'DP_or_Lunas' && b.paymentStatus === 'Menunggu DP') {
        return [];
      }

      const pkg = packages.find(p => p.id === b.packageId) || packages[0];

      return b.pilgrims.map((p, idx) => ({
        booking: b,
        pilgrim: p,
        packageInfo: pkg,
        pilgrimIndexInBooking: idx
      }));
    });
  };

  // Official Siskopatuh Kemenag Column Headers (34 Kolom Standar Ditjen PHU)
  const SISKOPATUH_HEADERS = [
    'NO_URUT',
    'KODE_REGISTRASI_SISKOPATUH',
    'KODE_BOOKING',
    'NO_IDENTITAS_NIK',
    'NAMA_LENGKAP_PASPOR',
    'TEMPAT_LAHIR',
    'TANGGAL_LAHIR',
    'JENIS_KELAMIN',
    'STATUS_PERNIKAHAN',
    'NOMOR_PASPOR',
    'TANGGAL_HABIS_PASPOR',
    'KANTOR_IMIGRASI',
    'NOMOR_TELEPON_HP',
    'NO_IZIN_PPIU',
    'NAMA_PPIU',
    'NAMA_PAKET',
    'KATEGORI_PAKET',
    'TANGGAL_KEBERANGKATAN',
    'TANGGAL_KEPULANGAN',
    'DURASI_HARI',
    'MASKAPAI',
    'NOMOR_PENERBANGAN',
    'KODE_PNR',
    'BANDARA_KEBERANGKATAN',
    'BANDARA_TUJUAN',
    'HOTEL_MAKKAH',
    'HOTEL_MADINAH',
    'TIPE_KAMAR',
    'NOMOR_VISA_KSA',
    'STATUS_VERIFIKASI_BERKAS',
    'STATUS_PEMBAYARAN',
    'NOMINAL_BIAYA_IDR',
    'STATUS_ASURANSI_KEMENAG',
    'STATUS_VAKSIN_MENINGITIS'
  ];

  // Build Siskopatuh CSV string with options
  const buildSiskopatuhCSVString = (delimiter: string = siskopatuhDelimiter, forExcel: boolean = siskopatuhExcelQuote) => {
    const list = getSiskopatuhPilgrims();

    const rows = list.map((item, index) => {
      const { booking: b, pilgrim: p, packageInfo: pkg } = item;
      const cleanPassport = p.passportNumber || `C${Math.floor(1000000 + Math.random() * 9000000)}`;
      const numCode = cleanPassport.replace(/\D/g, '').padEnd(6, '0').slice(0, 6);
      const siskopatuhReg = `SKP-912-${numCode}`;
      
      const formatCell = (val: string | number, forceExcelText: boolean = false) => {
        const strVal = String(val ?? '').trim();
        if (forExcel && forceExcelText) {
          // Excel formula notation maintains full text without scientific notation truncation
          return `="${strVal}"`;
        }
        const escaped = strVal.replace(/"/g, '""');
        return `"${escaped}"`;
      };

      const cityBirth = p.birthDate ? 'JAKARTA' : 'INDONESIA';
      const durDays = pkg?.durationDays || 9;
      const returnDateText = `${b.departureDate} (+${durDays} Hari)`;

      return [
        (index + 1).toString(),
        siskopatuhReg,
        b.bookingCode,
        formatCell(p.nikKtp, true),
        formatCell(p.fullName.toUpperCase()),
        cityBirth,
        p.birthDate || '1985-05-20',
        p.gender === 'L' ? 'L' : 'P',
        'MENIKAH',
        formatCell(cleanPassport, true),
        p.passportExpiry || '2031-10-15',
        'KANTOR IMIGRASI KELAS I',
        formatCell(p.phone || b.contactPhone, true),
        'PPIU 912/2021',
        'PT WISATA ISLAMI KAREEM',
        formatCell(b.packageName),
        (pkg?.category || 'REGULER').toUpperCase(),
        b.departureDate,
        returnDateText,
        `${durDays} Hari`,
        formatCell(pkg?.airlines || 'Saudia Airlines'),
        b.flightNumber || 'SV-819',
        b.pnrCode || 'PNR-912-KSA',
        formatCell(pkg?.departureAirport || 'Bandara Soekarno-Hatta (CGK)'),
        'Bandara King Abdulaziz (JED)',
        formatCell(`${pkg?.hotelMakkah?.name || 'Pullman Zamzam'} (★${pkg?.hotelMakkah?.stars || 5})`),
        formatCell(`${pkg?.hotelMadinah?.name || 'Maden Hotel'} (★${pkg?.hotelMadinah?.stars || 5})`),
        b.roomType.toUpperCase(),
        b.visaNumber || (b.status === 'Siap Berangkat' ? 'E-VISA-SA-98124' : 'DALAM_PROSES_MOFA'),
        b.status.toUpperCase(),
        b.paymentStatus.toUpperCase(),
        b.totalPriceIdr.toString(),
        'TERDAFTAR_AKTIF',
        'TERVALIDASI_SATUSEHAT'
      ];
    });

    const headerLine = SISKOPATUH_HEADERS.map(h => `"${h}"`).join(delimiter);
    const rowLines = rows.map(r => r.join(delimiter));
    return [headerLine, ...rowLines].join('\r\n');
  };

  // Download Siskopatuh CSV with UTF-8 BOM
  const handleDownloadSiskopatuhCSV = () => {
    const csvData = buildSiskopatuhCSVString();
    // \uFEFF Byte Order Mark ensures proper UTF-8 decoding in Microsoft Excel
    const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    const pkgSuffix = siskopatuhPackageFilter !== 'all' ? `_${siskopatuhPackageFilter.toUpperCase()}` : '_SEMUA_PAKET';
    link.href = url;
    link.setAttribute('download', `SISKOPATUH_KEMENAG_PPIU_912_KAREEM${pkgSuffix}_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy Siskopatuh CSV to Clipboard
  const handleCopySiskopatuhClipboard = () => {
    const csvData = buildSiskopatuhCSVString();
    navigator.clipboard.writeText(csvData).then(() => {
      setCopiedSiskopatuh(true);
      setTimeout(() => setCopiedSiskopatuh(false), 2500);
    });
  };

  // Export CSV Manifest function (defaults to Siskopatuh)
  const handleExportCSV = () => {
    handleDownloadSiskopatuhCSV();
  };

  // If not authenticated, render Travel Pin Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
        <div className="bg-white max-w-md w-full rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8 space-y-6 animate-in fade-in zoom-in-95">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-amber-400/50 overflow-hidden mx-auto shadow-md flex items-center justify-center">
              <img src="/logo-kareem.jpg" alt="Wisata Islami Kareem" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                بوابة المنظمين والوكالة
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                Portal Penyelenggara Travel
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Akses khusus manajemen & operasional biro perjalanan Wisata Islami Kareem.
              </p>
            </div>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                PIN Akses Operasional:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Ketik PIN (Demo: 1991)"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-emerald-700 focus:outline-none focus:bg-white"
                  autoFocus
                />
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
              </div>
              {pinError && (
                <p className="text-xs text-red-600 mt-2 text-center font-medium">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-900 hover:bg-emerald-950 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all"
            >
              Buka Dashboard Penyelenggara
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setIsAuthenticated(true);
                localStorage.setItem('kareem_admin_auth', 'true');
              }}
              className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Unlock className="w-3.5 h-3.5" />
              1-Klik Masuk sebagai Petugas Travel (Demo)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-slate-100/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Operational Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-400/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-amber-400/50 overflow-hidden shrink-0 flex items-center justify-center shadow-lg">
              <img src="/logo-kareem.jpg" alt="Wisata Islami Kareem" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Admin Control Panel • Wisata Islami Kareem
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-semibold">
                  Online PPIU Kemenag
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Pusat Kendali Operasional Travel
              </h1>
              <p className="text-xs text-slate-300">
                Verifikasi dokumen paspor, status pembayaran syariah, manifes penerbangan, dan kuota jamaah.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-top-finance"
              onClick={() => setActiveTab('finance')}
              className={`px-3.5 py-2.5 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 border ${
                activeTab === 'finance'
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-emerald-900 hover:bg-emerald-800 text-amber-300 border-emerald-700/60'
              }`}
              title="Buka Laporan Keuangan dan Analisis Laba Rugi Perusahaan"
            >
              <Receipt className="w-4 h-4" />
              <span>Laporan Keuangan</span>
              <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-black">
                Laba/Rugi
              </span>
            </button>
            <button
              id="btn-top-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-2.5 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 border ${
                activeTab === 'analytics'
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
              }`}
              title="Lihat visualisasi statistik Recharts"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Statistik & Tren</span>
            </button>
            <button
              id="btn-top-siskopatuh-modal"
              onClick={() => setIsSiskopatuhModalOpen(true)}
              className="px-3.5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 border border-emerald-600/50"
              title="Buka template dan ekspor manifes Siskopatuh Kemenag RI"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-300" />
              <span>Ekspor Siskopatuh</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1 py-0.2 rounded font-mono">
                Kemenag
              </span>
            </button>
            <button
              onClick={() => setIsNewBookingModalOpen(true)}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              + Input Pendaftaran Baru
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <LogOut className="w-3.5 h-3.5" />
              Keluar
            </button>
          </div>
        </div>

        {/* Real-time KPI Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div 
            onClick={() => setActiveTab('analytics')} 
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1 cursor-pointer hover:border-emerald-300 transition-all group"
            title="Klik untuk membuka Analitik Recharts"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Jamaah</span>
              <BarChart3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{totalPilgrims}</p>
            <p className="text-[11px] text-emerald-700 font-semibold">{bookings.length} Rombongan Booking</p>
          </div>

          <div 
            onClick={() => setActiveTab('finance')}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1 cursor-pointer hover:border-amber-300 transition-all group"
            title="Klik untuk melihat Laporan Keuangan & Laba Rugi"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Transaksi</span>
              <DollarSign className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 truncate">
              Rp {(totalGrossIdr / 1000000).toFixed(1)}Jt
            </p>
            <p className="text-[11px] text-amber-700 font-bold group-hover:underline">Buka Laporan Keuangan →</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Dana Masuk (DP/Lunas)</span>
            <p className="text-xl sm:text-2xl font-black text-emerald-800 truncate">
              Rp {(totalPaidIdr / 1000000).toFixed(1)}Jt
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Terverifikasi {Math.round((totalPaidIdr / (totalGrossIdr || 1)) * 100)}%
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Berkas Perlu Dicek</span>
            <p className="text-2xl sm:text-3xl font-black text-amber-600">{pendingDocsCount}</p>
            <p className="text-[11px] text-amber-700 font-semibold">Menunggu Verifikasi</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1 col-span-2 lg:col-span-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Paket Aktif</span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{packages.length}</p>
            <p className="text-[11px] text-slate-500 font-semibold">Program Umrah 1448H</p>
          </div>
        </div>

        {/* Tab Navigation for Travel Admin */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {[
            { key: 'bookings', label: 'Manajemen Jamaah & Berkas', icon: Users },
            { key: 'finance', label: 'Laporan Keuangan', icon: Receipt, badge: 'Laba/Rugi' },
            { key: 'analytics', label: 'Visualisasi Statistik (Recharts)', icon: BarChart3 },
            { key: 'packages', label: 'Paket & Kuota Travel', icon: Hotel },
            { key: 'announcements', label: 'Broadcast & Info Manasik', icon: Send },
            { key: 'roomlist', label: 'Roomlist & Manifest Hotel', icon: Building2 }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all relative ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black tracking-tight">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* SUB TAB 1: MANAJEMEN JAMAAH & BERKAS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            
            {/* Action & Filter Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama jamaah, kode booking, nomor paspor, paket..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none"
                >
                  <option value="all">Semua Status Berkas</option>
                  <option value="Pendaftaran Diterima">Pendaftaran Diterima</option>
                  <option value="Verifikasi Dokumen">Verifikasi Dokumen</option>
                  <option value="Penerbitan Visa">Penerbitan Visa</option>
                  <option value="Siap Berangkat">Siap Berangkat</option>
                </select>

                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none"
                >
                  <option value="all">Semua Pembayaran</option>
                  <option value="Menunggu DP">Menunggu DP</option>
                  <option value="DP Terverifikasi">DP Terverifikasi</option>
                  <option value="Lunas">Lunas</option>
                </select>

                <button
                  id="btn-export-siskopatuh-modal"
                  onClick={() => setIsSiskopatuhModalOpen(true)}
                  className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-xs border border-emerald-700/60 group"
                  title="Buka template dan pratinjau manifes resmi Siskopatuh Kemenag RI"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-6 transition-transform" />
                  <span>Ekspor Siskopatuh</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1 py-0.2 rounded font-mono">
                    Kemenag
                  </span>
                </button>
                <button
                  id="btn-export-csv-direct"
                  onClick={handleDownloadSiskopatuhCSV}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors border border-slate-200"
                  title="Unduh langsung CSV Siskopatuh (.csv)"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Table of Bookings */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Kode & Kontak</th>
                      <th className="p-4">Paket & Berangkat</th>
                      <th className="p-4">Rombongan</th>
                      <th className="p-4">Status Berkas</th>
                      <th className="p-4">Keuangan</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((b) => (
                        <tr key={b.bookingCode} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4">
                            <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded text-[11px] block w-fit">
                              {b.bookingCode}
                            </span>
                            <p className="font-black text-slate-900 text-sm mt-1">{b.contactName}</p>
                            <p className="text-slate-500 text-[11px]">{b.contactPhone}</p>
                          </td>
                          <td className="p-4 max-w-[200px]">
                            <p className="font-extrabold text-slate-900 truncate">{b.packageName}</p>
                            <p className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3 text-emerald-700" />
                              {b.departureDate}
                            </p>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-slate-900">{b.pilgrims.length} Jamaah</span>
                            <p className="text-slate-500 text-[11px] capitalize">{b.roomType} Room</p>
                          </td>
                          <td className="p-4">
                            <span className={`inline-block px-2.5 py-1 rounded-xl text-[11px] font-extrabold ${
                              b.status === 'Siap Berangkat'
                                ? 'bg-emerald-100 text-emerald-900'
                                : b.status === 'Penerbitan Visa'
                                ? 'bg-blue-100 text-blue-900'
                                : 'bg-amber-100 text-amber-900'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              b.paymentStatus === 'Lunas'
                                ? 'bg-emerald-100 text-emerald-900'
                                : b.paymentStatus === 'DP Terverifikasi'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-rose-100 text-rose-900'
                            }`}>
                              {b.paymentStatus}
                            </span>
                            <p className="font-mono font-bold text-slate-900 text-xs mt-1">
                              Rp {(b.paidAmountIdr || 0).toLocaleString('id-ID')}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              dari Rp {b.totalPriceIdr.toLocaleString('id-ID')}
                            </p>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedBookingForDetail(b)}
                              className="px-3.5 py-2 bg-slate-900 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-colors shadow-sm inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Kelola
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                          Tidak ditemukan data pendaftaran yang sesuai.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUB TAB: LAPORAN KEUANGAN & LABA RUGI */}
        {activeTab === 'finance' && (
          <LaporanKeuangan
            bookings={bookings}
            packages={packages}
          />
        )}

        {/* SUB TAB: VISUALISASI STATISTIK (RECHARTS) */}
        {activeTab === 'analytics' && (
          <TravelAnalyticsDashboard
            bookings={bookings}
            packages={packages}
          />
        )}

        {/* SUB TAB 2: PAKET & KUOTA TRAVEL */}
        {activeTab === 'packages' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Manajemen Kuota & Harga Paket
                </h3>
                <p className="text-xs text-slate-500">
                  Ketersediaan seat penerbangan dan alokasi kamar hotel musim umrah 1448H.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-slate-50/50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded uppercase">
                        {pkg.category}
                      </span>
                      <h4 className="text-base font-black text-slate-900 mt-1">{pkg.name}</h4>
                      <p className="text-xs text-slate-500">
                        {pkg.durationDays} Hari • Keberangkatan: {pkg.departureDate}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                      <span className="text-slate-400 block text-[10px]">Quad</span>
                      <span className="font-bold font-mono">Rp {(pkg.priceQuad / 1000000).toFixed(1)}Jt</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                      <span className="text-slate-400 block text-[10px]">Triple</span>
                      <span className="font-bold font-mono">Rp {(pkg.priceTriple / 1000000).toFixed(1)}Jt</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                      <span className="text-slate-400 block text-[10px]">Double</span>
                      <span className="font-bold font-mono">Rp {(pkg.priceDouble / 1000000).toFixed(1)}Jt</span>
                    </div>
                  </div>

                  {/* Quota adjustments */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 block">Sisa Seat / Kuota:</span>
                      <span className="font-extrabold text-emerald-800 text-sm">
                        {pkg.quotaRemaining} dari {pkg.quotaTotal} Seat
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdatePackageQuota(pkg.id, Math.max(0, pkg.quotaRemaining - 1))}
                        className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-slate-700"
                        title="Kurangi 1 seat"
                      >
                        -
                      </button>
                      <button
                        onClick={() => onUpdatePackageQuota(pkg.id, pkg.quotaRemaining + 1)}
                        className="w-7 h-7 bg-emerald-100 hover:bg-emerald-200 rounded-lg font-bold text-emerald-800"
                        title="Tambah 1 seat"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB TAB 3: BROADCAST & PENGUMUMAN MANASIK */}
        {activeTab === 'announcements' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Create Announcement Form */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-black text-slate-900">
                  Kirim Broadcast ke Portal Jamaah
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Pesan ini akan langsung tampil di dashboard seluruh jamaah yang masuk.
              </p>

              <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Judul Pengumuman:</label>
                  <input
                    type="text"
                    value={newAnnTitle}
                    onChange={(e) => setNewAnnTitle(e.target.value)}
                    placeholder="Contoh: Jadwal Manasik Tatap Muka di Asrama Haji"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori Pesan:</label>
                  <select
                    value={newAnnCategory}
                    onChange={(e) => setNewAnnCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:outline-none"
                  >
                    <option value="Manasik">Manasik & Pelatihan</option>
                    <option value="Logistik">Logistik & Koper</option>
                    <option value="Penerbangan">Penerbangan & Imigrasi</option>
                    <option value="Penting">Pemberitahuan Penting</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Isi Pesan:</label>
                  <textarea
                    rows={4}
                    value={newAnnContent}
                    onChange={(e) => setNewAnnContent(e.target.value)}
                    placeholder="Tulis detail informasi untuk jamaah..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Kirim Broadcast
                </button>
              </form>
            </div>

            {/* List of Active Announcements */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900">
                Daftar Broadcast Aktif ({announcements.length})
              </h3>

              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{ann.title}</span>
                        <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                          {ann.category}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{ann.content}</p>
                      <span className="text-[10px] text-slate-400 block pt-1">{ann.date}</span>
                    </div>

                    <button
                      onClick={() => onDeleteAnnouncement(ann.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Hapus pengumuman"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB TAB 4: ROOMLIST & MANIFEST */}
        {activeTab === 'roomlist' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Roomlist Hotel Makkah & Madinah
                </h3>
                <p className="text-xs text-slate-500">
                  Pengelompokan kamar Quad, Triple, dan Double untuk reservasi hotel bintang 5.
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Roomlist
              </button>
            </div>

            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.bookingCode} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-extrabold text-slate-900 text-sm">
                      Kamar {b.roomType.toUpperCase()} ({b.pilgrims.length} Jamaah) • {b.bookingCode}
                    </span>
                    <span className="text-slate-500 font-medium">{b.packageName}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                    {b.pilgrims.map((p, idx) => (
                      <div key={p.id} className="p-2 bg-white rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold block">Bed {idx + 1}:</span>
                        <p className="font-bold text-slate-800 truncate">{p.fullName}</p>
                        <p className="text-[10px] font-mono text-slate-500">{p.passportNumber}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal: Detail & Tindakan Admin untuk Booking */}
      {selectedBookingForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-amber-400/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center">
                  {selectedBookingForDetail.contactName.charAt(0)}
                </div>
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                    Detail Pendaftaran • {selectedBookingForDetail.bookingCode}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {selectedBookingForDetail.contactName} ({selectedBookingForDetail.pilgrims.length} Jamaah)
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedBookingForDetail(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              
              {/* Quick Status Control Row */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    Ubah Status Keberangkatan:
                  </label>
                  <select
                    value={selectedBookingForDetail.status}
                    onChange={(e) => handleUpdateBookingStatus(selectedBookingForDetail.bookingCode, e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-xs focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Pendaftaran Diterima">1. Pendaftaran Diterima</option>
                    <option value="Verifikasi Dokumen">2. Verifikasi Dokumen</option>
                    <option value="Penerbitan Visa">3. Penerbitan Visa</option>
                    <option value="Siap Berangkat">4. Siap Berangkat</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    Ubah Status Pembayaran:
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedBookingForDetail.paymentStatus}
                      onChange={(e) => handleUpdatePaymentStatus(selectedBookingForDetail.bookingCode, e.target.value as any)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-xs focus:ring-2 focus:ring-emerald-700"
                    >
                      <option value="Menunggu DP">Menunggu DP</option>
                      <option value="DP Terverifikasi">DP Terverifikasi</option>
                      <option value="Lunas">Lunas</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Logistics Status Controls */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block text-xs">
                  Pengambilan Perlengkapan (Logistik):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'koper', label: 'Koper Fiber 24"' },
                    { key: 'seragam', label: 'Kain Ihram / Mukena' },
                    { key: 'bukuDoa', label: 'Buku Doa & ID Card' }
                  ].map((item) => (
                    <div key={item.key} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[11px] font-bold text-slate-600 block">{item.label}</span>
                      <select
                        value={selectedBookingForDetail.logisticsStatus?.[item.key as keyof typeof selectedBookingForDetail.logisticsStatus] || 'Belum Diambil'}
                        onChange={(e) => handleUpdateLogistics(selectedBookingForDetail.bookingCode, item.key as any, e.target.value as any)}
                        className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-[11px] font-semibold"
                      >
                        <option value="Belum Diambil">Belum Diambil</option>
                        <option value="Siap Diambil">Siap Diambil</option>
                        <option value="Sudah Diterima">Sudah Diterima</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pilgrims and their documents */}
              <div className="space-y-4">
                <h4 className="font-black text-slate-900 text-sm">
                  Pemeriksaan Berkas Jamaah ({selectedBookingForDetail.pilgrims.length} Orang)
                </h4>

                {selectedBookingForDetail.pilgrims.map((plg, i) => (
                  <div key={plg.id} className="p-4 border border-slate-200 rounded-2xl bg-white space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-extrabold text-slate-900">
                        {i + 1}. {plg.fullName} ({plg.gender === 'L' ? 'Pria' : 'Wanita'})
                      </span>
                      <span className="text-slate-500 font-mono">
                        Paspor: {plg.passportNumber || '-'} (Exp: {plg.passportExpiry || '-'})
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-500">Berkas Terunggah:</span>
                      {plg.documents && plg.documents.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {plg.documents.map((doc) => (
                            <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                              <div>
                                <p className="font-bold text-slate-800">{doc.title}</p>
                                <p className="text-[10px] text-slate-400">{doc.fileName}</p>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => setPreviewDocModal(doc)}
                                  className="p-1 bg-slate-200 hover:bg-slate-300 rounded text-slate-700"
                                  title="Lihat Pratinjau Dokumen"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleVerifyDocument(selectedBookingForDetail.bookingCode, plg.id, doc.id, 'Terverifikasi')}
                                  className={`px-2 py-1 rounded text-[10px] font-bold ${
                                    doc.verificationStatus === 'Terverifikasi'
                                      ? 'bg-emerald-700 text-white'
                                      : 'bg-slate-200 hover:bg-emerald-100 text-slate-700'
                                  }`}
                                >
                                  Valid ✓
                                </button>
                                <button
                                  onClick={() => handleVerifyDocument(selectedBookingForDetail.bookingCode, plg.id, doc.id, 'Perlu Perbaikan')}
                                  className={`px-2 py-1 rounded text-[10px] font-bold ${
                                    doc.verificationStatus === 'Perlu Perbaikan'
                                      ? 'bg-red-700 text-white'
                                      : 'bg-slate-200 hover:bg-red-100 text-slate-700'
                                  }`}
                                >
                                  Tolak ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic text-[11px]">Belum ada berkas terunggah untuk jamaah ini.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setSelectedBookingForDetail(null)}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tambah Pendaftaran Manual */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-amber-400/30">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base">Input Pendaftaran Jamaah Baru (Admin)</h3>
              </div>
              <button 
                onClick={() => setIsNewBookingModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveManualBooking} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Jamaah Utama (Kontak):</label>
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="Contoh: H. Miftah Faridl"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">No. WhatsApp / HP:</label>
                  <input
                    type="text"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="0812XXXXXXXX"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email:</label>
                  <input
                    type="email"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilihan Paket Umrah:</label>
                <select
                  value={manualPackageId}
                  onChange={(e) => setManualPackageId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:outline-none"
                >
                  {packages.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.departureDate})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipe Kamar:</label>
                  <select
                    value={manualRoomType}
                    onChange={(e) => setManualRoomType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:outline-none"
                  >
                    <option value="quad">Quad (4 Orang / Kamar)</option>
                    <option value="triple">Triple (3 Orang / Kamar)</option>
                    <option value="double">Double (2 Orang / Kamar)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jumlah Jamaah:</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={manualPilgrimCount}
                    onChange={(e) => setManualPilgrimCount(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Jumlah DP Diterima (Rp):</label>
                <input
                  type="text"
                  value={manualPaidAmount}
                  onChange={(e) => setManualPaidAmount(e.target.value)}
                  placeholder="Contoh: 10000000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-emerald-950 text-white font-bold rounded-xl shadow-md"
                >
                  Simpan Pendaftaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Preview Berkas Paspor / KTP */}
      {previewDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-3xl overflow-hidden p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-slate-900">{previewDocModal.title}</h4>
                <p className="text-xs text-slate-500">{previewDocModal.fileName}</p>
              </div>
              <button onClick={() => setPreviewDocModal(null)} className="text-slate-400 hover:text-slate-800 text-xs font-bold">
                ✕
              </button>
            </div>
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center min-h-[220px]">
              <img src={previewDocModal.fileUrl} alt={previewDocModal.title} className="max-h-80 object-contain rounded" />
            </div>
            <button
              onClick={() => setPreviewDocModal(null)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      )}

      {/* Modal: Export Siskopatuh Kemenag RI */}
      {isSiskopatuhModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white max-w-5xl w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-auto flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="bg-emerald-950 text-white p-5 sm:p-6 border-b border-amber-400/30 flex items-start justify-between gap-4 shrink-0 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3.5 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-amber-400/60 flex items-center justify-center p-2 shadow-inner shrink-0">
                  <FileSpreadsheet className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                      Ditjen PHU Kemenag RI
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full font-mono font-medium">
                      PPIU: 912/2021
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Ekspor Manifes Siskopatuh (Kemenag RI)
                  </h3>
                  <p className="text-xs text-emerald-200/80 mt-0.5">
                    Format file CSV standar pelaporan Sistem Komputerisasi Pengelolaan Terpadu Umrah dan Haji Khusus.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSiskopatuhModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">

              {/* Filter Controls & Settings Grid */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <ListFilter className="w-4 h-4 text-emerald-800" />
                    Filter & Konfigurasi Ekspor
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Sesuaikan kriteria jamaah yang akan dilaporkan
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1 text-[11px]">
                      Filter Paket Umrah:
                    </label>
                    <select
                      value={siskopatuhPackageFilter}
                      onChange={(e) => setSiskopatuhPackageFilter(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    >
                      <option value="all">Semua Paket Keberangkatan</option>
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} ({pkg.departureDate})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1 text-[11px]">
                      Filter Status Berkas:
                    </label>
                    <select
                      value={siskopatuhStatusFilter}
                      onChange={(e) => setSiskopatuhStatusFilter(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    >
                      <option value="all">Semua Status Berkas</option>
                      <option value="Siap Berangkat">Hanya Siap Berangkat & Terverifikasi</option>
                      <option value="Penerbitan Visa">Penerbitan Visa</option>
                      <option value="Verifikasi Dokumen">Verifikasi Dokumen</option>
                      <option value="Pendaftaran Diterima">Pendaftaran Diterima</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1 text-[11px]">
                      Filter Pembayaran:
                    </label>
                    <select
                      value={siskopatuhPaymentFilter}
                      onChange={(e) => setSiskopatuhPaymentFilter(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    >
                      <option value="all">Semua Status Pembayaran</option>
                      <option value="DP_or_Lunas">Minimal DP Terverifikasi / Lunas</option>
                      <option value="Lunas">Hanya yang Sudah Lunas</option>
                    </select>
                  </div>
                </div>

                {/* Delimiter & Excel Formatting Settings */}
                <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-700 text-[11px]">Pemisah Kolom (Delimiter):</span>
                    <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-300">
                      <button
                        type="button"
                        onClick={() => setSiskopatuhDelimiter(';')}
                        className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                          siskopatuhDelimiter === ';'
                            ? 'bg-emerald-800 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Titik Koma (;) [Standar Excel ID]
                      </button>
                      <button
                        type="button"
                        onClick={() => setSiskopatuhDelimiter(',')}
                        className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                          siskopatuhDelimiter === ','
                            ? 'bg-emerald-800 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Koma (,) [CSV Universal]
                      </button>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={siskopatuhExcelQuote}
                      onChange={(e) => setSiskopatuhExcelQuote(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-800 focus:ring-emerald-700 h-4 w-4"
                    />
                    <span className="text-[11px] font-bold text-slate-700">
                      Format Teks Angka Excel (Mencegah NIK 16-Digit terpotong / jadi 3.17E+15)
                    </span>
                  </label>
                </div>
              </div>

              {/* Real-time Summary Cards */}
              {(() => {
                const pilgrimsList = getSiskopatuhPilgrims();
                const uniqueBookings = new Set(pilgrimsList.map(item => item.booking.bookingCode)).size;
                const readyPilgrims = pilgrimsList.filter(item => item.booking.status === 'Siap Berangkat').length;

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                        Jumlah Jamaah Terfilter
                      </span>
                      <p className="text-xl font-black text-emerald-950 mt-1">
                        {pilgrimsList.length} <span className="text-xs font-semibold text-emerald-700">Jamaah</span>
                      </p>
                      <span className="text-[10px] text-emerald-600 block mt-0.5">
                        Siap diunggah ke Siskopatuh
                      </span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Total Rombongan
                      </span>
                      <p className="text-xl font-black text-slate-900 mt-1">
                        {uniqueBookings} <span className="text-xs font-semibold text-slate-500">Keluarga/Group</span>
                      </p>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Berdasarkan Kode Booking
                      </span>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                        Status Siap Berangkat
                      </span>
                      <p className="text-xl font-black text-amber-950 mt-1">
                        {readyPilgrims} / {pilgrimsList.length}
                      </p>
                      <span className="text-[10px] text-amber-700 block mt-0.5">
                        {readyPilgrims === pilgrimsList.length ? '100% Siap terbang' : 'Sebagian dalam proses'}
                      </span>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl">
                      <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                        Spesifikasi Manifes
                      </span>
                      <p className="text-xl font-black text-blue-950 mt-1">
                        34 <span className="text-xs font-semibold text-blue-700">Kolom</span>
                      </p>
                      <span className="text-[10px] text-blue-600 block mt-0.5">
                        Sesuai SK Dirjen PHU Kemenag
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Data Table Live Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-emerald-800" />
                    Pratinjau Data Manifes Siskopatuh (Live 6 Baris Pertama)
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Scroll horizontal untuk memeriksa seluruh 34 kolom
                  </span>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                  <div className="overflow-x-auto max-h-64">
                    <table className="w-full text-left text-[11px] whitespace-nowrap">
                      <thead className="bg-slate-900 text-amber-300 font-bold uppercase tracking-wider border-b border-slate-800 sticky top-0">
                        <tr>
                          <th className="py-2.5 px-3">No</th>
                          <th className="py-2.5 px-3">Reg. Siskopatuh</th>
                          <th className="py-2.5 px-3">Kode Booking</th>
                          <th className="py-2.5 px-3">NIK (16 Digit)</th>
                          <th className="py-2.5 px-3">Nama Jamaah (Sesuai Paspor)</th>
                          <th className="py-2.5 px-3">JK</th>
                          <th className="py-2.5 px-3">No. Paspor</th>
                          <th className="py-2.5 px-3">Exp. Paspor</th>
                          <th className="py-2.5 px-3">No. HP</th>
                          <th className="py-2.5 px-3">Izin PPIU</th>
                          <th className="py-2.5 px-3">Paket</th>
                          <th className="py-2.5 px-3">Keberangkatan</th>
                          <th className="py-2.5 px-3">Maskapai</th>
                          <th className="py-2.5 px-3">No. Flight</th>
                          <th className="py-2.5 px-3">PNR</th>
                          <th className="py-2.5 px-3">Hotel Makkah</th>
                          <th className="py-2.5 px-3">Hotel Madinah</th>
                          <th className="py-2.5 px-3">Tipe Kamar</th>
                          <th className="py-2.5 px-3">Status Visa</th>
                          <th className="py-2.5 px-3">Status Berkas</th>
                          <th className="py-2.5 px-3">Pembayaran</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {getSiskopatuhPilgrims().slice(0, 6).map((item, idx) => {
                          const { booking: b, pilgrim: p, packageInfo: pkg } = item;
                          const cleanPassport = p.passportNumber || `C${Math.floor(1000000 + Math.random() * 9000000)}`;
                          const numCode = cleanPassport.replace(/\D/g, '').padEnd(6, '0').slice(0, 6);
                          const siskopatuhReg = `SKP-912-${numCode}`;

                          return (
                            <tr key={`${b.bookingCode}-${idx}`} className="hover:bg-emerald-50/40 transition-colors">
                              <td className="py-2 px-3 font-bold text-slate-500">{idx + 1}</td>
                              <td className="py-2 px-3 font-mono font-bold text-emerald-800">{siskopatuhReg}</td>
                              <td className="py-2 px-3 font-mono font-semibold text-slate-800">{b.bookingCode}</td>
                              <td className="py-2 px-3 font-mono font-medium text-slate-900 bg-slate-50/50">{p.nikKtp}</td>
                              <td className="py-2 px-3 font-bold text-slate-900">{p.fullName.toUpperCase()}</td>
                              <td className="py-2 px-3 text-center font-bold">
                                {p.gender === 'L' ? (
                                  <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">L</span>
                                ) : (
                                  <span className="text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">P</span>
                                )}
                              </td>
                              <td className="py-2 px-3 font-mono font-bold text-slate-800">{cleanPassport}</td>
                              <td className="py-2 px-3 font-mono text-slate-600">{p.passportExpiry || '2031-10-15'}</td>
                              <td className="py-2 px-3 font-mono text-slate-600">{p.phone || b.contactPhone}</td>
                              <td className="py-2 px-3 font-semibold text-slate-600">PPIU 912/2021</td>
                              <td className="py-2 px-3 font-medium text-slate-800">{b.packageName}</td>
                              <td className="py-2 px-3 text-slate-700">{b.departureDate}</td>
                              <td className="py-2 px-3 text-slate-700">{pkg?.airlines || 'Saudia Airlines'}</td>
                              <td className="py-2 px-3 font-mono text-slate-600">{b.flightNumber || 'SV-819'}</td>
                              <td className="py-2 px-3 font-mono font-bold text-emerald-700">{b.pnrCode || 'PNR-912-KSA'}</td>
                              <td className="py-2 px-3 text-slate-700">{pkg?.hotelMakkah?.name || 'Pullman Zamzam'}</td>
                              <td className="py-2 px-3 text-slate-700">{pkg?.hotelMadinah?.name || 'Maden Hotel'}</td>
                              <td className="py-2 px-3 font-bold uppercase text-slate-800">{b.roomType}</td>
                              <td className="py-2 px-3">
                                <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                                  {b.visaNumber || (b.status === 'Siap Berangkat' ? 'E-VISA-SA-98124' : 'PROSES')}
                                </span>
                              </td>
                              <td className="py-2 px-3">
                                <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium text-[10px]">
                                  {b.status}
                                </span>
                              </td>
                              <td className="py-2 px-3">
                                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold text-[10px]">
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

              {/* Kemenag Guidance Notice */}
              <div className="bg-emerald-900/10 border border-emerald-800/20 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div className="space-y-1 text-slate-700">
                  <h5 className="font-extrabold text-emerald-950 text-xs">
                    Kepatuhan Regulasi Ditjen PHU Kemenag RI (5 Pasti Umrah):
                  </h5>
                  <p className="text-[11px] leading-relaxed">
                    Format file CSV ini telah disusun mengikuti struktur <strong>Kepdirjen PHU Kemenag RI tentang Tata Kelola Siskopatuh</strong>.
                    Setiap baris mewakili 1 jamaah dan berisi data lengkap identitas NIK/Paspor, nomor izin PPIU 912/2021, tiket PNR pesawat PP, konfirmasi hotel Makkah & Madinah, serta status asuransi syariah.
                    File ini dapat langsung diimpor ke aplikasi web <em>Siskopatuh Kemenag RI</em> tanpa konversi manual.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-[11px] text-slate-600">
                <Info className="w-4 h-4 text-emerald-800" />
                <span>Format file: <strong>CSV (UTF-8 with BOM)</strong> ramah Microsoft Excel & LibreOffice Calc</span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopySiskopatuhClipboard}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  {copiedSiskopatuh ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin ke Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>Salin CSV</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSiskopatuhCSV}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 border border-amber-400/40"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Unduh CSV Siskopatuh</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSiskopatuhModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
