import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../services/api';
import { ServiceProvider } from '../types';

export default function ProviderDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { providerId } = route.params;
  
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [problemDescription, setProblemDescription] = useState('');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    loadProvider();
  }, [providerId]);

  const loadProvider = async () => {
    try {
      const data = await api.getProviderById(providerId);
      setProvider(data);
    } catch (error) {
      console.error('Error loading provider:', error);
      Alert.alert('Error', 'No se pudo cargar el proveedor');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestService = async () => {
    if (!problemDescription.trim()) {
      Alert.alert('Error', 'Por favor describe el problema');
      return;
    }

    setRequesting(true);
    try {
      // Create job
      const job = await api.createJob({
        providerId,
        serviceId: 'general', // Default service
        problemDescription,
      });
      
      Alert.alert('Éxito', 'Solicitud enviada. El proveedor te contactará pronto.', [
        { text: 'OK', onPress: () => navigation.navigate('JobTracking', { jobId: job.id }) }
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la solicitud');
    } finally {
      setRequesting(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      MECHANIC: 'Mecánico',
      WORKSHOP: 'Taller',
      TOWING: 'Grúa',
      INSURANCE: 'Seguro',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!provider) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Proveedor no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {provider.user?.name?.charAt(0) || '?'}
          </Text>
        </View>
        <Text style={styles.name}>{provider.user?.name}</Text>
        <Text style={styles.type}>{getTypeLabel(provider.type)}</Text>
        
        <View style={styles.statsRow}>
          {provider.rating > 0 && (
            <View style={styles.statItem}>
              <Text style={styles.statValue}>★ {provider.rating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          )}
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{provider.completedJobs || 0}</Text>
            <Text style={styles.statLabel}>Trabajos</Text>
          </View>
          {provider.trustScore > 0 && (
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{provider.trustScore.toFixed(0)}%</Text>
              <Text style={styles.statLabel}>Confianza</Text>
            </View>
          )}
        </View>
      </View>

      {/* Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información de Contacto</Text>
        <View style={styles.contactRow}>
          <Text style={styles.contactIcon}>📧</Text>
          <Text style={styles.contactText}>{provider.user?.email}</Text>
        </View>
        {provider.phone && (
          <View style={styles.contactRow}>
            <Text style={styles.contactIcon}>📱</Text>
            <Text style={styles.contactText}>{provider.phone}</Text>
          </View>
        )}
        {provider.commune && (
          <View style={styles.contactRow}>
            <Text style={styles.contactIcon}>📍</Text>
            <Text style={styles.contactText}>{provider.commune}, {provider.region}</Text>
          </View>
        )}
      </View>

      {/* About */}
      {provider.bio && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre Mí</Text>
          <Text style={styles.bio}>{provider.bio}</Text>
        </View>
      )}

      {/* Specialties */}
      {provider.specialties && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Especialidades</Text>
          <View style={styles.tags}>
            {provider.specialties.split(',').map((spec, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{spec.trim()}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Request Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Solicitar Servicio</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe el problema con tu vehículo..."
          placeholderTextColor="#9CA3AF"
          value={problemDescription}
          onChangeText={setProblemDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        
        <TouchableOpacity 
          style={[styles.requestButton, requesting && styles.buttonDisabled]}
          onPress={handleRequestService}
          disabled={requesting}
        >
          <Text style={styles.requestButtonText}>
            {requesting ? 'Enviando...' : 'Solicitar Servicio'}
          </Text>
        </TouchableOpacity>
      </View>
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
  header: {
    backgroundColor: '#3B82F6',
    padding: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  type: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#374151',
  },
  bio: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '600',
  },
  textArea: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  requestButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
