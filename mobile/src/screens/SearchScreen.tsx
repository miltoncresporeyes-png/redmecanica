import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import api from '../services/api';
import { ServiceProvider } from '../types';

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchType, setSearchType] = useState(route.params?.categoryType || route.params?.type || '');
  const [radius, setRadius] = useState('15');

  useEffect(() => {
    loadProviders();
  }, [searchType, radius]);

  const loadProviders = async () => {
    setLoading(true);
    try {
      let loc = location;
      if (!loc) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const pos = await Location.getCurrentPositionAsync({});
          loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(loc);
        }
      }

      if (loc) {
        const response = await api.searchProviders({
          lat: loc.lat,
          lng: loc.lng,
          radiusKm: parseInt(radius),
          serviceType: searchType || undefined,
        });
        setProviders(response.providers || []);
      }
    } catch (error) {
      console.error('Error loading providers:', error);
    } finally {
      setLoading(false);
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

  const renderProvider = ({ item }: { item: ServiceProvider }) => (
    <TouchableOpacity 
      style={styles.providerCard}
      onPress={() => navigation.navigate('ProviderDetail', { providerId: item.id })}
    >
      <View style={styles.providerHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.user?.name?.charAt(0) || '?'}
          </Text>
        </View>
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{item.user?.name}</Text>
          <Text style={styles.providerType}>{getTypeLabel(item.type)}</Text>
        </View>
        {item.rating > 0 && (
          <View style={styles.rating}>
            <Text style={styles.ratingText}>★ {item.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
      
      {item.bio && (
        <Text style={styles.providerBio} numberOfLines={2}>{item.bio}</Text>
      )}
      
      <View style={styles.providerFooter}>
        <View style={styles.footerItem}>
          <Text style={styles.footerIcon}>📍</Text>
          <Text style={styles.footerText}>
            {item.distance ? `${item.distance.toFixed(1)} km` : item.commune || 'Santiago'}
          </Text>
        </View>
        {item.etaMinutes && (
          <View style={styles.footerItem}>
            <Text style={styles.footerIcon}>⏱️</Text>
            <Text style={styles.footerText}>~{item.etaMinutes} min</Text>
          </View>
        )}
        {item.completedJobs > 0 && (
          <View style={styles.footerItem}>
            <Text style={styles.footerIcon}>✓</Text>
            <Text style={styles.footerText}>{item.completedJobs} trabajos</Text>
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={styles.viewButton}
        onPress={() => navigation.navigate('ProviderDetail', { providerId: item.id })}
      >
        <Text style={styles.viewButtonText}>Ver Detalles</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Filters */}
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            placeholderTextColor="#9CA3AF"
          />
          <View style={styles.typeSelector}>
            {['MECHANIC', 'WORKSHOP', 'TOWING'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  searchType === type && styles.typeButtonActive,
                ]}
                onPress={() => setSearchType(searchType === type ? '' : type)}
              >
                <Text style={[
                  styles.typeButtonText,
                  searchType === type && styles.typeButtonTextActive,
                ]}>
                  {getTypeLabel(type)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Buscando Prestadores...</Text>
        </View>
      ) : providers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>No se encontraron Prestadores</Text>
          <Text style={styles.emptySubtext}>Intenta con otros filtros</Text>
        </View>
      ) : (
        <FlatList
          data={providers}
          keyExtractor={(item) => item.id}
          renderItem={renderProvider}
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
  filterContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterRow: {
    gap: 12,
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1F2937',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#3B82F6',
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 14,
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
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  providerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
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
    marginTop: 2,
  },
  rating: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#D97706',
    fontWeight: 'bold',
    fontSize: 12,
  },
  providerBio: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  providerFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerIcon: {
    fontSize: 14,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
  },
  viewButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
