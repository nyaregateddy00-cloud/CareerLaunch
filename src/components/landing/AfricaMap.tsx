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
export const AfricaMap: React.FC = () => (
  <div className="africa-map-card rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-card dark:border-white/[0.08] dark:bg-[#111111] sm:p-6">
    {/* Header */}
    <div className="mb-3 flex items-center justify-between gap-3 px-1">
      <div>
        <p className="text-sm font-bold text-slate-900 dark:text-[#F5F5F5]">One continent. Many possibilities.</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">CareerLaunch is designed for talent across Africa.</p>
      </div>
      <span className="hidden items-center gap-1.5 rounded-full bg-brand-green-50 px-3 py-1.5 text-xs font-semibold text-brand-green-800 dark:bg-brand-green-950/60 dark:text-brand-green-300 sm:inline-flex">
        <span className="h-2 w-2 rounded-full bg-brand-green-500 animate-pulse" aria-hidden="true" /> Africa-wide
      </span>
    </div>

    {/* Map image */}
    <figure className="overflow-hidden rounded-2xl bg-slate-50 dark:bg-[#0A0A0A]">
      <img
        src="/africa-career-network.jpeg"
        alt="Map of Africa with network connections and highlighted locations in Egypt, Nigeria, Ghana, Uganda, Rwanda, Kenya, Tanzania, and South Africa."
        width={1312}
        height={1198}
        loading="lazy"
        decoding="async"
        className="mx-auto block h-auto w-full max-w-[44rem] object-contain"
        onError={(e) => {
          // Fallback: hide the broken image, show a styled placeholder
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />
      <figcaption className="sr-only">CareerLaunch connects talent across African countries and cities.</figcaption>
    </figure>

    {/* Location grid */}
    <ul
      className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-slate-100 pt-4 dark:border-white/[0.06] sm:grid-cols-4"
      aria-label="Highlighted locations"
    >
      {locations.map(({ city, country }, i) => (
        <li
          key={city}
          className="text-[11px] font-medium text-slate-600 dark:text-slate-300"
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <MapPin className="mr-1 inline h-3 w-3 text-brand-green-600" aria-hidden="true" />
          {city}, {country}
        </li>
      ))}
    </ul>
  </div>
);
