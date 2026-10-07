import React, { useEffect, useRef, useState } from 'react';

const motionVideo = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260723_145606_ab143199-b593-4941-bb1b-9afca215416b.mp4';

/** Decorative background motion is deferred until the hero is visible and skipped on mobile or reduced-motion devices. */
export const HeroMotionBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const updatePreference = () => {
      const allowed = media.matches && !connection?.saveData && 'IntersectionObserver' in window;
      setMotionAllowed(allowed);
      if (!allowed) {
        setEnabled(false);
        setVisible(false);
      }
    };

    updatePreference();
    media.addEventListener('change', updatePreference);
    window.addEventListener('resize', updatePreference);
    return () => {
      media.removeEventListener('change', updatePreference);
      window.removeEventListener('resize', updatePreference);
    };
  }, []);

  useEffect(() => {
    if (!motionAllowed) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [motionAllowed]);

  useEffect(() => {
    if (!visible) {
      videoRef.current?.pause();
      return;
    }
    const timeout = window.setTimeout(() => setEnabled(true), 900);
    return () => window.clearTimeout(timeout);
  }, [visible]);

  useEffect(() => {
    if (!visible || !enabled) {
      videoRef.current?.pause();
      return;
    }
    void videoRef.current?.play().catch(() => undefined);
  }, [enabled, visible]);

  return (
    <div ref={containerRef} className="landing-hero-video-wrap pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {enabled && motionAllowed && (
        <video
          ref={videoRef}
          className="landing-hero-video absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
        >
          <source src={motionVideo} type="video/mp4" />
        </video>
      )}
    </div>
  );
};
