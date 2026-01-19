import React, { useState, useCallback } from 'react';
import { StyleSheet, FlatList, View, Text, Modal, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { arcColors } from '@/constants/Colors';
import { SearchBar } from '@/components/SearchBar';
import { ItemCard } from '@/components/ItemCard';
import { ActionBadge } from '@/components/ActionBadge';
import { useItemSearch, useItemDetails } from '@/hooks/useItems';
import type { Item } from '@/lib/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function SearchScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const { results, isLoading } = useItemSearch(searchQuery);
  const { item: selectedItem, relatedUpgrades, actionColor, rarityColor } = useItemDetails(selectedItemId);

  const handleItemPress = useCallback((item: Item) => {
    setSelectedItemId(item.id);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedItemId(null);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: { item: Item; score: number } }) => (
      <ItemCard item={item.item} onPress={handleItemPress} showDetails />
    ),
    [handleItemPress]
  );

  const keyExtractor = useCallback((item: { item: Item; score: number }) => item.item.id, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.titleMain, { color: arcColors.teal }]}>ARC</Text>
          <Text style={[styles.titleSub, { color: colors.text }]}>RAIDERS</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          ITEM COMPANION
        </Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search items..."
      />

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.sell }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>SELL</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.recycle }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>RECYCLE</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.keep }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>KEEP</Text>
        </View>
      </View>

      <View style={styles.filterInfo}>
        <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
          {results.length} items {searchQuery ? `matching "${searchQuery}"` : ''}
        </Text>
      </View>

      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={10}
      />

      {/* Item Detail Modal */}
      <Modal
        visible={!!selectedItem}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.modalHandle} />

            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <FontAwesome name="times" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            {selectedItem && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    {selectedItem.name}
                  </Text>
                  <View style={styles.rarityRow}>
                    <View style={[styles.rarityIndicator, { backgroundColor: rarityColor }]} />
                    <Text style={[styles.modalCategory, { color: colors.textSecondary }]}>
                      {selectedItem.rarity.toUpperCase()} • {selectedItem.category.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionSection}>
                  <ActionBadge action={selectedItem.action} size="large" />
                </View>

                {selectedItem.keepForQuest && (
                  <View style={[styles.questWarning, { backgroundColor: `${arcColors.gold}15`, borderColor: arcColors.gold }]}>
                    <FontAwesome name="star" size={14} color={arcColors.gold} />
                    <Text style={[styles.questText, { color: arcColors.gold }]}>
                      KEEP FOR QUEST
                    </Text>
                  </View>
                )}

                {selectedItem.notes && (
                  <View style={[styles.notesSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.notesLabel, { color: colors.textSecondary }]}>NOTES</Text>
                    <Text style={[styles.notesText, { color: colors.text }]}>
                      {selectedItem.notes}
                    </Text>
                  </View>
                )}

                {relatedUpgrades.length > 0 && (
                  <View style={styles.upgradesSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                      USED IN UPGRADES
                    </Text>
                    {relatedUpgrades.map((upgrade) => {
                      const requirement = upgrade.requirements.find(
                        (r) => r.itemId === selectedItem.id
                      );
                      return (
                        <View
                          key={upgrade.id}
                          style={[styles.upgradeRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                        >
                          <View>
                            <Text style={[styles.upgradeName, { color: colors.text }]}>
                              {upgrade.name}
                            </Text>
                            <Text style={[styles.upgradeStation, { color: colors.textSecondary }]}>
                              {upgrade.station.replace(/_/g, ' ').toUpperCase()}
                            </Text>
                          </View>
                          <View style={[styles.quantityBadge, { backgroundColor: `${arcColors.teal}20` }]}>
                            <Text style={[styles.upgradeQuantity, { color: arcColors.teal }]}>
                              ×{requirement?.quantity || '?'}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
    fontSize: 28,
    fontWeight: '700',
  },
  titleSub: {
    fontSize: 28,
    fontWeight: '300',
  },
  subtitle: {
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 4,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  filterInfo: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  resultCount: {
    fontSize: 12,
  },
  listContent: {
    paddingBottom: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#30363D',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  rarityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  rarityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  modalCategory: {
    fontSize: 11,
    letterSpacing: 1,
  },
  actionSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  questWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    gap: 8,
  },
  questText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  notesSection: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 6,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  upgradesSection: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
  },
  upgradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  upgradeName: {
    fontSize: 14,
    fontWeight: '500',
  },
  upgradeStation: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 1,
  },
  quantityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  upgradeQuantity: {
    fontSize: 14,
    fontWeight: '600',
  },
});
