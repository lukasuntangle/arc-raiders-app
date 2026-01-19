import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  Pressable,
} from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { arcColors } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { keyLocations, getAllLocations, getKeysByLocation, KeyLocation } from '@/assets/images/keys';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function KeysScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<KeyLocation | null>(null);

  const locations = useMemo(() => getAllLocations(), []);
  const filteredKeys = useMemo(
    () => getKeysByLocation(selectedLocation),
    [selectedLocation]
  );

  const getLocationColor = (location: string) => {
    switch (location) {
      case 'Blue Gate':
        return '#4A90D9';
      case 'Buried City':
        return '#D97B4A';
      case 'Dam Battlegrounds':
        return '#5AAD5A';
      case 'Spaceport':
        return '#9B59B6';
      case 'Stella Montis':
        return '#E74C3C';
      default:
        return arcColors.teal;
    }
  };

  const renderFilterChips = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterContainer}
    >
      <TouchableOpacity
        style={[
          styles.filterChip,
          !selectedLocation && styles.filterChipActive,
          { borderColor: colors.border },
        ]}
        onPress={() => setSelectedLocation(null)}
      >
        <Text
          style={[
            styles.filterChipText,
            { color: !selectedLocation ? '#000' : colors.text },
          ]}
        >
          All ({keyLocations.length})
        </Text>
      </TouchableOpacity>

      {locations.map((location) => {
        const count = keyLocations.filter((k) => k.location === location).length;
        const isActive = selectedLocation === location;
        const locationColor = getLocationColor(location);

        return (
          <TouchableOpacity
            key={location}
            style={[
              styles.filterChip,
              isActive && { backgroundColor: locationColor, borderColor: locationColor },
              !isActive && { borderColor: colors.border },
            ]}
            onPress={() => setSelectedLocation(isActive ? null : location)}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: isActive ? '#000' : colors.text },
              ]}
            >
              {location} ({count})
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderKeyCard = (keyItem: KeyLocation) => {
    const locationColor = getLocationColor(keyItem.location);

    return (
      <TouchableOpacity
        key={keyItem.id}
        style={[styles.keyCard, { backgroundColor: colors.card }]}
        onPress={() => setZoomedImage(keyItem)}
        activeOpacity={0.8}
      >
        <View style={styles.cardImageContainer}>
          <Image source={keyItem.image} style={styles.cardImage} resizeMode="cover" />
          <View style={styles.zoomHint}>
            <FontAwesome name="search-plus" size={16} color="#fff" />
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={[styles.locationBadge, { backgroundColor: locationColor }]}>
            <FontAwesome name="map-marker" size={10} color="#fff" style={styles.locationIcon} />
            <Text style={styles.locationText}>{keyItem.location}</Text>
          </View>
          <Text style={[styles.keyName, { color: colors.text }]}>{keyItem.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderZoomModal = () => (
    <Modal
      visible={zoomedImage !== null}
      transparent
      animationType="fade"
      onRequestClose={() => setZoomedImage(null)}
    >
      <Pressable style={styles.modalOverlay} onPress={() => setZoomedImage(null)}>
        <View style={styles.modalContent}>
          {zoomedImage && (
            <>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalLocation}>{zoomedImage.location}</Text>
                  <Text style={styles.modalTitle}>{zoomedImage.name}</Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setZoomedImage(null)}
                >
                  <FontAwesome name="times" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <Pressable onPress={(e) => e.stopPropagation()}>
                <Image
                  source={zoomedImage.image}
                  style={styles.zoomedImage}
                  resizeMode="contain"
                />
              </Pressable>

              <Text style={styles.modalHint}>Tap outside to close</Text>
            </>
          )}
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Key Locations</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Screenshots showing where to use each key
        </Text>
      </View>

      {renderFilterChips()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.cardsContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredKeys.map(renderKeyCard)}
      </ScrollView>

      {renderZoomModal()}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: arcColors.teal,
    borderColor: arcColors.teal,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 16,
  },
  keyCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImageContainer: {
    position: 'relative',
    aspectRatio: 16 / 9,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  zoomHint: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    padding: 12,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  keyName: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  modalLocation: {
    color: arcColors.teal,
    fontSize: 14,
    fontWeight: '500',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
  },
  closeButton: {
    padding: 8,
  },
  zoomedImage: {
    width: screenWidth - 32,
    height: screenHeight * 0.6,
  },
  modalHint: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    marginTop: 16,
  },
});
