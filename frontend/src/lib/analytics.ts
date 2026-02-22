import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics 4 Configuration
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined') return;
  
  // Check if GA is already initialized
  if (window.gtag) return;

  // Load GA script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(...args: any[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // We'll handle page views manually
    cookie_flags: 'SameSite=None;Secure',
    cookie_domain: 'auto',
  });
};

// Track page views
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', 'page_view', {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location]);
};

// Track custom events
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, eventParams);
};

// Predefined events for RedMecánica
export const AnalyticsEvents = {
  // Service Request Events
  SERVICE_REQUEST_STARTED: 'service_request_started',
  SERVICE_REQUEST_COMPLETED: 'service_request_completed',
  SERVICE_SELECTED: 'service_selected',
  PROVIDER_SELECTED: 'provider_selected',
  QUOTE_ACCEPTED: 'quote_accepted',
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_COMPLETED: 'payment_completed',
  
  // User Registration Events
  PROVIDER_REGISTRATION_STARTED: 'provider_registration_started',
  PROVIDER_REGISTRATION_COMPLETED: 'provider_registration_completed',
  USER_SIGNUP_STARTED: 'user_signup_started',
  USER_SIGNUP_COMPLETED: 'user_signup_completed',
  
  // Engagement Events
  SEARCH_PERFORMED: 'search_performed',
  TRIAGE_COMPLETED: 'triage_completed',
  AI_ASSISTANT_USED: 'ai_assistant_used',
  VISUAL_ESTIMATOR_USED: 'visual_estimator_used',
  
  // Plan Events
  PLAN_SELECTED: 'plan_selected',
  PLAN_UPGRADED: 'plan_upgraded',
  
  // Contact Events
  WHATSAPP_CLICKED: 'whatsapp_clicked',
  PHONE_CLICKED: 'phone_clicked',
  EMAIL_CLICKED: 'email_clicked',
  
  // FAQ Events
  FAQ_EXPANDED: 'faq_expanded',
  FAQ_CATEGORY_CHANGED: 'faq_category_changed',
};

// Type definitions for window
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
