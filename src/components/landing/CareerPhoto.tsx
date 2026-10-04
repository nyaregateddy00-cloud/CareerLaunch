import React from 'react';
import { CareerPhotoSource } from './careerPhotos';

interface CareerPhotoProps {
  photo: CareerPhotoSource;
  className?: string;
  imageClassName?: string;
  loading?: 'eager' | 'lazy';
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

const photoUrl = (imageId: string, width: number, height: number, quality: number) =>
  `https://images.unsplash.com/${imageId}?fit=crop&crop=faces&fm=webp&q=${quality}&w=${width}&h=${height}`;

export const CareerPhoto: React.FC<CareerPhotoProps> = ({
  photo,
  className = '',
  imageClassName = '',
  loading = 'lazy',
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
  quality = 78,
}) => (
  <figure className={`min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 ${className}`}>
    <img
      src={photoUrl(photo.imageId, 960, 600, quality)}
      srcSet={[480, 768, 960, 1440].map((width) => `${photoUrl(photo.imageId, width, Math.round(width * 0.625), quality)} ${width}w`).join(', ')}
      sizes={sizes}
      alt={photo.alt}
      width={960}
      height={600}
      loading={priority ? 'eager' : loading}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={`block aspect-[8/5] h-auto w-full object-cover object-center ${imageClassName}`}
    />
  </figure>
);
