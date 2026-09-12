import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Award, 
  CheckCircle2,
  Heart
} from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onOpenBooking }) => {
  return (
    <footer className="bg-emerald-950 text-slate-300 pt-14 pb-8 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-emerald-900/80">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-amber-400/40 overflow-hidden shadow-md shrink-0 flex items-center justify-center">
                <img 
                  src="/logo-kareem.jpg" 
                  alt="Logo Wisata Islami Kareem" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-lg font-extrabold text-white tracking-tight">WISATA ISLAMI KAREEM</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold uppercase ml-1.5">Travel</span>
                <p className="text-[11px] text-emerald-300 font-serif">سياحة إسلامي كريم</p>
              </div>
            </div>

            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Biro Penyelenggara Perjalanan Ibadah Umrah (PPIU) dan Haji Khusus resmi berizin Kementerian Agama Republik Indonesia dengan komitmen pelayanan prima dan bimbingan ibadah sesuai Sunnah.
            </p>

            <div className="pt-1 text-xs text-amber-300 font-semibold space-y-1">
              <p>• SK Kemenag RI No. PPIU 912/2021</p>
              <p>• Akreditasi "A" BAN PPIU</p>
              <p>• Anggota Resmi AMPHURI & IATA</p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Layanan & Portal Khusus</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigateTab('portal-jamaah')} className="text-amber-300 font-bold hover:underline flex items-center gap-1 transition-colors">
                  🕌 Portal Jamaah (Self-Service)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('portal-travel')} className="text-emerald-300 font-bold hover:underline flex items-center gap-1 transition-colors">
                  🏢 Portal Travel (Admin PPIU)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('paket')} className="hover:text-amber-300 transition-colors">
                  Katalog Paket Umrah 2026 / 2027
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('kalkulator')} className="hover:text-amber-300 transition-colors">
                  Kalkulator Simulasi Biaya Jamaah
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('manasik')} className="hover:text-amber-300 transition-colors">
                  Panduan Manasik & Kumpulan Doa Umrah
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('counter')} className="hover:text-amber-300 transition-colors">
                  Smart Digital Counter Thawaf & Sa’i
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('checklist')} className="hover:text-amber-300 transition-colors">
                  Checklist Barang Bawaan Koper
                </button>
              </li>
            </ul>
          </div>

          {/* Kantor Layanan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Kantor Operasional</h4>
            <div className="space-y-3 text-xs text-emerald-200/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Kantor Pusat Jakarta:</strong><br />
                  Gedung Menara Menara Maktour Lt. 5, Jl. TB Simatupang No. 18, Cilandak, Jakarta Selatan
                </span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Kantor Cabang Madinah:</strong><br />
                  Northern Central Area, Bada’ah District, Madinah Al-Munawwarah, KSA
                </span>
              </div>
            </div>
          </div>

          {/* Kontak & Hotline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Kontak & Bantuan 24/7</h4>
            <div className="space-y-2.5 text-xs text-emerald-200/80">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Hotline: (021) 789-2233 / 0812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Email: info@alharamaintravel.co.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Jam Kerja: Senin - Sabtu 08.00 - 17.00 WIB</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenBooking}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-emerald-950 font-bold text-xs rounded-xl transition-transform active:scale-95 shadow-md"
                >
                  Daftar Sekarang Online
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-emerald-300/70">
          <p>© 2026 PT Wisata Islami Kareem Tour & Travel (سياحة إسلامي كريم). Seluruh Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Amanah & Terpercaya
            </span>
            <span>•</span>
            <span>Syarat & Ketentuan</span>
            <span>•</span>
            <span>Kebijakan Privasi Jamaah</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
