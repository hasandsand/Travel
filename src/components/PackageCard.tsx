import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plane, 
  Star, 
  Users, 
  Check, 
  ChevronRight,
  Flame
} from 'lucide-react';
import { UmrahPackage } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';

interface PackageCardProps {
  pkg: UmrahPackage;
  onSelectDetail: (pkg: UmrahPackage) => void;
  onBookNow: (pkg: UmrahPackage) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  onSelectDetail,
  onBookNow
}) => {
  const isAlmostFull = pkg.quotaRemaining <= 5;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Card Header Image */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={pkg.imageUrl}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="bg-amber-400 text-emerald-950 text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
            {pkg.badge}
          </span>
          <span className="bg-emerald-900/90 text-emerald-100 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-300" />
            {pkg.durationDays} Hari
          </span>
        </div>

        {/* Quota warning */}
        <div className="absolute top-3 right-3">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm ${
            isAlmostFull 
              ? 'bg-rose-600 text-white animate-pulse' 
              : 'bg-emerald-700 text-white'
          }`}>
            {isAlmostFull && <Flame className="w-3 h-3" />}
            Sisa {pkg.quotaRemaining} Seat
          </span>
        </div>

        {/* Bottom overlay info: Departure Date */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Berangkat: {formatDateIndo(pkg.departureDate)}</span>
          </div>
          <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded backdrop-blur-xs">
            Dari {pkg.departureCity}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
            {pkg.name}
          </h3>

          {/* Key Specs: Flight & Hotels */}
          <div className="mt-3.5 space-y-2 text-xs border-y border-slate-100 py-3">
            {/* Airline */}
            <div className="flex items-center justify-between text-slate-700">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-semibold">{pkg.airline.name}</span>
                <span className="text-slate-400">({pkg.airline.code})</span>
              </div>
              <span className="text-[11px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200/60">
                {pkg.airline.flightType}
              </span>
            </div>

            {/* Hotel Makkah */}
            <div className="flex items-start gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-slate-900">{pkg.hotelMakkah.name}</span>
                  <div className="flex items-center text-amber-500">
                    {[...Array(pkg.hotelMakkah.stars)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">{pkg.hotelMakkah.distance}</p>
              </div>
            </div>

            {/* Hotel Madinah */}
            <div className="flex items-start gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-slate-900">{pkg.hotelMadinah.name}</span>
                  <div className="flex items-center text-amber-500">
                    {[...Array(pkg.hotelMadinah.stars)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">{pkg.hotelMadinah.distance}</p>
              </div>
            </div>
          </div>

          {/* Key Inclusions bullets */}
          <div className="mt-3 space-y-1 text-xs text-slate-600">
            {pkg.highlights.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="line-clamp-1">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">
                Mulai Dari (Quad / Ber-4)
              </span>
              <div className="text-xl font-extrabold text-emerald-900">
                {formatRupiah(pkg.priceQuad)}
                <span className="text-xs font-normal text-slate-500 ml-1">/ pax</span>
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-500">
              <span className="flex items-center gap-1 justify-end">
                <Users className="w-3 h-3 text-slate-400" />
                Double: {formatRupiah(pkg.priceDouble)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelectDetail(pkg)}
              className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              Detail & Rute
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onBookNow(pkg)}
              className="w-full py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1"
            >
              Pesan Seat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
