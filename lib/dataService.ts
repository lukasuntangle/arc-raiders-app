import Fuse from 'fuse.js';
import { supabase, USE_LOCAL_DATA } from './supabase';
import type { Item, WorkshopUpgrade, Attachment, SearchResult } from './types';

// Import local JSON data as fallback
import itemsData from '../data/items.json';
import upgradesData from '../data/upgrades.json';
import attachmentsData from '../data/attachments.json';

// Cache for Supabase data
let cachedItems: Item[] | null = null;
let cachedUpgrades: WorkshopUpgrade[] | null = null;
let cachedAttachments: Attachment[] | null = null;
let itemsFuse: Fuse<Item> | null = null;

// Fuse.js options for fuzzy search
const fuseOptions = {
  keys: ['name'],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 2,
};

// Initialize Fuse with items
function initializeFuse(items: Item[]) {
  itemsFuse = new Fuse(items, fuseOptions);
}

// Get local items
function getLocalItems(): Item[] {
  return itemsData.items as Item[];
}

// Get local upgrades
function getLocalUpgrades(): WorkshopUpgrade[] {
  return upgradesData.upgrades as WorkshopUpgrade[];
}

// Get local attachments
function getLocalAttachments(): Attachment[] {
  return attachmentsData.attachments as Attachment[];
}

// Fetch items from Supabase
export async function fetchItems(): Promise<Item[]> {
  if (USE_LOCAL_DATA) {
    const items = getLocalItems();
    initializeFuse(items);
    return items;
  }

  if (cachedItems) return cachedItems;

  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('name');

    if (error) throw error;

    // Transform snake_case to camelCase
    cachedItems = data.map(item => ({
      id: item.id,
      name: item.name,
      rarity: item.rarity as Item['rarity'],
      category: item.category as Item['category'],
      action: item.action as Item['action'],
      keepForQuest: item.keep_for_quest,
      usedInUpgrades: [],
      notes: item.notes,
    }));

    initializeFuse(cachedItems);
    return cachedItems;
  } catch (error) {
    console.warn('Supabase fetch failed, using local data:', error);
    const items = getLocalItems();
    initializeFuse(items);
    return items;
  }
}

// Fetch upgrades from Supabase
export async function fetchUpgrades(): Promise<WorkshopUpgrade[]> {
  if (USE_LOCAL_DATA) {
    return getLocalUpgrades();
  }

  if (cachedUpgrades) return cachedUpgrades;

  try {
    const { data, error } = await supabase
      .from('upgrades')
      .select(`
        *,
        upgrade_requirements (
          item_id,
          quantity
        )
      `)
      .order('station_id')
      .order('level');

    if (error) throw error;

    // Fetch item names separately for requirements
    const itemIds = new Set<string>();
    data.forEach((upgrade: any) => {
      upgrade.upgrade_requirements?.forEach((req: any) => {
        itemIds.add(req.item_id);
      });
    });

    const { data: itemsData } = await supabase
      .from('items')
      .select('id, name')
      .in('id', Array.from(itemIds));

    const itemNameMap = new Map(itemsData?.map(i => [i.id, i.name]) || []);

    cachedUpgrades = data.map((upgrade: any) => ({
      id: upgrade.id,
      name: upgrade.name,
      station: upgrade.station_id,
      level: upgrade.level,
      requirements: (upgrade.upgrade_requirements || []).map((req: any) => ({
        itemId: req.item_id,
        itemName: itemNameMap.get(req.item_id) || req.item_id,
        quantity: req.quantity,
      })),
    }));

    return cachedUpgrades;
  } catch (error) {
    console.warn('Supabase fetch failed, using local data:', error);
    return getLocalUpgrades();
  }
}

