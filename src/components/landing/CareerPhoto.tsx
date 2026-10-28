import React, { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { CareerPhotoSource } from './careerPhotos';

interface CareerPhotoProps {
  photo: CareerPhotoSource;
  className?: string;
  imageClassName?: string;
  loading?: 'eager' | 'lazy';
  priority?: boolean;
  sizes?: string;
  aspectRatio?: '8/5' | '16/10';
}

const widths = [480, 768, 960, 1440] as const;
const photoUrl = (asset: string, width: number) => `/assets/career/${asset}-${width}.webp`;

export const CareerPhoto: React.FC<CareerPhotoProps> = ({
  photo,
  className = '',
  imageClassName = '',
  loading = 'lazy',
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
  aspectRatio = '8/5',
}) => {
  const [failed, setFailed] = useState(false);
  const selectedWidth = 960;

  useEffect(() => setFailed(false), [photo.asset]);

  return (
    <figure className={`relative ${aspectRatio === '16/10' ? 'aspect-[16/10]' : 'aspect-[8/5]'} min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-card dark:border-white/[0.08] dark:bg-[#111111] ${className}`}>
      {failed ? (
        <div role="img" aria-label={photo.alt} className="grid h-full w-full place-items-center bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          <span className="inline-flex items-center gap-2 text-xs font-medium"><ImageOff className="h-4 w-4" aria-hidden="true" />Photo unavailable</span>
        </div>
      ) : (
        <img
          src={photoUrl(photo.asset, selectedWidth)}
          srcSet={widths.map((width) => `${photoUrl(photo.asset, width)} ${width}w`).join(', ')}
          sizes={sizes}
          alt={photo.alt}
          width={selectedWidth}
          height={Math.round(selectedWidth * 0.625)}
          loading={priority ? 'eager' : loading}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onError={() => setFailed(true)}
          className={`absolute inset-0 block h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02] ${imageClassName}`}
        />
      )}
    </figure>
  );
};
