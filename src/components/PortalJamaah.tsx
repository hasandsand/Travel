import React, { useState } from 'react';
import { 
  User, 
  Search, 
  Calendar, 
  MapPin, 
  Plane, 
  Hotel, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Download, 
  UploadCloud, 
  Phone, 
  CreditCard, 
  Package, 
  Sparkles, 
  ExternalLink, 
  ChevronRight, 
  LogOut, 
  ShieldCheck, 
  BookOpen, 
  Compass, 
  RotateCw, 
  Info,
  Check,
  Send,
  Printer
} from 'lucide-react';
import { BookingRecord, UmrahPackage, Pilgrim, PilgrimDocument, TravelAnnouncement } from '../types';

interface PortalJamaahProps {
  bookings: BookingRecord[];
  packages: UmrahPackage[];
  announcements: TravelAnnouncement[];
  onUpdateBooking: (updated: BookingRecord) => void;
  onOpenBookingWizard: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const PortalJamaah: React.FC<PortalJamaahProps> = ({
  bookings,
  packages,
  announcements,
  onUpdateBooking,
  onOpenBookingWizard,
  onNavigateToTab
}) => {
  // State for active logged in booking
  const [activeBookingCode, setActiveBookingCode] = useState<string>(() => {
    // Default to first booking if available
    return bookings.length > 0 ? bookings[0].bookingCode : '';
  });

  const [searchInput, setSearchInput] = useState<string>('');
  const [searchError, setSearchError] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'pilgrims' | 'payment' | 'logistics' | 'services'>('overview');

  // Payment upload state
  const [uploadProofModalOpen, setUploadProofModalOpen] = useState<boolean>(false);
  const [paymentAmountInput, setPaymentAmountInput] = useState<string>('');
  const [proofFileName, setProofFileName] = useState<string>('');
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string>('');
  const [paymentNote, setPaymentNote] = useState<string>('');
  const [paymentSuccessToast, setPaymentSuccessToast] = useState<boolean>(false);

  // Document add modal state
  const [docUploadModalPilgrim, setDocUploadModalPilgrim] = useState<{ pilgrimId: string; name: string } | null>(null);
  const [newDocType, setNewDocType] = useState<PilgrimDocument['type']>('passport');
  const [newDocTitle, setNewDocTitle] = useState<string>('Scan Paspor Asli');
  const [newDocFileName, setNewDocFileName] = useState<string>('');
  const [newDocFileUrl, setNewDocFileUrl] = useState<string>('');

  // Selected booking record
  const currentBooking = bookings.find(
    (b) => b.bookingCode.toUpperCase() === activeBookingCode.toUpperCase()
  );

  const matchedPackage = currentBooking 
    ? packages.find((p) => p.id === currentBooking.packageId)
    : null;

  // Handle Search / Login
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const query = searchInput.trim().toUpperCase();
    if (!query) {
      setSearchError('Silakan masukkan Kode Booking, No. WhatsApp, atau Nama');
      return;
    }

    const found = bookings.find(
      (b) =>
        b.bookingCode.toUpperCase() === query ||
        b.contactPhone.replace(/\D/g, '').includes(query.replace(/\D/g, '')) ||
        b.contactName.toUpperCase().includes(query) ||
        b.pilgrims.some(p => p.fullName.toUpperCase().includes(query) || p.passportNumber.toUpperCase() === query)
    );

    if (found) {
      setActiveBookingCode(found.bookingCode);
      setSearchInput('');
      setActiveSubTab('overview');
    } else {
      setSearchError('Data jamaah tidak ditemukan. Pastikan kode booking atau nomor handphone sesuai saat pendaftaran.');
    }
  };

  // Quick switch to demo account
  const handleSelectDemoAccount = (code: string) => {
    setActiveBookingCode(code);
    setSearchError('');
    setActiveSubTab('overview');
  };

