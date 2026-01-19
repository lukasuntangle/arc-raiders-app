import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { arcColors, rarityColors } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import itemsData from '@/data/items.json';
import { getItemImage } from '@/assets/images/items';

type RecycleOutput = {
  material: string;
  quantity: number;
};

type Item = {
  id: string;
  name: string;
  rarity: string;
  category: string;
  action: string;
  recycleTo?: RecycleOutput[] | null;
};

type MaterialDonor = {
  item: Item;
  quantity: number;
};

// Build a map of materials to their best donors
function buildMaterialDonorsMap(items: Item[]): Map<string, MaterialDonor[]> {
  const map = new Map<string, MaterialDonor[]>();

  for (const item of items) {
    if (!item.recycleTo) continue;

    for (const output of item.recycleTo) {
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
function getAllMaterials(items: Item[]): string[] {
  const materials = new Set<string>();
  for (const item of items) {
    if (!item.recycleTo) continue;
    for (const output of item.recycleTo) {
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
    () => buildMaterialDonorsMap(itemsData.items as Item[]),
    []
  );

  const allMaterials = useMemo(
    () => getAllMaterials(itemsData.items as Item[]),
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

  const renderDonorItem = (donor: MaterialDonor, index: number) => {
    const itemImage = getItemImage(donor.item.id);

    return (
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
          {itemImage ? (
            <Image source={itemImage} style={styles.donorImage} />
          ) : (
            <View style={[styles.rarityDot, { backgroundColor: getRarityColor(donor.item.rarity) }]} />
          )}
          <Text
            style={[
              styles.donorName,
              { color: getRarityColor(donor.item.rarity) },
            ]}
            numberOfLines={1}
          >
            {donor.item.name}
          </Text>
        </View>
        <View style={styles.quantityBadge}>
          <Text style={styles.quantityText}>×{donor.quantity}</Text>
        </View>
      </View>
    );
  };

  const renderMaterialSection = ({ item: material }: { item: string }) => {
    const donors = donorsMap.get(material) || [];
    const isExpanded = expandedMaterial === material;
    const displayedDonors = isExpanded ? donors : donors.slice(0, 3);
    const hasMore = donors.length > 3;

    // Calculate total quantity from all donors
    const totalQuantity = donors.reduce((sum, d) => sum + d.quantity, 0);

    return (
      <View style={[styles.materialSection, { backgroundColor: colors.card }]}>
        <View style={styles.materialHeader}>
          <Text style={[styles.materialName, { color: colors.text }]}>
            {material}
          </Text>
          <View style={styles.materialStats}>
            <Text style={[styles.donorCount, { color: colors.textSecondary }]}>
              {donors.length} source{donors.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        <View style={styles.donorsList}>
          {displayedDonors.map((donor, index) => renderDonorItem(donor, index))}
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
          Search for a material to see what items recycle into it
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
          placeholder="Search materials (e.g. Plastic Parts)..."
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
            <FontAwesome name="recycle" size={48} color={colors.textSecondary} style={styles.emptyIcon} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No materials found
            </Text>
            <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>
              Try searching for "Metal Parts" or "Chemicals"
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
  materialStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  donorImage: {
    width: 28,
    height: 28,
    borderRadius: 4,
    marginRight: 8,
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  donorName: {
    fontSize: 14,
    flex: 1,
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
    paddingVertical: 60,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyHint: {
    fontSize: 13,
    marginTop: 4,
  },
});
