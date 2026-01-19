import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useColorScheme } from './useColorScheme';
import Colors from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import type { WorkshopUpgrade } from '@/lib/types';

interface UpgradeCardProps {
  upgrade: WorkshopUpgrade;
  onItemPress?: (itemId: string) => void;
}

export function UpgradeCard({ upgrade, onItemPress }: UpgradeCardProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const [expanded, setExpanded] = useState(false);

  const getStationIcon = (station: string): React.ComponentProps<typeof FontAwesome>['name'] => {
    switch (station) {
      case 'gunsmith':
        return 'crosshairs';
      case 'gear_bench':
        return 'shield';
      case 'medical_lab':
        return 'medkit';
      case 'scrappy':
        return 'wrench';
      case 'explosives_station':
        return 'bomb';
      case 'refiner':
        return 'industry';
      case 'utility_station':
        return 'lightbulb-o';
      default:
        return 'cog';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: colors.tint }]}>
            <FontAwesome name={getStationIcon(upgrade.station)} size={16} color="#fff" />
          </View>
          <View>
            <Text style={[styles.name, { color: colors.text }]}>{upgrade.name}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {upgrade.requirements.length} items required
            </Text>
          </View>
        </View>
        <FontAwesome
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textSecondary}
        />
      </View>

      {expanded && (
        <View style={[styles.requirements, { borderTopColor: colors.border }]}>
          {upgrade.requirements.map((req, index) => (
            <TouchableOpacity
              key={`${req.itemId}-${index}`}
              style={styles.requirementRow}
              onPress={() => onItemPress?.(req.itemId)}
              disabled={!onItemPress}
            >
              <Text style={[styles.itemName, { color: colors.text }]}>{req.itemName}</Text>
              <Text style={[styles.quantity, { color: colors.tint }]}>x{req.quantity}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 4,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  requirements: {
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  itemName: {
    fontSize: 14,
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
  },
});
