import { useState, useEffect, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface BiometricResult {
  success: boolean;
  error?: string;
}

interface UseBiometricAuthReturn {
  isSupported: boolean;
  isEnrolled: boolean;
  biometricType: LocalAuthentication.AuthenticationType[] | null;
  isLoading: boolean;
  authenticate: (promptMessage?: string) => Promise<BiometricResult>;
  enableBiometric: () => Promise<void>;
  disableBiometric: () => Promise<void>;
  isBiometricEnabled: boolean;
}

const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';

export function useBiometricAuth(): UseBiometricAuthReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [biometricType, setBiometricType] = useState<LocalAuthentication.AuthenticationType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

      setIsSupported(compatible);
      setIsEnrolled(enrolled);
      setBiometricType(types);

      const enabled = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
      setIsBiometricEnabled(enabled === 'true');
    } catch (error) {
      console.error('Error checking biometric support:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const enableBiometric = useCallback(async () => {
    await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
    setIsBiometricEnabled(true);
  }, []);

  const disableBiometric = useCallback(async () => {
    await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'false');
    setIsBiometricEnabled(false);
  }, []);

  const authenticate = useCallback(async (promptMessage: string = 'Autenticate to continue'): Promise<BiometricResult> => {
    if (!isSupported || !isEnrolled) {
      return { success: false, error: 'Biometric not available' };
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        fallbackLabel: 'Use PIN',
      });

      if (result.success) {
        return { success: true };
      }

      if (result.error === 'user_cancel') {
        return { success: false, error: 'Authentication cancelled' };
      }

      if (result.error === 'user_fallback') {
        return { success: false, error: 'Use PIN' };
      }

      return { success: false, error: result.error || 'Authentication failed' };
    } catch (error) {
      return { success: false, error: 'Authentication error' };
    }
  }, [isSupported, isEnrolled]);

  return {
    isSupported,
    isEnrolled,
    biometricType,
    isLoading,
    authenticate,
    enableBiometric,
    disableBiometric,
    isBiometricEnabled,
  };
}

export function getBiometricTypeLabel(types: LocalAuthentication.AuthenticationType[] | null): string {
  if (!types || types.length === 0) return 'None';

  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    return 'Face ID';
  }
  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return 'Fingerprint';
  }
  if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
    return 'Iris';
  }

  return 'Biometric';
}
