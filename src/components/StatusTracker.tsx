import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Plane, 
  User, 
  Printer, 
  MapPin, 
  ShieldCheck, 
  QrCode, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { BookingRecord } from '../types';
import { DEMO_BOOKINGS } from '../data/umrahData';
import { formatRupiah, formatDateIndo } from '../utils/formatters';

interface StatusTrackerProps {
  bookings: BookingRecord[];
  initialBookingCode?: string;
  onClose?: () => void;
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({
  bookings,
  initialBookingCode = ''
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialBookingCode || 'UMR-2026-8941');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(() => {
    const allList = [...bookings, ...DEMO_BOOKINGS];
    if (initialBookingCode) {
      return allList.find(b => b.bookingCode.toUpperCase() === initialBookingCode.toUpperCase()) || allList[0];
    }
    return allList[0] || null;
  });
  const [copied, setCopied] = useState(false);

  const allBookings = [...bookings, ...DEMO_BOOKINGS];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    const found = allBookings.find(b => b.bookingCode.toUpperCase() === query || b.contactPhone === query || b.contactEmail.toUpperCase() === query);
    if (found) {
      setSelectedBooking(found);
    } else {
      alert(`Data pemesanan dengan kode "${searchQuery}" tidak ditemukan. Silakan periksa kembali kode booking Anda.`);
    }
  };

  const stepsList = [
    { title: 'Pendaftaran Diterima', desc: 'Registrasi online manifest & DP terkonfirmasi' },
    { title: 'Verifikasi Dokumen', desc: 'Pengecekan fisik paspor asli & sertifikat vaksin' },
    { title: 'Penerbitan Visa', desc: 'E-Visa Umrah Saudi & Tasreh Raudhah diterbitkan' },
    { title: 'Siap Berangkat', desc: 'Manasik selesai, koper dibagikan & siap terbang' }
  ];

