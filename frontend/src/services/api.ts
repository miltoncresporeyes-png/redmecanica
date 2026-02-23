import axios from 'axios';
import { Job, ServiceRequest } from '../types';

const resolveApiUrl = (): string => {
  const envApiUrl = (import.meta.env.VITE_API_URL || '').trim();

  // Always use VITE_API_URL if set (works for both local and production)
  if (envApiUrl) {
    return envApiUrl;
  }

  // Fallback to relative /api
  return '/api';
};

const API_URL = resolveApiUrl().replace(/\/$/, '');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const mapBackendStatus = (status: string): Job['status'] => {
  switch (status) {
    case 'EN_ROUTE': return 'En Route';
    case 'IN_PROGRESS': return 'In Progress';
    case 'COMPLETED': return 'Completed';
    default: return 'En Route';
  }
};

const mapBackendJobToFrontend = (backendJob: any): Job => {
  // Map mechanic structure
  const mechanic = backendJob.mechanic ? {
    name: backendJob.mechanic.user?.name || 'Unknown Mechanic',
    rating: backendJob.mechanic.rating,
    vehicle: backendJob.mechanic.vehicle,
    licensePlate: backendJob.mechanic.licensePlate,
  } : undefined;

  // Map request structure if needed (ensure vehicle make/model are present)
  // Backend vehicle: { make, model, year, ... } matches Frontend Vehicle interface

  return {
    ...backendJob,
    status: mapBackendStatus(backendJob.status),
    mechanic: mechanic,
    // ensure request is passed through if present
    request: backendJob.request, 
  };
};

export const createServiceRequest = async (request: ServiceRequest): Promise<Job> => {
  const payload = {
    vehicleId: null, // Dejar que el backend asigne el vehiculo de prueba
    serviceId: request.service?.id || null, 
    providerId: null, // Dejar que el backend asigne el proveedor activo de prueba
    problemDescription: request.problemDescription,
    damagePhoto: request.damagePhoto,
  };

  const response = await api.post('/jobs', payload);
  return mapBackendJobToFrontend(response.data);
};

export const getJobStatus = async (jobId: string): Promise<Job> => {
  const response = await api.get(`/jobs/${jobId}`);
  return mapBackendJobToFrontend(response.data);
};

export const getServices = async (): Promise<any[]> => {
  const response = await api.get('/services');
  return response.data;
};

export const advanceJobStatus = async (jobId: string): Promise<Job> => {
  const response = await api.patch(`/jobs/${jobId}/advance`);
  return mapBackendJobToFrontend(response.data);
};

export const getUserProfile = async (userId: string = "user-1"): Promise<any> => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};
export const updateUserProfile = async (userData: { name: string; email: string }, userId: string = "user-1"): Promise<any> => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
};

export const registerProvider = async (providerData: any): Promise<any> => {
    const response = await api.post('/providers', providerData);
    return response.data;
};

export const getProviders = async (params: Record<string, string> = {}): Promise<any[]> => {
    const response = await api.get('/providers/search', { params });
    return response.data;
};

export const getProviderById = async (id: string): Promise<any> => {
    const response = await api.get(`/providers/${id}`);
    return response.data;
};

export const createJob = async (jobData: {
    vehicleId?: string;
    serviceId: string;
    providerId?: string;
    problemDescription?: string;
    damagePhoto?: string;
}): Promise<any> => {
    const response = await api.post('/jobs', jobData);
    return response.data;
};

export const getJob = async (jobId: string): Promise<any> => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
};

export const updateJobStatus = async (jobId: string, status: string, metadata?: any): Promise<any> => {
    const response = await api.patch(`/jobs/${jobId}/status`, { status, metadata });
    return response.data;
};

export const createQuote = async (quoteData: {
    jobId: string;
    providerId: string;
    preliminaryDiagnosis?: string;
    serviceItems?: any[];
    laborCost?: number;
    partsCost?: number;
    totalCost: number;
    estimatedDuration: number;
    warranty?: string;
}): Promise<any> => {
    const response = await api.post('/quotes', quoteData);
    return response.data;
};

