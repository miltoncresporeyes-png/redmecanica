import { useState, useCallback, useRef } from 'react';
import { RefreshControl, NativeSyntheticEvent, NativeScrollEvent, FlatListProps } from 'react-native';

interface UseRefreshOptions {
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
}

interface UseRefreshReturn {
  refreshing: boolean;
  triggerRefresh: () => void;
  refreshControl: React.ReactElement;
}

export function useRefresh({ onRefresh }: UseRefreshOptions): UseRefreshReturn {
  const [refreshing, setRefreshing] = useState(false);

  const triggerRefresh = useCallback(async () => {
    if (onRefresh) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
  }, [onRefresh]);

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={triggerRefresh}
      colors={['#3B82F6']}
      tintColor="#3B82F6"
    />
  );

  return {
    refreshing,
    triggerRefresh,
    refreshControl,
  };
}

interface UseInfiniteScrollOptions<T> {
  data: T[];
  fetchMore: (page: number) => Promise<void>;
  hasMore?: boolean;
  pageSize?: number;
}

interface UseInfiniteScrollReturn<T> {
  loadMore: () => void;
  isLoadingMore: boolean;
  hasMore: boolean;
  onScrollEndReached: () => void;
}

export function useInfiniteScroll<T>({
  data,
  fetchMore,
  hasMore = true,
  pageSize = 20,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    
    loadingRef.current = true;
    setIsLoadingMore(true);
    
    try {
      const nextPage = Math.ceil(data.length / pageSize) + 1;
      await fetchMore(nextPage);
    } finally {
      setIsLoadingMore(false);
      loadingRef.current = false;
    }
  }, [data.length, fetchMore, hasMore, pageSize]);

  const onScrollEndReached = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      loadMore();
    }
  }, [isLoadingMore, hasMore, loadMore]);

  return {
    loadMore,
    isLoadingMore,
    hasMore,
    onScrollEndReached,
  };
}

interface UsePaginatedDataOptions<T> {
  fetchFn: (page: number, limit: number) => Promise<T[]>;
  limit?: number;
}

interface UsePaginatedDataReturn<T> {
  data: T[];
  isLoading: boolean;
  isRefreshing: boolean;
  loadNextPage: () => Promise<void>;
  refresh: () => Promise<void>;
  hasMore: boolean;
}

export function usePaginatedData<T extends { id: string }>({
  fetchFn,
  limit = 20,
}: UsePaginatedDataOptions<T>): UsePaginatedDataReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadData = useCallback(async (pageNum: number, isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const newData = await fetchFn(pageNum, limit);
      
      if (isRefresh) {
        setData(newData);
        setPage(2);
      } else {
        setData(prev => [...prev, ...newData]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(newData.length === limit);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [fetchFn, limit]);

  const loadNextPage = useCallback(() => {
    if (!isLoading && hasMore) {
      loadData(page);
    }
  }, [isLoading, hasMore, loadData, page]);

  const refresh = useCallback(() => {
    loadData(1, true);
  }, [loadData]);

  return {
    data,
    isLoading,
    isRefreshing,
    loadNextPage,
    refresh,
    hasMore,
  };
}
