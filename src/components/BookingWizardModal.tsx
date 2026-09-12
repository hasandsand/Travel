import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  User, 
  Users, 
  Phone, 
  Mail, 
  CreditCard, 
  Calendar, 
  ShieldCheck, 
  Printer, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  FileCheck,
  UploadCloud,
  FileText,
  AlertCircle
} from 'lucide-react';
import { UmrahPackage, RoomType, Pilgrim, BookingRecord, PilgrimDocument } from '../types';
import { formatRupiah, formatSar, formatDateIndo } from '../utils/formatters';
import { KURS_SAR_TO_IDR } from '../data/umrahData';
import { DocumentUploadZone } from './DocumentUploadZone';

interface BookingWizardModalProps {
  isOpen: boolean;
  selectedPackage: UmrahPackage | null;
  packages: UmrahPackage[];
  onClose: () => void;
  onBookingSuccess: (booking: BookingRecord) => void;
}

export const BookingWizardModal: React.FC<BookingWizardModalProps> = ({
  isOpen,
  selectedPackage,
  packages,
  onClose,
  onBookingSuccess
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activePackageId, setActivePackageId] = useState<string>(selectedPackage?.id || packages[0]?.id || '');
  const [roomType, setRoomType] = useState<RoomType>('quad');
  const [pilgrimCount, setPilgrimCount] = useState<number>(2);
  const [activeDocPilgrimIndex, setActiveDocPilgrimIndex] = useState<number>(0);

  // Pilgrims list
  const [pilgrims, setPilgrims] = useState<Pilgrim[]>([
    {
      id: '1',
      fullName: '',
      nikKtp: '',
      passportNumber: '',
      passportExpiry: '',
      gender: 'L',
      birthDate: '',
      clothSize: 'L',
      phone: '',
      documents: []
    },
    {
      id: '2',
      fullName: '',
      nikKtp: '',
      passportNumber: '',
      passportExpiry: '',
      gender: 'P',
      birthDate: '',
      clothSize: 'M',
      phone: '',
      documents: []
    }
  ]);

  // Contact person
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  // Result state
  const [createdBooking, setCreatedBooking] = useState<BookingRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const currentPkg = packages.find(p => p.id === activePackageId) || packages[0];

  const getPricePerPax = () => {
    if (roomType === 'quad') return currentPkg.priceQuad;
    if (roomType === 'triple') return currentPkg.priceTriple;
    return currentPkg.priceDouble;
  };

  const totalPrice = getPricePerPax() * pilgrimCount;
  const totalSar = Math.round(totalPrice / KURS_SAR_TO_IDR);
  const downPayment = pilgrimCount * 5000000; // DP Rp 5 Juta / orang

  // Handle pilgrim count change
  const handlePilgrimCountChange = (count: number) => {
    setPilgrimCount(count);
    const updated = [...pilgrims];
    if (count > updated.length) {
      for (let i = updated.length; i < count; i++) {
        updated.push({
          id: String(i + 1),
          fullName: '',
          nikKtp: '',
          passportNumber: '',
          passportExpiry: '',
          gender: i % 2 === 0 ? 'L' : 'P',
          birthDate: '',
          clothSize: 'L',
          phone: '',
          documents: []
        });
      }
    } else {
      updated.splice(count);
    }
    setPilgrims(updated);
    if (activeDocPilgrimIndex >= count) {
      setActiveDocPilgrimIndex(0);
    }
  };

  const updatePilgrim = (index: number, field: keyof Pilgrim, value: string) => {
    const updated = [...pilgrims];
    updated[index] = { ...updated[index], [field]: value };
    setPilgrims(updated);
  };

  const handleAddDocument = (pilgrimIndex: number, doc: PilgrimDocument) => {
    const updated = [...pilgrims];
    const existingDocs = updated[pilgrimIndex].documents || [];
    // Replace if same document type exists or append
    const filtered = existingDocs.filter(d => d.type !== doc.type);
    updated[pilgrimIndex] = {
      ...updated[pilgrimIndex],
      documents: [...filtered, doc]
    };
    setPilgrims(updated);
  };

  const handleRemoveDocument = (pilgrimIndex: number, docId: string) => {
    const updated = [...pilgrims];
    const existingDocs = updated[pilgrimIndex].documents || [];
    updated[pilgrimIndex] = {
      ...updated[pilgrimIndex],
      documents: existingDocs.filter(d => d.id !== docId)
    };
    setPilgrims(updated);
  };

  const handleFinishBooking = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `UMR-${new Date().getFullYear()}-${randomSuffix}`;
    const newRecord: BookingRecord = {
      bookingCode,
      createdAt: new Date().toISOString().split('T')[0],
      packageId: currentPkg.id,
      packageName: currentPkg.name,
      departureDate: currentPkg.departureDate,
      roomType,
      pilgrims,
      contactName: contactName || pilgrims[0]?.fullName || 'Jamaah',
      contactEmail: contactEmail || 'jamaah@travel.com',
      contactPhone: contactPhone || pilgrims[0]?.phone || '08123456789',
      totalPriceIdr: totalPrice,
      totalPriceSar: totalSar,
      status: 'Pendaftaran Diterima',
      paymentStatus: 'Menunggu DP',
      notes: specialNotes
    };

    setCreatedBooking(newRecord);
    onBookingSuccess(newRecord);
    setCurrentStep(5);
  };

  const copyBookingCode = () => {
    if (createdBooking) {
      navigator.clipboard.writeText(createdBooking.bookingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Count total uploaded documents across all pilgrims
  const totalUploadedDocs = pilgrims.reduce((acc, p) => acc + (p.documents?.length || 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-emerald-950 text-white p-5 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-400/40 overflow-hidden shrink-0 flex items-center justify-center">
              <img src="/logo-kareem.jpg" alt="Logo Wisata Islami Kareem" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider block">
                Wisata Islami Kareem • Registrasi Jamaah
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white">
                {currentStep === 5 ? 'Bukti Pendaftaran Berhasil' : 'Pemesanan Paket & Administrasi Dokumen'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-emerald-900/80 text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
            aria-label="Tutup Formulir"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps indicator (1 to 4) */}
        {currentStep < 5 && (
          <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 text-[11px] sm:text-xs overflow-x-auto">
            <div className={`flex items-center gap-1.5 whitespace-nowrap ${currentStep >= 1 ? 'text-emerald-800 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 1 ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
              <span>Paket & Kamar</span>
            </div>
            <span className="text-slate-300 mx-1">──</span>
            <div className={`flex items-center gap-1.5 whitespace-nowrap ${currentStep >= 2 ? 'text-emerald-800 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 2 ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
              <span>Data Jamaah</span>
            </div>
            <span className="text-slate-300 mx-1">──</span>
            <div className={`flex items-center gap-1.5 whitespace-nowrap ${currentStep >= 3 ? 'text-emerald-800 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 3 ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
              <span className="flex items-center gap-1">
                Unggah Dokumen
                {totalUploadedDocs > 0 && (
                  <span className="bg-amber-400 text-emerald-950 px-1 rounded-full text-[9px] font-black">
                    {totalUploadedDocs}
                  </span>
                )}
              </span>
            </div>
            <span className="text-slate-300 mx-1">──</span>
            <div className={`flex items-center gap-1.5 whitespace-nowrap ${currentStep >= 4 ? 'text-emerald-800 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 4 ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-600'}`}>4</span>
              <span>Kontak & Invoice</span>
            </div>
          </div>
        )}

        {/* Form Body Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          {/* STEP 1: PILIH PAKET, KAMAR & JUMLAH JAMAAH */}
          {currentStep === 1 && (
            <div className="space-y-5">
              {/* Select Package */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Pilih Paket Umrah
                </label>
                <select
                  value={activePackageId}
                  onChange={(e) => setActivePackageId(e.target.value)}
                  className="w-full text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                >
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} • {formatDateIndo(p.departureDate)} (Sisa {p.quotaRemaining} Seat)
                    </option>
                  ))}
                </select>
              </div>

              {/* Pilgrim Count selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Jumlah Jamaah yang Didaftarkan
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handlePilgrimCountChange(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        pilgrimCount === num
                          ? 'bg-emerald-800 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {num} Orang
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Pilihan Tipe Kamar
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setRoomType('quad')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                      roomType === 'quad'
                        ? 'border-emerald-700 bg-emerald-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">Quad (Ber-4)</span>
                      <Users className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div className="text-sm font-black text-emerald-950">
                      {formatRupiah(currentPkg.priceQuad)}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">4 bed single per kamar</p>
                  </div>

                  <div
                    onClick={() => setRoomType('triple')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                      roomType === 'triple'
                        ? 'border-emerald-700 bg-emerald-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">Triple (Ber-3)</span>
                      <Users className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-sm font-black text-slate-900">
                      {formatRupiah(currentPkg.priceTriple)}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">3 bed per kamar</p>
                  </div>

                  <div
                    onClick={() => setRoomType('double')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                      roomType === 'double'
                        ? 'border-emerald-700 bg-emerald-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">Double (Ber-2)</span>
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-sm font-black text-slate-900">
                      {formatRupiah(currentPkg.priceDouble)}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">2 bed (suami istri / privat)</p>
                  </div>
                </div>
              </div>

              {/* Cost Preview Box */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Total Estimasi ({pilgrimCount} Jamaah):</span>
                  <div className="text-xl sm:text-2xl font-black text-amber-300">
                    {formatRupiah(totalPrice)}
                  </div>
                  <span className="text-xs text-emerald-300">Setara {formatSar(totalSar)}</span>
                </div>
                <div className="text-right text-xs text-slate-300">
                  <p>Deposit DP: <strong className="text-white">{formatRupiah(downPayment)}</strong></p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Pelunasan H-30 keberangkatan</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DATA JAMAAH */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <p className="text-xs text-slate-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                ⚠️ Pastikan penulisan <strong>Nama Lengkap</strong> sesuai dengan buku Paspor (minimal 2-3 suku kata) atau KTP asli jika belum memiliki paspor.
              </p>

              {pilgrims.map((pilgrim, idx) => (
                <div key={pilgrim.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-emerald-700" />
                      Jamaah #{idx + 1}
                    </span>
                    <span className="text-[11px] bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded">
                      {idx === 0 ? 'Ketua Rombongan / Jamaah Utama' : 'Anggota Jamaah'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Lengkap (Sesuai Paspor) *</label>
                      <input
                        type="text"
                        placeholder="Contoh: AHMAD FAUZAN"
                        value={pilgrim.fullName}
                        onChange={(e) => updatePilgrim(idx, 'fullName', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none uppercase"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NIK KTP (16 Digit) *</label>
                      <input
                        type="text"
                        maxLength={16}
                        placeholder="Contoh: 3171021405820001"
                        value={pilgrim.nikKtp}
                        onChange={(e) => updatePilgrim(idx, 'nikKtp', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nomor Paspor (Bila sudah ada)</label>
                      <input
                        type="text"
                        placeholder="Contoh: C8912344"
                        value={pilgrim.passportNumber}
                        onChange={(e) => updatePilgrim(idx, 'passportNumber', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none uppercase"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => updatePilgrim(idx, 'gender', 'L')}
                          className={`py-2 rounded-lg font-bold transition-colors ${
                            pilgrim.gender === 'L' ? 'bg-emerald-800 text-white' : 'bg-white border border-slate-300 text-slate-700'
                          }`}
                        >
                          Laki-Laki
                        </button>
                        <button
                          type="button"
                          onClick={() => updatePilgrim(idx, 'gender', 'P')}
                          className={`py-2 rounded-lg font-bold transition-colors ${
                            pilgrim.gender === 'P' ? 'bg-emerald-800 text-white' : 'bg-white border border-slate-300 text-slate-700'
                          }`}
                        >
                          Perempuan
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Ukuran Seragam / Batik Umrah</label>
                      <select
                        value={pilgrim.clothSize}
                        onChange={(e) => updatePilgrim(idx, 'clothSize', e.target.value as 'S' | 'M' | 'L' | 'XL' | 'XXL')}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      >
                        <option value="S">Ukuran S (Small)</option>
                        <option value="M">Ukuran M (Medium)</option>
                        <option value="L">Ukuran L (Large)</option>
                        <option value="XL">Ukuran XL (Extra Large)</option>
                        <option value="XXL">Ukuran XXL (Double Extra Large)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp / Kontak</label>
                      <input
                        type="tel"
                        placeholder="Contoh: 081298765432"
                        value={pilgrim.phone}
                        onChange={(e) => updatePilgrim(idx, 'phone', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: UNGGAH DOKUMEN PERSYARATAN (PASPOR, KTP, DLL) */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Informative Guidance Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">
                    Sistem Unggah Dokumen Administrasi Umrah
                  </h4>
                  <p className="text-emerald-900/90 mt-1 leading-relaxed">
                    Unggah scan / foto <strong>Paspor Asli</strong> dan <strong>e-KTP</strong> untuk setiap jamaah yang didaftarkan. Dokumen yang diunggah secara digital akan langsung diverifikasi oleh tim biro untuk penerbitan e-Visa Umrah Saudi & Siskopatuh Kemenag RI, memangkas antrean verifikasi manual.
                  </p>
                </div>
              </div>

              {/* Pilgrim Tab Switcher (if more than 1 pilgrim) */}
              {pilgrims.length > 1 && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Pilih Jamaah untuk Mengunggah Berkas:
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {pilgrims.map((plg, pIdx) => {
                      const isActive = activeDocPilgrimIndex === pIdx;
                      const docCount = plg.documents?.length || 0;
                      const hasPassport = plg.documents?.some(d => d.type === 'passport');
                      const hasKtp = plg.documents?.some(d => d.type === 'ktp');
                      const isComplete = hasPassport && hasKtp;

                      return (
                        <button
                          key={plg.id}
                          type="button"
                          onClick={() => setActiveDocPilgrimIndex(pIdx)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
                            isActive
                              ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                            isActive ? 'bg-amber-400 text-emerald-950' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {pIdx + 1}
                          </span>
                          <span>{plg.fullName || `Jamaah #${pIdx + 1}`}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            isComplete 
                              ? 'bg-emerald-100 text-emerald-900 font-bold' 
                              : docCount > 0 
                              ? 'bg-amber-100 text-amber-900' 
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            {docCount} Dokumen
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Active Pilgrim Document Upload Zone */}
              <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-4 sm:p-5">
                <DocumentUploadZone
                  pilgrim={pilgrims[activeDocPilgrimIndex] || pilgrims[0]}
                  pilgrimIndex={activeDocPilgrimIndex}
                  onAddDocument={handleAddDocument}
                  onRemoveDocument={handleRemoveDocument}
                />
              </div>

              {/* Total Documents Summary Across All Pilgrims */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>
                    Total Dokumen Terkumpul: <strong className="text-slate-900">{totalUploadedDocs} Berkas</strong> dari {pilgrims.length} Jamaah
                  </span>
                </div>
                <span className="text-[11px] text-emerald-800 font-semibold">
                  {totalUploadedDocs >= pilgrims.length * 2 ? '✓ Lengkap Paspor & KTP' : 'Bisa dilengkapi sekarang atau disusulkan'}
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: KONTAK PEMESAN & INVOICE */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-700" />
                  Informasi Kontak Pemesan / Penanggung Jawab
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Kontak</label>
                    <input
                      type="text"
                      placeholder="Nama Anda"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp Aktif</label>
                    <input
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Email Penerima E-Ticket / Invoice</label>
                    <input
                      type="email"
                      placeholder="nama@email.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan (Permintaan Khusus)</label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Membawa jamaah lansia membutuhkan kursi roda, makanan diet khusus, dll."
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Summary Breakdown */}
              <div className="border-2 border-emerald-800/40 rounded-2xl p-5 bg-white space-y-3 text-xs">
                <h4 className="font-extrabold text-emerald-950 text-sm">Rincian Pemesanan & Berkas</h4>
                <div className="space-y-1.5 text-slate-600 border-b border-slate-100 pb-3">
                  <div className="flex justify-between">
                    <span>Paket:</span>
                    <strong className="text-slate-900">{currentPkg.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Keberangkatan:</span>
                    <span className="text-slate-900">{formatDateIndo(currentPkg.departureDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kategori Kamar:</span>
                    <span className="text-slate-900 capitalize">Kamar {roomType} ({pilgrimCount} Orang)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Harga per Jamaah:</span>
                    <span>{formatRupiah(getPricePerPax())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dokumen Paspor & KTP:</span>
                    <span className="text-emerald-800 font-bold">{totalUploadedDocs} Dokumen Terlampir</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-1">
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold block">Total Tagihan</span>
                    <div className="text-2xl font-black text-emerald-950">{formatRupiah(totalPrice)}</div>
                    <span className="text-slate-500">({formatSar(totalSar)})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 font-semibold block">Uang Muka (DP) Cukup</span>
                    <div className="text-lg font-bold text-amber-700">{formatRupiah(downPayment)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: RESULT / E-VOUCHER TICKET */}
          {currentStep === 5 && createdBooking && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="bg-emerald-900 text-white rounded-2xl p-6 text-center space-y-3 relative overflow-hidden">
                <div className="w-14 h-14 bg-amber-400 text-emerald-950 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black">Alhamdulillah, Pendaftaran Berhasil!</h4>
                <p className="text-xs text-emerald-200 max-w-md mx-auto">
                  Data Anda dan berkas dokumen persyaratan telah terdaftar dalam sistem administrasi manifest Umrah. Simpan kode booking Anda untuk pengecekan status visa.
                </p>

                {/* Booking Code Box */}
                <div className="bg-emerald-950/80 border border-amber-400/50 rounded-xl p-3 max-w-sm mx-auto flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] text-amber-300 uppercase tracking-widest block">KODE BOOKING REGISTRASI</span>
                    <span className="text-lg font-mono font-bold text-white">{createdBooking.bookingCode}</span>
                  </div>
                  <button
                    onClick={copyBookingCode}
                    className="p-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedCode ? 'Tersalin' : 'Salin'}
                  </button>
                </div>
              </div>

              {/* Status Berkas Notice */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs space-y-2">
                <h5 className="font-bold text-emerald-950 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Status Administrasi Berkas ({totalUploadedDocs} Dokumen Terdaftar)
                </h5>
                <p className="text-slate-600">
                  Tim administrasi biro perjalanan akan segera memvalidasi kesesuaian nama paspor dan NIK KTP Anda untuk proses penerbitan e-Visa Umrah Saudi dan asuransi perjalanan.
                </p>
              </div>

              {/* Payment Instruction */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 text-xs space-y-3">
                <h5 className="font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  Instruksi Pembayaran DP (Rekening Resmi Travel Umrah)
                </h5>
                <p className="text-slate-600">
                  Silakan transfer Uang Muka (DP) sebesar <strong className="text-emerald-900">{formatRupiah(pilgrimCount * 5000000)}</strong> ke rekening atas nama biro resmi:
                </p>

                <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 font-medium">Bank Syariah Indonesia (BSI)</span>
                    <p className="font-mono font-bold text-base text-slate-900 tracking-wider">777-8899-001</p>
                    <p className="text-slate-500">a.n. PT WISATA ISLAMI KAREEM</p>
                  </div>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded">
                    BSI Syariah
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="w-full sm:flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Bukti Pendaftaran (PDF)
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Selesai & Tutup
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Step Actions */}
        {currentStep < 5 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200 font-semibold text-xs transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Kembali
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200 font-semibold text-xs transition-colors"
              >
                Batal
              </button>
            )}

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1"
              >
                Lanjut ke Langkah {currentStep + 1}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishBooking}
                className="px-7 py-2.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-emerald-950 font-extrabold text-xs rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
              >
                Konfirmasi & Terbitkan Booking
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