export const getQuotesByJob = async (jobId: string): Promise<any[]> => {
    const response = await api.get(`/quotes/job/${jobId}`);
    return response.data;
};

export const acceptQuote = async (quoteId: string): Promise<any> => {
    const response = await api.post(`/quotes/${quoteId}/accept`);
    return response.data;
};

export const rejectQuote = async (quoteId: string): Promise<any> => {
    const response = await api.post(`/quotes/${quoteId}/reject`);
    return response.data;
};

export const createPayment = async (paymentData: {
    jobId: string;
    amount: number;
    paymentMethod: string;
}): Promise<any> => {
    const response = await api.post('/payments/create', paymentData);
    return response.data;
};

export const confirmPayment = async (paymentData: {
    jobId: string;
    token?: string;
    paymentMethod: string;
    amount: number;
}): Promise<any> => {
    const response = await api.post('/payments/confirm', paymentData);
    return response.data;
};

export const getPaymentMethods = async (): Promise<any[]> => {
    const response = await api.get('/payments/methods');
    return response.data.methods || response.data;
};

export const getPaymentStatus = async (jobId: string): Promise<any> => {
    const response = await api.get(`/payments/status/${jobId}`);
    return response.data;
};

// ========== NUEVOS ENDPOINTS ==========

// Categorías de servicios
export const getCategories = async (params?: { type?: string; isActive?: boolean }): Promise<any[]> => {
    const response = await api.get('/categories', { params });
    return response.data;
};

export const getCategoryById = async (id: string): Promise<any> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
};

export const createCategory = async (data: { name: string; slug: string; description?: string; icon?: string; type: string }): Promise<any> => {
    const response = await api.post('/categories', data);
    return response.data;
};

export const updateCategory = async (id: string, data: Partial<{ name: string; slug: string; description: string; icon: string; isActive: boolean }>): Promise<any> => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
};

// Zonas
export const getZones = async (params?: { type?: string; parentId?: string }): Promise<any[]> => {
    const response = await api.get('/zones', { params });
    return response.data;
};

export const getZoneById = async (id: string): Promise<any> => {
    const response = await api.get(`/zones/${id}`);
    return response.data;
};

export const getProvidersInZone = async (zoneId: string): Promise<any[]> => {
    const response = await api.get(`/zones/${zoneId}/providers`);
    return response.data;
};

export const assignProviderToZone = async (data: { providerId: string; zoneId: string; radiusKm?: number }): Promise<any> => {
    const response = await api.post('/zones/assign-provider', data);
    return response.data;
};

// Disponibilidad de Prestadores
export const getProviderAvailability = async (providerId: string): Promise<any[]> => {
    const response = await api.get(`/availability/${providerId}`);
    return response.data;
};

export const setProviderAvailability = async (providerId: string, schedule: Array<{ dayOfWeek: number; startTime: string; endTime: string; isActive?: boolean }>): Promise<any[]> => {
    const response = await api.post('/availability/bulk', { providerId, schedule });
    return response.data;
};

// Búsqueda de Prestadores por geolocalización
export const searchNearbyProviders = async (params: {
    lat: number;
    lng: number;
    radiusKm?: number;
    categoryId?: string;
    serviceType?: 'MECHANIC' | 'WORKSHOP' | 'TOWING' | 'INSURANCE';
    availableNow?: boolean;
}): Promise<{ providers: any[]; total: number }> => {
    const response = await api.get('/geo/search', { params });
    return response.data;
};

export const getEmergencyProviders = async (lat: number, lng: number): Promise<{ providers: any[]; total: number }> => {
    const response = await api.get('/geo/emergency', { params: { lat, lng } });
    return response.data;
};

export const getCategoriesWithProviders = async (lat: number, lng: number, radiusKm?: number): Promise<any[]> => {
    const response = await api.get('/geo/categories', { params: { lat, lng, radiusKm } });
    return response.data;
};

// Mapas
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number; address: string; commune?: string; region?: string } | null> => {
    const response = await api.get('/maps/geocode', { params: { address } });
    return response.data;
};

export const reverseGeocode = async (lat: number, lng: number): Promise<{ lat: number; lng: number; address: string; commune?: string; region?: string } | null> => {
    const response = await api.get('/maps/reverse-geocode', { params: { lat, lng } });
    return response.data;
};

