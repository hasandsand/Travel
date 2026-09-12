import React, { useState } from 'react';
import { 
  Compass, 
  PhoneCall, 
  Menu, 
  X, 
  CheckCircle2, 
  Calculator, 
  BookOpen, 
  CheckSquare, 
  Search,
  RotateCw,
  User,
  Building2,
  Sparkles
} from 'lucide-react';
import { HeaderCurrencyWidget } from './HeaderCurrencyWidget';
import { LiveExchangeRates } from '../services/currencyService';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
  onCheckStatus: () => void;
  rates: LiveExchangeRates | null;
  isLoadingRates: boolean;
  onRefreshRates: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBooking,
  onCheckStatus,
  rates,
  isLoadingRates,
  onRefreshRates
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'paket', label: 'Paket Umrah', icon: Compass },
    { id: 'kalkulator', label: 'Kalkulator Biaya', icon: Calculator },
    { id: 'manasik', label: 'Panduan & Doa', icon: BookOpen },
    { id: 'counter', label: 'Smart Counter Tawaf', icon: RotateCw },
    { id: 'checklist', label: 'Checklist Jamaah', icon: CheckSquare },
  ];

  const isJamaahPortal = activeTab === 'portal-jamaah';
  const isTravelPortal = activeTab === 'portal-travel';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      {/* Top Bar with PPIU License, Portal Switcher & Live Financial Currency info */}
      <div className="bg-emerald-950 text-white text-xs px-4 py-1.5 font-medium border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-emerald-800/80 text-amber-300 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide">
              <CheckCircle2 className="w-3 h-3 text-amber-400" />
              Izin Resmi Kemenag RI No. PPIU 912/2021
            </span>
            <span className="hidden sm:inline text-emerald-200">|</span>
            <span className="hidden md:inline text-emerald-200">Akreditasi "A" • 5 Pasti Umrah</span>
          </div>

          {/* Quick Portal Switcher Pills in Top Header */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              id="btn-switch-portal-jamaah"
              onClick={() => setActiveTab('portal-jamaah')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                isJamaahPortal 
                  ? 'bg-amber-400 text-emerald-950 shadow-sm' 
                  : 'bg-emerald-900/80 text-amber-200 hover:bg-emerald-800 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" />
              <span>Portal Jamaah</span>
            </button>

            <button
              id="btn-switch-portal-travel"
              onClick={() => setActiveTab('portal-travel')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                isTravelPortal 
                  ? 'bg-amber-400 text-emerald-950 shadow-sm' 
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Portal Travel (Admin)</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-emerald-200">
            {/* Real-time Currency Converter Widget */}
            <HeaderCurrencyWidget
              rates={rates}
              isLoading={isLoadingRates}
              onRefresh={onRefreshRates}
            />

            <span className="text-emerald-800">|</span>
            <a 
              href="https://wa.me/6281234567890?text=Assalamu%27alaikum%20Admin%20Travel%20Umrah,%20saya%20ingin%20konsultasi%20paket%20umrah" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-medium transition-colors"
            >
              <PhoneCall className="w-3 h-3" />
              Hotline: 0812-3456-7890
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo Brand */}
          <div 
            onClick={() => setActiveTab('paket')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="app-brand-logo"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-amber-400/40 overflow-hidden shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
              <img 
                src="/logo-kareem.jpg" 
                alt="Logo Wisata Islami Kareem" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black text-emerald-950 tracking-tight">WISATA ISLAMI KAREEM</span>
                <span className="hidden sm:inline-block text-[10px] bg-amber-100 text-amber-900 border border-amber-300/60 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  سياحة كريم
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                <span>Biro Perjalanan Haji Khusus & Umrah</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-semibold font-serif text-[12px]">سياحة إسلامي كريم</span>
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              id="btn-nav-portal-jamaah-desktop"
              onClick={() => setActiveTab('portal-jamaah')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                isJamaahPortal
                  ? 'bg-emerald-900 text-amber-300 border-emerald-950 shadow-sm'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border-emerald-200'
              }`}
            >
              <User className="w-3.5 h-3.5 text-amber-500" />
              <span>Portal Jamaah</span>
            </button>

            <button
              id="btn-nav-portal-travel-desktop"
              onClick={() => setActiveTab('portal-travel')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                isTravelPortal
                  ? 'bg-slate-900 text-amber-400 border-slate-950 shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Portal Travel</span>
            </button>

            <button
              id="btn-nav-daftar-sekarang"
              onClick={onOpenBooking}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-black text-emerald-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-lg shadow-xs shadow-amber-900/10 transition-all transform active:scale-95 ml-1"
            >
              Daftar Umrah
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-emerald-900 hover:bg-slate-100 rounded-lg"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 shadow-lg space-y-3 animate-in slide-in-from-top-2 duration-200">
          
          {/* Mobile Portals Highlight */}
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
            <button
              onClick={() => {
                setActiveTab('portal-jamaah');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-extrabold border transition-colors ${
                isJamaahPortal ? 'bg-emerald-900 text-amber-300 border-emerald-950' : 'bg-emerald-50 text-emerald-900 border-emerald-200'
              }`}
            >
              <User className="w-4 h-4 text-amber-500" />
              Portal Jamaah
            </button>

            <button
              onClick={() => {
                setActiveTab('portal-travel');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-extrabold border transition-colors ${
                isTravelPortal ? 'bg-slate-900 text-amber-400 border-slate-950' : 'bg-slate-100 text-slate-800 border-slate-300'
              }`}
            >
              <Building2 className="w-4 h-4 text-slate-600" />
              Portal Travel
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-left transition-colors ${
                    isActive
                      ? 'bg-emerald-800 text-white'
                      : 'text-slate-700 hover:bg-emerald-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenBooking();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-black text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs"
            >
              Daftar Paket Umrah Sekarang
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
