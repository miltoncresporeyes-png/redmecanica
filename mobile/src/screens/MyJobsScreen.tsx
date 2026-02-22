import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Job } from '../types';

export default function MyJobsScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user]);

  const loadJobs = async () => {
    try {
      const data = await api.getUserJobs(user!.id);
      setJobs(data);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: '#F59E0B',
      ACCEPTED: '#3B82F6',
      EN_ROUTE: '#8B5CF6',
      IN_PROGRESS: '#EC4899',
      COMPLETED: '#10B981',
    };
    return colors[status] || '#6B7280';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Pendiente',
      ACCEPTED: 'Aceptado',
      EN_ROUTE: 'En Camino',
      IN_PROGRESS: 'En Trabajo',
      COMPLETED: 'Completado',
    };
    return labels[status] || status;
  };

  const renderJob = ({ item }: { item: Job }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobTracking', { jobId: item.id })}
    >
      <View style={styles.jobHeader}>
        <View style={styles.jobInfo}>
          <Text style={styles.jobService}>{item.request?.service?.name || 'Servicio'}</Text>
          <Text style={styles.jobDate}>
            {new Date(item.createdAt || Date.now()).toLocaleDateString('es-CL')}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      {item.provider && (
        <View style={styles.providerRow}>
          <Text style={styles.providerLabel}>Proveedor:</Text>
          <Text style={styles.providerName}>{item.provider.user?.name}</Text>
        </View>
      )}

      {item.request?.vehicle && (
        <Text style={styles.vehicleText}>
          🚗 {item.request.vehicle.make} {item.request.vehicle.model}
        </Text>
      )}

      {item.estimatedCost && (
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Costo:</Text>
          <Text style={styles.costValue}>${item.estimatedCost.toLocaleString('es-CL')}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.trackButton}
        onPress={() => navigation.navigate('JobTracking', { jobId: item.id })}
      >
        <Text style={styles.trackButtonText}>Ver Seguimiento</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {jobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>No tienes trabajos</Text>
          <Text style={styles.emptySubtext}>Los trabajos que solicites aparecerán aquí</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={renderJob}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobService: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  jobDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  providerRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  providerLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  vehicleText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  costRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  costLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  costValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10B981',
  },
  trackButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  trackButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