  // Calculate days until departure
  const getDaysUntilDeparture = (departureDateStr: string) => {
    try {
      const departure = new Date(departureDateStr);
      const now = new Date();
      const diffTime = departure.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return 0;
    }
  };

  // Handle Payment proof submission
  const handleConfirmPaymentProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBooking) return;

    const amount = Number(paymentAmountInput.replace(/\D/g, '')) || 5000000;
    const newPaidAmount = (currentBooking.paidAmountIdr || 0) + amount;
    const isFullyPaid = newPaidAmount >= currentBooking.totalPriceIdr;

    const updatedBooking: BookingRecord = {
      ...currentBooking,
      paidAmountIdr: newPaidAmount,
      paymentStatus: isFullyPaid ? 'Lunas' : 'DP Terverifikasi',
      paymentProofUrl: proofPreviewUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      paymentProofName: proofFileName || 'Bukti_Transfer_Bank_Syariah.jpg',
      notes: paymentNote ? `${currentBooking.notes || ''} | Konfirmasi bayar: ${paymentNote}` : currentBooking.notes
    };

    onUpdateBooking(updatedBooking);
    setUploadProofModalOpen(false);
    setPaymentSuccessToast(true);
    setTimeout(() => setPaymentSuccessToast(false), 4000);
  };

  // Handle Document upload submission from Jamaah portal
  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBooking || !docUploadModalPilgrim) return;

    const newDoc: PilgrimDocument = {
      id: `doc-${Date.now()}`,
      type: newDocType,
      title: newDocTitle,
      fileName: newDocFileName || `${newDocTitle.replace(/\s+/g, '_')}.jpg`,
      fileSize: 350000,
      fileUrl: newDocFileUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      uploadedAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      verificationStatus: 'Menunggu Verifikasi'
    };

    const updatedPilgrims = currentBooking.pilgrims.map((plg) => {
      if (plg.id === docUploadModalPilgrim.pilgrimId) {
        return {
          ...plg,
          documents: [...(plg.documents || []), newDoc]
        };
      }
      return plg;
    });

    onUpdateBooking({
      ...currentBooking,
      pilgrims: updatedPilgrims
    });

    setDocUploadModalPilgrim(null);
    setNewDocFileUrl('');
    setNewDocFileName('');
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Notification Toast */}
        {paymentSuccessToast && (
          <div className="bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 border border-amber-400/40 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-xs sm:text-sm font-medium">
                Alhamdulillah! Bukti pembayaran berhasil diunggah. Tim keuangan Wisata Islami Kareem akan memverifikasi dalam 1x24 jam kerja.
              </p>
            </div>
            <button onClick={() => setPaymentSuccessToast(false)} className="text-emerald-300 hover:text-white text-xs font-bold">
              Tutup
            </button>
          </div>
        )}

        {/* Portal Header & Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 rounded-3xl text-white p-6 sm:p-8 shadow-xl border border-amber-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                Portal Pelayanan Jamaah Mandiri (بوابة المعتمرين)
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Ahlan Wa Sahlan, Tamu Allah
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
                Akses resmi pengecekan berkas paspor, e-Visa, jadwal manasik, status perlengkapan koper, serta bimbingan ibadah terpadu Wisata Islami Kareem.
              </p>
            </div>

            {/* Quick switcher or status preview */}
            {currentBooking ? (
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex items-center justify-between sm:justify-start gap-4 shrink-0">
                <div className="w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 font-black flex items-center justify-center text-xl shrink-0 shadow-md">
                  {currentBooking.contactName.charAt(0)}
                </div>
                <div>
                  <span className="text-[11px] text-emerald-300 font-medium block">Akun Jamaah Terhubung:</span>
                  <p className="text-sm sm:text-base font-extrabold text-white leading-tight">
                    {currentBooking.contactName}
                  </p>
                  <p className="text-[11px] font-mono text-amber-300 mt-0.5">
                    Kode: {currentBooking.bookingCode}
                  </p>
                </div>
                <button
                  onClick={() => setActiveBookingCode('')}
                  title="Ganti atau cari akun lain"
                  className="ml-2 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl transition-colors border border-white/20 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ganti</span>
                </button>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-xs text-emerald-200">
                Belum masuk ke pendaftaran jamaah.
              </div>
            )}
          </div>
        </div>

        {/* If no booking is selected, show login/search form & quick demo buttons */}
        {!currentBooking ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
            <div className="max-w-xl mx-auto text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
                <Search className="w-7 h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Masuk ke Portal Jamaah Anda
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Masukkan <strong>Kode Booking</strong> (contoh: <code className="font-mono text-emerald-800">UMR-2026-8941</code>) atau <strong>Nomor WhatsApp</strong> yang digunakan saat pendaftaran.
              </p>
            </div>

            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Ketik Kode Booking / No. WhatsApp / Nama Jamaah..."
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none focus:bg-white transition-all shadow-sm"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
              </div>

              {searchError && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{searchError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Cari Data Pendaftaran
              </button>
            </form>

            {/* Quick Demo Accounts */}
            <div className="max-w-2xl mx-auto pt-6 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-center mb-4">
                Akses Cepat Simulasi Jamaah (1-Klik Demo)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {bookings.slice(0, 3).map((bk) => (
                  <button
                    key={bk.bookingCode}
                    onClick={() => handleSelectDemoAccount(bk.bookingCode)}
                    className="p-3.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-2xl text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {bk.bookingCode}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-xs font-extrabold text-slate-900 truncate">
                      {bk.contactName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {bk.status}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Belum terdaftar callout */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center max-w-xl mx-auto space-y-2">
              <p className="text-xs text-amber-950 font-medium">
                Belum mendaftar paket umrah bersama Wisata Islami Kareem?
              </p>
              <button
                onClick={onOpenBookingWizard}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Daftar Paket Umrah Baru Sekarang
              </button>
            </div>
          </div>
        ) : (
          /* Active Jamaah Portal Dashboard */
          <div className="space-y-6">
            
            {/* Quick Status Bar & Countdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Package & Departure */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Paket Terpilih</span>
                  <span className="text-[11px] font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-bold">
                    {currentBooking.bookingCode}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 line-clamp-1">
                  {currentBooking.packageName}
                </h3>
                <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(currentBooking.departureDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Card 2: Countdown */}
              <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-5 rounded-3xl shadow-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">Countdown</span>
                  <Plane className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">
                    {getDaysUntilDeparture(currentBooking.departureDate)}
                  </span>
                  <span className="text-xs text-emerald-200 font-semibold">Hari Menuju Keberangkatan</span>
                </div>
                <p className="text-[11px] text-emerald-200/80">
                  Bandara Soekarno Hatta (CGK) - King Abdulaziz (JED)
                </p>
              </div>

              {/* Card 3: Status Berkas & Visa */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status Berkas</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <span className={`inline-block text-xs font-extrabold px-2.5 py-1 rounded-xl ${
                    currentBooking.status === 'Siap Berangkat'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : currentBooking.status === 'Penerbitan Visa'
                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {currentBooking.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {currentBooking.pilgrims.length} Jamaah terdaftar dalam rombongan
                </p>
              </div>

              {/* Card 4: Status Pembayaran */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Keuangan</span>
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <span className={`inline-block text-xs font-extrabold px-2.5 py-1 rounded-xl ${
                    currentBooking.paymentStatus === 'Lunas'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : currentBooking.paymentStatus === 'DP Terverifikasi'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}>
                    {currentBooking.paymentStatus}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  Terbayar: Rp {(currentBooking.paidAmountIdr || 0).toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            {/* Navigation Tabs for Jamaah Portal */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
              {[
                { key: 'overview', label: 'Ringkasan & Timeline', icon: Clock },
                { key: 'pilgrims', label: 'Data Rombongan & Paspor', icon: User },
                { key: 'payment', label: 'Pembayaran & Tagihan', icon: CreditCard },
                { key: 'logistics', label: 'Manasik & Koper', icon: Package },
                { key: 'services', label: 'Panduan & Bantuan', icon: BookOpen }
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeSubTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveSubTab(tab.key as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-900 text-white shadow-md shadow-emerald-950/20'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* SUB-TAB 1: RINGKASAN & TIMELINE */}
            {activeSubTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 8 Cols: Timeline & Announcements */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Progress Step Bar */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-black text-slate-900">
                        Progres Administrasi & Keberangkatan
                      </h3>
                      <span className="text-xs text-slate-500">Pembaruan sistem real-time</span>
                    </div>

                    <div className="relative">
                      {/* Process Steps */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        {[
                          { step: 1, title: 'Pendaftaran Diterima', desc: 'Data & DP tersimpan', done: true },
                          { step: 2, title: 'Verifikasi Dokumen', desc: 'Pengecekan Paspor & KTP', done: currentBooking.status !== 'Pendaftaran Diterima' },
                          { step: 3, title: 'Penerbitan Visa', desc: 'e-Visa & Tasreh Raudhah', done: currentBooking.status === 'Penerbitan Visa' || currentBooking.status === 'Siap Berangkat' },
                          { step: 4, title: 'Siap Berangkat', desc: 'Briefing koper & manasik', done: currentBooking.status === 'Siap Berangkat' }
                        ].map((st, idx) => (
                          <div 
                            key={idx}
                            className={`p-4 rounded-2xl border transition-all ${
                              st.done 
                                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                st.done ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-500'
                              }`}>
                                {st.done ? <Check className="w-3.5 h-3.5" /> : st.step}
                              </div>
                              <span className="text-xs font-extrabold">{st.title}</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-slate-500">{st.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pengumuman Khusus Jamaah dari Penyelenggara */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <h3 className="text-base font-black text-slate-900">
                          Informasi & Broadcast Khusus Jamaah
                        </h3>
                      </div>
                      <span className="text-xs text-slate-400">Wisata Islami Kareem</span>
                    </div>

                    <div className="space-y-3">
                      {announcements.map((ann) => (
                        <div 
                          key={ann.id}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors space-y-1.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900">{ann.title}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                                {ann.category}
                              </span>
                              <span className="text-[11px] text-slate-400">{ann.date}</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Flight & Hotel Info */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-base font-black text-slate-900">
                      Rincian Fasilitas Perjalanan
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                          <Plane className="w-4 h-4" />
                          <span>Penerbangan Maskapai</span>
                        </div>
                        <p className="text-sm font-extrabold text-slate-900">
                          {currentBooking.flightNumber || matchedPackage?.airline.name || 'Saudia Airlines (Direct)'}
                        </p>
                        <p className="text-xs text-slate-500">
                          Kode PNR: <span className="font-mono font-bold text-emerald-900">{currentBooking.pnrCode || 'KRM-CGK-JED'}</span>
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Bagasi: 2 x 23 kg + 7 kg kabin + 5L Air Zamzam
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                          <Hotel className="w-4 h-4" />
                          <span>Akomodasi Hotel Bintang 5</span>
                        </div>
                        <p className="text-sm font-extrabold text-slate-900">
                          {matchedPackage?.hotelMakkah.name || 'Makkah: Anjum Hotel / Le Meridien Towers'}
                        </p>
                        <p className="text-xs text-slate-500">
                          Madinah: {matchedPackage?.hotelMadinah.name || 'Rove Madinah / Frontel Al Harithia'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Tipe Kamar: <strong className="capitalize text-slate-700">{currentBooking.roomType} Room</strong> (Fullboard Indonesia)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 4 Cols: Muthawwif Card & Action buttons */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Muthawwif Card */}
                  <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-6 rounded-3xl border border-amber-400/30 shadow-md space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                      <User className="w-4 h-4" />
                      <span>Pembimbing Ibadah (Muthawwif)</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-amber-400 text-emerald-950 font-black flex items-center justify-center text-xl shrink-0 shadow-md border-2 border-white/20">
                        {currentBooking.muthawwif ? currentBooking.muthawwif.name.charAt(0) : 'U'}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white leading-snug">
                          {currentBooking.muthawwif?.name || 'Ustadz Dr. Muhammad Faisal, Lc.'}
                        </h4>
                        <p className="text-xs text-emerald-200 mt-0.5">
                          {currentBooking.muthawwif?.title || 'Pembimbing Resmi Wisata Islami Kareem'}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-emerald-100/80 leading-relaxed">
                      Siap membimbing manasik, memandu thawaf dan sa’i, serta mendampingi ziarah jejak Rasulullah ﷺ di Tanah Suci.
                    </p>

                    <a
                      href={`https://wa.me/62${(currentBooking.muthawwif?.phone || '081288997711').replace(/\D/g, '')}?text=Assalamu'alaikum%20Ustadz,%20saya%20jamaah%20Wisata%20Islami%20Kareem%20kode%20${currentBooking.bookingCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
                    >
                      <Phone className="w-4 h-4" />
                      Hubungi Ustadz via WhatsApp
                    </a>
                  </div>

                  {/* Customer Service Card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Layanan Jamaah & Customer Care
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Butuh bantuan seputar perlengkapan, jadwal manasik, atau perubahan data anggota rombongan?
                    </p>
                    <div className="space-y-2 pt-1">
                      <a
                        href="https://wa.me/6281234567890?text=Halo%20Admin%20Wisata%20Islami%20Kareem,%20saya%20ingin%20konsultasi%20data%20jamaah"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-700" />
                        WhatsApp Support 24 Jam
                      </a>
                    </div>
                  </div>

                  {/* Quick Shortcut into Tawaf / Manasik */}
                  <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-3xl space-y-3">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                      <RotateCw className="w-4 h-4 text-amber-600" />
                      <span>Smart Counter Tawaf & Sa'i</span>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Gunakan penghitung putaran tawaf dan sa’i digital yang dilengkapi doa per putaran saat beribadah di Masjidil Haram.
                    </p>
                    <button
                      onClick={() => onNavigateToTab('counter')}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      Buka Counter Tawaf & Sa'i
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: DATA ROMBONGAN & PASPOR */}
            {activeSubTab === 'pilgrims' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Daftar Jamaah & Dokumen Rombongan
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Data identitas sesuai paspor resmi untuk penerbitan e-Visa Saudi & manifes maskapai.
                    </p>
                  </div>

                  <span className="text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-xl">
                    Total: {currentBooking.pilgrims.length} Jamaah
                  </span>
                </div>

                <div className="space-y-6">
                  {currentBooking.pilgrims.map((plg, idx) => (
                    <div 
                      key={plg.id}
                      className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-slate-50/50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="text-sm font-extrabold text-slate-900">
                              {plg.fullName}
                            </h4>
                            <p className="text-xs text-slate-500">
                              {plg.gender === 'L' ? 'Laki-laki' : 'Perempuan'} • Lahir: {plg.birthDate || '-'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-slate-200 text-slate-800 font-mono font-bold px-2 py-1 rounded">
                            Ukuran Ihram/Batik: {plg.clothSize}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-slate-400 font-medium block">Nomor e-KTP (NIK):</span>
                          <span className="font-mono font-bold text-slate-800">{plg.nikKtp || '-'}</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-slate-400 font-medium block">Nomor Paspor:</span>
                          <span className="font-mono font-bold text-emerald-900">{plg.passportNumber || '-'}</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-slate-400 font-medium block">Masa Berlaku Paspor:</span>
                          <span className="font-mono font-bold text-slate-800">{plg.passportExpiry || '-'}</span>
                        </div>
                      </div>

                      {/* Documents Section for this pilgrim */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-700">
                            Dokumen Persyaratan ({plg.documents?.length || 0})
                          </span>
                          <button
                            onClick={() => setDocUploadModalPilgrim({ pilgrimId: plg.id, name: plg.fullName })}
                            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
                          >
                            <UploadCloud className="w-3.5 h-3.5" />
                            + Unggah Dokumen Tambahan
                          </button>
                        </div>

                        {plg.documents && plg.documents.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {plg.documents.map((doc) => (
                              <div 
                                key={doc.id}
                                className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                              >
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                  <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                                  <div className="overflow-hidden">
                                    <p className="font-bold text-slate-900 truncate">{doc.title}</p>
                                    <p className="text-[11px] text-slate-400 truncate">{doc.fileName}</p>
                                  </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                                  doc.verificationStatus === 'Terverifikasi'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : doc.verificationStatus === 'Perlu Perbaikan'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {doc.verificationStatus}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">
                            Belum ada dokumen yang diunggah. Silakan klik tombol "Unggah Dokumen Tambahan".
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB 3: PEMBAYARAN & TAGIHAN */}
            {activeSubTab === 'payment' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 7 Cols: Invoice & Status */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                      <div>
                        <h3 className="text-lg font-black text-slate-900">
                          Rincian Biaya & Status Pembayaran
                        </h3>
                        <p className="text-xs text-slate-500">Invoice Digital Resmi Wisata Islami Kareem</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-xl ${
                        currentBooking.paymentStatus === 'Lunas'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {currentBooking.paymentStatus}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs sm:text-sm">
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">Paket:</span>
                        <span className="font-bold text-slate-900 text-right">{currentBooking.packageName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">Jumlah Jamaah:</span>
                        <span className="font-bold text-slate-900">{currentBooking.pilgrims.length} Orang ({currentBooking.roomType.toUpperCase()} Room)</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">Total Biaya Paket (IDR):</span>
                        <span className="font-mono font-bold text-slate-900 text-base">
                          Rp {currentBooking.totalPriceIdr.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-emerald-700 font-semibold">Total Pembayaran Masuk:</span>
                        <span className="font-mono font-extrabold text-emerald-800 text-base">
                          Rp {(currentBooking.paidAmountIdr || 0).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 bg-slate-50 p-3 rounded-xl">
                        <span className="text-slate-700 font-bold">Sisa Tagihan Pelunasan:</span>
                        <span className="font-mono font-black text-amber-700 text-base">
                          Rp {Math.max(0, currentBooking.totalPriceIdr - (currentBooking.paidAmountIdr || 0)).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {/* Action button: Upload Bukti Transfer */}
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setPaymentAmountInput(
                            Math.max(0, currentBooking.totalPriceIdr - (currentBooking.paidAmountIdr || 0)).toString()
                          );
                          setUploadProofModalOpen(true);
                        }}
                        className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <UploadCloud className="w-4 h-4" />
                        Konfirmasi Pembayaran / Upload Bukti Transfer
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right 5 Cols: Bank Account Info */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-emerald-950 text-white p-6 rounded-3xl border border-amber-400/30 shadow-md space-y-5">
                    <div>
                      <span className="text-xs text-amber-300 font-bold uppercase tracking-wider block">
                        Rekening Resmi Biro Travel
                      </span>
                      <h4 className="text-base font-black text-white mt-1">
                        Bank Syariah Indonesia (BSI)
                      </h4>
                    </div>

                    <div className="p-4 bg-emerald-900/80 rounded-2xl border border-amber-400/30 space-y-2">
                      <span className="text-[11px] text-emerald-200 block">Nomor Rekening Giro:</span>
                      <p className="text-xl sm:text-2xl font-mono font-black text-amber-300 tracking-wider">
                        777-8899-001
                      </p>
                      <p className="text-xs text-white font-bold">
                        a.n. PT WISATA ISLAMI KAREEM
                      </p>
                      <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-semibold inline-block">
                        Kantor Pusat Jakarta
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-emerald-200/90 leading-relaxed">
                      <p>
                        💡 <strong>Catatan Transfer:</strong> Cantumkan Kode Booking (<code className="font-mono text-amber-300">{currentBooking.bookingCode}</code>) pada berita transfer untuk verifikasi otomatis yang lebih cepat.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 4: MANASIK & KOPER */}
            {activeSubTab === 'logistics' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 6 Cols: Manasik Schedule */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">
                          Jadwal Manasik Tatap Muka
                        </h3>
                        <p className="text-xs text-slate-500">Bimbingan teori & praktek simulasi umrah</p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium block">Hari & Tanggal:</span>
                        <span className="text-sm font-extrabold text-slate-900">
                          {currentBooking.manasikSchedule?.date 
                            ? new Date(currentBooking.manasikSchedule.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                            : 'Ahad, 04 Oktober 2026'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Waktu:</span>
                        <span className="font-bold text-slate-800">
                          {currentBooking.manasikSchedule?.time || '08:00 - 15:00 WIB (Tepat Waktu)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Tempat:</span>
                        <span className="font-bold text-slate-800">
                          {currentBooking.manasikSchedule?.location || 'Asrama Haji Pondok Gede - Gedung Serbaguna 2'}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-200">
                        <p className="text-slate-600">
                          {currentBooking.manasikSchedule?.notes || 'Harap mengenakan seragam batik resmi dan membawa buku panduan doa yang telah dibagikan.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 6 Cols: Logistics Status */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">
                          Status Perlengkapan Jamaah
                        </h3>
                        <p className="text-xs text-slate-500">Koper, kain ihram, mukena, dan atribut</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { item: 'Koper Fiber 24 Inci & Tas Paspor', status: currentBooking.logisticsStatus?.koper || 'Sudah Diterima' },
                        { item: 'Kain Ihram (Pria) / Mukena & Bergo (Wanita)', status: currentBooking.logisticsStatus?.seragam || 'Sudah Diterima' },
                        { item: 'Buku Doa Saku & ID Card Jamaah', status: currentBooking.logisticsStatus?.bukuDoa || 'Sudah Diterima' },
                        { item: 'Bahan Batik Seragam Eksklusif Kareem', status: 'Sudah Diterima' }
                      ].map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                          <span className="font-semibold text-slate-800">{log.item}</span>
                          <span className={`font-bold px-2.5 py-1 rounded-xl text-[11px] ${
                            log.status === 'Sudah Diterima'
                              ? 'bg-emerald-100 text-emerald-900'
                              : log.status === 'Siap Diambil'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Pengambilan dapat dilakukan di kantor pusat Wisata Islami Kareem atau dikirimkan via jasa kurir ekspedisi ke alamat jamaah.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 5: PANDUAN & BANTUAN */}
            {activeSubTab === 'services' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Layanan & Panduan Ibadah Terpadu
                    </h3>
                    <p className="text-xs text-slate-500">
                      Fitur penunjang kelancaran ibadah haji & umrah Anda di Tanah Suci
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <BookOpen className="w-6 h-6 text-emerald-800" />
                    <h4 className="font-extrabold text-sm text-slate-900">Panduan Manasik & Doa</h4>
                    <p className="text-xs text-slate-500">
                      Urutan rukun, wajib, dan sunnah umrah dilengkapi bacaan doa tulisan Arab, Latin, dan terjemahan.
                    </p>
                    <button
                      onClick={() => onNavigateToTab('manasik')}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
                    >
                      Buka Panduan Manasik →
                    </button>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <RotateCw className="w-6 h-6 text-amber-600" />
                    <h4 className="font-extrabold text-sm text-slate-900">Smart Counter Tawaf</h4>
                    <p className="text-xs text-slate-500">
                      Penghitung 7 putaran Thawaf dan Sa’i dengan getaran & doa mustajab per putaran.
                    </p>
                    <button
                      onClick={() => onNavigateToTab('counter')}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
                    >
                      Buka Smart Counter →
                    </button>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <Package className="w-6 h-6 text-emerald-800" />
                    <h4 className="font-extrabold text-sm text-slate-900">Checklist Koper Umrah</h4>
                    <p className="text-xs text-slate-500">
                      Daftar barang bawaan pakaian, obat-obatan, dan dokumen penting agar tidak ada yang tertinggal.
                    </p>
                    <button
                      onClick={() => onNavigateToTab('checklist')}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
                    >
                      Buka Checklist Koper →
                    </button>
                  </div>
                </div>

                {/* Print E-Voucher */}
                <div className="bg-emerald-950 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="font-extrabold text-sm sm:text-base text-white">
                      E-Voucher & Surat Konfirmasi Pendaftaran
                    </h4>
                    <p className="text-xs text-emerald-200/80">
                      Unduh dan cetak surat tanda bukti registrasi resmi Wisata Islami Kareem berizin Kemenag RI.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateToTab('status')}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-md shrink-0"
                  >
                    <Printer className="w-4 h-4" />
                    Lihat E-Voucher & ID Card
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Upload Bukti Transfer */}
      {uploadProofModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between border-b border-amber-500/30">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base">Konfirmasi Bukti Transfer</h3>
              </div>
              <button 
                onClick={() => setUploadProofModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmPaymentProof} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nominal Transfer (Rp):
                </label>
                <input
                  type="text"
                  value={paymentAmountInput}
                  onChange={(e) => setPaymentAmountInput(e.target.value)}
                  placeholder="Contoh: 10000000"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Pilih Foto / Scan Bukti Transfer:
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProofFileName(file.name);
                      const reader = new FileReader();
                      reader.onload = () => setProofPreviewUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                  required
                />
              </div>

              {proofPreviewUrl && (
                <div className="p-2 border border-slate-200 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 font-semibold block mb-1">Pratinjau Bukti:</span>
                  <img src={proofPreviewUrl} alt="Bukti Transfer" className="h-32 object-contain mx-auto rounded" />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Catatan Pembayaran (Opsional):
                </label>
                <input
                  type="text"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="Contoh: Transfer via Mobile Banking BSI atas nama Fauzan"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUploadProofModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Kirim Bukti Pembayaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Upload Dokumen Tambahan Jamaah */}
      {docUploadModalPilgrim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between border-b border-amber-500/30">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base">Unggah Berkas Jamaah</h3>
              </div>
              <button 
                onClick={() => setDocUploadModalPilgrim(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDocument} className="p-6 space-y-4">
              <p className="text-xs text-slate-500">
                Jamaah: <strong>{docUploadModalPilgrim.name}</strong>
              </p>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Jenis Dokumen:
                </label>
                <select
                  value={newDocType}
                  onChange={(e) => {
                    const t = e.target.value as PilgrimDocument['type'];
                    setNewDocType(t);
                    if (t === 'passport') setNewDocTitle('Scan Paspor Asli');
                    else if (t === 'ktp') setNewDocTitle('Foto e-KTP Asli');
                    else if (t === 'vaccine') setNewDocTitle('Sertifikat Vaksin Meningitis');
                    else if (t === 'family_card') setNewDocTitle('Kartu Keluarga / Buku Nikah');
                    else setNewDocTitle('Dokumen Pendukung Lainnya');
                  }}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="passport">Scan / Foto Paspor Asli</option>
                  <option value="ktp">Foto e-KTP Asli</option>
                  <option value="vaccine">Sertifikat Vaksin Meningitis (Buku Kuning)</option>
                  <option value="family_card">Kartu Keluarga (KK) / Buku Nikah</option>
                  <option value="other">Dokumen Lainnya (Pasfoto 4x6 latar putih, dll)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Pilih File (JPG, PNG, atau PDF):
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewDocFileName(file.name);
                      const reader = new FileReader();
                      reader.onload = () => setNewDocFileUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDocUploadModalPilgrim(null)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Simpan Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
