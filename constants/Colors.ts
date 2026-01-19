// Arc Raiders UI Colors
// Based on actual in-game UI screenshots

// Primary accent - teal/turquoise used for selections and highlights
export const arcColors = {
  teal: '#2DD4BF',
  tealLight: '#5EEAD4',
  tealDark: '#14B8A6',

  // Gold/yellow for currency and special elements
  gold: '#EAB308',
  goldLight: '#FDE047',

  // Rarity colors matching game
  common: '#9CA3AF',
  uncommon: '#22C55E',  // Green
  rare: '#3B82F6',       // Blue
  epic: '#A855F7',       // Purple
  legendary: '#F97316',  // Orange
};

// Exported rarity colors for easy access
export const rarityColors = {
  common: arcColors.common,
  uncommon: arcColors.uncommon,
  rare: arcColors.rare,
  epic: arcColors.epic,
  legendary: arcColors.legendary,
};

// Dark backgrounds - matching game's dark UI
const backgroundColor = '#0D1117';  // Main dark background
const surfaceColor = '#161B22';     // Slightly lighter panels
const cardColor = '#1C2128';        // Card backgrounds
const panelColor = '#21262D';       // Elevated panels

export default {
  light: {
    text: '#1F2328',
    textSecondary: '#656D76',
    background: '#F6F8FA',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    panel: '#F3F4F6',
    tint: arcColors.teal,
    border: '#D0D7DE',
    tabIconDefault: '#8B949E',
    tabIconSelected: arcColors.teal,
    // Action colors
    sell: '#22C55E',     // Green - safe to sell
    recycle: '#EAB308',  // Yellow/gold - recycle
    keep: '#EF4444',     // Red - keep/important
    // Rarity colors
    common: arcColors.common,
    uncommon: arcColors.uncommon,
    rare: arcColors.rare,
    epic: arcColors.epic,
  },
  dark: {
    text: '#E6EDF3',
    textSecondary: '#8B949E',
    background: backgroundColor,
    surface: surfaceColor,
    card: cardColor,
    panel: panelColor,
    tint: arcColors.teal,
    border: '#30363D',
    tabIconDefault: '#484F58',
    tabIconSelected: arcColors.teal,
    // Action colors
    sell: '#22C55E',     // Green - safe to sell
    recycle: '#EAB308',  // Yellow/gold - recycle
    keep: '#EF4444',     // Red - keep/important
    // Rarity colors
    common: arcColors.common,
    uncommon: arcColors.uncommon,
    rare: arcColors.rare,
    epic: arcColors.epic,
  },
};
