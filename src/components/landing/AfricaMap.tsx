import React from 'react';
import { Link } from 'react-router-dom';
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

export const AfricaMap: React.FC = () => (
  <div className="africa-map-card rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900 sm:p-6">
    <div className="mb-3 flex items-center justify-between gap-3 px-1">
      <div>
        <p className="text-sm font-bold text-slate-900 dark:text-white">One continent. Many possibilities.</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Illustrative regional view; highlighted locations are not live opportunity counts.</p>
      </div>
      <span className="hidden items-center gap-1.5 rounded-full bg-brand-green-50 px-3 py-1.5 text-xs font-semibold text-brand-green-800 dark:bg-brand-green-950/60 dark:text-brand-green-300 sm:inline-flex">
        <span className="h-2 w-2 rounded-full bg-brand-green-500" aria-hidden="true" /> Africa-first
      </span>
    </div>
    <figure className="overflow-hidden rounded-2xl bg-white">
      <img
        src="/africa-career-network.jpeg"
        alt="Map of Africa with network connections and highlighted locations in Egypt, Nigeria, Ghana, Uganda, Rwanda, Kenya, Tanzania, and South Africa."
        width={1312}
        height={1198}
        loading="lazy"
        decoding="async"
        className="mx-auto block h-auto w-full max-w-[44rem] object-contain"
      />
      <figcaption className="sr-only">Illustrative map of several African countries.</figcaption>
    </figure>
    <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-slate-100 pt-4 dark:border-slate-800 sm:grid-cols-4" aria-label="Countries shown in the illustration">
      {locations.map(({ city, country }) => (
        <li key={city}>
          <Link to={`/opportunities?country=${encodeURIComponent(country)}`} className="inline-flex rounded-lg px-1 py-1 text-left text-[11px] font-medium text-slate-600 transition-colors hover:bg-brand-green-50 hover:text-brand-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-500 dark:text-slate-300 dark:hover:bg-brand-green-950/40 dark:hover:text-white" aria-label={`Explore opportunities in ${country}`}>
            <MapPin className="mr-1 inline h-3 w-3 shrink-0 text-brand-green-600" aria-hidden="true" />{city}, {country}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
