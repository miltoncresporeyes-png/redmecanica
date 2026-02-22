import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import api from '../services/api';
import { Job } from '../types';

export default function JobTrackingScreen() {
  const route = useRoute<any>();
  const { jobId } = route.params;
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJob();
    const interval = setInterval(loadJob, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [jobId]);

  const loadJob = async () => {
    try {
      const data = await api.getJob(jobId);
      setJob(data);
    } catch (error) {
      console.error('Error loading job:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    const steps = ['PENDING', 'ACCEPTED', 'EN_ROUTE', 'IN_PROGRESS', 'COMPLETED'];
    return steps.indexOf(status);
  };

  const steps = [
    { key: 'ACCEPTED', label: 'Aceptado', icon: '✓' },
    { key: 'EN_ROUTE', label: 'En Camino', icon: '🚗' },
    { key: 'IN_PROGRESS', label: 'En Trabajo', icon: '🔧' },
    { key: 'COMPLETED', label: 'Completado', icon: '✅' },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Trabajo no encontrado</Text>
      </View>
    );
  }

  const currentStep = getStatusStep(job.status);

  return (
    <ScrollView style={styles.container}>
      {/* Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>
          {job.status === 'COMPLETED' ? 'Trabajo Completado' : 
           job.status === 'IN_PROGRESS' ? 'En Progreso' :
           job.status === 'EN_ROUTE' ? 'En Camino' : 'Pendiente'}
        </Text>
        
        {job.etaMinutes && job.status !== 'COMPLETED' && (
          <View style={styles.etaContainer}>
            <Text style={styles.etaIcon}>⏱️</Text>
            <Text style={styles.etaText}>Tiempo estimado: {job.etaMinutes} minutos</Text>
          </View>
        )}
      </View>

      {/* Progress Steps */}
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={step.key} style={styles.stepRow}>
            <View style={[
              styles.stepCircle,
              index <= currentStep && styles.stepCircleActive
            ]}>
              <Text style={[
                styles.stepIcon,
                index <= currentStep && styles.stepIconActive
              ]}>
                {step.icon}
              </Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[
                styles.stepLabel,
                index <= currentStep && styles.stepLabelActive
              ]}>
                {step.label}
              </Text>
              {index < currentStep && (
                <Text style={styles.stepTime}>Hace 5 min</Text>
              )}
            </View>
            {index < steps.length - 1 && (
              <View style={[
                styles.stepLine,
                index < currentStep && styles.stepLineActive
              ]} />
            )}
          </View>
        ))}
      </View>

      {/* Provider Info */}
      {job.provider && (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Proveedor Asignado</Text>
          <View style={styles.providerRow}>
            <View style={styles.providerAvatar}>
              <Text style={styles.providerAvatarText}>
                {job.provider.user?.name?.charAt(0) || '?'}
              </Text>
            </View>
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{job.provider.user?.name}</Text>
              <Text style={styles.providerType}>{job.provider.type}</Text>
            </View>
            {job.provider.phone && (
              <TouchableOpacity style={styles.callButton}>
                <Text style={styles.callButtonText}>📞</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Service Info */}
      {job.request && (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Servicio</Text>
          <Text style={styles.serviceName}>{job.request.service?.name}</Text>
          <Text style={styles.serviceDesc}>{job.request.problemDescription}</Text>
          {job.request.vehicle && (
            <Text style={styles.vehicleText}>
              🚗 {job.request.vehicle.make} {job.request.vehicle.model} ({job.request.vehicle.year})
            </Text>
          )}
        </View>
      )}

      {/* Cost */}
      {job.estimatedCost && (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Costo Estimado</Text>
          <Text style={styles.costText}>
            ${job.estimatedCost.toLocaleString('es-CL')}
          </Text>
        </View>
      )}
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
  statusCard: {
    backgroundColor: '#3B82F6',
    padding: 24,
    alignItems: 'center',
  },
  statusTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  etaIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  etaText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  stepsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#3B82F6',
  },
  stepIcon: {
    fontSize: 18,
  },
  stepIconActive: {
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 24,
  },
  stepLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  stepLabelActive: {
    color: '#1F2937',
  },
  stepTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  stepLine: {
    position: 'absolute',
    left: 19,
    top: 40,
    width: 2,
    height: 30,
    backgroundColor: '#E5E7EB',
  },
  stepLineActive: {
    backgroundColor: '#3B82F6',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 12,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerAvatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  providerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  providerType: {
    fontSize: 12,
    color: '#6B7280',
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButtonText: {
    fontSize: 20,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  serviceDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  vehicleText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  costText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
  },
});
