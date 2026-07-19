import { useEffect } from 'react';
import { initGA, usePageTracking } from '../lib/analytics';

// Component to initialize GA and track page views
export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const delayInit = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => initGA(), { timeout: 2000 });
      } else {
        setTimeout(initGA, 1500);
      }
    };
    delayInit();
  }, []);

  // Track page views on route changes
  usePageTracking();

  return <>{children}</>;
};
