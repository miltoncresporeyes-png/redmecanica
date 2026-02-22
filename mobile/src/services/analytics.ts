import { Platform } from 'react-native';

export type AnalyticsEvent = 
  | 'app_open'
  | 'screen_view'
  | 'user_login'
  | 'user_register'
  | 'user_logout'
  | 'search_performed'
  | 'provider_viewed'
  | 'job_created'
  | 'job_updated'
  | 'quote_received'
  | 'quote_accepted'
  | 'payment_completed'
  | 'error_occurred';

interface AnalyticsParams {
  screen_name?: string;
  user_id?: string;
  provider_id?: string;
  job_id?: string;
  category?: string;
  query?: string;
  error_message?: string;
  [key: string]: string | number | undefined;
}

class AnalyticsService {
  private userId: string | null = null;
  private isEnabled: boolean = __DEV__ === false;

  setUser(userId: string | null) {
    this.userId = userId;
    if (this.isEnabled) {
      this.track('user_identified', { user_id: userId });
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  track(event: AnalyticsEvent, params?: AnalyticsParams) {
    if (!this.isEnabled) return;

    const payload = {
      event,
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
      ...params,
    };

    console.log('[Analytics]', event, payload);
  }

  trackScreen(screenName: string, params?: Record<string, any>) {
    this.track('screen_view', { screen_name: screenName, ...params });
  }

  trackLogin(userId: string) {
    this.track('user_login', { user_id: userId });
  }

  trackRegister(userId: string) {
    this.track('user_register', { user_id: userId });
  }

  trackLogout(userId: string) {
    this.track('user_logout', { user_id: userId });
  }

  trackSearch(query: string, category?: string) {
    this.track('search_performed', { query, category });
  }

  trackProviderView(providerId: string) {
    this.track('provider_viewed', { provider_id: providerId });
  }

  trackJobCreated(jobId: string, category: string) {
    this.track('job_created', { job_id: jobId, category });
  }

  trackJobUpdated(jobId: string, status: string) {
    this.track('job_updated', { job_id: jobId, status });
  }

  trackQuoteReceived(jobId: string) {
    this.track('quote_received', { job_id: jobId });
  }

  trackQuoteAccepted(quoteId: string, jobId: string) {
    this.track('quote_accepted', { quote_id: quoteId, job_id: jobId });
  }

  trackPaymentCompleted(jobId: string, amount: number) {
    this.track('payment_completed', { job_id: jobId, amount });
  }

  trackError(errorMessage: string, context?: Record<string, any>) {
    this.track('error_occurred', { error_message: errorMessage, ...context });
  }

  reset() {
    this.userId = null;
  }
}

export const analytics = new AnalyticsService();
export default analytics;
