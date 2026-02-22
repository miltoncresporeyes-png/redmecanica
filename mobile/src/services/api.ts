import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cacheService from './cache';

const API_URL = 'http://192.168.1.100:3010/api';

const CACHE_KEYS = {
  CATEGORIES: 'categories',
  SERVICES: 'services',
  ZONES: 'zones',
};

const CACHE_TTL = {
  CATEGORIES: 30 * 60 * 1000,
  SERVICES: 15 * 60 * 1000,
  ZONES: 30 * 60 * 1000,
};

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.setupInterceptors();
    this.loadToken();
  }

  private async loadToken() {
    try {
      this.token = await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error loading token:', error);
    }
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(async (config) => {
      if (!this.token) {
        this.token = await AsyncStorage.getItem('auth_token');
      }
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await this.logout();
          } catch (logoutError) {
            console.error('Logout error:', logoutError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem('auth_token', token);
  }

  async clearToken() {
    this.token = null;
    await AsyncStorage.removeItem('auth_token');
  }

  private async cachedRequest<T>(
    cacheKey: string,
    requestFn: () => Promise<any>,
    ttl: number = 60000,
    forceRefresh: boolean = false
  ): Promise<T> {
    if (!forceRefresh) {
      const cached = cacheService.get<T>(cacheKey, ttl);
      if (cached) return cached;
    }
    const response = await requestFn();
    cacheService.set(cacheKey, response.data);
    return response.data;
  }

  private async requestWithRetry<T>(
    requestFn: () => Promise<T>,
    retries: number = 2
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return this.requestWithRetry(requestFn, retries - 1);
      }
      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    if (!error.response) return true;
    const status = error.response.status;
    return status === 408 || status === 429 || status >= 500;
  }

  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    if (response.data.token) {
      await this.setToken(response.data.token);
    }
    return response.data;
  }

  async register(data: { email: string; password: string; name: string; role?: string }) {
    const response = await this.api.post('/auth/register', data);
    if (response.data.token) {
      await this.setToken(response.data.token);
    }
    return response.data;
  }

  async logout() {
    await this.clearToken();
    cacheService.clear();
  }

  async getCategories(forceRefresh: boolean = false) {
    return this.cachedRequest<any[]>(
      CACHE_KEYS.CATEGORIES,
      () => this.api.get('/categories'),
      CACHE_TTL.CATEGORIES,
      forceRefresh
    );
  }

  async getServices(forceRefresh: boolean = false) {
    return this.cachedRequest<any[]>(
      CACHE_KEYS.SERVICES,
      () => this.api.get('/services'),
      CACHE_TTL.SERVICES,
      forceRefresh
    );
  }

  async getZones(forceRefresh: boolean = false) {
    return this.cachedRequest<any[]>(
      CACHE_KEYS.ZONES,
      () => this.api.get('/zones'),
      CACHE_TTL.ZONES,
      forceRefresh
    );
  }

  async searchProviders(params: {
    lat: number;
    lng: number;
    radiusKm?: number;
    serviceType?: string;
  }) {
    return this.requestWithRetry(async () => {
      const response = await this.api.get('/geo/search', { params });
      return response.data;
    });
  }

  async getProviderById(id: string) {
    return this.requestWithRetry(async () => {
      const response = await this.api.get(`/providers/${id}`);
      return response.data;
    });
  }

  async createJob(data: {
    vehicleId?: string;
    serviceId: string;
    providerId?: string;
    problemDescription?: string;
  }) {
    const response = await this.api.post('/jobs', data);
    cacheService.invalidatePattern('jobs_');
    return response.data;
  }

  async getJob(jobId: string) {
    return this.requestWithRetry(async () => {
      const response = await this.api.get(`/jobs/${jobId}`);
      return response.data;
    });
  }

  async getUserJobs(userId: string) {
    return this.cachedRequest<any[]>(
      `jobs_user_${userId}`,
      () => this.api.get(`/jobs/user/${userId}`),
      60000
    );
  }

  async getQuotesByJob(jobId: string) {
    const response = await this.api.get(`/quotes/job/${jobId}`);
    return response.data;
  }

  async acceptQuote(quoteId: string) {
    const response = await this.api.post(`/quotes/${quoteId}/accept`);
    return response.data;
  }

  async getUserVehicles(userId: string) {
    return this.cachedRequest<any[]>(
      `vehicles_${userId}`,
      () => this.api.get(`/users/${userId}/vehicles`),
      300000
    );
  }

  async addVehicle(data: { make: string; model: string; year: number; licensePlate?: string }) {
    const response = await this.api.post('/users/vehicles', data);
    cacheService.invalidatePattern('vehicles_');
    return response.data;
  }

  async getNotifications(userId: string) {
    return this.cachedRequest<any[]>(
      `notifications_${userId}`,
      () => this.api.get('/notifications', { params: { userId } }),
      30000
    );
  }

  async markNotificationAsRead(notificationId: string) {
    const response = await this.api.post('/notifications/mark-read', { notificationId });
    cacheService.invalidatePattern('notifications_');
    return response.data;
  }

  async getConversations(userId: string) {
    const response = await this.api.get('/conversations', { params: { userId } });
    return response.data;
  }

  async getConversationMessages(conversationId: string) {
    const response = await this.api.get(`/conversations/${conversationId}/messages`);
    return response.data;
  }

  async sendMessage(conversationId: string, data: { senderId: string; senderType: string; content: string }) {
    const response = await this.api.post(`/conversations/${conversationId}/messages`, data);
    return response.data;
  }

  async geocodeAddress(address: string) {
    return this.requestWithRetry(async () => {
      const response = await this.api.get('/maps/geocode', { params: { address } });
      return response.data;
    });
  }

  async reverseGeocode(lat: number, lng: number) {
    return this.requestWithRetry(async () => {
      const response = await this.api.get('/maps/reverse-geocode', { params: { lat, lng } });
      return response.data;
    });
  }
}

export const api = new ApiService();
export default api;
