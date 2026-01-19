import React, { useState } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { arcColors } from '@/constants/Colors';
import { useAttachmentsByType, useAttachmentTypesList } from '@/hooks/useAttachments';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import type { Attachment } from '@/lib/types';

export default function AttachmentsScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { attachments } = useAttachmentsByType(selectedType);
  const types = useAttachmentTypesList();

  const getTypeIcon = (type: string): React.ComponentProps<typeof FontAwesome>['name'] => {
    switch (type) {
      case 'grip':
        return 'hand-rock-o';
      case 'stock':
        return 'align-left';
      case 'barrel':
        return 'minus';
      case 'magazine':
        return 'database';
      case 'muzzle':
        return 'circle';
      case 'optic':
        return 'eye';
      default:
        return 'cog';
    }
  };

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 0:
        return colors.textSecondary;
      case 1:
        return arcColors.uncommon;
      case 2:
        return arcColors.rare;
      case 3:
        return arcColors.epic;
      default:
        return colors.textSecondary;
    }
  };

  const formatStatValue = (value: number | undefined, suffix: string = '%') => {
    if (value === undefined) return '-';
    const prefix = value > 0 ? '+' : '';
    return `${prefix}${value}${suffix}`;
  };

  const getStatColor = (value: number | undefined) => {
    if (value === undefined) return colors.textSecondary;
    return arcColors.teal;
  };

  const renderAttachmentCard = ({ item }: { item: Attachment }) => (
    <View style={[styles.attachmentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Tier indicator line */}
      <View style={[styles.tierIndicator, { backgroundColor: getTierColor(item.tier) }]} />

      <View style={styles.cardContent}>
        <View style={styles.attachmentHeader}>
          <View style={[styles.typeIcon, { backgroundColor: `${arcColors.teal}15`, borderColor: colors.border }]}>
            <FontAwesome name={getTypeIcon(item.type)} size={14} color={arcColors.teal} />
          </View>
          <View style={styles.attachmentInfo}>
            <Text style={[styles.attachmentName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.attachmentMeta, { color: colors.textSecondary }]}>
              TIER {item.tier} • {item.type.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {item.stats.horizontalRecoil !== undefined && item.stats.horizontalRecoil !== 0 && (
            <View style={[styles.statItem, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>H. RECOIL</Text>
              <Text style={[styles.statValue, { color: getStatColor(item.stats.horizontalRecoil) }]}>
                {formatStatValue(item.stats.horizontalRecoil)}
              </Text>
            </View>
          )}
          {item.stats.verticalRecoil !== undefined && item.stats.verticalRecoil !== 0 && (
            <View style={[styles.statItem, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>V. RECOIL</Text>
              <Text style={[styles.statValue, { color: getStatColor(item.stats.verticalRecoil) }]}>
                {formatStatValue(item.stats.verticalRecoil)}
              </Text>
            </View>
          )}
          {item.stats.bulletVelocity !== undefined && item.stats.bulletVelocity !== 0 && (
            <View style={[styles.statItem, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>VELOCITY</Text>
              <Text style={[styles.statValue, { color: getStatColor(item.stats.bulletVelocity) }]}>
                {formatStatValue(item.stats.bulletVelocity)}
              </Text>
            </View>
          )}
          {item.stats.noiseReduction !== undefined && item.stats.noiseReduction !== 0 && (
            <View style={[styles.statItem, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>NOISE</Text>
              <Text style={[styles.statValue, { color: getStatColor(item.stats.noiseReduction) }]}>
                {formatStatValue(item.stats.noiseReduction)}
              </Text>
            </View>
          )}
          {item.stats.perShotDispersion !== undefined && item.stats.perShotDispersion !== 0 && (
            <View style={[styles.statItem, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>DISPERSION</Text>
              <Text style={[styles.statValue, { color: getStatColor(item.stats.perShotDispersion) }]}>
                {formatStatValue(item.stats.perShotDispersion)}
              </Text>
            </View>
          )}
          {item.stats.recoilRecoveryTime !== undefined && item.stats.recoilRecoveryTime !== 0 && (
            <View style={[styles.statItem, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>RECOVERY</Text>
              <Text style={[styles.statValue, { color: getStatColor(item.stats.recoilRecoveryTime) }]}>
                {formatStatValue(item.stats.recoilRecoveryTime)}
              </Text>
            </View>
          )}
          {item.stats.dispersionRecoveryTime !== undefined && item.stats.dispersionRecoveryTime !== 0 && (
            <View style={[styles.statItem, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>DISP. REC.</Text>
              <Text style={[styles.statValue, { color: getStatColor(item.stats.dispersionRecoveryTime) }]}>
                {formatStatValue(item.stats.dispersionRecoveryTime)}
              </Text>
            </View>
          )}
          {item.stats.equipUnequipTime !== undefined && item.stats.equipUnequipTime !== 0 && (
            <View style={[styles.statItem, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>EQUIP</Text>
              <Text style={[styles.statValue, { color: getStatColor(item.stats.equipUnequipTime) }]}>
                {formatStatValue(item.stats.equipUnequipTime)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.titleMain, { color: arcColors.teal }]}>WEAPON</Text>
          <Text style={[styles.titleSub, { color: colors.text }]}>ATTACHMENTS</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          STATS & COMPARISON GUIDE
        </Text>
      </View>

      {/* Type Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: selectedType === null ? arcColors.teal : colors.card,
                borderColor: selectedType === null ? arcColors.teal : colors.border,
              },
            ]}
            onPress={() => setSelectedType(null)}
          >
            <Text style={[styles.filterText, { color: selectedType === null ? '#0D1117' : colors.text }]}>
              ALL
            </Text>
          </TouchableOpacity>
          {types.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: isSelected ? arcColors.teal : colors.card,
                    borderColor: isSelected ? arcColors.teal : colors.border,
                  },
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <FontAwesome
                  name={getTypeIcon(type.id)}
                  size={12}
                  color={isSelected ? '#0D1117' : colors.textSecondary}
                  style={styles.filterIcon}
                />
                <Text style={[styles.filterText, { color: isSelected ? '#0D1117' : colors.text }]}>
                  {type.label.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={attachments}
        keyExtractor={(item) => item.id}
        renderItem={renderAttachmentCard}
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
  attachmentCard: {
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 4,
    overflow: 'hidden',
  },
  tierIndicator: {
    height: 3,
    width: '100%',
  },
  cardContent: {
    padding: 12,
  },
  attachmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIcon: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 15,
    fontWeight: '500',
  },
  attachmentMeta: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  statItem: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statLabel: {
    fontSize: 9,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
