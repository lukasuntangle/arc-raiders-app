import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { arcColors, rarityColors } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import lootData from '@/data/loot.json';

type LootItem = {
  id: string;
  name: string;
  rarity: string;
  recyclesInto: { material: string; quantity: number }[];
};

type MaterialDonor = {
  item: LootItem;
  quantity: number;
};

// Build a map of materials to their best donors
function buildMaterialDonorsMap(loot: LootItem[]): Map<string, MaterialDonor[]> {
  const map = new Map<string, MaterialDonor[]>();

  for (const item of loot) {
    for (const output of item.recyclesInto) {
      const donors = map.get(output.material) || [];
      donors.push({ item, quantity: output.quantity });
      map.set(output.material, donors);
    }
  }

  // Sort each material's donors by quantity (descending)
  for (const [material, donors] of map) {
    donors.sort((a, b) => b.quantity - a.quantity);
    map.set(material, donors);
  }

  return map;
}

// Get all unique materials sorted alphabetically
function getAllMaterials(loot: LootItem[]): string[] {
  const materials = new Set<string>();
  for (const item of loot) {
    for (const output of item.recyclesInto) {
      materials.add(output.material);
    }
  }
  return Array.from(materials).sort();
}

export default function DonorsScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMaterial, setExpandedMaterial] = useState<string | null>(null);

  const donorsMap = useMemo(
    () => buildMaterialDonorsMap(lootData.loot as LootItem[]),
    []
  );

  const allMaterials = useMemo(
    () => getAllMaterials(lootData.loot as LootItem[]),
    []
  );

  const filteredMaterials = useMemo(() => {
    if (!searchQuery.trim()) return allMaterials;
    const query = searchQuery.toLowerCase();
    return allMaterials.filter((m) => m.toLowerCase().includes(query));
  }, [allMaterials, searchQuery]);

  const getRarityColor = (rarity: string) => {
    return rarityColors[rarity as keyof typeof rarityColors] || colors.text;
  };

  const renderMaterialSection = ({ item: material }: { item: string }) => {
    const donors = donorsMap.get(material) || [];
    const isExpanded = expandedMaterial === material;
    const displayedDonors = isExpanded ? donors : donors.slice(0, 3);
    const hasMore = donors.length > 3;

    return (
      <View style={[styles.materialSection, { backgroundColor: colors.card }]}>
        <View style={styles.materialHeader}>
          <Text style={[styles.materialName, { color: colors.text }]}>
            {material}
          </Text>
          <Text style={[styles.donorCount, { color: colors.textSecondary }]}>
            {donors.length} source{donors.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <View style={styles.donorsList}>
          {displayedDonors.map((donor, index) => (
            <View
              key={donor.item.id}
              style={[
                styles.donorRow,
                index === 0 && styles.topDonor,
                { borderBottomColor: colors.border },
              ]}
            >
              <View style={styles.donorInfo}>
                {index === 0 && (
                  <FontAwesome
                    name="star"
                    size={12}
                    color={arcColors.gold}
                    style={styles.starIcon}
                  />
                )}
                <Text
                  style={[
                    styles.donorName,
                    { color: getRarityColor(donor.item.rarity) },
                  ]}
                >
                  {donor.item.name}
                </Text>
              </View>
              <View style={styles.quantityBadge}>
                <Text style={styles.quantityText}>×{donor.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        {hasMore && (
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() =>
              setExpandedMaterial(isExpanded ? null : material)
            }
          >
            <Text style={[styles.showMoreText, { color: arcColors.teal }]}>
              {isExpanded
                ? 'Show less'
                : `Show ${donors.length - 3} more`}
            </Text>
            <FontAwesome
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={12}
              color={arcColors.teal}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Best Donors</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          What to recycle to get specific materials
        </Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <FontAwesome
          name="search"
          size={16}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search materials..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <FontAwesome name="times-circle" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredMaterials}
        renderItem={renderMaterialSection}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No materials found
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
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  materialSection: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
  },
  materialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  materialName: {
    fontSize: 16,
    fontWeight: '600',
  },
  donorCount: {
    fontSize: 12,
  },
  donorsList: {
    gap: 6,
  },
  donorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  topDonor: {
    paddingLeft: 0,
  },
  donorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  starIcon: {
    marginRight: 6,
  },
  donorName: {
    fontSize: 14,
  },
  quantityBadge: {
    backgroundColor: arcColors.teal,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  quantityText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 6,
    gap: 6,
  },
  showMoreText: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
  },
});
