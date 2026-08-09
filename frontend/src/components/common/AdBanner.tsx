import React, { useEffect, useRef, useState } from 'react';

interface AdBannerProps {
  className?: string;
  slot?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ className = '', slot = '4205729070' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [showSlot, setShowSlot] = useState(false);

  useEffect(() => {
    const isScriptReady = () => {
      const adsbygoogle = (window as any).adsbygoogle;
      return !!adsbygoogle && adsbygoogle.loaded === true;
    };

    if (isScriptReady()) {
      setShowSlot(true);
      return;
    }

    let waited = 0;
    const waitTimer = window.setInterval(() => {
      waited += 1;
      if (isScriptReady()) {
        window.clearInterval(waitTimer);
        setShowSlot(true);
      } else if (waited >= 40) {
        window.clearInterval(waitTimer);
      }
    }, 250);

    return () => window.clearInterval(waitTimer);
  }, []);

  useEffect(() => {
    if (!showSlot) return;

    const container = containerRef.current;
    const ins = insRef.current;
    if (!container || !ins) return;

    const disposeFns: Array<() => void> = [];

    const pushAd = () => {
      if (pushed.current) return;
      try {
        const adsbygoogle = (window as any).adsbygoogle;
        if (!adsbygoogle || typeof adsbygoogle.push !== 'function') return;
        adsbygoogle.push({});
        pushed.current = true;
      } catch {
        return;
      }

      // Collapse si el slot no logra llenarse (ad blocked / sin inventario)
      let checks = 0;
      const interval = window.setInterval(() => {
        checks += 1;
        const iframe = ins.querySelector('iframe');
        const hasContent =
          !!iframe &&
          iframe.getBoundingClientRect().height > 0 &&
          !!iframe.contentDocument &&
          !!iframe.contentDocument.body &&
          iframe.contentDocument.body.childElementCount > 0;
        if (hasContent) {
          window.clearInterval(interval);
        } else if (checks >= 25) {
          window.clearInterval(interval);
          setShowSlot(false);
        }
      }, 400);
      disposeFns.push(() => window.clearInterval(interval));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            pushAd();
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(container);
    disposeFns.push(() => observer.disconnect());

    return () => {
      disposeFns.forEach((dispose) => dispose());
    };
  }, [showSlot]);

  if (!showSlot) {
    return null;
  }

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <ins
        ref={insRef}
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