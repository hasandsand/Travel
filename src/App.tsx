import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Calculator, 
  BookOpen, 
  RotateCw, 
  CheckSquare, 
  Search, 
  HelpCircle,
  PhoneCall,
  CheckCircle2,
  Calendar,
  Sparkles,
  User,
  Building2,
  ArrowRight
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { PackageCard } from './components/PackageCard';
import { PackageDetailModal } from './components/PackageDetailModal';
import { BookingWizardModal } from './components/BookingWizardModal';
import { CostCalculator } from './components/CostCalculator';
import { ManasikGuide } from './components/ManasikGuide';
import { TawafSaiCounter } from './components/TawafSaiCounter';
import { PackingChecklist } from './components/PackingChecklist';
import { StatusTracker } from './components/StatusTracker';
import { PortalJamaah } from './components/PortalJamaah';
import { PortalTravel } from './components/PortalTravel';
import { Footer } from './components/Footer';
import { UMRAH_PACKAGES, DEMO_BOOKINGS, DEFAULT_ANNOUNCEMENTS } from './data/umrahData';
import { UmrahPackage, PackageCategory, BookingRecord, RoomType, TravelAnnouncement } from './types';
import { LiveExchangeRates, fetchLiveExchangeRates } from './services/currencyService';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('paket');
  
  // Real-time exchange rate state from financial API
  const [exchangeRates, setExchangeRates] = useState<LiveExchangeRates | null>(null);
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(true);

  // Packages state (allows travel admin to update quota)
  const [packagesState, setPackagesState] = useState<UmrahPackage[]>(UMRAH_PACKAGES);

  // Announcements state for Travel & Jamaah
  const [announcements, setAnnouncements] = useState<TravelAnnouncement[]>(() => {
    try {
      const saved = localStorage.getItem('kareem_announcements');
      return saved ? JSON.parse(saved) : DEFAULT_ANNOUNCEMENTS;
    } catch {
      return DEFAULT_ANNOUNCEMENTS;
    }
  });

  // Package filtering states
  const [selectedCategory, setSelectedCategory] = useState<PackageCategory>('all');
  const [searchMonth, setSearchMonth] = useState<string>('all');
  const [maxBudget, setMaxBudget] = useState<number>(60000000);

  // Selected package for detail modal
  const [detailPackage, setDetailPackage] = useState<UmrahPackage | null>(null);

  // Booking modal state
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [bookingPackage, setBookingPackage] = useState<UmrahPackage | null>(null);

  // Local storage persisted bookings, seeded with realistic DEMO_BOOKINGS
  const [userBookings, setUserBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem('umrah_user_bookings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return DEMO_BOOKINGS;
    } catch {
      return DEMO_BOOKINGS;
    }
  });

  const [activeBookingCodeForStatus, setActiveBookingCodeForStatus] = useState<string>('');

  // Fetch real-time exchange rates on mount
  const loadRates = async () => {
    setIsLoadingRates(true);
    try {
      const data = await fetchLiveExchangeRates();
      setExchangeRates(data);
    } catch (err) {
      console.warn('Gagal memuat kurs real-time:', err);
    } finally {
      setIsLoadingRates(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('umrah_user_bookings', JSON.stringify(userBookings));
    } catch {
      // Storage unavailable
    }
  }, [userBookings]);

  useEffect(() => {
    try {
      localStorage.setItem('kareem_announcements', JSON.stringify(announcements));
    } catch {
      // Storage unavailable
    }
  }, [announcements]);

  // Update a booking record (from Jamaah or Travel Admin)
  const handleUpdateBooking = (updated: BookingRecord) => {
    setUserBookings((prev) => 
      prev.map((b) => (b.bookingCode === updated.bookingCode ? updated : b))
    );
  };

  // Add new booking (from Travel Admin or Wizard)
  const handleAddBooking = (newBooking: BookingRecord) => {
    setUserBookings((prev) => [newBooking, ...prev]);
    setActiveBookingCodeForStatus(newBooking.bookingCode);
  };

  // Update Package Quota (Travel Admin)
  const handleUpdatePackageQuota = (packageId: string, newRemaining: number) => {
    setPackagesState((prev) =>
      prev.map((p) => (p.id === packageId ? { ...p, quotaRemaining: newRemaining } : p))
    );
  };

  // Announcement handlers
  const handleAddAnnouncement = (newAnn: TravelAnnouncement) => {
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // Filter packages based on category, month, and budget
  const filteredPackages = packagesState.filter((pkg) => {
    if (selectedCategory !== 'all' && pkg.category !== selectedCategory) {
      return false;
    }
    if (searchMonth !== 'all' && !pkg.departureDate.startsWith(searchMonth)) {
      return false;
    }
    if (pkg.priceQuad > maxBudget) {
      return false;
    }
    return true;
  });

  const handleOpenBookingForPackage = (pkg: UmrahPackage) => {
    setBookingPackage(pkg);
    setIsBookingOpen(true);
  };

  const handleOpenBookingDefault = () => {
    setBookingPackage(packagesState[0]);
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = (newBooking: BookingRecord) => {
    handleAddBooking(newBooking);
  };

  const handleProceedBookingFromCalculator = (pkg: UmrahPackage, _roomType: RoomType, _pilgrimCount: number) => {
    setBookingPackage(pkg);
    setIsBookingOpen(true);
  };

  const handleOpenCheckStatus = (code?: string) => {
    if (code) {
      setActiveBookingCodeForStatus(code);
    }
    setActiveTab('portal-jamaah');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-200 selection:text-emerald-950">
      {/* Primary Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBooking={handleOpenBookingDefault}
        onCheckStatus={() => handleOpenCheckStatus()}
        rates={exchangeRates}
        isLoadingRates={isLoadingRates}
        onRefreshRates={loadRates}
      />

      {/* Main App Content Body */}
      <main className="flex-1">
        {/* TAB 1: PAKET UMRAH (KATALOG & OVERVIEW) */}
        {activeTab === 'paket' && (
          <div className="space-y-12">
            {/* Hero & Search Banner */}
            <HeroBanner
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchMonth={searchMonth}
              onSearchMonthChange={setSearchMonth}
              maxBudget={maxBudget}
              onMaxBudgetChange={setMaxBudget}
              onOpenBooking={handleOpenBookingDefault}
              onOpenCalculator={() => {
                setActiveTab('kalkulator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Portal Quick Access Cards on Homepage */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Portal Jamaah Callout */}
                <div 
                  onClick={() => {
                    setActiveTab('portal-jamaah');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 border border-amber-400/30 shadow-lg hover:shadow-xl hover:border-amber-400/60 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
                        <User className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3 py-1 rounded-full font-bold">
                        Akses Jamaah Mandiri
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">
                        Portal Jamaah (بوابة المعتمرين)
                      </h3>
                      <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 leading-relaxed">
                        Cek status paspor, unduh e-Visa resmi, jadwal manasik, status koper & seragam, panduan ibadah tawaf & sa’i, serta konfirmasi pembayaran.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-black text-amber-300 group-hover:translate-x-1 transition-transform">
                    <span>Masuk ke Portal Jamaah</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Portal Travel Callout */}
                <div 
                  onClick={() => {
                    setActiveTab('portal-travel');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-lg hover:shadow-xl hover:border-emerald-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
                        Akses Manajemen & Staf
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">
                        Portal Penyelenggara Travel (Admin)
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                        Pusat kendali operasional travel: verifikasi scan paspor/KTP, validasi pembayaran syariah, ekspor manifes Siskopatuh, manajemen kuota seat, dan broadcast pengumuman.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-black text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <span>Masuk ke Portal Penyelenggara</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Packages Grid Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Pilihan Paket Umrah Berkah 1448H / 2026-2027
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Jadwal & Paket Keberangkatan Resmi
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Penerbangan langsung maskapai ternama & hotel berbintang nol meter pelataran masjid.
                  </p>
                </div>

                <span className="text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-xl">
                  Ditemukan {filteredPackages.length} Paket Tersedia
                </span>
              </div>

              {filteredPackages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredPackages.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      pkg={pkg}
                      onSelectDetail={(p) => setDetailPackage(p)}
                      onBookNow={(p) => handleOpenBookingForPackage(p)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                  <p className="text-sm text-slate-500">
                    Tidak ditemukan paket yang sesuai dengan kriteria filter Anda.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchMonth('all');
                      setMaxBudget(60000000);
                    }}
                    className="px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-xl hover:bg-emerald-900 transition-colors"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>

            {/* Quick Feature highlights row */}
            <div className="bg-emerald-950 text-white py-12 border-y border-amber-400/20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-lg mx-auto sm:mx-0">
                    1
                  </div>
                  <h4 className="font-bold text-white text-sm">Pasti Berizin & Terakreditasi</h4>
                  <p className="text-xs text-emerald-200/80 leading-relaxed">
                    Terdaftar di Kementerian Agama RI No. PPIU 912/2021 dengan nilai Akreditasi "A".
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-lg mx-auto sm:mx-0">
                    2
                  </div>
                  <h4 className="font-bold text-white text-sm">Muthawwif Berpengalaman</h4>
                  <p className="text-xs text-emerald-200/80 leading-relaxed">
                    Dibimbing langsung oleh Asatidz lulusan Universitas Islam Madinah & Ummul Qura Makkah.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-lg mx-auto sm:mx-0">
                    3
                  </div>
                  <h4 className="font-bold text-white text-sm">Hotel Dekat & Nol Meter</h4>
                  <p className="text-xs text-emerald-200/80 leading-relaxed">
                    Tinggal turun lift menuju pelataran Ka’bah dan Masjid Nabawi, sangat ramah lansia.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-lg mx-auto sm:mx-0">
                    4
                  </div>
                  <h4 className="font-bold text-white text-sm">Perlengkapan Lengkap</h4>
                  <p className="text-xs text-emerald-200/80 leading-relaxed">
                    Koper fiber 24 inci, kain ihram/mukena premium, tas paspor, dan batik seragam eksklusif.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KALKULATOR BIAYA & SIMULASI */}
        {activeTab === 'kalkulator' && (
          <CostCalculator
            packages={UMRAH_PACKAGES}
            onProceedBooking={handleProceedBookingFromCalculator}
            liveKursSar={exchangeRates?.sarToIdr}
          />
        )}

        {/* TAB 3: PANDUAN MANASIK & DOA */}
        {activeTab === 'manasik' && <ManasikGuide />}

        {/* TAB 4: SMART COUNTER TAWAF & SA'I */}
        {activeTab === 'counter' && <TawafSaiCounter />}

        {/* TAB 5: CHECKLIST PERLENGKAPAN KOPER */}
        {activeTab === 'checklist' && <PackingChecklist />}

        {/* TAB 6: STATUS TRACKER & E-VOUCHER */}
        {activeTab === 'status' && (
          <StatusTracker
            bookings={userBookings}
            initialBookingCode={activeBookingCodeForStatus}
          />
        )}

        {/* TAB 7: PORTAL JAMAAH (PILGRIM PORTAL) */}
        {activeTab === 'portal-jamaah' && (
          <PortalJamaah
            bookings={userBookings}
            packages={packagesState}
            announcements={announcements}
            onUpdateBooking={handleUpdateBooking}
            onOpenBookingWizard={handleOpenBookingDefault}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* TAB 8: PORTAL PENYELENGGARA / TRAVEL (ADMIN PORTAL) */}
        {activeTab === 'portal-travel' && (
          <PortalTravel
            bookings={userBookings}
            packages={packagesState}
            announcements={announcements}
            onUpdateBooking={handleUpdateBooking}
            onAddBooking={handleAddBooking}
            onUpdatePackageQuota={handleUpdatePackageQuota}
            onAddAnnouncement={handleAddAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Package Detail Modal */}
      <PackageDetailModal
        pkg={detailPackage}
        onClose={() => setDetailPackage(null)}
        onBookNow={(pkg) => {
          setDetailPackage(null);
          handleOpenBookingForPackage(pkg);
        }}
      />

      {/* Booking Wizard Modal */}
      <BookingWizardModal
        isOpen={isBookingOpen}
        selectedPackage={bookingPackage}
        packages={UMRAH_PACKAGES}
        onClose={() => setIsBookingOpen(false)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Footer */}
      <Footer
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBooking={handleOpenBookingDefault}
      />
    </div>
  );
}
