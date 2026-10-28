import React, { useEffect, useState } from 'react';

interface AvatarProps {
  name: string;
  src?: string | null;
  alt?: string;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
}

const initialsFor = (name: string) => name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'CL';

/** Shows a user-provided photo when present, otherwise a neutral initials avatar. */
export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  alt = '',
  className = '',
  imageClassName = '',
  fallbackClassName = '',
}) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  return (
    <span
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={`relative inline-grid shrink-0 place-items-center overflow-hidden rounded-xl bg-brand-blue-50 text-brand-blue-800 dark:bg-slate-800 dark:text-brand-green-300 ${className}`}
    >
      {src && !failed ? (
        <img src={src} alt="" aria-hidden="true" onError={() => setFailed(true)} className={`absolute inset-0 h-full w-full object-cover ${imageClassName}`} />
      ) : (
        <span className={`text-[.62rem] font-bold tracking-wide ${fallbackClassName}`}>{initialsFor(name)}</span>
      )}
    </span>
  );
};
