import { useState, useEffect, useMemo } from 'react';
import {
  getAllItems,
  searchItems,
  getItemById,
  getUpgradesRequiringItem,
  getActionColor,
  getRarityColor,
} from '../lib/dataService';
import type { Item, SearchResult, WorkshopUpgrade } from '../lib/types';

// Hook for searching items
export function useItemSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    // Small delay for debouncing
    const timeoutId = setTimeout(() => {
      const searchResults = searchItems(query);
      setResults(searchResults);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return { results, isLoading };
}

// Hook for getting all items
export function useAllItems() {
  const items = useMemo(() => getAllItems(), []);
  return items;
}

// Hook for getting a single item with related data
export function useItemDetails(itemId: string | null) {
  const [item, setItem] = useState<Item | null>(null);
  const [relatedUpgrades, setRelatedUpgrades] = useState<WorkshopUpgrade[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!itemId) {
      setItem(null);
      setRelatedUpgrades([]);
      return;
    }

    setIsLoading(true);

    const foundItem = getItemById(itemId);
    const upgrades = getUpgradesRequiringItem(itemId);

    setItem(foundItem || null);
    setRelatedUpgrades(upgrades);
    setIsLoading(false);
  }, [itemId]);

  const actionColor = item ? getActionColor(item.action) : '#9E9E9E';
  const rarityColor = item ? getRarityColor(item.rarity) : '#9E9E9E';

  return { item, relatedUpgrades, isLoading, actionColor, rarityColor };
}

// Hook for filtering items by action
export function useFilteredItems(filter: 'all' | 'sell' | 'recycle' | 'keep') {
  const allItems = useAllItems();

  const filteredItems = useMemo(() => {
    if (filter === 'all') return allItems;
    return allItems.filter(item => item.action === filter);
  }, [allItems, filter]);

  return filteredItems;
}
