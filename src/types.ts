export type PackageCategory = 'all' | 'reguler' | 'vip' | 'plus' | 'ramadhan';

export type RoomType = 'quad' | 'triple' | 'double';

export interface PackageCostBreakdown {
  tiketPesawatPerPax: number;      // Biaya tiket pesawat PP per jamaah
  visaTasrehPerPax: number;        // Biaya visa umrah, tasreh raudhah, asuransi Saudi
  hotelMakkahPerPax: number;       // Alokasi hotel Makkah per jamaah (rata-rata quad)
  hotelMadinahPerPax: number;      // Alokasi hotel Madinah per jamaah (rata-rata quad)
  busTransportPerPax: number;      // Transportasi bus & kereta cepat per jamaah
  handlingPerlengkapanPerPax: number; // Koper, seragam, handling bandara Soetta & Saudi
  cateringPerPax: number;          // Makan 3x sehari fullboard
  muthawwifTourLeaderPerPax: number; // Fee muthawwif, guide lokal & tour leader
  operationalTravelPerPax: number; // Biaya operasional travel, manasik, & overhead
}

export interface ItineraryDay {
  day: number;
  title: string;
  city: string;
  activities: string[];
}

export interface UmrahPackage {
  id: string;
  name: string;
  category: 'reguler' | 'vip' | 'plus' | 'ramadhan';
  badge: string;
  durationDays: number;
  departureDate: string;
  returnDate: string;
  departureCity: string;
  airline: {
    name: string;
    code: string;
    flightType: 'Langsung (Direct)' | 'Transit';
  };
  hotelMakkah: {
    name: string;
    stars: number;
    distance: string;
  };
  hotelMadinah: {
    name: string;
    stars: number;
    distance: string;
  };
  priceQuad: number;
  priceTriple: number;
  priceDouble: number;
  costBreakdown?: PackageCostBreakdown;
  quotaTotal: number;
  quotaRemaining: number;
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  imageUrl: string;
  highlights: string[];
}

export interface PilgrimDocument {
  id: string;
  type: 'passport' | 'ktp' | 'vaccine' | 'family_card' | 'other';
  title: string;
  fileName: string;
  fileSize: number; // bytes
  fileUrl: string; // data URL or mock URL
  uploadedAt: string;
  verificationStatus: 'Menunggu Verifikasi' | 'Terverifikasi' | 'Perlu Perbaikan';
}

export interface Pilgrim {
  id: string;
  fullName: string;
  nikKtp: string;
  passportNumber: string;
  passportExpiry: string;
  gender: 'L' | 'P';
  birthDate: string;
  clothSize: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  phone: string;
  documents?: PilgrimDocument[];
}

export interface BookingRecord {
  bookingCode: string;
  createdAt: string;
  packageId: string;
  packageName: string;
  departureDate: string;
  roomType: RoomType;
  pilgrims: Pilgrim[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  totalPriceIdr: number;
  totalPriceSar: number;
  status: 'Pendaftaran Diterima' | 'Verifikasi Dokumen' | 'Penerbitan Visa' | 'Siap Berangkat';
  paymentStatus: 'Menunggu DP' | 'DP Terverifikasi' | 'Lunas';
  paidAmountIdr?: number;
  paymentProofUrl?: string;
  paymentProofName?: string;
  notes?: string;
  adminNotes?: string;
  muthawwif?: {
    name: string;
    phone: string;
    title: string;
  };
  logisticsStatus?: {
    koper: 'Belum Diambil' | 'Siap Diambil' | 'Sudah Diterima';
    seragam: 'Belum Diambil' | 'Siap Diambil' | 'Sudah Diterima';
    bukuDoa: 'Belum Diambil' | 'Siap Diambil' | 'Sudah Diterima';
  };
  manasikSchedule?: {
    date: string;
    time: string;
    location: string;
    notes?: string;
  };
  flightNumber?: string;
  pnrCode?: string;
  visaNumber?: string;
}

export type PortalView = 'public' | 'jamaah' | 'travel';

export interface TravelAnnouncement {
  id: string;
  title: string;
  category: 'Manasik' | 'Penerbangan' | 'Logistik' | 'Penting';
  date: string;
  content: string;
  badge?: string;
}

export interface ManasikStep {
  id: string;
  stepNumber: number;
  title: string;
  arabicTitle: string;
  category: 'Rukun Umrah' | 'Wajib Umrah' | 'Sunnah Umrah';
  location: string;
  description: string;
  doaArab?: string;
  doaLatin?: string;
  doaArti?: string;
  guidelines: string[];
}

export interface PackingItem {
  id: string;
  category: 'Dokumen & Finansial' | 'Pakaian & Busana Ihram' | 'Kesehatan & Pribadi' | 'Ibadah & Doa' | 'Aksesoris & Elektronik';
  title: string;
  description: string;
  isMandatory: boolean;
  checked: boolean;
}
