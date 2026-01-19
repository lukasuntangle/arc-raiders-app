import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { arcColors } from '@/constants/Colors';
import { SearchBar } from '@/components/SearchBar';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import donorsData from '@/data/donors.json';
import itemsData from '@/data/items.json';

type Priority = 'essential' | 'core' | 'high_tier' | 'uncategorized';

interface DonorEntry {
  id: string;
  name: string;
  priority: Priority;
  bestDonors: string[];
}

const priorityConfig: Record<Priority, { label: string; color: string; order: number }> = {
  essential: { label: 'ESSENTIAL', color: arcColors.teal, order: 1 },
  core: { label: 'CORE', color: arcColors.gold, order: 2 },
  high_tier: { label: 'HIGH-TIER', color: '#A855F7', order: 3 },
  uncategorized: { label: 'OTHER', color: '#6B7280', order: 4 },
};

export default function DonorsScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');

  // Convert donors object to array
  const donorsList = useMemo(() => {
    return Object.entries(donorsData.donors).map(([id, data]) => ({
      id,
      ...(data as Omit<DonorEntry, 'id'>),
    }));
  }, []);

  // Create item lookup map
  const itemsMap = useMemo(() => {
    const map: Record<string, { name: string; rarity: string }> = {};
    itemsData.items.forEach((item) => {
      map[item.id] = { name: item.name, rarity: item.rarity };
    });
    return map;
  }, []);

  // Filter and sort donors
  const filteredDonors = useMemo(() => {
    let filtered = donorsList;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((d) => d.name.toLowerCase().includes(query));
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter((d) => d.priority === filterPriority);
    }

    return filtered.sort((a, b) => {
      const orderA = priorityConfig[a.priority]?.order || 99;
      const orderB = priorityConfig[b.priority]?.order || 99;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });
  }, [donorsList, searchQuery, filterPriority]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const renderDonorItem = useCallback(
    ({ item }: { item: DonorEntry }) => {
      const isExpanded = expandedId === item.id;
      const config = priorityConfig[item.priority];

      return (
        <TouchableOpacity
          style={[styles.donorCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.donorHeader}>
            <View style={styles.donorInfo}>
              <Text style={[styles.donorName, { color: colors.text }]}>{item.name}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: `${config.color}20` }]}>
                <Text style={[styles.priorityText, { color: config.color }]}>{config.label}</Text>
              </View>
            </View>
            <FontAwesome
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={colors.textSecondary}
            />
          </View>

          {isExpanded && (
            <View style={styles.donorsListContainer}>
              <Text style={[styles.donorsLabel, { color: colors.textSecondary }]}>
                RECYCLE THESE TO GET {item.name.toUpperCase()}:
              </Text>
              {item.bestDonors.map((donorId, index) => {
                const donorItem = itemsMap[donorId];
                return (
                  <View
                    key={donorId}
                    style={[styles.donorRow, { backgroundColor: colors.surface }]}
                  >
                    <View style={styles.donorRowLeft}>
                      <Text style={[styles.donorIndex, { color: arcColors.teal }]}>
                        {index + 1}.
                      </Text>
                      <Text style={[styles.donorItemName, { color: colors.text }]}>
                        {donorItem?.name || donorId.replace(/_/g, ' ')}
                      </Text>
                    </View>
                    {donorItem && (
                      <Text style={[styles.donorRarity, { color: colors.textSecondary }]}>
                        {donorItem.rarity.toUpperCase()}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [expandedId, colors, itemsMap, toggleExpand]
  );

  const keyExtractor = useCallback((item: DonorEntry) => item.id, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Best Donors</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          What to recycle to get components
        </Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search components..."
      />

      {/* Priority Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterPriority === 'all' && { backgroundColor: `${arcColors.teal}30` },
          ]}
          onPress={() => setFilterPriority('all')}
        >
          <Text
            style={[
              styles.filterText,
              { color: filterPriority === 'all' ? arcColors.teal : colors.textSecondary },
            ]}
          >
            ALL
          </Text>
        </TouchableOpacity>
        {(Object.keys(priorityConfig) as Priority[]).map((priority) => (
          <TouchableOpacity
            key={priority}
            style={[
              styles.filterButton,
              filterPriority === priority && { backgroundColor: `${priorityConfig[priority].color}30` },
            ]}
            onPress={() => setFilterPriority(priority)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    filterPriority === priority
                      ? priorityConfig[priority].color
                      : colors.textSecondary,
                },
              ]}
            >
              {priorityConfig[priority].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.countContainer}>
        <Text style={[styles.countText, { color: colors.textSecondary }]}>
          {filteredDonors.length} components
        </Text>
      </View>

      <FlatList
        data={filteredDonors}
        renderItem={renderDonorItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  filterText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  countContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  donorCard: {
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
    overflow: 'hidden',
  },
  donorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  donorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  donorName: {
    fontSize: 15,
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  donorsListContainer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  donorsLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  donorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
  donorRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  donorIndex: {
    fontSize: 13,
    fontWeight: '600',
    width: 20,
  },
  donorItemName: {
    fontSize: 14,
  },
  donorRarity: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
