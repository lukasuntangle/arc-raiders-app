const fs = require('fs');
const path = require('path');

// Load existing items (has action recommendations)
const existingPath = path.join(__dirname, '..', 'data', 'items.json');
const existingData = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
const existingItems = existingData.items;

// Load wiki items (has latest item list and descriptions)
const wikiPath = path.join(__dirname, '..', 'data', 'items-wiki.json');
const wikiData = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));
const wikiItems = wikiData.items;

// Create a map of existing items by ID for quick lookup
const existingMap = new Map();
existingItems.forEach(item => {
  existingMap.set(item.id, item);
});

// Items that are clearly weapons/gear (not loot items) to exclude
const excludeItems = new Set([
  'anvil', 'aphelion', 'arpeggio', 'bettina', 'bulwark', 'duet',
  'flechette', 'grinder', 'hexfire', 'jackhammer', 'lullaby',
  'mantis', 'nocturne', 'opus', 'prelude', 'ranger', 'requiem',
  'ricochet', 'scorcher', 'serenade', 'sonata', 'tempest', 'vanguard'
]);

// Determine the action for an item based on rarity and notes
function determineAction(item) {
  const notes = (item.notes || '').toLowerCase();
  const name = item.name.toLowerCase();

  // Quest items should be kept
  if (notes.includes('quest') || item.keepForQuest) {
    return 'keep';
  }

  // Food/consumables that restore health/stamina
  if (notes.includes('health') || notes.includes('stamina') || notes.includes('consumed')) {
    return 'keep';
  }

  // Crafting materials - recycle
  if (notes.includes('craft') || notes.includes('recycl') || notes.includes('upgrade')) {
    return 'recycle';
  }

  // ARC items are valuable for crafting
  if (name.includes('arc ') || name.startsWith('arc_')) {
    return 'recycle';
  }

  // High rarity items
  if (item.rarity === 'epic' || item.rarity === 'legendary') {
    return 'keep';
  }

  if (item.rarity === 'rare') {
    return 'recycle';
  }

  // Items worth money
  if (notes.includes('coin') || notes.includes('sell') || notes.includes('worth')) {
    return 'sell';
  }

  // Default based on rarity
  if (item.rarity === 'uncommon') {
    return 'recycle';
  }

  return 'sell';
}

// Determine the category
function determineCategory(item) {
  const notes = (item.notes || '').toLowerCase();
  const name = item.name.toLowerCase();

  // Food items
  if (notes.includes('health') || notes.includes('stamina') || notes.includes('food') ||
      notes.includes('eat') || notes.includes('drink') || notes.includes('consum')) {
    return 'consumable';
  }

  // Medical items
  if (notes.includes('medical') || notes.includes('heal') || name.includes('bandage') ||
      name.includes('medkit') || name.includes('shot') || name.includes('syringe')) {
    return 'consumable';
  }

  // Components
  if (notes.includes('craft') || notes.includes('component') || name.includes('component') ||
      name.includes('part') || name.includes('module')) {
    return 'component';
  }

  // ARC items are components
  if (name.includes('arc ') || name.startsWith('arc_')) {
    return 'component';
  }

  return 'material';
}

// Merge items
const mergedItems = [];

wikiItems.forEach(wikiItem => {
  // Skip excluded items (weapons/gear)
  if (excludeItems.has(wikiItem.id)) {
    return;
  }

  // Check if we have existing data for this item
  const existing = existingMap.get(wikiItem.id);

  if (existing) {
    // Merge: keep existing action/keepForQuest/usedInUpgrades, update with wiki data
    mergedItems.push({
      id: wikiItem.id,
      name: wikiItem.name,
      rarity: wikiItem.rarity !== 'common' ? wikiItem.rarity : existing.rarity,
      category: determineCategory(wikiItem),
      action: existing.action, // Keep our curated action
      keepForQuest: existing.keepForQuest,
      usedInUpgrades: existing.usedInUpgrades,
      notes: wikiItem.notes || existing.notes || ''
    });
  } else {
    // New item from wiki
    const category = determineCategory(wikiItem);
    const action = determineAction(wikiItem);

    mergedItems.push({
      id: wikiItem.id,
      name: wikiItem.name,
      rarity: wikiItem.rarity,
      category: category,
      action: action,
      keepForQuest: action === 'keep',
      usedInUpgrades: [],
      notes: wikiItem.notes || ''
    });
  }
});

// Sort by name
mergedItems.sort((a, b) => a.name.localeCompare(b.name));

// Save merged items
const outputPath = path.join(__dirname, '..', 'data', 'items.json');
fs.writeFileSync(outputPath, JSON.stringify({ items: mergedItems }, null, 2));

console.log(`Merged ${mergedItems.length} items`);
console.log(`- Existing items updated: ${existingItems.length}`);
console.log(`- New items from wiki: ${mergedItems.length - existingItems.length}`);
console.log(`\nSaved to ${outputPath}`);

// Show some new items
const existingIds = new Set(existingItems.map(i => i.id));
const newItems = mergedItems.filter(i => !existingIds.has(i.id));

console.log(`\n--- New Items (${newItems.length}) ---`);
newItems.slice(0, 20).forEach(item => {
  console.log(`${item.name} (${item.rarity}, ${item.category}, ${item.action})`);
});
if (newItems.length > 20) {
  console.log(`... and ${newItems.length - 20} more`);
}
