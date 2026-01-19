// Arc Raiders Item Types

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic';
export type ItemCategory = 'component' | 'attachment' | 'material' | 'consumable';
export type ItemAction = 'sell' | 'recycle' | 'keep';
export type WorkshopStation = 'gunsmith' | 'gear_bench' | 'medical_lab' | 'scrappy' | 'explosives_station' | 'refiner' | 'utility_station';
export type AttachmentType = 'grip' | 'stock' | 'barrel' | 'magazine' | 'muzzle' | 'optic';
export type WeaponType = 'light' | 'medium' | 'shotgun';

export interface Item {
  id: string;
  name: string;
  icon?: string;
  rarity: Rarity;
  category: ItemCategory;
  action: ItemAction;
  keepForQuest: boolean;
  usedInUpgrades: string[]; // upgrade IDs
  notes?: string;
}

export interface WorkshopUpgrade {
  id: string;
  name: string;
  station: WorkshopStation;
  level: number;
  requirements: UpgradeRequirement[];
}

export interface UpgradeRequirement {
  itemId: string;
  itemName: string;
  quantity: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: AttachmentType;
  tier: number;
  stats: AttachmentStats;
  magazineSizes?: MagazineSize[];
}

export interface AttachmentStats {
  horizontalRecoil?: number;    // percentage reduction
  verticalRecoil?: number;      // percentage reduction
  bulletVelocity?: number;      // percentage bonus
  noiseReduction?: number;      // percentage
  perShotDispersion?: number;   // percentage
  recoilRecoveryTime?: number;  // seconds change
  dispersionRecoveryTime?: number;
  equipUnequipTime?: number;
}

export interface MagazineSize {
  weaponType: WeaponType;
  capacity: number;
}

// Search result type
export interface SearchResult {
  item: Item;
  score: number;
}

// For Supabase
export interface Database {
  public: {
    Tables: {
      items: {
        Row: Item;
        Insert: Omit<Item, 'id'>;
        Update: Partial<Item>;
      };
      workshop_upgrades: {
        Row: WorkshopUpgrade;
        Insert: Omit<WorkshopUpgrade, 'id'>;
        Update: Partial<WorkshopUpgrade>;
      };
      attachments: {
        Row: Attachment;
        Insert: Omit<Attachment, 'id'>;
        Update: Partial<Attachment>;
      };
    };
  };
}
