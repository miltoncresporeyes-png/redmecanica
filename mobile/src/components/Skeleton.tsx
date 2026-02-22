import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle, Dimensions } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
}

interface SkeletonCardProps {
  rows?: number;
}

export function SkeletonCard({ rows = 3 }: SkeletonCardProps) {
  return (
    <View style={styles.card}>
      <Skeleton width={60} height={60} borderRadius={30} />
      <View style={styles.cardContent}>
        <Skeleton width="60%" height={16} />
        <Skeleton width="40%" height={14} style={{ marginTop: 8 }} />
        {Array.from({ length: rows - 2 }).map((_, i) => (
          <Skeleton
            key={i}
            width="80%"
            height={12}
            style={{ marginTop: 6 }}
          />
        ))}
      </View>
    </View>
  );
}

interface SkeletonListProps {
  count?: number;
  cardRows?: number;
}

export function SkeletonList({ count = 5, cardRows = 3 }: SkeletonListProps) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} rows={cardRows} />
      ))}
    </View>
  );
}

interface SkeletonGridProps {
  columns?: number;
  rows?: number;
}

export function SkeletonGrid({ columns = 2, rows = 3 }: SkeletonGridProps) {
  const { width: screenWidth } = Dimensions.get('window');
  const itemWidth = (screenWidth - 48 - (columns - 1) * 12) / columns;

  return (
    <View style={styles.grid}>
      {Array.from({ length: columns * rows }).map((_, i) => (
        <View key={i} style={[styles.gridItem, { width: itemWidth }]}>
          <Skeleton width="100%" height={itemWidth} borderRadius={8} />
          <Skeleton width="70%" height={14} style={{ marginTop: 8 }} />
          <Skeleton width="50%" height={12} style={{ marginTop: 4 }} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e0e0e0',
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  list: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  gridItem: {
    marginBottom: 16,
  },
});
