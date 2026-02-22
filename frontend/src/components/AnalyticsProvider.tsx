import { useEffect } from 'react';
import { initGA, usePageTracking } from '../lib/analytics';

// Component to initialize GA and track page views
export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    initGA();
  }, []);

  // Track page views on route changes
  usePageTracking();

  return <>{children}</>;
};