export const getDirections = async (origin: string, destination: string): Promise<{ duration: number; distance: number; geometry: any } | null> => {
    const response = await api.get('/maps/directions', { params: { origin, destination } });
    return response.data;
};

export const getStaticMapUrl = async (lat: number, lng: number, zoom?: number): Promise<string> => {
    const response = await api.get('/maps/static-map', { params: { lat, lng, zoom } });
    return response.data.url;
};

// Notificaciones
export const getNotifications = async (params?: { userId: string; isRead?: boolean; limit?: number; offset?: number }): Promise<{ notifications: any[]; total: number }> => {
    const response = await api.get('/notifications', { params });
    return response.data;
};

export const getUnreadNotificationCount = async (userId: string): Promise<{ count: number }> => {
    const response = await api.get('/notifications/unread-count', { params: { userId } });
    return response.data;
};

export const markNotificationAsRead = async (notificationId: string): Promise<any> => {
    const response = await api.post('/notifications/mark-read', { notificationId });
    return response.data;
};

export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
    await api.post('/notifications/mark-all-read', { userId });
};

export const deleteNotification = async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
};

// Conversaciones / Chat
export const getConversations = async (params?: { userId?: string; providerId?: string; status?: string }): Promise<any[]> => {
    const response = await api.get('/conversations', { params });
    return response.data;
};

export const getConversationById = async (id: string): Promise<any> => {
    const response = await api.get(`/conversations/${id}`);
    return response.data;
};

export const createConversation = async (data: { jobId?: string; customerId: string; providerId: string }): Promise<any> => {
    const response = await api.post('/conversations', data);
    return response.data;
};

export const getConversationMessages = async (conversationId: string, params?: { limit?: number; offset?: number }): Promise<any[]> => {
    const response = await api.get(`/conversations/${conversationId}/messages`, { params });
    return response.data;
};

export const sendMessage = async (conversationId: string, data: { senderId: string; senderType: 'CUSTOMER' | 'PROVIDER'; content: string; metadata?: any }): Promise<any> => {
    const response = await api.post(`/conversations/${conversationId}/messages`, data);
    return response.data;
};

export const archiveConversation = async (conversationId: string): Promise<any> => {
    const response = await api.post(`/conversations/${conversationId}/archive`);
    return response.data;
};

export const sendContactMessage = async (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/contact/message', data);
    return response.data;
};

export const registerLaunchLead = async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/contact/launch-lead', { email });
    return response.data;
};

export default api;

// ========== SUSCRIPCIONES ==========

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  jobsIncluded: number;
  features: string[];
}

export const getSubscriptionPlans = async (): Promise<Record<string, SubscriptionPlan>> => {
  const response = await api.get('/subscriptions/plans');
  return response.data;
};

export const getProviderSubscription = async (providerId: string): Promise<any> => {
  const response = await api.get(`/subscriptions/provider/${providerId}`);
  return response.data;
};

export const createSubscription = async (data: {
  providerId: string;
  plan: 'MONTHLY' | 'YEARLY' | 'PROFESSIONAL';
  paymentMethod?: 'WEBPAY' | 'TRANSFER';
  autoRenew?: boolean;
}): Promise<any> => {
  const response = await api.post('/subscriptions', data);
  return response.data;
};

export const updateSubscription = async (id: string, data: {
  plan?: 'MONTHLY' | 'YEARLY' | 'PROFESSIONAL';
  autoRenew?: boolean;
  status?: 'ACTIVE' | 'CANCELLED' | 'SUSPENDED';
}): Promise<any> => {
  const response = await api.patch(`/subscriptions/${id}`, data);
  return response.data;
};

export const activateSubscription = async (id: string): Promise<any> => {
  const response = await api.post(`/subscriptions/${id}/activate`);
  return response.data;
};

export const cancelSubscription = async (id: string): Promise<any> => {
  const response = await api.post(`/subscriptions/${id}/cancel`);
  return response.data;
};

export const renewSubscription = async (id: string): Promise<any> => {
  const response = await api.post(`/subscriptions/${id}/renew`);
  return response.data;
};