// Fetch attachments from Supabase
export async function fetchAttachments(): Promise<Attachment[]> {
  if (USE_LOCAL_DATA) {
    return getLocalAttachments();
  }

  if (cachedAttachments) return cachedAttachments;

  try {
    const { data, error } = await supabase
      .from('attachments')
      .select('*')
      .order('type')
      .order('tier');

    if (error) throw error;

    cachedAttachments = data as Attachment[];
    return cachedAttachments;
  } catch (error) {
    console.warn('Supabase fetch failed, using local data:', error);
    return getLocalAttachments();
  }
}

// Synchronous getters (use cached or local data)
export function getAllItems(): Item[] {
  if (cachedItems) return cachedItems;
  const items = getLocalItems();
  initializeFuse(items);
  return items;
}

export function getAllUpgrades(): WorkshopUpgrade[] {
  return cachedUpgrades || getLocalUpgrades();
}

export function getAllAttachments(): Attachment[] {
  return cachedAttachments || getLocalAttachments();
}

// Search items by name (fuzzy search)
export function searchItems(query: string): SearchResult[] {
  const items = getAllItems();

  if (!query || query.trim().length < 2) {
    return items.map(item => ({ item, score: 0 }));
  }

  if (!itemsFuse) {
    initializeFuse(items);
  }

  const results = itemsFuse!.search(query.trim());
  return results.map(result => ({
    item: result.item,
    score: result.score || 0,
  }));
}

// Get item by ID
export function getItemById(id: string): Item | undefined {
  return getAllItems().find(item => item.id === id);
}

// Get items by action (sell, recycle, keep)
export function getItemsByAction(action: 'sell' | 'recycle' | 'keep'): Item[] {
  return getAllItems().filter(item => item.action === action);
}

// Get items that should be kept for quests
export function getQuestItems(): Item[] {
  return getAllItems().filter(item => item.keepForQuest);
}

// Get upgrades by station
export function getUpgradesByStation(station: string): WorkshopUpgrade[] {
  return getAllUpgrades().filter(upgrade => upgrade.station === station);
}

// Get upgrade by ID
export function getUpgradeById(id: string): WorkshopUpgrade | undefined {
  return getAllUpgrades().find(upgrade => upgrade.id === id);
}

// Get upgrades that require a specific item
export function getUpgradesRequiringItem(itemId: string): WorkshopUpgrade[] {
  return getAllUpgrades().filter(upgrade =>
    upgrade.requirements.some(req => req.itemId === itemId)
  );
}

// Get attachments by type
export function getAttachmentsByType(type: string): Attachment[] {
  return getAllAttachments().filter(attachment => attachment.type === type);
}

// Get attachment by ID
export function getAttachmentById(id: string): Attachment | undefined {
  return getAllAttachments().find(attachment => attachment.id === id);
}

// Get magazine sizes
export function getMagazineSizes() {
  return attachmentsData.magazineSizes;
}

// Get unique stations
export function getStations(): string[] {
  const stationSet = new Set(getAllUpgrades().map(u => u.station));
  return Array.from(stationSet);
}

// Get unique attachment types
export function getAttachmentTypes(): string[] {
  const typeSet = new Set(getAllAttachments().map(a => a.type));
  return Array.from(typeSet);
}

// Cache invalidation
export function invalidateCache() {
  cachedItems = null;
  cachedUpgrades = null;
  cachedAttachments = null;
  itemsFuse = null;
}

// Preload all data from Supabase
export async function preloadData(): Promise<void> {
  await Promise.all([
    fetchItems(),
    fetchUpgrades(),
    fetchAttachments(),
  ]);
}

// Helper to get action color
export function getActionColor(action: 'sell' | 'recycle' | 'keep'): string {
  switch (action) {
    case 'sell':
      return '#22C55E';
    case 'recycle':
      return '#EAB308';
    case 'keep':
      return '#EF4444';
    default:
      return '#9CA3AF';
  }
}

// Helper to get rarity color
export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common':
      return '#9CA3AF';
    case 'uncommon':
      return '#22C55E';
    case 'rare':
      return '#3B82F6';
    case 'epic':
      return '#A855F7';
    default:
      return '#9CA3AF';
  }
}
