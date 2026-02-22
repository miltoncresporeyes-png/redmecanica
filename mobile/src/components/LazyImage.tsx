import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Image, ImageContentFit } from 'expo-image';

interface LazyImageProps {
  uri: string | null | undefined;
  style?: ViewStyle;
  placeholder?: number;
  contentFit?: ImageContentFit;
  transition?: number;
  cachePolicy?: 'memory' | 'disk' | 'memory-disk';
}

export function LazyImage({
  uri,
  style,
  placeholder,
  contentFit = 'cover',
  transition = 300,
  cachePolicy = 'memory-disk',
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (!uri) {
    return (
      <View style={[styles.container, style, styles.placeholder]}>
        {placeholder ? (
          <Image
            source={placeholder}
            style={styles.full}
            contentFit={contentFit}
          />
        ) : null}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri }}
        style={styles.full}
        contentFit={contentFit}
        transition={transition}
        cachePolicy={cachePolicy}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  full: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: '#e0e0e0',
  },
});
