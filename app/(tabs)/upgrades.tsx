import React, { useState } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { arcColors } from '@/constants/Colors';
import { UpgradeCard } from '@/components/UpgradeCard';
import { useUpgradesByStation, useStationsList } from '@/hooks/useUpgrades';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function UpgradesScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const upgradesByStation = useUpgradesByStation();
  const stations = useStationsList();

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

  const filteredUpgrades = selectedStation
    ? upgradesByStation[selectedStation] || []
    : Object.values(upgradesByStation).flat();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.titleMain, { color: arcColors.teal }]}>WORKSHOP</Text>
          <Text style={[styles.titleSub, { color: colors.text }]}>UPGRADES</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          REQUIRED ITEMS PER STATION
        </Text>
      </View>

      {/* Station Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: null, label: 'ALL' }, ...stations.map(s => ({ ...s, label: s.label.toUpperCase() }))]}
          keyExtractor={(item) => item.id || 'all'}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isSelected = selectedStation === item.id;
            return (
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: isSelected ? arcColors.teal : colors.card,
                    borderColor: isSelected ? arcColors.teal : colors.border,
                  },
                ]}
                onPress={() => setSelectedStation(item.id)}
              >
                {item.id && (
                  <FontAwesome
                    name={getStationIcon(item.id)}
                    size={12}
                    color={isSelected ? '#0D1117' : colors.textSecondary}
                    style={styles.filterIcon}
                  />
                )}
                <Text
                  style={[
                    styles.filterText,
                    { color: isSelected ? '#0D1117' : colors.text },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <FlatList
        data={filteredUpgrades.sort((a, b) => {
          if (a.station !== b.station) {
            return a.station.localeCompare(b.station);
          }
          return a.level - b.level;
        })}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <UpgradeCard upgrade={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="inbox" size={40} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              NO UPGRADES FOUND
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  titleMain: {
    fontSize: 24,
    fontWeight: '700',
  },
  titleSub: {
    fontSize: 24,
    fontWeight: '300',
  },
  subtitle: {
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 4,
  },
  filterContainer: {
    paddingVertical: 8,
  },
  filterList: {
    paddingHorizontal: 12,
    gap: 6,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginHorizontal: 2,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '600',
  },
});
