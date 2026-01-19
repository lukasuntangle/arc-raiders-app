import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load JSON data
const itemsData = JSON.parse(readFileSync(join(__dirname, '../data/items.json'), 'utf8'));
const upgradesData = JSON.parse(readFileSync(join(__dirname, '../data/upgrades.json'), 'utf8'));
const attachmentsData = JSON.parse(readFileSync(join(__dirname, '../data/attachments.json'), 'utf8'));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedWorkshopStations() {
  console.log('Seeding workshop stations...');
  const stations = [
    { id: 'gunsmith', name: 'gunsmith', display_name: 'Gunsmith', sort_order: 1 },
    { id: 'gear_bench', name: 'gear_bench', display_name: 'Gear Bench', sort_order: 2 },
    { id: 'medical_lab', name: 'medical_lab', display_name: 'Medical Lab', sort_order: 3 },
    { id: 'scrappy', name: 'scrappy', display_name: 'Scrappy', sort_order: 4 },
    { id: 'explosives_station', name: 'explosives_station', display_name: 'Explosives Station', sort_order: 5 },
    { id: 'refiner', name: 'refiner', display_name: 'Refiner', sort_order: 6 },
    { id: 'utility_station', name: 'utility_station', display_name: 'Utility Station', sort_order: 7 },
  ];

  const { error } = await supabase.from('workshop_stations').upsert(stations);
  if (error) throw error;
  console.log(`  Seeded ${stations.length} workshop stations`);
}

async function seedItems() {
  console.log('Seeding items...');
  const items = itemsData.items.map((item) => ({
    id: item.id,
    name: item.name,
    rarity: item.rarity,
    category: item.category,
    action: item.action,
    keep_for_quest: item.keepForQuest || false,
    notes: item.notes || null,
  }));

  const { error } = await supabase.from('items').upsert(items);
  if (error) throw error;
  console.log(`  Seeded ${items.length} items`);
}

async function seedUpgrades() {
  console.log('Seeding upgrades...');
  const upgrades = upgradesData.upgrades.map((u) => ({
    id: u.id,
    name: u.name,
    station_id: u.station,
    level: u.level,
  }));

  const { error } = await supabase.from('upgrades').upsert(upgrades);
  if (error) throw error;
  console.log(`  Seeded ${upgrades.length} upgrades`);
}

async function seedUpgradeRequirements() {
  console.log('Seeding upgrade requirements...');
  const requirements = [];

  for (const upgrade of upgradesData.upgrades) {
    for (const req of upgrade.requirements) {
      requirements.push({
        upgrade_id: upgrade.id,
        item_id: req.itemId,
        quantity: req.quantity,
      });
    }
  }

  // Delete existing requirements first to avoid conflicts
  const { error: deleteError } = await supabase.from('upgrade_requirements').delete().neq('id', 0);
  if (deleteError) console.warn('Could not delete existing requirements:', deleteError.message);

  const { error } = await supabase.from('upgrade_requirements').insert(requirements);
  if (error) throw error;
  console.log(`  Seeded ${requirements.length} upgrade requirements`);
}

async function seedAttachments() {
  console.log('Seeding attachments...');
  const attachments = attachmentsData.attachments.map((a) => ({
    id: a.id,
    name: a.name,
    type: a.type,
    tier: a.tier,
    stats: a.stats,
  }));

  const { error } = await supabase.from('attachments').upsert(attachments);
  if (error) throw error;
  console.log(`  Seeded ${attachments.length} attachments`);
}

async function main() {
  console.log('Starting database seed...\n');

  try {
    // Order matters due to foreign key constraints
    await seedWorkshopStations();
    await seedItems();
    await seedUpgrades();
    await seedUpgradeRequirements();
    await seedAttachments();

    console.log('\n✓ Database seeded successfully!');
  } catch (error) {
    console.error('\nSeeding failed:', error);
    process.exit(1);
  }
}

main();
