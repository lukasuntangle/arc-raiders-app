const https = require('https');
const fs = require('fs');
const path = require('path');

const API_BASE = 'https://arc-raiders.fandom.com/api.php';

// Helper function to make HTTPS requests
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Get all items from the Items category
async function getAllItems() {
  const items = [];
  let continueToken = '';

  do {
    const url = `${API_BASE}?action=query&list=categorymembers&cmtitle=Category:Items&cmlimit=500&format=json${continueToken}`;
    const data = await fetchJson(url);

    if (data.query && data.query.categorymembers) {
      items.push(...data.query.categorymembers);
    }

    continueToken = data.continue ? `&cmcontinue=${data.continue.cmcontinue}` : '';
  } while (continueToken);

  return items;
}

// Get item details from the wiki page content
async function getItemDetails(title) {
  const url = `${API_BASE}?action=parse&page=${encodeURIComponent(title)}&prop=wikitext&format=json`;

  try {
    const data = await fetchJson(url);

    if (!data.parse || !data.parse.wikitext) {
      return null;
    }

    const wikitext = data.parse.wikitext['*'];

    // Parse infobox template for item details
    const details = {
      name: title,
      rarity: 'common',
      category: 'material',
      action: 'sell',
      keepForQuest: false,
      usedInUpgrades: [],
      notes: ''
    };

    // Extract rarity
    const rarityMatch = wikitext.match(/\|\s*rarity\s*=\s*(\w+)/i);
    if (rarityMatch) {
      const rarity = rarityMatch[1].toLowerCase();
      if (['common', 'uncommon', 'rare', 'epic', 'legendary'].includes(rarity)) {
        details.rarity = rarity;
      }
    }

    // Extract type/category
    const typeMatch = wikitext.match(/\|\s*type\s*=\s*([^\n|]+)/i);
    if (typeMatch) {
      const type = typeMatch[1].trim().toLowerCase();
      if (type.includes('component')) details.category = 'component';
      else if (type.includes('material')) details.category = 'material';
      else if (type.includes('consumable') || type.includes('food') || type.includes('medical')) details.category = 'consumable';
      else if (type.includes('attachment')) details.category = 'attachment';
    }

    // Check for quest item indicators
    if (wikitext.toLowerCase().includes('quest') || wikitext.toLowerCase().includes('keep for')) {
      details.keepForQuest = true;
      details.action = 'keep';
    }

    // Extract description/notes
    const descMatch = wikitext.match(/\|\s*description\s*=\s*([^\n|]+)/i);
    if (descMatch) {
      details.notes = descMatch[1].trim();
    }

    return details;
  } catch (e) {
    console.error(`Error fetching details for ${title}:`, e.message);
    return null;
  }
}

// Generate item ID from name
function generateId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

// Main function
async function main() {
  console.log('Fetching all items from Arc Raiders Wiki...\n');

  // Get all items from category
  const categoryItems = await getAllItems();
  console.log(`Found ${categoryItems.length} items in the Items category\n`);

  // Filter out non-item pages (weapons, etc.)
  const excludePatterns = [
    /weapon/i, /gun/i, /rifle/i, /pistol/i, /shotgun/i,
    /armor/i, /helmet/i, /vest/i,
    /^category:/i, /^file:/i, /^template:/i
  ];

  const filteredItems = categoryItems.filter(item => {
    return !excludePatterns.some(pattern => pattern.test(item.title));
  });

  console.log(`Filtered to ${filteredItems.length} loot items\n`);

  // Fetch details for each item (with rate limiting)
  const items = [];
  let processed = 0;

  for (const item of filteredItems) {
    const details = await getItemDetails(item.title);

    if (details) {
      items.push({
        id: generateId(item.title),
        ...details
      });
    }

    processed++;
    if (processed % 20 === 0) {
      console.log(`Processed ${processed}/${filteredItems.length} items...`);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\nSuccessfully fetched details for ${items.length} items`);

  // Sort items by name
  items.sort((a, b) => a.name.localeCompare(b.name));

  // Output the items
  const outputPath = path.join(__dirname, '..', 'data', 'items-wiki.json');
  fs.writeFileSync(outputPath, JSON.stringify({ items }, null, 2));

  console.log(`\nSaved to ${outputPath}`);

  // Also output a simple list for reference
  console.log('\n--- Item List ---');
  items.slice(0, 30).forEach(item => {
    console.log(`${item.name} (${item.rarity}, ${item.category})`);
  });
  if (items.length > 30) {
    console.log(`... and ${items.length - 30} more items`);
  }
}

main().catch(console.error);
