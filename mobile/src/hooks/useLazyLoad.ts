import { useCallback, useEffect, useRef, useState } from 'react';
import { ViewStyle } from 'react-native';

interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useLazyLoad(options: UseLazyLoadOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<any>(null);

  useEffect(() => {
    if (hasLoaded || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      {
        threshold: options.threshold || 0,
        rootMargin: options.rootMargin || '100px',
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [hasLoaded, options.threshold, options.rootMargin]);

  return { ref, isVisible, hasLoaded };
}

export function useVirtualizedList(
  data: any[],
  itemHeight: number,
  overscan?: number
) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight]
  );

  const onMomentumScrollEnd = useCallback(
    (event: any) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const startIndex = Math.floor(contentOffset.y / itemHeight);
      const endIndex = Math.ceil((contentOffset.y + layoutMeasurement.height) / itemHeight);
      
      setVisibleRange({
        start: Math.max(0, startIndex - (overscan || 5)),
        end: Math.min(data.length, endIndex + (overscan || 5)),
      });
    },
    [itemHeight, data.length, overscan]
  );

  return {
    visibleRange,
    getItemLayout,
    onMomentumScrollEnd,
  };
}

export function useListVirtualization(
  data: any[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollY, setScrollY] = useState(0);

  const totalHeight = data.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollY / itemHeight) - overscan);
  const endIndex = Math.min(
    data.length,
    Math.ceil((scrollY + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = data.slice(startIndex, endIndex).map((item, index) => ({
    item,
    index: startIndex + index,
    offset: (startIndex + index) * itemHeight,
  }));

  const onScroll = useCallback((event: any) => {
    setScrollY(event.nativeEvent.contentOffset.y);
  }, []);

  return {
    totalHeight,
    visibleItems,
    startIndex,
    endIndex,
    onScroll,
    getItemLayout: (_: any, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
  };
}
