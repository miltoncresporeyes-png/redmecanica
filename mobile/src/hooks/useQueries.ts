import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export function useCategories(forceRefresh: boolean = false) {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.getCategories(forceRefresh),
    staleTime: 30 * 60 * 1000,
  });
}

export function useServices(forceRefresh: boolean = false) {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => api.getServices(forceRefresh),
    staleTime: 15 * 60 * 1000,
  });
}

export function useZones(forceRefresh: boolean = false) {
  return useQuery({
    queryKey: ['zones'],
    queryFn: () => api.getZones(forceRefresh),
    staleTime: 30 * 60 * 1000,
  });
}

export function useProviderSearch(params: {
  lat: number;
  lng: number;
  radiusKm?: number;
  serviceType?: string;
}) {
  return useQuery({
    queryKey: ['providers', 'search', params],
    queryFn: () => api.searchProviders(params),
    enabled: params.lat != null && params.lng != null,
  });
}

export function useProvider(id: string) {
  return useQuery({
    queryKey: ['provider', id],
    queryFn: () => api.getProviderById(id),
    enabled: !!id,
  });
}

export function useUserJobs(userId: string) {
  return useQuery({
    queryKey: ['jobs', 'user', userId],
    queryFn: () => api.getUserJobs(userId),
    enabled: !!userId,
  });
}

export function useJob(jobId: string) {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: () => api.getJob(jobId),
    enabled: !!jobId,
    refetchInterval: 30000,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: api.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['jobs', 'user', user.id] });
      }
    },
  });
}

export function useUserVehicles(userId: string) {
  return useQuery({
    queryKey: ['vehicles', userId],
    queryFn: () => api.getUserVehicles(userId),
    enabled: !!userId,
  });
}

export function useAddVehicle() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: api.addVehicle,
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['vehicles', user.id] });
      }
    },
  });
}

export function useNotifications(userId: string) {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => api.getNotifications(userId),
    enabled: !!userId,
    refetchInterval: 60000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: api.markNotificationAsRead,
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
      }
    },
  });
}

export function useQuotesByJob(jobId: string) {
  return useQuery({
    queryKey: ['quotes', 'job', jobId],
    queryFn: () => api.getQuotesByJob(jobId),
    enabled: !!jobId,
  });
}

export function useAcceptQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.acceptQuote,
    onSuccess: (_, quoteId) => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['job', quoteId] });
    },
  });
}
