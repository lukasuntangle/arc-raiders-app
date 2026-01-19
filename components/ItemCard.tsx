import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useColorScheme } from './useColorScheme';
import Colors, { arcColors } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import type { Item } from '@/lib/types';

interface ItemCardProps {
  item: Item;
  onPress: (item: Item) => void;
  showDetails?: boolean;
}

export function ItemCard({ item, onPress, showDetails = false }: ItemCardProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const actionColor = colors[item.action] || colors.textSecondary;
  const rarityColor = colors[item.rarity] || colors.common;

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'sell':
        return 'SELL';
      case 'recycle':
        return 'RECYCLE';
      case 'keep':
        return 'KEEP';
      default:
        return action.toUpperCase();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      {/* Side indicator with action color */}
      <View style={[styles.sideIndicator, { backgroundColor: actionColor }]} />

      <View style={styles.content}>
        <View style={styles.leftContent}>
          {/* Rarity dot */}
          <View style={[styles.rarityDot, { backgroundColor: rarityColor }]} />

          <View style={styles.textContent}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            {showDetails && (
              <Text style={[styles.category, { color: colors.textSecondary }]}>
                {item.category.toUpperCase()}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.rightContent}>
          {item.keepForQuest && (
            <View style={[styles.badge, { backgroundColor: `${arcColors.gold}15` }]}>
              <FontAwesome name="star" size={10} color={arcColors.gold} />
            </View>
          )}
          {item.usedInUpgrades.length > 0 && (
            <View style={[styles.badge, { backgroundColor: `${arcColors.teal}15` }]}>
              <FontAwesome name="wrench" size={10} color={arcColors.teal} />
              <Text style={[styles.badgeText, { color: arcColors.teal }]}>{item.usedInUpgrades.length}</Text>
            </View>
          )}
          <View style={[styles.actionBadge, { backgroundColor: actionColor }]}>
            <Text style={styles.actionText}>{getActionLabel(item.action)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  sideIndicator: {
    width: 3,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
  },
  category: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  actionText: {
    color: '#0D1117',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
