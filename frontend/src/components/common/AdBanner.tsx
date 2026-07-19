import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
  slot?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ className = '', slot = '4205729070' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const tryPushAd = () => {
      if (pushed.current) return;
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        if (typeof adsbygoogle.push === 'function') {
          adsbygoogle.push({});
          pushed.current = true;
        }
      } catch (e) {
        // AdSense not loaded yet
      }
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tryPushAd();
            observerRef.current?.disconnect();
          }
        });
      },
      { rootMargin: '100px' }
    );

    observerRef.current.observe(el);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key="-6w+ed+2i-1n-4w"
        data-ad-client="ca-pub-8488238206685791"
        data-ad-slot={slot}
      />
    </div>
  );
};

export default AdBanner;
