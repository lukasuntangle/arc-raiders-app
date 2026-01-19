// Key location images - screenshots showing where to use each key

export type KeyLocation = {
  id: string;
  name: string;
  location: string;
  image: any;
};

export const keyLocations: KeyLocation[] = [
  // Blue Gate
  {
    id: 'blue_gate_cellar',
    name: 'Cellar Key',
    location: 'Blue Gate',
    image: require('./Blue Gate - Cellar Key.png'),
  },
  {
    id: 'blue_gate_communication_tower',
    name: 'Communication Tower Key',
    location: 'Blue Gate',
    image: require('./Blue Gate - Communication Tower Key.png'),
  },
  {
    id: 'blue_gate_confiscation_room',
    name: 'Confiscation Room Key',
    location: 'Blue Gate',
    image: require('./Blue Gate - Confiscation Room Key.png'),
  },
  {
    id: 'blue_gate_village',
    name: 'Village Key',
    location: 'Blue Gate',
    image: require('./Blue Gate - Village Key.png'),
  },

  // Buried City
  {
    id: 'buried_city_hospital',
    name: 'Hospital Room',
    location: 'Buried City',
    image: require('./Buried City - Hospital Room.png'),
  },
  {
    id: 'buried_city_residential',
    name: 'Residential Master Key',
    location: 'Buried City',
    image: require('./Buried City - Residential Master Key.png'),
  },
  {
    id: 'buried_city_town_hall',
    name: 'Town Hall Key',
    location: 'Buried City',
    image: require('./Buried City - Town Hall Key.png'),
  },
  {
    id: 'buried_city_jkv',
    name: 'JKV Employee Access Door',
    location: 'Buried City',
    image: require('./Burried City - JKV Employee Access Door.png'),
  },

  // Dam Battlegrounds
  {
    id: 'dam_staff_room',
    name: 'Staff Room',
    location: 'Dam Battlegrounds',
    image: require('./Dam Battlegrounds - Staff Room.png'),
  },
  {
    id: 'dam_surveillance',
    name: 'Surveillance Room',
    location: 'Dam Battlegrounds',
    image: require('./Dam Battlegrounds - Surveilance Room.png'),
  },
  {
    id: 'dam_testing_annex',
    name: 'Testing Annex',
    location: 'Dam Battlegrounds',
    image: require('./Dam Battlegrounds - Testing Annex locked door.png'),
  },
  {
    id: 'dam_control_center',
    name: 'Control Center',
    location: 'Dam Battlegrounds',
    image: require('./Dam Battlegrounds - control center.png'),
  },

  // Spaceport
  {
    id: 'spaceport_container_storage',
    name: 'Container Storage Key',
    location: 'Spaceport',
    image: require('./Spaceport - Container Storage Key.png'),
  },
  {
    id: 'spaceport_control_tower',
    name: 'Control Tower Key',
    location: 'Spaceport',
    image: require('./Spaceport - Control Tower Key.png'),
  },
  {
    id: 'spaceport_trench_tower',
    name: 'South Trench Tower',
    location: 'Spaceport',
    image: require('./Spaceport - South Trench Tower.png'),
  },
  {
    id: 'spaceport_warehouse',
    name: 'Warehouse Key',
    location: 'Spaceport',
    image: require('./Spaceport - Warehouse Key.png'),
  },

  // Stella Montis
  {
    id: 'stella_montis_admin',
    name: 'Admin Key',
    location: 'Stella Montis',
    image: require('./Stella Montis - Admin Key.png'),
  },
  {
    id: 'stella_montis_medical_vault',
    name: 'Medical Vault Key',
    location: 'Stella Montis',
    image: require('./Stella Montis - Medical Vault Key.png'),
  },
  {
    id: 'stella_montis_security',
    name: 'Security Checkpoint',
    location: 'Stella Montis',
    image: require('./Stella Montis - Security Checkpoint.png'),
  },
  {
    id: 'stella_montis_storage',
    name: 'Storage',
    location: 'Stella Montis',
    image: require('./Stella Montis - Storage.png'),
  },
];

// Get all unique locations
export const getAllLocations = (): string[] => {
  const locations = new Set<string>();
  keyLocations.forEach(key => locations.add(key.location));
  return Array.from(locations).sort();
};

// Get keys filtered by location
export const getKeysByLocation = (location: string | null): KeyLocation[] => {
  if (!location) return keyLocations;
  return keyLocations.filter(key => key.location === location);
};