  const getStepIndex = (status: BookingRecord['status']) => {
    switch (status) {
      case 'Pendaftaran Diterima': return 0;
      case 'Verifikasi Dokumen': return 1;
      case 'Penerbitan Visa': return 2;
      case 'Siap Berangkat': return 3;
      default: return 0;
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3.5 py-1 rounded-full text-xs font-bold">
          <Search className="w-3.5 h-3.5 text-emerald-700" />
          Pengecekan Status Registrasi & Dokumen
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Cek Status Keberangkatan & E-Voucher Umrah
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Pantau progres pengurusan visa, verifikasi paspor, jadwal manasik, dan unduh bukti pendaftaran resmi Anda secara real-time.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Masukkan Kode Booking (Contoh: UMR-2026-8941 atau nomor WhatsApp)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-700 focus:outline-none uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-xs shrink-0 flex items-center justify-center gap-2"
          >
            Lacak Status
          </button>
        </form>

        {/* Demo suggestions */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Contoh Kode Demo:</span>
          {allBookings.slice(0, 3).map((b) => (
            <button
              key={b.bookingCode}
              type="button"
              onClick={() => {
                setSearchQuery(b.bookingCode);
                setSelectedBooking(b);
              }}
              className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 px-2 py-1 rounded-md font-mono text-[11px] font-bold transition-colors"
            >
              {b.bookingCode}
            </button>
          ))}
        </div>
      </div>

      {/* Booking Details Card if Found */}
      {selectedBooking ? (
        <div className="space-y-6">
          {/* Status Timeline Roadmap */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold uppercase block">KODE BOOKING</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl font-mono font-black text-emerald-950">
                    {selectedBooking.bookingCode}
                  </span>
                  <button
                    onClick={() => copyCode(selectedBooking.bookingCode)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded"
                    title="Salin Kode"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-500 font-semibold uppercase block">STATUS KEBERANGKATAN</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full font-bold text-xs mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  {selectedBooking.status}
                </span>
              </div>
            </div>

            {/* Stepper Progress Visualizer */}
            <div className="relative pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {stepsList.map((step, idx) => {
                  const currentIdx = getStepIndex(selectedBooking.status);
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div
                      key={step.title}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'border-emerald-700 bg-emerald-50/70 shadow-xs'
                          : isDone
                          ? 'border-emerald-300 bg-white'
                          : 'border-slate-200 bg-slate-50/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                          isDone ? 'bg-emerald-800 text-white' : 'bg-slate-300 text-slate-700'
                        }`}>
                          {idx + 1}
                        </span>
                        {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-normal">{step.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Official E-Voucher Print View */}
          <div className="bg-white border-2 border-emerald-950/20 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 print:border-none print:shadow-none">
            {/* E-Voucher Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-dashed border-slate-200 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-amber-400/40 overflow-hidden shrink-0 flex items-center justify-center">
                  <img src="/logo-kareem.jpg" alt="Wisata Islami Kareem" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">WISATA ISLAMI KAREEM</h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Surat Konfirmasi Registrasi Jamaah (E-Voucher) • سياحة إسلامي كريم • Kemenag RI PPIU No. 912/2021
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors print:hidden"
                >
                  <Printer className="w-4 h-4" />
                  Cetak E-Voucher
                </button>
                <div className="hidden sm:block p-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <QrCode className="w-10 h-10 text-slate-800 mx-auto" />
                  <span className="text-[9px] font-mono text-slate-400 block mt-0.5">VERIFIED-PPIU</span>
                </div>
              </div>
            </div>

            {/* Program & Schedule Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 text-[11px] block">Nama Paket</span>
                <strong className="text-slate-900 block mt-0.5">{selectedBooking.packageName}</strong>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 text-[11px] block">Tanggal Keberangkatan</span>
                <strong className="text-emerald-900 block mt-0.5">{formatDateIndo(selectedBooking.departureDate)}</strong>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 text-[11px] block">Tipe Kamar</span>
                <strong className="text-slate-900 block mt-0.5 capitalize">Kamar {selectedBooking.roomType}</strong>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 text-[11px] block">Status Pembayaran</span>
                <strong className={`block mt-0.5 font-extrabold ${
                  selectedBooking.paymentStatus === 'Lunas' ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {selectedBooking.paymentStatus}
                </strong>
              </div>
            </div>

            {/* List of Registered Pilgrims */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-700" />
                Manifest Nama Jamaah Terdaftar ({selectedBooking.pilgrims.length} Orang)
              </h4>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="p-3">No</th>
                      <th className="p-3">Nama Lengkap</th>
                      <th className="p-3">No. Paspor / KTP</th>
                      <th className="p-3">Gender</th>
                      <th className="p-3">Ukuran Seragam</th>
                      <th className="p-3">Status Dokumen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {selectedBooking.pilgrims.map((plg, i) => {
                      const docs = plg.documents || [];
                      const hasPassport = docs.some(d => d.type === 'passport');
                      const hasKtp = docs.some(d => d.type === 'ktp');

                      return (
                        <tr key={plg.id || i} className="hover:bg-slate-50/50">
                          <td className="p-3 font-semibold text-slate-500">{i + 1}</td>
                          <td className="p-3 font-bold text-slate-900 uppercase">{plg.fullName || 'Nama Jamaah'}</td>
                          <td className="p-3 font-mono">{plg.passportNumber || plg.nikKtp || '-'}</td>
                          <td className="p-3">{plg.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</td>
                          <td className="p-3">
                            <span className="bg-slate-100 px-2 py-0.5 rounded font-bold">{plg.clothSize || 'L'}</span>
                          </td>
                          <td className="p-3">
                            {docs.length > 0 ? (
                              <div className="flex flex-wrap items-center gap-1">
                                {hasPassport && (
                                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                    Paspor
                                  </span>
                                )}
                                {hasKtp && (
                                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                    KTP
                                  </span>
                                )}
                                {docs.length > (hasPassport ? 1 : 0) + (hasKtp ? 1 : 0) && (
                                  <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-1.5 py-0.5 rounded">
                                    +{docs.length - ((hasPassport ? 1 : 0) + (hasKtp ? 1 : 0))} berkas
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                                Belum Lengkap
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes & Emergency Muthawwif Hotline */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <p className="font-bold">Informasi Briefing Keberangkatan & Manasik:</p>
                <p className="text-[11px] text-amber-900 mt-0.5">
                  {selectedBooking.notes || 'Manasik Akbar dilaksanakan 2 pekan sebelum tanggal keberangkatan. Koper dan seragam dikirim ke alamat pemesan.'}
                </p>
              </div>

              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shrink-0 transition-colors"
              >
                Hubungi Muthawwif Pendamping
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">Belum Ada Data Booking Terpilih</h4>
          <p className="text-xs max-w-sm mx-auto">
            Masukkan kode booking registrasi umrah Anda pada kolom pencarian di atas untuk melacak status dokumen dan tiket keberangkatan.
          </p>
        </div>
      )}
    </div>
  );
};
