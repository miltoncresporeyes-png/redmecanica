import { useCallback, useMemo } from 'react';

export function useListCallbacks<T extends { id: string }>(
  items: T[],
  onItemPress?: (item: T) => void
) {
  const handleItemPress = useCallback((item: T) => {
    onItemPress?.(item);
  }, [onItemPress]);

  const itemKeyExtractor = useCallback((item: T) => item.id, []);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.id.localeCompare(b.id));
  }, [items]);

  return {
    handleItemPress,
    itemKeyExtractor,
    sortedItems,
  };
}

export function useSelection<T>(initialSelected: T[] = []) {
  const [selected, setSelected] = React.useState<T[]>(initialSelected);

  const toggle = useCallback((item: T) => {
    setSelected(prev => 
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  }, []);

  const select = useCallback((item: T) => {
    setSelected(prev => [...prev, item]);
  }, []);

  const deselect = useCallback((item: T) => {
    setSelected(prev => prev.filter(i => i !== item));
  }, []);

  const clear = useCallback(() => {
    setSelected([]);
  }, []);

  const isSelected = useCallback((item: T) => {
    return selected.includes(item);
  }, [selected]);

  return {
    selected,
    toggle,
    select,
    deselect,
    clear,
    isSelected,
    count: selected.length,
  };
}

import React from 'react';
