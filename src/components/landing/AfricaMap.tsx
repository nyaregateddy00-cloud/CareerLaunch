import React from 'react';
import { MapPin } from 'lucide-react';

const locations = [
  { city: 'Cairo', country: 'Egypt' },
  { city: 'Lagos', country: 'Nigeria' },
  { city: 'Accra', country: 'Ghana' },
  { city: 'Kampala', country: 'Uganda' },
  { city: 'Kigali', country: 'Rwanda' },
  { city: 'Nairobi', country: 'Kenya' },
  { city: 'Dar es Salaam', country: 'Tanzania' },
  { city: 'Johannesburg', country: 'South Africa' },
];

/**
 * AfricaMap — renders the official africa-career-network.jpeg asset
 * (provided in public/) inside a premium card layout with animated location pills.
 *
 * Falls back gracefully if the image fails to load.
 */
export const AfricaMap: React.FC = () => {
  const [activeCity, setActiveCity] = React.useState<string | null>(null);

  return (
    <div className="africa-map-card rounded-[1.75rem] cinematic-glass p-5 shadow-hero dark:border-white/[0.09] dark:bg-[#0d0d0d]/90 sm:p-7 relative overflow-hidden group">
      {/* Subtle ambient corner glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full bg-brand-green-500/10 blur-2xl dark:bg-brand-green-400/15" aria-hidden="true" />

      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3 px-1">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[.18em] text-brand-green-700 dark:text-brand-green-400">Pan-African Career Network</span>
          <p className="text-base font-extrabold text-slate-900 dark:text-[#F5F5F5]">One continent. Limitless possibilities.</p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">CareerLaunch connects talent across 8 major African hubs and beyond.</p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full bg-brand-green-50 px-3.5 py-1.5 text-xs font-semibold text-brand-green-800 dark:bg-brand-green-950/60 dark:text-brand-green-300 sm:inline-flex border border-brand-green-200/60 dark:border-brand-green-800/40">
          <span className="h-2 w-2 rounded-full bg-brand-green-500 animate-pulse" aria-hidden="true" /> 8 Key Hubs
        </span>
      </div>

      {/* Map image with interactive frame */}
      <figure className="relative overflow-hidden rounded-2xl bg-slate-900/5 dark:bg-[#050505] border border-slate-100 dark:border-white/[0.06] p-2 transition-all duration-300 group-hover:border-brand-green-500/20">
        <img
          src="/africa-career-network.jpeg"
          alt="Map of Africa with network connections and highlighted locations in Egypt, Nigeria, Ghana, Uganda, Rwanda, Kenya, Tanzania, and South Africa."
          width={1312}
          height={1198}
          loading="lazy"
          decoding="async"
          className="mx-auto block h-auto w-full max-w-[44rem] object-contain transition-transform duration-500 group-hover:scale-[1.01]"
          onError={(e) => {
            // Fallback: hide the broken image, show a styled placeholder
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
        <figcaption className="sr-only">CareerLaunch connects talent across African countries and cities.</figcaption>
      </figure>

      {/* Location grid with interactive pill highlight */}
      <div className="mt-4 border-t border-slate-100 pt-4 dark:border-white/[0.06]">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Connected Innovation Hubs</p>
        <ul
          className="grid grid-cols-2 gap-2 sm:grid-cols-4"
          aria-label="Highlighted locations"
        >
          {locations.map(({ city, country }, i) => {
            const isHovered = activeCity === city;
            return (
              <li
                key={city}
                onMouseEnter={() => setActiveCity(city)}
                onMouseLeave={() => setActiveCity(null)}
                className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 flex items-center ${
                  isHovered
                    ? 'bg-brand-green-500/10 text-brand-green-700 dark:text-brand-green-300 font-semibold translate-x-0.5'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-white/[0.04]'
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <MapPin
                  className={`mr-1.5 inline h-3 w-3 shrink-0 transition-transform ${
                    isHovered ? 'text-brand-green-500 scale-125' : 'text-brand-green-600 dark:text-brand-green-400'
                  }`}
                  aria-hidden="true"
                />
                <span className="truncate">{city}, <span className="opacity-75">{country}</span></span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
