import React, { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';

interface FallbackImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  loading?: 'eager' | 'lazy';
}

/** Preserves the image's layout and shows a neutral fallback if a supplied URL fails. */
export const FallbackImage: React.FC<FallbackImageProps> = ({
  src,
  alt,
  className = '',
  imageClassName = '',
  fallbackClassName = '',
  loading = 'lazy',
}) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <span role="img" aria-label={alt || undefined} aria-hidden={alt ? undefined : true} className={`inline-grid place-items-center ${className} ${fallbackClassName}`}>
        <ImageOff className="h-5 w-5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
      </span>
    );
  }

  return <img src={src} alt={alt} loading={loading} decoding="async" onError={() => setFailed(true)} className={imageClassName || className} />;
};
